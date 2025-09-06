<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        if (auth()->user()->role !== 'admin' && auth()->user()->role !== 'financeiro') {
            abort(403, 'Unauthorized');
        }

        $query = Product::with('productCategory');

        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhereHas('productCategory', function ($cat) use ($request) {
                      $cat->where('name', 'like', '%' . $request->search . '%');
                  });
            });
        }

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('is_active', $request->status === 'active');
        }

        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category_id', $request->category);
        }

        if ($request->has('embroidery') && $request->embroidery !== 'all') {
            $query->where('allows_embroidery', $request->embroidery === 'yes');
        }

        $products = $query->latest()
                         ->paginate(15);

        // Get all active categories from database
        $categories = ProductCategory::where('is_active', true)
                                    ->orderBy('sort_order')
                                    ->get();

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only(['search', 'status', 'category', 'embroidery']),
        ]);
    }

    public function store(Request $request)
    {
        if (auth()->user()->role !== 'admin' && auth()->user()->role !== 'financeiro') {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:product_categories,id',
            'image_url' => 'nullable|url|max:500',
            'allows_embroidery' => 'boolean',
            'available_sizes' => 'nullable|array',
            'available_colors' => 'nullable|array',
            'is_active' => 'boolean',
            'stock_quantity' => 'integer|min:0',
        ]);

        $product = Product::create($validated);

        return redirect()->back()->with('success', 'Produto criado com sucesso!');
    }

    public function update(Request $request, Product $product)
    {
        if (auth()->user()->role !== 'admin' && auth()->user()->role !== 'financeiro') {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:product_categories,id',
            'image_url' => 'nullable|url|max:500',
            'allows_embroidery' => 'boolean',
            'available_sizes' => 'nullable|array',
            'available_colors' => 'nullable|array',
            'is_active' => 'boolean',
            'stock_quantity' => 'integer|min:0',
        ]);

        $product->update($validated);

        return redirect()->back()->with('success', 'Produto atualizado com sucesso!');
    }

    public function destroy(Product $product)
    {
        if (auth()->user()->role !== 'admin' && auth()->user()->role !== 'financeiro') {
            abort(403, 'Unauthorized');
        }

        // Check if product is being used in any sales
        if ($product->saleProducts()->exists()) {
            return redirect()->back()->with('error', 'Não é possível excluir este produto pois ele já foi usado em vendas.');
        }

        $product->delete();

        return redirect()->back()->with('success', 'Produto removido com sucesso!');
    }

    // API endpoints for frontend
    public function apiIndex(Request $request)
    {
        $query = Product::active()->with('productCategory');

        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category_id', $request->category);
        }

        if ($request->has('allows_embroidery')) {
            $query->where('allows_embroidery', $request->boolean('allows_embroidery'));
        }

        $products = $query->orderBy('name')
                         ->get();

        return response()->json($products);
    }

    public function show(Product $product)
    {
        return response()->json([
            'product' => $product,
            'in_stock' => $product->isInStock(),
            'available_sizes' => $product->available_sizes ?? [],
            'available_colors' => $product->available_colors ?? [],
        ]);
    }

    public function apiCategories()
    {
        $categories = ProductCategory::where('is_active', true)
                                  ->orderBy('sort_order')
                                  ->orderBy('name')
                                  ->get();

        return response()->json($categories);
    }
}