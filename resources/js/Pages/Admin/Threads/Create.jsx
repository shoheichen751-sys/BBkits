import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Create({ embroideryColors, standardThreads, materialTypes }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        brand: '',
        color_code: '',
        hex_code: '#000000',
        embroidery_color_id: '',
        type: 'standard',
        material_type: 'polyester',
        spool_count: 0,
        meters_per_spool: 1000,
        minimum_spools: 2,
        purchase_price: 0,
        notes: '',
        is_active: true,
        substitute_ids: [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/threads');
    };

    const toggleSubstitute = (threadId) => {
        const newSubs = data.substitute_ids.includes(threadId)
            ? data.substitute_ids.filter(id => id !== threadId)
            : [...data.substitute_ids, threadId];
        setData('substitute_ids', newSubs);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Nova Linha de Bordado</h2>
                        <p className="mt-1 text-sm text-gray-600">Adicione uma nova linha ao estoque</p>
                    </div>
                    <Link
                        href="/admin/threads"
                        className="text-gray-600 hover:text-gray-900"
                    >
                        Voltar
                    </Link>
                </div>
            }
        >
            <Head title="Nova Linha" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg">
                        <div className="p-6 space-y-6">
                            {/* Basic Info */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Básicas</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Nome *</label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="mt-1 block w-full rounded-lg border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                                            placeholder="Ex: Linha Branca Premium"
                                        />
                                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Marca</label>
                                        <input
                                            type="text"
                                            value={data.brand}
                                            onChange={(e) => setData('brand', e.target.value)}
                                            className="mt-1 block w-full rounded-lg border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                                            placeholder="Ex: Madeira, Gutermann"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Código da Cor *</label>
                                        <input
                                            type="text"
                                            value={data.color_code}
                                            onChange={(e) => setData('color_code', e.target.value)}
                                            className="mt-1 block w-full rounded-lg border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                                            placeholder="Ex: 1001, RA-WHITE"
                                        />
                                        {errors.color_code && <p className="mt-1 text-sm text-red-600">{errors.color_code}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Cor (Hex)</label>
                                        <div className="mt-1 flex gap-2">
                                            <input
                                                type="color"
                                                value={data.hex_code}
                                                onChange={(e) => setData('hex_code', e.target.value)}
                                                className="h-10 w-20 rounded border-gray-300"
                                            />
                                            <input
                                                type="text"
                                                value={data.hex_code}
                                                onChange={(e) => setData('hex_code', e.target.value)}
                                                className="flex-1 rounded-lg border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                                                placeholder="#FFFFFF"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Type & Material */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Classificação</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Tipo *</label>
                                        <select
                                            value={data.type}
                                            onChange={(e) => setData('type', e.target.value)}
                                            className="mt-1 block w-full rounded-lg border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                                        >
                                            <option value="standard">Standard (80%)</option>
                                            <option value="specialty">Specialty (20%)</option>
                                        </select>
                                        <p className="mt-1 text-xs text-gray-500">
                                            {data.type === 'standard'
                                                ? 'Cores comuns de alto uso'
                                                : 'Cores especiais de uso limitado'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Material *</label>
                                        <select
                                            value={data.material_type}
                                            onChange={(e) => setData('material_type', e.target.value)}
                                            className="mt-1 block w-full rounded-lg border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                                        >
                                            {materialTypes.map((mt) => (
                                                <option key={mt} value={mt}>{mt.charAt(0).toUpperCase() + mt.slice(1)}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Cor de Bordado Vinculada</label>
                                        <select
                                            value={data.embroidery_color_id}
                                            onChange={(e) => setData('embroidery_color_id', e.target.value)}
                                            className="mt-1 block w-full rounded-lg border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                                        >
                                            <option value="">Nenhuma</option>
                                            {embroideryColors.map((color) => (
                                                <option key={color.id} value={color.id}>{color.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Stock Info */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Estoque</h3>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Carretéis Iniciais *</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={data.spool_count}
                                            onChange={(e) => setData('spool_count', parseInt(e.target.value) || 0)}
                                            className="mt-1 block w-full rounded-lg border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Metros por Carretel *</label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={data.meters_per_spool}
                                            onChange={(e) => setData('meters_per_spool', parseFloat(e.target.value) || 0)}
                                            className="mt-1 block w-full rounded-lg border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Mínimo de Carretéis *</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={data.minimum_spools}
                                            onChange={(e) => setData('minimum_spools', parseInt(e.target.value) || 0)}
                                            className="mt-1 block w-full rounded-lg border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Preço por Carretel *</label>
                                        <div className="mt-1 relative">
                                            <span className="absolute left-3 top-2 text-gray-500">R$</span>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={data.purchase_price}
                                                onChange={(e) => setData('purchase_price', parseFloat(e.target.value) || 0)}
                                                className="block w-full pl-10 rounded-lg border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">
                                        <strong>Metros totais iniciais:</strong>{' '}
                                        {new Intl.NumberFormat('pt-BR').format(data.spool_count * data.meters_per_spool)}m
                                    </p>
                                </div>
                            </div>

                            {/* Substitutes (only for specialty) */}
                            {data.type === 'specialty' && standardThreads.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Substitutos Standard</h3>
                                    <p className="text-sm text-gray-500 mb-4">
                                        Selecione linhas standard que podem substituir esta linha specialty quando o estoque estiver baixo.
                                    </p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                        {standardThreads.map((thread) => (
                                            <label
                                                key={thread.id}
                                                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                                                    data.substitute_ids.includes(thread.id)
                                                        ? 'border-pink-500 bg-pink-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={data.substitute_ids.includes(thread.id)}
                                                    onChange={() => toggleSubstitute(thread.id)}
                                                    className="sr-only"
                                                />
                                                {thread.hex_code && (
                                                    <div
                                                        className="w-6 h-6 rounded-full mr-2 border"
                                                        style={{ backgroundColor: thread.hex_code }}
                                                    />
                                                )}
                                                <span className="text-sm">{thread.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Observações</label>
                                <textarea
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    rows={3}
                                    className="mt-1 block w-full rounded-lg border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                                    placeholder="Informações adicionais sobre esta linha..."
                                />
                            </div>

                            {/* Active */}
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                                />
                                <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                                    Linha ativa
                                </label>
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3 rounded-b-lg">
                            <Link
                                href="/admin/threads"
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancelar
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50"
                            >
                                {processing ? 'Salvando...' : 'Criar Linha'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
