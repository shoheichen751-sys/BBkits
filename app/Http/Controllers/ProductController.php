<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'image_url' => 'nullable|string|max:500',
            'allows_embroidery' => 'boolean',
            'sizes' => 'nullable|string',
            'colors' => 'nullable|string',
            'is_active' => 'boolean',
            'stock_quantity' => 'integer|min:0',
        ]);
        
        // Parse JSON strings for sizes and colors
        if (isset($validated['sizes'])) {
            $validated['available_sizes'] = json_decode($validated['sizes'], true);
            unset($validated['sizes']);
        }
        if (isset($validated['colors'])) {
            $validated['available_colors'] = json_decode($validated['colors'], true);
            unset($validated['colors']);
        }

        // Handle image upload or set default
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
            $validated['image_url'] = '/storage/' . $imagePath;
        } elseif (empty($validated['image_url'])) {
            // Set default image based on category
            $categoryName = $request->category_id ? \App\Models\ProductCategory::find($request->category_id)?->name : 'Produto';
            $defaultImages = [
                'Bolsas' => 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop',
                'Mochilas' => 'https://images.unsplash.com/photo-1582017334482-4c4b9c4c4e87?w=300&h=200&fit=crop',
                'Frasqueiras' => 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=300&h=200&fit=crop',
                'Malas' => 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=300&h=200&fit=crop',
                'Acessórios' => 'https://images.unsplash.com/photo-1556306535-38febf6782e7?w=300&h=200&fit=crop'
            ];
            $validated['image_url'] = $defaultImages[$categoryName] ?? 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop';
        }

        // Remove the image field from validated data since it's not in the database
        unset($validated['image']);

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
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'image_url' => 'nullable|string|max:500',
            'allows_embroidery' => 'boolean',
            'sizes' => 'nullable|string',
            'colors' => 'nullable|string',
            'is_active' => 'boolean',
            'stock_quantity' => 'integer|min:0',
        ]);
        
        // Parse JSON strings for sizes and colors
        if (isset($validated['sizes'])) {
            $validated['available_sizes'] = json_decode($validated['sizes'], true);
            unset($validated['sizes']);
        }
        if (isset($validated['colors'])) {
            $validated['available_colors'] = json_decode($validated['colors'], true);
            unset($validated['colors']);
        }

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if it exists and is uploaded (not external URL)
            if ($product->image_url && str_contains($product->image_url, '/storage/')) {
                $oldImagePath = str_replace('/storage/', '', $product->image_url);
                Storage::disk('public')->delete($oldImagePath);
            }
            
            $imagePath = $request->file('image')->store('products', 'public');
            $validated['image_url'] = '/storage/' . $imagePath;
        }

        // Remove the image field from validated data since it's not in the database
        unset($validated['image']);

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