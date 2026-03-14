import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Usage({ statistics, byColor, filters }) {
    const [from, setFrom] = useState(filters.from);
    const [to, setTo] = useState(filters.to);

    const handleFilter = (e) => {
        e.preventDefault();
        router.get('/admin/threads/usage', { from, to }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Relatório de Uso de Linhas</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Análise de consumo por período
                        </p>
                    </div>
                    <Link href="/admin/threads" className="text-gray-600 hover:text-gray-900">
                        Voltar
                    </Link>
                </div>
            }
        >
            <Head title="Uso de Linhas" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Date Filter */}
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

                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="text-sm text-gray-500 uppercase">Total Consumido</div>
                            <div className="text-2xl font-bold text-gray-900">
                                {new Intl.NumberFormat('pt-BR').format(statistics.totals.total_meters_consumed)}m
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="text-sm text-gray-500 uppercase">Transações</div>
                            <div className="text-2xl font-bold text-gray-900">{statistics.totals.total_transactions}</div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="text-sm text-gray-500 uppercase">Linhas Utilizadas</div>
                            <div className="text-2xl font-bold text-gray-900">{statistics.totals.unique_threads_used}</div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="text-sm text-gray-500 uppercase">Período</div>
                            <div className="text-lg font-bold text-gray-900">
                                {new Date(statistics.period.from).toLocaleDateString('pt-BR')} - {new Date(statistics.period.to).toLocaleDateString('pt-BR')}
                            </div>
                        </div>
                    </div>

                    {/* Type Distribution */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Consumo por Tipo</h3>
                            <div className="space-y-4">
                                {statistics.by_type.map((type) => (
                                    <div key={type.type} className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <span className={`w-3 h-3 rounded-full mr-2 ${
                                                type.type === 'standard' ? 'bg-emerald-500' : 'bg-purple-500'
                                            }`}></span>
                                            <span className="text-gray-700 capitalize">{type.type}</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium text-gray-900">
                                                {new Intl.NumberFormat('pt-BR').format(type.total_meters)}m
                                            </div>
                                            <div className="text-xs text-gray-500">{type.thread_count} linhas</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Daily Trend */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Tendência Diária</h3>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {statistics.daily_trend.map((day) => (
                                    <div key={day.date} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                                        <span className="text-sm text-gray-600">
                                            {new Date(day.date).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })}
                                        </span>
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs text-emerald-600">{new Intl.NumberFormat('pt-BR').format(day.standard)}m std</span>
                                            <span className="text-xs text-purple-600">{new Intl.NumberFormat('pt-BR').format(day.specialty)}m spec</span>
                                            <span className="font-medium text-gray-900">{new Intl.NumberFormat('pt-BR').format(day.total_meters)}m</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Top Threads */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b bg-gray-50">
                            <h3 className="text-lg font-medium text-gray-900">Top 20 Linhas Mais Consumidas</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Linha</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Tipo</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Consumido</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Transações</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {statistics.by_thread.map((thread, idx) => (
                                        <tr key={thread.thread_id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {idx + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{thread.thread_name}</div>
                                                <div className="text-xs text-gray-500">{thread.color_code}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    thread.thread_type === 'standard'
                                                        ? 'bg-emerald-100 text-emerald-800'
                                                        : 'bg-purple-100 text-purple-800'
                                                }`}>
                                                    {thread.thread_type === 'standard' ? 'Standard' : 'Specialty'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center font-medium text-gray-900">
                                                {new Intl.NumberFormat('pt-BR').format(thread.total_meters)}m
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                                                {thread.transaction_count}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Usage by Embroidery Color */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b bg-gray-50">
                            <h3 className="text-lg font-medium text-gray-900">Uso por Cor de Bordado</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Total: {byColor.total_usage} bordados | {new Intl.NumberFormat('pt-BR').format(byColor.total_estimated_meters)}m estimados
                            </p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cor de Bordado</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Linha Vinculada</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Vezes Usado</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Metros Est.</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {byColor.colors.map((color) => (
                                        <tr key={color.color_id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {color.hex_code && (
                                                        <div
                                                            className="w-6 h-6 rounded-full mr-3 border"
                                                            style={{ backgroundColor: color.hex_code }}
                                                        />
                                                    )}
                                                    <span className="text-sm font-medium text-gray-900">{color.color_name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {color.thread_name ? (
                                                    <div>
                                                        <div className="text-sm text-gray-900">{color.thread_name}</div>
                                                        <div className="text-xs text-gray-500 capitalize">{color.thread_type}</div>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-400">Não vinculada</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center font-medium text-gray-900">
                                                {color.usage_count}x
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                                                {new Intl.NumberFormat('pt-BR').format(color.estimated_meters)}m
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
