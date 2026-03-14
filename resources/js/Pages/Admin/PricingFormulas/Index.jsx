import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ formulas, summary, templates }) {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value || 0);
    };

    const getStatusBadge = (isActive, isDefault) => {
        if (isDefault) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Padrão
                </span>
            );
        }
        if (isActive) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Ativa
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Inativa
            </span>
        );
    };

    const handleRecalculate = (formulaId = null) => {
        if (confirm('Deseja recalcular os preços dos produtos?')) {
            router.post('/admin/pricing-formulas/recalculate', {
                formula_id: formulaId,
                update_manual_price: false,
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Fórmulas de Precificação</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Configure fórmulas para cálculo automático de preços
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => handleRecalculate()}
                            className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg transition-colors"
                        >
                            Recalcular Todos
                        </button>
                        <Link
                            href="/admin/pricing-formulas/create"
                            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Nova Fórmula
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Fórmulas de Precificação" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="text-xs text-gray-500 uppercase">Total Produtos</div>
                            <div className="text-2xl font-bold text-gray-900">{summary.total_products}</div>
                        </div>
                        <div className="bg-green-50 rounded-lg shadow p-4 border border-green-200">
                            <div className="text-xs text-green-600 uppercase">Com Fórmula</div>
                            <div className="text-2xl font-bold text-green-700">{summary.with_formula}</div>
                        </div>
                        <div className="bg-yellow-50 rounded-lg shadow p-4 border border-yellow-200">
                            <div className="text-xs text-yellow-600 uppercase">Sem Fórmula</div>
                            <div className="text-2xl font-bold text-yellow-700">{summary.without_formula}</div>
                        </div>
                        <div className="bg-orange-50 rounded-lg shadow p-4 border border-orange-200">
                            <div className="text-xs text-orange-600 uppercase">Requer Recálculo</div>
                            <div className="text-2xl font-bold text-orange-700">{summary.needs_recalculation}</div>
                        </div>
                    </div>

                    {/* Templates Quick Add */}
                    <div className="bg-white shadow rounded-lg mb-6">
                        <div className="px-6 py-4 border-b bg-gray-50">
                            <h3 className="text-lg font-medium text-gray-900">Templates Disponíveis</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Use um template como base para criar novas fórmulas
                            </p>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {Object.entries(templates).map(([key, template]) => (
                                <Link
                                    key={key}
                                    href={`/admin/pricing-formulas/create?template=${key}`}
                                    className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 hover:border-pink-300"
                                >
                                    <div className="font-medium text-gray-900">{template.name}</div>
                                    <div className="text-xs text-gray-500 mt-1">{template.description}</div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Formulas Table */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fórmula
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Categoria
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Configuração
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Produtos
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Prioridade
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {formulas.map((formula) => (
                                    <tr key={formula.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{formula.name}</div>
                                                {formula.description && (
                                                    <div className="text-xs text-gray-500 max-w-xs truncate">
                                                        {formula.description}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formula.product_category?.name || 'Todas'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="text-xs space-y-1">
                                                {formula.formula_config?.markup && (
                                                    <div className="text-gray-600">
                                                        Markup: <span className="font-medium">{formula.formula_config.markup}x</span>
                                                    </div>
                                                )}
                                                {formula.formula_config?.overhead && (
                                                    <div className="text-gray-600">
                                                        Overhead: <span className="font-medium">{formatCurrency(formula.formula_config.overhead)}</span>
                                                    </div>
                                                )}
                                                {formula.target_margin_percent && (
                                                    <div className="text-blue-600">
                                                        Margem: <span className="font-medium">{formula.target_margin_percent}%</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className="text-sm font-medium text-gray-900">{formula.products_count}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className="text-sm font-medium text-gray-600">{formula.priority}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            {getStatusBadge(formula.is_active, formula.is_default)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link
                                                href={`/admin/pricing-formulas/${formula.id}`}
                                                className="text-pink-600 hover:text-pink-900 mr-3"
                                            >
                                                Ver
                                            </Link>
                                            <Link
                                                href={`/admin/pricing-formulas/${formula.id}/edit`}
                                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                                            >
                                                Editar
                                            </Link>
                                            <button
                                                onClick={() => handleRecalculate(formula.id)}
                                                className="text-purple-600 hover:text-purple-900"
                                            >
                                                Recalcular
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {formulas.length === 0 && (
                            <div className="text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma fórmula criada</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Crie uma fórmula para calcular preços automaticamente.
                                </p>
                                <div className="mt-6">
                                    <Link
                                        href="/admin/pricing-formulas/create"
                                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700"
                                    >
                                        Nova Fórmula
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Summary by Formula */}
                    {Object.keys(summary.by_formula).length > 0 && (
                        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Produtos por Fórmula</h3>
                                <div className="space-y-3">
                                    {Object.entries(summary.by_formula).map(([name, count]) => (
                                        <div key={name} className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">{name}</span>
                                            <span className="font-medium text-gray-900">{count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Produtos por Categoria</h3>
                                <div className="space-y-3">
                                    {Object.entries(summary.by_category).map(([name, count]) => (
                                        <div key={name} className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">{name}</span>
                                            <span className="font-medium text-gray-900">{count}</span>
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
