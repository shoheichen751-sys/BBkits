<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Thread;
use App\Models\EmbroideryColor;
use App\Models\StandardThreadSubstitute;
use App\Services\ThreadInventoryService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class ThreadController extends Controller
{
    protected ThreadInventoryService $threadService;

    public function __construct(ThreadInventoryService $threadService)
    {
        $this->middleware(['auth', 'approved']);
        $this->threadService = $threadService;
    }

    public function index(Request $request)
    {
        $query = Thread::with('embroideryColor')
            ->when($request->search, function ($query, $search) {
                return $query->where('name', 'like', "%{$search}%")
                    ->orWhere('color_code', 'like', "%{$search}%")
                    ->orWhere('brand', 'like', "%{$search}%");
            })
            ->when($request->type, function ($query, $type) {
                return $query->where('type', $type);
            })
            ->when($request->status === 'active', function ($query) {
                return $query->where('is_active', true);
            })
            ->when($request->status === 'low_stock', function ($query) {
                return $query->lowStock();
            })
            ->orderBy($request->sort ?? 'name', $request->direction ?? 'asc');

        $threads = $query->paginate(20)->withQueryString();

        // Add computed attributes
        $threads->getCollection()->transform(function ($thread) {
            $thread->stock_status = $thread->stock_status;
            $thread->is_low_stock = $thread->is_low_stock;
            return $thread;
        });

        $summary = $this->threadService->getInventorySummary();

        return Inertia::render('Admin/Threads/Index', [
            'threads' => $threads,
            'filters' => $request->only(['search', 'type', 'status', 'sort', 'direction']),
            'summary' => $summary,
        ]);
    }

    public function create()
    {
        $embroideryColors = EmbroideryColor::active()->ordered()->get();
        $standardThreads = Thread::standard()->active()->get();

        return Inertia::render('Admin/Threads/Create', [
            'embroideryColors' => $embroideryColors,
            'standardThreads' => $standardThreads,
            'materialTypes' => ['polyester', 'rayon', 'metallic', 'cotton', 'silk'],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'brand' => 'nullable|string|max:255',
            'color_code' => 'required|string|max:50',
            'hex_code' => 'nullable|string|max:7',
            'embroidery_color_id' => 'nullable|exists:embroidery_colors,id',
            'type' => 'required|in:standard,specialty',
            'material_type' => 'required|string|max:50',
            'spool_count' => 'required|integer|min:0',
            'meters_per_spool' => 'required|numeric|min:0',
            'minimum_spools' => 'required|integer|min:0',
            'purchase_price' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
            'is_active' => 'boolean',
            'substitute_ids' => 'nullable|array',
            'substitute_ids.*' => 'exists:threads,id',
        ]);

        // Calculate initial meters
        $validated['meters_remaining'] = $validated['spool_count'] * $validated['meters_per_spool'];

        $thread = Thread::create($validated);

        // Create substitutes if specialty thread
        if ($thread->type === 'specialty' && !empty($request->substitute_ids)) {
            foreach ($request->substitute_ids as $priority => $standardId) {
                StandardThreadSubstitute::create([
                    'specialty_thread_id' => $thread->id,
                    'standard_thread_id' => $standardId,
                    'priority' => $priority + 1,
                ]);
            }
        }

        // Link to embroidery color if specified
        if ($thread->embroidery_color_id) {
            EmbroideryColor::where('id', $thread->embroidery_color_id)
                ->update(['primary_thread_id' => $thread->id]);
        }

        return redirect()->route('admin.threads.index')
            ->with('message', 'Linha criada com sucesso!');
    }

    public function show(Thread $thread)
    {
        $thread->load(['embroideryColor', 'transactions' => function ($query) {
            $query->with('user')->latest()->take(20);
        }, 'standardSubstitutes.standardThread']);

        return Inertia::render('Admin/Threads/Show', [
            'thread' => $thread,
        ]);
    }

    public function edit(Thread $thread)
    {
        $thread->load(['standardSubstitutes.standardThread']);

        $embroideryColors = EmbroideryColor::active()->ordered()->get();
        $standardThreads = Thread::standard()->active()->where('id', '!=', $thread->id)->get();

        return Inertia::render('Admin/Threads/Edit', [
            'thread' => $thread,
            'embroideryColors' => $embroideryColors,
            'standardThreads' => $standardThreads,
            'materialTypes' => ['polyester', 'rayon', 'metallic', 'cotton', 'silk'],
        ]);
    }

    public function update(Request $request, Thread $thread)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'brand' => 'nullable|string|max:255',
            'color_code' => 'required|string|max:50',
            'hex_code' => 'nullable|string|max:7',
            'embroidery_color_id' => 'nullable|exists:embroidery_colors,id',
            'type' => 'required|in:standard,specialty',
            'material_type' => 'required|string|max:50',
            'meters_per_spool' => 'required|numeric|min:0',
            'minimum_spools' => 'required|integer|min:0',
            'purchase_price' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
            'is_active' => 'boolean',
            'substitute_ids' => 'nullable|array',
            'substitute_ids.*' => 'exists:threads,id',
        ]);

        $thread->update($validated);

        // Update substitutes
        if ($thread->type === 'specialty') {
            $thread->standardSubstitutes()->delete();
            foreach ($request->substitute_ids ?? [] as $priority => $standardId) {
                StandardThreadSubstitute::create([
                    'specialty_thread_id' => $thread->id,
                    'standard_thread_id' => $standardId,
                    'priority' => $priority + 1,
                ]);
            }
        }

        return redirect()->route('admin.threads.index')
            ->with('message', 'Linha atualizada com sucesso!');
    }

    public function destroy(Thread $thread)
    {
        $thread->delete();

        return redirect()->route('admin.threads.index')
            ->with('message', 'Linha removida com sucesso!');
    }

    public function adjustStock(Request $request, Thread $thread)
    {
        $validated = $request->validate([
            'type' => 'required|in:add_spools,consume_meters,adjustment',
            'spool_quantity' => 'required_if:type,add_spools,adjustment|integer',
            'meters_quantity' => 'required_if:type,consume_meters|numeric|min:0',
            'unit_price' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        switch ($validated['type']) {
            case 'add_spools':
                $thread->addSpools(
                    $validated['spool_quantity'],
                    $validated['unit_price'] ?? null,
                    null,
                    $validated['notes'] ?? null
                );
                break;

            case 'consume_meters':
                $thread->consumeMeters(
                    $validated['meters_quantity'],
                    null,
                    $validated['notes'] ?? null
                );
                break;

            case 'adjustment':
                $thread->adjustStock(
                    $validated['spool_quantity'],
                    $validated['meters_quantity'] ?? 0,
                    $validated['notes'] ?? null
                );
                break;
        }

        return back()->with('message', 'Estoque ajustado com sucesso!');
    }

    public function getSubstitutes(Thread $thread)
    {
        if ($thread->type !== 'specialty') {
            return response()->json([
                'success' => false,
                'message' => 'Apenas linhas specialty podem ter substitutos',
            ]);
        }

        $substitutes = $thread->getSubstitutes();
        $suggested = $this->threadService->suggestStandardSubstitute($thread);

        return response()->json([
            'success' => true,
            'configured_substitutes' => $substitutes,
            'suggested_substitute' => $suggested,
        ]);
    }

    public function usage(Request $request)
    {
        $filters = [
            'from' => $request->from ?? now()->subMonth()->format('Y-m-d'),
            'to' => $request->to ?? now()->format('Y-m-d'),
        ];

        $statistics = $this->threadService->getUsageStatistics($filters);
        $byColor = $this->threadService->trackUsageByColor();

        return Inertia::render('Admin/Threads/Usage', [
            'statistics' => $statistics,
            'byColor' => $byColor,
            'filters' => $filters,
        ]);
    }

    public function analysis8020()
    {
        $analysis = $this->threadService->get8020Analysis();
        $lowStock = $this->threadService->getLowStockThreads();

        return Inertia::render('Admin/Threads/Analysis8020', [
            'analysis' => $analysis,
            'lowStock' => $lowStock,
        ]);
    }

    public function exportPdf(Request $request)
    {
        $threads = Thread::with('embroideryColor')
            ->when($request->type, fn($q, $type) => $q->where('type', $type))
            ->orderBy('type')
            ->orderBy('name')
            ->get();

        $summary = $this->threadService->getInventorySummary();
        $analysis = $this->threadService->get8020Analysis();

        $pdf = Pdf::loadView('reports.threads', [
            'threads' => $threads,
            'summary' => $summary,
            'analysis' => $analysis,
            'generatedAt' => now(),
        ]);

        return $pdf->download('relatorio-linhas-' . now()->format('Y-m-d') . '.pdf');
    }
}
