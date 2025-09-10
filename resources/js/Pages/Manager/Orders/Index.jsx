import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { formatBRL } from '@/utils/currency';
import toast from 'react-hot-toast';

export default function ManagerOrdersIndex({ auth, orders, filters, statusOptions }) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
    const [processing, setProcessing] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('manager.orders.index'), {
            search: search,
            status: selectedStatus
        }, {
            preserveState: true
        });
    };

    const handleStatusFilter = (status) => {
        setSelectedStatus(status);
        router.get(route('manager.orders.index'), {
            search: search,
            status: status
        }, {
            preserveState: true
        });
    };

    const handleSendToProduction = (orderId) => {
        if (!confirm('Tem certeza que deseja enviar este pedido para produção?')) {
            return;
        }

        setProcessing(true);
        router.post(route('manager.orders.send-to-production', orderId), {}, {
            onSuccess: () => {
                toast.success('Pedido enviado para produção!');
                setProcessing(false);
            },
            onError: (errors) => {
                toast.error(errors.error || 'Erro ao enviar pedido para produção');
                setProcessing(false);
            }
        });
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending_payment: 'bg-yellow-100 text-yellow-800',
            payment_approved: 'bg-green-100 text-green-800',
            in_production: 'bg-blue-100 text-blue-800',
            photo_sent: 'bg-purple-100 text-purple-800',
            photo_approved: 'bg-indigo-100 text-indigo-800',
            pending_final_payment: 'bg-orange-100 text-orange-800',
            ready_for_shipping: 'bg-teal-100 text-teal-800',
            shipped: 'bg-green-100 text-green-800'
        };

        return badges[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusIcon = (status) => {
        const icons = {
            pending_payment: '⏳',
            payment_approved: '✅',
            in_production: '🏭',
            photo_sent: '📸',
            photo_approved: '✨',
            pending_final_payment: '🟠',
            ready_for_shipping: '🚚',
            shipped: '🎉'
        };

        return icons[status] || '📋';
    };

    return (
        <>
            <Head title="Gerenciar Pedidos" />

            <AuthenticatedLayout
                user={auth.user}
                header={
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                                Gerenciar Pedidos
                            </h2>
                            <p className="text-gray-600 text-sm">Visualizar, imprimir e enviar pedidos para produção</p>
                        </div>
                        <Link
                            href={route('manager.dashboard')}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            ← Dashboard
                        </Link>
                    </div>
                }
            >
                <div className="py-8">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        {/* Payment Status Information */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6 border border-blue-200">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-blue-800">
                                        💰 Status de Pagamento - Guia Rápido
                                    </h3>
                                    <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-blue-700">
                                        <div className="flex items-center space-x-2">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                ✅ Totalmente Pago
                                            </span>
                                            <span>= 100% recebido</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                💰 % Processado
                                            </span>
                                            <span>= Parcialmente pago</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                🏦 Aprovado Financeiro
                                            </span>
                                            <span>= Pagamento confirmado pelo financeiro</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                            <div className="flex flex-col md:flex-row gap-4">
                                {/* Search */}
                                <form onSubmit={handleSearch} className="flex-1">
                                    <div className="flex">
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Buscar por cliente, criança ou token..."
                                            className="flex-1 rounded-l-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 transition-colors"
                                        >
                                            🔍
                                        </button>
                                    </div>
                                </form>

                                {/* Status Filter */}
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => handleStatusFilter(e.target.value)}
                                    className="rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    {Object.entries(statusOptions).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Orders List */}
                        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Pedidos ({orders.data.length} de {orders.total})
                                </h3>
                            </div>

                            {orders.data.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Pedido
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Cliente
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Valor / Status Pagamento
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Data
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Ações
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {orders.data.map((order) => (
                                                <tr key={order.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {order.unique_token}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {order.child_name}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{order.client_name}</div>
                                                        <div className="text-sm text-gray-500">{order.client_email}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(order.order_status)}`}>
                                                            {getStatusIcon(order.order_status)} {statusOptions[order.order_status]}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {formatBRL(parseFloat(order.total_amount) + parseFloat(order.shipping_amount || 0))}
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            {order.payment_status === 'fully_paid' ? (
                                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                    ✅ Totalmente Pago
                                                                </span>
                                                            ) : order.payment_status === 'partially_paid' ? (
                                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                    💰 {Math.round(order.payment_progress)}% Processado
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                                    ❌ Aguardando Pagamento
                                                                </span>
                                                            )}
                                                            
                                                            {/* Show finance approval status */}
                                                            {order.finance_admin_id && order.order_status !== 'pending_payment' && (
                                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                                    🏦 Aprovado Financeiro
                                                                </span>
                                                            )}
                                                        </div>
                                                        {order.payment_status === 'partially_paid' && (
                                                            <div className="text-xs text-gray-500 mt-1">
                                                                💳 Pago: {formatBRL(order.total_paid_amount)} | 
                                                                ⏰ Restante: {formatBRL(order.remaining_amount)}
                                                            </div>
                                                        )}
                                                        {order.payment_status === 'fully_paid' && order.finance_admin_id && (
                                                            <div className="text-xs text-green-600 mt-1 font-medium">
                                                                ✅ Pagamento totalmente processado
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(order.created_at).toLocaleDateString('pt-BR')}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex space-x-2">
                                                            {order.can_print ? (
                                                                <Link
                                                                    href={route('manager.orders.print', order.id)}
                                                                    className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs transition-colors"
                                                                    target="_blank"
                                                                >
                                                                    🖨️ Imprimir
                                                                </Link>
                                                            ) : (
                                                                <button
                                                                    className="bg-gray-400 text-gray-600 px-3 py-1 rounded text-xs cursor-not-allowed"
                                                                    disabled
                                                                    title={!order.is_fully_paid ? "Aguardando pagamento completo" : "Aguardando aprovação do admin"}
                                                                >
                                                                    🖨️ Imprimir
                                                                </button>
                                                            )}
                                                            
                                                            {order.order_status === 'payment_approved' && (
                                                                <button
                                                                    onClick={() => handleSendToProduction(order.id)}
                                                                    disabled={processing}
                                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition-colors disabled:opacity-50"
                                                                >
                                                                    🏭 Produção
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-gray-400 text-6xl mb-4">📋</div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum pedido encontrado</h3>
                                    <p className="text-gray-500">Tente ajustar os filtros de busca.</p>
                                </div>
                            )}

                            {/* Pagination */}
                            {orders.links && orders.links.length > 3 && (
                                <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                                    <div className="flex justify-between items-center">
                                        <div className="text-sm text-gray-700">
                                            Mostrando {orders.from || 0} a {orders.to || 0} de {orders.total} pedidos
                                        </div>
                                        <div className="flex space-x-1">
                                            {orders.links.map((link, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => link.url && router.get(link.url)}
                                                    disabled={!link.url}
                                                    className={`px-3 py-2 text-sm font-medium rounded ${
                                                        link.active
                                                            ? 'bg-indigo-600 text-white'
                                                            : link.url
                                                            ? 'bg-white text-gray-700 hover:bg-gray-50 border'
                                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    }`}
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
        </>
    );
}