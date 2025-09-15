<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Material;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MaterialController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'approved']);
        $this->middleware('materials.access:view')->only(['index', 'show']);
        $this->middleware('materials.access:edit')->only(['create', 'store', 'edit', 'update', 'adjustStock']);
        $this->middleware('materials.access:delete')->only(['destroy']);
    }

    public function index(Request $request)
    {
        $query = Material::with(['supplier', 'secondarySupplier'])
            ->when($request->search, function ($query, $search) {
                return $query->where('name', 'like', "%{$search}%")
                    ->orWhere('reference', 'like', "%{$search}%");
            })
            ->when($request->status, function ($query, $status) {
                if ($status === 'low_stock') {
                    return $query->lowStock();
                } elseif ($status === 'out_of_stock') {
                    return $query->where('current_stock', '<=', 0);
                } elseif ($status === 'active') {
                    return $query->active();
                }
                return $query;
            })
            ->orderBy($request->sort ?? 'name', $request->direction ?? 'asc');

        $materials = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/Materials/Index', [
            'materials' => $materials,
            'filters' => $request->only(['search', 'status', 'sort', 'direction']),
            'stats' => [
                'total' => Material::count(),
                'active' => Material::active()->count(),
                'low_stock' => Material::lowStock()->count(),
                'out_of_stock' => Material::where('current_stock', '<=', 0)->count(),
            ]
        ]);
    }

    public function create()
    {
        $suppliers = Supplier::active()->orderBy('name')->get();

        return Inertia::render('Admin/Materials/Create', [
            'suppliers' => $suppliers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'reference' => 'required|string|max:20|unique:materials,reference',
            'name' => 'required|string|max:255',
            'unit' => 'required|in:m,cm,g,unit,pair,roll,kg',
            'purchase_price' => 'required|numeric|min:0',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'secondary_supplier_id' => 'nullable|exists:suppliers,id|different:supplier_id',
            'lead_time_days' => 'required|integer|min:0',
            'current_stock' => 'required|numeric|min:0',
            'minimum_stock' => 'required|numeric|min:0',
            'purchase_multiple' => 'required|integer|min:1',
            'weight_per_unit' => 'nullable|numeric|min:0',
            'is_active' => 'boolean',
        ]);

        Material::create($validated);

        return redirect()->route('admin.materials.index')
            ->with('message', 'Material criado com sucesso!');
    }

    public function show(Material $material)
    {
        $material->load(['supplier', 'secondarySupplier', 'inventoryTransactions.user']);

        return Inertia::render('Admin/Materials/Show', [
            'material' => $material,
            'transactions' => $material->inventoryTransactions()
                ->with('user')
                ->latest()
                ->paginate(10),
        ]);
    }

    public function edit(Material $material)
    {
        $suppliers = Supplier::active()->orderBy('name')->get();

        return Inertia::render('Admin/Materials/Edit', [
            'material' => $material->load(['supplier', 'secondarySupplier']),
            'suppliers' => $suppliers,
        ]);
    }

    public function update(Request $request, Material $material)
    {
        $validated = $request->validate([
            'reference' => 'required|string|max:20|unique:materials,reference,' . $material->id,
            'name' => 'required|string|max:255',
            'unit' => 'required|in:m,cm,g,unit,pair,roll,kg',
            'purchase_price' => 'required|numeric|min:0',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'secondary_supplier_id' => 'nullable|exists:suppliers,id|different:supplier_id',
            'lead_time_days' => 'required|integer|min:0',
            'current_stock' => 'required|numeric|min:0',
            'minimum_stock' => 'required|numeric|min:0',
            'purchase_multiple' => 'required|integer|min:1',
            'weight_per_unit' => 'nullable|numeric|min:0',
            'is_active' => 'boolean',
        ]);

        $material->update($validated);

        return redirect()->route('admin.materials.index')
            ->with('message', 'Material atualizado com sucesso!');
    }

    public function destroy(Material $material)
    {
        $material->delete();

        return redirect()->route('admin.materials.index')
            ->with('message', 'Material removido com sucesso!');
    }

    public function adjustStock(Request $request, Material $material)
    {
        $validated = $request->validate([
            'quantity' => 'required|numeric',
            'type' => 'required|in:purchase,consumption,adjustment,return',
            'reference' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000',
            'unit_cost' => 'nullable|numeric|min:0',
        ]);

        $material->adjustStock(
            $validated['quantity'],
            $validated['type'],
            $validated['reference'] ?? null,
            $validated['notes'] ?? null
        );

        if ($validated['type'] === 'purchase' && isset($validated['unit_cost'])) {
            $material->inventoryTransactions()->latest()->first()->update([
                'unit_cost' => $validated['unit_cost']
            ]);
        }

        return back()->with('message', 'Estoque ajustado com sucesso!');
    }
}