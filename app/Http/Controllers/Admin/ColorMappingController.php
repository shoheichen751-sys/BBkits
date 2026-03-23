<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Material;
use App\Models\MaterialColorMapping;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ColorMappingController extends Controller
{
    /**
     * Display color mappings index page.
     */
    public function index(Request $request)
    {
        try {
            // Get all unique product colors from products
            $productColors = Product::pluck('available_colors')
                ->flatten()
                ->unique()
                ->filter()
                ->sort()
                ->values()
                ->toArray();

            // Get all materials with category relationship
            $materials = Material::with('category')
                ->orderBy('name')
                ->get(['id', 'name', 'sku', 'unit', 'category_id']);

            // Get all mappings with relationships
            $mappings = MaterialColorMapping::with(['baseMaterial.category', 'targetMaterial.category'])
                ->orderBy('product_color')
                ->orderBy('base_material_id')
                ->get();

            // Group mappings by color for easier display
            $mappingsByColor = $mappings->groupBy('product_color');

            // Calculate stats
            $stats = [
                'total_mappings' => $mappings->count(),
                'colors_configured' => $mappings->pluck('product_color')->unique()->count(),
                'total_product_colors' => count($productColors),
                'unconfigured_colors' => count($productColors) - $mappings->pluck('product_color')->unique()->count(),
            ];

            return Inertia::render('Admin/ColorMapping/Index', [
                'mappings' => $mappings,
                'mappingsByColor' => $mappingsByColor,
                'productColors' => $productColors,
                'materials' => $materials,
                'stats' => $stats,
            ]);
        } catch (\Exception $e) {
            \Log::error('Color Mapping Index Error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return Inertia::render('Admin/ColorMapping/Index', [
                'mappings' => [],
                'mappingsByColor' => [],
                'productColors' => [],
                'materials' => [],
                'stats' => [
                    'total_mappings' => 0,
                    'colors_configured' => 0,
                    'total_product_colors' => 0,
                    'unconfigured_colors' => 0,
                ],
                'error' => 'Erro ao carregar mapeamentos: ' . $e->getMessage(),
            ]);
        }
    }

    /**
     * Store a new color mapping.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_color' => 'required|string|max:50',
            'base_material_id' => 'required|exists:materials,id',
            'target_material_id' => 'required|exists:materials,id',
            'notes' => 'nullable|string|max:500',
        ], [
            'product_color.required' => 'Selecione uma cor de produto.',
            'base_material_id.required' => 'Selecione o material base.',
            'target_material_id.required' => 'Selecione o material de destino.',
        ]);

        // Check if mapping already exists
        $existing = MaterialColorMapping::where('product_color', $validated['product_color'])
            ->where('base_material_id', $validated['base_material_id'])
            ->first();

        if ($existing) {
            return back()->withErrors([
                'base_material_id' => 'Já existe um mapeamento para esta cor e material base.',
            ]);
        }

        MaterialColorMapping::create([
            'product_color' => $validated['product_color'],
            'base_material_id' => $validated['base_material_id'],
            'target_material_id' => $validated['target_material_id'],
            'notes' => $validated['notes'] ?? null,
            'is_active' => true,
        ]);

        return back()->with('success', 'Mapeamento criado com sucesso!');
    }

    /**
     * Update an existing color mapping.
     */
    public function update(Request $request, MaterialColorMapping $mapping)
    {
        $validated = $request->validate([
            'target_material_id' => 'required|exists:materials,id',
            'notes' => 'nullable|string|max:500',
            'is_active' => 'boolean',
        ]);

        $mapping->update($validated);

        return back()->with('success', 'Mapeamento atualizado com sucesso!');
    }

    /**
     * Delete a color mapping.
     */
    public function destroy(MaterialColorMapping $mapping)
    {
        $mapping->delete();

        return back()->with('success', 'Mapeamento removido com sucesso!');
    }

    /**
     * Bulk create mappings for a color.
     */
    public function bulkStore(Request $request)
    {
        $validated = $request->validate([
            'product_color' => 'required|string|max:50',
            'mappings' => 'required|array|min:1',
            'mappings.*.base_material_id' => 'required|exists:materials,id',
            'mappings.*.target_material_id' => 'required|exists:materials,id',
        ]);

        $created = 0;
        $skipped = 0;

        foreach ($validated['mappings'] as $mapping) {
            $existing = MaterialColorMapping::where('product_color', $validated['product_color'])
                ->where('base_material_id', $mapping['base_material_id'])
                ->first();

            if ($existing) {
                $skipped++;
                continue;
            }

            MaterialColorMapping::create([
                'product_color' => $validated['product_color'],
                'base_material_id' => $mapping['base_material_id'],
                'target_material_id' => $mapping['target_material_id'],
                'is_active' => true,
            ]);
            $created++;
        }

        $message = "Criados {$created} mapeamento(s).";
        if ($skipped > 0) {
            $message .= " {$skipped} já existiam e foram ignorados.";
        }

        return back()->with('success', $message);
    }

    /**
     * Toggle mapping active status.
     */
    public function toggleActive(MaterialColorMapping $mapping)
    {
        $mapping->update(['is_active' => !$mapping->is_active]);

        $status = $mapping->is_active ? 'ativado' : 'desativado';
        return back()->with('success', "Mapeamento {$status} com sucesso!");
    }

    /**
     * Get mappings for a specific color (JSON endpoint).
     */
    public function getByColor(string $color)
    {
        $mappings = MaterialColorMapping::where('product_color', $color)
            ->where('is_active', true)
            ->with(['baseMaterial', 'targetMaterial'])
            ->get();

        return response()->json([
            'success' => true,
            'color' => $color,
            'mappings' => $mappings,
        ]);
    }

    /**
     * Copy mappings from one color to another.
     */
    public function copyMappings(Request $request)
    {
        $validated = $request->validate([
            'source_color' => 'required|string|max:50',
            'target_color' => 'required|string|max:50|different:source_color',
        ]);

        $sourceMappings = MaterialColorMapping::where('product_color', $validated['source_color'])->get();

        if ($sourceMappings->isEmpty()) {
            return back()->withErrors(['source_color' => 'A cor de origem não possui mapeamentos.']);
        }

        $created = 0;
        $skipped = 0;

        foreach ($sourceMappings as $source) {
            $existing = MaterialColorMapping::where('product_color', $validated['target_color'])
                ->where('base_material_id', $source->base_material_id)
                ->first();

            if ($existing) {
                $skipped++;
                continue;
            }

            MaterialColorMapping::create([
                'product_color' => $validated['target_color'],
                'base_material_id' => $source->base_material_id,
                'target_material_id' => $source->target_material_id,
                'notes' => $source->notes,
                'is_active' => true,
            ]);
            $created++;
        }

        return back()->with('success', "Copiados {$created} mapeamento(s) para {$validated['target_color']}.");
    }
}
