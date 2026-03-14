<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\DashboardWidgetService;
use Illuminate\Http\Request;

class DashboardWidgetsController extends Controller
{
    protected DashboardWidgetService $widgetService;

    public function __construct(DashboardWidgetService $widgetService)
    {
        $this->middleware(['auth', 'approved']);
        $this->widgetService = $widgetService;
    }

    /**
     * Get all widget data.
     */
    public function all()
    {
        return response()->json($this->widgetService->getAllWidgetData());
    }

    /**
     * Get low stock alerts.
     */
    public function lowStockAlerts()
    {
        return response()->json($this->widgetService->getLowStockAlerts());
    }

    /**
     * Get purchase suggestions.
     */
    public function purchaseSuggestions()
    {
        return response()->json($this->widgetService->getPurchaseSuggestions());
    }

    /**
     * Get production status.
     */
    public function productionStatus()
    {
        return response()->json($this->widgetService->getProductionStatus());
    }

    /**
     * Get thread inventory.
     */
    public function threadInventory()
    {
        return response()->json($this->widgetService->getThreadInventory());
    }

    /**
     * Get cost trends.
     */
    public function costTrends()
    {
        return response()->json($this->widgetService->getCostTrends());
    }
}
