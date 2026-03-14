<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BatchSimulation;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Services\BatchSimulationService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class BatchSimulationController extends Controller
{
    protected BatchSimulationService $simulationService;

    public function __construct(BatchSimulationService $simulationService)
    {
        $this->middleware(['auth', 'approved']);
        $this->simulationService = $simulationService;
    }

    public function index(Request $request)
    {
        $simulations = BatchSimulation::where('user_id', auth()->id())
            ->where('status', '!=', 'archived')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Admin/BatchSimulation/Index', [
            'simulations' => $simulations,
        ]);
    }

    public function create()
    {
        $products = Product::where('is_active', true)
            ->whereHas('activeBom')
            ->with('productCategory')
            ->orderBy('name')
            ->get();

        $categories = ProductCategory::orderBy('name')->get();

        return Inertia::render('Admin/BatchSimulation/Create', [
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'products_config' => 'required|array|min:1',
            'products_config.*.product_id' => 'required|exists:products,id',
            'products_config.*.quantity' => 'required|integer|min:1',
            'products_config.*.color' => 'nullable|string',
            'products_config.*.size' => 'nullable|string',
        ]);

        $simulation = $this->simulationService->saveSimulation($validated, auth()->id());

        return redirect()->route('admin.batch-simulation.show', $simulation)
            ->with('message', 'Simulação criada com sucesso!');
    }

    public function show(BatchSimulation $simulation)
    {
        $this->authorize('view', $simulation);

        return Inertia::render('Admin/BatchSimulation/Show', [
            'simulation' => $simulation,
        ]);
    }

    public function calculate(Request $request)
    {
        $validated = $request->validate([
            'products_config' => 'required|array|min:1',
            'products_config.*.product_id' => 'required|exists:products,id',
            'products_config.*.quantity' => 'required|integer|min:1',
            'products_config.*.color' => 'nullable|string',
            'products_config.*.size' => 'nullable|string',
        ]);

        $results = $this->simulationService->calculateRequirements($validated['products_config']);

        return response()->json($results);
    }

    public function feasibility(Request $request)
    {
        $validated = $request->validate([
            'products_config' => 'required|array|min:1',
            'products_config.*.product_id' => 'required|exists:products,id',
            'products_config.*.quantity' => 'required|integer|min:1',
            'products_config.*.color' => 'nullable|string',
            'products_config.*.size' => 'nullable|string',
        ]);

        $results = $this->simulationService->getFeasibilityReport($validated['products_config']);

        return response()->json($results);
    }

    public function compare(Request $request)
    {
        $validated = $request->validate([
            'simulation_ids' => 'required|array|min:2',
            'simulation_ids.*' => 'exists:batch_simulations,id',
        ]);

        $comparison = $this->simulationService->compareSimulations($validated['simulation_ids']);

        return Inertia::render('Admin/BatchSimulation/Compare', [
            'comparison' => $comparison,
        ]);
    }

    public function purchaseSuggestions(Request $request)
    {
        $validated = $request->validate([
            'products_config' => 'required|array|min:1',
            'products_config.*.product_id' => 'required|exists:products,id',
            'products_config.*.quantity' => 'required|integer|min:1',
        ]);

        $suggestions = $this->simulationService->getPurchaseSuggestions($validated['products_config']);

        return response()->json($suggestions);
    }

    public function exportPdf(BatchSimulation $simulation)
    {
        $this->authorize('view', $simulation);

        $pdf = Pdf::loadView('reports.batch-simulation', [
            'simulation' => $simulation,
        ]);

        return $pdf->download("simulacao-{$simulation->id}.pdf");
    }

    public function archive(BatchSimulation $simulation)
    {
        $this->authorize('update', $simulation);

        $this->simulationService->archiveSimulation($simulation);

        return back()->with('message', 'Simulação arquivada com sucesso!');
    }

    public function destroy(BatchSimulation $simulation)
    {
        $this->authorize('delete', $simulation);

        $simulation->delete();

        return redirect()->route('admin.batch-simulation.index')
            ->with('message', 'Simulação removida com sucesso!');
    }

    public function getProducts(Request $request)
    {
        $query = Product::where('is_active', true)
            ->whereHas('activeBom')
            ->with(['productCategory', 'activeBom.material']);

        if ($request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->search) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        $products = $query->orderBy('name')->get();

        return response()->json($products);
    }
}
