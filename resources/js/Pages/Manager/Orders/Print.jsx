import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { formatBRL } from '@/utils/currency';

export default function PrintOrder({ order }) {
    useEffect(() => {
        // Auto-print when page loads
        window.print();
    }, []);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusLabel = (status) => {
        const labels = {
            pending_payment: 'Aguardando Pagamento',
            payment_approved: 'Pagamento Aprovado',
            in_production: 'Em Produção',
            photo_sent: 'Foto Enviada para Aprovação',
            photo_approved: 'Foto Aprovada pelo Cliente',
            pending_final_payment: 'Pagamento Final Pendente',
            ready_for_shipping: 'Pronto para Envio',
            shipped: 'Enviado'
        };
        return labels[status] || status;
    };

    // Calculate financial summary
    const totalAmount = parseFloat(order.total_amount) + parseFloat(order.shipping_amount || 0);
    const paidAmount = order.payments ? 
        order.payments.filter(p => p.status === 'approved').reduce((sum, p) => sum + parseFloat(p.amount), 0) : 
        parseFloat(order.received_amount || 0);
    const remainingAmount = Math.max(0, totalAmount - paidAmount);

    return (
        <>
            <Head title={`Imprimir Pedido ${order.unique_token}`} />
            
            <div className="max-w-4xl mx-auto p-8 bg-white" style={{ fontFamily: 'Arial, sans-serif' }}>
                {/* Header */}
                <div className="text-center mb-8 border-b-2 border-gray-300 pb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">BBKits - Detalhes do Pedido</h1>
                    <p className="text-lg text-gray-600">#{order.unique_token}</p>
                    <p className="text-sm text-gray-500">Impresso em: {formatDate(new Date())}</p>
                </div>

                {/* Order Status */}
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                    <div className="flex items-center">
                        <span className="text-2xl mr-3">📋</span>
                        <div>
                            <h3 className="font-bold text-blue-800">Status do Pedido</h3>
                            <p className="text-blue-700">{getStatusLabel(order.order_status)}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Client Information */}
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <span className="mr-2">👤</span>Informações do Cliente
                        </h2>
                        <div className="space-y-2">
                            <p><strong>Nome:</strong> {order.client_name}</p>
                            <p><strong>Email:</strong> {order.client_email}</p>
                            <p><strong>Telefone:</strong> {order.client_phone}</p>
                            {order.client_cpf && <p><strong>CPF:</strong> {order.client_cpf}</p>}
                        </div>
                    </div>

                    {/* Product Information */}
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <span className="mr-2">🎽</span>Informações do Produto
                        </h2>
                        <div className="space-y-2">
                            <p><strong>Nome da Criança:</strong> {order.child_name}</p>
                            <p><strong>Categoria:</strong> {order.product_category?.name || 'N/A'}</p>
                            <p><strong>Tamanho:</strong> {order.product_size}</p>
                            <p><strong>Preço do Produto:</strong> {formatBRL(order.product_price)}</p>
                        </div>
                    </div>
                </div>

                {/* Embroidery Details */}
                {(order.embroidery_text || order.embroidery_design) && (
                    <div className="bg-yellow-50 rounded-lg p-6 mb-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <span className="mr-2">✨</span>Detalhes do Bordado
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                {order.embroidery_text && <p><strong>Texto:</strong> {order.embroidery_text}</p>}
                                {order.embroidery_position && <p><strong>Posição:</strong> {order.embroidery_position}</p>}
                                {order.embroidery_color && <p><strong>Cor:</strong> {order.embroidery_color}</p>}
                            </div>
                            <div className="space-y-2">
                                {order.embroidery_font && <p><strong>Fonte:</strong> {order.embroidery_font}</p>}
                                {order.embroidery_type && <p><strong>Tipo:</strong> {order.embroidery_type}</p>}
                                {order.embroidery_design && <p><strong>Design:</strong> {order.embroidery_design.name}</p>}
                            </div>
                        </div>
                    </div>
                )}

                {/* Delivery Address */}
                {order.delivery_address && (
                    <div className="bg-green-50 rounded-lg p-6 mb-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <span className="mr-2">🏠</span>Endereço de Entrega
                        </h2>
                        <div className="space-y-1">
                            <p>{order.delivery_address}, {order.delivery_number}</p>
                            {order.delivery_complement && <p>{order.delivery_complement}</p>}
                            <p>{order.delivery_neighborhood} - {order.delivery_city}/{order.delivery_state}</p>
                            <p>CEP: {order.delivery_zipcode}</p>
                            {order.preferred_delivery_date && (
                                <p><strong>Data Preferida:</strong> {formatDate(order.preferred_delivery_date)}</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Financial Summary */}
                <div className="bg-purple-50 rounded-lg p-6 mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <span className="mr-2">💰</span>Resumo Financeiro
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                            <p className="text-sm text-gray-600">Total com Frete</p>
                            <p className="text-lg font-bold text-gray-800">{formatBRL(totalAmount)}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-gray-600">Valor Pago</p>
                            <p className="text-lg font-bold text-green-600">{formatBRL(paidAmount)}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-gray-600">Valor Restante</p>
                            <p className="text-lg font-bold text-red-600">{formatBRL(remainingAmount)}</p>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-purple-200">
                        <div className="flex justify-between text-sm">
                            <span>Produto:</span>
                            <span>{formatBRL(order.product_price)}</span>
                        </div>
                        {order.shipping_amount > 0 && (
                            <div className="flex justify-between text-sm">
                                <span>Frete:</span>
                                <span>{formatBRL(order.shipping_amount)}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Timeline */}
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <span className="mr-2">⏰</span>Linha do Tempo
                    </h2>
                    <div className="space-y-2 text-sm">
                        <p><strong>Criado em:</strong> {formatDate(order.created_at)}</p>
                        {order.approved_at && <p><strong>Aprovado em:</strong> {formatDate(order.approved_at)}</p>}
                        {order.production_started_at && <p><strong>Produção iniciada em:</strong> {formatDate(order.production_started_at)}</p>}
                        {order.photo_sent_at && <p><strong>Foto enviada em:</strong> {formatDate(order.photo_sent_at)}</p>}
                        {order.photo_approved_at && <p><strong>Foto aprovada em:</strong> {formatDate(order.photo_approved_at)}</p>}
                        {order.shipped_at && <p><strong>Enviado em:</strong> {formatDate(order.shipped_at)}</p>}
                    </div>
                </div>

                {/* Notes */}
                {(order.notes || order.admin_notes) && (
                    <div className="bg-orange-50 rounded-lg p-6 mb-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <span className="mr-2">📝</span>Observações
                        </h2>
                        {order.notes && (
                            <div className="mb-4">
                                <p className="font-semibold text-gray-700">Observações do Cliente:</p>
                                <p className="text-gray-600">{order.notes}</p>
                            </div>
                        )}
                        {order.admin_notes && (
                            <div>
                                <p className="font-semibold text-gray-700">Observações Administrativas:</p>
                                <p className="text-gray-600">{order.admin_notes}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Footer */}
                <div className="text-center text-sm text-gray-500 border-t border-gray-300 pt-4">
                    <p>BBKits - Sistema de Gestão de Pedidos</p>
                    <p>Documento gerado automaticamente pelo sistema</p>
                    <p className="mt-2">Para produção interna - Não válido como documento fiscal</p>
                </div>

                {/* Print-only styles */}
                <style jsx>{`
                    @media print {
                        body { margin: 0; }
                        .no-print { display: none; }
                        .print-break { page-break-before: always; }
                    }
                `}</style>
            </div>
        </>
    );
}