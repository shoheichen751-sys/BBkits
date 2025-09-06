<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;
use App\Services\PDFReportService;
use App\Services\CommissionService;

class AdminController extends Controller
{
    public function dashboard(Request $request)
    {
        if (auth()->user()->role !== 'admin' && auth()->user()->role !== 'financeiro') {
            abort(403, 'Unauthorized');
        }

        $commissionService = new CommissionService();
        $currentMonth = $request->get('month', Carbon::now()->month);
        $currentYear = $request->get('year', Carbon::now()->year);
        $dateFilter = $request->get('date_filter', 'current_month');
        $statusFilter = $request->get('status_filter', 'all');
        
        // Date range calculations
        $dateRange = $this->getDateRange($dateFilter, $currentMonth, $currentYear);
        
        // Basic stats with filters
        $statsQuery = Sale::query();
        
        // Apply date filter
        if ($dateFilter === 'current_month') {
            $statsQuery->whereYear('payment_date', $currentYear)
                      ->whereMonth('payment_date', $currentMonth);
        } elseif ($dateFilter === 'last_month') {
            $lastMonth = Carbon::now()->subMonth();
            $statsQuery->whereYear('payment_date', $lastMonth->year)
                      ->whereMonth('payment_date', $lastMonth->month);
        } elseif ($dateFilter === 'last_7_days') {
            $statsQuery->where('payment_date', '>=', Carbon::now()->subDays(7));
        } elseif ($dateFilter === 'last_30_days') {
            $statsQuery->where('payment_date', '>=', Carbon::now()->subDays(30));
        } elseif ($dateFilter === 'custom' && $request->has(['start_date', 'end_date'])) {
            $statsQuery->whereBetween('payment_date', [$request->start_date, $request->end_date]);
        }
        
        // Apply status filter
        if ($statusFilter !== 'all') {
            $statsQuery->where('status', $statusFilter);
        }
        
        // Legacy stats (for backward compatibility)
        $legacyStats = [
            'totalSellers' => User::where('role', 'vendedora')->count(),
            'monthlyRevenue' => (clone $statsQuery)->where('status', 'aprovado')->sum('received_amount'),
            'pendingSales' => Sale::where('status', 'pendente')->count(),
            'approvedSales' => (clone $statsQuery)->where('status', 'aprovado')->count(),
            'totalSalesCount' => (clone $statsQuery)->count(),
            'monthlyTarget' => 200000, // R$ 200k monthly target
        ];
        
        // Enhanced order lifecycle stats
        $orderLifecycleStats = [
            'pending_payment' => Sale::where('order_status', 'pending_payment')->count(),
            'payment_approved' => Sale::where('order_status', 'payment_approved')->count(),
            'in_production' => Sale::where('order_status', 'in_production')->count(),
            'photo_sent' => Sale::where('order_status', 'photo_sent')->count(),
            'photo_approved' => Sale::where('order_status', 'photo_approved')->count(),
            'pending_final_payment' => Sale::where('order_status', 'pending_final_payment')->count(),
            'ready_for_shipping' => Sale::where('order_status', 'ready_for_shipping')->count(),
            'shipped' => Sale::where('order_status', 'shipped')->count(),
        ];
        
        // Performance metrics
        $performanceMetrics = $this->calculatePerformanceMetrics($dateFilter);
        
        // Bottleneck identification
        $bottlenecks = $this->identifyBottlenecks();
        
        // Combine stats
        $stats = array_merge($legacyStats, [
            'orderLifecycle' => $orderLifecycleStats,
            'performance' => $performanceMetrics,
            'bottlenecks' => $bottlenecks,
            'dateFilter' => $dateFilter,
            'statusFilter' => $statusFilter,
            'currentMonth' => $currentMonth,
            'currentYear' => $currentYear,
        ]);

        // Calculate monthly commissions using CommissionService
        $monthlyCommissions = 0;
        $sellers = User::where('role', 'vendedora')->get();
        
        foreach ($sellers as $seller) {
            $sellerQuery = Sale::where('user_id', $seller->id)->where('status', 'aprovado');
            
            // Apply same date filter as stats
            if ($dateFilter === 'current_month') {
                $sellerQuery->whereYear('payment_date', $currentYear)
                           ->whereMonth('payment_date', $currentMonth);
            } elseif ($dateFilter === 'last_month') {
                $lastMonth = Carbon::now()->subMonth();
                $sellerQuery->whereYear('payment_date', $lastMonth->year)
                           ->whereMonth('payment_date', $lastMonth->month);
            } elseif ($dateFilter === 'last_7_days') {
                $sellerQuery->where('payment_date', '>=', Carbon::now()->subDays(7));
            } elseif ($dateFilter === 'last_30_days') {
                $sellerQuery->where('payment_date', '>=', Carbon::now()->subDays(30));
            }
            
            $sellerMonthlyTotal = $sellerQuery->get()
                ->sum(function ($sale) {
                    return ($sale->received_amount ?: 0) - ($sale->shipping_amount ?: 0);
                });
            
            $commissionRate = $commissionService->calculateCommissionRate($sellerMonthlyTotal);
            $monthlyCommissions += $sellerMonthlyTotal * ($commissionRate / 100);
        }

        $stats['monthlyCommissions'] = $monthlyCommissions;

        // Top performers with dynamic date filtering
        $topPerformersQuery = User::where('role', 'vendedora');
        
        // Apply date filter for top performers
        $salesCountFilter = function ($query) use ($dateFilter, $currentYear, $currentMonth, $request) {
            $query->where('status', 'aprovado');
            if ($dateFilter === 'current_month') {
                $query->whereYear('payment_date', $currentYear)
                      ->whereMonth('payment_date', $currentMonth);
            } elseif ($dateFilter === 'last_month') {
                $lastMonth = Carbon::now()->subMonth();
                $query->whereYear('payment_date', $lastMonth->year)
                      ->whereMonth('payment_date', $lastMonth->month);
            } elseif ($dateFilter === 'last_7_days') {
                $query->where('payment_date', '>=', Carbon::now()->subDays(7));
            } elseif ($dateFilter === 'last_30_days') {
                $query->where('payment_date', '>=', Carbon::now()->subDays(30));
            } elseif ($dateFilter === 'custom' && $request->has(['start_date', 'end_date'])) {
                $query->whereBetween('payment_date', [$request->start_date, $request->end_date]);
            }
        };
        
        $topPerformers = $topPerformersQuery
            ->withCount(['sales as sales_count' => $salesCountFilter])
            ->withSum(['sales as total_revenue' => $salesCountFilter], 'received_amount')
            ->orderBy('total_revenue', 'desc')
            ->limit(10) // Increased from 5 to 10 for better analytics
            ->get()
            ->map(function ($user) use ($commissionService, $dateFilter, $currentYear, $currentMonth, $request) {
                // Calculate commission for each top performer using CommissionService
                $commissionQuery = Sale::where('user_id', $user->id)->where('status', 'aprovado');
                
                // Apply same date filter
                if ($dateFilter === 'current_month') {
                    $commissionQuery->whereYear('payment_date', $currentYear)
                                   ->whereMonth('payment_date', $currentMonth);
                } elseif ($dateFilter === 'last_month') {
                    $lastMonth = Carbon::now()->subMonth();
                    $commissionQuery->whereYear('payment_date', $lastMonth->year)
                                   ->whereMonth('payment_date', $lastMonth->month);
                } elseif ($dateFilter === 'last_7_days') {
                    $commissionQuery->where('payment_date', '>=', Carbon::now()->subDays(7));
                } elseif ($dateFilter === 'last_30_days') {
                    $commissionQuery->where('payment_date', '>=', Carbon::now()->subDays(30));
                } elseif ($dateFilter === 'custom' && $request->has(['start_date', 'end_date'])) {
                    $commissionQuery->whereBetween('payment_date', [$request->start_date, $request->end_date]);
                }
                
                $commissionBase = $commissionQuery->get()
                    ->sum(function ($sale) {
                        return ($sale->received_amount ?: 0) - ($sale->shipping_amount ?: 0);
                    });
                
                $commissionRate = $commissionService->calculateCommissionRate($commissionBase);
                $commission = $commissionBase * ($commissionRate / 100);
                
                $user->total_commission = $commission;
                return $user;
            });

        // Recent sales (last 10)
        $recentSales = Sale::with('user')
            ->latest()
            ->limit(10)
            ->get();

        // Monthly data for charts (last 6 months)
        $monthlyData = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $monthlyData[] = [
                'month' => $date->format('M Y'),
                'revenue' => Sale::where('status', 'aprovado')
                    ->whereYear('payment_date', $date->year)
                    ->whereMonth('payment_date', $date->month)
                    ->sum('received_amount'),
                'sales_count' => Sale::where('status', 'aprovado')
                    ->whereYear('payment_date', $date->year)
                    ->whereMonth('payment_date', $date->month)
                    ->count(),
            ];
        }

        // Filter options for the frontend
        $filterOptions = [
            'dateFilters' => [
                'current_month' => 'Mês Atual',
                'last_month' => 'Mês Passado',
                'last_7_days' => 'Últimos 7 dias',
                'last_30_days' => 'Últimos 30 dias',
                'custom' => 'Período personalizado'
            ],
            'statusFilters' => [
                'all' => 'Todos os Status',
                'pendente' => 'Pendente',
                'aprovado' => 'Aprovado',
                'recusado' => 'Rejeitado'
            ],
            'orderStatusFilters' => [
                'all' => 'Todos os Pedidos',
                'pending_payment' => 'Aguardando Pagamento',
                'payment_approved' => 'Pagamento Aprovado',
                'in_production' => 'Em Produção',
                'photo_sent' => 'Foto Enviada',
                'photo_approved' => 'Foto Aprovada',
                'pending_final_payment' => 'Pagamento Final Pendente',
                'ready_for_shipping' => 'Pronto para Envio',
                'shipped' => 'Enviado'
            ]
        ];

        return Inertia::render('Admin/EnhancedDashboard', [
            'stats' => $stats,
            'topPerformers' => $topPerformers,
            'recentSales' => $recentSales,
            'monthlyData' => $monthlyData,
            'filterOptions' => $filterOptions,
            'currentFilters' => [
                'date_filter' => $dateFilter,
                'status_filter' => $statusFilter,
                'month' => $currentMonth,
                'year' => $currentYear,
                'start_date' => $request->get('start_date'),
                'end_date' => $request->get('end_date')
            ]
        ]);
    }
    
    public function generateTeamReport(Request $request)
    {
        if (auth()->user()->role !== 'admin' && auth()->user()->role !== 'financeiro') {
            abort(403, 'Unauthorized');
        }
        
        $month = $request->get('month');
        $year = $request->get('year');
        
        $pdfService = new PDFReportService();
        return $pdfService->generateTeamReport($month, $year);
    }

    public function users()
    {
        // Show all users except vendedoras for admin management
        $users = User::whereIn('role', ['admin', 'manager', 'financeiro', 'finance_admin', 'production_admin', 'vendedora'])
            ->with(['approvedBy'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Admin/Users/Index', compact('users'));
    }

    public function createUser(Request $request)
    {
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Only admins can create users');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|string|in:manager,financeiro,production_admin,admin'
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'role' => $validated['role'],
            'approved' => true, // Auto-approve admin-created users
            'approved_by' => auth()->id(),
            'approved_at' => now()
        ]);

        return redirect()->route('admin.users.index')->with('success', 'Usuário criado com sucesso!');
    }

    public function approveUser(User $user)
    {
        $user->update([
            'approved' => true,
            'approved_at' => now(),
            'approved_by' => auth()->id(),
        ]);

        // Send notification to the approved user
        $notificationService = app(\App\Services\NotificationService::class);
        $notificationService->createNotification(
            $user->id,
            'user_approved',
            'Parabéns! Sua conta foi aprovada. Você já pode acessar o sistema! 🎉',
            ['approved_by' => auth()->user()->name]
        );

        // If the user has a remember token, they might have a session waiting
        // We'll set a flag that the auth system can check
        \Illuminate\Support\Facades\Cache::put(
            'user_approved_' . $user->id, 
            true, 
            now()->addMinutes(10)
        );

        return redirect()->back()->with('success', 'Usuário aprovado com sucesso. O usuário foi notificado e pode acessar o sistema imediatamente.');
    }

    public function rejectUser(User $user)
    {
        $user->update([
            'approved' => false,
            'approved_at' => null,
            'approved_by' => null,
        ]);

        return redirect()->back()->with('success', 'Aprovação do usuário revogada.');
    }
    
    /**
     * Get date range based on filter
     */
    private function getDateRange($dateFilter, $currentMonth, $currentYear)
    {
        switch ($dateFilter) {
            case 'current_month':
                return [
                    'start' => Carbon::create($currentYear, $currentMonth, 1)->startOfMonth(),
                    'end' => Carbon::create($currentYear, $currentMonth, 1)->endOfMonth()
                ];
            case 'last_month':
                $lastMonth = Carbon::now()->subMonth();
                return [
                    'start' => $lastMonth->startOfMonth(),
                    'end' => $lastMonth->endOfMonth()
                ];
            case 'last_7_days':
                return [
                    'start' => Carbon::now()->subDays(7),
                    'end' => Carbon::now()
                ];
            case 'last_30_days':
                return [
                    'start' => Carbon::now()->subDays(30),
                    'end' => Carbon::now()
                ];
            default:
                return [
                    'start' => Carbon::create($currentYear, $currentMonth, 1)->startOfMonth(),
                    'end' => Carbon::create($currentYear, $currentMonth, 1)->endOfMonth()
                ];
        }
    }
    
    /**
     * Calculate performance metrics
     */
    private function calculatePerformanceMetrics($dateFilter)
    {
        // Database-agnostic approach for calculating time differences
        $dbDriver = config('database.default');
        
        if ($dbDriver === 'mysql') {
            // MySQL version with TIMESTAMPDIFF
            $avgProcessingTime = Sale::whereNotNull('shipped_at')
                ->whereNotNull('created_at')
                ->selectRaw('AVG(TIMESTAMPDIFF(DAY, created_at, shipped_at)) as avg_days')
                ->value('avg_days') ?? 0;
            
            $avgStageTime = [
                'payment_to_production' => Sale::whereNotNull('production_started_at')
                    ->whereNotNull('initial_payment_approved_at')
                    ->selectRaw('AVG(TIMESTAMPDIFF(HOUR, initial_payment_approved_at, production_started_at)) as avg_hours')
                    ->value('avg_hours') ?? 0,
                'production_to_photo' => Sale::whereNotNull('photo_sent_at')
                    ->whereNotNull('production_started_at')
                    ->selectRaw('AVG(TIMESTAMPDIFF(HOUR, production_started_at, photo_sent_at)) as avg_hours')
                    ->value('avg_hours') ?? 0,
                'photo_to_shipping' => Sale::whereNotNull('shipped_at')
                    ->whereNotNull('photo_approved_at')
                    ->selectRaw('AVG(TIMESTAMPDIFF(HOUR, photo_approved_at, shipped_at)) as avg_hours')
                    ->value('avg_hours') ?? 0,
            ];
        } else {
            // SQLite/PostgreSQL version - calculate in PHP
            $shippedSales = Sale::whereNotNull('shipped_at')
                ->whereNotNull('created_at')
                ->select(['created_at', 'shipped_at'])
                ->get();
            
            $avgProcessingTime = 0;
            if ($shippedSales->count() > 0) {
                $totalDays = $shippedSales->sum(function ($sale) {
                    return Carbon::parse($sale->shipped_at)->diffInDays(Carbon::parse($sale->created_at));
                });
                $avgProcessingTime = round($totalDays / $shippedSales->count(), 1);
            }
            
            // Calculate stage times in PHP
            $avgStageTime = [
                'payment_to_production' => $this->calculateAverageHours(
                    Sale::whereNotNull('production_started_at')
                        ->whereNotNull('initial_payment_approved_at')
                        ->select(['initial_payment_approved_at', 'production_started_at'])
                        ->get(),
                    'initial_payment_approved_at',
                    'production_started_at'
                ),
                'production_to_photo' => $this->calculateAverageHours(
                    Sale::whereNotNull('photo_sent_at')
                        ->whereNotNull('production_started_at')
                        ->select(['production_started_at', 'photo_sent_at'])
                        ->get(),
                    'production_started_at',
                    'photo_sent_at'
                ),
                'photo_to_shipping' => $this->calculateAverageHours(
                    Sale::whereNotNull('shipped_at')
                        ->whereNotNull('photo_approved_at')
                        ->select(['photo_approved_at', 'shipped_at'])
                        ->get(),
                    'photo_approved_at',
                    'shipped_at'
                ),
            ];
        }
        
        // Conversion rates
        $totalOrders = Sale::count();
        $conversionRates = [
            'payment_approval_rate' => $totalOrders > 0 ? 
                (Sale::where('order_status', '!=', 'pending_payment')->count() / $totalOrders) * 100 : 0,
            'completion_rate' => $totalOrders > 0 ? 
                (Sale::where('order_status', 'shipped')->count() / $totalOrders) * 100 : 0,
            'photo_approval_rate' => Sale::where('order_status', 'photo_sent')->count() > 0 ? 
                (Sale::where('order_status', '!=', 'photo_sent')->where('photo_sent_at', '!=', null)->count() / 
                 Sale::where('order_status', 'photo_sent')->count()) * 100 : 0,
        ];
        
        // Daily/weekly trends (database-agnostic)
        if ($dbDriver === 'mysql') {
            $dailyOrders = Sale::selectRaw('DATE(created_at) as date, COUNT(*) as count')
                ->where('created_at', '>=', Carbon::now()->subDays(30))
                ->groupBy('date')
                ->orderBy('date')
                ->get();
        } else {
            // SQLite version using strftime
            $dailyOrders = Sale::selectRaw("strftime('%Y-%m-%d', created_at) as date, COUNT(*) as count")
                ->where('created_at', '>=', Carbon::now()->subDays(30))
                ->groupBy('date')
                ->orderBy('date')
                ->get();
        }
        
        return [
            'avg_processing_time_days' => round($avgProcessingTime, 1),
            'avg_stage_time' => $avgStageTime,
            'conversion_rates' => $conversionRates,
            'daily_trends' => $dailyOrders,
        ];
    }

    /**
     * Helper method to calculate average hours between two timestamps
     */
    private function calculateAverageHours($collection, $startField, $endField)
    {
        if ($collection->count() === 0) {
            return 0;
        }

        $totalHours = $collection->sum(function ($item) use ($startField, $endField) {
            return Carbon::parse($item->$endField)->diffInHours(Carbon::parse($item->$startField));
        });

        return round($totalHours / $collection->count(), 1);
    }
    
    /**
     * Identify bottlenecks in the order process
     */
    private function identifyBottlenecks()
    {
        $bottlenecks = [];
        
        // Orders stuck in payment approval (>24h)
        $stuckPayments = Sale::where('order_status', 'pending_payment')
            ->where('created_at', '<=', Carbon::now()->subHours(24))
            ->count();
        if ($stuckPayments > 0) {
            $bottlenecks[] = [
                'type' => 'payment_approval',
                'count' => $stuckPayments,
                'message' => "🚨 {$stuckPayments} pedidos aguardando aprovação de pagamento há mais de 24h",
                'severity' => $stuckPayments > 10 ? 'high' : ($stuckPayments > 5 ? 'medium' : 'low'),
                'action_url' => '/finance/orders?status=pending_payment'
            ];
        }
        
        // Orders stuck in production (>48h)
        $stuckProduction = Sale::where('order_status', 'in_production')
            ->where('production_started_at', '<=', Carbon::now()->subHours(48))
            ->count();
        if ($stuckProduction > 0) {
            $bottlenecks[] = [
                'type' => 'production',
                'count' => $stuckProduction,
                'message' => "⏰ {$stuckProduction} pedidos em produção há mais de 48h",
                'severity' => $stuckProduction > 5 ? 'high' : ($stuckProduction > 3 ? 'medium' : 'low'),
                'action_url' => '/production/orders?status=in_production'
            ];
        }
        
        // Photos waiting for approval (>72h)
        $stuckPhotos = Sale::where('order_status', 'photo_sent')
            ->where('photo_sent_at', '<=', Carbon::now()->subHours(72))
            ->count();
        if ($stuckPhotos > 0) {
            $bottlenecks[] = [
                'type' => 'photo_approval',
                'count' => $stuckPhotos,
                'message' => "📸 {$stuckPhotos} fotos aguardando aprovação da cliente há mais de 72h",
                'severity' => $stuckPhotos > 5 ? 'high' : ($stuckPhotos > 2 ? 'medium' : 'low'),
                'action_url' => '/admin/sales?order_status=photo_sent'
            ];
        }
        
        // Final payments waiting (>24h)
        $stuckFinalPayments = Sale::where('order_status', 'pending_final_payment')
            ->whereNotNull('final_payment_proof_data')
            ->where('updated_at', '<=', Carbon::now()->subHours(24))
            ->count();
        if ($stuckFinalPayments > 0) {
            $bottlenecks[] = [
                'type' => 'final_payment',
                'count' => $stuckFinalPayments,
                'message' => "💳 {$stuckFinalPayments} pagamentos finais aguardando aprovação há mais de 24h",
                'severity' => $stuckFinalPayments > 5 ? 'high' : ($stuckFinalPayments > 2 ? 'medium' : 'low'),
                'action_url' => '/finance/orders?status=pending_final_payment'
            ];
        }
        
        // Orders ready for shipping (>24h)
        $readyToShip = Sale::where('order_status', 'ready_for_shipping')
            ->where('final_payment_approved_at', '<=', Carbon::now()->subHours(24))
            ->count();
        if ($readyToShip > 0) {
            $bottlenecks[] = [
                'type' => 'shipping',
                'count' => $readyToShip,
                'message' => "📦 {$readyToShip} pedidos prontos para envio há mais de 24h",
                'severity' => $readyToShip > 10 ? 'high' : ($readyToShip > 5 ? 'medium' : 'low'),
                'action_url' => '/production/orders?status=ready_for_shipping'
            ];
        }
        
        return $bottlenecks;
    }
}