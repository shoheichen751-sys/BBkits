import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ formula, sampleCalculations }) {
    const [applyModalOpen, setApplyModalOpen] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [updateManualPrice, setUpdateManualPrice] = useState(false);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value || 0);
    };

    const getStatusBadge = (isActive, isDefault) => {
        if (isDefault) {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Padrão
                </span>
            );
        }
        if (isActive) {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Ativa
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                Inativa
            </span>
        );
    };

    const handleRecalculate = () => {
        if (confirm('Recalcular preços de todos os produtos usando esta fórmula?')) {
            router.post('/admin/pricing-formulas/recalculate', {
                formula_id: formula.id,
                update_manual_price: false,
            });
        }
    };

    const handleApplyToProducts = () => {
        router.post('/admin/pricing-formulas/apply-to-products', {
            formula_id: formula.id,
            product_ids: formula.products?.map(p => p.id) || [],
            update_manual_price: updateManualPrice,
        });
        setApplyModalOpen(false);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">{formula.name}</h2>
                            <p className="mt-1 text-sm text-gray-600">
                                {formula.description || 'Sem descrição'}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleRecalculate}
                            className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg transition-colors"
                        >
                            Recalcular
                        </button>
                        <Link
                            href={`/admin/pricing-formulas/${formula.id}/edit`}
                            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Editar
                        </Link>
                        <Link href="/admin/pricing-formulas" className="text-gray-600 hover:text-gray-900">
                            Voltar
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={formula.name} />

            <div className="py-12">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Status Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="text-sm text-gray-500">Status</div>
                            <div className="mt-1">{getStatusBadge(formula.is_active, formula.is_default)}</div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="text-sm text-gray-500">Categoria</div>
                            <div className="text-lg font-medium text-gray-900">
                                {formula.product_category?.name || 'Todas'}
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="text-sm text-gray-500">Produtos Vinculados</div>
                            <div className="text-2xl font-bold text-gray-900">{formula.products?.length || 0}</div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="text-sm text-gray-500">Prioridade</div>
                            <div className="text-2xl font-bold text-gray-900">{formula.priority}</div>
                        </div>
                    </div>

                    {/* Formula Configuration */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b bg-gray-50">
                            <h3 className="text-lg font-medium text-gray-900">Configuração da Fórmula</h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {formula.formula_config?.markup && (
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <div className="text-xs text-blue-600 uppercase font-medium">Markup</div>
                                        <div className="text-2xl font-bold text-blue-900">
                                            {formula.formula_config.markup}x
                                        </div>
                                        <div className="text-xs text-blue-600 mt-1">Custo x Multiplicador</div>
                                    </div>
                                )}
                                {formula.formula_config?.overhead > 0 && (
                                    <div className="bg-green-50 rounded-lg p-4">
                                        <div className="text-xs text-green-600 uppercase font-medium">Overhead</div>
                                        <div className="text-2xl font-bold text-green-900">
                                            {formatCurrency(formula.formula_config.overhead)}
                                        </div>
                                        <div className="text-xs text-green-600 mt-1">Valor fixo adicionado</div>
                                    </div>
                                )}
                                {formula.formula_config?.embroidery_multiplier > 1 && (
                                    <div className="bg-purple-50 rounded-lg p-4">
                                        <div className="text-xs text-purple-600 uppercase font-medium">Bordado</div>
                                        <div className="text-2xl font-bold text-purple-900">
                                            {formula.formula_config.embroidery_multiplier}x
                                        </div>
                                        <div className="text-xs text-purple-600 mt-1">Multiplicador extra</div>
                                    </div>
                                )}
                                {formula.target_margin_percent && (
                                    <div className="bg-orange-50 rounded-lg p-4">
                                        <div className="text-xs text-orange-600 uppercase font-medium">Margem Alvo</div>
                                        <div className="text-2xl font-bold text-orange-900">
                                            {formula.target_margin_percent}%
                                        </div>
                                        <div className="text-xs text-orange-600 mt-1">Margem desejada</div>
                                    </div>
                                )}
                                {formula.minimum_price && (
                                    <div className="bg-red-50 rounded-lg p-4">
                                        <div className="text-xs text-red-600 uppercase font-medium">Preço Mínimo</div>
                                        <div className="text-2xl font-bold text-red-900">
                                            {formatCurrency(formula.minimum_price)}
                                        </div>
                                        <div className="text-xs text-red-600 mt-1">Piso de preço</div>
                                    </div>
                                )}
                            </div>

                            {/* Category Multipliers */}
                            {formula.formula_config?.category_multipliers &&
                             Object.keys(formula.formula_config.category_multipliers).length > 0 && (
                                <div className="mt-6 pt-6 border-t">
                                    <h4 className="text-sm font-medium text-gray-900 mb-3">Multiplicadores por Categoria</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {Object.entries(formula.formula_config.category_multipliers).map(([cat, mult]) => (
                                            <span key={cat} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                                                <span className="font-medium capitalize">{cat}</span>: {mult}x
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sample Calculations */}
                    {sampleCalculations && sampleCalculations.length > 0 && (
                        <div className="bg-white rounded-lg shadow">
                            <div className="px-6 py-4 border-b bg-gray-50">
                                <h3 className="text-lg font-medium text-gray-900">Exemplos de Cálculo</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Preços calculados para produtos com BOM ativo
                                </p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Produto
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                                Custo Material
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                                Preço Atual
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                                Preço Calculado
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                                Diferença
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                                Margem
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {sampleCalculations.filter(calc => calc.success).map((calc) => (
                                            <tr key={calc.product_id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{calc.product_name}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                                                    {formatCurrency(calc.material_cost)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                                                    {formatCurrency(calc.current_price)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                                                    {formatCurrency(calc.calculated_price)}
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${
                                                    calc.price_difference > 0 ? 'text-green-600' :
                                                    calc.price_difference < 0 ? 'text-red-600' : 'text-gray-500'
                                                }`}>
                                                    {calc.price_difference > 0 ? '+' : ''}{formatCurrency(calc.price_difference)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        calc.margin_percent >= 40 ? 'bg-green-100 text-green-800' :
                                                        calc.margin_percent >= 20 ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                        {calc.margin_percent}%
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Linked Products */}
                    {formula.products && formula.products.length > 0 && (
                        <div className="bg-white rounded-lg shadow">
                            <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Produtos Vinculados</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {formula.products.length} produtos usando esta fórmula
                                    </p>
                                </div>
                                <button
                                    onClick={() => setApplyModalOpen(true)}
                                    className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                                >
                                    Aplicar Preços
                                </button>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                    {formula.products.map((product) => (
                                        <div key={product.id} className="p-3 bg-gray-50 rounded-lg">
                                            <div className="text-sm font-medium text-gray-900 truncate">{product.name}</div>
                                            {product.price && (
                                                <div className="text-xs text-gray-500">
                                                    {formatCurrency(product.price)}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Apply Prices Modal */}
            {applyModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-screen items-center justify-center p-4">
                        <div className="fixed inset-0 bg-black/50" onClick={() => setApplyModalOpen(false)} />
                        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Aplicar Preços Calculados</h3>
                            <p className="text-sm text-gray-500 mb-4">
                                Isto irá recalcular e salvar os preços calculados de todos os produtos vinculados a esta fórmula.
                            </p>
                            <div className="mb-6">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={updateManualPrice}
                                        onChange={(e) => setUpdateManualPrice(e.target.checked)}
                                        className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">
                                        Atualizar também o preço manual do produto
                                    </span>
                                </label>
                                <p className="text-xs text-gray-500 mt-1 ml-6">
                                    Se marcado, o preço de venda do produto será atualizado com o preço calculado
                                </p>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setApplyModalOpen(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleApplyToProducts}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    Aplicar Preços
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
