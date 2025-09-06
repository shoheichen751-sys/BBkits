import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { formatBRL } from '@/utils/currency';
import toast from 'react-hot-toast';

export default function OrdersIndex({ orders, statusFilter }) {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('view'); // 'view', 'photo', 'shipping'
    const [photoPreview, setPhotoPreview] = useState(null);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        product_photo: null,
        notes: '',
        tracking_code: '',
        invoice_number: ''
    });

    const handleOrderClick = (order) => {
        setSelectedOrder(order);
        setModalType('view');
        setShowModal(true);
        reset();
    };

    const handleStartProduction = (order) => {
        post(route('production.orders.start', order.id), {
            onSuccess: () => {
                toast.success('Produção iniciada com sucesso!');
                setShowModal(false);
                // Reload the page to show updated data
                window.location.reload();
            },
            onError: (errors) => {
                console.error('Error starting production:', errors);
                if (errors.error) {
                    toast.error(errors.error);
                } else if (errors.validation) {
                    toast.error('Erro de validação: ' + errors.validation.join(', '));
                } else {
                    toast.error('Erro ao iniciar produção. Tente novamente.');
                }
            },
            onStart: () => {
                toast.loading('Iniciando produção...');
            },
            onFinish: () => {
                toast.dismiss();
            }
        });
    };

    const handlePhotoUpload = () => {
        if (!data.product_photo) {
            toast.error('Por favor, selecione uma foto do produto');
            return;
        }
        
        post(route('production.orders.upload-photo', selectedOrder.id), {
            onSuccess: () => {
                toast.success('Foto enviada para aprovação!');
                setShowModal(false);
            }
        });
    };

    const handleGenerateShipping = () => {
        post(route('production.orders.generate-shipping', selectedOrder.id), {
            onSuccess: () => {
                toast.success('Etiqueta de envio gerada!');
                setShowModal(false);
            }
        });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('product_photo', file);
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            payment_approved: 'bg-green-100 text-green-800',
            in_production: 'bg-blue-100 text-blue-800',
            photo_sent: 'bg-purple-100 text-purple-800',
            ready_for_shipping: 'bg-teal-100 text-teal-800',
            shipped: 'bg-gray-100 text-gray-800'
        };
        
        const labels = {
            payment_approved: '✅ Pronto para Produção',
            in_production: '🏭 Em Produção',
            photo_sent: '📸 Foto Enviada',
            ready_for_shipping: '📦 Pronto para Envio',
            shipped: '🚚 Enviado'
        };

        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${badges[status]}`}>
                {labels[status]}
            </span>
        );
    };

    const getActionButton = (order) => {
        switch (order.order_status) {
            case 'payment_approved':
                return (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleStartProduction(order);
                        }}
                        disabled={processing}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processing ? 'Processando...' : 'Iniciar Produção'}
                    </button>
                );
            case 'in_production':
                return (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(order);
                            setModalType('photo');
                            setShowModal(true);
                        }}
                        className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors text-sm"
                    >
                        Enviar Foto
                    </button>
                );
            case 'ready_for_shipping':
                return (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleGenerateShipping(order);
                        }}
                        className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors text-sm"
                    >
                        Gerar Envio
                    </button>
                );
            default:
                return null;
        }
    };

    // Helper function to get financial summary for an order
    const getFinancialSummary = (order) => {
        const totalAmount = parseFloat(order.total_amount) + parseFloat(order.shipping_amount || 0);
        const paidAmount = order.payments ? order.payments.filter(p => p.status === 'approved').reduce((sum, p) => sum + parseFloat(p.amount), 0) : parseFloat(order.received_amount || 0);
        const remainingAmount = Math.max(0, totalAmount - paidAmount);
        
        return {
            totalAmount,
            paidAmount,
            remainingAmount,
            isFullyPaid: remainingAmount <= 0
        };
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('pt-BR');
    };

    const statusCounts = {
        payment_approved: orders.filter(o => o.order_status === 'payment_approved').length,
        in_production: orders.filter(o => o.order_status === 'in_production').length,
        photo_sent: orders.filter(o => o.order_status === 'photo_sent').length,
        ready_for_shipping: orders.filter(o => o.order_status === 'ready_for_shipping').length
    };

    return (
        <>
            <Head title="Gestão de Produção - Pedidos" />

            <AuthenticatedLayout
                header={
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold">
                            🏭 Gestão de Produção
                        </h2>
                        <p className="text-blue-100 mt-1">
                            Gerencie o processo de produção e envio dos pedidos
                        </p>
                    </div>
                }
            >
                <div className="py-12 bg-gray-50 min-h-screen">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {/* Filter Tabs */}
                        <div className="bg-white rounded-lg shadow-md mb-6">
                            <div className="border-b border-gray-200">
                                <nav className="-mb-px flex space-x-8 px-6">
                                    <Link
                                        href={route('production.orders.index')}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                            !statusFilter || statusFilter === 'all' 
                                                ? 'border-blue-500 text-blue-600' 
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        Todos ({orders.length})
                                    </Link>
                                    <Link
                                        href={route('production.orders.index', { status: 'payment_approved' })}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                            statusFilter === 'payment_approved'
                                                ? 'border-green-500 text-green-600' 
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        Pronto p/ Produção ({statusCounts.payment_approved})
                                    </Link>
                                    <Link
                                        href={route('production.orders.index', { status: 'in_production' })}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                            statusFilter === 'in_production'
                                                ? 'border-blue-500 text-blue-600' 
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        Em Produção ({statusCounts.in_production})
                                    </Link>
                                    <Link
                                        href={route('production.orders.index', { status: 'ready_for_shipping' })}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                            statusFilter === 'ready_for_shipping'
                                                ? 'border-teal-500 text-teal-600' 
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        Prontos p/ Envio ({statusCounts.ready_for_shipping})
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
                                                <strong>Kit:</strong> {order.child_name}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <strong>Bordado:</strong> {order.embroidery_color} • {order.embroidery_position}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <strong>Vendedora:</strong> {order.user.name}
                                            </p>
                                            {order.production_started_at && (
                                                <p className="text-sm text-gray-600">
                                                    <strong>Iniciado:</strong> {formatDate(order.production_started_at)}
                                                </p>
                                            )}
                                        </div>

                                        <div className="border-t pt-4 mb-4">
                                            {(() => {
                                                const financial = getFinancialSummary(order);
                                                return (
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm text-gray-600">Total com Frete:</span>
                                                            <span className="font-semibold text-gray-900">
                                                                {formatBRL(financial.totalAmount)}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm text-gray-600">Valor Pago:</span>
                                                            <span className={`font-medium ${financial.paidAmount > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                                                                {formatBRL(financial.paidAmount)}
                                                            </span>
                                                        </div>
                                                        {financial.remainingAmount > 0 && (
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-sm text-gray-600">Restante:</span>
                                                                <span className="font-medium text-orange-600">
                                                                    {formatBRL(financial.remainingAmount)}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {order.payment_date && (
                                                            <div className="flex justify-between items-center text-xs">
                                                                <span className="text-gray-500">Pago em:</span>
                                                                <span className="text-gray-700">
                                                                    {formatDate(order.payment_date)}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })()}
                                        </div>

                                        <div className="flex justify-center">
                                            {getActionButton(order)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {orders.length === 0 && (
                            <div className="bg-white rounded-lg shadow-md p-12 text-center">
                                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                                    <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Nenhum pedido na produção
                                </h3>
                                <p className="text-gray-500">
                                    Todos os pedidos foram processados ou não há pedidos pendentes.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Order Details Modal */}
                {showModal && selectedOrder && modalType === 'view' && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b">
                                <h2 className="text-xl font-bold text-gray-900">
                                    Detalhes do Pedido - {selectedOrder.client_name}
                                </h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-auto p-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Order Details */}
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4">Especificações do Produto</h3>
                                        <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Nome da Criança</label>
                                                <p className="text-lg font-semibold text-gray-900">{selectedOrder.child_name}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Posição do Bordado</label>
                                                <p className="text-gray-900">{selectedOrder.embroidery_position}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Cor do Bordado</label>
                                                <p className="text-gray-900">{selectedOrder.embroidery_color}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Fonte</label>
                                                <p className="text-gray-900">{selectedOrder.embroidery_font}</p>
                                            </div>
                                        </div>

                                        <h4 className="text-lg font-semibold mt-6 mb-4">Informações do Cliente</h4>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Cliente</label>
                                                <p className="text-gray-900">{selectedOrder.client_name}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Telefone</label>
                                                <p className="text-gray-900">{selectedOrder.client_phone || 'Não informado'}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Endereço de Entrega</label>
                                                <p className="text-gray-900">
                                                    {selectedOrder.delivery_address ? (
                                                        <>
                                                            {selectedOrder.delivery_address}, {selectedOrder.delivery_number}<br/>
                                                            {selectedOrder.delivery_complement && `${selectedOrder.delivery_complement}, `}
                                                            {selectedOrder.delivery_neighborhood}<br/>
                                                            {selectedOrder.delivery_city}/{selectedOrder.delivery_state} - {selectedOrder.delivery_zipcode}
                                                        </>
                                                    ) : (
                                                        'Não informado'
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Financial Information */}
                                        <h4 className="text-lg font-semibold mt-6 mb-4">Informações Financeiras</h4>
                                        <div className="space-y-3 bg-blue-50 p-4 rounded-lg">
                                            {(() => {
                                                const financial = getFinancialSummary(selectedOrder);
                                                return (
                                                    <>
                                                        <div className="flex justify-between items-center">
                                                            <label className="text-sm font-medium text-gray-600">Total com Frete:</label>
                                                            <span className="font-semibold text-gray-900">
                                                                {formatBRL(financial.totalAmount)}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <label className="text-sm font-medium text-gray-600">Valor Pago:</label>
                                                            <span className={`font-medium ${financial.paidAmount > 0 ? 'text-green-700' : 'text-gray-500'}`}>
                                                                {formatBRL(financial.paidAmount)}
                                                            </span>
                                                        </div>
                                                        {financial.remainingAmount > 0 && (
                                                            <div className="flex justify-between items-center">
                                                                <label className="text-sm font-medium text-gray-600">Valor Restante:</label>
                                                                <span className="font-medium text-orange-700">
                                                                    {formatBRL(financial.remainingAmount)}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {selectedOrder.payment_date && (
                                                            <div className="flex justify-between items-center">
                                                                <label className="text-sm font-medium text-gray-600">Data do Pagamento:</label>
                                                                <span className="text-gray-700">
                                                                    {formatDate(selectedOrder.payment_date)}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {financial.isFullyPaid && (
                                                            <div className="text-center">
                                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                                    ✅ Pagamento Completo
                                                                </span>
                                                            </div>
                                                        )}
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    </div>

                                    {/* Production Info */}
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4">Status da Produção</h3>
                                        <div className="space-y-4">
                                            {getStatusBadge(selectedOrder.order_status)}
                                            
                                            {selectedOrder.production_started_at && (
                                                <div className="bg-blue-50 p-4 rounded-lg">
                                                    <p className="text-sm font-medium text-blue-900">Produção Iniciada</p>
                                                    <p className="text-blue-700">{formatDate(selectedOrder.production_started_at)}</p>
                                                    {selectedOrder.production_admin && (
                                                        <p className="text-sm text-blue-600">Por: {selectedOrder.production_admin.name}</p>
                                                    )}
                                                </div>
                                            )}

                                            {selectedOrder.photo_sent_at && (
                                                <div className="bg-purple-50 p-4 rounded-lg">
                                                    <p className="text-sm font-medium text-purple-900">Foto Enviada</p>
                                                    <p className="text-purple-700">{formatDate(selectedOrder.photo_sent_at)}</p>
                                                </div>
                                            )}

                                            {selectedOrder.tracking_code && (
                                                <div className="bg-green-50 p-4 rounded-lg">
                                                    <p className="text-sm font-medium text-green-900">Código de Rastreio</p>
                                                    <p className="font-mono text-green-700">{selectedOrder.tracking_code}</p>
                                                </div>
                                            )}
                                        </div>

                                        {selectedOrder.notes && (
                                            <div className="mt-6">
                                                <h4 className="text-sm font-medium text-gray-600 mb-2">Observações</h4>
                                                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedOrder.notes}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-4 p-6 border-t bg-gray-50">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Fechar
                                </button>
                                {getActionButton(selectedOrder)}
                            </div>
                        </div>
                    </div>
                )}

                {/* Photo Upload Modal */}
                {showModal && selectedOrder && modalType === 'photo' && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg w-full max-w-2xl">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b">
                                <h2 className="text-xl font-bold text-gray-900">
                                    Enviar Foto do Produto - {selectedOrder.child_name}
                                </h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Foto do Produto Finalizado
                                    </label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-purple-400 transition-colors">
                                        <div className="space-y-1 text-center">
                                            {photoPreview ? (
                                                <div>
                                                    <img 
                                                        src={photoPreview} 
                                                        alt="Preview" 
                                                        className="mx-auto h-48 w-auto rounded"
                                                    />
                                                    <p className="text-sm text-gray-600 mt-2">
                                                        {data.product_photo?.name}
                                                    </p>
                                                </div>
                                            ) : (
                                                <>
                                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <div className="flex text-sm text-gray-600">
                                                        <label htmlFor="product_photo" className="relative cursor-pointer rounded-md bg-white font-medium text-purple-600 hover:text-purple-500">
                                                            <span>Selecionar foto</span>
                                                            <input
                                                                id="product_photo"
                                                                type="file"
                                                                className="sr-only"
                                                                accept="image/*"
                                                                onChange={handlePhotoChange}
                                                                required
                                                            />
                                                        </label>
                                                        <p className="pl-1">ou arraste aqui</p>
                                                    </div>
                                                    <p className="text-xs text-gray-500">
                                                        PNG, JPG até 5MB
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    {errors.product_photo && (
                                        <p className="text-red-500 text-sm mt-1">{errors.product_photo}</p>
                                    )}
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Observações (opcional)
                                    </label>
                                    <textarea
                                        value={data.notes}
                                        onChange={e => setData('notes', e.target.value)}
                                        rows={3}
                                        className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                        placeholder="Adicione observações sobre o produto..."
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-4 p-6 border-t bg-gray-50">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handlePhotoUpload}
                                    disabled={processing || !data.product_photo}
                                    className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Enviando...' : 'Enviar para Aprovação'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </AuthenticatedLayout>
        </>
    );
}