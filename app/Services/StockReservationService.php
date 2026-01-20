<?php

namespace App\Services;

use App\Models\Material;
use App\Models\MaterialColorMapping;
use App\Models\Product;
use App\Models\ProductBOM;
use App\Models\Sale;
use App\Models\SaleProduct;
use App\Models\StockReservation;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class StockReservationService
{
    /**
     * Reserve materials for a sale when it's approved.
     *
     * @param Sale $sale The approved sale
     * @param int|null $userId User making the reservation
     * @return array Result with success status, reservations, and any warnings
     */
    public function reserveMaterialsForSale(Sale $sale, ?int $userId = null): array
    {
        $reservations = [];
        $warnings = [];
        $errors = [];

        try {
            DB::beginTransaction();

            // Load sale products
            $saleProducts = $sale->saleProducts()->with('product')->get();

            if ($saleProducts->isEmpty()) {
                // Fallback: check if sale has direct product reference via product_category
                $warnings[] = 'Pedido não possui produtos vinculados.';
                DB::commit();
                return [
                    'success' => true,
                    'reservations' => [],
                    'warnings' => $warnings,
                    'errors' => [],
                ];
            }

            foreach ($saleProducts as $saleProduct) {
                $product = $saleProduct->product;

                if (!$product) {
                    $warnings[] = "Produto não encontrado para item #{$saleProduct->id}";
                    continue;
                }

                // Check if product has BOM
                if (!$product->hasBOM()) {
                    $warnings[] = "Produto '{$product->name}' não possui ficha técnica (BOM).";
                    continue;
                }

                // Calculate materials needed for this sale product
                $materialsNeeded = $this->calculateMaterialsForSaleProduct(
                    $product,
                    $saleProduct->size,
                    $saleProduct->product_color,
                    $saleProduct->quantity
                );

                foreach ($materialsNeeded as $materialData) {
                    $material = $materialData['material'];
                    $quantity = $materialData['quantity'];
                    $unit = $materialData['unit'];

                    // Check if enough stock is available
                    $availableStock = StockReservation::getAvailableStock($material);

                    if ($availableStock < $quantity) {
                        $shortage = $quantity - $availableStock;
                        $warnings[] = "Estoque insuficiente para '{$material->name}': necessário {$quantity} {$unit}, disponível {$availableStock} {$unit} (faltam {$shortage} {$unit})";
                    }

                    // Create reservation regardless (to track what's needed)
                    $reservation = StockReservation::create([
                        'sale_id' => $sale->id,
                        'sale_product_id' => $saleProduct->id,
                        'material_id' => $material->id,
                        'quantity_reserved' => $quantity,
                        'unit' => $unit,
                        'status' => StockReservation::STATUS_RESERVED,
                        'reserved_at' => now(),
                        'created_by' => $userId ?? auth()->id(),
                        'notes' => "Reserva automática - Pedido #{$sale->id}, Produto: {$product->name}",
                    ]);

                    $reservations[] = $reservation;
                }
            }

            DB::commit();

            return [
                'success' => true,
                'reservations' => $reservations,
                'warnings' => $warnings,
                'errors' => [],
            ];

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error reserving materials for sale', [
                'sale_id' => $sale->id,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'reservations' => [],
                'warnings' => $warnings,
                'errors' => [$e->getMessage()],
            ];
        }
    }

    /**
     * Calculate materials needed for a sale product.
     */
    protected function calculateMaterialsForSaleProduct(
        Product $product,
        ?string $size,
        ?string $color,
        int $quantity
    ): array {
        $materials = [];

        // Get active BOM entries for this product
        $bomEntries = $product->activeBom()->with(['material', 'variants'])->get();

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

            // Aggregate by material (in case same material appears multiple times)
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
     * Release all reservations for a sale (when order is cancelled).
     */
    public function releaseReservationsForSale(Sale $sale, ?int $userId = null, ?string $reason = null): array
    {
        $released = [];
        $errors = [];

        try {
            DB::beginTransaction();

            $reservations = StockReservation::forSale($sale->id)
                ->reserved()
                ->get();

            foreach ($reservations as $reservation) {
                $reservation->markAsReleased($userId, $reason ?? "Pedido #{$sale->id} cancelado");
                $released[] = $reservation;
            }

            DB::commit();

            return [
                'success' => true,
                'released' => $released,
                'errors' => [],
            ];

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error releasing reservations', [
                'sale_id' => $sale->id,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'released' => [],
                'errors' => [$e->getMessage()],
            ];
        }
    }

    /**
     * Rollback deducted materials (restore stock) when order is cancelled after production started.
     * This restores materials that were already deducted from stock.
     *
     * @param Sale $sale The sale being cancelled
     * @param int|null $userId User performing the rollback
     * @param string|null $reason Reason for the rollback
     * @return array Result with success status, restored items, transactions, and any errors
     */
    public function rollbackDeductedMaterials(Sale $sale, ?int $userId = null, ?string $reason = null): array
    {
        $restored = [];
        $errors = [];
        $transactions = [];
        $warnings = [];

        try {
            DB::beginTransaction();

            // Get all deducted reservations for this sale
            $deductedReservations = StockReservation::forSale($sale->id)
                ->deducted()
                ->with('material')
                ->get();

            if ($deductedReservations->isEmpty()) {
                $warnings[] = 'Nenhum material deduzido encontrado para este pedido.';
                DB::commit();
                return [
                    'success' => true,
                    'restored' => [],
                    'transactions' => [],
                    'warnings' => $warnings,
                    'errors' => [],
                ];
            }

            foreach ($deductedReservations as $reservation) {
                $material = $reservation->material;
                $quantity = (float) $reservation->quantity_reserved;

                if (!$material) {
                    $errors[] = "Material não encontrado para reserva #{$reservation->id}";
                    continue;
                }

                // Restore stock (add back to material)
                $previousStock = (float) $material->current_stock;
                $material->increment('current_stock', $quantity);

                // Create inventory transaction for audit trail (type: return)
                $transaction = \App\Models\InventoryTransaction::create([
                    'material_id' => $material->id,
                    'type' => 'return',
                    'quantity' => $quantity, // Positive for incoming/return
                    'unit_cost' => $material->purchase_price ?? 0,
                    'reference' => "Cancelamento Pedido #{$sale->id}",
                    'notes' => "Estorno automático - Cancelamento do pedido #{$sale->id}. " .
                               ($reason ?? 'Sem motivo informado') .
                               " (Estoque anterior: {$previousStock})",
                    'user_id' => $userId ?? auth()->id(),
                ]);

                $transactions[] = $transaction;

                // Mark reservation as released (with rollback note)
                $reservation->update([
                    'status' => StockReservation::STATUS_RELEASED,
                    'released_at' => now(),
                    'released_by' => $userId ?? auth()->id(),
                    'notes' => ($reservation->notes ? $reservation->notes . ' | ' : '') .
                               "ESTORNADO: " . ($reason ?? "Pedido #{$sale->id} cancelado"),
                ]);

                $restored[] = [
                    'reservation_id' => $reservation->id,
                    'material_id' => $material->id,
                    'material_name' => $material->name,
                    'quantity_restored' => $quantity,
                    'previous_stock' => $previousStock,
                    'new_stock' => $previousStock + $quantity,
                ];

                Log::info('Material stock restored (rollback)', [
                    'sale_id' => $sale->id,
                    'material_id' => $material->id,
                    'quantity_restored' => $quantity,
                    'transaction_id' => $transaction->id,
                ]);
            }

            DB::commit();

            return [
                'success' => empty($errors),
                'restored' => $restored,
                'transactions' => $transactions,
                'warnings' => $warnings,
                'errors' => $errors,
            ];

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error rolling back deducted materials', [
                'sale_id' => $sale->id,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'restored' => [],
                'transactions' => [],
                'warnings' => [],
                'errors' => [$e->getMessage()],
            ];
        }
    }

    /**
     * Full cancellation rollback - handles both reserved and deducted materials.
     * Call this when cancelling an order to properly handle all scenarios.
     *
     * @param Sale $sale The sale being cancelled
     * @param int|null $userId User performing the cancellation
     * @param string|null $reason Reason for cancellation
     * @return array Combined result with all releases and rollbacks
     */
    public function fullCancellationRollback(Sale $sale, ?int $userId = null, ?string $reason = null): array
    {
        $result = [
            'success' => true,
            'reserved_released' => [],
            'deducted_restored' => [],
            'transactions' => [],
            'warnings' => [],
            'errors' => [],
        ];

        // 1. Release reserved (not yet deducted) materials
        $releaseResult = $this->releaseReservationsForSale($sale, $userId, $reason);
        $result['reserved_released'] = $releaseResult['released'] ?? [];
        if (!$releaseResult['success']) {
            $result['errors'] = array_merge($result['errors'], $releaseResult['errors'] ?? []);
            $result['success'] = false;
        }

        // 2. Rollback deducted materials (restore stock)
        $rollbackResult = $this->rollbackDeductedMaterials($sale, $userId, $reason);
        $result['deducted_restored'] = $rollbackResult['restored'] ?? [];
        $result['transactions'] = $rollbackResult['transactions'] ?? [];
        $result['warnings'] = array_merge($result['warnings'], $rollbackResult['warnings'] ?? []);
        if (!$rollbackResult['success']) {
            $result['errors'] = array_merge($result['errors'], $rollbackResult['errors'] ?? []);
            $result['success'] = false;
        }

        Log::info('Full cancellation rollback completed', [
            'sale_id' => $sale->id,
            'reserved_released' => count($result['reserved_released']),
            'deducted_restored' => count($result['deducted_restored']),
            'transactions_created' => count($result['transactions']),
        ]);

        return $result;
    }

    /**
     * Deduct materials from stock when production starts.
     * This converts reserved materials to actual stock deductions.
     *
     * @param Sale $sale The sale starting production
     * @param int|null $userId User performing the deduction
     * @return array Result with success status, deductions, and any errors
     */
    public function deductMaterialsForProduction(Sale $sale, ?int $userId = null): array
    {
        $deducted = [];
        $errors = [];
        $transactions = [];

        try {
            DB::beginTransaction();

            // Get all reserved (not yet deducted) reservations for this sale
            $reservations = StockReservation::forSale($sale->id)
                ->reserved()
                ->with('material')
                ->get();

            if ($reservations->isEmpty()) {
                // No reservations to deduct - this might be okay if BOM wasn't set up
                Log::warning('No reservations found for production deduction', [
                    'sale_id' => $sale->id,
                ]);

                DB::commit();
                return [
                    'success' => true,
                    'deducted' => [],
                    'transactions' => [],
                    'errors' => [],
                    'warnings' => ['Nenhuma reserva de material encontrada para este pedido.'],
                ];
            }

            foreach ($reservations as $reservation) {
                $material = $reservation->material;
                $quantity = (float) $reservation->quantity_reserved;

                // Check if we have enough stock
                if ($material->current_stock < $quantity) {
                    $errors[] = "Estoque insuficiente para '{$material->name}': necessário {$quantity}, disponível {$material->current_stock}";
                    continue;
                }

                // Deduct from material stock
                $previousStock = (float) $material->current_stock;
                $material->decrement('current_stock', $quantity);

                // Create inventory transaction for audit trail
                $transaction = \App\Models\InventoryTransaction::create([
                    'material_id' => $material->id,
                    'type' => 'consumption',
                    'quantity' => -$quantity, // Negative for outgoing
                    'unit_cost' => $material->purchase_price ?? 0,
                    'reference' => "Pedido #{$sale->id}",
                    'notes' => "Dedução automática - Início de produção do pedido #{$sale->id} (Estoque anterior: {$previousStock})",
                    'user_id' => $userId ?? auth()->id(),
                ]);

                $transactions[] = $transaction;

                // Mark reservation as deducted
                $reservation->markAsDeducted($userId);
                $deducted[] = $reservation;

                Log::info('Material deducted for production', [
                    'sale_id' => $sale->id,
                    'material_id' => $material->id,
                    'material_name' => $material->name,
                    'quantity' => $quantity,
                    'previous_stock' => $previousStock,
                    'new_stock' => $material->fresh()->current_stock,
                ]);
            }

            DB::commit();

            return [
                'success' => empty($errors),
                'deducted' => $deducted,
                'transactions' => $transactions,
                'errors' => $errors,
            ];

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error deducting materials for production', [
                'sale_id' => $sale->id,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'deducted' => [],
                'transactions' => [],
                'errors' => [$e->getMessage()],
            ];
        }
    }

    /**
     * Get reservation summary for a sale.
     */
    public function getReservationSummary(Sale $sale): array
    {
        $reservations = StockReservation::forSale($sale->id)
            ->with('material')
            ->get();

        $summary = [
            'total_reservations' => $reservations->count(),
            'reserved' => $reservations->where('status', StockReservation::STATUS_RESERVED)->count(),
            'deducted' => $reservations->where('status', StockReservation::STATUS_DEDUCTED)->count(),
            'released' => $reservations->where('status', StockReservation::STATUS_RELEASED)->count(),
            'materials' => [],
        ];

        // Group by material
        foreach ($reservations->groupBy('material_id') as $materialId => $materialReservations) {
            $material = $materialReservations->first()->material;
            $totalReserved = $materialReservations
                ->where('status', StockReservation::STATUS_RESERVED)
                ->sum('quantity_reserved');

            $summary['materials'][] = [
                'material_id' => $materialId,
                'material_name' => $material->name,
                'quantity_reserved' => $totalReserved,
                'unit' => $materialReservations->first()->unit,
                'status' => $materialReservations->first()->status,
            ];
        }

        return $summary;
    }

    /**
     * Get available stock for all materials (considering reservations).
     */
    public function getAvailableStockReport(): Collection
    {
        $materials = Material::orderBy('name')->get();
        $report = collect();

        foreach ($materials as $material) {
            $reserved = StockReservation::getTotalReservedForMaterial($material->id);
            $available = StockReservation::getAvailableStock($material);

            $report->push([
                'material_id' => $material->id,
                'material_name' => $material->name,
                'current_stock' => (float) $material->current_stock,
                'reserved_stock' => $reserved,
                'available_stock' => $available,
                'unit' => $material->unit,
            ]);
        }

        return $report;
    }

    /**
     * Get materials with low or critical stock levels.
     * Low: available stock <= minimum_stock
     * Critical: available stock <= 0
     */
    public function getLowStockMaterials(): array
    {
        $materials = Material::orderBy('name')->get();
        $lowStock = [];
        $criticalStock = [];

        foreach ($materials as $material) {
            $available = StockReservation::getAvailableStock($material);
            $minimumStock = (float) ($material->minimum_stock ?? 0);
            $reserved = StockReservation::getTotalReservedForMaterial($material->id);

            if ($available <= 0) {
                $criticalStock[] = [
                    'material_id' => $material->id,
                    'material_name' => $material->name,
                    'current_stock' => (float) $material->current_stock,
                    'reserved_stock' => $reserved,
                    'available_stock' => $available,
                    'minimum_stock' => $minimumStock,
                    'unit' => $material->unit,
                    'level' => 'critical',
                ];
            } elseif ($available <= $minimumStock) {
                $lowStock[] = [
                    'material_id' => $material->id,
                    'material_name' => $material->name,
                    'current_stock' => (float) $material->current_stock,
                    'reserved_stock' => $reserved,
                    'available_stock' => $available,
                    'minimum_stock' => $minimumStock,
                    'unit' => $material->unit,
                    'level' => 'low',
                ];
            }
        }

        return [
            'critical' => $criticalStock,
            'low' => $lowStock,
            'total_critical' => count($criticalStock),
            'total_low' => count($lowStock),
        ];
    }

    /**
     * Check if a sale can be reserved (enough stock for all materials).
     */
    public function canReserveSale(Sale $sale): array
    {
        $canReserve = true;
        $shortages = [];

        $saleProducts = $sale->saleProducts()->with('product')->get();

        foreach ($saleProducts as $saleProduct) {
            $product = $saleProduct->product;

            if (!$product || !$product->hasBOM()) {
                continue;
            }

            $materialsNeeded = $this->calculateMaterialsForSaleProduct(
                $product,
                $saleProduct->size,
                $saleProduct->product_color,
                $saleProduct->quantity
            );

            foreach ($materialsNeeded as $materialData) {
                $material = $materialData['material'];
                $quantity = $materialData['quantity'];
                $available = StockReservation::getAvailableStock($material);

                if ($available < $quantity) {
                    $canReserve = false;
                    $shortages[] = [
                        'material_id' => $material->id,
                        'material_name' => $material->name,
                        'needed' => $quantity,
                        'available' => $available,
                        'shortage' => $quantity - $available,
                        'unit' => $materialData['unit'],
                    ];
                }
            }
        }

        return [
            'can_reserve' => $canReserve,
            'shortages' => $shortages,
        ];
    }
}
