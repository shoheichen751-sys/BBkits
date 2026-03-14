import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function ConsumptionTrends({ data, filters }) {
    const [from, setFrom] = useState(filters.from || '');
    const [to, setTo] = useState(filters.to || '');
    const [groupBy, setGroupBy] = useState(filters.group_by || 'daily');

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value || 0);
    };

    const handleFilter = (e) => {
        e.preventDefault();
        router.get('/admin/reports/advanced/consumption-trends', { from, to, group_by: groupBy }, { preserveState: true });
    };

    const getTrendIcon = (direction) => {
        if (direction === 'up') {
            return <span className="text-red-500">↑</span>;
        }
        if (direction === 'down') {
            return <span className="text-green-500">↓</span>;
        }
        return <span className="text-gray-500">→</span>;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Tendências de Consumo</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Análise de consumo de materiais ao longo do tempo
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <a
                            href={`/admin/reports/advanced/export/consumption-trends?from=${from}&to=${to}&group_by=${groupBy}`}
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
            <Head title="Tendências de Consumo" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Filters */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <form onSubmit={handleFilter} className="flex items-end gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Data Inicial</label>
                                <input
                                    type="date"
                                    value={from}
                                    onChange={(e) => setFrom(e.target.value)}
                                    className="rounded-lg border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Data Final</label>
                                <input
                                    type="date"
                                    value={to}
                                    onChange={(e) => setTo(e.target.value)}
                                    className="rounded-lg border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Agrupar por</label>
                                <select
                                    value={groupBy}
                                    onChange={(e) => setGroupBy(e.target.value)}
                                    className="rounded-lg border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                                >
                                    <option value="daily">Diário</option>
                                    <option value="weekly">Semanal</option>
                                    <option value="monthly">Mensal</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                            >
                                Filtrar
                            </button>
                        </form>
                    </div>

                    {/* Summary */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="text-xs text-gray-500 uppercase">Custo Total</div>
                            <div className="text-2xl font-bold text-gray-900">
                                {formatCurrency(data.summary.total_material_cost)}
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="text-xs text-gray-500 uppercase">Períodos</div>
                            <div className="text-2xl font-bold text-gray-900">{data.summary.total_periods}</div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="text-xs text-gray-500 uppercase">Média por Período</div>
                            <div className="text-2xl font-bold text-gray-900">
                                {formatCurrency(data.summary.average_period_cost)}
                            </div>
                        </div>
                        <div className={`rounded-lg shadow p-4 ${
                            data.summary.trend_direction === 'up' ? 'bg-red-50' :
                            data.summary.trend_direction === 'down' ? 'bg-green-50' : 'bg-gray-50'
                        }`}>
                            <div className="text-xs text-gray-500 uppercase">Tendência</div>
                            <div className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                {getTrendIcon(data.summary.trend_direction)}
                                {Math.abs(data.summary.trend_percent)}%
                            </div>
                        </div>
                    </div>

                    {/* Material Consumption Table */}
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="px-6 py-4 border-b bg-gray-50">
                            <h3 className="text-lg font-medium text-gray-900">Consumo de Materiais por Período</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Período</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Quantidade</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Custo</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Materiais</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {data.material_consumption.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {item.period}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                                                {item.total_quantity?.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                                                {formatCurrency(item.total_cost)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                                {item.materials_count}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Thread Consumption */}
                    {data.thread_consumption?.length > 0 && (
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="px-6 py-4 border-b bg-purple-50">
                                <h3 className="text-lg font-medium text-purple-900">Consumo de Linhas por Período</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Período</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Metros</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Linhas Usadas</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {data.thread_consumption.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {item.period}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                                                    {new Intl.NumberFormat('pt-BR').format(item.total_meters)}m
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                                    {item.threads_count}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
