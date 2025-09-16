import { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import toast from 'react-hot-toast';

export default function Show({ material, transactions }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [showAdjustmentForm, setShowAdjustmentForm] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        quantity: '',
        type: 'adjustment',
        reference: '',
        notes: '',
        unit_cost: '',
    });

    const handleStockAdjustment = (e) => {
        e.preventDefault();

        post(`/admin/materials/${material.id}/adjust-stock`, {
            onSuccess: () => {
                toast.success('Estoque ajustado com sucesso!');
                reset();
                setShowAdjustmentForm(false);
            },
            onError: (errors) => {
                Object.keys(errors).forEach(key => {
                    toast.error(errors[key]);
                });
            }
        });
    };

    // Permission helpers
    const canEditMaterials = () => {
        return ['admin', 'manager', 'production_admin'].includes(user.role);
    };

    const canAdjustStock = () => {
        return ['admin', 'manager', 'production_admin'].includes(user.role);
    };

    const canCreateTransactions = () => {
        return ['admin', 'manager', 'production_admin'].includes(user.role);
    };
    const formatPrice = (price) => {
        return 'R$ ' + Number(price).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    };

    const formatStock = (stock, unit) => {
        return Number(stock).toLocaleString('pt-BR', { minimumFractionDigits: 3 }) + ' ' + unit;
    };

    const getStockStatus = () => {
        if (material.current_stock <= 0) {
            return { text: 'Sem Estoque', color: 'bg-red-100 text-red-800' };
        } else if (material.is_low_stock) {
            return { text: 'Estoque Baixo', color: 'bg-yellow-100 text-yellow-800' };
        }
        return { text: 'Normal', color: 'bg-green-100 text-green-800' };
    };

    const stockStatus = getStockStatus();

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">{material.name}</h2>
                        <p className="mt-1 text-sm text-gray-600">Ref: {material.reference}</p>
                    </div>
                    <div className="flex space-x-3">
                        {canAdjustStock() && (
                            <button
                                onClick={() => setShowAdjustmentForm(!showAdjustmentForm)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                Ajustar Estoque
                            </button>
                        )}
                        {canCreateTransactions() && (
                            <Link
                                href={`/admin/inventory/create?material_id=${material.id}`}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                Nova Transação
                            </Link>
                        )}
                        {canEditMaterials() && (
                            <Link
                                href={`/admin/materials/${material.id}/edit`}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                Editar Material
                            </Link>
                        )}
                        <Link
                            href="/admin/materials"
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Voltar
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Material - ${material.name}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Informações do Material</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">Detalhes completos sobre o material.</p>
                        </div>

                        <div className="border-t border-gray-200">
                            <dl>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Referência</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-mono">
                                        {material.reference}
                                    </dd>
                                </div>

                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Nome</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {material.name}
                                    </dd>
                                </div>

                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Unidade de Medida</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {material.unit}
                                    </dd>
                                </div>

                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Preço de Compra</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-semibold">
                                        {formatPrice(material.purchase_price)}
                                    </dd>
                                </div>

                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Estoque Atual</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        <div className="flex items-center space-x-3">
                                            <span className="font-semibold">{formatStock(material.current_stock, material.unit)}</span>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockStatus.color}`}>
                                                {stockStatus.text}
                                            </span>
                                        </div>
                                    </dd>
                                </div>

                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Estoque Mínimo</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {formatStock(material.minimum_stock, material.unit)}
                                    </dd>
                                </div>

                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Fornecedor Principal</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {material.supplier ? (
                                            <Link
                                                href={`/admin/suppliers/${material.supplier.id}`}
                                                className="text-purple-600 hover:text-purple-900"
                                            >
                                                {material.supplier.name}
                                            </Link>
                                        ) : (
                                            <span className="text-gray-500">Não definido</span>
                                        )}
                                    </dd>
                                </div>

                                {material.secondary_supplier && (
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Fornecedor Secundário</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            <Link
                                                href={`/admin/suppliers/${material.secondary_supplier.id}`}
                                                className="text-purple-600 hover:text-purple-900"
                                            >
                                                {material.secondary_supplier.name}
                                            </Link>
                                        </dd>
                                    </div>
                                )}

                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Prazo de Entrega</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {material.lead_time_days} dias
                                    </dd>
                                </div>

                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Múltiplo de Compra</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {material.purchase_multiple}
                                    </dd>
                                </div>

                                {material.weight_per_unit && (
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Peso/Volume por Unidade</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {material.weight_per_unit}
                                        </dd>
                                    </div>
                                )}

                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            material.is_active
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {material.is_active ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </dd>
                                </div>

                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Criado em</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {new Date(material.created_at).toLocaleDateString('pt-BR')}
                                    </dd>
                                </div>

                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Última atualização</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {new Date(material.updated_at).toLocaleDateString('pt-BR')}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    {/* Quick Stock Adjustment Form */}
                    {showAdjustmentForm && (
                        <div className="mt-6 bg-white shadow rounded-lg">
                            <div className="px-4 py-5 sm:px-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">Ajuste Rápido de Estoque</h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">Faça um ajuste rápido no estoque atual do material.</p>
                            </div>

                            <form onSubmit={handleStockAdjustment} className="border-t border-gray-200 p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Transação</label>
                                        <select
                                            value={data.type}
                                            onChange={e => setData('type', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            required
                                        >
                                            <option value="purchase">Compra</option>
                                            <option value="consumption">Consumo</option>
                                            <option value="adjustment">Ajuste Manual</option>
                                            <option value="return">Devolução</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Quantidade</label>
                                        <input
                                            type="number"
                                            step="0.001"
                                            value={data.quantity}
                                            onChange={e => setData('quantity', e.target.value)}
                                            className={`w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500 ${errors.quantity ? 'border-red-500' : ''}`}
                                            placeholder="0.000"
                                            required
                                        />
                                        {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Referência</label>
                                        <input
                                            type="text"
                                            value={data.reference}
                                            onChange={e => setData('reference', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            placeholder="Ex: NF 12345, Ajuste Inventário"
                                        />
                                    </div>

                                    {data.type === 'purchase' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Custo Unitário (R$)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={data.unit_cost}
                                                onChange={e => setData('unit_cost', e.target.value)}
                                                className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
                                    <textarea
                                        value={data.notes}
                                        onChange={e => setData('notes', e.target.value)}
                                        rows={3}
                                        className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                        placeholder="Detalhes sobre o ajuste..."
                                    />
                                </div>

                                <div className="flex justify-end space-x-4 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowAdjustmentForm(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                                    >
                                        {processing ? 'Salvando...' : 'Ajustar Estoque'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Transaction History */}
                    {transactions && transactions.data.length > 0 && (
                        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
                            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Histórico de Transações</h3>
                                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                        Últimas movimentações de estoque deste material.
                                    </p>
                                </div>
                                <Link
                                    href={`/admin/inventory?material_id=${material.id}`}
                                    className="text-purple-600 hover:text-purple-900 text-sm font-medium"
                                >
                                    Ver Todas →
                                </Link>
                            </div>

                            <div className="border-t border-gray-200">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Data/Hora
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Tipo
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Quantidade
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Usuário
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Referência
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Ações
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {transactions.data.map((transaction) => (
                                            <tr key={transaction.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Date(transaction.created_at).toLocaleString('pt-BR')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        transaction.type === 'purchase' ? 'bg-green-100 text-green-800' :
                                                        transaction.type === 'consumption' ? 'bg-red-100 text-red-800' :
                                                        transaction.type === 'adjustment' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {transaction.type_display}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`text-sm font-medium ${transaction.quantity >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                        {(transaction.quantity >= 0 ? '+' : '') + Number(transaction.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 3 })} {material.unit}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {transaction.user?.name || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {transaction.reference || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <Link
                                                        href={`/admin/inventory/${transaction.id}`}
                                                        className="text-purple-600 hover:text-purple-900"
                                                    >
                                                        Ver
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}