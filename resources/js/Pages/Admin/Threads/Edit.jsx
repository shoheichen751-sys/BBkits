import { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Edit({ thread, embroideryColors, standardThreads, materialTypes }) {
    const [showStockAdjust, setShowStockAdjust] = useState(false);
    const [adjustType, setAdjustType] = useState('add_spools');
    const [adjustData, setAdjustData] = useState({
        spool_quantity: 0,
        meters_quantity: 0,
        unit_price: thread.purchase_price,
        notes: '',
    });

    const { data, setData, put, processing, errors } = useForm({
        name: thread.name || '',
        brand: thread.brand || '',
        color_code: thread.color_code || '',
        hex_code: thread.hex_code || '#000000',
        embroidery_color_id: thread.embroidery_color_id || '',
        type: thread.type || 'standard',
        material_type: thread.material_type || 'polyester',
        meters_per_spool: thread.meters_per_spool || 1000,
        minimum_spools: thread.minimum_spools || 2,
        purchase_price: thread.purchase_price || 0,
        notes: thread.notes || '',
        is_active: thread.is_active ?? true,
        substitute_ids: thread.standard_substitutes?.map(s => s.standard_thread_id) || [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/admin/threads/${thread.id}`);
    };

    const handleStockAdjust = (e) => {
        e.preventDefault();
        router.post(`/admin/threads/${thread.id}/adjust-stock`, {
            type: adjustType,
            ...adjustData,
        }, {
            onSuccess: () => {
                setShowStockAdjust(false);
                setAdjustData({ spool_quantity: 0, meters_quantity: 0, unit_price: thread.purchase_price, notes: '' });
            }
        });
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
                        <h2 className="text-xl font-semibold text-gray-900">Editar Linha</h2>
                        <p className="mt-1 text-sm text-gray-600">{thread.name}</p>
                    </div>
                    <Link href="/admin/threads" className="text-gray-600 hover:text-gray-900">
                        Voltar
                    </Link>
                </div>
            }
        >
            <Head title={`Editar ${thread.name}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Current Stock Info */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Estoque Atual</h3>
                            <button
                                onClick={() => setShowStockAdjust(!showStockAdjust)}
                                className="px-3 py-1 bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 text-sm"
                            >
                                {showStockAdjust ? 'Cancelar' : 'Ajustar Estoque'}
                            </button>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-gray-900">{thread.spool_count}</div>
                                <div className="text-sm text-gray-500">Carretéis</div>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-gray-900">
                                    {new Intl.NumberFormat('pt-BR').format(thread.meters_remaining)}m
                                </div>
                                <div className="text-sm text-gray-500">Metros</div>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-gray-900">{thread.minimum_spools}</div>
                                <div className="text-sm text-gray-500">Mínimo</div>
                            </div>
                            <div className={`text-center p-4 rounded-lg ${
                                thread.stock_status === 'in_stock' ? 'bg-green-50' :
                                thread.stock_status === 'low_stock' ? 'bg-yellow-50' : 'bg-red-50'
                            }`}>
                                <div className={`text-lg font-bold ${
                                    thread.stock_status === 'in_stock' ? 'text-green-700' :
                                    thread.stock_status === 'low_stock' ? 'text-yellow-700' : 'text-red-700'
                                }`}>
                                    {thread.stock_status === 'in_stock' ? 'OK' :
                                     thread.stock_status === 'low_stock' ? 'Baixo' : 'Zerado'}
                                </div>
                                <div className="text-sm text-gray-500">Status</div>
                            </div>
                        </div>

                        {/* Stock Adjustment Form */}
                        {showStockAdjust && (
                            <form onSubmit={handleStockAdjust} className="mt-6 p-4 border border-pink-200 rounded-lg bg-pink-50">
                                <h4 className="font-medium text-gray-900 mb-4">Ajustar Estoque</h4>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Tipo de Ajuste</label>
                                        <select
                                            value={adjustType}
                                            onChange={(e) => setAdjustType(e.target.value)}
                                            className="mt-1 block w-full rounded-lg border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                                        >
                                            <option value="add_spools">Adicionar Carretéis</option>
                                            <option value="consume_meters">Consumir Metros</option>
                                            <option value="adjustment">Ajuste Manual</option>
                                        </select>
                                    </div>
                                    {adjustType !== 'consume_meters' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Carretéis</label>
                                            <input
                                                type="number"
                                                value={adjustData.spool_quantity}
                                                onChange={(e) => setAdjustData({...adjustData, spool_quantity: parseInt(e.target.value) || 0})}
                                                className="mt-1 block w-full rounded-lg border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                                            />
                                        </div>
                                    )}
                                    {adjustType === 'consume_meters' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Metros</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={adjustData.meters_quantity}
                                                onChange={(e) => setAdjustData({...adjustData, meters_quantity: parseFloat(e.target.value) || 0})}
                                                className="mt-1 block w-full rounded-lg border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                                            />
                                        </div>
                                    )}
                                    {adjustType === 'add_spools' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Preço Unit.</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={adjustData.unit_price}
                                                onChange={(e) => setAdjustData({...adjustData, unit_price: parseFloat(e.target.value) || 0})}
                                                className="mt-1 block w-full rounded-lg border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Observação</label>
                                        <input
                                            type="text"
                                            value={adjustData.notes}
                                            onChange={(e) => setAdjustData({...adjustData, notes: e.target.value})}
                                            className="mt-1 block w-full rounded-lg border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                                            placeholder="Motivo do ajuste"
                                        />
                                    </div>
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                                    >
                                        Aplicar Ajuste
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Edit Form */}
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
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Código da Cor *</label>
                                        <input
                                            type="text"
                                            value={data.color_code}
                                            onChange={(e) => setData('color_code', e.target.value)}
                                            className="mt-1 block w-full rounded-lg border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                                        />
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
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Classification */}
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
                                        <label className="block text-sm font-medium text-gray-700">Cor de Bordado</label>
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

                            {/* Stock Settings */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Configurações de Estoque</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Metros por Carretel</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={data.meters_per_spool}
                                            onChange={(e) => setData('meters_per_spool', parseFloat(e.target.value) || 0)}
                                            className="mt-1 block w-full rounded-lg border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Mínimo de Carretéis</label>
                                        <input
                                            type="number"
                                            value={data.minimum_spools}
                                            onChange={(e) => setData('minimum_spools', parseInt(e.target.value) || 0)}
                                            className="mt-1 block w-full rounded-lg border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Preço por Carretel</label>
                                        <div className="mt-1 relative">
                                            <span className="absolute left-3 top-2 text-gray-500">R$</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={data.purchase_price}
                                                onChange={(e) => setData('purchase_price', parseFloat(e.target.value) || 0)}
                                                className="block w-full pl-10 rounded-lg border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Substitutes */}
                            {data.type === 'specialty' && standardThreads.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Substitutos Standard</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                        {standardThreads.map((st) => (
                                            <label
                                                key={st.id}
                                                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                                                    data.substitute_ids.includes(st.id)
                                                        ? 'border-pink-500 bg-pink-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={data.substitute_ids.includes(st.id)}
                                                    onChange={() => toggleSubstitute(st.id)}
                                                    className="sr-only"
                                                />
                                                {st.hex_code && (
                                                    <div
                                                        className="w-6 h-6 rounded-full mr-2 border"
                                                        style={{ backgroundColor: st.hex_code }}
                                                    />
                                                )}
                                                <span className="text-sm">{st.name}</span>
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
                                {processing ? 'Salvando...' : 'Salvar Alterações'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
