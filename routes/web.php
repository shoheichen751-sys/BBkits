<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\SalePaymentController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AdminReportsController;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\Admin\CommissionRangeController;
use App\Http\Controllers\Admin\ThreadController;
use App\Http\Controllers\Admin\PricingFormulaController;
use App\Http\Controllers\Admin\BatchSimulationController;
use App\Http\Controllers\Admin\AdvancedReportsController;
use App\Http\Controllers\Admin\DashboardWidgetsController;
use App\Http\Controllers\FineController;
use App\Http\Controllers\EmbroideryController;
use App\Http\Controllers\ProductController;
use App\Services\GamificationService;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Health check endpoint for debugging
Route::get('/health', function () {
    try {
        $dbConnected = \DB::connection()->getPdo() ? 'OK' : 'Failed';
        return response()->json([
            'status' => 'healthy',
            'database' => $dbConnected,
            'php_version' => PHP_VERSION,
            'laravel_version' => Application::VERSION,
            'extensions' => [
                'pdo_sqlite' => extension_loaded('pdo_sqlite'),
                'sqlite3' => extension_loaded('sqlite3'),
            ],
            'env' => [
                'APP_ENV' => config('app.env'),
                'DB_CONNECTION' => config('database.default'),
                'DB_DATABASE' => config('database.connections.sqlite.database'),
            ]
        ]);
    } catch (Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ], 500);
    }
});

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    try {
        $user = auth()->user();

        if ($user->isFinanceAdmin()) {
            return redirect()->route('finance.dashboard');
        }

        if ($user->isProductionAdmin()) {
            return redirect()->route('production.dashboard');
        }

        $currentMonth = now()->month;
        $currentYear = now()->year;

        if ($user->role === 'vendedora') {
            $commissionService = app(\App\Services\CommissionService::class);
            
            // First try current month, then fallback to most recent month with sales
            $allMonthlySales = $user->sales()->whereYear('payment_date', $currentYear)->whereMonth('payment_date', $currentMonth)->whereNotIn('status', ['cancelado', 'recusado'])->get();
            
            // If no sales in current month, find most recent month with sales
            if ($allMonthlySales->isEmpty()) {
                $lastSaleDate = $user->sales()
                    ->whereNotNull('payment_date')
                    ->whereNotIn('status', ['cancelado', 'recusado'])
                    ->orderBy('payment_date', 'desc')
                    ->first()?->payment_date;
                    
                if ($lastSaleDate) {
                    $currentMonth = $lastSaleDate->month;
                    $currentYear = $lastSaleDate->year;
                    $allMonthlySales = $user->sales()->whereYear('payment_date', $currentYear)->whereMonth('payment_date', $currentMonth)->whereNotIn('status', ['cancelado', 'recusado'])->get();
                }
            }

            $approvedSales = $allMonthlySales->where('status', 'aprovado');
            $pendingSales = $allMonthlySales->where('status', 'pendente');

            $monthlySalesCount = $allMonthlySales->count();
            $approvedSalesCount = $approvedSales->count();

            // Total sales amount: Total expected value (total_amount + shipping) for all sales
            $totalSalesAmount = 0;
            foreach ($allMonthlySales as $sale) {
                $totalSalesAmount += ($sale->total_amount ?? 0) + ($sale->shipping_amount ?? 0);
            }
            
            // Approved sales: Total amount actually RECEIVED across all sales
            $approvedSalesTotal = 0;
            foreach ($allMonthlySales as $sale) {
                if ($sale->hasPartialPayments()) {
                    $approvedSalesTotal += $sale->getTotalPaidAmount();
                } else {
                    // For sales without payment records, use received_amount (backward compatibility)
                    $approvedSalesTotal += $sale->received_amount ?? 0;
                }
            }
            
            // Pending sales: Amount still OWED (Total Expected - Total Received)
            $pendingSalesTotal = max(0, $totalSalesAmount - $approvedSalesTotal);
            $totalShipping = $allMonthlySales->sum('shipping_amount');
            
            // Commission base: Use correct calculation from approved, fully paid sales only
            $commissionBase = $user->sales()
                ->where('status', 'aprovado')
                ->whereYear('payment_date', $currentYear)
                ->whereMonth('payment_date', $currentMonth)
                ->with('payments')
                ->get()
                ->filter(function ($sale) {
                    // Only include sales that are fully paid
                    return $sale->hasPartialPayments() ? $sale->isFullyPaid() : true;
                })
                ->sum(function ($sale) {
                    // Use payment-based commission calculation if has partial payments
                    if ($sale->hasPartialPayments()) {
                        return $sale->getCommissionBaseAmountForPayments();
                    }
                    return ($sale->received_amount ?: 0) - ($sale->shipping_amount ?: 0);
                });

            $monthlyCommission = $user->getMonthlyCommissionTotal($currentMonth, $currentYear);
            $monthlySalesTotal = $user->getMonthlySalesTotal($currentMonth, $currentYear);

            $recentSales = $user->sales()
                ->with(['saleProducts.product', 'embroideryDesign'])
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get();
            $monthlyProgress = $commissionService->getMonthlyProgress($user, $currentMonth, $currentYear);
            
            // Get Top Performers ranking using service
            $gamificationService = app(GamificationService::class);
            $topPerformersData = $gamificationService->getTopPerformersForDashboard();

            $defaultGoal = 40000;
            $calculatedGoal = $monthlyProgress['remaining_to_goal'] + $monthlySalesTotal;
            $actualGoal = max($defaultGoal, $calculatedGoal);
            $progressPercentage = $actualGoal > 0 ? round(($totalSalesAmount / $actualGoal) * 100, 1) : 0;

            return Inertia::render('Dashboard', [
                'salesData' => [
                    'monthlySalesCount' => $monthlySalesCount,
                    'approvedSalesCount' => $approvedSalesCount,
                    'totalSalesAmount' => $totalSalesAmount,
                    'approvedSalesTotal' => $approvedSalesTotal,
                    'pendingSalesTotal' => $pendingSalesTotal,
                    'totalShipping' => $totalShipping,
                    'commissionBase' => $commissionBase,
                    'monthlyCommission' => $monthlyCommission,
                    'monthlySalesTotal' => $monthlySalesTotal,
                    'monthlyGoal' => $actualGoal,
                    'progressPercentage' => $progressPercentage,
                    'currentRate' => $monthlyProgress['current_rate'],
                    'nextBracket' => $monthlyProgress['next_bracket'],
                    'potentialEarnings' => $monthlyProgress['potential_earnings'],
                    'opportunityAlert' => $monthlyProgress['opportunity_alert'],
                    'commissionRanges' => $monthlyProgress['commission_ranges'],
                    'displayMonth' => $currentMonth,
                    'displayYear' => $currentYear,
                    'isCurrentMonth' => ($currentMonth === now()->month && $currentYear === now()->year)
                ],
                'recentSales' => $recentSales,
                'allMonthlySales' => $allMonthlySales,
                'gamification' => [
                    'level' => $gamificationService->getDetailedUserLevel($user),
                    'motivationalQuote' => $gamificationService->getDailyMotivationalQuote(),
                    'achievements' => [],
                    'ranking' => $topPerformersData,
                    'userPosition' => $gamificationService->getUserPositionInRanking($user)
                ],
                'topPerformers' => $topPerformersData
            ]);
        }

        return Inertia::render('Dashboard');
    } catch (\Exception $e) {
        \Log::error('Dashboard Error: ' . $e->getMessage());
        return Inertia::render('Dashboard');
    }
})->middleware(['auth', 'verified', 'approved'])->name('dashboard');

Route::get('/pending-approval', fn() => Inertia::render('Auth/PendingApproval'))->middleware('auth')->name('pending-approval');

Route::get('/pedido/{token}', [SaleController::class, 'clientPage'])->name('sales.client-page');
Route::post('/pedido/{token}/update-address', [SaleController::class, 'clientUpdateAddress'])->name('sales.client.update-address');
Route::post('/pedido/{token}/upload-payment', [SaleController::class, 'clientUploadPayment'])->name('sales.client.upload-payment');
Route::post('/pedido/{token}/approve-photo', [SaleController::class, 'clientApprovePhoto'])->name('sales.client.approve-photo');

// Sale cancellation route - only requires auth, not approval (admin password required)
// Using manual lookup to bypass model binding and policy issues
Route::middleware(['auth'])->group(function () {
    Route::post('/sales/{saleId}/cancel', [SaleController::class, 'cancelBySaleId'])->name('sales.cancel');
});

Route::middleware(['auth', 'approved'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/sales/create-expanded', [SaleController::class, 'createExpanded'])->name('sales.create-expanded');
    Route::get('/sales/create-preview', [SaleController::class, 'createWithPreview'])->name('sales.create-preview');
    Route::get('/sales/create-products', [SaleController::class, 'createWithProducts'])->name('sales.create-products');
    Route::post('/sales/store-products', [SaleController::class, 'storeWithProducts'])->name('sales.store-products');
    Route::get('/sales/kanban', [SaleController::class, 'kanban'])->name('sales.kanban');
    Route::patch('/sales/{sale}/status', [SaleController::class, 'updateStatus'])->name('sales.update-status');
    Route::resource('sales', SaleController::class);

    Route::get('/sales/{sale}/payments', [SalePaymentController::class, 'index'])->name('payments.index');
    Route::post('/sales/{sale}/payments', [SalePaymentController::class, 'store'])->name('payments.store');
    Route::put('/payments/{payment}/approve', [SalePaymentController::class, 'approve'])->name('payments.approve');
    Route::put('/payments/{payment}/reject', [SalePaymentController::class, 'reject'])->name('payments.reject');
    Route::delete('/payments/{payment}', [SalePaymentController::class, 'destroy'])->name('payments.destroy');

    // Order Comments
    Route::get('/sales/{sale}/comments', [\App\Http\Controllers\OrderCommentController::class, 'index'])->name('order-comments.index');
    Route::post('/sales/{sale}/comments', [\App\Http\Controllers\OrderCommentController::class, 'store'])->name('order-comments.store');
    Route::put('/comments/{comment}', [\App\Http\Controllers\OrderCommentController::class, 'update'])->name('order-comments.update');
    Route::delete('/comments/{comment}', [\App\Http\Controllers\OrderCommentController::class, 'destroy'])->name('order-comments.destroy');

    Route::middleware(['finance.access'])->prefix('finance')->name('finance.')->group(function () {
        Route::get('/orders', [\App\Http\Controllers\FinanceController::class, 'ordersIndex'])->name('orders.index');
        Route::post('/orders/{sale}/approve', [\App\Http\Controllers\FinanceController::class, 'approveOrder'])->name('orders.approve');
        Route::post('/orders/{sale}/reject', [\App\Http\Controllers\FinanceController::class, 'rejectOrder'])->name('orders.reject');
        Route::get('/dashboard', [\App\Http\Controllers\FinanceController::class, 'dashboard'])->name('dashboard');
    });

    Route::middleware(['production.access'])->prefix('production')->name('production.')->group(function () {
        Route::get('/orders', [\App\Http\Controllers\ProductionController::class, 'ordersIndex'])->name('orders.index');
        Route::post('/orders/{sale}/start', [\App\Http\Controllers\ProductionController::class, 'startProduction'])->name('orders.start');
        Route::post('/orders/{sale}/upload-photo', [\App\Http\Controllers\ProductionController::class, 'uploadPhoto'])->name('orders.upload-photo');
        Route::post('/orders/{sale}/process-photo-approved', [\App\Http\Controllers\ProductionController::class, 'processPhotoApproved'])->name('orders.process-photo-approved');
        Route::post('/orders/{sale}/generate-shipping', [\App\Http\Controllers\ProductionController::class, 'generateShippingLabel'])->name('orders.generate-shipping');
        Route::get('/dashboard', [\App\Http\Controllers\ProductionController::class, 'dashboard'])->name('dashboard');
    });

    // Manager Routes - Order management and printing
    Route::middleware('manager')->prefix('manager')->name('manager.')->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\ManagerController::class, 'dashboard'])->name('dashboard');
        
        Route::get('/orders', [\App\Http\Controllers\ManagerController::class, 'orders'])->name('orders.index');
        Route::get('/orders/{sale}/print', [\App\Http\Controllers\ManagerController::class, 'printOrder'])->name('orders.print');
        Route::post('/orders/{sale}/send-to-production', [\App\Http\Controllers\ManagerController::class, 'sendToProduction'])->name('orders.send-to-production');
    });

    Route::middleware('admin')->group(function () {
        Route::get('/admin/sales', [SaleController::class, 'adminIndex'])->name('admin.sales.index');
        Route::post('/admin/sales/{sale}/approve', [SaleController::class, 'approve'])->name('admin.sales.approve');
        Route::get('/admin/sales/{sale}/check-stock', [SaleController::class, 'checkStock'])->name('admin.sales.check-stock');
        Route::post('/admin/sales/{sale}/reject', [SaleController::class, 'reject'])->name('admin.sales.reject');
        Route::post('/admin/sales/{sale}/approve-queue', [SaleController::class, 'approveWithQueue'])->name('admin.sales.approve.queue');
        Route::post('/admin/sales/{sale}/reject-queue', [SaleController::class, 'rejectWithQueue'])->name('admin.sales.reject.queue');
        Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
        Route::get('/admin/enhanced-dashboard', [AdminController::class, 'dashboard'])->name('admin.enhanced-dashboard');
        Route::get('/admin/reports', [AdminReportsController::class, 'index'])->name('admin.reports.index');
        Route::get('/admin/reports/team', [AdminController::class, 'generateTeamReport'])->name('admin.reports.team');
        Route::get('/admin/export/sales', [ExportController::class, 'exportSales'])->name('admin.export.sales');
        Route::get('/admin/export/commissions', [ExportController::class, 'exportCommissions'])->name('admin.export.commissions');
        Route::get('/admin/export/order-lifecycle', [ExportController::class, 'exportOrderLifecycle'])->name('admin.export.order-lifecycle');
        Route::get('/admin/export/performance-metrics', [ExportController::class, 'exportPerformanceMetrics'])->name('admin.export.performance-metrics');
        Route::get('/admin/commission-ranges', [CommissionRangeController::class, 'index'])->name('admin.commission-ranges.index');
        Route::post('/admin/commission-ranges', [CommissionRangeController::class, 'store'])->name('admin.commission-ranges.store');
        Route::put('/admin/commission-ranges/{commissionRange}', [CommissionRangeController::class, 'update'])->name('admin.commission-ranges.update');
        Route::delete('/admin/commission-ranges/{commissionRange}', [CommissionRangeController::class, 'destroy'])->name('admin.commission-ranges.destroy');

        Route::prefix('admin')->name('admin.')->group(function () {
            Route::resource('fines', FineController::class);
        });

        Route::get('/admin/integrations', [\App\Http\Controllers\IntegrationController::class, 'index'])->name('admin.integrations.index');
        Route::get('/admin/integrations/logs', [\App\Http\Controllers\IntegrationController::class, 'logs'])->name('admin.integrations.logs');
        Route::post('/admin/integrations/test-tiny-erp', [\App\Http\Controllers\IntegrationController::class, 'testTinyErp'])->name('admin.integrations.test-tiny-erp');
        Route::post('/admin/integrations/test-whatsapp', [\App\Http\Controllers\IntegrationController::class, 'testWhatsApp'])->name('admin.integrations.test-whatsapp');
        Route::post('/admin/integrations/generate-invoice/{sale}', [\App\Http\Controllers\IntegrationController::class, 'generateInvoice'])->name('admin.integrations.generate-invoice');
        Route::post('/admin/integrations/generate-shipping/{sale}', [\App\Http\Controllers\IntegrationController::class, 'generateShippingLabel'])->name('admin.integrations.generate-shipping');
        Route::post('/admin/integrations/send-whatsapp/{sale}', [\App\Http\Controllers\IntegrationController::class, 'sendWhatsAppMessage'])->name('admin.integrations.send-whatsapp');
        Route::post('/admin/integrations/sync-order/{sale}', [\App\Http\Controllers\IntegrationController::class, 'syncOrderStatus'])->name('admin.integrations.sync-order');
        Route::post('/admin/integrations/bulk-sync', [\App\Http\Controllers\IntegrationController::class, 'bulkSyncOrders'])->name('admin.integrations.bulk-sync');

        // Tiny ERP Integration Routes
        Route::prefix('admin/tiny-erp')->name('admin.tiny-erp.')->group(function () {
            Route::get('/', [\App\Http\Controllers\Admin\TinyERPIntegrationController::class, 'index'])->name('index');
            Route::post('/test-connection', [\App\Http\Controllers\Admin\TinyERPIntegrationController::class, 'testConnection'])->name('test-connection');
            Route::post('/sales/{sale}/sync', [\App\Http\Controllers\Admin\TinyERPIntegrationController::class, 'syncSale'])->name('sync-sale');
            Route::post('/sales/{sale}/generate-invoice', [\App\Http\Controllers\Admin\TinyERPIntegrationController::class, 'generateInvoice'])->name('generate-invoice');
            Route::post('/sales/{sale}/generate-shipping', [\App\Http\Controllers\Admin\TinyERPIntegrationController::class, 'generateShippingLabel'])->name('generate-shipping');
            Route::post('/sales/{sale}/update-tracking', [\App\Http\Controllers\Admin\TinyERPIntegrationController::class, 'updateTracking'])->name('update-tracking');
            Route::post('/bulk-sync', [\App\Http\Controllers\Admin\TinyERPIntegrationController::class, 'bulkSync'])->name('bulk-sync');
            Route::post('/webhook', [\App\Http\Controllers\Admin\TinyERPIntegrationController::class, 'webhook'])->name('webhook');
        });

        // WATI WhatsApp Integration Routes
        Route::prefix('admin/wati')->name('admin.wati.')->group(function () {
            Route::get('/', [\App\Http\Controllers\Admin\WATIIntegrationController::class, 'index'])->name('index');
            Route::post('/test-connection', [\App\Http\Controllers\Admin\WATIIntegrationController::class, 'testConnection'])->name('test-connection');
            Route::post('/send-test-message', [\App\Http\Controllers\Admin\WATIIntegrationController::class, 'sendTestMessage'])->name('send-test-message');
            Route::post('/sales/{sale}/send-notification', [\App\Http\Controllers\Admin\WATIIntegrationController::class, 'sendManualNotification'])->name('send-notification');
            Route::get('/notification-logs', [\App\Http\Controllers\Admin\WATIIntegrationController::class, 'getNotificationLogs'])->name('notification-logs');
            Route::post('/notification-logs/{logId}/retry', [\App\Http\Controllers\Admin\WATIIntegrationController::class, 'retryNotification'])->name('retry-notification');
            Route::post('/bulk-send', [\App\Http\Controllers\Admin\WATIIntegrationController::class, 'bulkSendNotifications'])->name('bulk-send');
            Route::get('/templates', [\App\Http\Controllers\Admin\WATIIntegrationController::class, 'getMessageTemplates'])->name('templates');
            Route::get('/contact', [\App\Http\Controllers\Admin\WATIIntegrationController::class, 'getContact'])->name('contact');
            Route::post('/webhook', [\App\Http\Controllers\Admin\WATIIntegrationController::class, 'webhook'])->name('webhook');
        });

        // Action History Routes
        Route::prefix('admin/action-history')->name('admin.action-history.')->group(function () {
            Route::get('/', [\App\Http\Controllers\Admin\ActionHistoryController::class, 'index'])->name('index');
            Route::get('/stats', [\App\Http\Controllers\Admin\ActionHistoryController::class, 'stats'])->name('stats');
            Route::get('/export', [\App\Http\Controllers\Admin\ActionHistoryController::class, 'export'])->name('export');
            Route::post('/cleanup', [\App\Http\Controllers\Admin\ActionHistoryController::class, 'cleanup'])->name('cleanup');
            Route::get('/{resourceType}/{resourceId}', [\App\Http\Controllers\Admin\ActionHistoryController::class, 'show'])->name('show');
        });

        // Backup Management Routes
        Route::prefix('admin/backups')->name('admin.backups.')->group(function () {
            Route::get('/', [\App\Http\Controllers\Admin\BackupController::class, 'index'])->name('index');
            Route::post('/create', [\App\Http\Controllers\Admin\BackupController::class, 'create'])->name('create');
            Route::get('/stats', [\App\Http\Controllers\Admin\BackupController::class, 'stats'])->name('stats');
            Route::get('/test', [\App\Http\Controllers\Admin\BackupController::class, 'test'])->name('test');
            Route::post('/cleanup', [\App\Http\Controllers\Admin\BackupController::class, 'cleanup'])->name('cleanup');
            Route::get('/download/{backupName}', [\App\Http\Controllers\Admin\BackupController::class, 'download'])->name('download');
            Route::delete('/{backupName}', [\App\Http\Controllers\Admin\BackupController::class, 'destroy'])->name('delete');
        });

        Route::get('/admin/users', [AdminController::class, 'users'])->name('admin.users.index');
        Route::post('/admin/users', [AdminController::class, 'createUser'])->name('admin.users.store');
        Route::put('/admin/users/{user}/approve', [AdminController::class, 'approveUser'])->name('admin.users.approve');
        Route::put('/admin/users/{user}/reject', [AdminController::class, 'rejectUser'])->name('admin.users.reject');
        Route::put('/admin/sales/{sale}/correct', [SaleController::class, 'correct'])->name('admin.sales.correct');
        Route::put('/admin/sales/{sale}/cancel', [SaleController::class, 'cancel'])->name('admin.sales.cancel');

        // Materials & Inventory Management Routes
        // Materials Management Routes
        Route::resource('admin/materials', \App\Http\Controllers\Admin\MaterialsController::class)->names([
            'index' => 'admin.materials.index',
            'create' => 'admin.materials.create',
            'store' => 'admin.materials.store',
            'show' => 'admin.materials.show',
            'edit' => 'admin.materials.edit',
            'update' => 'admin.materials.update',
            'destroy' => 'admin.materials.destroy',
        ]);
        Route::post('/admin/materials/{material}/adjust-stock', [\App\Http\Controllers\Admin\MaterialsController::class, 'adjustStock'])->name('admin.materials.adjust-stock');

        // Inventory Transaction Routes
        Route::prefix('admin/inventory')->name('admin.inventory.')->group(function () {
            Route::get('/', [\App\Http\Controllers\Admin\InventoryTransactionController::class, 'index'])->name('index');
            Route::get('/create', [\App\Http\Controllers\Admin\InventoryTransactionController::class, 'create'])->name('create');
            Route::post('/', [\App\Http\Controllers\Admin\InventoryTransactionController::class, 'store'])->name('store');
            Route::get('/{transaction}', [\App\Http\Controllers\Admin\InventoryTransactionController::class, 'show'])->name('show');
            Route::get('/bulk/adjustment', [\App\Http\Controllers\Admin\InventoryTransactionController::class, 'bulkAdjustment'])->name('bulk.adjustment');
            Route::post('/bulk/adjustment', [\App\Http\Controllers\Admin\InventoryTransactionController::class, 'processBulkAdjustment'])->name('bulk.process');
        });

        // Suppliers Management Routes
        Route::resource('admin/suppliers', \App\Http\Controllers\Admin\SupplierController::class)->names([
            'index' => 'admin.suppliers.index',
            'create' => 'admin.suppliers.create',
            'store' => 'admin.suppliers.store',
            'show' => 'admin.suppliers.show',
            'edit' => 'admin.suppliers.edit',
            'update' => 'admin.suppliers.update',
            'destroy' => 'admin.suppliers.destroy',
        ]);

        // Embroidery Management Routes
        Route::get('/admin/embroidery', [EmbroideryController::class, 'dashboard'])->name('admin.embroidery.dashboard');
        
        // Fonts
        Route::get('/admin/embroidery/fonts', [EmbroideryController::class, 'fonts'])->name('admin.embroidery.fonts.index');
        Route::post('/admin/embroidery/fonts', [EmbroideryController::class, 'storeFont'])->name('admin.embroidery.fonts.store');
        Route::put('/admin/embroidery/fonts/{font}', [EmbroideryController::class, 'updateFont'])->name('admin.embroidery.fonts.update');
        Route::delete('/admin/embroidery/fonts/{font}', [EmbroideryController::class, 'destroyFont'])->name('admin.embroidery.fonts.destroy');
        
        // Colors
        Route::get('/admin/embroidery/colors', [EmbroideryController::class, 'colors'])->name('admin.embroidery.colors.index');
        Route::post('/admin/embroidery/colors', [EmbroideryController::class, 'storeColor'])->name('admin.embroidery.colors.store');
        Route::put('/admin/embroidery/colors/{color}', [EmbroideryController::class, 'updateColor'])->name('admin.embroidery.colors.update');
        Route::delete('/admin/embroidery/colors/{color}', [EmbroideryController::class, 'destroyColor'])->name('admin.embroidery.colors.destroy');
        
        // Positions
        Route::get('/admin/embroidery/positions', [EmbroideryController::class, 'positions'])->name('admin.embroidery.positions.index');
        Route::post('/admin/embroidery/positions', [EmbroideryController::class, 'storePosition'])->name('admin.embroidery.positions.store');
        Route::put('/admin/embroidery/positions/{position}', [EmbroideryController::class, 'updatePosition'])->name('admin.embroidery.positions.update');
        Route::delete('/admin/embroidery/positions/{position}', [EmbroideryController::class, 'destroyPosition'])->name('admin.embroidery.positions.destroy');
        
        // Designs
        Route::get('/admin/embroidery/designs', [EmbroideryController::class, 'designs'])->name('admin.embroidery.designs.index');
        Route::post('/admin/embroidery/designs', [EmbroideryController::class, 'storeDesign'])->name('admin.embroidery.designs.store');
        Route::put('/admin/embroidery/designs/{design}', [EmbroideryController::class, 'updateDesign'])->name('admin.embroidery.designs.update');
        Route::delete('/admin/embroidery/designs/{design}', [EmbroideryController::class, 'destroyDesign'])->name('admin.embroidery.designs.destroy');
        
        // Customization Options Management
        Route::get('/admin/customization/categories', [EmbroideryController::class, 'customizationCategories'])->name('admin.customization.categories.index');
        Route::post('/admin/customization/categories', [EmbroideryController::class, 'storeCustomizationCategory'])->name('admin.customization.categories.store');
        Route::put('/admin/customization/categories/{category}', [EmbroideryController::class, 'updateCustomizationCategory'])->name('admin.customization.categories.update');
        Route::delete('/admin/customization/categories/{category}', [EmbroideryController::class, 'destroyCustomizationCategory'])->name('admin.customization.categories.destroy');
        
        Route::get('/admin/customization/values', [EmbroideryController::class, 'customizationValues'])->name('admin.customization.values.index');
        Route::post('/admin/customization/values', [EmbroideryController::class, 'storeCustomizationValue'])->name('admin.customization.values.store');
        Route::put('/admin/customization/values/{value}', [EmbroideryController::class, 'updateCustomizationValue'])->name('admin.customization.values.update');
        Route::delete('/admin/customization/values/{value}', [EmbroideryController::class, 'destroyCustomizationValue'])->name('admin.customization.values.destroy');

        // Products Management
        Route::get('/admin/products', [ProductController::class, 'index'])->name('admin.products.index');
        Route::post('/admin/products', [ProductController::class, 'store'])->name('admin.products.store');
        Route::put('/admin/products/{product}', [ProductController::class, 'update'])->name('admin.products.update');
        Route::post('/admin/products/{product}/update', [ProductController::class, 'update'])->name('admin.products.update-with-file');
        Route::delete('/admin/products/{product}', [ProductController::class, 'destroy'])->name('admin.products.destroy');

        // BOM (Bill of Materials) Management Routes
        Route::prefix('admin/bom')->name('admin.bom.')->group(function () {
            Route::get('/', [\App\Http\Controllers\Admin\BOMController::class, 'index'])->name('index');
            Route::get('/calculator', [\App\Http\Controllers\Admin\BOMController::class, 'calculator'])->name('calculator');
            Route::get('/products-with-bom', [\App\Http\Controllers\Admin\BOMController::class, 'getProductsWithBOM'])->name('products-with-bom');
            Route::get('/{product}', [\App\Http\Controllers\Admin\BOMController::class, 'show'])->name('show');
            Route::post('/{product}', [\App\Http\Controllers\Admin\BOMController::class, 'store'])->name('store');
            Route::get('/{product}/json', [\App\Http\Controllers\Admin\BOMController::class, 'getBOM'])->name('json');

            // Single item operations
            Route::post('/{product}/item', [\App\Http\Controllers\Admin\BOMController::class, 'addItem'])->name('item.add');
            Route::put('/item/{bom}', [\App\Http\Controllers\Admin\BOMController::class, 'updateItem'])->name('item.update');
            Route::delete('/item/{bom}', [\App\Http\Controllers\Admin\BOMController::class, 'deleteItem'])->name('item.delete');

            // Variant operations
            Route::post('/item/{bom}/variant', [\App\Http\Controllers\Admin\BOMController::class, 'saveVariant'])->name('variant.save');
            Route::delete('/variant/{variant}', [\App\Http\Controllers\Admin\BOMController::class, 'deleteVariant'])->name('variant.delete');

            // Duplicate BOM from another product
            Route::post('/{product}/duplicate', [\App\Http\Controllers\Admin\BOMController::class, 'duplicate'])->name('duplicate');

            // Preview materials for an order
            Route::post('/preview-materials', [\App\Http\Controllers\Admin\BOMController::class, 'previewMaterials'])->name('preview');
        });

        // Color Mapping Routes (Product Colors → Material Colors)
        Route::prefix('admin/color-mapping')->name('admin.color-mapping.')->group(function () {
            Route::get('/', [\App\Http\Controllers\Admin\ColorMappingController::class, 'index'])->name('index');
            Route::post('/', [\App\Http\Controllers\Admin\ColorMappingController::class, 'store'])->name('store');
            Route::post('/bulk', [\App\Http\Controllers\Admin\ColorMappingController::class, 'bulkStore'])->name('bulk-store');
            Route::post('/copy', [\App\Http\Controllers\Admin\ColorMappingController::class, 'copyMappings'])->name('copy');
            Route::put('/{mapping}', [\App\Http\Controllers\Admin\ColorMappingController::class, 'update'])->name('update');
            Route::delete('/{mapping}', [\App\Http\Controllers\Admin\ColorMappingController::class, 'destroy'])->name('destroy');
            Route::post('/{mapping}/toggle', [\App\Http\Controllers\Admin\ColorMappingController::class, 'toggleActive'])->name('toggle');
            Route::get('/color/{color}', [\App\Http\Controllers\Admin\ColorMappingController::class, 'getByColor'])->name('by-color');
        });

        // Cutting List Routes
        Route::prefix('admin/cutting-list')->name('admin.cutting-list.')->group(function () {
            Route::get('/', [\App\Http\Controllers\Admin\CuttingListController::class, 'index'])->name('index');
            Route::post('/generate', [\App\Http\Controllers\Admin\CuttingListController::class, 'generate'])->name('generate');
            Route::post('/preview', [\App\Http\Controllers\Admin\CuttingListController::class, 'preview'])->name('preview');
            Route::post('/export-pdf', [\App\Http\Controllers\Admin\CuttingListController::class, 'exportPdf'])->name('export-pdf');
        });

        // Purchase Suggestions Routes
        Route::prefix('admin/purchase-suggestions')->name('admin.purchase-suggestions.')->group(function () {
            Route::get('/', [\App\Http\Controllers\Admin\PurchaseSuggestionController::class, 'index'])->name('index');
            Route::get('/suggestions', [\App\Http\Controllers\Admin\PurchaseSuggestionController::class, 'getSuggestions'])->name('suggestions');
            Route::post('/export-pdf', [\App\Http\Controllers\Admin\PurchaseSuggestionController::class, 'exportPdf'])->name('export-pdf');
            Route::get('/reorder-config', [\App\Http\Controllers\Admin\PurchaseSuggestionController::class, 'reorderConfig'])->name('reorder-config');
            Route::post('/bulk-update', [\App\Http\Controllers\Admin\PurchaseSuggestionController::class, 'bulkUpdate'])->name('bulk-update');
            Route::get('/auto-calculate', [\App\Http\Controllers\Admin\PurchaseSuggestionController::class, 'autoCalculate'])->name('auto-calculate');
            Route::post('/apply-auto-calculated', [\App\Http\Controllers\Admin\PurchaseSuggestionController::class, 'applyAutoCalculated'])->name('apply-auto-calculated');
        });

        // Purchase Orders Routes
        Route::prefix('admin/purchase-orders')->name('admin.purchase-orders.')->group(function () {
            Route::get('/', [\App\Http\Controllers\Admin\PurchaseOrderController::class, 'index'])->name('index');
            Route::get('/create', [\App\Http\Controllers\Admin\PurchaseOrderController::class, 'create'])->name('create');
            Route::post('/', [\App\Http\Controllers\Admin\PurchaseOrderController::class, 'store'])->name('store');
            Route::get('/{purchaseOrder}', [\App\Http\Controllers\Admin\PurchaseOrderController::class, 'show'])->name('show');
            Route::get('/{purchaseOrder}/edit', [\App\Http\Controllers\Admin\PurchaseOrderController::class, 'edit'])->name('edit');
            Route::put('/{purchaseOrder}', [\App\Http\Controllers\Admin\PurchaseOrderController::class, 'update'])->name('update');
            Route::delete('/{purchaseOrder}', [\App\Http\Controllers\Admin\PurchaseOrderController::class, 'destroy'])->name('destroy');
            Route::post('/{purchaseOrder}/approve', [\App\Http\Controllers\Admin\PurchaseOrderController::class, 'approve'])->name('approve');
            Route::put('/{purchaseOrder}/status', [\App\Http\Controllers\Admin\PurchaseOrderController::class, 'updateStatus'])->name('update-status');
            Route::post('/{purchaseOrder}/receive', [\App\Http\Controllers\Admin\PurchaseOrderController::class, 'receive'])->name('receive');
            Route::get('/{purchaseOrder}/export-pdf', [\App\Http\Controllers\Admin\PurchaseOrderController::class, 'exportPdf'])->name('export-pdf');
            Route::post('/from-suggestions', [\App\Http\Controllers\Admin\PurchaseOrderController::class, 'createFromSuggestions'])->name('from-suggestions');
        });

        // Product Costs Routes
        Route::prefix('admin/product-costs')->name('admin.product-costs.')->group(function () {
            Route::get('/', [\App\Http\Controllers\Admin\ProductCostController::class, 'index'])->name('index');
            Route::get('/compare', [\App\Http\Controllers\Admin\ProductCostController::class, 'compare'])->name('compare');
            Route::get('/export-pdf', [\App\Http\Controllers\Admin\ProductCostController::class, 'exportPdf'])->name('export-pdf');
            Route::post('/simulate-sale', [\App\Http\Controllers\Admin\ProductCostController::class, 'simulateSale'])->name('simulate-sale');
            Route::get('/{product}', [\App\Http\Controllers\Admin\ProductCostController::class, 'show'])->name('show');
            Route::get('/{product}/cost', [\App\Http\Controllers\Admin\ProductCostController::class, 'getCost'])->name('get-cost');
            Route::get('/{product}/export-pdf', [\App\Http\Controllers\Admin\ProductCostController::class, 'exportProductPdf'])->name('product-export-pdf');
        });

        // Thread Management Routes (Milestone 4)
        Route::prefix('admin/threads')->name('admin.threads.')->group(function () {
            Route::get('/', [ThreadController::class, 'index'])->name('index');
            Route::get('/create', [ThreadController::class, 'create'])->name('create');
            Route::post('/', [ThreadController::class, 'store'])->name('store');
            Route::get('/usage', [ThreadController::class, 'usage'])->name('usage');
            Route::get('/analysis-8020', [ThreadController::class, 'analysis8020'])->name('analysis-8020');
            Route::get('/export-pdf', [ThreadController::class, 'exportPdf'])->name('export-pdf');
            Route::get('/{thread}', [ThreadController::class, 'show'])->name('show');
            Route::get('/{thread}/edit', [ThreadController::class, 'edit'])->name('edit');
            Route::put('/{thread}', [ThreadController::class, 'update'])->name('update');
            Route::delete('/{thread}', [ThreadController::class, 'destroy'])->name('destroy');
            Route::post('/{thread}/adjust-stock', [ThreadController::class, 'adjustStock'])->name('adjust-stock');
            Route::get('/{thread}/substitutes', [ThreadController::class, 'getSubstitutes'])->name('substitutes');
        });

        // Pricing Formula Routes (Milestone 4)
        Route::prefix('admin/pricing-formulas')->name('admin.pricing-formulas.')->group(function () {
            Route::get('/', [PricingFormulaController::class, 'index'])->name('index');
            Route::get('/create', [PricingFormulaController::class, 'create'])->name('create');
            Route::post('/', [PricingFormulaController::class, 'store'])->name('store');
            Route::get('/{formula}', [PricingFormulaController::class, 'show'])->name('show');
            Route::get('/{formula}/edit', [PricingFormulaController::class, 'edit'])->name('edit');
            Route::put('/{formula}', [PricingFormulaController::class, 'update'])->name('update');
            Route::delete('/{formula}', [PricingFormulaController::class, 'destroy'])->name('destroy');
            Route::post('/preview', [PricingFormulaController::class, 'preview'])->name('preview');
            Route::post('/apply-to-products', [PricingFormulaController::class, 'applyToProducts'])->name('apply-to-products');
            Route::post('/recalculate', [PricingFormulaController::class, 'recalculate'])->name('recalculate');
            Route::get('/products/for-formula', [PricingFormulaController::class, 'getProductsForFormula'])->name('products');
        });

        // Batch Simulation Routes (Milestone 4)
        Route::prefix('admin/batch-simulation')->name('admin.batch-simulation.')->group(function () {
            Route::get('/', [BatchSimulationController::class, 'index'])->name('index');
            Route::get('/create', [BatchSimulationController::class, 'create'])->name('create');
            Route::post('/', [BatchSimulationController::class, 'store'])->name('store');
            Route::post('/calculate', [BatchSimulationController::class, 'calculate'])->name('calculate');
            Route::post('/feasibility', [BatchSimulationController::class, 'feasibility'])->name('feasibility');
            Route::post('/compare', [BatchSimulationController::class, 'compare'])->name('compare');
            Route::post('/purchase-suggestions', [BatchSimulationController::class, 'purchaseSuggestions'])->name('purchase-suggestions');
            Route::get('/products', [BatchSimulationController::class, 'getProducts'])->name('products');
            Route::get('/{simulation}', [BatchSimulationController::class, 'show'])->name('show');
            Route::get('/{simulation}/export-pdf', [BatchSimulationController::class, 'exportPdf'])->name('export-pdf');
            Route::post('/{simulation}/archive', [BatchSimulationController::class, 'archive'])->name('archive');
            Route::delete('/{simulation}', [BatchSimulationController::class, 'destroy'])->name('destroy');
        });

        // Advanced Reports Routes (Milestone 4)
        Route::prefix('admin/reports/advanced')->name('admin.reports.advanced.')->group(function () {
            Route::get('/', [AdvancedReportsController::class, 'index'])->name('index');
            Route::get('/consumption-trends', [AdvancedReportsController::class, 'consumptionTrends'])->name('consumption-trends');
            Route::get('/cost-analysis', [AdvancedReportsController::class, 'costAnalysis'])->name('cost-analysis');
            Route::get('/forecast', [AdvancedReportsController::class, 'forecast'])->name('forecast');
            Route::get('/wastage', [AdvancedReportsController::class, 'wastage'])->name('wastage');
            Route::get('/thread-usage', [AdvancedReportsController::class, 'threadUsage'])->name('thread-usage');
            Route::get('/export/consumption-trends', [AdvancedReportsController::class, 'exportConsumptionTrendsPdf'])->name('export.consumption-trends');
            Route::get('/export/cost-analysis', [AdvancedReportsController::class, 'exportCostAnalysisPdf'])->name('export.cost-analysis');
            Route::get('/export/forecast', [AdvancedReportsController::class, 'exportForecastPdf'])->name('export.forecast');
        });

        // Dashboard Widgets API (Milestone 4)
        Route::prefix('api/dashboard-widgets')->name('api.dashboard-widgets.')->group(function () {
            Route::get('/all', [DashboardWidgetsController::class, 'all'])->name('all');
            Route::get('/low-stock-alerts', [DashboardWidgetsController::class, 'lowStockAlerts'])->name('low-stock-alerts');
            Route::get('/purchase-suggestions', [DashboardWidgetsController::class, 'purchaseSuggestions'])->name('purchase-suggestions');
            Route::get('/production-status', [DashboardWidgetsController::class, 'productionStatus'])->name('production-status');
            Route::get('/thread-inventory', [DashboardWidgetsController::class, 'threadInventory'])->name('thread-inventory');
            Route::get('/cost-trends', [DashboardWidgetsController::class, 'costTrends'])->name('cost-trends');
        });

        // Permission Management Routes
        Route::prefix('admin/permissions')->name('admin.permissions.')->group(function () {
            Route::get('/', [\App\Http\Controllers\Admin\PermissionController::class, 'index'])->name('index');
            Route::get('/role/{role}', [\App\Http\Controllers\Admin\PermissionController::class, 'rolePermissions'])->name('role');
        });

        // Materials Reports Routes
        Route::prefix('admin/reports')->name('admin.reports.')->group(function () {
            Route::get('/', [\App\Http\Controllers\Admin\ReportsController::class, 'index'])->name('index');
            Route::get('/low-stock-alerts', [\App\Http\Controllers\Admin\ReportsController::class, 'lowStockAlerts'])->name('low-stock-alerts');
            Route::get('/inventory-status', [\App\Http\Controllers\Admin\ReportsController::class, 'inventoryStatus'])->name('inventory-status');
            Route::get('/stock-movements', [\App\Http\Controllers\Admin\ReportsController::class, 'stockMovements'])->name('stock-movements');
            Route::get('/supplier-performance', [\App\Http\Controllers\Admin\ReportsController::class, 'supplierPerformance'])->name('supplier-performance');
            Route::get('/material-consumption', [\App\Http\Controllers\Admin\MaterialConsumptionReportController::class, 'index'])->name('material-consumption');
            Route::get('/material-consumption/export/pdf', [\App\Http\Controllers\Admin\MaterialConsumptionReportController::class, 'exportPdf'])->name('material-consumption.export.pdf');
            Route::get('/material-consumption/export/excel', [\App\Http\Controllers\Admin\MaterialConsumptionReportController::class, 'exportExcel'])->name('material-consumption.export.excel');
        });

        // Material Categories Routes
        Route::resource('admin/material-categories', \App\Http\Controllers\Admin\MaterialCategoriesController::class)->names([
            'index' => 'admin.material-categories.index',
            'create' => 'admin.material-categories.create',
            'store' => 'admin.material-categories.store',
            'show' => 'admin.material-categories.show',
            'edit' => 'admin.material-categories.edit',
            'update' => 'admin.material-categories.update',
            'destroy' => 'admin.material-categories.destroy',
        ]);

        // Materials CRUD Routes
        Route::resource('admin/materials', \App\Http\Controllers\Admin\MaterialsController::class)->names([
            'index' => 'admin.materials.index',
            'create' => 'admin.materials.create',
            'store' => 'admin.materials.store',
            'show' => 'admin.materials.show',
            'edit' => 'admin.materials.edit',
            'update' => 'admin.materials.update',
            'destroy' => 'admin.materials.destroy',
        ]);

        // Material Image Routes
        Route::post('/admin/materials/{material}/upload-image', [\App\Http\Controllers\Admin\MaterialsController::class, 'uploadImage'])->name('admin.materials.upload-image');
        Route::delete('/admin/materials/{material}/delete-image', [\App\Http\Controllers\Admin\MaterialsController::class, 'deleteImage'])->name('admin.materials.delete-image');

        // Low Stock Alerts Routes
        Route::get('/admin/materials/low-stock-alerts', [\App\Http\Controllers\Admin\MaterialsController::class, 'lowStockAlerts'])->name('admin.materials.low-stock-alerts');
        Route::get('/admin/materials/low-stock-alerts-page', [\App\Http\Controllers\Admin\MaterialsController::class, 'lowStockAlertsPage'])->name('admin.materials.low-stock-alerts-page');

        // Material Import/Export Routes
        Route::prefix('admin/materials')->name('admin.materials.')->group(function () {
            Route::get('/import-export', [\App\Http\Controllers\Admin\MaterialImportExportController::class, 'index'])->name('import-export');
            Route::get('/export-template', [\App\Http\Controllers\Admin\MaterialImportExportController::class, 'exportTemplate'])->name('export-template');
            Route::post('/export', [\App\Http\Controllers\Admin\MaterialImportExportController::class, 'export'])->name('export');
            Route::post('/import', [\App\Http\Controllers\Admin\MaterialImportExportController::class, 'import'])->name('import');
            Route::get('/validate-units', [\App\Http\Controllers\Admin\MaterialImportExportController::class, 'validateUnits'])->name('validate-units');
        });

        // Notification Routes
        Route::prefix('admin/notifications')->name('admin.notifications.')->group(function () {
            Route::get('/', [\App\Http\Controllers\Admin\NotificationController::class, 'index'])->name('index');
            Route::get('/preferences', [\App\Http\Controllers\Admin\NotificationController::class, 'preferences'])->name('preferences');
            Route::post('/preferences', [\App\Http\Controllers\Admin\NotificationController::class, 'updatePreferences'])->name('update-preferences');
            Route::post('/{notification}/read', [\App\Http\Controllers\Admin\NotificationController::class, 'markAsRead'])->name('mark-read');
            Route::post('/{notification}/unread', [\App\Http\Controllers\Admin\NotificationController::class, 'markAsUnread'])->name('mark-unread');
            Route::post('/mark-all-read', [\App\Http\Controllers\Admin\NotificationController::class, 'markAllAsRead'])->name('mark-all-read');
            Route::delete('/{notification}', [\App\Http\Controllers\Admin\NotificationController::class, 'delete'])->name('delete');
            Route::get('/unread-count', [\App\Http\Controllers\Admin\NotificationController::class, 'getUnreadCount'])->name('unread-count');
            Route::post('/test', [\App\Http\Controllers\Admin\NotificationController::class, 'testNotifications'])->name('test');
        });
    });

    Route::get('/reports/sales', [SaleController::class, 'generateSalesReport'])->name('reports.sales');
    Route::get('/reports/commission', [SaleController::class, 'generateCommissionReport'])->name('reports.commission');
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount'])->name('notifications.unread-count');
    Route::post('/notifications/{notification}/read', [NotificationController::class, 'markAsRead'])->name('notifications.mark-as-read');
    Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead'])->name('notifications.mark-all-read');

    Route::get('/test-pdf', function () {
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('test-pdf');
        return $pdf->download('test-bbkits.pdf');
    })->name('test.pdf');

    // API routes for products (for use in sales forms)
    Route::middleware(['auth', 'approved'])->group(function () {
        Route::get('/api/products', [ProductController::class, 'apiIndex'])->name('api.products.index');
        Route::get('/api/products/{product}', [ProductController::class, 'show'])->name('api.products.show');
        Route::get('/api/products/{product}/compatible-positions', [EmbroideryController::class, 'apiProductCompatiblePositions'])->name('api.products.compatible-positions');
        
        Route::get('/api/embroidery/fonts', [EmbroideryController::class, 'apiFonts'])->name('api.embroidery.fonts');
        Route::get('/api/embroidery/colors', [EmbroideryController::class, 'apiColors'])->name('api.embroidery.colors');
        Route::get('/api/embroidery/positions', [EmbroideryController::class, 'apiPositions'])->name('api.embroidery.positions');
        Route::get('/api/embroidery/designs', [EmbroideryController::class, 'apiDesigns'])->name('api.embroidery.designs');
        Route::get('/api/embroidery/designs/category', [EmbroideryController::class, 'apiDesignsByCategory'])->name('api.embroidery.designs.by-category');
        Route::post('/api/embroidery/calculate-price', [EmbroideryController::class, 'apiCalculateEmbroideryPrice'])->name('api.embroidery.calculate-price');
        Route::get('/api/product-categories', [ProductController::class, 'apiCategories'])->name('api.product-categories.index');
    });
    
    // API endpoint for checking approval status
    Route::get('/api/check-approval-status', function () {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['approved' => false]);
        }
        
        // Check if user was recently approved
        $cacheKey = 'user_approved_' . $user->id;
        if (\Illuminate\Support\Facades\Cache::has($cacheKey)) {
            \Illuminate\Support\Facades\Cache::forget($cacheKey);
            return response()->json(['approved' => true, 'recently_approved' => true]);
        }
        
        return response()->json(['approved' => $user->approved]);
    })->name('api.check-approval-status');
});

require __DIR__.'/auth.php';
