import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function ThreadUsage({ data, filters }) {
    const [from, setFrom] = useState(filters.from || '');
    const [to, setTo] = useState(filters.to || '');

    const handleFilter = (e) => {
        e.preventDefault();
        router.get('/admin/reports/advanced/thread-usage', { from, to }, { preserveState: true });
    };

    const formatMeters = (value) => {
        return new Intl.NumberFormat('pt-BR').format(value || 0);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Uso de Linhas de Bordado</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Análise detalhada do consumo de linhas
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href="/admin/threads/analysis-8020"
                            className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg transition-colors"
                        >
                            Análise 80/20
                        </Link>
                        <Link href="/admin/reports/advanced" className="text-gray-600 hover:text-gray-900">
                            Voltar
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Uso de Linhas" />

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
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="text-xs text-gray-500 uppercase">Total Consumido</div>
                            <div className="text-2xl font-bold text-gray-900">
                                {formatMeters(data.summary.total_meters)}m
                            </div>
                        </div>
                        <div className="bg-emerald-50 rounded-lg shadow p-4 border border-emerald-200">
                            <div className="text-xs text-emerald-600 uppercase">Standard</div>
                            <div className="text-2xl font-bold text-emerald-900">
                                {formatMeters(data.summary.standard_meters)}m
                            </div>
                        </div>
                        <div className="bg-purple-50 rounded-lg shadow p-4 border border-purple-200">
                            <div className="text-xs text-purple-600 uppercase">Specialty</div>
                            <div className="text-2xl font-bold text-purple-900">
                                {formatMeters(data.summary.specialty_meters)}m
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="text-xs text-gray-500 uppercase">Linhas Usadas</div>
                            <div className="text-2xl font-bold text-gray-900">{data.summary.threads_used}</div>
                        </div>
                    </div>

                    {/* 80/20 Efficiency */}
                    <div className={`rounded-lg shadow p-6 ${
                        data.efficiency.is_compliant
                            ? 'bg-green-50 border border-green-200'
                            : 'bg-yellow-50 border border-yellow-200'
                    }`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className={`text-lg font-medium ${
                                data.efficiency.is_compliant ? 'text-green-900' : 'text-yellow-900'
                            }`}>
                                Eficiência 80/20
                            </h3>
                            {data.efficiency.is_compliant ? (
                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                    Em Conformidade
                                </span>
                            ) : (
                                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                                    Fora do Alvo
                                </span>
                            )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <div className="text-sm text-gray-600">Standard Atual</div>
                                <div className="text-xl font-bold text-emerald-700">
                                    {data.efficiency.standard_percent}%
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-600">Specialty Atual</div>
                                <div className="text-xl font-bold text-purple-700">
                                    {data.efficiency.specialty_percent}%
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-600">Meta Standard</div>
                                <div className="text-xl font-bold text-gray-700">
                                    {data.efficiency.target_standard}%
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-600">Gap</div>
                                <div className={`text-xl font-bold ${
                                    data.efficiency.compliance_gap > 0 ? 'text-red-600' : 'text-green-600'
                                }`}>
                                    {data.efficiency.compliance_gap > 0 ? '+' : ''}{data.efficiency.compliance_gap}%
                                </div>
                            </div>
                        </div>
                        {/* Progress Bar */}
                        <div className="mt-4">
                            <div className="flex h-4 rounded-full overflow-hidden">
                                <div
                                    className="bg-emerald-500"
                                    style={{ width: `${data.efficiency.standard_percent}%` }}
                                />
                                <div
                                    className="bg-purple-500"
                                    style={{ width: `${data.efficiency.specialty_percent}%` }}
                                />
                            </div>
                            <div className="flex justify-between mt-1 text-xs text-gray-500">
                                <span>Standard: {data.efficiency.standard_percent}%</span>
                                <span>Specialty: {data.efficiency.specialty_percent}%</span>
                            </div>
                        </div>
                    </div>

                    {/* By Type */}
                    {data.by_type.length > 0 && (
                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Consumo por Tipo</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {data.by_type.map((type) => (
                                    <div key={type.type} className={`p-4 rounded-lg ${
                                        type.type === 'standard' ? 'bg-emerald-50' : 'bg-purple-50'
                                    }`}>
                                        <div className={`text-sm font-medium uppercase ${
                                            type.type === 'standard' ? 'text-emerald-600' : 'text-purple-600'
                                        }`}>
                                            {type.type === 'standard' ? 'Standard (80%)' : 'Specialty (20%)'}
                                        </div>
                                        <div className={`text-2xl font-bold mt-2 ${
                                            type.type === 'standard' ? 'text-emerald-900' : 'text-purple-900'
                                        }`}>
                                            {formatMeters(type.total_meters)}m
                                        </div>
                                        <div className="text-sm text-gray-500 mt-1">
                                            {type.threads_used} linhas utilizadas
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Top Threads */}
                    {data.top_threads.length > 0 && (
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="px-6 py-4 border-b bg-gray-50">
                                <h3 className="text-lg font-medium text-gray-900">Top 20 Linhas Mais Usadas</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Linha</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Tipo</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Metros</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Usos</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {data.top_threads.map((thread, idx) => (
                                            <tr key={thread.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {idx + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{thread.name}</div>
                                                    <div className="text-xs text-gray-500">{thread.color_code}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        thread.type === 'standard'
                                                            ? 'bg-emerald-100 text-emerald-800'
                                                            : 'bg-purple-100 text-purple-800'
                                                    }`}>
                                                        {thread.type === 'standard' ? 'Standard' : 'Specialty'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                                                    {formatMeters(thread.total_meters)}m
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                                    {thread.usage_count}
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
                                <h3 className="text-lg font-medium text-gray-900">Consumo Diário</h3>
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
                                                <span className="text-xs text-emerald-600">{formatMeters(day.standard)}m std</span>
                                                <span className="text-xs text-purple-600">{formatMeters(day.specialty)}m spec</span>
                                                <span className="font-medium text-gray-900">{formatMeters(day.total)}m</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
