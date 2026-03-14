import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ thread }) {
    const getTypeBadge = (type) => {
        if (type === 'standard') {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                    Standard (80%)
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                Specialty (20%)
            </span>
        );
    };

    const getStockStatusBadge = (status) => {
        const config = {
            'in_stock': { bg: 'bg-green-100', text: 'text-green-800', label: 'Em Estoque' },
            'low_stock': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Estoque Baixo' },
            'out_of_stock': { bg: 'bg-red-100', text: 'text-red-800', label: 'Sem Estoque' },
        };
        const { bg, text, label } = config[status] || config['in_stock'];
        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${bg} ${text}`}>
                {label}
            </span>
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        {thread.hex_code && (
                            <div
                                className="w-12 h-12 rounded-full border-4 border-white shadow-lg"
                                style={{ backgroundColor: thread.hex_code }}
                            />
                        )}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">{thread.name}</h2>
                            <p className="mt-1 text-sm text-gray-600">{thread.color_code} {thread.brand && `• ${thread.brand}`}</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href={`/admin/threads/${thread.id}/edit`}
                            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Editar
                        </Link>
                        <Link href="/admin/threads" className="text-gray-600 hover:text-gray-900">
                            Voltar
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={thread.name} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Status Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="text-sm text-gray-500">Status</div>
                            <div className="mt-1">{getStockStatusBadge(thread.stock_status)}</div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="text-sm text-gray-500">Tipo</div>
                            <div className="mt-1">{getTypeBadge(thread.type)}</div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="text-sm text-gray-500">Carretéis</div>
                            <div className="text-2xl font-bold text-gray-900">{thread.spool_count}</div>
                            <div className="text-xs text-gray-500">mín: {thread.minimum_spools}</div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="text-sm text-gray-500">Metros Disponíveis</div>
                            <div className="text-2xl font-bold text-gray-900">
                                {new Intl.NumberFormat('pt-BR').format(thread.meters_remaining)}m
                            </div>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b">
                            <h3 className="text-lg font-medium text-gray-900">Detalhes</h3>
                        </div>
                        <div className="p-6">
                            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Material</dt>
                                    <dd className="mt-1 text-sm text-gray-900 capitalize">{thread.material_type}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Metros por Carretel</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{new Intl.NumberFormat('pt-BR').format(thread.meters_per_spool)}m</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Preço por Carretel</dt>
                                    <dd className="mt-1 text-sm text-gray-900">R$ {Number(thread.purchase_price).toFixed(2).replace('.', ',')}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Valor em Estoque</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        R$ {(thread.spool_count * thread.purchase_price).toFixed(2).replace('.', ',')}
                                    </dd>
                                </div>
                                {thread.embroidery_color && (
                                    <div className="md:col-span-2">
                                        <dt className="text-sm font-medium text-gray-500">Cor de Bordado Vinculada</dt>
                                        <dd className="mt-1 flex items-center gap-2">
                                            {thread.embroidery_color.hex_code && (
                                                <div
                                                    className="w-6 h-6 rounded-full border"
                                                    style={{ backgroundColor: thread.embroidery_color.hex_code }}
                                                />
                                            )}
                                            <span className="text-sm text-gray-900">{thread.embroidery_color.name}</span>
                                        </dd>
                                    </div>
                                )}
                                {thread.notes && (
                                    <div className="md:col-span-2">
                                        <dt className="text-sm font-medium text-gray-500">Observações</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{thread.notes}</dd>
                                    </div>
                                )}
                            </dl>
                        </div>
                    </div>

                    {/* Substitutes (for specialty threads) */}
                    {thread.type === 'specialty' && thread.standard_substitutes?.length > 0 && (
                        <div className="bg-white rounded-lg shadow">
                            <div className="px-6 py-4 border-b">
                                <h3 className="text-lg font-medium text-gray-900">Substitutos Standard</h3>
                                <p className="text-sm text-gray-500 mt-1">Linhas que podem substituir esta specialty</p>
                            </div>
                            <div className="p-6">
                                <div className="space-y-2">
                                    {thread.standard_substitutes.map((sub, idx) => (
                                        <div key={sub.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-medium">
                                                    {idx + 1}
                                                </span>
                                                {sub.standard_thread?.hex_code && (
                                                    <div
                                                        className="w-6 h-6 rounded-full border"
                                                        style={{ backgroundColor: sub.standard_thread.hex_code }}
                                                    />
                                                )}
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{sub.standard_thread?.name}</div>
                                                    <div className="text-xs text-gray-500">{sub.standard_thread?.color_code}</div>
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {sub.standard_thread?.spool_count} carretéis
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Transaction History */}
                    {thread.transactions?.length > 0 && (
                        <div className="bg-white rounded-lg shadow">
                            <div className="px-6 py-4 border-b">
                                <h3 className="text-lg font-medium text-gray-900">Histórico de Movimentações</h3>
                                <p className="text-sm text-gray-500 mt-1">Últimas 20 transações</p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Carretéis</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Metros</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuário</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Referência</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {thread.transactions.map((tx) => (
                                            <tr key={tx.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(tx.created_at).toLocaleDateString('pt-BR', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                        tx.type === 'purchase' ? 'bg-green-100 text-green-800' :
                                                        tx.type === 'consumption' ? 'bg-red-100 text-red-800' :
                                                        tx.type === 'return' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {tx.type === 'purchase' ? 'Compra' :
                                                         tx.type === 'consumption' ? 'Consumo' :
                                                         tx.type === 'return' ? 'Devolução' : 'Ajuste'}
                                                    </span>
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-center text-sm font-medium ${
                                                    tx.spool_quantity > 0 ? 'text-green-600' :
                                                    tx.spool_quantity < 0 ? 'text-red-600' : 'text-gray-500'
                                                }`}>
                                                    {tx.spool_quantity > 0 ? '+' : ''}{tx.spool_quantity || '-'}
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-center text-sm ${
                                                    tx.meters_quantity > 0 ? 'text-green-600' :
                                                    tx.meters_quantity < 0 ? 'text-red-600' : 'text-gray-500'
                                                }`}>
                                                    {tx.meters_quantity ? (
                                                        <>{tx.meters_quantity > 0 ? '+' : ''}{new Intl.NumberFormat('pt-BR').format(tx.meters_quantity)}m</>
                                                    ) : '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {tx.user?.name || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {tx.reference || tx.notes || '-'}
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
