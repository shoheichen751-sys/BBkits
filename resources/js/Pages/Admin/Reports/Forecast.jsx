import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Forecast({ data, filters }) {
    const [forecastDays, setForecastDays] = useState(filters.forecast_days || 30);
    const [historyDays, setHistoryDays] = useState(filters.history_days || 90);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value || 0);
    };

    const handleFilter = (e) => {
        e.preventDefault();
        router.get('/admin/reports/advanced/forecast', { forecast_days: forecastDays, history_days: historyDays }, { preserveState: true });
    };

    const getRiskBadge = (risk) => {
        const config = {
            high: { bg: 'bg-red-100', text: 'text-red-800', label: 'Alto' },
            medium: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Médio' },
            low: { bg: 'bg-green-100', text: 'text-green-800', label: 'Baixo' },
            none: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Nenhum' },
        };
        const { bg, text, label } = config[risk] || config.none;
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
                {label}
            </span>
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Previsão de Uso</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Previsão de consumo e alertas de reposição
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <a
                            href={`/admin/reports/advanced/export/forecast?forecast_days=${forecastDays}&history_days=${historyDays}`}
                            className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg transition-colors"
                        >
                            Exportar PDF
                        </a>
                        <Link href="/admin/reports/advanced" className="text-gray-600 hover:text-gray-900">
                            Voltar
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Previsão de Uso" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Filters */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <form onSubmit={handleFilter} className="flex items-end gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Dias de Previsão</label>
                                <select
                                    value={forecastDays}
                                    onChange={(e) => setForecastDays(parseInt(e.target.value))}
                                    className="rounded-lg border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                                >
                                    <option value="7">7 dias</option>
                                    <option value="14">14 dias</option>
                                    <option value="30">30 dias</option>
                                    <option value="60">60 dias</option>
                                    <option value="90">90 dias</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Histórico Base</label>
                                <select
                                    value={historyDays}
                                    onChange={(e) => setHistoryDays(parseInt(e.target.value))}
                                    className="rounded-lg border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                                >
                                    <option value="30">30 dias</option>
                                    <option value="60">60 dias</option>
                                    <option value="90">90 dias</option>
                                    <option value="180">180 dias</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                            >
                                Atualizar
                            </button>
                        </form>
                    </div>

                    {/* Summary */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="text-xs text-gray-500 uppercase">Materiais Analisados</div>
                            <div className="text-2xl font-bold text-gray-900">{data.summary.total_materials_analyzed}</div>
                        </div>
                        <div className="bg-red-50 rounded-lg shadow p-4 border border-red-200">
                            <div className="text-xs text-red-600 uppercase">Risco Alto</div>
                            <div className="text-2xl font-bold text-red-900">{data.summary.high_risk}</div>
                        </div>
                        <div className="bg-yellow-50 rounded-lg shadow p-4 border border-yellow-200">
                            <div className="text-xs text-yellow-600 uppercase">Risco Médio</div>
                            <div className="text-2xl font-bold text-yellow-900">{data.summary.medium_risk}</div>
                        </div>
                        <div className="bg-green-50 rounded-lg shadow p-4 border border-green-200">
                            <div className="text-xs text-green-600 uppercase">Risco Baixo</div>
                            <div className="text-2xl font-bold text-green-900">{data.summary.low_risk}</div>
                        </div>
                        <div className="bg-orange-50 rounded-lg shadow p-4 border border-orange-200">
                            <div className="text-xs text-orange-600 uppercase">Precisam Repor</div>
                            <div className="text-2xl font-bold text-orange-900">{data.summary.needs_reorder}</div>
                        </div>
                    </div>

                    {/* Materials Table */}
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="px-6 py-4 border-b bg-gray-50">
                            <h3 className="text-lg font-medium text-gray-900">Previsão por Material</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Ordenado por dias até esgotamento (mais críticos primeiro)
                            </p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Material</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Estoque Atual</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Consumo/Dia</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Previsão {forecastDays}d</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Restante</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Dias p/ Esgotar</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Risco</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {data.materials.map((material) => (
                                        <tr
                                            key={material.material_id}
                                            className={`hover:bg-gray-50 ${
                                                material.risk_level === 'high' ? 'bg-red-50' :
                                                material.risk_level === 'medium' ? 'bg-yellow-50' : ''
                                            }`}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{material.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                                                {material.current_stock.toFixed(2)} {material.unit}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                                                {material.avg_daily_consumption.toFixed(2)} {material.unit}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                                                {material.forecasted_consumption.toFixed(2)} {material.unit}
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${
                                                material.forecasted_remaining < 0 ? 'text-red-600' : 'text-gray-900'
                                            }`}>
                                                {material.forecasted_remaining.toFixed(2)} {material.unit}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {material.days_until_stockout !== null ? (
                                                    <span className={`font-bold ${
                                                        material.days_until_stockout <= 7 ? 'text-red-600' :
                                                        material.days_until_stockout <= 30 ? 'text-yellow-600' : 'text-green-600'
                                                    }`}>
                                                        {material.days_until_stockout} dias
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {getRiskBadge(material.risk_level)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Needs Reorder Alert */}
                    {data.materials.filter(m => m.needs_reorder).length > 0 && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <h3 className="text-lg font-medium text-orange-900">
                                    {data.materials.filter(m => m.needs_reorder).length} materiais precisam de reposição
                                </h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {data.materials.filter(m => m.needs_reorder).slice(0, 10).map((material) => (
                                    <span
                                        key={material.material_id}
                                        className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                                    >
                                        {material.name}
                                    </span>
                                ))}
                                {data.materials.filter(m => m.needs_reorder).length > 10 && (
                                    <span className="px-3 py-1 bg-orange-200 text-orange-900 rounded-full text-sm font-medium">
                                        +{data.materials.filter(m => m.needs_reorder).length - 10} mais
                                    </span>
                                )}
                            </div>
                            <Link
                                href="/admin/purchase-suggestions"
                                className="inline-flex items-center mt-4 text-orange-700 hover:text-orange-900 font-medium"
                            >
                                Ver Sugestões de Compra
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
