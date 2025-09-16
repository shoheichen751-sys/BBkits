<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Material;
use App\Models\MaterialCategory;
use App\Models\Supplier;
use App\Rules\ValidMaterialUnit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MaterialsController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'approved', 'materials.access:view']);
        $this->middleware('materials.access:create')->only(['create', 'store']);
        $this->middleware('materials.access:edit')->only(['edit', 'update']);
        $this->middleware('materials.access:delete')->only(['destroy']);
    }

    public function index(Request $request)
    {
        $query = Material::with(['category', 'supplier']);

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('reference', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->has('category_id') && $request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('supplier_id') && $request->supplier_id) {
            $query->where('supplier_id', $request->supplier_id);
        }

        if ($request->has('stock_status')) {
            switch ($request->stock_status) {
                case 'low':
                    $query->whereColumn('current_stock', '<=', 'minimum_stock');
                    break;
                case 'out':
                    $query->where('current_stock', '<=', 0);
                    break;
                case 'ok':
                    $query->whereColumn('current_stock', '>', 'minimum_stock');
                    break;
            }
        }

        if ($request->has('active') && $request->active !== '') {
            $query->where('is_active', $request->boolean('active'));
        }

        $materials = $query->orderBy('name')->paginate(20);

        $categories = MaterialCategory::active()->ordered()->get(['id', 'name']);
        $suppliers = Supplier::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Materials/SimpleIndex', [
            'materials' => $materials,
            'categories' => $categories,
            'suppliers' => $suppliers,
            'filters' => [
                'search' => $request->get('search'),
                'category_id' => $request->get('category_id'),
                'supplier_id' => $request->get('supplier_id'),
                'stock_status' => $request->get('stock_status'),
                'active' => $request->get('active'),
            ],
            'stats' => [
                'total' => Material::count(),
                'active' => Material::where('is_active', true)->count(),
                'low_stock' => Material::whereColumn('current_stock', '<=', 'minimum_stock')->count(),
                'out_of_stock' => Material::where('current_stock', '<=', 0)->count(),
            ],
        ]);
    }

    public function create()
    {
        $categories = MaterialCategory::active()->ordered()->get(['id', 'name', 'parent_id'])
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->full_name,
                ];
            });

        $suppliers = Supplier::orderBy('name')->get(['id', 'name']);
        $validUnits = ValidMaterialUnit::getValidUnits();

        return Inertia::render('Admin/Materials/Create', [
            'categories' => $categories,
            'suppliers' => $suppliers,
            'validUnits' => $validUnits,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'reference' => 'required|string|max:100|unique:materials',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'unit' => ['required', 'string', 'max:20', new ValidMaterialUnit()],
            'category_id' => 'nullable|exists:material_categories,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'secondary_supplier_id' => 'nullable|exists:suppliers,id|different:supplier_id',
            'purchase_price' => 'nullable|numeric|min:0',
            'current_stock' => 'nullable|numeric|min:0',
            'minimum_stock' => 'nullable|numeric|min:0',
            'lead_time_days' => 'nullable|integer|min:0',
            'purchase_multiple' => 'nullable|integer|min:1',
            'weight_per_unit' => 'nullable|numeric|min:0',
            'is_active' => 'boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'unit_conversions' => 'nullable|array',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('materials', 'public');
            $validated['image_path'] = $imagePath;
        }

        $material = Material::create($validated);

        return redirect()
            ->route('admin.materials.show', $material)
            ->with('success', 'Material criado com sucesso!');
    }

    public function show(Material $material)
    {
        $material->load(['category', 'supplier', 'secondarySupplier', 'inventoryTransactions.user']);

        $stats = [
            'stock_value' => $material->current_stock * $material->purchase_price,
            'days_of_stock' => $this->calculateDaysOfStock($material),
            'transactions_count' => $material->inventoryTransactions()->count(),
            'last_transaction' => $material->inventoryTransactions()->latest()->first(),
        ];

        return Inertia::render('Admin/Materials/Show', [
            'material' => $material,
            'stats' => $stats,
        ]);
    }

    public function edit(Material $material)
    {
        $categories = MaterialCategory::active()->ordered()->get(['id', 'name', 'parent_id'])
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->full_name,
                ];
            });

        $suppliers = Supplier::orderBy('name')->get(['id', 'name']);
        $validUnits = ValidMaterialUnit::getValidUnits();

        return Inertia::render('Admin/Materials/Edit', [
            'material' => $material,
            'categories' => $categories,
            'suppliers' => $suppliers,
            'validUnits' => $validUnits,
        ]);
    }

    public function update(Request $request, Material $material)
    {
        $validated = $request->validate([
            'reference' => 'required|string|max:100|unique:materials,reference,' . $material->id,
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'unit' => ['required', 'string', 'max:20', new ValidMaterialUnit()],
            'category_id' => 'nullable|exists:material_categories,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'secondary_supplier_id' => 'nullable|exists:suppliers,id|different:supplier_id',
            'purchase_price' => 'nullable|numeric|min:0',
            'current_stock' => 'nullable|numeric|min:0',
            'minimum_stock' => 'nullable|numeric|min:0',
            'lead_time_days' => 'nullable|integer|min:0',
            'purchase_multiple' => 'nullable|integer|min:1',
            'weight_per_unit' => 'nullable|numeric|min:0',
            'is_active' => 'boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'unit_conversions' => 'nullable|array',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($material->image_path) {
                Storage::disk('public')->delete($material->image_path);
            }

            $imagePath = $request->file('image')->store('materials', 'public');
            $validated['image_path'] = $imagePath;
        }

        $material->update($validated);

        return redirect()
            ->route('admin.materials.show', $material)
            ->with('success', 'Material atualizado com sucesso!');
    }

    public function destroy(Material $material)
    {
        // Check if material has inventory transactions
        if ($material->inventoryTransactions()->count() > 0) {
            return back()->withErrors(['delete' => 'Não é possível excluir material que possui movimentações de estoque.']);
        }

        // Delete image if exists
        if ($material->image_path) {
            Storage::disk('public')->delete($material->image_path);
        }

        $material->delete();

        return redirect()
            ->route('admin.materials.index')
            ->with('success', 'Material excluído com sucesso!');
    }

    public function uploadImage(Request $request, Material $material)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Delete old image if exists
        if ($material->image_path) {
            Storage::disk('public')->delete($material->image_path);
        }

        $imagePath = $request->file('image')->store('materials', 'public');
        $material->update(['image_path' => $imagePath]);

        return response()->json([
            'success' => true,
            'image_url' => Storage::url($imagePath),
        ]);
    }

    public function deleteImage(Material $material)
    {
        if ($material->image_path) {
            Storage::disk('public')->delete($material->image_path);
            $material->update(['image_path' => null]);
        }

        return response()->json(['success' => true]);
    }

    private function calculateDaysOfStock(Material $material): ?int
    {
        // Calculate average daily consumption over last 30 days
        $avgDailyConsumption = $material->inventoryTransactions()
            ->where('type', 'consumption')
            ->where('created_at', '>=', now()->subDays(30))
            ->avg(\DB::raw('ABS(quantity)'));

        if (!$avgDailyConsumption || $avgDailyConsumption <= 0) {
            return null;
        }

        return (int) round($material->current_stock / $avgDailyConsumption);
    }
}