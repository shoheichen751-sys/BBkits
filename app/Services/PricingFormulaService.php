<?php

namespace App\Services;

use App\Models\Product;
use App\Models\PricingFormula;
use Illuminate\Support\Collection;

class PricingFormulaService
{
    protected ProductCostService $costService;

    public function __construct(ProductCostService $costService)
    {
        $this->costService = $costService;
    }

    /**
     * Calculate price for a product using a specific formula or default.
     */
    public function calculatePrice(Product $product, ?PricingFormula $formula = null): array
    {
        $formula = $formula ?? PricingFormula::getFormulaFor($product);

        if (!$formula) {
            return [
                'success' => false,
                'error' => 'Nenhuma fórmula de preço encontrada',
                'calculated_price' => null,
            ];
        }

        $costData = $this->costService->calculateProductCost($product);

        if (!$costData['success']) {
            return [
                'success' => false,
                'error' => $costData['error'] ?? 'Erro ao calcular custo',
                'calculated_price' => null,
            ];
        }

        $materialCost = $costData['material_cost'];
        $variables = $this->getFormulaVariables($product, $costData);

        $calculatedPrice = $formula->calculate($materialCost, $variables);

        return [
            'success' => true,
            'product_id' => $product->id,
            'product_name' => $product->name,
            'formula_id' => $formula->id,
            'formula_name' => $formula->name,
            'material_cost' => $materialCost,
            'calculated_price' => $calculatedPrice,
            'current_price' => $product->price,
            'price_difference' => $calculatedPrice - ($product->price ?? 0),
            'margin_percent' => $calculatedPrice > 0
                ? round((($calculatedPrice - $materialCost) / $calculatedPrice) * 100, 1)
                : 0,
            'markup_percent' => $materialCost > 0
                ? round((($calculatedPrice - $materialCost) / $materialCost) * 100, 1)
                : 0,
        ];
    }

    /**
     * Calculate price to achieve a target margin.
     */
    public function calculateWithMarginTarget(Product $product, float $targetMargin): array
    {
        $costData = $this->costService->calculateProductCost($product);

        if (!$costData['success']) {
            return [
                'success' => false,
                'error' => $costData['error'] ?? 'Erro ao calcular custo',
            ];
        }

        $materialCost = $costData['material_cost'];

        if ($targetMargin >= 100) {
            return [
                'success' => false,
                'error' => 'Margem alvo não pode ser >= 100%',
            ];
        }

        // Price = Cost / (1 - Margin%)
        $calculatedPrice = $materialCost / (1 - ($targetMargin / 100));

        return [
            'success' => true,
            'product_id' => $product->id,
            'product_name' => $product->name,
            'material_cost' => $materialCost,
            'target_margin' => $targetMargin,
            'calculated_price' => round($calculatedPrice, 2),
            'actual_margin' => $targetMargin,
            'markup_percent' => $materialCost > 0
                ? round((($calculatedPrice - $materialCost) / $materialCost) * 100, 1)
                : 0,
        ];
    }

    /**
     * Get all variables available for formula calculation.
     */
    public function getFormulaVariables(Product $product, ?array $costData = null): array
    {
        $costData = $costData ?? $this->costService->calculateProductCost($product);

        return [
            'material_cost' => $costData['material_cost'] ?? 0,
            'materials_count' => $costData['materials_count'] ?? 0,
            'category' => $product->productCategory?->slug ?? 'standard',
            'category_name' => $product->productCategory?->name ?? 'Sem Categoria',
            'allows_embroidery' => $product->allows_embroidery,
            'embroidery_cost' => $product->allows_embroidery ? 15 : 0, // Default embroidery cost
            'overhead_cost' => $product->overhead_cost ?? 0,
            'current_price' => $product->price ?? 0,
        ];
    }

    /**
     * Bulk recalculate prices for multiple products.
     */
    public function bulkRecalculatePrices(Collection $products, ?PricingFormula $formula = null): array
    {
        $results = [
            'success' => true,
            'updated' => 0,
            'skipped' => 0,
            'errors' => [],
            'products' => [],
        ];

        foreach ($products as $product) {
            $calcResult = $this->calculatePrice($product, $formula);

            if (!$calcResult['success']) {
                $results['skipped']++;
                $results['errors'][] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'error' => $calcResult['error'],
                ];
                continue;
            }

            $results['products'][] = $calcResult;
            $results['updated']++;
        }

        return $results;
    }

    /**
     * Apply calculated prices to products (actually save).
     */
    public function applyPrices(Collection $products, ?PricingFormula $formula = null, bool $updateManualPrice = false): array
    {
        $results = [
            'success' => true,
            'applied' => 0,
            'skipped' => 0,
            'errors' => [],
        ];

        foreach ($products as $product) {
            $calcResult = $this->calculatePrice($product, $formula);

            if (!$calcResult['success']) {
                $results['skipped']++;
                $results['errors'][] = [
                    'product_id' => $product->id,
                    'error' => $calcResult['error'],
                ];
                continue;
            }

            $updateData = [
                'calculated_price' => $calcResult['calculated_price'],
                'pricing_formula_id' => $calcResult['formula_id'],
                'price_calculated_at' => now(),
            ];

            if ($updateManualPrice) {
                $updateData['price'] = $calcResult['calculated_price'];
            }

            $product->update($updateData);
            $results['applied']++;
        }

        return $results;
    }

    /**
     * Preview price change without saving.
     */
    public function previewPriceChange(Product $product, array $newConfig): array
    {
        $costData = $this->costService->calculateProductCost($product);

        if (!$costData['success']) {
            return [
                'success' => false,
                'error' => $costData['error'],
            ];
        }

        $materialCost = $costData['material_cost'];
        $variables = $this->getFormulaVariables($product, $costData);

        // Create a temporary formula with new config
        $tempFormula = new PricingFormula([
            'formula_config' => $newConfig,
            'minimum_price' => $newConfig['minimum_price'] ?? null,
            'target_margin_percent' => $newConfig['target_margin_percent'] ?? null,
        ]);

        $newPrice = $tempFormula->calculate($materialCost, $variables);
        $currentPrice = $product->price ?? 0;

        return [
            'success' => true,
            'product_id' => $product->id,
            'product_name' => $product->name,
            'material_cost' => $materialCost,
            'current_price' => $currentPrice,
            'new_price' => $newPrice,
            'price_change' => $newPrice - $currentPrice,
            'price_change_percent' => $currentPrice > 0
                ? round((($newPrice - $currentPrice) / $currentPrice) * 100, 1)
                : 0,
            'new_margin' => $newPrice > 0
                ? round((($newPrice - $materialCost) / $newPrice) * 100, 1)
                : 0,
            'new_markup' => $materialCost > 0
                ? round((($newPrice - $materialCost) / $materialCost) * 100, 1)
                : 0,
        ];
    }

    /**
     * Get pricing summary for all products.
     */
    public function getPricingSummary(): array
    {
        $products = Product::where('is_active', true)
            ->whereHas('activeBom')
            ->with(['productCategory', 'pricingFormula'])
            ->get();

        $summary = [
            'total_products' => $products->count(),
            'with_formula' => 0,
            'without_formula' => 0,
            'needs_recalculation' => 0,
            'by_formula' => [],
            'by_category' => [],
        ];

        foreach ($products as $product) {
            if ($product->pricing_formula_id) {
                $summary['with_formula']++;
                $formulaName = $product->pricingFormula->name ?? 'Unknown';
                $summary['by_formula'][$formulaName] = ($summary['by_formula'][$formulaName] ?? 0) + 1;
            } else {
                $summary['without_formula']++;
            }

            if ($product->needsPriceRecalculation()) {
                $summary['needs_recalculation']++;
            }

            $categoryName = $product->productCategory?->name ?? 'Sem Categoria';
            $summary['by_category'][$categoryName] = ($summary['by_category'][$categoryName] ?? 0) + 1;
        }

        return $summary;
    }

    /**
     * Get available formula templates.
     */
    public function getFormulaTemplates(): array
    {
        return [
            'simple_markup' => [
                'name' => 'Markup Simples',
                'description' => 'Custo × Multiplicador',
                'config' => [
                    'markup' => 2.5,
                ],
            ],
            'markup_with_overhead' => [
                'name' => 'Markup + Overhead',
                'description' => 'Custo × Multiplicador + Overhead Fixo',
                'config' => [
                    'markup' => 2.0,
                    'overhead' => 10,
                ],
            ],
            'target_margin' => [
                'name' => 'Margem Alvo',
                'description' => 'Calcula preço para atingir margem desejada',
                'config' => [
                    'target_margin' => 40,
                ],
            ],
            'embroidery_premium' => [
                'name' => 'Premium Bordado',
                'description' => 'Markup maior para produtos com bordado',
                'config' => [
                    'markup' => 2.0,
                    'embroidery_multiplier' => 1.3,
                    'default_embroidery_cost' => 15,
                ],
            ],
            'category_based' => [
                'name' => 'Por Categoria',
                'description' => 'Multiplicadores diferentes por categoria',
                'config' => [
                    'markup' => 2.0,
                    'category_multipliers' => [
                        'premium' => 1.5,
                        'standard' => 1.0,
                        'basic' => 0.8,
                    ],
                ],
            ],
        ];
    }
}
