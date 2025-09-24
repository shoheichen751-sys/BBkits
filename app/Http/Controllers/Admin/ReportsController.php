<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Material;
use App\Models\Supplier;
use App\Models\InventoryTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class ReportsController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'approved']);
    }

    public function index()
    {
        return Inertia::render('Admin/Reports/Index', [
            'quickStats' => $this->getQuickStats(),
            'lowStockAlerts' => $this->getLowStockAlerts(),
            'recentActivity' => $this->getRecentActivity(),
        ]);
    }

    public function lowStockAlerts(Request $request)
    {
        try {
            $query = Material::with(['supplier'])
                ->whereRaw('current_stock <= minimum_stock')
                ->orderByRaw('(current_stock / NULLIF(minimum_stock, 0)) ASC');

        if ($request->has('supplier_id')) {
            $query->where('supplier_id', $request->get('supplier_id'));
        }

        if ($request->has('severity')) {
            switch ($request->get('severity')) {
                case 'critical':
                    $query->where('current_stock', '<=', 0);
                    break;
                case 'low':
                    $query->whereRaw('current_stock > 0 AND current_stock <= minimum_stock * 0.5');
                    break;
                case 'warning':
                    $query->whereRaw('current_stock > minimum_stock * 0.5 AND current_stock <= minimum_stock');
                    break;
            }
        }

        $materials = $query->paginate(20);

        // Add severity level to each material
        $materials->getCollection()->transform(function ($material) {
            $material->severity = $this->getStockSeverity($material);
            $material->days_until_stockout = $this->calculateDaysUntilStockout($material);
            return $material;
        });

        $suppliers = Supplier::orderBy('name')->get(['id', 'name']);

            return Inertia::render('Admin/Reports/LowStockAlerts', [
                'materials' => $materials,
                'suppliers' => $suppliers,
                'filters' => [
                    'supplier_id' => $request->get('supplier_id'),
                    'severity' => $request->get('severity'),
                ],
                'stats' => $this->getLowStockStats(),
            ]);
        } catch (\Exception $e) {
            \Log::error('Low Stock Alerts Error: ' . $e->getMessage());
            return Inertia::render('Admin/Reports/LowStockAlerts', [
                'materials' => collect([]),
                'suppliers' => collect([]),
                'filters' => [
                    'supplier_id' => $request->get('supplier_id'),
                    'severity' => $request->get('severity'),
                ],
                'stats' => ['critical' => 0, 'low' => 0, 'warning' => 0, 'total' => 0],
                'error_message' => 'Unable to load low stock alerts. Please check the system logs.'
            ]);
        }
    }

    public function inventoryStatus(Request $request)
    {
        try {
            $dateFrom = $request->get('date_from', now()->subDays(30)->format('Y-m-d'));
            $dateTo = $request->get('date_to', now()->format('Y-m-d'));

        // Overall inventory status
        $inventoryStatus = [
            'total_materials' => Material::count(),
            'total_stock_value' => Material::sum(DB::raw('current_stock * purchase_price')),
            'active_materials' => Material::whereRaw('current_stock > minimum_stock')->count(),
            'low_stock_materials' => Material::whereRaw('current_stock <= minimum_stock AND current_stock > 0')->count(),
            'out_of_stock_materials' => Material::where('current_stock', '<=', 0)->count(),
        ];

        // Stock movement trends
        $stockMovements = InventoryTransaction::select(
                DB::raw('DATE(created_at) as date'),
                'type',
                DB::raw('COUNT(*) as transaction_count'),
                DB::raw('SUM(ABS(quantity)) as total_quantity')
            )
            ->whereBetween('created_at', [$dateFrom, $dateTo])
            ->groupBy('date', 'type')
            ->orderBy('date')
            ->get();

        // Top materials by transaction volume
        $topMaterialsByActivity = Material::select('materials.*')
            ->withCount(['inventoryTransactions as transaction_count' => function ($query) use ($dateFrom, $dateTo) {
                $query->whereBetween('created_at', [$dateFrom, $dateTo]);
            }])
            ->having('transaction_count', '>', 0)
            ->orderBy('transaction_count', 'desc')
            ->limit(10)
            ->get();

        // Stock value by supplier
        $stockValueBySupplier = Supplier::select('suppliers.name')
            ->addSelect(DB::raw('SUM(materials.current_stock * materials.purchase_price) as stock_value'))
            ->addSelect(DB::raw('COUNT(materials.id) as material_count'))
            ->leftJoin('materials', 'suppliers.id', '=', 'materials.supplier_id')
            ->groupBy('suppliers.id', 'suppliers.name')
            ->havingRaw('stock_value > 0')
            ->orderBy('stock_value', 'desc')
            ->get();

            return Inertia::render('Admin/Reports/InventoryStatus', [
                'inventoryStatus' => $inventoryStatus,
                'stockMovements' => $stockMovements,
                'topMaterialsByActivity' => $topMaterialsByActivity,
                'stockValueBySupplier' => $stockValueBySupplier,
                'filters' => [
                    'date_from' => $dateFrom,
                    'date_to' => $dateTo,
                ],
            ]);
        } catch (\Exception $e) {
            \Log::error('Inventory Status Report Error: ' . $e->getMessage());
            return Inertia::render('Admin/Reports/InventoryStatus', [
                'inventoryStatus' => [
                    'total_materials' => 0,
                    'total_stock_value' => 0,
                    'active_materials' => 0,
                    'low_stock_materials' => 0,
                    'out_of_stock_materials' => 0,
                ],
                'stockMovements' => [],
                'topMaterialsByActivity' => [],
                'stockValueBySupplier' => [],
                'filters' => [
                    'date_from' => $dateFrom,
                    'date_to' => $dateTo,
                ],
                'error_message' => 'Unable to load inventory status. Please check the system logs.'
            ]);
        }
    }

    public function stockMovements(Request $request)
    {
        try {
            $dateFrom = $request->get('date_from', now()->subDays(30)->format('Y-m-d'));
        $dateTo = $request->get('date_to', now()->format('Y-m-d'));
        $materialId = $request->get('material_id');
        $type = $request->get('type');

        $query = InventoryTransaction::with(['material', 'user'])
            ->whereBetween('created_at', [$dateFrom, $dateTo]);

        if ($materialId) {
            $query->where('material_id', $materialId);
        }

        if ($type) {
            $query->where('type', $type);
        }

        $transactions = $query->orderBy('created_at', 'desc')->paginate(50);

        // Summary statistics
        $summaryStats = [
            'total_transactions' => $query->count(),
            'total_positive_movements' => $query->where('quantity', '>', 0)->sum('quantity'),
            'total_negative_movements' => abs($query->where('quantity', '<', 0)->sum('quantity')),
            'net_movement' => $query->sum('quantity'),
        ];

        // Movement trends by day
        $dailyMovements = InventoryTransaction::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(CASE WHEN quantity > 0 THEN quantity ELSE 0 END) as inbound'),
                DB::raw('SUM(CASE WHEN quantity < 0 THEN ABS(quantity) ELSE 0 END) as outbound'),
                DB::raw('COUNT(*) as transaction_count')
            )
            ->whereBetween('created_at', [$dateFrom, $dateTo])
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Movement by type
        $movementsByType = InventoryTransaction::select(
                'type',
                DB::raw('COUNT(*) as count'),
                DB::raw('SUM(ABS(quantity)) as total_quantity'),
                DB::raw('AVG(ABS(quantity)) as avg_quantity')
            )
            ->whereBetween('created_at', [$dateFrom, $dateTo])
            ->groupBy('type')
            ->get();

        $materials = Material::orderBy('name')->get(['id', 'name', 'reference']);

        return Inertia::render('Admin/Reports/StockMovements', [
            'transactions' => $transactions,
            'summaryStats' => $summaryStats,
            'dailyMovements' => $dailyMovements,
            'movementsByType' => $movementsByType,
            'materials' => $materials,
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
                'material_id' => $materialId,
                'type' => $type,
            ],
        ]);
        } catch (\Exception $e) {
            \Log::error('Stock Movements Report Error: ' . $e->getMessage());
            return Inertia::render('Admin/Reports/StockMovements', [
                'transactions' => collect([]),
                'summaryStats' => [
                    'total_transactions' => 0,
                    'total_positive_movements' => 0,
                    'total_negative_movements' => 0,
                    'net_movement' => 0,
                ],
                'dailyMovements' => [],
                'movementsByType' => [],
                'materials' => collect([]),
                'filters' => [
                    'date_from' => $dateFrom,
                    'date_to' => $dateTo,
                    'material_id' => $materialId,
                    'type' => $type,
                ],
                'error_message' => 'Unable to load stock movements. Please check the system logs.'
            ]);
        }
    }

    public function supplierPerformance(Request $request)
    {
        try {
            $dateFrom = $request->get('date_from', now()->subDays(90)->format('Y-m-d'));
        $dateTo = $request->get('date_to', now()->format('Y-m-d'));

        // Supplier performance metrics
        $supplierMetrics = Supplier::select('suppliers.*')
            ->with(['materials' => function ($query) {
                $query->select('id', 'supplier_id', 'name', 'current_stock', 'minimum_stock', 'purchase_price');
            }])
            ->withCount('materials as total_materials')
            ->addSelect([
                'total_stock_value' => Material::selectRaw('SUM(current_stock * purchase_price)')
                    ->whereColumn('supplier_id', 'suppliers.id'),
                'low_stock_materials' => Material::selectRaw('COUNT(*)')
                    ->whereColumn('supplier_id', 'suppliers.id')
                    ->whereRaw('current_stock <= minimum_stock'),
                'out_of_stock_materials' => Material::selectRaw('COUNT(*)')
                    ->whereColumn('supplier_id', 'suppliers.id')
                    ->where('current_stock', '<=', 0),
                'recent_transactions' => InventoryTransaction::selectRaw('COUNT(*)')
                    ->join('materials', 'materials.id', '=', 'inventory_transactions.material_id')
                    ->whereColumn('materials.supplier_id', 'suppliers.id')
                    ->whereBetween('inventory_transactions.created_at', [$dateFrom, $dateTo]),
                'purchase_transactions' => InventoryTransaction::selectRaw('SUM(quantity)')
                    ->join('materials', 'materials.id', '=', 'inventory_transactions.material_id')
                    ->whereColumn('materials.supplier_id', 'suppliers.id')
                    ->where('inventory_transactions.type', 'purchase')
                    ->whereBetween('inventory_transactions.created_at', [$dateFrom, $dateTo]),
            ])
            ->orderBy('total_stock_value', 'desc')
            ->get();

        // Calculate performance scores
        $supplierMetrics->each(function ($supplier) {
            $supplier->performance_score = $this->calculateSupplierPerformanceScore($supplier);
            $supplier->stock_reliability = $this->calculateStockReliability($supplier);
        });

        // Top performing suppliers
        $topSuppliers = $supplierMetrics->sortByDesc('performance_score')->take(5);

        // Suppliers needing attention
        $suppliersNeedingAttention = $supplierMetrics->filter(function ($supplier) {
            return $supplier->performance_score < 70 || $supplier->out_of_stock_materials > 0;
        })->sortBy('performance_score');

        // Purchase activity trends
        $purchaseActivity = InventoryTransaction::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as purchase_count'),
                DB::raw('SUM(quantity) as total_quantity')
            )
            ->where('type', 'purchase')
            ->whereBetween('created_at', [$dateFrom, $dateTo])
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return Inertia::render('Admin/Reports/SupplierPerformance', [
            'supplierMetrics' => $supplierMetrics,
            'topSuppliers' => $topSuppliers,
            'suppliersNeedingAttention' => $suppliersNeedingAttention,
            'purchaseActivity' => $purchaseActivity,
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
            'summaryStats' => [
                'total_suppliers' => $supplierMetrics->count(),
                'active_suppliers' => $supplierMetrics->where('recent_transactions', '>', 0)->count(),
                'avg_performance_score' => round($supplierMetrics->avg('performance_score'), 1),
                'total_stock_value' => $supplierMetrics->sum('total_stock_value'),
            ],
        ]);
        } catch (\Exception $e) {
            \Log::error('Supplier Performance Report Error: ' . $e->getMessage());
            return Inertia::render('Admin/Reports/SupplierPerformance', [
                'supplierMetrics' => collect([]),
                'topSuppliers' => collect([]),
                'suppliersNeedingAttention' => collect([]),
                'purchaseActivity' => [],
                'filters' => [
                    'date_from' => $dateFrom,
                    'date_to' => $dateTo,
                ],
                'summaryStats' => [
                    'total_suppliers' => 0,
                    'active_suppliers' => 0,
                    'avg_performance_score' => 0,
                    'total_stock_value' => 0,
                ],
                'error_message' => 'Unable to load supplier performance data. Please check the system logs.'
            ]);
        }
    }

    private function getQuickStats()
    {
        return [
            'low_stock_count' => Material::whereRaw('current_stock <= minimum_stock')->count(),
            'out_of_stock_count' => Material::where('current_stock', '<=', 0)->count(),
            'total_stock_value' => Material::sum(DB::raw('current_stock * purchase_price')),
            'recent_transactions' => InventoryTransaction::where('created_at', '>=', now()->subDays(7))->count(),
        ];
    }

    private function getLowStockAlerts()
    {
        return Material::with(['supplier'])
            ->whereRaw('current_stock <= minimum_stock')
            ->orderBy('current_stock')
            ->limit(5)
            ->get()
            ->map(function ($material) {
                $material->severity = $this->getStockSeverity($material);
                return $material;
            });
    }

    private function getRecentActivity()
    {
        return InventoryTransaction::with(['material', 'user'])
            ->latest()
            ->limit(10)
            ->get();
    }

    private function getStockSeverity($material)
    {
        if ($material->current_stock <= 0) {
            return 'critical';
        } elseif ($material->current_stock <= $material->minimum_stock * 0.5) {
            return 'low';
        } elseif ($material->current_stock <= $material->minimum_stock) {
            return 'warning';
        }
        return 'normal';
    }

    private function calculateDaysUntilStockout($material)
    {
        // Calculate average daily consumption over last 30 days
        $avgDailyConsumption = InventoryTransaction::where('material_id', $material->id)
            ->where('type', 'consumption')
            ->where('created_at', '>=', now()->subDays(30))
            ->avg(DB::raw('ABS(quantity)'));

        if (!$avgDailyConsumption || $avgDailyConsumption <= 0) {
            return null; // Can't calculate without consumption data
        }

        return round($material->current_stock / $avgDailyConsumption);
    }

    private function getLowStockStats()
    {
        return [
            'critical' => Material::where('current_stock', '<=', 0)->count(),
            'low' => Material::whereRaw('current_stock > 0 AND current_stock <= minimum_stock * 0.5')->count(),
            'warning' => Material::whereRaw('current_stock > minimum_stock * 0.5 AND current_stock <= minimum_stock')->count(),
            'total' => Material::whereRaw('current_stock <= minimum_stock')->count(),
        ];
    }

    private function calculateSupplierPerformanceScore($supplier)
    {
        $score = 100;

        // Deduct points for low stock materials
        if ($supplier->total_materials > 0) {
            $lowStockPercentage = ($supplier->low_stock_materials / $supplier->total_materials) * 100;
            $score -= $lowStockPercentage * 0.5;

            $outOfStockPercentage = ($supplier->out_of_stock_materials / $supplier->total_materials) * 100;
            $score -= $outOfStockPercentage * 2;
        }

        // Consider recent activity
        if ($supplier->recent_transactions == 0) {
            $score -= 20; // Penalize inactive suppliers
        }

        return max(0, round($score, 1));
    }

    private function calculateStockReliability($supplier)
    {
        if ($supplier->total_materials == 0) {
            return 0;
        }

        $reliableMaterials = $supplier->total_materials - $supplier->low_stock_materials - $supplier->out_of_stock_materials;
        return round(($reliableMaterials / $supplier->total_materials) * 100, 1);
    }
}