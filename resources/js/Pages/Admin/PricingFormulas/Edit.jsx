import { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Edit({ formula, categories, templates }) {
    const { data, setData, put, processing, errors } = useForm({
        name: formula.name || '',
        description: formula.description || '',
        product_category_id: formula.product_category_id || '',
        formula_config: formula.formula_config || {
            markup: 2.0,
            overhead: 0,
            embroidery_multiplier: 1.0,
            category_multipliers: {},
        },
        target_margin_percent: formula.target_margin_percent || '',
        minimum_price: formula.minimum_price || '',
        is_default: formula.is_default || false,
        is_active: formula.is_active !== false,
        priority: formula.priority || 0,
    });

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/admin/pricing-formulas/${formula.id}`);
    };

    const handleDelete = () => {
        router.delete(`/admin/pricing-formulas/${formula.id}`);
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value || 0);
    };

    const previewPrice = (cost = 100) => {
        let price = cost;

        if (data.formula_config.markup) {
            price = cost * data.formula_config.markup;
        }

        if (data.formula_config.overhead) {
            price += parseFloat(data.formula_config.overhead) || 0;
        }

        if (data.target_margin_percent) {
            const margin = parseFloat(data.target_margin_percent);
            if (margin < 100) {
                price = cost / (1 - margin / 100);
            }
        }

        if (data.minimum_price && price < parseFloat(data.minimum_price)) {
            price = parseFloat(data.minimum_price);
        }

        return price;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Editar Fórmula</h2>
                        <p className="mt-1 text-sm text-gray-600">{formula.name}</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="text-red-600 hover:text-red-900"
                        >
                            Excluir
                        </button>
                        <Link href="/admin/pricing-formulas" className="text-gray-600 hover:text-gray-900">
                            Voltar
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Editar: ${formula.name}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Info */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-6 py-4 border-b bg-gray-50">
                                <h3 className="text-lg font-medium text-gray-900">Informações Básicas</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Nome *</label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                                        />
                                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Categoria (opcional)</label>
                                        <select
                                            value={data.product_category_id}
                                            onChange={(e) => setData('product_category_id', e.target.value)}
                                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                                        >
                                            <option value="">Todas as categorias</option>
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Descrição</label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={2}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Formula Configuration */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-6 py-4 border-b bg-gray-50">
                                <h3 className="text-lg font-medium text-gray-900">Configuração da Fórmula</h3>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Multiplicador (Markup)</label>
                                        <div className="mt-1 relative">
                                            <input
                                                type="number"
                                                step="0.1"
                                                min="1"
                                                value={data.formula_config.markup}
                                                onChange={(e) => setData('formula_config', {
                                                    ...data.formula_config,
                                                    markup: parseFloat(e.target.value) || 1
                                                })}
                                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 pr-8"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">x</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Overhead Fixo (R$)</label>
                                        <div className="mt-1 relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={data.formula_config.overhead}
                                                onChange={(e) => setData('formula_config', {
                                                    ...data.formula_config,
                                                    overhead: parseFloat(e.target.value) || 0
                                                })}
                                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 pl-10"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Multiplicador Bordado</label>
                                        <div className="mt-1 relative">
                                            <input
                                                type="number"
                                                step="0.1"
                                                min="1"
                                                value={data.formula_config.embroidery_multiplier}
                                                onChange={(e) => setData('formula_config', {
                                                    ...data.formula_config,
                                                    embroidery_multiplier: parseFloat(e.target.value) || 1
                                                })}
                                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 pr-8"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">x</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Margem Alvo (%)</label>
                                        <div className="mt-1 relative">
                                            <input
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                max="99"
                                                value={data.target_margin_percent}
                                                onChange={(e) => setData('target_margin_percent', e.target.value)}
                                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 pr-8"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Preço Mínimo (R$)</label>
                                        <div className="mt-1 relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={data.minimum_price}
                                                onChange={(e) => setData('minimum_price', e.target.value)}
                                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 pl-10"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <h4 className="text-sm font-medium text-blue-900 mb-4">Preview do Cálculo</h4>
                            <div className="grid grid-cols-3 gap-6 text-center">
                                <div>
                                    <div className="text-xs text-blue-600 uppercase">Custo</div>
                                    <div className="text-lg font-bold text-blue-900">R$ 100,00</div>
                                </div>
                                <div>
                                    <div className="text-xs text-blue-600 uppercase">Preço Calculado</div>
                                    <div className="text-lg font-bold text-blue-900">{formatCurrency(previewPrice(100))}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-blue-600 uppercase">Margem</div>
                                    <div className="text-lg font-bold text-blue-900">
                                        {previewPrice(100) > 0 ? ((1 - 100 / previewPrice(100)) * 100).toFixed(1) : 0}%
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Settings */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-6 py-4 border-b bg-gray-50">
                                <h3 className="text-lg font-medium text-gray-900">Configurações</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Prioridade</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={data.priority}
                                            onChange={(e) => setData('priority', parseInt(e.target.value) || 0)}
                                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                                        />
                                    </div>
                                    <div className="flex items-center pt-6">
                                        <input
                                            type="checkbox"
                                            id="is_active"
                                            checked={data.is_active}
                                            onChange={(e) => setData('is_active', e.target.checked)}
                                            className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                                            Fórmula ativa
                                        </label>
                                    </div>
                                    <div className="flex items-center pt-6">
                                        <input
                                            type="checkbox"
                                            id="is_default"
                                            checked={data.is_default}
                                            onChange={(e) => setData('is_default', e.target.checked)}
                                            className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="is_default" className="ml-2 block text-sm text-gray-900">
                                            Fórmula padrão
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex justify-end gap-3">
                            <Link
                                href="/admin/pricing-formulas"
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancelar
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50"
                            >
                                {processing ? 'Salvando...' : 'Salvar Alterações'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-screen items-center justify-center p-4">
                        <div className="fixed inset-0 bg-black/50" onClick={() => setShowDeleteModal(false)} />
                        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirmar Exclusão</h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Tem certeza que deseja excluir a fórmula "{formula.name}"?
                                Os produtos vinculados a esta fórmula terão a fórmula removida.
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                >
                                    Excluir
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
