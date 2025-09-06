<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\EmbroideryFont;
use App\Models\EmbroideryColor;
use App\Models\EmbroideryPosition;
use App\Models\EmbroideryDesign;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmbroideryController extends Controller
{
    public function dashboard()
    {
        if (auth()->user()->role !== 'admin' && auth()->user()->role !== 'financeiro') {
            abort(403, 'Unauthorized');
        }

        $stats = [
            'total_fonts' => EmbroideryFont::count(),
            'active_fonts' => EmbroideryFont::where('is_active', true)->count(),
            'total_colors' => EmbroideryColor::count(),
            'active_colors' => EmbroideryColor::where('is_active', true)->count(),
            'total_positions' => EmbroideryPosition::count(),
            'active_positions' => EmbroideryPosition::where('is_active', true)->count(),
            'total_designs' => EmbroideryDesign::count(),
            'active_designs' => EmbroideryDesign::where('is_active', true)->count(),
            'total_products' => Product::count(),
            'embroidery_enabled_products' => Product::where('allows_embroidery', true)->count(),
        ];

        return Inertia::render('Admin/Embroidery/Dashboard', [
            'stats' => $stats,
        ]);
    }

    public function fonts(Request $request)
    {
        if (auth()->user()->role !== 'admin' && auth()->user()->role !== 'financeiro') {
            abort(403, 'Unauthorized');
        }

        $query = EmbroideryFont::query();

        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('display_name', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('is_active', $request->status === 'active');
        }

        $fonts = $query->orderBy('sort_order')
                      ->orderBy('name')
                      ->paginate(15);

        return Inertia::render('Admin/Embroidery/Fonts/Index', [
            'fonts' => $fonts,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function storeFont(Request $request)
    {
        if (auth()->user()->role !== 'admin' && auth()->user()->role !== 'financeiro') {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:embroidery_fonts,name',
            'display_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'preview_image' => 'nullable|string|max:500',
            'additional_cost' => 'required|numeric|min:0',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        $font = EmbroideryFont::create($validated);

        return redirect()->back()->with('success', 'Fonte de bordado criada com sucesso!');
    }

    public function updateFont(Request $request, EmbroideryFont $font)
    {
        if (auth()->user()->role !== 'admin' && auth()->user()->role !== 'financeiro') {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:embroidery_fonts,name,' . $font->id,
            'display_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'preview_image' => 'nullable|string|max:500',
            'additional_cost' => 'required|numeric|min:0',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        $font->update($validated);

        return redirect()->back()->with('success', 'Fonte de bordado atualizada com sucesso!');
    }

    public function destroyFont(EmbroideryFont $font)
    {
        if (auth()->user()->role !== 'admin' && auth()->user()->role !== 'financeiro') {
            abort(403, 'Unauthorized');
        }

        $font->delete();

        return redirect()->back()->with('success', 'Fonte de bordado removida com sucesso!');
    }

    public function colors(Request $request)
    {
        if (auth()->user()->role !== 'admin' && auth()->user()->role !== 'financeiro') {
            abort(403, 'Unauthorized');
        }

        $query = EmbroideryColor::query();

        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('hex_code', 'like', '%' . $request->search . '%')
                  ->orWhere('thread_code', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('is_active', $request->status === 'active');
        }

        $colors = $query->orderBy('sort_order')
                       ->orderBy('name')
                       ->paginate(15);

        return Inertia::render('Admin/Embroidery/Colors/Index', [
            'colors' => $colors,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function storeColor(Request $request)
    {
        if (auth()->user()->role !== 'admin' && auth()->user()->role !== 'financeiro') {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'hex_code' => 'required|string|size:7|starts_with:#|unique:embroidery_colors,hex_code',
            'thread_code' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'additional_cost' => 'required|numeric|min:0',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        // Additional validation for hex code format
        if (!ctype_xdigit(substr($validated['hex_code'], 1))) {
            return back()->withErrors(['hex_code' => 'The hex code must be a valid hexadecimal color.']);
        }

        $color = EmbroideryColor::create($validated);

        return redirect()->back()->with('success', 'Cor de bordado criada com sucesso!');
    }

    public function updateColor(Request $request, EmbroideryColor $color)
    {
        if (auth()->user()->role !== 'admin' && auth()->user()->role !== 'financeiro') {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'hex_code' => 'required|string|size:7|starts_with:#|unique:embroidery_colors,hex_code,' . $color->id,
            'thread_code' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'additional_cost' => 'required|numeric|min:0',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        // Additional validation for hex code format
        if (!ctype_xdigit(substr($validated['hex_code'], 1))) {
            return back()->withErrors(['hex_code' => 'The hex code must be a valid hexadecimal color.']);
        }

        $color->update($validated);

        return redirect()->back()->with('success', 'Cor de bordado atualizada com sucesso!');
    }

    public function destroyColor(EmbroideryColor $color)
    {
        if (auth()->user()->role !== 'admin' && auth()->user()->role !== 'financeiro') {
            abort(403, 'Unauthorized');
        }

        $color->delete();

        return redirect()->back()->with('success', 'Cor de bordado removida com sucesso!');
    }

    public function positions(Request $request)
    {
        if (auth()->user()->role !== 'admin' && auth()->user()->role !== 'financeiro') {
            abort(403, 'Unauthorized');
        }

        $query = EmbroideryPosition::query();

        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('display_name', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('is_active', $request->status === 'active');
        }

        $positions = $query->orderBy('sort_order')
                          ->orderBy('name')
                          ->paginate(15);

        return Inertia::render('Admin/Embroidery/Positions/Index', [
            'positions' => $positions,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function storePosition(Request $request)
    {
        if (auth()->user()->role !== 'admin' && auth()->user()->role !== 'financeiro') {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:embroidery_positions,name',
            'display_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'additional_cost' => 'required|numeric|min:0',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
            'preview_image' => 'nullable|string|max:500',
            'compatible_products' => 'nullable|array',
        ]);

        $position = EmbroideryPosition::create($validated);

        return redirect()->back()->with('success', 'Posição de bordado criada com sucesso!');
    }

    public function updatePosition(Request $request, EmbroideryPosition $position)
    {
        if (auth()->user()->role !== 'admin' && auth()->user()->role !== 'financeiro') {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:embroidery_positions,name,' . $position->id,
            'display_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'additional_cost' => 'required|numeric|min:0',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
            'preview_image' => 'nullable|string|max:500',
            'compatible_products' => 'nullable|array',
        ]);

        $position->update($validated);

        return redirect()->back()->with('success', 'Posição de bordado atualizada com sucesso!');
    }

    public function destroyPosition(EmbroideryPosition $position)
    {
        if (auth()->user()->role !== 'admin' && auth()->user()->role !== 'financeiro') {
            abort(403, 'Unauthorized');
        }

        $position->delete();

        return redirect()->back()->with('success', 'Posição de bordado removida com sucesso!');
    }

    public function designs(Request $request)
    {
        if (auth()->user()->role !== 'admin' && auth()->user()->role !== 'financeiro') {
            abort(403, 'Unauthorized');
        }

        $query = EmbroideryDesign::query();

        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%')
                  ->orWhere('category', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->has('category') && $request->category && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('is_active', $request->status === 'active');
        }

        $designs = $query->orderBy('sort_order')
                        ->orderBy('name')
                        ->paginate(15);

        $categories = EmbroideryDesign::getCategories();

        return Inertia::render('Admin/Embroidery/Designs/Index', [
            'designs' => $designs,
            'categories' => $categories,
            'filters' => $request->only(['search', 'status', 'category']),
        ]);
    }

    public function storeDesign(Request $request)
    {
        if (auth()->user()->role !== 'admin' && auth()->user()->role !== 'financeiro') {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:embroidery_designs,slug',
            'description' => 'nullable|string',
            'category' => 'required|string|max:255',
            'image_url' => 'nullable|string|max:500',
            'design_file_url' => 'nullable|string|max:500',
            'additional_cost' => 'required|numeric|min:0',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
            'compatible_positions' => 'nullable|array',
            'compatible_colors' => 'nullable|array',
        ]);

        $design = EmbroideryDesign::create($validated);

        return redirect()->back()->with('success', 'Design de bordado criado com sucesso!');
    }

    public function updateDesign(Request $request, EmbroideryDesign $design)
    {
        if (auth()->user()->role !== 'admin' && auth()->user()->role !== 'financeiro') {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:embroidery_designs,slug,' . $design->id,
            'description' => 'nullable|string',
            'category' => 'required|string|max:255',
            'image_url' => 'nullable|string|max:500',
            'design_file_url' => 'nullable|string|max:500',
            'additional_cost' => 'required|numeric|min:0',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
            'compatible_positions' => 'nullable|array',
            'compatible_colors' => 'nullable|array',
        ]);

        $design->update($validated);

        return redirect()->back()->with('success', 'Design de bordado atualizado com sucesso!');
    }

    public function destroyDesign(EmbroideryDesign $design)
    {
        if (auth()->user()->role !== 'admin' && auth()->user()->role !== 'financeiro') {
            abort(403, 'Unauthorized');
        }

        $design->delete();

        return redirect()->back()->with('success', 'Design de bordado removido com sucesso!');
    }

    // API methods for frontend forms
    public function apiFonts()
    {
        $fonts = EmbroideryFont::active()->ordered()->get();
        return response()->json($fonts);
    }

    public function apiColors()
    {
        $colors = EmbroideryColor::active()->ordered()->get();
        return response()->json($colors);
    }

    public function apiPositions()
    {
        $positions = EmbroideryPosition::active()->ordered()->get();
        return response()->json($positions);
    }

    public function apiDesigns()
    {
        $designs = EmbroideryDesign::active()->orderBy('sort_order')->orderBy('name')->get();
        return response()->json($designs);
    }

    public function apiDesignsByCategory(Request $request)
    {
        $category = $request->get('category');
        
        $query = EmbroideryDesign::active()->orderBy('sort_order')->orderBy('name');
        
        if ($category) {
            $query->byCategory($category);
        }
        
        $designs = $query->get();
        return response()->json($designs);
    }

    public function apiProductCompatiblePositions(Product $product)
    {
        $positions = EmbroideryPosition::active()->ordered()->get();
        
        // Filter positions that are compatible with this product
        $compatiblePositions = $positions->filter(function ($position) use ($product) {
            return $position->isCompatibleWith($product->id);
        });
        
        return response()->json($compatiblePositions->values());
    }

    public function apiCalculateEmbroideryPrice(Request $request)
    {
        $validated = $request->validate([
            'embroidery_type' => 'required|in:text,design,both',
            'font_id' => 'nullable|exists:embroidery_fonts,id',
            'color_id' => 'nullable|exists:embroidery_colors,id',
            'design_id' => 'nullable|exists:embroidery_designs,id',
            'position' => 'nullable|string',
            'text' => 'nullable|string|max:255'
        ]);

        $totalCost = 0;
        $fontCost = 0;
        $colorCost = 0;
        $designCost = 0;

        // Calculate font cost for text embroidery
        if (($validated['embroidery_type'] === 'text' || $validated['embroidery_type'] === 'both') && $validated['font_id']) {
            $font = EmbroideryFont::find($validated['font_id']);
            $fontCost = $font->additional_cost;
            $totalCost += $fontCost;
        }

        // Calculate color cost (applies to both text and design)
        if ($validated['color_id']) {
            $color = EmbroideryColor::find($validated['color_id']);
            $colorCost = $color->additional_cost;
            $totalCost += $colorCost;
        }

        // Calculate design cost for design embroidery
        if (($validated['embroidery_type'] === 'design' || $validated['embroidery_type'] === 'both') && $validated['design_id']) {
            $design = EmbroideryDesign::find($validated['design_id']);
            $designCost = $design->additional_cost;
            $totalCost += $designCost;
        }

        return response()->json([
            'total_cost' => $totalCost,
            'font_cost' => $fontCost,
            'color_cost' => $colorCost,
            'design_cost' => $designCost,
            'position_cost' => 0 // Placeholder for future position-based pricing
        ]);
    }
}