import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ simulation }) {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value || 0);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const results = simulation.results || {};
    const summary = results.summary || {};

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">{simulation.name}</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Criado em {formatDate(simulation.created_at)}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <a
                            href={`/admin/batch-simulation/${simulation.id}/export-pdf`}
                            className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg transition-colors"
                        >
                            Exportar PDF
                        </a>
                        <Link href="/admin/batch-simulation" className="text-gray-600 hover:text-gray-900">
                            Voltar
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={simulation.name} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="text-xs text-gray-500 uppercase">Produtos</div>
                            <div className="text-2xl font-bold text-gray-900">{summary.total_products || 0}</div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="text-xs text-gray-500 uppercase">Unidades</div>
                            <div className="text-2xl font-bold text-gray-900">{summary.total_units || 0}</div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="text-xs text-gray-500 uppercase">Materiais</div>
                            <div className="text-2xl font-bold text-gray-900">{summary.total_materials || 0}</div>
                        </div>
                        <div className="bg-blue-50 rounded-lg shadow p-4 border border-blue-200">
                            <div className="text-xs text-blue-600 uppercase">Custo Total</div>
                            <div className="text-2xl font-bold text-blue-900">{formatCurrency(summary.total_cost)}</div>
                        </div>
                        <div className={`rounded-lg shadow p-4 border ${
                            summary.can_produce
                                ? 'bg-green-50 border-green-200'
                                : 'bg-red-50 border-red-200'
                        }`}>
                            <div className={`text-xs uppercase ${
                                summary.can_produce ? 'text-green-600' : 'text-red-600'
                            }`}>Status</div>
                            <div className={`text-lg font-bold ${
                                summary.can_produce ? 'text-green-900' : 'text-red-900'
                            }`}>
                                {summary.can_produce ? 'Viável' : `${summary.shortages_count} Faltantes`}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    {simulation.description && (
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Descrição</h3>
                            <p className="text-gray-900">{simulation.description}</p>
                        </div>
                    )}

                    {/* Products */}
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="px-6 py-4 border-b bg-gray-50">
                            <h3 className="text-lg font-medium text-gray-900">Produtos na Simulação</h3>
                        </div>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produto</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Quantidade</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Custo Unit.</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Custo Total</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Materiais</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {results.products?.map((product, idx) => (
                                    <tr key={idx} className={!product.success ? 'bg-yellow-50' : ''}>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{product.product_name}</div>
                                            {!product.success && (
                                                <div className="text-xs text-red-600">{product.error}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center text-sm text-gray-900">{product.quantity}</td>
                                        <td className="px-6 py-4 text-right text-sm text-gray-500">
                                            {formatCurrency(product.unit_cost)}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                                            {formatCurrency(product.total_cost)}
                                        </td>
                                        <td className="px-6 py-4 text-center text-sm text-gray-500">
                                            {product.materials_count || '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Shortages Alert */}
                    {results.shortages?.length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg overflow-hidden">
                            <div className="px-6 py-4 border-b border-red-200 flex items-center gap-2">
                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <h3 className="text-lg font-medium text-red-800">Materiais Faltantes</h3>
                            </div>
                            <table className="min-w-full divide-y divide-red-200">
                                <thead className="bg-red-100">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase">Material</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-red-800 uppercase">Necessário</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-red-800 uppercase">Disponível</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-red-800 uppercase">Faltante</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-red-800 uppercase">Custo Est.</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-red-200">
                                    {results.shortages.map((shortage) => (
                                        <tr key={shortage.material_id}>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{shortage.name}</td>
                                            <td className="px-6 py-4 text-right text-sm text-gray-600">
                                                {shortage.needed} {shortage.unit}
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm text-gray-600">
                                                {shortage.available} {shortage.unit}
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-bold text-red-700">
                                                {shortage.shortage} {shortage.unit}
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm text-gray-900">
                                                {formatCurrency(shortage.shortage_cost)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-red-100">
                                    <tr>
                                        <td colSpan="4" className="px-6 py-3 text-right text-sm font-medium text-red-800">
                                            Total Custo Faltantes:
                                        </td>
                                        <td className="px-6 py-3 text-right text-sm font-bold text-red-900">
                                            {formatCurrency(summary.shortage_total_cost)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                            <div className="px-6 py-4 border-t border-red-200">
                                <Link
                                    href="/admin/purchase-suggestions"
                                    className="inline-flex items-center text-red-700 hover:text-red-900"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                    Ver Sugestões de Compra
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* All Materials */}
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="px-6 py-4 border-b bg-gray-50">
                            <h3 className="text-lg font-medium text-gray-900">Lista Completa de Materiais</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Total: {results.materials?.length || 0} materiais necessários
                            </p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Material</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Necessário</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Em Estoque</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Custo Unit.</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Custo Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {results.materials?.map((material) => (
                                        <tr key={material.material_id} className={material.shortage > 0 ? 'bg-red-50' : ''}>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">{material.name}</div>
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm text-gray-600">
                                                {material.quantity_needed?.toFixed(2)} {material.unit}
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm text-gray-600">
                                                {material.current_stock?.toFixed(2)} {material.unit}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {material.shortage > 0 ? (
                                                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                                                        Faltam {material.shortage?.toFixed(2)}
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                                        Disponível
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm text-gray-500">
                                                {formatCurrency(material.unit_cost)}
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                                                {formatCurrency(material.total_cost)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-gray-50">
                                    <tr>
                                        <td colSpan="5" className="px-6 py-3 text-right text-sm font-medium text-gray-700">
                                            Custo Total de Materiais:
                                        </td>
                                        <td className="px-6 py-3 text-right text-sm font-bold text-gray-900">
                                            {formatCurrency(summary.total_cost)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
