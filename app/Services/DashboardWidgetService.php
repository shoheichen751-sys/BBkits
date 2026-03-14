<?php

namespace App\Services;

use App\Models\Material;
use App\Models\Thread;
use App\Models\Sale;
use App\Models\Product;
use App\Models\InventoryTransaction;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardWidgetService
{
    /**
     * Get low stock alerts for materials and threads.
     */
    public function getLowStockAlerts(): array
    {
        // Materials with low stock
        $lowStockMaterials = Material::where('is_active', true)
            ->whereRaw('current_stock <= minimum_stock')
            ->orderByRaw('current_stock / NULLIF(minimum_stock, 0) ASC')
            ->limit(10)
            ->get()
            ->map(fn($m) => [
                'id' => $m->id,
                'type' => 'material',
                'name' => $m->name,
                'current_stock' => $m->current_stock,
                'reorder_point' => $m->minimum_stock,
                'unit' => $m->unit,
                'severity' => $m->current_stock <= 0 ? 'critical' : ($m->current_stock <= $m->minimum_stock * 0.5 ? 'high' : 'medium'),
            ]);

        // Threads with low stock
        $lowStockThreads = Thread::where('is_active', true)
            ->whereRaw('spool_count <= minimum_spools')
            ->orderByRaw('spool_count / NULLIF(minimum_spools, 0) ASC')
            ->limit(10)
            ->get()
            ->map(fn($t) => [
                'id' => $t->id,
                'type' => 'thread',
                'name' => $t->name,
                'current_stock' => $t->spool_count,
                'reorder_point' => $t->minimum_spools,
                'unit' => 'carretéis',
                'thread_type' => $t->type,
                'severity' => $t->spool_count <= 0 ? 'critical' : ($t->spool_count <= $t->minimum_spools * 0.5 ? 'high' : 'medium'),
            ]);

        $allAlerts = $lowStockMaterials->merge($lowStockThreads)
            ->sortBy(fn($item) => $item['severity'] === 'critical' ? 0 : ($item['severity'] === 'high' ? 1 : 2))
            ->values()
            ->take(15);

        return [
            'alerts' => $allAlerts,
            'total_count' => $lowStockMaterials->count() + $lowStockThreads->count(),
            'critical_count' => $allAlerts->where('severity', 'critical')->count(),
            'materials_count' => $lowStockMaterials->count(),
            'threads_count' => $lowStockThreads->count(),
        ];
    }

    /**
     * Get purchase suggestions based on stock levels and consumption.
     */
    public function getPurchaseSuggestions(): array
    {
        $historyDays = 30;

        // Calculate average daily consumption
        $consumption = InventoryTransaction::where('type', 'consumption')
            ->where('created_at', '>=', now()->subDays($historyDays))
            ->select(
                'material_id',
                DB::raw('SUM(ABS(quantity)) / ' . $historyDays . ' as avg_daily')
            )
            ->groupBy('material_id')
            ->pluck('avg_daily', 'material_id');

        $suggestions = Material::where('is_active', true)
            ->whereRaw('current_stock <= minimum_stock')
            ->with('supplier')
            ->get()
            ->map(function ($material) use ($consumption) {
                $avgDaily = $consumption[$material->id] ?? 0;
                $daysUntilStockout = $avgDaily > 0 ? floor($material->current_stock / $avgDaily) : null;
                $suggestedQuantity = max(
                    $material->minimum_stock * 2 - $material->current_stock,
                    $avgDaily * 14 // 2 weeks supply
                );

                return [
                    'material_id' => $material->id,
                    'name' => $material->name,
                    'current_stock' => $material->current_stock,
                    'reorder_point' => $material->minimum_stock,
                    'suggested_quantity' => ceil($suggestedQuantity),
                    'unit' => $material->unit,
                    'supplier' => $material->supplier?->name,
                    'estimated_cost' => ceil($suggestedQuantity) * ($material->purchase_price ?? 0),
                    'days_until_stockout' => $daysUntilStockout,
                    'urgency' => $daysUntilStockout !== null && $daysUntilStockout <= 3 ? 'urgent' : 'normal',
                ];
            })
            ->sortBy('days_until_stockout')
            ->values()
            ->take(10);

        return [
            'suggestions' => $suggestions,
            'total_estimated_cost' => $suggestions->sum('estimated_cost'),
            'urgent_count' => $suggestions->where('urgency', 'urgent')->count(),
        ];
    }

    /**
     * Get production status overview.
     */
    public function getProductionStatus(): array
    {
        $today = Carbon::today();
        $thisWeek = Carbon::now()->startOfWeek();
        $thisMonth = Carbon::now()->startOfMonth();

        // Orders by status
        $ordersByStatus = Sale::whereIn('status', ['pendente', 'aprovado', 'em_producao', 'finalizado', 'enviado'])
            ->select('status', DB::raw('COUNT(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status');

        // Recent orders
        $recentOrders = Sale::with('saleProducts.product')
            ->whereIn('status', ['pendente', 'aprovado', 'em_producao'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(fn($sale) => [
                'id' => $sale->id,
                'client' => $sale->client_name,
                'status' => $sale->status,
                'products_count' => $sale->saleProducts->count(),
                'total' => $sale->total_amount,
                'created_at' => $sale->created_at->diffForHumans(),
            ]);

        // Weekly stats
        $weeklyCompleted = Sale::where('status', 'finalizado')
            ->where('updated_at', '>=', $thisWeek)
            ->count();

        $monthlyCompleted = Sale::where('status', 'finalizado')
            ->where('updated_at', '>=', $thisMonth)
            ->count();

        return [
            'by_status' => [
                'pending' => $ordersByStatus['pendente'] ?? 0,
                'approved' => $ordersByStatus['aprovado'] ?? 0,
                'in_production' => $ordersByStatus['em_producao'] ?? 0,
                'completed' => $ordersByStatus['finalizado'] ?? 0,
                'shipped' => $ordersByStatus['enviado'] ?? 0,
            ],
            'recent_orders' => $recentOrders,
            'stats' => [
                'weekly_completed' => $weeklyCompleted,
                'monthly_completed' => $monthlyCompleted,
                'total_pending' => ($ordersByStatus['pendente'] ?? 0) + ($ordersByStatus['aprovado'] ?? 0) + ($ordersByStatus['em_producao'] ?? 0),
            ],
        ];
    }

    /**
     * Get thread inventory overview.
     */
    public function getThreadInventory(): array
    {
        $standardThreads = Thread::where('type', 'standard')->where('is_active', true);
        $specialtyThreads = Thread::where('type', 'specialty')->where('is_active', true);

        // Standard summary
        $standardSummary = [
            'count' => $standardThreads->count(),
            'total_spools' => $standardThreads->sum('spool_count'),
            'total_meters' => $standardThreads->sum('meters_remaining'),
            'low_stock' => (clone $standardThreads)->whereRaw('spool_count <= minimum_spools')->count(),
        ];

        // Specialty summary
        $specialtySummary = [
            'count' => $specialtyThreads->count(),
            'total_spools' => $specialtyThreads->sum('spool_count'),
            'total_meters' => $specialtyThreads->sum('meters_remaining'),
            'low_stock' => (clone $specialtyThreads)->whereRaw('spool_count <= minimum_spools')->count(),
        ];

        // Most used threads this month
        $topThreads = DB::table('thread_transactions')
            ->join('threads', 'thread_transactions.thread_id', '=', 'threads.id')
            ->where('thread_transactions.type', 'consumption')
            ->where('thread_transactions.created_at', '>=', now()->startOfMonth())
            ->select(
                'threads.id',
                'threads.name',
                'threads.type',
                'threads.hex_code',
                DB::raw('SUM(ABS(thread_transactions.meters_quantity)) as total_meters')
            )
            ->groupBy('threads.id', 'threads.name', 'threads.type', 'threads.hex_code')
            ->orderByDesc('total_meters')
            ->limit(5)
            ->get();

        return [
            'standard' => $standardSummary,
            'specialty' => $specialtySummary,
            'top_threads' => $topThreads,
            'total_value' => Thread::where('is_active', true)->sum(DB::raw('spool_count * purchase_price')),
        ];
    }

    /**
     * Get cost trends data for charts.
     */
    public function getCostTrends(): array
    {
        $days = 30;
        $startDate = now()->subDays($days);

        // Daily material costs
        $dailyCosts = InventoryTransaction::where('type', 'consumption')
            ->where('created_at', '>=', $startDate)
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(ABS(quantity) * unit_cost) as total_cost')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->pluck('total_cost', 'date');

        // Fill in missing dates with 0
        $trendData = collect();
        for ($i = $days; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $trendData->push([
                'date' => $date,
                'cost' => $dailyCosts[$date] ?? 0,
            ]);
        }

        // Calculate averages and trends
        $avgDaily = $trendData->avg('cost');
        $lastWeek = $trendData->slice(-7)->avg('cost');
        $previousWeek = $trendData->slice(-14, 7)->avg('cost');
        $trend = $previousWeek > 0 ? (($lastWeek - $previousWeek) / $previousWeek) * 100 : 0;

        return [
            'daily_data' => $trendData,
            'summary' => [
                'total_period' => $trendData->sum('cost'),
                'average_daily' => round($avgDaily, 2),
                'last_7_days' => round($lastWeek * 7, 2),
                'trend_percent' => round($trend, 1),
                'trend_direction' => $trend > 0 ? 'up' : ($trend < 0 ? 'down' : 'stable'),
            ],
        ];
    }

    /**
     * Get all widget data in a single call.
     */
    public function getAllWidgetData(): array
    {
        return [
            'low_stock_alerts' => $this->getLowStockAlerts(),
            'purchase_suggestions' => $this->getPurchaseSuggestions(),
            'production_status' => $this->getProductionStatus(),
            'thread_inventory' => $this->getThreadInventory(),
            'cost_trends' => $this->getCostTrends(),
        ];
    }
}
