<?php

namespace App\Services;

use App\Models\Thread;
use App\Models\ThreadTransaction;
use App\Models\StandardThreadSubstitute;
use App\Models\Sale;
use App\Models\SaleProduct;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ThreadInventoryService
{
    /**
     * Consume thread for an order with embroidery.
     */
    public function consumeForOrder(Sale $sale): array
    {
        $consumed = [];
        $errors = [];

        foreach ($sale->saleProducts as $saleProduct) {
            if (!$saleProduct->has_embroidery || !$saleProduct->embroideryColor) {
                continue;
            }

            $embroideryColor = $saleProduct->embroideryColor;
            $thread = $embroideryColor->primaryThread;

            if (!$thread) {
                $errors[] = [
                    'sale_product_id' => $saleProduct->id,
                    'error' => "Cor de bordado '{$embroideryColor->name}' não tem linha associada",
                ];
                continue;
            }

            $metersNeeded = $embroideryColor->estimated_meters_per_use * $saleProduct->quantity;

            // Check if we need to use a substitute
            if ($thread->meters_remaining < $metersNeeded && $thread->is_specialty) {
                $substitute = $this->suggestStandardSubstitute($thread);
                if ($substitute && $substitute->meters_remaining >= $metersNeeded) {
                    $thread = $substitute;
                }
            }

            if ($thread->meters_remaining < $metersNeeded) {
                $errors[] = [
                    'sale_product_id' => $saleProduct->id,
                    'thread_id' => $thread->id,
                    'thread_name' => $thread->name,
                    'needed' => $metersNeeded,
                    'available' => $thread->meters_remaining,
                    'error' => 'Estoque insuficiente',
                ];
                continue;
            }

            $thread->consumeMeters($metersNeeded, "Pedido #{$sale->id}");

            $consumed[] = [
                'sale_product_id' => $saleProduct->id,
                'thread_id' => $thread->id,
                'thread_name' => $thread->name,
                'meters_consumed' => $metersNeeded,
            ];
        }

        return [
            'success' => empty($errors),
            'consumed' => $consumed,
            'errors' => $errors,
        ];
    }

    /**
     * Get thread usage statistics.
     */
    public function getUsageStatistics(array $filters = []): array
    {
        $from = Carbon::parse($filters['from'] ?? now()->subMonth());
        $to = Carbon::parse($filters['to'] ?? now());

        $transactions = ThreadTransaction::with('thread')
            ->where('type', 'consumption')
            ->whereBetween('created_at', [$from, $to])
            ->get();

        // Group by thread
        $byThread = $transactions->groupBy('thread_id')->map(function ($items) {
            $thread = $items->first()->thread;
            return [
                'thread_id' => $thread->id,
                'thread_name' => $thread->name,
                'thread_type' => $thread->type,
                'color_code' => $thread->color_code,
                'total_meters' => abs($items->sum('meters_quantity')),
                'transaction_count' => $items->count(),
            ];
        })->values();

        // Group by type (standard vs specialty)
        $byType = $transactions->groupBy(fn($t) => $t->thread->type)->map(function ($items, $type) {
            return [
                'type' => $type,
                'total_meters' => abs($items->sum('meters_quantity')),
                'thread_count' => $items->pluck('thread_id')->unique()->count(),
            ];
        })->values();

        // Daily consumption trend
        $dailyTrend = $transactions->groupBy(fn($t) => $t->created_at->format('Y-m-d'))
            ->map(function ($items, $date) {
                return [
                    'date' => $date,
                    'total_meters' => abs($items->sum('meters_quantity')),
                    'standard' => abs($items->filter(fn($t) => $t->thread->type === 'standard')->sum('meters_quantity')),
                    'specialty' => abs($items->filter(fn($t) => $t->thread->type === 'specialty')->sum('meters_quantity')),
                ];
            })->values();

        return [
            'period' => [
                'from' => $from->format('Y-m-d'),
                'to' => $to->format('Y-m-d'),
            ],
            'totals' => [
                'total_meters_consumed' => abs($transactions->sum('meters_quantity')),
                'total_transactions' => $transactions->count(),
                'unique_threads_used' => $transactions->pluck('thread_id')->unique()->count(),
            ],
            'by_thread' => $byThread->sortByDesc('total_meters')->values()->take(20),
            'by_type' => $byType,
            'daily_trend' => $dailyTrend,
        ];
    }

    /**
     * Perform 80/20 analysis on thread usage.
     */
    public function get8020Analysis(): array
    {
        $threads = Thread::where('is_active', true)->get();

        // Get consumption data for last 90 days
        $consumption = ThreadTransaction::where('type', 'consumption')
            ->where('created_at', '>=', now()->subDays(90))
            ->selectRaw('thread_id, SUM(ABS(meters_quantity)) as total_consumed')
            ->groupBy('thread_id')
            ->pluck('total_consumed', 'thread_id');

        $standardThreads = $threads->where('type', 'standard');
        $specialtyThreads = $threads->where('type', 'specialty');

        $standardConsumption = $standardThreads->sum(fn($t) => $consumption[$t->id] ?? 0);
        $specialtyConsumption = $specialtyThreads->sum(fn($t) => $consumption[$t->id] ?? 0);
        $totalConsumption = $standardConsumption + $specialtyConsumption;

        $analysis = [
            'totals' => [
                'standard_threads' => $standardThreads->count(),
                'specialty_threads' => $specialtyThreads->count(),
                'total_threads' => $threads->count(),
                'standard_consumption_meters' => $standardConsumption,
                'specialty_consumption_meters' => $specialtyConsumption,
                'total_consumption_meters' => $totalConsumption,
            ],
            'percentages' => [
                'standard_threads_percent' => $threads->count() > 0
                    ? round(($standardThreads->count() / $threads->count()) * 100, 1)
                    : 0,
                'specialty_threads_percent' => $threads->count() > 0
                    ? round(($specialtyThreads->count() / $threads->count()) * 100, 1)
                    : 0,
                'standard_consumption_percent' => $totalConsumption > 0
                    ? round(($standardConsumption / $totalConsumption) * 100, 1)
                    : 0,
                'specialty_consumption_percent' => $totalConsumption > 0
                    ? round(($specialtyConsumption / $totalConsumption) * 100, 1)
                    : 0,
            ],
            'inventory' => [
                'standard' => [
                    'total_spools' => $standardThreads->sum('spool_count'),
                    'total_meters' => $standardThreads->sum('meters_remaining'),
                    'total_value' => $standardThreads->sum(fn($t) => $t->spool_count * $t->purchase_price),
                    'low_stock_count' => $standardThreads->filter(fn($t) => $t->is_low_stock)->count(),
                ],
                'specialty' => [
                    'total_spools' => $specialtyThreads->sum('spool_count'),
                    'total_meters' => $specialtyThreads->sum('meters_remaining'),
                    'total_value' => $specialtyThreads->sum(fn($t) => $t->spool_count * $t->purchase_price),
                    'low_stock_count' => $specialtyThreads->filter(fn($t) => $t->is_low_stock)->count(),
                ],
            ],
            'top_standard' => $standardThreads
                ->map(fn($t) => [
                    'id' => $t->id,
                    'name' => $t->name,
                    'color_code' => $t->color_code,
                    'consumption' => $consumption[$t->id] ?? 0,
                    'stock' => $t->meters_remaining,
                ])
                ->sortByDesc('consumption')
                ->values()
                ->take(10),
            'top_specialty' => $specialtyThreads
                ->map(fn($t) => [
                    'id' => $t->id,
                    'name' => $t->name,
                    'color_code' => $t->color_code,
                    'consumption' => $consumption[$t->id] ?? 0,
                    'stock' => $t->meters_remaining,
                    'has_substitute' => $t->standardSubstitutes()->count() > 0,
                ])
                ->sortByDesc('consumption')
                ->values()
                ->take(10),
        ];

        // Add 80/20 compliance check
        $target8020 = [
            'standard_target' => 80,
            'specialty_target' => 20,
        ];

        $analysis['compliance'] = [
            'standard_compliant' => $analysis['percentages']['standard_consumption_percent'] >= 70,
            'recommendation' => $this->get8020Recommendation($analysis),
        ];

        return $analysis;
    }

    /**
     * Get recommendation based on 80/20 analysis.
     */
    protected function get8020Recommendation(array $analysis): string
    {
        $standardPercent = $analysis['percentages']['standard_consumption_percent'];

        if ($standardPercent >= 80) {
            return 'Excelente! O uso de linhas standard está dentro do ideal (80/20).';
        }

        if ($standardPercent >= 70) {
            return 'Bom. Considere substituir algumas linhas specialty por standard para otimizar custos.';
        }

        if ($standardPercent >= 50) {
            return 'Atenção: Alto uso de linhas specialty. Revise os bordados e considere usar mais cores standard.';
        }

        return 'Crítico: Consumo de specialty muito alto. Implemente um plano de substituição por standard.';
    }

    /**
     * Suggest a standard substitute for a specialty thread.
     */
    public function suggestStandardSubstitute(Thread $specialtyThread): ?Thread
    {
        if ($specialtyThread->type !== 'specialty') {
            return null;
        }

        // First, check configured substitutes
        $substitute = StandardThreadSubstitute::getAvailableSubstitute($specialtyThread);
        if ($substitute) {
            return $substitute;
        }

        // If no configured substitute, find closest color match from standard threads
        return Thread::where('type', 'standard')
            ->where('is_active', true)
            ->where('spool_count', '>', 0)
            ->orderByRaw("ABS(CAST(CONV(SUBSTRING(hex_code, 2, 2), 16, 10) AS SIGNED) - CAST(CONV(SUBSTRING(?, 2, 2), 16, 10) AS SIGNED)) +
                         ABS(CAST(CONV(SUBSTRING(hex_code, 4, 2), 16, 10) AS SIGNED) - CAST(CONV(SUBSTRING(?, 4, 2), 16, 10) AS SIGNED)) +
                         ABS(CAST(CONV(SUBSTRING(hex_code, 6, 2), 16, 10) AS SIGNED) - CAST(CONV(SUBSTRING(?, 6, 2), 16, 10) AS SIGNED))",
                [$specialtyThread->hex_code, $specialtyThread->hex_code, $specialtyThread->hex_code])
            ->first();
    }

    /**
     * Get all low stock threads.
     */
    public function getLowStockThreads(): Collection
    {
        return Thread::where('is_active', true)
            ->whereColumn('spool_count', '<=', 'minimum_spools')
            ->with('embroideryColor')
            ->orderBy('spool_count')
            ->get()
            ->map(fn($thread) => [
                'id' => $thread->id,
                'name' => $thread->name,
                'type' => $thread->type,
                'color_code' => $thread->color_code,
                'spool_count' => $thread->spool_count,
                'minimum_spools' => $thread->minimum_spools,
                'meters_remaining' => $thread->meters_remaining,
                'status' => $thread->stock_status,
                'substitute_available' => $thread->type === 'specialty'
                    ? ($this->suggestStandardSubstitute($thread) !== null)
                    : false,
            ]);
    }

    /**
     * Track thread usage by embroidery color.
     */
    public function trackUsageByColor(): array
    {
        $usage = DB::table('sale_products')
            ->join('embroidery_colors', 'sale_products.embroidery_color_id', '=', 'embroidery_colors.id')
            ->leftJoin('threads', 'embroidery_colors.primary_thread_id', '=', 'threads.id')
            ->where('sale_products.has_embroidery', true)
            ->selectRaw('
                embroidery_colors.id as color_id,
                embroidery_colors.name as color_name,
                embroidery_colors.hex_code,
                threads.id as thread_id,
                threads.name as thread_name,
                threads.type as thread_type,
                SUM(sale_products.quantity) as usage_count,
                SUM(sale_products.quantity * COALESCE(embroidery_colors.estimated_meters_per_use, 50)) as estimated_meters
            ')
            ->groupBy('embroidery_colors.id', 'embroidery_colors.name', 'embroidery_colors.hex_code',
                      'threads.id', 'threads.name', 'threads.type')
            ->orderByDesc('usage_count')
            ->get();

        return [
            'colors' => $usage,
            'total_usage' => $usage->sum('usage_count'),
            'total_estimated_meters' => $usage->sum('estimated_meters'),
        ];
    }

    /**
     * Get thread inventory summary.
     */
    public function getInventorySummary(): array
    {
        $threads = Thread::where('is_active', true)->get();

        return [
            'total_threads' => $threads->count(),
            'total_spools' => $threads->sum('spool_count'),
            'total_meters' => $threads->sum('meters_remaining'),
            'total_value' => $threads->sum(fn($t) => $t->spool_count * $t->purchase_price),
            'standard_count' => $threads->where('type', 'standard')->count(),
            'specialty_count' => $threads->where('type', 'specialty')->count(),
            'low_stock_count' => $threads->filter(fn($t) => $t->is_low_stock)->count(),
            'out_of_stock_count' => $threads->filter(fn($t) => $t->spool_count <= 0)->count(),
        ];
    }
}
