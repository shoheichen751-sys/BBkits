<?php

namespace App\Services;

use App\Models\BatchSimulation;
use App\Models\Product;
use App\Models\Material;
use App\Models\Thread;
use Illuminate\Support\Collection;

class BatchSimulationService
{
    protected ProductCostService $costService;

    public function __construct(ProductCostService $costService)
    {
        $this->costService = $costService;
    }

    /**
     * Calculate material requirements for a batch production.
     */
    public function calculateRequirements(array $productsConfig): array
    {
        $materialRequirements = [];
        $threadRequirements = [];
        $productResults = [];
        $shortages = [];
        $totalCost = 0;

        foreach ($productsConfig as $config) {
            $product = Product::with(['activeBom.material', 'activeBom.variants.material'])->find($config['product_id']);

            if (!$product || !$product->activeBom) {
                $productResults[] = [
                    'product_id' => $config['product_id'],
                    'product_name' => $product?->name ?? 'Unknown',
                    'quantity' => $config['quantity'] ?? 1,
                    'success' => false,
                    'error' => 'Produto sem BOM ativo',
                ];
                continue;
            }

            $quantity = $config['quantity'] ?? 1;
            $colorCode = $config['color'] ?? null;
            $sizeCode = $config['size'] ?? null;

            // Calculate materials needed for this product
            $productMaterials = $this->calculateProductMaterials(
                $product,
                $quantity,
                $colorCode,
                $sizeCode
            );

            // Aggregate material requirements
            foreach ($productMaterials['materials'] as $materialId => $requirement) {
                if (!isset($materialRequirements[$materialId])) {
                    $materialRequirements[$materialId] = [
                        'material_id' => $materialId,
                        'name' => $requirement['name'],
                        'unit' => $requirement['unit'],
                        'quantity_needed' => 0,
                        'current_stock' => $requirement['current_stock'],
                        'unit_cost' => $requirement['unit_cost'],
                        'products' => [],
                    ];
                }
                $materialRequirements[$materialId]['quantity_needed'] += $requirement['quantity'];
                $materialRequirements[$materialId]['products'][] = [
                    'product_name' => $product->name,
                    'quantity' => $requirement['quantity'],
                ];
            }

            // Calculate product cost
            $productCost = $this->costService->calculateProductCost($product);
            $unitCost = $productCost['success'] ? $productCost['material_cost'] : 0;

            $productResults[] = [
                'product_id' => $product->id,
                'product_name' => $product->name,
                'quantity' => $quantity,
                'color' => $colorCode,
                'size' => $sizeCode,
                'unit_cost' => $unitCost,
                'total_cost' => $unitCost * $quantity,
                'success' => true,
                'materials_count' => count($productMaterials['materials']),
            ];

            $totalCost += $unitCost * $quantity;
        }

        // Check for shortages
        foreach ($materialRequirements as $materialId => &$requirement) {
            $requirement['total_cost'] = $requirement['quantity_needed'] * $requirement['unit_cost'];
            $requirement['shortage'] = max(0, $requirement['quantity_needed'] - $requirement['current_stock']);
            $requirement['shortage_cost'] = $requirement['shortage'] * $requirement['unit_cost'];

            if ($requirement['shortage'] > 0) {
                $shortages[] = [
                    'material_id' => $materialId,
                    'name' => $requirement['name'],
                    'needed' => $requirement['quantity_needed'],
                    'available' => $requirement['current_stock'],
                    'shortage' => $requirement['shortage'],
                    'unit' => $requirement['unit'],
                    'shortage_cost' => $requirement['shortage_cost'],
                ];
            }
        }

        // Sort shortages by shortage cost (most expensive first)
        usort($shortages, fn($a, $b) => $b['shortage_cost'] <=> $a['shortage_cost']);

        return [
            'success' => true,
            'products' => $productResults,
            'materials' => array_values($materialRequirements),
            'threads' => array_values($threadRequirements),
            'shortages' => $shortages,
            'summary' => [
                'total_products' => count($productResults),
                'total_units' => array_sum(array_column($productResults, 'quantity')),
                'total_materials' => count($materialRequirements),
                'total_cost' => $totalCost,
                'shortages_count' => count($shortages),
                'shortage_total_cost' => array_sum(array_column($shortages, 'shortage_cost')),
                'can_produce' => count($shortages) === 0,
            ],
        ];
    }

    /**
     * Calculate materials needed for a single product.
     */
    protected function calculateProductMaterials(
        Product $product,
        int $quantity,
        ?string $colorCode,
        ?string $sizeCode
    ): array {
        $materials = [];

        foreach ($product->activeBom as $bomItem) {
            // Check for variants
            $material = $bomItem->material;
            $quantityNeeded = $bomItem->quantity * $quantity;

            // Check for color-specific variant
            if ($colorCode && $bomItem->variants->isNotEmpty()) {
                $variant = $bomItem->variants->first(function ($v) use ($colorCode) {
                    return $v->product_color === $colorCode;
                });
                if ($variant && $variant->material) {
                    $material = $variant->material;
                }
            }

            if ($material) {
                if (!isset($materials[$material->id])) {
                    $materials[$material->id] = [
                        'material_id' => $material->id,
                        'name' => $material->name,
                        'unit' => $material->unit,
                        'quantity' => 0,
                        'current_stock' => $material->current_stock ?? 0,
                        'unit_cost' => $material->purchase_price ?? 0,
                    ];
                }
                $materials[$material->id]['quantity'] += $quantityNeeded;
            }
        }

        return ['materials' => $materials];
    }

    /**
     * Save a simulation for later reference.
     */
    public function saveSimulation(array $data, int $userId): BatchSimulation
    {
        $results = $this->calculateRequirements($data['products_config']);

        return BatchSimulation::create([
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'user_id' => $userId,
            'products_config' => $data['products_config'],
            'results' => $results,
            'status' => 'calculated',
        ]);
    }

    /**
     * Compare multiple simulations.
     */
    public function compareSimulations(array $simulationIds): array
    {
        $simulations = BatchSimulation::whereIn('id', $simulationIds)->get();

        $comparison = [
            'simulations' => [],
            'materials_comparison' => [],
            'totals_comparison' => [],
        ];

        $allMaterials = collect();

        foreach ($simulations as $sim) {
            $comparison['simulations'][] = [
                'id' => $sim->id,
                'name' => $sim->name,
                'summary' => $sim->results['summary'] ?? [],
            ];

            // Collect all materials
            foreach ($sim->results['materials'] ?? [] as $material) {
                $allMaterials->push([
                    'simulation_id' => $sim->id,
                    'material_id' => $material['material_id'],
                    'name' => $material['name'],
                    'quantity_needed' => $material['quantity_needed'],
                    'total_cost' => $material['total_cost'] ?? 0,
                ]);
            }
        }

        // Group materials by material_id
        $grouped = $allMaterials->groupBy('material_id');
        foreach ($grouped as $materialId => $items) {
            $materialComparison = [
                'material_id' => $materialId,
                'name' => $items->first()['name'],
                'by_simulation' => [],
            ];

            foreach ($simulations as $sim) {
                $item = $items->firstWhere('simulation_id', $sim->id);
                $materialComparison['by_simulation'][$sim->id] = [
                    'quantity' => $item['quantity_needed'] ?? 0,
                    'cost' => $item['total_cost'] ?? 0,
                ];
            }

            $comparison['materials_comparison'][] = $materialComparison;
        }

        // Totals comparison
        foreach ($simulations as $sim) {
            $comparison['totals_comparison'][$sim->id] = [
                'name' => $sim->name,
                'total_units' => $sim->results['summary']['total_units'] ?? 0,
                'total_cost' => $sim->results['summary']['total_cost'] ?? 0,
                'shortages_count' => $sim->results['summary']['shortages_count'] ?? 0,
                'can_produce' => $sim->results['summary']['can_produce'] ?? false,
            ];
        }

        return $comparison;
    }

    /**
     * Get production feasibility report.
     */
    public function getFeasibilityReport(array $productsConfig): array
    {
        $requirements = $this->calculateRequirements($productsConfig);

        $feasibility = [
            'can_produce' => $requirements['summary']['can_produce'],
            'feasibility_score' => 100,
            'blocking_issues' => [],
            'warnings' => [],
            'recommendations' => [],
        ];

        // Calculate feasibility score
        if (!empty($requirements['shortages'])) {
            $shortageImpact = count($requirements['shortages']) * 10;
            $feasibility['feasibility_score'] = max(0, 100 - $shortageImpact);

            foreach ($requirements['shortages'] as $shortage) {
                $feasibility['blocking_issues'][] = [
                    'type' => 'material_shortage',
                    'material' => $shortage['name'],
                    'shortage' => $shortage['shortage'],
                    'unit' => $shortage['unit'],
                    'message' => "Faltam {$shortage['shortage']} {$shortage['unit']} de {$shortage['name']}",
                ];
            }

            // Add recommendation to purchase
            $feasibility['recommendations'][] = [
                'type' => 'purchase_materials',
                'message' => 'Criar pedido de compra para materiais faltantes',
                'data' => array_map(fn($s) => [
                    'material_id' => $s['material_id'],
                    'name' => $s['name'],
                    'quantity' => $s['shortage'],
                ], $requirements['shortages']),
            ];
        }

        // Check for low stock warnings (materials that will be depleted)
        foreach ($requirements['materials'] as $material) {
            $remainingStock = $material['current_stock'] - $material['quantity_needed'];
            if ($remainingStock > 0 && $remainingStock < ($material['current_stock'] * 0.2)) {
                $feasibility['warnings'][] = [
                    'type' => 'low_stock_after_production',
                    'material' => $material['name'],
                    'remaining' => $remainingStock,
                    'unit' => $material['unit'],
                    'message' => "Estoque de {$material['name']} ficará baixo após produção ({$remainingStock} {$material['unit']})",
                ];
            }
        }

        return array_merge($requirements, ['feasibility' => $feasibility]);
    }

    /**
     * Generate purchase suggestions based on simulation shortages.
     */
    public function getPurchaseSuggestions(array $productsConfig): array
    {
        $requirements = $this->calculateRequirements($productsConfig);
        $suggestions = [];

        foreach ($requirements['shortages'] as $shortage) {
            $material = Material::with('supplier')->find($shortage['material_id']);

            $suggestions[] = [
                'material_id' => $shortage['material_id'],
                'name' => $shortage['name'],
                'quantity_needed' => $shortage['shortage'],
                'unit' => $shortage['unit'],
                'estimated_cost' => $shortage['shortage_cost'],
                'supplier' => $material?->supplier?->name ?? 'Não definido',
                'supplier_id' => $material?->supplier_id,
                'lead_time_days' => $material?->supplier?->lead_time_days ?? null,
            ];
        }

        return [
            'suggestions' => $suggestions,
            'total_items' => count($suggestions),
            'total_estimated_cost' => array_sum(array_column($suggestions, 'estimated_cost')),
        ];
    }

    /**
     * Get list of saved simulations for user.
     */
    public function getUserSimulations(int $userId): Collection
    {
        return BatchSimulation::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Archive a simulation.
     */
    public function archiveSimulation(BatchSimulation $simulation): void
    {
        $simulation->update(['status' => 'archived']);
    }
}
