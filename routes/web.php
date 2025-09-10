<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\SalePaymentController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AdminReportsController;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\Admin\CommissionRangeController;
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
            $allMonthlySales = $user->sales()->whereYear('payment_date', $currentYear)->whereMonth('payment_date', $currentMonth)->where('status', '!=', 'cancelado')->get();

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
            
            // Commission base: Total received amount minus shipping (commission eligible amount)
            $commissionBase = max(0, $approvedSalesTotal - $totalShipping);

            $monthlyCommission = $user->getMonthlyCommissionTotal($currentMonth, $currentYear);
            $monthlySalesTotal = $user->getMonthlySalesTotal($currentMonth, $currentYear);

            $recentSales = $user->sales()->orderBy('created_at', 'desc')->limit(5)->get();
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
                    'commissionRanges' => $monthlyProgress['commission_ranges']
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
    Route::post('/sales/{sale}/cancel', [SaleController::class, 'cancel'])->name('sales.cancel');
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
        Route::get('/admin/users', [AdminController::class, 'users'])->name('admin.users.index');
        Route::post('/admin/users', [AdminController::class, 'createUser'])->name('admin.users.store');
        Route::put('/admin/users/{user}/approve', [AdminController::class, 'approveUser'])->name('admin.users.approve');
        Route::put('/admin/users/{user}/reject', [AdminController::class, 'rejectUser'])->name('admin.users.reject');
        Route::put('/admin/sales/{sale}/correct', [SaleController::class, 'correct'])->name('admin.sales.correct');
        Route::put('/admin/sales/{sale}/cancel', [SaleController::class, 'cancel'])->name('admin.sales.cancel');

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
