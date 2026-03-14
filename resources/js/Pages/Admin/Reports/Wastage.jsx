import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Wastage({ data, filters }) {
    const [from, setFrom] = useState(filters.from || '');
    const [to, setTo] = useState(filters.to || '');

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value || 0);
    };

    const handleFilter = (e) => {
        e.preventDefault();
        router.get('/admin/reports/advanced/wastage', { from, to }, { preserveState: true });
    };

    const typeLabels = {
        adjustment: 'Ajuste',
        wastage: 'Desperdício',
        damage: 'Dano',
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Perdas e Ajustes</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Tracking de desperdícios e ajustes de estoque
                        </p>
                    </div>
                    <Link href="/admin/reports/advanced" className="text-gray-600 hover:text-gray-900">
                        Voltar
                    </Link>
                </div>
            }
        >
            <Head title="Perdas e Ajustes" />

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
                            <button
                                type="submit"
                                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                            >
                                Filtrar
                            </button>
                        </form>
                    </div>

                    {/* Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="text-xs text-gray-500 uppercase">Total de Ajustes</div>
                            <div className="text-2xl font-bold text-gray-900">{data.summary.total_adjustments}</div>
                        </div>
                        <div className="bg-red-50 rounded-lg shadow p-4 border border-red-200">
                            <div className="text-xs text-red-600 uppercase">Custo Total de Perdas</div>
                            <div className="text-2xl font-bold text-red-900">{formatCurrency(data.summary.total_cost)}</div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="text-xs text-gray-500 uppercase">Materiais Afetados</div>
                            <div className="text-2xl font-bold text-gray-900">{data.summary.materials_affected}</div>
                        </div>
                    </div>

                    {/* By Type */}
                    {Object.keys(data.by_type).length > 0 && (
                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Por Tipo de Ajuste</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {Object.entries(data.by_type).map(([type, info]) => (
                                    <div key={type} className="p-4 bg-gray-50 rounded-lg">
                                        <div className="text-sm font-medium text-gray-500 uppercase">
                                            {typeLabels[type] || type}
                                        </div>
                                        <div className="mt-2">
                                            <div className="text-xl font-bold text-gray-900">
                                                {info.count} registros
                                            </div>
                                            <div className="text-sm text-red-600">
                                                {formatCurrency(info.total_cost)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* By Material */}
                    {data.by_material.length > 0 && (
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="px-6 py-4 border-b bg-gray-50">
                                <h3 className="text-lg font-medium text-gray-900">Top Materiais com Ajustes</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Material</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Ajustes</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Quantidade</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Custo Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {data.by_material.map((item) => (
                                            <tr key={item.material_id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {item.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                                    {item.adjustments_count}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                                                    {item.total_quantity.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-red-600">
                                                    {formatCurrency(item.total_cost)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Daily Trend */}
                    {data.daily_trend.length > 0 && (
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="px-6 py-4 border-b bg-gray-50">
                                <h3 className="text-lg font-medium text-gray-900">Tendência Diária</h3>
                            </div>
                            <div className="p-6 max-h-96 overflow-y-auto">
                                <div className="space-y-2">
                                    {data.daily_trend.map((day) => (
                                        <div key={day.date} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                                            <span className="text-sm text-gray-600">
                                                {new Date(day.date).toLocaleDateString('pt-BR', {
                                                    weekday: 'short',
                                                    day: '2-digit',
                                                    month: 'short'
                                                })}
                                            </span>
                                            <div className="flex items-center gap-4">
                                                <span className="text-xs text-gray-500">{day.count} ajustes</span>
                                                <span className="font-medium text-red-600">{formatCurrency(day.total_cost)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {data.summary.total_adjustments === 0 && (
                        <div className="text-center py-12 bg-white rounded-lg shadow">
                            <svg className="mx-auto h-12 w-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum ajuste no período</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Não foram registradas perdas ou ajustes neste período.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
