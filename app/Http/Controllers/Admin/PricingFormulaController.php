<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PricingFormula;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Services\PricingFormulaService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class PricingFormulaController extends Controller
{
    protected PricingFormulaService $pricingService;

    public function __construct(PricingFormulaService $pricingService)
    {
        $this->middleware(['auth', 'approved']);
        $this->pricingService = $pricingService;
    }

    public function index(Request $request)
    {
        $formulas = PricingFormula::with('productCategory')
            ->withCount('products')
            ->orderBy('priority', 'desc')
            ->orderBy('name')
            ->get();

        $summary = $this->pricingService->getPricingSummary();
        $templates = $this->pricingService->getFormulaTemplates();

        return Inertia::render('Admin/PricingFormulas/Index', [
            'formulas' => $formulas,
            'summary' => $summary,
            'templates' => $templates,
        ]);
    }

    public function create()
    {
        $categories = ProductCategory::orderBy('name')->get();
        $templates = $this->pricingService->getFormulaTemplates();

        return Inertia::render('Admin/PricingFormulas/Create', [
            'categories' => $categories,
            'templates' => $templates,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'product_category_id' => 'nullable|exists:product_categories,id',
            'formula_config' => 'required|array',
            'formula_config.markup' => 'nullable|numeric|min:0',
            'formula_config.overhead' => 'nullable|numeric|min:0',
            'formula_config.embroidery_multiplier' => 'nullable|numeric|min:0',
            'formula_config.category_multipliers' => 'nullable|array',
            'target_margin_percent' => 'nullable|numeric|min:0|max:99',
            'minimum_price' => 'nullable|numeric|min:0',
            'is_default' => 'boolean',
            'is_active' => 'boolean',
            'priority' => 'integer|min:0',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        PricingFormula::create($validated);

        return redirect()->route('admin.pricing-formulas.index')
            ->with('message', 'Fórmula criada com sucesso!');
    }

    public function show(PricingFormula $formula)
    {
        $formula->load(['productCategory', 'products' => function ($query) {
            $query->limit(20);
        }]);

        // Get sample calculations
        $sampleProducts = Product::whereHas('activeBom')
            ->limit(5)
            ->get();

        $sampleCalculations = [];
        foreach ($sampleProducts as $product) {
            $sampleCalculations[] = $this->pricingService->calculatePrice($product, $formula);
        }

        return Inertia::render('Admin/PricingFormulas/Show', [
            'formula' => $formula,
            'sampleCalculations' => $sampleCalculations,
        ]);
    }

    public function edit(PricingFormula $formula)
    {
        $categories = ProductCategory::orderBy('name')->get();
        $templates = $this->pricingService->getFormulaTemplates();

        return Inertia::render('Admin/PricingFormulas/Edit', [
            'formula' => $formula,
            'categories' => $categories,
            'templates' => $templates,
        ]);
    }

    public function update(Request $request, PricingFormula $formula)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'product_category_id' => 'nullable|exists:product_categories,id',
            'formula_config' => 'required|array',
            'target_margin_percent' => 'nullable|numeric|min:0|max:99',
            'minimum_price' => 'nullable|numeric|min:0',
            'is_default' => 'boolean',
            'is_active' => 'boolean',
            'priority' => 'integer|min:0',
        ]);

        $formula->update($validated);

        return redirect()->route('admin.pricing-formulas.index')
            ->with('message', 'Fórmula atualizada com sucesso!');
    }

    public function destroy(PricingFormula $formula)
    {
        // Remove formula from products
        Product::where('pricing_formula_id', $formula->id)
            ->update(['pricing_formula_id' => null]);

        $formula->delete();

        return redirect()->route('admin.pricing-formulas.index')
            ->with('message', 'Fórmula removida com sucesso!');
    }

    public function preview(Request $request)
    {
        $validated = $request->validate([
            'product_ids' => 'required|array',
            'product_ids.*' => 'exists:products,id',
            'formula_config' => 'required|array',
        ]);

        $products = Product::whereIn('id', $validated['product_ids'])->get();
        $previews = [];

        foreach ($products as $product) {
            $previews[] = $this->pricingService->previewPriceChange($product, $validated['formula_config']);
        }

        return response()->json([
            'success' => true,
            'previews' => $previews,
        ]);
    }

    public function applyToProducts(Request $request)
    {
        $validated = $request->validate([
            'formula_id' => 'required|exists:pricing_formulas,id',
            'product_ids' => 'required|array',
            'product_ids.*' => 'exists:products,id',
            'update_manual_price' => 'boolean',
        ]);

        $formula = PricingFormula::find($validated['formula_id']);
        $products = Product::whereIn('id', $validated['product_ids'])->get();

        $results = $this->pricingService->applyPrices(
            $products,
            $formula,
            $validated['update_manual_price'] ?? false
        );

        return back()->with('message', "Preços aplicados: {$results['applied']} produtos atualizados");
    }

    public function recalculate(Request $request)
    {
        $validated = $request->validate([
            'formula_id' => 'nullable|exists:pricing_formulas,id',
            'category_id' => 'nullable|exists:product_categories,id',
            'update_manual_price' => 'boolean',
        ]);

        $query = Product::whereHas('activeBom');

        if (!empty($validated['category_id'])) {
            $query->where('category_id', $validated['category_id']);
        }

        if (!empty($validated['formula_id'])) {
            $query->where('pricing_formula_id', $validated['formula_id']);
        }

        $products = $query->get();
        $formula = !empty($validated['formula_id'])
            ? PricingFormula::find($validated['formula_id'])
            : null;

        $results = $this->pricingService->applyPrices(
            $products,
            $formula,
            $validated['update_manual_price'] ?? false
        );

        return back()->with('message', "Recalculados: {$results['applied']} produtos");
    }

    public function getProductsForFormula(Request $request)
    {
        $query = Product::where('is_active', true)
            ->whereHas('activeBom')
            ->with(['productCategory', 'pricingFormula']);

        if ($request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->search) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        $products = $query->paginate(20)->withQueryString();

        // Add calculated prices
        $products->getCollection()->transform(function ($product) {
            $calcResult = $this->pricingService->calculatePrice($product);
            $product->calculated_price_preview = $calcResult['success'] ? $calcResult['calculated_price'] : null;
            $product->margin_preview = $calcResult['success'] ? $calcResult['margin_percent'] : null;
            return $product;
        });

        return response()->json($products);
    }
}
