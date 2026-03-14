<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Simulação de Produção - {{ $simulation->name }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            font-size: 10px;
            line-height: 1.4;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #ec4899;
        }
        .header h1 {
            font-size: 18px;
            color: #ec4899;
            margin-bottom: 5px;
        }
        .header p {
            color: #666;
            font-size: 11px;
        }
        .section {
            margin-bottom: 20px;
        }
        .section-title {
            font-size: 12px;
            font-weight: bold;
            color: #1f2937;
            background: #f3f4f6;
            padding: 8px 10px;
            margin-bottom: 10px;
            border-left: 3px solid #ec4899;
        }
        .summary-grid {
            display: table;
            width: 100%;
            margin-bottom: 15px;
        }
        .summary-item {
            display: table-cell;
            width: 20%;
            text-align: center;
            padding: 10px;
            background: #f9fafb;
            border: 1px solid #e5e7eb;
        }
        .summary-item .label {
            font-size: 8px;
            color: #6b7280;
            text-transform: uppercase;
        }
        .summary-item .value {
            font-size: 14px;
            font-weight: bold;
            color: #1f2937;
        }
        .summary-item.success {
            background: #ecfdf5;
            border-color: #10b981;
        }
        .summary-item.success .value {
            color: #059669;
        }
        .summary-item.danger {
            background: #fef2f2;
            border-color: #ef4444;
        }
        .summary-item.danger .value {
            color: #dc2626;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }
        th, td {
            padding: 6px 8px;
            border: 1px solid #e5e7eb;
            text-align: left;
        }
        th {
            background: #f9fafb;
            font-weight: bold;
            font-size: 9px;
            text-transform: uppercase;
            color: #6b7280;
        }
        td {
            font-size: 10px;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .badge {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 10px;
            font-size: 8px;
            font-weight: bold;
        }
        .badge-success {
            background: #dcfce7;
            color: #16a34a;
        }
        .badge-danger {
            background: #fee2e2;
            color: #dc2626;
        }
        .shortage-row {
            background: #fef2f2;
        }
        .footer {
            position: fixed;
            bottom: 20px;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 8px;
            color: #9ca3af;
        }
        .page-break {
            page-break-after: always;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ $simulation->name }}</h1>
        <p>Simulação de Produção em Lote - BBkits</p>
        <p>Gerado em: {{ now()->format('d/m/Y H:i') }}</p>
    </div>

    @php
        $results = $simulation->results ?? [];
        $summary = $results['summary'] ?? [];
    @endphp

    <!-- Summary -->
    <div class="section">
        <div class="section-title">Resumo da Simulação</div>
        <div class="summary-grid">
            <div class="summary-item">
                <div class="label">Produtos</div>
                <div class="value">{{ $summary['total_products'] ?? 0 }}</div>
            </div>
            <div class="summary-item">
                <div class="label">Unidades</div>
                <div class="value">{{ $summary['total_units'] ?? 0 }}</div>
            </div>
            <div class="summary-item">
                <div class="label">Materiais</div>
                <div class="value">{{ $summary['total_materials'] ?? 0 }}</div>
            </div>
            <div class="summary-item">
                <div class="label">Custo Total</div>
                <div class="value">R$ {{ number_format($summary['total_cost'] ?? 0, 2, ',', '.') }}</div>
            </div>
            <div class="summary-item {{ ($summary['can_produce'] ?? false) ? 'success' : 'danger' }}">
                <div class="label">Status</div>
                <div class="value">{{ ($summary['can_produce'] ?? false) ? 'Viável' : 'Faltantes' }}</div>
            </div>
        </div>
    </div>

    @if($simulation->description)
    <div class="section">
        <div class="section-title">Descrição</div>
        <p style="padding: 10px;">{{ $simulation->description }}</p>
    </div>
    @endif

    <!-- Products -->
    <div class="section">
        <div class="section-title">Produtos</div>
        <table>
            <thead>
                <tr>
                    <th>Produto</th>
                    <th class="text-center">Qtd</th>
                    <th class="text-right">Custo Unit.</th>
                    <th class="text-right">Custo Total</th>
                    <th class="text-center">Status</th>
                </tr>
            </thead>
            <tbody>
                @foreach($results['products'] ?? [] as $product)
                <tr>
                    <td>{{ $product['product_name'] }}</td>
                    <td class="text-center">{{ $product['quantity'] }}</td>
                    <td class="text-right">R$ {{ number_format($product['unit_cost'] ?? 0, 2, ',', '.') }}</td>
                    <td class="text-right">R$ {{ number_format($product['total_cost'] ?? 0, 2, ',', '.') }}</td>
                    <td class="text-center">
                        @if($product['success'] ?? false)
                            <span class="badge badge-success">OK</span>
                        @else
                            <span class="badge badge-danger">Erro</span>
                        @endif
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <!-- Shortages -->
    @if(!empty($results['shortages']))
    <div class="section">
        <div class="section-title" style="border-color: #ef4444; background: #fef2f2; color: #dc2626;">
            Materiais Faltantes ({{ count($results['shortages']) }})
        </div>
        <table>
            <thead>
                <tr>
                    <th>Material</th>
                    <th class="text-right">Necessário</th>
                    <th class="text-right">Disponível</th>
                    <th class="text-right">Faltante</th>
                    <th class="text-right">Custo Est.</th>
                </tr>
            </thead>
            <tbody>
                @foreach($results['shortages'] as $shortage)
                <tr class="shortage-row">
                    <td>{{ $shortage['name'] }}</td>
                    <td class="text-right">{{ number_format($shortage['needed'], 2, ',', '.') }} {{ $shortage['unit'] }}</td>
                    <td class="text-right">{{ number_format($shortage['available'], 2, ',', '.') }} {{ $shortage['unit'] }}</td>
                    <td class="text-right" style="font-weight: bold; color: #dc2626;">
                        {{ number_format($shortage['shortage'], 2, ',', '.') }} {{ $shortage['unit'] }}
                    </td>
                    <td class="text-right">R$ {{ number_format($shortage['shortage_cost'] ?? 0, 2, ',', '.') }}</td>
                </tr>
                @endforeach
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="4" class="text-right" style="font-weight: bold;">Total Custo Faltantes:</td>
                    <td class="text-right" style="font-weight: bold; color: #dc2626;">
                        R$ {{ number_format($summary['shortage_total_cost'] ?? 0, 2, ',', '.') }}
                    </td>
                </tr>
            </tfoot>
        </table>
    </div>
    @endif

    <div class="page-break"></div>

    <!-- All Materials -->
    <div class="section">
        <div class="section-title">Lista Completa de Materiais</div>
        <table>
            <thead>
                <tr>
                    <th>Material</th>
                    <th class="text-right">Necessário</th>
                    <th class="text-right">Em Estoque</th>
                    <th class="text-center">Status</th>
                    <th class="text-right">Custo Unit.</th>
                    <th class="text-right">Custo Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($results['materials'] ?? [] as $material)
                <tr class="{{ ($material['shortage'] ?? 0) > 0 ? 'shortage-row' : '' }}">
                    <td>{{ $material['name'] }}</td>
                    <td class="text-right">{{ number_format($material['quantity_needed'] ?? 0, 2, ',', '.') }} {{ $material['unit'] }}</td>
                    <td class="text-right">{{ number_format($material['current_stock'] ?? 0, 2, ',', '.') }} {{ $material['unit'] }}</td>
                    <td class="text-center">
                        @if(($material['shortage'] ?? 0) > 0)
                            <span class="badge badge-danger">Faltam {{ number_format($material['shortage'], 2, ',', '.') }}</span>
                        @else
                            <span class="badge badge-success">OK</span>
                        @endif
                    </td>
                    <td class="text-right">R$ {{ number_format($material['unit_cost'] ?? 0, 2, ',', '.') }}</td>
                    <td class="text-right">R$ {{ number_format($material['total_cost'] ?? 0, 2, ',', '.') }}</td>
                </tr>
                @endforeach
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="5" class="text-right" style="font-weight: bold;">Custo Total:</td>
                    <td class="text-right" style="font-weight: bold;">
                        R$ {{ number_format($summary['total_cost'] ?? 0, 2, ',', '.') }}
                    </td>
                </tr>
            </tfoot>
        </table>
    </div>

    <div class="footer">
        BBkits - Sistema de Gestão de Inventário | Simulação #{{ $simulation->id }}
    </div>
</body>
</html>
