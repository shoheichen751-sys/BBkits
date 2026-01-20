<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreBOMRequest;
use App\Models\Product;
use App\Models\Material;
use App\Models\ProductBOM;
use App\Models\ProductBOMVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class BOMController extends Controller
{
    /**
     * Display list of all products with BOM status.
     */
    public function index(Request $request)
    {
        $query = Product::with(['bom.material', 'productCategory'])
            ->withCount('bom');

        // Filter by BOM status
        if ($request->has('has_bom')) {
            if ($request->has_bom === 'yes') {
                $query->has('bom');
            } elseif ($request->has_bom === 'no') {
                $query->doesntHave('bom');
            }
        }

        // Search by product name
        if ($request->has('search') && $request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $products = $query->orderBy('name')->paginate(20);

        // Add hasBOM flag to each product
        $products->getCollection()->transform(function ($product) {
            $product->has_bom = $product->bom_count > 0;
            return $product;
        });

        $materials = Material::orderBy('name')->get(['id', 'name', 'unit']);

        return Inertia::render('Admin/BOM/Index', [
            'products' => $products,
            'materials' => $materials,
            'filters' => $request->only(['has_bom', 'search']),
        ]);
    }

    /**
     * Display material calculator page.
     */
    public function calculator()
    {
        $products = Product::with(['bom'])
            ->withCount('bom')
            ->orderBy('name')
            ->get()
            ->map(function ($product) {
                $product->has_bom = $product->bom_count > 0;
                return $product;
            });

        $materials = Material::orderBy('name')->get(['id', 'name', 'unit', 'current_stock']);

        return Inertia::render('Admin/BOM/Preview', [
            'products' => $products,
            'materials' => $materials,
        ]);
    }

    /**
     * Get BOM for a specific product.
     */
    public function show(Product $product)
    {
        $product->load([
            'bom.material',
            'bom.variants.materialOverride',
            'productCategory',
        ]);

        $materials = Material::orderBy('name')->get(['id', 'name', 'unit', 'current_stock']);

        return Inertia::render('Admin/BOM/Edit', [
            'product' => $product,
            'materials' => $materials,
            'availableSizes' => $product->available_sizes ?? [],
            'availableColors' => $product->available_colors ?? [],
        ]);
    }

    /**
     * Store or update BOM for a product.
     */
    public function store(StoreBOMRequest $request, Product $product)
    {
        $validated = $request->validated();

        try {
            DB::beginTransaction();

            // Delete existing BOM entries for this product
            $product->bom()->delete();

            // Create new BOM entries
            foreach ($validated['items'] as $item) {
                $bom = ProductBOM::create([
                    'product_id' => $product->id,
                    'material_id' => $item['material_id'],
                    'quantity' => $item['quantity'],
                    'unit' => $item['unit'],
                    'notes' => $item['notes'] ?? null,
                    'is_active' => $item['is_active'] ?? true,
                ]);

                // Create variants if provided
                if (!empty($item['variants'])) {
                    foreach ($item['variants'] as $variant) {
                        // Skip empty variants
                        if (empty($variant['size']) && empty($variant['color'])) {
                            continue;
                        }

                        ProductBOMVariant::create([
                            'product_bom_id' => $bom->id,
                            'size' => $variant['size'] ?? null,
                            'color' => $variant['color'] ?? null,
                            'quantity_override' => $variant['quantity_override'] ?? null,
                            'material_id_override' => $variant['material_id_override'] ?? null,
                        ]);
                    }
                }
            }

            DB::commit();

            return redirect()->back()->with('success', 'Ficha técnica salva com sucesso!');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('BOM save error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Erro ao salvar ficha técnica: ' . $e->getMessage());
        }
    }

    /**
     * Add a single BOM entry to a product.
     */
    public function addItem(Request $request, Product $product)
    {
        $validated = $request->validate([
            'material_id' => 'required|exists:materials,id',
            'quantity' => 'required|numeric|min:0.001',
            'unit' => 'required|string|max:50',
            'notes' => 'nullable|string|max:500',
        ]);

        // Check if material already exists in BOM
        $exists = $product->bom()->where('material_id', $validated['material_id'])->exists();
        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Este material já está na ficha técnica.',
            ], 422);
        }

        $bom = ProductBOM::create([
            'product_id' => $product->id,
            'material_id' => $validated['material_id'],
            'quantity' => $validated['quantity'],
            'unit' => $validated['unit'],
            'notes' => $validated['notes'] ?? null,
        ]);

        $bom->load('material');

        return response()->json([
            'success' => true,
            'message' => 'Material adicionado com sucesso!',
            'bom' => $bom,
        ]);
    }

    /**
     * Update a single BOM entry.
     */
    public function updateItem(Request $request, ProductBOM $bom)
    {
        $validated = $request->validate([
            'quantity' => 'required|numeric|min:0.001',
            'unit' => 'required|string|max:50',
            'notes' => 'nullable|string|max:500',
            'is_active' => 'boolean',
        ]);

        $bom->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Material atualizado com sucesso!',
            'bom' => $bom->load('material'),
        ]);
    }

    /**
     * Delete a single BOM entry.
     */
    public function deleteItem(ProductBOM $bom)
    {
        $bom->delete();

        return response()->json([
            'success' => true,
            'message' => 'Material removido da ficha técnica.',
        ]);
    }

    /**
     * Add or update a variant for a BOM entry.
     */
    public function saveVariant(Request $request, ProductBOM $bom)
    {
        $validated = $request->validate([
            'size' => 'nullable|string|max:20',
            'color' => 'nullable|string|max:50',
            'quantity_override' => 'nullable|numeric|min:0.001',
            'material_id_override' => 'nullable|exists:materials,id',
        ]);

        // At least size or color must be provided
        if (empty($validated['size']) && empty($validated['color'])) {
            return response()->json([
                'success' => false,
                'message' => 'Informe o tamanho ou a cor.',
            ], 422);
        }

        $variant = ProductBOMVariant::updateOrCreate(
            [
                'product_bom_id' => $bom->id,
                'size' => $validated['size'],
                'color' => $validated['color'],
            ],
            [
                'quantity_override' => $validated['quantity_override'],
                'material_id_override' => $validated['material_id_override'],
            ]
        );

        $variant->load('materialOverride');

        return response()->json([
            'success' => true,
            'message' => 'Variação salva com sucesso!',
            'variant' => $variant,
        ]);
    }

    /**
     * Delete a variant.
     */
    public function deleteVariant(ProductBOMVariant $variant)
    {
        $variant->delete();

        return response()->json([
            'success' => true,
            'message' => 'Variação removida.',
        ]);
    }

    /**
     * Duplicate BOM from another product.
     */
    public function duplicate(Request $request, Product $product)
    {
        $validated = $request->validate([
            'source_product_id' => 'required|exists:products,id',
        ]);

        $sourceProduct = Product::with(['bom.variants'])->find($validated['source_product_id']);

        if ($sourceProduct->bom->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'O produto de origem não possui ficha técnica.',
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Delete existing BOM for target product
            $product->bom()->delete();

            // Copy BOM entries from source
            foreach ($sourceProduct->bom as $sourceBom) {
                $newBom = ProductBOM::create([
                    'product_id' => $product->id,
                    'material_id' => $sourceBom->material_id,
                    'quantity' => $sourceBom->quantity,
                    'unit' => $sourceBom->unit,
                    'notes' => $sourceBom->notes,
                    'is_active' => $sourceBom->is_active,
                ]);

                // Copy variants
                foreach ($sourceBom->variants as $sourceVariant) {
                    ProductBOMVariant::create([
                        'product_bom_id' => $newBom->id,
                        'size' => $sourceVariant->size,
                        'color' => $sourceVariant->color,
                        'quantity_override' => $sourceVariant->quantity_override,
                        'material_id_override' => $sourceVariant->material_id_override,
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Ficha técnica duplicada com sucesso!',
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('BOM duplicate error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erro ao duplicar ficha técnica.',
            ], 500);
        }
    }

    /**
     * Preview materials needed for an order.
     */
    public function previewMaterials(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.size' => 'nullable|string',
            'items.*.color' => 'nullable|string',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $allMaterials = [];

        foreach ($validated['items'] as $item) {
            $product = Product::find($item['product_id']);
            $materials = $product->calculateMaterialsNeeded(
                $item['size'] ?? null,
                $item['color'] ?? null,
                $item['quantity']
            );

            foreach ($materials as $materialId => $data) {
                if (isset($allMaterials[$materialId])) {
                    $allMaterials[$materialId]['quantity'] += $data['quantity'];
                } else {
                    $allMaterials[$materialId] = $data;
                }
            }
        }

        // Check stock availability
        $result = [];
        foreach ($allMaterials as $materialId => $data) {
            $material = $data['material'];
            $result[] = [
                'material_id' => $materialId,
                'material_name' => $material->name,
                'quantity_needed' => $data['quantity'],
                'unit' => $data['unit'],
                'current_stock' => $material->current_stock,
                'has_enough' => $material->current_stock >= $data['quantity'],
                'shortage' => max(0, $data['quantity'] - $material->current_stock),
            ];
        }

        return response()->json([
            'success' => true,
            'materials' => $result,
        ]);
    }

    /**
     * Get products that have BOM (for duplicate modal).
     */
    public function getProductsWithBOM()
    {
        $products = Product::has('bom')
            ->withCount('bom')
            ->orderBy('name')
            ->get(['id', 'name']);

        return response()->json([
            'success' => true,
            'products' => $products->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'bom_count' => $product->bom_count,
                ];
            }),
        ]);
    }

    /**
     * Get BOM data as JSON (for API use).
     */
    public function getBOM(Product $product)
    {
        $product->load([
            'bom.material',
            'bom.variants.materialOverride',
        ]);

        return response()->json([
            'success' => true,
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'available_sizes' => $product->available_sizes,
                'available_colors' => $product->available_colors,
            ],
            'bom' => $product->bom,
        ]);
    }
}
