<?php

namespace App\Services;

use App\Models\Material;
use App\Models\Thread;
use App\Models\InventoryTransaction;
use App\Models\ThreadTransaction;
use App\Models\Sale;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class AdvancedReportService
{
    /**
     * Get consumption trends over time.
     */
    public function getConsumptionTrends(array $filters = []): array
    {
        $from = Carbon::parse($filters['from'] ?? now()->subMonths(3));
        $to = Carbon::parse($filters['to'] ?? now());
        $groupBy = $filters['group_by'] ?? 'daily';

        // Material consumption
        $materialConsumption = InventoryTransaction::where('type', 'consumption')
            ->whereBetween('created_at', [$from, $to])
            ->select(
                DB::raw($this->getDateGroupSql('created_at', $groupBy) . ' as period'),
                DB::raw('SUM(ABS(quantity)) as total_quantity'),
                DB::raw('SUM(ABS(quantity) * unit_cost) as total_cost'),
                DB::raw('COUNT(DISTINCT material_id) as materials_count')
            )
            ->groupBy('period')
            ->orderBy('period')
            ->get();

        // Thread consumption
        $threadConsumption = ThreadTransaction::where('type', 'consumption')
            ->whereBetween('created_at', [$from, $to])
            ->select(
                DB::raw($this->getDateGroupSql('created_at', $groupBy) . ' as period'),
                DB::raw('SUM(ABS(meters_quantity)) as total_meters'),
                DB::raw('COUNT(DISTINCT thread_id) as threads_count')
            )
            ->groupBy('period')
            ->orderBy('period')
            ->get();

        // Calculate averages and trends
        $avgMaterialCost = $materialConsumption->avg('total_cost') ?? 0;
        $lastPeriodCost = $materialConsumption->last()['total_cost'] ?? 0;
        $trend = $avgMaterialCost > 0 ? (($lastPeriodCost - $avgMaterialCost) / $avgMaterialCost) * 100 : 0;

        return [
            'period' => [
                'from' => $from->format('Y-m-d'),
                'to' => $to->format('Y-m-d'),
                'group_by' => $groupBy,
            ],
            'material_consumption' => $materialConsumption,
            'thread_consumption' => $threadConsumption,
            'summary' => [
                'total_material_cost' => $materialConsumption->sum('total_cost'),
                'total_periods' => $materialConsumption->count(),
                'average_period_cost' => $avgMaterialCost,
                'trend_percent' => round($trend, 1),
                'trend_direction' => $trend > 0 ? 'up' : ($trend < 0 ? 'down' : 'stable'),
            ],
        ];
    }

    /**
     * Get cost analysis breakdown.
     */
    public function getCostAnalysis(array $filters = []): array
    {
        $from = Carbon::parse($filters['from'] ?? now()->subMonth());
        $to = Carbon::parse($filters['to'] ?? now());

        // Cost by material category
        $costByCategory = Material::join('material_categories', 'materials.category_id', '=', 'material_categories.id')
            ->select(
                'material_categories.name as category',
                DB::raw('SUM(materials.current_stock * materials.purchase_price) as inventory_value'),
                DB::raw('COUNT(materials.id) as materials_count')
            )
            ->groupBy('material_categories.id', 'material_categories.name')
            ->orderByDesc('inventory_value')
            ->get();

        // Consumption cost by category
        $consumptionByCategory = InventoryTransaction::where('inventory_transactions.type', 'consumption')
            ->whereBetween('inventory_transactions.created_at', [$from, $to])
            ->join('materials', 'inventory_transactions.material_id', '=', 'materials.id')
            ->join('material_categories', 'materials.category_id', '=', 'material_categories.id')
            ->select(
                'material_categories.name as category',
                DB::raw('SUM(ABS(inventory_transactions.quantity) * inventory_transactions.unit_cost) as consumption_cost')
            )
            ->groupBy('material_categories.id', 'material_categories.name')
            ->orderByDesc('consumption_cost')
            ->get();

        // Top 10 most expensive materials in consumption
        $topExpensiveMaterials = InventoryTransaction::where('inventory_transactions.type', 'consumption')
            ->whereBetween('inventory_transactions.created_at', [$from, $to])
            ->join('materials', 'inventory_transactions.material_id', '=', 'materials.id')
            ->select(
                'materials.id',
                'materials.name',
                DB::raw('SUM(ABS(inventory_transactions.quantity) * inventory_transactions.unit_cost) as total_cost'),
                DB::raw('SUM(ABS(inventory_transactions.quantity)) as total_quantity')
            )
            ->groupBy('materials.id', 'materials.name')
            ->orderByDesc('total_cost')
            ->limit(10)
            ->get();

        // Total inventory value
        $totalInventoryValue = Material::sum(DB::raw('current_stock * purchase_price'));

        return [
            'period' => [
                'from' => $from->format('Y-m-d'),
                'to' => $to->format('Y-m-d'),
            ],
            'inventory_value' => [
                'total' => $totalInventoryValue,
                'by_category' => $costByCategory,
            ],
            'consumption' => [
                'total' => $consumptionByCategory->sum('consumption_cost'),
                'by_category' => $consumptionByCategory,
                'top_materials' => $topExpensiveMaterials,
            ],
        ];
    }

    /**
     * Get usage forecasting.
     */
    public function getForecast(array $filters = []): array
    {
        $forecastDays = $filters['forecast_days'] ?? 30;
        $historyDays = $filters['history_days'] ?? 90;

        $historyFrom = now()->subDays($historyDays);

        // Get average daily consumption per material
        $dailyConsumption = InventoryTransaction::where('type', 'consumption')
            ->where('created_at', '>=', $historyFrom)
            ->select(
                'material_id',
                DB::raw('SUM(ABS(quantity)) / ' . $historyDays . ' as avg_daily_consumption')
            )
            ->groupBy('material_id')
            ->get()
            ->keyBy('material_id');

        // Get materials with their current stock
        $materials = Material::where('is_active', true)
            ->get()
            ->map(function ($material) use ($dailyConsumption, $forecastDays) {
                $avgDaily = $dailyConsumption[$material->id]->avg_daily_consumption ?? 0;
                $forecastedConsumption = $avgDaily * $forecastDays;
                $daysUntilStockout = $avgDaily > 0
                    ? floor($material->current_stock / $avgDaily)
                    : null;

                return [
                    'material_id' => $material->id,
                    'name' => $material->name,
                    'current_stock' => $material->current_stock,
                    'unit' => $material->unit,
                    'avg_daily_consumption' => round($avgDaily, 2),
                    'forecasted_consumption' => round($forecastedConsumption, 2),
                    'forecasted_remaining' => round($material->current_stock - $forecastedConsumption, 2),
                    'days_until_stockout' => $daysUntilStockout,
                    'risk_level' => $this->calculateRiskLevel($daysUntilStockout, $forecastDays),
                    'reorder_point' => $material->minimum_stock,
                    'needs_reorder' => $daysUntilStockout !== null && $daysUntilStockout <= $forecastDays,
                ];
            })
            ->filter(fn($m) => $m['avg_daily_consumption'] > 0)
            ->sortBy('days_until_stockout')
            ->values();

        return [
            'parameters' => [
                'forecast_days' => $forecastDays,
                'history_days' => $historyDays,
            ],
            'materials' => $materials,
            'summary' => [
                'total_materials_analyzed' => $materials->count(),
                'high_risk' => $materials->where('risk_level', 'high')->count(),
                'medium_risk' => $materials->where('risk_level', 'medium')->count(),
                'low_risk' => $materials->where('risk_level', 'low')->count(),
                'needs_reorder' => $materials->where('needs_reorder', true)->count(),
            ],
        ];
    }

    /**
     * Get wastage/adjustment tracking.
     */
    public function getWastageReport(array $filters = []): array
    {
        $from = Carbon::parse($filters['from'] ?? now()->subMonth());
        $to = Carbon::parse($filters['to'] ?? now());

        // Get adjustments (wastage/loss/damage)
        $adjustments = InventoryTransaction::whereIn('type', ['adjustment', 'wastage', 'damage'])
            ->whereBetween('created_at', [$from, $to])
            ->with('material')
            ->get();

        // Group by reason/type
        $byType = $adjustments->groupBy('type')->map(function ($group) {
            return [
                'count' => $group->count(),
                'total_quantity' => $group->sum(fn($t) => abs($t->quantity)),
                'total_cost' => $group->sum(fn($t) => abs($t->quantity) * $t->unit_cost),
            ];
        });

        // Top materials with adjustments
        $byMaterial = $adjustments->groupBy('material_id')->map(function ($group) {
            $material = $group->first()->material;
            return [
                'material_id' => $material->id,
                'name' => $material->name,
                'adjustments_count' => $group->count(),
                'total_quantity' => $group->sum(fn($t) => abs($t->quantity)),
                'total_cost' => $group->sum(fn($t) => abs($t->quantity) * $t->unit_cost),
            ];
        })->sortByDesc('total_cost')->values()->take(20);

        // Daily trend
        $dailyTrend = $adjustments->groupBy(fn($t) => $t->created_at->format('Y-m-d'))
            ->map(function ($group, $date) {
                return [
                    'date' => $date,
                    'count' => $group->count(),
                    'total_cost' => $group->sum(fn($t) => abs($t->quantity) * $t->unit_cost),
                ];
            })
            ->sortKeys()
            ->values();

        return [
            'period' => [
                'from' => $from->format('Y-m-d'),
                'to' => $to->format('Y-m-d'),
            ],
            'by_type' => $byType,
            'by_material' => $byMaterial,
            'daily_trend' => $dailyTrend,
            'summary' => [
                'total_adjustments' => $adjustments->count(),
                'total_cost' => $adjustments->sum(fn($t) => abs($t->quantity) * $t->unit_cost),
                'materials_affected' => $adjustments->unique('material_id')->count(),
            ],
        ];
    }

    /**
     * Get comprehensive thread usage report.
     */
    public function getThreadUsageReport(array $filters = []): array
    {
        $from = Carbon::parse($filters['from'] ?? now()->subMonth());
        $to = Carbon::parse($filters['to'] ?? now());

        // Thread consumption by type
        $byType = ThreadTransaction::where('thread_transactions.type', 'consumption')
            ->whereBetween('thread_transactions.created_at', [$from, $to])
            ->join('threads', 'thread_transactions.thread_id', '=', 'threads.id')
            ->select(
                'threads.type',
                DB::raw('SUM(ABS(thread_transactions.meters_quantity)) as total_meters'),
                DB::raw('COUNT(DISTINCT threads.id) as threads_used')
            )
            ->groupBy('threads.type')
            ->get();

        // Top consuming threads
        $topThreads = ThreadTransaction::where('thread_transactions.type', 'consumption')
            ->whereBetween('thread_transactions.created_at', [$from, $to])
            ->join('threads', 'thread_transactions.thread_id', '=', 'threads.id')
            ->select(
                'threads.id',
                'threads.name',
                'threads.color_code',
                'threads.type',
                DB::raw('SUM(ABS(thread_transactions.meters_quantity)) as total_meters'),
                DB::raw('COUNT(*) as usage_count')
            )
            ->groupBy('threads.id', 'threads.name', 'threads.color_code', 'threads.type')
            ->orderByDesc('total_meters')
            ->limit(20)
            ->get();

        // Daily consumption trend
        $dailyTrend = ThreadTransaction::where('thread_transactions.type', 'consumption')
            ->whereBetween('thread_transactions.created_at', [$from, $to])
            ->join('threads', 'thread_transactions.thread_id', '=', 'threads.id')
            ->select(
                DB::raw('DATE(thread_transactions.created_at) as date'),
                'threads.type',
                DB::raw('SUM(ABS(thread_transactions.meters_quantity)) as meters')
            )
            ->groupBy('date', 'threads.type')
            ->orderBy('date')
            ->get()
            ->groupBy('date')
            ->map(function ($group, $date) {
                return [
                    'date' => $date,
                    'standard' => $group->where('type', 'standard')->sum('meters'),
                    'specialty' => $group->where('type', 'specialty')->sum('meters'),
                    'total' => $group->sum('meters'),
                ];
            })
            ->values();

        // 80/20 efficiency check
        $standardUsage = $byType->where('type', 'standard')->first()['total_meters'] ?? 0;
        $specialtyUsage = $byType->where('type', 'specialty')->first()['total_meters'] ?? 0;
        $totalUsage = $standardUsage + $specialtyUsage;
        $standardPercent = $totalUsage > 0 ? ($standardUsage / $totalUsage) * 100 : 0;

        return [
            'period' => [
                'from' => $from->format('Y-m-d'),
                'to' => $to->format('Y-m-d'),
            ],
            'by_type' => $byType,
            'top_threads' => $topThreads,
            'daily_trend' => $dailyTrend,
            'efficiency' => [
                'standard_percent' => round($standardPercent, 1),
                'specialty_percent' => round(100 - $standardPercent, 1),
                'target_standard' => 80,
                'is_compliant' => $standardPercent >= 75, // Allow 5% buffer
                'compliance_gap' => round(80 - $standardPercent, 1),
            ],
            'summary' => [
                'total_meters' => $totalUsage,
                'standard_meters' => $standardUsage,
                'specialty_meters' => $specialtyUsage,
                'threads_used' => $byType->sum('threads_used'),
            ],
        ];
    }

    /**
     * Get SQL for date grouping.
     */
    protected function getDateGroupSql(string $column, string $groupBy): string
    {
        return match ($groupBy) {
            'daily' => "DATE($column)",
            'weekly' => "strftime('%Y-%W', $column)",
            'monthly' => "strftime('%Y-%m', $column)",
            default => "DATE($column)",
        };
    }

    /**
     * Calculate risk level based on days until stockout.
     */
    protected function calculateRiskLevel(?int $daysUntilStockout, int $forecastDays): string
    {
        if ($daysUntilStockout === null) {
            return 'none';
        }
        if ($daysUntilStockout <= 7) {
            return 'high';
        }
        if ($daysUntilStockout <= $forecastDays / 2) {
            return 'medium';
        }
        return 'low';
    }
}
