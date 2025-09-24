import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function SupplierPerformance({ supplierMetrics, topSuppliers, suppliersNeedingAttention, purchaseActivity, filters, summaryStats }) {
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route('admin.reports.supplier-performance'), {
            date_from: dateFrom,
            date_to: dateTo,
        }, { preserveState: true });
    };

    const clearFilters = () => {
        setDateFrom('');
        setDateTo('');
        router.get(route('admin.reports.supplier-performance'));
    };

    const formatCurrency = (value) => {
        return 'R$ ' + Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    };

    const getPerformanceColor = (score) => {
        if (score >= 90) return 'text-green-600';
        if (score >= 75) return 'text-yellow-600';
        if (score >= 60) return 'text-orange-600';
        return 'text-red-600';
    };

    const getPerformanceBadge = (score) => {
        if (score >= 90) return 'bg-green-100 text-green-800 border border-green-200';
        if (score >= 75) return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
        if (score >= 60) return 'bg-orange-100 text-orange-800 border border-orange-200';
        return 'bg-red-100 text-red-800 border border-red-200';
    };

    const getPerformanceLabel = (score) => {
        if (score >= 90) return 'Excelente';
        if (score >= 75) return 'Bom';
        if (score >= 60) return 'Regular';
        return 'Crítico';
    };

    const getReliabilityColor = (reliability) => {
        if (reliability >= 90) return 'text-green-600';
        if (reliability >= 75) return 'text-yellow-600';
        if (reliability >= 60) return 'text-orange-600';
        return 'text-red-600';
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
                        <h2 className="text-xl font-semibold text-gray-900 mt-2">Performance dos Fornecedores</h2>
                        <p className="mt-1 text-sm text-gray-600">Análise detalhada do desempenho e confiabilidade</p>
                    </div>
                </div>
            }
        >
            <Head title="Performance dos Fornecedores" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Summary Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white overflow-hidden shadow rounded-lg border border-blue-200">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">🏢</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Total Fornecedores</dt>
                                            <dd className="text-lg font-medium text-gray-900">{summaryStats.total_suppliers}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg border border-green-200">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">✅</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Ativos</dt>
                                            <dd className="text-lg font-medium text-gray-900">{summaryStats.active_suppliers}</dd>
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
                                            <span className="text-white text-sm font-medium">📊</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Performance Média</dt>
                                            <dd className={`text-lg font-medium ${getPerformanceColor(summaryStats.avg_performance_score)}`}>
                                                {summaryStats.avg_performance_score}%
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg border border-purple-200">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">💰</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Valor Total</dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                {formatCurrency(summaryStats.total_stock_value)}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Top Performers */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">🏆 Top 5 Fornecedores</h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {Array.isArray(topSuppliers) ? topSuppliers.map((supplier, index) => (
                                    <div key={supplier.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium ${
                                                    index === 0 ? 'bg-yellow-500' :
                                                    index === 1 ? 'bg-gray-400' :
                                                    index === 2 ? 'bg-orange-600' : 'bg-purple-500'
                                                }`}>
                                                    {index + 1}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
                                                <div className="text-sm text-gray-500">
                                                    {supplier.total_materials} materiais • {formatCurrency(supplier.total_stock_value)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPerformanceBadge(supplier.performance_score)}`}>
                                                {supplier.performance_score}% - {getPerformanceLabel(supplier.performance_score)}
                                            </span>
                                            <span className={`text-sm font-medium ${getReliabilityColor(supplier.stock_reliability)}`}>
                                                {supplier.stock_reliability}% confiável
                                            </span>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">Nenhum fornecedor encontrado</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Suppliers Needing Attention */}
                    {Array.isArray(suppliersNeedingAttention) && suppliersNeedingAttention.length > 0 && (
                        <div className="bg-white shadow rounded-lg border-l-4 border-red-400">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">⚠️ Fornecedores que Precisam de Atenção</h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {suppliersNeedingAttention.map((supplier) => (
                                        <div key={supplier.id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
                                                <div className="text-sm text-gray-600">
                                                    {supplier.out_of_stock_materials > 0 && (
                                                        <span className="text-red-600">
                                                            {supplier.out_of_stock_materials} materiais sem estoque
                                                        </span>
                                                    )}
                                                    {supplier.low_stock_materials > 0 && (
                                                        <span className="text-orange-600 ml-2">
                                                            {supplier.low_stock_materials} com estoque baixo
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPerformanceBadge(supplier.performance_score)}`}>
                                                    {supplier.performance_score}%
                                                </span>
                                                <Link
                                                    href={route('admin.suppliers.show', supplier.id)}
                                                    className="text-purple-600 hover:text-purple-900 text-sm font-medium"
                                                >
                                                    Ver Detalhes
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Filters */}
                    <div className="bg-white shadow rounded-lg">
                        <form onSubmit={handleFilter} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Data Início</label>
                                    <input
                                        type="date"
                                        value={dateFrom}
                                        onChange={(e) => setDateFrom(e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Data Fim</label>
                                    <input
                                        type="date"
                                        value={dateTo}
                                        onChange={(e) => setDateTo(e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                    />
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

                    {/* All Suppliers Performance */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Todos os Fornecedores</h3>
                        </div>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fornecedor
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Performance
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Confiabilidade
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Materiais
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Valor do Estoque
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Problemas
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Atividade Recente
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {Array.isArray(supplierMetrics) ? supplierMetrics.map((supplier) => (
                                    <tr key={supplier.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
                                                <div className="text-sm text-gray-500">{supplier.email}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPerformanceBadge(supplier.performance_score)}`}>
                                                {supplier.performance_score}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`text-sm font-medium ${getReliabilityColor(supplier.stock_reliability)}`}>
                                                {supplier.stock_reliability}%
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{supplier.total_materials}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {formatCurrency(supplier.total_stock_value)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm">
                                                {supplier.out_of_stock_materials > 0 && (
                                                    <span className="text-red-600 block">
                                                        {supplier.out_of_stock_materials} sem estoque
                                                    </span>
                                                )}
                                                {supplier.low_stock_materials > 0 && (
                                                    <span className="text-orange-600 block">
                                                        {supplier.low_stock_materials} estoque baixo
                                                    </span>
                                                )}
                                                {supplier.out_of_stock_materials === 0 && supplier.low_stock_materials === 0 && (
                                                    <span className="text-green-600">✓ OK</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {supplier.recent_transactions} transações
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="7" className="text-center py-8">
                                            <p className="text-gray-500">Nenhum fornecedor encontrado</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}