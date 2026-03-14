<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\AdvancedReportService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class AdvancedReportsController extends Controller
{
    protected AdvancedReportService $reportService;

    public function __construct(AdvancedReportService $reportService)
    {
        $this->middleware(['auth', 'approved']);
        $this->reportService = $reportService;
    }

    public function index()
    {
        return Inertia::render('Admin/Reports/AdvancedIndex', [
            'reportTypes' => [
                [
                    'key' => 'consumption-trends',
                    'name' => 'Tendências de Consumo',
                    'description' => 'Análise de consumo de materiais ao longo do tempo',
                    'icon' => 'chart-line',
                ],
                [
                    'key' => 'cost-analysis',
                    'name' => 'Análise de Custos',
                    'description' => 'Breakdown de custos por categoria e material',
                    'icon' => 'currency-dollar',
                ],
                [
                    'key' => 'forecast',
                    'name' => 'Previsão de Uso',
                    'description' => 'Previsão de consumo e alertas de reposição',
                    'icon' => 'presentation-chart-line',
                ],
                [
                    'key' => 'wastage',
                    'name' => 'Perdas e Ajustes',
                    'description' => 'Tracking de desperdícios e ajustes de estoque',
                    'icon' => 'exclamation-triangle',
                ],
                [
                    'key' => 'thread-usage',
                    'name' => 'Uso de Linhas',
                    'description' => 'Análise detalhada do consumo de linhas de bordado',
                    'icon' => 'scissors',
                ],
            ],
        ]);
    }

    public function consumptionTrends(Request $request)
    {
        $filters = [
            'from' => $request->from,
            'to' => $request->to,
            'group_by' => $request->group_by ?? 'daily',
        ];

        $data = $this->reportService->getConsumptionTrends($filters);

        return Inertia::render('Admin/Reports/ConsumptionTrends', [
            'data' => $data,
            'filters' => $filters,
        ]);
    }

    public function costAnalysis(Request $request)
    {
        $filters = [
            'from' => $request->from,
            'to' => $request->to,
        ];

        $data = $this->reportService->getCostAnalysis($filters);

        return Inertia::render('Admin/Reports/CostAnalysis', [
            'data' => $data,
            'filters' => $filters,
        ]);
    }

    public function forecast(Request $request)
    {
        $filters = [
            'forecast_days' => $request->forecast_days ?? 30,
            'history_days' => $request->history_days ?? 90,
        ];

        $data = $this->reportService->getForecast($filters);

        return Inertia::render('Admin/Reports/Forecast', [
            'data' => $data,
            'filters' => $filters,
        ]);
    }

    public function wastage(Request $request)
    {
        $filters = [
            'from' => $request->from,
            'to' => $request->to,
        ];

        $data = $this->reportService->getWastageReport($filters);

        return Inertia::render('Admin/Reports/Wastage', [
            'data' => $data,
            'filters' => $filters,
        ]);
    }

    public function threadUsage(Request $request)
    {
        $filters = [
            'from' => $request->from,
            'to' => $request->to,
        ];

        $data = $this->reportService->getThreadUsageReport($filters);

        return Inertia::render('Admin/Reports/ThreadUsage', [
            'data' => $data,
            'filters' => $filters,
        ]);
    }

    public function exportConsumptionTrendsPdf(Request $request)
    {
        $filters = [
            'from' => $request->from,
            'to' => $request->to,
            'group_by' => $request->group_by ?? 'daily',
        ];

        $data = $this->reportService->getConsumptionTrends($filters);

        $pdf = Pdf::loadView('reports.consumption-trends', [
            'data' => $data,
            'filters' => $filters,
        ]);

        return $pdf->download('tendencias-consumo.pdf');
    }

    public function exportCostAnalysisPdf(Request $request)
    {
        $filters = [
            'from' => $request->from,
            'to' => $request->to,
        ];

        $data = $this->reportService->getCostAnalysis($filters);

        $pdf = Pdf::loadView('reports.cost-analysis', [
            'data' => $data,
            'filters' => $filters,
        ]);

        return $pdf->download('analise-custos.pdf');
    }

    public function exportForecastPdf(Request $request)
    {
        $filters = [
            'forecast_days' => $request->forecast_days ?? 30,
            'history_days' => $request->history_days ?? 90,
        ];

        $data = $this->reportService->getForecast($filters);

        $pdf = Pdf::loadView('reports.forecast', [
            'data' => $data,
            'filters' => $filters,
        ]);

        return $pdf->download('previsao-uso.pdf');
    }
}
