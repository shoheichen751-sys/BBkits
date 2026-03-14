import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function CostAnalysis({ data, filters }) {
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
        router.get('/admin/reports/advanced/cost-analysis', { from, to }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Análise de Custos</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Breakdown de custos por categoria e material
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <a
                            href={`/admin/reports/advanced/export/cost-analysis?from=${from}&to=${to}`}
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
            <Head title="Análise de Custos" />

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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 rounded-lg shadow p-6 border border-blue-200">
                            <div className="text-xs text-blue-600 uppercase font-medium">Valor Total em Estoque</div>
                            <div className="text-3xl font-bold text-blue-900">
                                {formatCurrency(data.inventory_value.total)}
                            </div>
                            <div className="text-sm text-blue-600 mt-1">
                                {data.inventory_value.by_category.length} categorias
                            </div>
                        </div>
                        <div className="bg-green-50 rounded-lg shadow p-6 border border-green-200">
                            <div className="text-xs text-green-600 uppercase font-medium">Total Consumido no Período</div>
                            <div className="text-3xl font-bold text-green-900">
                                {formatCurrency(data.consumption.total)}
                            </div>
                            <div className="text-sm text-green-600 mt-1">
                                {data.period.from} - {data.period.to}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Inventory by Category */}
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="px-6 py-4 border-b bg-blue-50">
                                <h3 className="text-lg font-medium text-blue-900">Valor em Estoque por Categoria</h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {data.inventory_value.by_category.map((item, idx) => (
                                        <div key={idx}>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-sm font-medium text-gray-700">{item.category}</span>
                                                <span className="text-sm font-bold text-gray-900">
                                                    {formatCurrency(item.inventory_value)}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full"
                                                    style={{
                                                        width: `${(item.inventory_value / data.inventory_value.total) * 100}%`
                                                    }}
                                                />
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {item.materials_count} materiais
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Consumption by Category */}
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="px-6 py-4 border-b bg-green-50">
                                <h3 className="text-lg font-medium text-green-900">Consumo por Categoria</h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {data.consumption.by_category.map((item, idx) => (
                                        <div key={idx}>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-sm font-medium text-gray-700">{item.category}</span>
                                                <span className="text-sm font-bold text-gray-900">
                                                    {formatCurrency(item.consumption_cost)}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-green-600 h-2 rounded-full"
                                                    style={{
                                                        width: `${data.consumption.total > 0 ? (item.consumption_cost / data.consumption.total) * 100 : 0}%`
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Top Expensive Materials */}
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="px-6 py-4 border-b bg-orange-50">
                            <h3 className="text-lg font-medium text-orange-900">Top 10 Materiais Mais Consumidos (Valor)</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Material</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Quantidade</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Custo Total</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">% do Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {data.consumption.top_materials.map((material, idx) => (
                                        <tr key={material.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {idx + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {material.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                                                {material.total_quantity?.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                                                {formatCurrency(material.total_cost)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">
                                                    {data.consumption.total > 0
                                                        ? ((material.total_cost / data.consumption.total) * 100).toFixed(1)
                                                        : 0}%
                                                </span>
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
