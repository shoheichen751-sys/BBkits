import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import toast from 'react-hot-toast';

export default function OrdersIndex({ orders, statusFilter }) {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [paymentPreview, setPaymentPreview] = useState(null);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        order_id: null,
        action: 'approve', // 'approve', 'reject'
        rejection_reason: '',
        move_to_production: false
    });

    const handleOrderClick = (order) => {
        setSelectedOrder(order);
        setData({
            order_id: order.id,
            action: 'approve',
            rejection_reason: '',
            move_to_production: false
        });
        setShowModal(true);
        
        // Load payment proof preview
        if (order.initial_payment_proof_data) {
            setPaymentPreview(order.initial_payment_proof_data);
        } else if (order.receipt_data) {
            setPaymentPreview(order.receipt_data);
        }
    };

    const handleApprove = () => {
        post(`/finance/orders/${selectedOrder.id}/approve`, {
            onSuccess: () => {
                toast.success('Pedido aprovado com sucesso!');
                setShowModal(false);
                reset();
            }
        });
    };

    const handleReject = () => {
        if (!data.rejection_reason) {
            toast.error('Por favor, informe o motivo da rejeição');
            return;
        }
        
        setData('action', 'reject');
        post(`/finance/orders/${selectedOrder.id}/reject`, {
            onSuccess: () => {
                toast.success('Pedido rejeitado');
                setShowModal(false);
                reset();
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
        
        const labels = {
            pending_payment: '⏳ Aguardando Pagamento',
            payment_approved: '✅ Pagamento Aprovado',
            in_production: '🏭 Em Produção',
            photo_sent: '📸 Foto Enviada',
            photo_approved: '✨ Foto Aprovada',
            pending_final_payment: '🟠 Pagamento Final Pendente',
            ready_for_shipping: '🔗 Pronto para Envio',
            shipped: '🎉 Enviado'
        };

        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${badges[status]}`}>
                {labels[status]}
            </span>
        );
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(amount);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('pt-BR');
    };

    const pendingPaymentOrders = orders.filter(order => order.order_status === 'pending_payment');
    const pendingFinalPaymentOrders = orders.filter(order => order.order_status === 'pending_final_payment' && order.final_payment_proof_data);

    return (
        <>
            <Head title="Gestão Financeira - Pedidos" />

            <AuthenticatedLayout
                header={
                    <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold">
                            💰 Gestão Financeira
                        </h2>
                        <p className="text-green-100 mt-1">
                            Aprove pagamentos e gerencie o fluxo de pedidos
                        </p>
                    </div>
                }
            >
                <div className="py-12 bg-gray-50 min-h-screen">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {/* Page Instructions */}
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-6 border border-green-200">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-green-800">
                                        💰 Página de Aprovações de Pagamento
                                    </h3>
                                    <p className="mt-1 text-sm text-green-700">
                                        <strong>Como usar:</strong> Clique em qualquer pedido abaixo para abrir o modal de aprovação onde você pode aprovar ou rejeitar o pagamento.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Filter Tabs */}
                        <div className="bg-white rounded-lg shadow-md mb-6">
                            <div className="px-4 py-2 bg-gray-50 rounded-t-lg border-b">
                                <p className="text-xs text-gray-600">
                                    📋 Filtros: Selecione uma categoria para ver apenas pedidos específicos
                                </p>
                            </div>
                            <div className="border-b border-gray-200">
                                <nav className="-mb-px flex space-x-8 px-6">
                                    <Link
                                        href="/finance/orders"
                                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                            !statusFilter || statusFilter === 'all' 
                                                ? 'border-green-500 text-green-600' 
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        📋 Todos ({orders.length})
                                    </Link>
                                    <Link
                                        href="/finance/orders?status=pending_payment"
                                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                            statusFilter === 'pending_payment'
                                                ? 'border-yellow-500 text-yellow-600' 
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        ⏳ Pagamento Inicial ({pendingPaymentOrders.length})
                                    </Link>
                                    <Link
                                        href="/finance/orders?status=pending_final_payment"
                                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                            statusFilter === 'pending_final_payment'
                                                ? 'border-orange-500 text-orange-600' 
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        🟠 Pagamento Final ({pendingFinalPaymentOrders.length})
                                    </Link>
                                </nav>
                            </div>
                        </div>

                        {/* Orders Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {orders.map((order) => (
                                <div 
                                    key={order.id} 
                                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                                    onClick={() => handleOrderClick(order)}
                                >
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {order.client_name}
                                            </h3>
                                            {getStatusBadge(order.order_status)}
                                        </div>
                                        
                                        <div className="space-y-2 mb-4">
                                            <p className="text-sm text-gray-600">
                                                <strong>Criança:</strong> {order.child_name}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <strong>Vendedora:</strong> {order.user.name}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <strong>Data:</strong> {formatDate(order.created_at)}
                                            </p>
                                        </div>

                                        <div className="border-t pt-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm text-gray-600">Valor Total:</span>
                                                <span className="font-semibold text-gray-900">
                                                    {formatCurrency(order.total_amount)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm text-gray-600">Pago:</span>
                                                <span className="font-semibold text-green-600">
                                                    {formatCurrency(order.received_amount)}
                                                </span>
                                            </div>
                                            {(order.total_amount - order.received_amount) > 0 && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-600">Restante:</span>
                                                    <span className="font-semibold text-orange-600">
                                                        {formatCurrency(order.total_amount - order.received_amount)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {(order.order_status === 'pending_payment' || order.order_status === 'pending_final_payment') && (
                                            <div className="mt-4 text-center">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    💡 Clique para Aprovar/Rejeitar
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {orders.length === 0 && (
                            <div className="bg-white rounded-lg shadow-md p-12 text-center">
                                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                                    <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Nenhum pedido encontrado
                                </h3>
                                <p className="text-gray-500">
                                    Não há pedidos aguardando aprovação financeira no momento.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Order Details Modal */}
                {showModal && selectedOrder && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-start justify-center pt-8 pb-8 px-4 overflow-y-auto">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[calc(100vh-4rem)] flex flex-col transform transition-all animate-in slide-in-from-top-4 duration-300">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-green-50 to-blue-50 rounded-t-xl">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            💰 Aprovar Pagamento
                                        </h2>
                                        <p className="text-sm text-gray-600">
                                            Cliente: {selectedOrder.client_name} • Pedido #{selectedOrder.id}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 hover:bg-white hover:bg-opacity-80 rounded-lg transition-colors"
                                    title="Fechar modal"
                                >
                                    <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-auto p-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Order Details */}
                                    <div className="bg-white border border-gray-200 rounded-lg p-5">
                                        <div className="flex items-center mb-4">
                                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900">📋 Detalhes do Pedido</h3>
                                        </div>
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                                <span className="text-sm font-medium text-gray-600">👤 Cliente:</span>
                                                <span className="text-sm font-semibold text-gray-900">{selectedOrder.client_name}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                                <span className="text-sm font-medium text-gray-600">📧 E-mail:</span>
                                                <span className="text-sm text-gray-900">{selectedOrder.client_email || '—'}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                                <span className="text-sm font-medium text-gray-600">📱 Telefone:</span>
                                                <span className="text-sm text-gray-900">{selectedOrder.client_phone || '—'}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                                <span className="text-sm font-medium text-gray-600">👶 Criança:</span>
                                                <span className="text-sm font-semibold text-purple-700">{selectedOrder.child_name}</span>
                                            </div>
                                            <div className="py-2 border-b border-gray-100">
                                                <span className="text-sm font-medium text-gray-600 block mb-1">🎨 Bordado:</span>
                                                <div className="text-sm text-gray-900 space-y-1">
                                                    <div><span className="font-medium">Cor:</span> {selectedOrder.embroidery_color || '—'}</div>
                                                    <div><span className="font-medium">Fonte:</span> {selectedOrder.embroidery_font || '—'}</div>
                                                    <div><span className="font-medium">Posição:</span> {selectedOrder.embroidery_position || '—'}</div>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                                <span className="text-sm font-medium text-gray-600">🏷️ Vendedora:</span>
                                                <span className="text-sm font-semibold text-blue-700">{selectedOrder.user.name}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2">
                                                <span className="text-sm font-medium text-gray-600">📅 Data:</span>
                                                <span className="text-sm text-gray-900">{formatDate(selectedOrder.created_at)}</span>
                                            </div>
                                        </div>
                                        {/* Financial Summary */}
                                        <div className="mt-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
                                            <div className="flex items-center mb-3">
                                                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
                                                    <span className="text-green-600 text-sm">💰</span>
                                                </div>
                                                <h4 className="font-semibold text-gray-900">Resumo Financeiro</h4>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center py-2 bg-white rounded px-3">
                                                    <span className="text-sm font-medium text-gray-700">💎 Valor do Produto:</span>
                                                    <span className="text-sm font-bold text-gray-900">{formatCurrency(selectedOrder.total_amount)}</span>
                                                </div>
                                                <div className="flex justify-between items-center py-2 bg-white rounded px-3">
                                                    <span className="text-sm font-medium text-gray-700">🚚 Frete:</span>
                                                    <span className="text-sm font-semibold text-blue-700">{formatCurrency(selectedOrder.shipping_amount)}</span>
                                                </div>
                                                <div className="flex justify-between items-center py-2 bg-white rounded px-3">
                                                    <span className="text-sm font-medium text-gray-700">✅ Valor Pago:</span>
                                                    <span className="text-sm font-bold text-green-600">{formatCurrency(selectedOrder.received_amount)}</span>
                                                </div>
                                                {(selectedOrder.total_amount - selectedOrder.received_amount) > 0 && (
                                                    <div className="flex justify-between items-center py-2 bg-orange-50 border border-orange-200 rounded px-3">
                                                        <span className="text-sm font-semibold text-orange-700">⏰ Restante:</span>
                                                        <span className="text-sm font-bold text-orange-600">
                                                            {formatCurrency(selectedOrder.total_amount - selectedOrder.received_amount)}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="border-t pt-3 mt-3">
                                                    <div className="flex justify-between items-center py-2 bg-indigo-50 border border-indigo-200 rounded px-3">
                                                        <span className="text-base font-bold text-indigo-800">🎯 TOTAL GERAL:</span>
                                                        <span className="text-base font-bold text-indigo-800">
                                                            {formatCurrency((selectedOrder.total_amount || 0) + (selectedOrder.shipping_amount || 0))}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Proof */}
                                    <div className="bg-white border border-gray-200 rounded-lg p-5">
                                        <div className="flex items-center mb-4">
                                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                                                <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {selectedOrder.order_status === 'pending_final_payment' 
                                                    ? '🧾 Comprovante Pagamento Final' 
                                                    : '🧾 Comprovante de Pagamento'
                                                }
                                            </h3>
                                        </div>

                                        {paymentPreview ? (
                                            <div className="relative border rounded-xl overflow-hidden shadow-md bg-gray-50">
                                                <div className="absolute top-2 right-2 z-10">
                                                    <button
                                                        onClick={() => window.open(paymentPreview, '_blank')}
                                                        className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-700 p-2 rounded-lg shadow-sm transition-all"
                                                        title="Abrir imagem em nova aba"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                        </svg>
                                                    </button>
                                                </div>
                                                <img 
                                                    src={paymentPreview} 
                                                    alt="Comprovante de pagamento" 
                                                    className="w-full h-auto max-h-96 object-contain cursor-pointer hover:opacity-90 transition-opacity"
                                                    onClick={() => window.open(paymentPreview, '_blank')}
                                                />
                                                <div className="bg-green-50 border-t border-green-200 p-3">
                                                    <div className="flex items-center">
                                                        <svg className="w-4 h-4 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span className="text-sm font-medium text-green-800">
                                                            ✅ Comprovante anexado - Clique para ampliar
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="border-2 border-dashed border-orange-300 rounded-xl p-8 text-center bg-orange-50">
                                                <svg className="mx-auto h-12 w-12 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <p className="mt-2 text-sm font-medium text-orange-600">⚠️ Nenhum comprovante anexado</p>
                                                <p className="text-xs text-orange-500 mt-1">Cliente deve enviar comprovante para aprovação</p>
                                            </div>
                                        )}

                                        <div className="mt-6">
                                            <div className="flex items-center mb-3">
                                                <svg className="w-4 h-4 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                                                </svg>
                                                <label className="block text-sm font-semibold text-gray-700">
                                                    💬 Motivo da rejeição (se aplicável)
                                                </label>
                                            </div>
                                            <textarea
                                                value={data.rejection_reason}
                                                onChange={e => setData('rejection_reason', e.target.value)}
                                                rows={4}
                                                className="w-full rounded-lg border-gray-300 focus:border-red-500 focus:ring-red-500 transition-colors"
                                                placeholder="Explique o motivo da rejeição caso vá rejeitar este pagamento... (obrigatório para rejeição)"
                                                maxLength={500}
                                            />
                                            <div className="flex justify-between items-center mt-2">
                                                <span className="text-xs text-gray-500">
                                                    {data.rejection_reason?.length || 0}/500 caracteres
                                                </span>
                                                <span className="text-xs text-red-600 font-medium">
                                                    ⚠️ Obrigatório para rejeitar
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-between items-center p-6 border-t bg-gradient-to-r from-gray-50 to-gray-100 rounded-b-xl">
                                <div className="text-sm text-gray-600">
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>💡 <strong>Dica:</strong> Verifique o comprovante antes de aprovar</span>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium shadow-sm"
                                    >
                                        ❌ Cancelar
                                    </button>
                                    <button
                                        onClick={handleReject}
                                        disabled={processing || !data.rejection_reason?.trim()}
                                        className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md flex items-center space-x-2"
                                        title={!data.rejection_reason?.trim() ? "Digite o motivo da rejeição" : "Rejeitar pagamento"}
                                    >
                                        {processing ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>Rejeitando...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>❌</span>
                                                <span>Rejeitar Pagamento</span>
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={handleApprove}
                                        disabled={processing}
                                        className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 font-semibold shadow-lg flex items-center space-x-2"
                                    >
                                        {processing ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>Processando...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>✅</span>
                                                <span>Aprovar Pagamento</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </AuthenticatedLayout>
        </>
    );
}