<?php

namespace App\Services;

use App\Models\Material;
use App\Models\MaterialColorMapping;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleProduct;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CuttingListService
{
    /**
     * Generate a cutting list from multiple orders.
     * Batches materials across all selected orders for efficient cutting.
     *
     * @param array $saleIds Array of sale IDs to include
     * @param array $options Optional filters (e.g., material_category, date_range)
     * @return array Cutting list with batched materials
     */
    public function generateCuttingList(array $saleIds, array $options = []): array
    {
        $materials = [];
        $orderDetails = [];
        $warnings = [];

        // Get all sales with their products
        $sales = Sale::with(['saleProducts.product'])
            ->whereIn('id', $saleIds)
            ->get();

        if ($sales->isEmpty()) {
            return [
                'success' => false,
                'materials' => [],
                'order_details' => [],
                'summary' => [],
                'warnings' => ['Nenhum pedido encontrado.'],
            ];
        }

        foreach ($sales as $sale) {
            $saleProducts = $sale->saleProducts;

            if ($saleProducts->isEmpty()) {
                $warnings[] = "Pedido #{$sale->id} não possui produtos.";
                continue;
            }

            foreach ($saleProducts as $saleProduct) {
                $product = $saleProduct->product;

                if (!$product) {
                    $warnings[] = "Produto não encontrado para item do pedido #{$sale->id}.";
                    continue;
                }

                // Check if product has BOM
                if (!$product->hasBOM()) {
                    $warnings[] = "Produto '{$product->name}' não possui ficha técnica (BOM).";
                    continue;
                }

                // Calculate materials needed
                $productMaterials = $this->calculateMaterialsForSaleProduct(
                    $product,
                    $saleProduct->size,
                    $saleProduct->product_color,
                    $saleProduct->quantity
                );

                // Track order details for each material
                foreach ($productMaterials as $materialData) {
                    $materialId = $materialData['material']->id;
                    $quantity = $materialData['quantity'];

                    // Aggregate materials
                    if (isset($materials[$materialId])) {
                        $materials[$materialId]['total_quantity'] += $quantity;
                        $materials[$materialId]['order_count']++;
                    } else {
                        $materials[$materialId] = [
                            'material_id' => $materialId,
                            'material_name' => $materialData['material']->name,
                            'material_reference' => $materialData['material']->reference,
                            'material_category' => $materialData['material']->category?->name ?? 'Sem categoria',
                            'unit' => $materialData['unit'],
                            'total_quantity' => $quantity,
                            'current_stock' => (float) $materialData['material']->current_stock,
                            'order_count' => 1,
                            'orders' => [],
                        ];
                    }

                    // Track which orders need this material
                    $materials[$materialId]['orders'][] = [
                        'sale_id' => $sale->id,
                        'client_name' => $sale->client_name,
                        'product_name' => $product->name,
                        'size' => $saleProduct->size,
                        'color' => $saleProduct->product_color,
                        'quantity' => $saleProduct->quantity,
                        'material_quantity' => $quantity,
                    ];
                }

                // Track order details
                $orderDetails[$sale->id] = [
                    'sale_id' => $sale->id,
                    'client_name' => $sale->client_name,
                    'order_status' => $sale->order_status,
                    'created_at' => $sale->created_at->format('d/m/Y'),
                    'products' => $sale->saleProducts->map(function ($sp) {
                        return [
                            'product_name' => $sp->product->name ?? 'N/A',
                            'quantity' => $sp->quantity,
                            'size' => $sp->size,
                            'color' => $sp->product_color,
                        ];
                    })->toArray(),
                ];
            }
        }

        // Sort materials by category and name
        $sortedMaterials = collect($materials)->sortBy([
            ['material_category', 'asc'],
            ['material_name', 'asc'],
        ])->values()->toArray();

        // Calculate summary
        $summary = $this->calculateSummary($sortedMaterials, $sales);

        return [
            'success' => true,
            'materials' => $sortedMaterials,
            'order_details' => array_values($orderDetails),
            'summary' => $summary,
            'warnings' => $warnings,
            'generated_at' => now()->format('d/m/Y H:i:s'),
        ];
    }

    /**
     * Get orders eligible for cutting list (approved, awaiting production).
     *
     * @param array $filters Optional filters
     * @return Collection
     */
    public function getEligibleOrders(array $filters = []): Collection
    {
        $query = Sale::with(['saleProducts.product', 'user'])
            ->whereIn('order_status', ['payment_approved', 'in_production']);

        // Apply date filter
        if (!empty($filters['date_from'])) {
            $query->whereDate('created_at', '>=', $filters['date_from']);
        }
        if (!empty($filters['date_to'])) {
            $query->whereDate('created_at', '<=', $filters['date_to']);
        }

        // Apply status filter
        if (!empty($filters['status'])) {
            $query->where('order_status', $filters['status']);
        }

        return $query->orderBy('created_at', 'asc')->get();
    }

    /**
     * Calculate materials needed for a sale product.
     * (Reused logic from StockReservationService)
     */
    protected function calculateMaterialsForSaleProduct(
        Product $product,
        ?string $size,
        ?string $color,
        int $quantity
    ): array {
        $materials = [];

        // Get active BOM entries for this product
        $bomEntries = $product->activeBom()->with(['material.category', 'variants'])->get();

        foreach ($bomEntries as $bom) {
            // Get base material and quantity
            $baseMaterial = $bom->material;
            $baseQuantity = (float) $bom->quantity;
            $unit = $bom->unit;

            // Check for size/color variant overrides
            if ($size || $color) {
                $variantQuantity = $bom->getQuantityFor($size, $color);
                if ($variantQuantity !== null) {
                    $baseQuantity = $variantQuantity;
                }
            }

            // Check for color mapping (product color → specific material)
            $effectiveMaterial = $baseMaterial;
            if ($color) {
                $mappedMaterial = MaterialColorMapping::findMappedMaterial($color, $baseMaterial->id);
                if ($mappedMaterial) {
                    $effectiveMaterial = $mappedMaterial;
                }
            }

            // Calculate total quantity needed
            $totalQuantity = $baseQuantity * $quantity;

            // Aggregate by material
            $materialId = $effectiveMaterial->id;
            if (isset($materials[$materialId])) {
                $materials[$materialId]['quantity'] += $totalQuantity;
            } else {
                $materials[$materialId] = [
                    'material' => $effectiveMaterial,
                    'quantity' => $totalQuantity,
                    'unit' => $unit,
                ];
            }
        }

        return array_values($materials);
    }

    /**
     * Calculate summary statistics for the cutting list.
     */
    protected function calculateSummary(array $materials, Collection $sales): array
    {
        $totalMaterials = count($materials);
        $totalQuantity = 0;
        $insufficientStock = 0;

        foreach ($materials as $material) {
            $totalQuantity += $material['total_quantity'];
            if ($material['total_quantity'] > $material['current_stock']) {
                $insufficientStock++;
            }
        }

        return [
            'total_orders' => $sales->count(),
            'total_materials' => $totalMaterials,
            'total_material_quantity' => round($totalQuantity, 3),
            'materials_with_insufficient_stock' => $insufficientStock,
            'unique_products' => $sales->flatMap(fn($s) => $s->saleProducts->pluck('product_id'))->unique()->count(),
        ];
    }

    /**
     * Group cutting list materials by category for easier production floor use.
     */
    public function groupByCategory(array $materials): array
    {
        $grouped = [];

        foreach ($materials as $material) {
            $category = $material['material_category'];
            if (!isset($grouped[$category])) {
                $grouped[$category] = [
                    'category_name' => $category,
                    'materials' => [],
                    'total_items' => 0,
                ];
            }
            $grouped[$category]['materials'][] = $material;
            $grouped[$category]['total_items']++;
        }

        return array_values($grouped);
    }
}
