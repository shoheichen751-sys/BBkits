import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function LowStockAlerts({ materials, suppliers, filters, stats }) {
    const [search, setSearch] = useState(filters.search || '');
    const [supplierId, setSupplierId] = useState(filters.supplier_id || '');
    const [severity, setSeverity] = useState(filters.severity || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.reports.low-stock-alerts'), {
            search,
            supplier_id: supplierId,
            severity,
        }, { preserveState: true });
    };

    const clearFilters = () => {
        setSearch('');
        setSupplierId('');
        setSeverity('');
        router.get(route('admin.reports.low-stock-alerts'));
    };

    const getSeverityBadge = (severity) => {
        const badges = {
            critical: 'bg-red-100 text-red-800 border border-red-200',
            low: 'bg-orange-100 text-orange-800 border border-orange-200',
            warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
            normal: 'bg-green-100 text-green-800 border border-green-200'
        };
        return badges[severity] || badges.normal;
    };

    const getSeverityIcon = (severity) => {
        const icons = {
            critical: '🚨',
            low: '⚠️',
            warning: '🟡',
            normal: '✅'
        };
        return icons[severity] || icons.normal;
    };

    const getSeverityLabel = (severity) => {
        const labels = {
            critical: 'Crítico',
            low: 'Baixo',
            warning: 'Atenção',
            normal: 'Normal'
        };
        return labels[severity] || severity;
    };

    const formatStock = (stock, unit) => {
        return Number(stock).toLocaleString('pt-BR', { minimumFractionDigits: 3 }) + ' ' + unit;
    };

    const formatCurrency = (value) => {
        return 'R$ ' + Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <div className="flex items-center space-x-3">
                            <Link
                                href={route('admin.reports.index')}
                                className="text-purple-600 hover:text-purple-800"
                            >
                                ← Voltar aos Relatórios
                            </Link>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mt-2">Alertas de Estoque Baixo</h2>
                        <p className="mt-1 text-sm text-gray-600">Materiais que precisam de atenção urgente</p>
                    </div>
                </div>
            }
        >
            <Head title="Alertas de Estoque Baixo" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white overflow-hidden shadow rounded-lg border border-red-200">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">🚨</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Críticos</dt>
                                            <dd className="text-lg font-medium text-gray-900">{stats.critical}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg border border-orange-200">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">⚠️</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Baixo</dt>
                                            <dd className="text-lg font-medium text-gray-900">{stats.low}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg border border-yellow-200">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">🟡</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Atenção</dt>
                                            <dd className="text-lg font-medium text-gray-900">{stats.warning}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg border border-blue-200">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">📊</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Total</dt>
                                            <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white shadow rounded-lg">
                        <form onSubmit={handleSearch} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
                                    <input
                                        type="text"
                                        placeholder="Nome ou referência..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fornecedor</label>
                                    <select
                                        value={supplierId}
                                        onChange={(e) => setSupplierId(e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                    >
                                        <option value="">Todos os fornecedores</option>
                                        {suppliers.map(supplier => (
                                            <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Severidade</label>
                                    <select
                                        value={severity}
                                        onChange={(e) => setSeverity(e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                    >
                                        <option value="">Todas as severidades</option>
                                        <option value="critical">Crítico</option>
                                        <option value="low">Baixo</option>
                                        <option value="warning">Atenção</option>
                                    </select>
                                </div>
                                <div className="flex items-end space-x-2">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                                    >
                                        Filtrar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Limpar
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Materials List */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        {materials.data.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Material
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Severidade
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Estoque Atual
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Estoque Mínimo
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Fornecedor
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Preço Unitário
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Dias até Esgotar
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {materials.data.map((material) => (
                                        <tr key={material.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{material.name}</div>
                                                    <div className="text-sm text-gray-500">Ref: {material.reference}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityBadge(material.severity)}`}>
                                                    <span className="mr-1">{getSeverityIcon(material.severity)}</span>
                                                    {getSeverityLabel(material.severity)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {formatStock(material.current_stock, material.unit)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {formatStock(material.minimum_stock, material.unit)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {material.supplier?.name || '-'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {formatCurrency(material.purchase_price)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {material.days_until_stockout ? (
                                                        <span className={`${
                                                            material.days_until_stockout <= 7 ? 'text-red-600 font-semibold' :
                                                            material.days_until_stockout <= 14 ? 'text-orange-600' :
                                                            'text-gray-600'
                                                        }`}>
                                                            {material.days_until_stockout} dias
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Link
                                                    href={route('admin.materials.show', {material: material.id})}
                                                    className="text-purple-600 hover:text-purple-900 mr-3"
                                                >
                                                    Ver Detalhes
                                                </Link>
                                                <Link
                                                    href={route('admin.materials.edit', {material: material.id})}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    Ajustar Estoque
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center py-12">
                                <span className="text-green-500 text-6xl">✅</span>
                                <h3 className="mt-4 text-lg font-medium text-gray-900">Ótimas notícias!</h3>
                                <p className="mt-2 text-gray-500">Nenhum material com estoque baixo encontrado.</p>
                                <div className="mt-6">
                                    <Link
                                        href={route('admin.materials.index')}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                                    >
                                        Ver Todos os Materiais
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Pagination */}
                        {materials.links && (
                            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Mostrando {materials.from} a {materials.to} de {materials.total} resultados
                                    </div>
                                    <div className="flex space-x-1">
                                        {materials.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url}
                                                className={`px-3 py-2 text-sm ${
                                                    link.active
                                                        ? 'bg-purple-500 text-white'
                                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                                } border border-gray-300 rounded`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}