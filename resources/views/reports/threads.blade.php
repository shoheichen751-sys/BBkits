<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório de Linhas de Bordado</title>
    <style>
        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            font-size: 10px;
            line-height: 1.4;
            color: #333;
            margin: 0;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #ec4899;
            padding-bottom: 15px;
        }
        .header h1 {
            color: #ec4899;
            font-size: 24px;
            margin: 0 0 5px 0;
        }
        .header p {
            color: #666;
            margin: 0;
        }
        .summary-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 25px;
        }
        .summary-box {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            padding: 12px;
            flex: 1;
            min-width: 120px;
            text-align: center;
        }
        .summary-box .label {
            font-size: 9px;
            color: #6b7280;
            text-transform: uppercase;
            margin-bottom: 4px;
        }
        .summary-box .value {
            font-size: 16px;
            font-weight: bold;
            color: #111827;
        }
        .summary-box.standard {
            border-color: #10b981;
            background: #ecfdf5;
        }
        .summary-box.specialty {
            border-color: #8b5cf6;
            background: #f5f3ff;
        }
        .section {
            margin-bottom: 25px;
        }
        .section h2 {
            font-size: 14px;
            color: #374151;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 8px;
            margin-bottom: 15px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 9px;
        }
        th, td {
            padding: 8px 6px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
        }
        th {
            background: #f9fafb;
            font-weight: bold;
            color: #374151;
            text-transform: uppercase;
            font-size: 8px;
        }
        tr:nth-child(even) {
            background: #f9fafb;
        }
        .type-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 8px;
            font-weight: bold;
        }
        .type-standard {
            background: #d1fae5;
            color: #065f46;
        }
        .type-specialty {
            background: #ede9fe;
            color: #5b21b6;
        }
        .stock-status {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 8px;
            font-weight: bold;
        }
        .status-in_stock {
            background: #d1fae5;
            color: #065f46;
        }
        .status-low_stock {
            background: #fef3c7;
            color: #92400e;
        }
        .status-out_of_stock {
            background: #fee2e2;
            color: #991b1b;
        }
        .color-preview {
            display: inline-block;
            width: 16px;
            height: 16px;
            border-radius: 4px;
            border: 1px solid #ccc;
            vertical-align: middle;
            margin-right: 6px;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 8px;
            color: #9ca3af;
            border-top: 1px solid #e5e7eb;
            padding-top: 15px;
        }
        .analysis-section {
            background: #f9fafb;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 25px;
        }
        .analysis-section h3 {
            margin-top: 0;
            color: #374151;
            font-size: 12px;
        }
        .progress-bar {
            background: #e5e7eb;
            border-radius: 10px;
            height: 20px;
            overflow: hidden;
            margin: 10px 0;
        }
        .progress-standard {
            background: linear-gradient(90deg, #10b981, #34d399);
            height: 100%;
            float: left;
        }
        .progress-specialty {
            background: linear-gradient(90deg, #8b5cf6, #a78bfa);
            height: 100%;
            float: left;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>BBKits - Relatório de Linhas de Bordado</h1>
        <p>Gerado em: {{ $generatedAt->format('d/m/Y H:i') }}</p>
    </div>

    <div class="summary-grid">
        <div class="summary-box">
            <div class="label">Total de Linhas</div>
            <div class="value">{{ $summary['total_threads'] }}</div>
        </div>
        <div class="summary-box standard">
            <div class="label">Standard (80%)</div>
            <div class="value">{{ $summary['standard_count'] }}</div>
        </div>
        <div class="summary-box specialty">
            <div class="label">Specialty (20%)</div>
            <div class="value">{{ $summary['specialty_count'] }}</div>
        </div>
        <div class="summary-box">
            <div class="label">Total de Carretéis</div>
            <div class="value">{{ number_format($summary['total_spools'], 0, ',', '.') }}</div>
        </div>
        <div class="summary-box">
            <div class="label">Metros Disponíveis</div>
            <div class="value">{{ number_format($summary['total_meters'], 0, ',', '.') }}m</div>
        </div>
        <div class="summary-box">
            <div class="label">Valor em Estoque</div>
            <div class="value">R$ {{ number_format($summary['total_value'], 2, ',', '.') }}</div>
        </div>
    </div>

    @if(isset($analysis))
    <div class="analysis-section">
        <h3>Análise 80/20</h3>
        <div class="progress-bar">
            <div class="progress-standard" style="width: {{ $analysis['percentages']['standard_consumption_percent'] }}%"></div>
            <div class="progress-specialty" style="width: {{ $analysis['percentages']['specialty_consumption_percent'] }}%"></div>
        </div>
        <p style="margin: 5px 0; font-size: 9px;">
            <span style="color: #10b981;">■</span> Standard: {{ $analysis['percentages']['standard_consumption_percent'] }}%
            &nbsp;&nbsp;
            <span style="color: #8b5cf6;">■</span> Specialty: {{ $analysis['percentages']['specialty_consumption_percent'] }}%
        </p>
        <p style="margin: 10px 0 0 0; font-size: 9px; color: #6b7280;">
            {{ $analysis['compliance']['recommendation'] }}
        </p>
    </div>
    @endif

    <div class="section">
        <h2>Inventário de Linhas</h2>
        <table>
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Código</th>
                    <th>Tipo</th>
                    <th>Material</th>
                    <th class="text-center">Carretéis</th>
                    <th class="text-center">Metros</th>
                    <th class="text-right">Preço Unit.</th>
                    <th class="text-center">Status</th>
                </tr>
            </thead>
            <tbody>
                @foreach($threads as $thread)
                <tr>
                    <td>
                        @if($thread->hex_code)
                        <span class="color-preview" style="background-color: {{ $thread->hex_code }}"></span>
                        @endif
                        {{ $thread->name }}
                    </td>
                    <td>{{ $thread->color_code }}</td>
                    <td>
                        <span class="type-badge type-{{ $thread->type }}">
                            {{ $thread->type === 'standard' ? 'Standard' : 'Specialty' }}
                        </span>
                    </td>
                    <td>{{ ucfirst($thread->material_type) }}</td>
                    <td class="text-center">{{ $thread->spool_count }}</td>
                    <td class="text-center">{{ number_format($thread->meters_remaining, 0, ',', '.') }}m</td>
                    <td class="text-right">R$ {{ number_format($thread->purchase_price, 2, ',', '.') }}</td>
                    <td class="text-center">
                        <span class="stock-status status-{{ $thread->stock_status }}">
                            @switch($thread->stock_status)
                                @case('in_stock') Em Estoque @break
                                @case('low_stock') Baixo @break
                                @case('out_of_stock') Esgotado @break
                            @endswitch
                        </span>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    @if($summary['low_stock_count'] > 0)
    <div class="section">
        <h2>Alertas de Estoque Baixo ({{ $summary['low_stock_count'] }} itens)</h2>
        <table>
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Código</th>
                    <th>Tipo</th>
                    <th class="text-center">Atual</th>
                    <th class="text-center">Mínimo</th>
                    <th class="text-center">Reabastecer</th>
                </tr>
            </thead>
            <tbody>
                @foreach($threads->filter(fn($t) => $t->spool_count <= $t->minimum_spools) as $thread)
                <tr>
                    <td>
                        @if($thread->hex_code)
                        <span class="color-preview" style="background-color: {{ $thread->hex_code }}"></span>
                        @endif
                        {{ $thread->name }}
                    </td>
                    <td>{{ $thread->color_code }}</td>
                    <td>
                        <span class="type-badge type-{{ $thread->type }}">
                            {{ $thread->type === 'standard' ? 'Standard' : 'Specialty' }}
                        </span>
                    </td>
                    <td class="text-center">{{ $thread->spool_count }}</td>
                    <td class="text-center">{{ $thread->minimum_spools }}</td>
                    <td class="text-center">{{ max(0, $thread->minimum_spools - $thread->spool_count + 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    @endif

    <div class="footer">
        <p>BBKits Inventory Management System - Relatório gerado automaticamente</p>
    </div>
</body>
</html>
