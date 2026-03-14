import { useState, useEffect } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Create({ categories, templates }) {
    const { url } = usePage();
    const searchParams = new URLSearchParams(url.split('?')[1] || '');
    const templateKey = searchParams.get('template');

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        product_category_id: '',
        formula_config: {
            markup: 2.0,
            overhead: 0,
            embroidery_multiplier: 1.0,
            category_multipliers: {},
        },
        target_margin_percent: '',
        minimum_price: '',
        is_default: false,
        is_active: true,
        priority: 0,
    });

    useEffect(() => {
        if (templateKey && templates[templateKey]) {
            const template = templates[templateKey];
            setData(prev => ({
                ...prev,
                name: template.name,
                description: template.description,
                formula_config: { ...prev.formula_config, ...template.config },
                target_margin_percent: template.config.target_margin || '',
            }));
        }
    }, [templateKey]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/pricing-formulas');
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value || 0);
    };

    // Preview calculation
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
                        <h2 className="text-xl font-semibold text-gray-900">Nova Fórmula de Precificação</h2>
                        <p className="mt-1 text-sm text-gray-600">Configure como os preços serão calculados</p>
                    </div>
                    <Link href="/admin/pricing-formulas" className="text-gray-600 hover:text-gray-900">
                        Voltar
                    </Link>
                </div>
            }
        >
            <Head title="Nova Fórmula" />

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
                                            placeholder="Ex: Markup Padrão 2.5x"
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
                                        placeholder="Descreva quando usar esta fórmula..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Formula Configuration */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-6 py-4 border-b bg-gray-50">
                                <h3 className="text-lg font-medium text-gray-900">Configuração da Fórmula</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Defina os parâmetros de cálculo de preço
                                </p>
                            </div>
                            <div className="p-6 space-y-6">
                                {/* Markup */}
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
                                        <p className="text-xs text-gray-500 mt-1">Custo x Multiplicador</p>
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
                                        <p className="text-xs text-gray-500 mt-1">Valor adicionado ao preço</p>
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
                                        <p className="text-xs text-gray-500 mt-1">Para produtos com bordado</p>
                                    </div>
                                </div>

                                {/* Margin and Minimum */}
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
                                                placeholder="Ex: 40"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">Se definido, calcula preço para atingir esta margem</p>
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
                                                placeholder="Ex: 50.00"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">O preço nunca será inferior a este valor</p>
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
                                        <p className="text-xs text-gray-500 mt-1">Maior prioridade prevalece</p>
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
                                {processing ? 'Salvando...' : 'Criar Fórmula'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
