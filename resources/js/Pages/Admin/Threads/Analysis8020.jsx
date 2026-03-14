import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Analysis8020({ analysis, lowStock }) {
    const { totals, percentages, inventory, top_standard, top_specialty, compliance } = analysis;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Análise 80/20 de Linhas</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Otimização de estoque: Standard (80%) vs Specialty (20%)
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href="/admin/threads/export-pdf"
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                        >
                            Exportar PDF
                        </Link>
                        <Link
                            href="/admin/threads"
                            className="text-gray-600 hover:text-gray-900"
                        >
                            Voltar
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Análise 80/20" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Compliance Status */}
                    <div className={`rounded-lg p-6 ${
                        compliance.standard_compliant
                            ? 'bg-green-50 border border-green-200'
                            : 'bg-yellow-50 border border-yellow-200'
                    }`}>
                        <div className="flex items-start">
                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                                compliance.standard_compliant ? 'bg-green-100' : 'bg-yellow-100'
                            }`}>
                                {compliance.standard_compliant ? (
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                )}
                            </div>
                            <div className="ml-4">
                                <h3 className={`text-lg font-medium ${
                                    compliance.standard_compliant ? 'text-green-800' : 'text-yellow-800'
                                }`}>
                                    {compliance.standard_compliant ? 'Conformidade 80/20 OK' : 'Atenção ao Padrão 80/20'}
                                </h3>
                                <p className={`mt-1 text-sm ${
                                    compliance.standard_compliant ? 'text-green-700' : 'text-yellow-700'
                                }`}>
                                    {compliance.recommendation}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Main Stats */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Distribution Chart */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Distribuição de Consumo</h3>
                            <div className="space-y-4">
                                {/* Progress Bar */}
                                <div className="h-8 rounded-full overflow-hidden flex bg-gray-100">
                                    <div
                                        className="bg-gradient-to-r from-emerald-500 to-emerald-400 flex items-center justify-center text-white text-sm font-medium"
                                        style={{ width: `${percentages.standard_consumption_percent}%` }}
                                    >
                                        {percentages.standard_consumption_percent > 15 && `${percentages.standard_consumption_percent}%`}
                                    </div>
                                    <div
                                        className="bg-gradient-to-r from-purple-500 to-purple-400 flex items-center justify-center text-white text-sm font-medium"
                                        style={{ width: `${percentages.specialty_consumption_percent}%` }}
                                    >
                                        {percentages.specialty_consumption_percent > 15 && `${percentages.specialty_consumption_percent}%`}
                                    </div>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <div className="flex items-center">
                                        <span className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></span>
                                        <span className="text-gray-600">Standard: {percentages.standard_consumption_percent}%</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="w-3 h-3 rounded-full bg-purple-500 mr-2"></span>
                                        <span className="text-gray-600">Specialty: {percentages.specialty_consumption_percent}%</span>
                                    </div>
                                </div>
                                <div className="pt-4 border-t">
                                    <p className="text-sm text-gray-500">
                                        Meta ideal: 80% Standard / 20% Specialty
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Thread Counts */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Distribuição de Linhas</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                                    <div className="text-3xl font-bold text-emerald-700">{totals.standard_threads}</div>
                                    <div className="text-sm text-emerald-600">Linhas Standard</div>
                                    <div className="text-xs text-gray-500 mt-1">{percentages.standard_threads_percent}% do total</div>
                                </div>
                                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                    <div className="text-3xl font-bold text-purple-700">{totals.specialty_threads}</div>
                                    <div className="text-sm text-purple-600">Linhas Specialty</div>
                                    <div className="text-xs text-gray-500 mt-1">{percentages.specialty_threads_percent}% do total</div>
                                </div>
                            </div>
                            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                <div className="text-sm text-gray-600">
                                    <span className="font-medium">Consumo Total (90 dias):</span>{' '}
                                    {new Intl.NumberFormat('pt-BR').format(totals.total_consumption_meters)}m
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Inventory Comparison */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Standard Inventory */}
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="px-6 py-4 bg-emerald-500">
                                <h3 className="text-lg font-medium text-white">Estoque Standard</h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900">{inventory.standard.total_spools}</div>
                                        <div className="text-sm text-gray-500">Carretéis</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900">
                                            {new Intl.NumberFormat('pt-BR').format(inventory.standard.total_meters)}m
                                        </div>
                                        <div className="text-sm text-gray-500">Metros</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900">
                                            R$ {new Intl.NumberFormat('pt-BR').format(inventory.standard.total_value)}
                                        </div>
                                        <div className="text-sm text-gray-500">Valor</div>
                                    </div>
                                    <div>
                                        <div className={`text-2xl font-bold ${
                                            inventory.standard.low_stock_count > 0 ? 'text-yellow-600' : 'text-green-600'
                                        }`}>
                                            {inventory.standard.low_stock_count}
                                        </div>
                                        <div className="text-sm text-gray-500">Estoque Baixo</div>
                                    </div>
                                </div>

                                {/* Top Standard Threads */}
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Top 5 Mais Usadas</h4>
                                <div className="space-y-2">
                                    {top_standard.slice(0, 5).map((thread, idx) => (
                                        <div key={thread.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                            <div className="flex items-center">
                                                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-medium mr-2">
                                                    {idx + 1}
                                                </span>
                                                <span className="text-sm text-gray-900">{thread.name}</span>
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                {new Intl.NumberFormat('pt-BR').format(thread.consumption)}m
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Specialty Inventory */}
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="px-6 py-4 bg-purple-500">
                                <h3 className="text-lg font-medium text-white">Estoque Specialty</h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900">{inventory.specialty.total_spools}</div>
                                        <div className="text-sm text-gray-500">Carretéis</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900">
                                            {new Intl.NumberFormat('pt-BR').format(inventory.specialty.total_meters)}m
                                        </div>
                                        <div className="text-sm text-gray-500">Metros</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900">
                                            R$ {new Intl.NumberFormat('pt-BR').format(inventory.specialty.total_value)}
                                        </div>
                                        <div className="text-sm text-gray-500">Valor</div>
                                    </div>
                                    <div>
                                        <div className={`text-2xl font-bold ${
                                            inventory.specialty.low_stock_count > 0 ? 'text-yellow-600' : 'text-green-600'
                                        }`}>
                                            {inventory.specialty.low_stock_count}
                                        </div>
                                        <div className="text-sm text-gray-500">Estoque Baixo</div>
                                    </div>
                                </div>

                                {/* Top Specialty Threads */}
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Top 5 Mais Usadas</h4>
                                <div className="space-y-2">
                                    {top_specialty.slice(0, 5).map((thread, idx) => (
                                        <div key={thread.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                            <div className="flex items-center">
                                                <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-medium mr-2">
                                                    {idx + 1}
                                                </span>
                                                <span className="text-sm text-gray-900">{thread.name}</span>
                                                {thread.has_substitute && (
                                                    <span className="ml-2 px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                                                        Substituto
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                {new Intl.NumberFormat('pt-BR').format(thread.consumption)}m
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Low Stock Alerts */}
                    {lowStock.length > 0 && (
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="px-6 py-4 bg-yellow-500">
                                <h3 className="text-lg font-medium text-white">
                                    Alertas de Estoque Baixo ({lowStock.length})
                                </h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Linha</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Tipo</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Atual</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Mínimo</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Substituto</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ação</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {lowStock.map((thread) => (
                                            <tr key={thread.id} className="hover:bg-gray-50">
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
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <span className={`font-medium ${
                                                        thread.spool_count === 0 ? 'text-red-600' : 'text-yellow-600'
                                                    }`}>
                                                        {thread.spool_count}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                                                    {thread.minimum_spools}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    {thread.substitute_available ? (
                                                        <span className="text-green-600">Disponível</span>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <Link
                                                        href={`/admin/threads/${thread.id}/edit`}
                                                        className="text-pink-600 hover:text-pink-900 text-sm"
                                                    >
                                                        Reabastecer
                                                    </Link>
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
