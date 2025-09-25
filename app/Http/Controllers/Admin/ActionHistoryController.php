<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActionHistory;
use App\Services\ActionHistoryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class ActionHistoryController extends Controller
{
    protected $actionHistoryService;

    public function __construct(ActionHistoryService $actionHistoryService)
    {
        $this->middleware(['auth', 'approved']);
        $this->actionHistoryService = $actionHistoryService;
    }

    /**
     * Show action history dashboard
     */
    public function index(Request $request)
    {
        $query = ActionHistory::with('user')->orderBy('performed_at', 'desc');

        // Apply filters
        if ($request->has('action_type') && $request->action_type !== 'all') {
            $query->where('action_type', $request->action_type);
        }

        if ($request->has('resource_type') && $request->resource_type !== 'all') {
            $query->where('resource_type', $request->resource_type);
        }

        if ($request->has('user_id') && $request->user_id) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('date_from') && $request->date_from) {
            $query->whereDate('performed_at', '>=', $request->date_from);
        }

        if ($request->has('date_to') && $request->date_to) {
            $query->whereDate('performed_at', '<=', $request->date_to);
        }

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                  ->orWhere('resource_id', 'like', "%{$search}%")
                  ->orWhereHas('user', function($userQuery) use ($search) {
                      $userQuery->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $actions = $query->paginate(50)->withQueryString();

        // Get filter options
        $actionTypes = ActionHistory::select('action_type')
            ->distinct()
            ->orderBy('action_type')
            ->pluck('action_type')
            ->toArray();

        $resourceTypes = ActionHistory::select('resource_type')
            ->whereNotNull('resource_type')
            ->distinct()
            ->orderBy('resource_type')
            ->pluck('resource_type')
            ->toArray();

        $users = DB::table('users')
            ->select('id', 'name')
            ->whereExists(function ($query) {
                $query->select(DB::raw(1))
                    ->from('action_histories')
                    ->whereColumn('action_histories.user_id', 'users.id');
            })
            ->orderBy('name')
            ->get();

        // Get stats
        $stats = $this->actionHistoryService->getActionStats(
            $request->date_from ? Carbon::parse($request->date_from) : null,
            $request->date_to ? Carbon::parse($request->date_to) : null
        );

        return Inertia::render('Admin/ActionHistory/Index', [
            'actions' => $actions,
            'filters' => [
                'action_type' => $request->action_type ?? 'all',
                'resource_type' => $request->resource_type ?? 'all',
                'user_id' => $request->user_id,
                'date_from' => $request->date_from,
                'date_to' => $request->date_to,
                'search' => $request->search,
            ],
            'filterOptions' => [
                'actionTypes' => $actionTypes,
                'resourceTypes' => $resourceTypes,
                'users' => $users,
            ],
            'stats' => $stats,
        ]);
    }

    /**
     * Show action history for a specific resource
     */
    public function show(Request $request, string $resourceType, int $resourceId)
    {
        $actions = ActionHistory::forResource($resourceType, $resourceId)
            ->with('user')
            ->orderBy('performed_at', 'desc')
            ->paginate(25);

        // Try to get the resource name/title for display
        $resourceInfo = $this->getResourceInfo($resourceType, $resourceId);

        return Inertia::render('Admin/ActionHistory/Show', [
            'actions' => $actions,
            'resourceType' => $resourceType,
            'resourceId' => $resourceId,
            'resourceInfo' => $resourceInfo,
        ]);
    }

    /**
     * Get action statistics
     */
    public function stats(Request $request)
    {
        $request->validate([
            'period' => 'nullable|in:today,week,month,quarter,year',
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date|after_or_equal:date_from',
        ]);

        $dateFrom = null;
        $dateTo = null;

        if ($request->has('period')) {
            switch ($request->period) {
                case 'today':
                    $dateFrom = now()->startOfDay();
                    $dateTo = now()->endOfDay();
                    break;
                case 'week':
                    $dateFrom = now()->startOfWeek();
                    $dateTo = now()->endOfWeek();
                    break;
                case 'month':
                    $dateFrom = now()->startOfMonth();
                    $dateTo = now()->endOfMonth();
                    break;
                case 'quarter':
                    $dateFrom = now()->startOfQuarter();
                    $dateTo = now()->endOfQuarter();
                    break;
                case 'year':
                    $dateFrom = now()->startOfYear();
                    $dateTo = now()->endOfYear();
                    break;
            }
        } elseif ($request->date_from || $request->date_to) {
            $dateFrom = $request->date_from ? Carbon::parse($request->date_from) : null;
            $dateTo = $request->date_to ? Carbon::parse($request->date_to) : null;
        }

        $stats = $this->actionHistoryService->getActionStats($dateFrom, $dateTo);

        // Get daily breakdown for charts
        $dailyStats = ActionHistory::query()
            ->when($dateFrom && $dateTo, function($query) use ($dateFrom, $dateTo) {
                return $query->inDateRange($dateFrom, $dateTo);
            })
            ->select(DB::raw('DATE(performed_at) as date'), DB::raw('count(*) as count'))
            ->groupBy(DB::raw('DATE(performed_at)'))
            ->orderBy('date')
            ->get();

        return response()->json([
            'stats' => $stats,
            'daily_breakdown' => $dailyStats,
        ]);
    }

    /**
     * Export action history
     */
    public function export(Request $request)
    {
        $request->validate([
            'format' => 'required|in:csv,json',
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date|after_or_equal:date_from',
            'action_type' => 'nullable|string',
            'resource_type' => 'nullable|string',
            'user_id' => 'nullable|exists:users,id',
        ]);

        $query = ActionHistory::with('user')
            ->orderBy('performed_at', 'desc');

        // Apply filters
        if ($request->action_type && $request->action_type !== 'all') {
            $query->where('action_type', $request->action_type);
        }

        if ($request->resource_type && $request->resource_type !== 'all') {
            $query->where('resource_type', $request->resource_type);
        }

        if ($request->user_id) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->date_from) {
            $query->whereDate('performed_at', '>=', $request->date_from);
        }

        if ($request->date_to) {
            $query->whereDate('performed_at', '<=', $request->date_to);
        }

        $actions = $query->limit(10000)->get(); // Limit to prevent memory issues

        $filename = 'action_history_' . now()->format('Y-m-d_H-i-s');

        if ($request->format === 'csv') {
            return $this->exportToCsv($actions, $filename);
        } else {
            return $this->exportToJson($actions, $filename);
        }
    }

    /**
     * Delete old action history records
     */
    public function cleanup(Request $request)
    {
        $request->validate([
            'days' => 'required|integer|min:30|max:365',
            'confirm' => 'required|boolean|accepted',
        ]);

        $cutoffDate = now()->subDays($request->days);
        $deletedCount = ActionHistory::where('performed_at', '<', $cutoffDate)->delete();

        // Log this cleanup action
        $this->actionHistoryService->logAction(
            'cleanup',
            "Limpeza de histórico: {$deletedCount} registros removidos (mais antigos que {$request->days} dias)",
            null,
            null,
            [
                'deleted_count' => $deletedCount,
                'cutoff_date' => $cutoffDate->toDateString(),
                'days_kept' => $request->days,
            ]
        );

        return response()->json([
            'success' => true,
            'message' => "Successfully deleted {$deletedCount} old action history records",
            'deleted_count' => $deletedCount,
        ]);
    }

    // Private helper methods

    private function getResourceInfo(string $resourceType, int $resourceId): ?array
    {
        try {
            $modelClass = "App\\Models\\{$resourceType}";

            if (!class_exists($modelClass)) {
                return null;
            }

            $resource = $modelClass::find($resourceId);

            if (!$resource) {
                return ['status' => 'deleted', 'name' => 'Resource not found'];
            }

            // Get appropriate display name based on resource type
            $displayName = match ($resourceType) {
                'Sale' => "Venda #{$resource->unique_token} - {$resource->client_name}",
                'User' => $resource->name . " ({$resource->email})",
                'Product' => $resource->name,
                default => $resource->name ?? $resource->title ?? "ID: {$resourceId}",
            };

            return [
                'status' => 'active',
                'name' => $displayName,
                'resource' => $resource,
            ];

        } catch (\Exception $e) {
            return ['status' => 'error', 'name' => 'Error loading resource'];
        }
    }

    private function exportToCsv($actions, string $filename)
    {
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}.csv\"",
        ];

        $callback = function() use ($actions) {
            $file = fopen('php://output', 'w');

            // CSV header
            fputcsv($file, [
                'ID',
                'User',
                'Action Type',
                'Resource Type',
                'Resource ID',
                'Description',
                'IP Address',
                'Performed At',
                'Changes',
                'Metadata'
            ]);

            foreach ($actions as $action) {
                fputcsv($file, [
                    $action->id,
                    $action->user?->name ?? 'System',
                    $action->action_type,
                    $action->resource_type,
                    $action->resource_id,
                    $action->description,
                    $action->ip_address,
                    $action->performed_at->format('Y-m-d H:i:s'),
                    json_encode($action->changes),
                    json_encode($action->metadata)
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    private function exportToJson($actions, string $filename)
    {
        $data = $actions->map(function ($action) {
            return [
                'id' => $action->id,
                'user' => $action->user?->name ?? 'System',
                'action_type' => $action->action_type,
                'resource_type' => $action->resource_type,
                'resource_id' => $action->resource_id,
                'description' => $action->description,
                'changes' => $action->changes,
                'metadata' => $action->metadata,
                'ip_address' => $action->ip_address,
                'performed_at' => $action->performed_at->toISOString(),
            ];
        });

        return response()->json([
            'data' => $data,
            'exported_at' => now()->toISOString(),
            'total_records' => $data->count(),
        ])->header('Content-Disposition', "attachment; filename=\"{$filename}.json\"");
    }
}