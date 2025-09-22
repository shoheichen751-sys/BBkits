import React, { useState } from 'react';
import { Calendar, CreditCard, Check, Clock, X, Eye, Trash2 } from 'lucide-react';
import { useForm, router } from '@inertiajs/react';

export default function PaymentHistory({ sale, payments, onAddPayment, paymentSummary }) {
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);

    const { data, setData, put, processing, errors, reset } = useForm({
        rejection_reason: '',
    });

    const getStatusBadge = (status) => {
        const statusMap = {
            'pending': { label: 'Pendente', class: 'bg-yellow-100 text-yellow-800', icon: Clock },
            'approved': { label: 'Aprovado', class: 'bg-green-100 text-green-800', icon: Check },
            'rejected': { label: 'Rejeitado', class: 'bg-red-100 text-red-800', icon: X },
        };
        return statusMap[status] || { label: status, class: 'bg-gray-100 text-gray-800', icon: Clock };
    };

    const handleApprove = (payment) => {
        put(route('payments.approve', payment.id));
    };

    const handleReject = (payment) => {
        setSelectedPayment(payment);
        setShowRejectModal(true);
    };

    const submitRejection = (e) => {
        e.preventDefault();
        put(route('payments.reject', selectedPayment.id), {
            onSuccess: () => {
                reset();
                setShowRejectModal(false);
                setSelectedPayment(null);
            }
        });
    };

    const handleDelete = (payment) => {
        if (confirm('Tem certeza que deseja excluir este pagamento?')) {
            router.delete(route('payments.destroy', payment.id));
        }
    };

    // Use paymentSummary values from backend (already calculated correctly with shipping)
    const totalAmount = paymentSummary ? paymentSummary.total_amount : (sale.total_amount + (sale.shipping_amount || 0));
    const totalPaid = paymentSummary ? paymentSummary.paid_amount : payments.filter(p => p.status === 'approved').reduce((sum, p) => sum + parseFloat(p.amount), 0);
    const totalPending = paymentSummary ? paymentSummary.pending_amount : payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + parseFloat(p.amount), 0);
    const remaining = paymentSummary ? paymentSummary.remaining_amount : Math.max(0, totalAmount - totalPaid);
    const progress = paymentSummary ? paymentSummary.progress : ((totalPaid / totalAmount) * 100);

    return (
        <div className="bg-white rounded-lg shadow-sm border">
            {/* Header */}
            <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">Histórico de Pagamentos</h3>
                        <p className="text-sm text-gray-600">Cliente: {sale.client_name}</p>
                    </div>
                    <button
                        onClick={onAddPayment}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Adicionar Pagamento
                    </button>
                </div>
            </div>

            {/* Payment Progress */}
            <div className="p-6 border-b bg-gray-50">
                <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progresso do Pagamento</span>
                        <span>{progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                            className="bg-green-500 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                        <p className="text-sm text-gray-600">Total com Frete</p>
                        <p className="text-lg font-bold text-gray-800">
                            R$ {totalAmount?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Produtos: R$ {sale.total_amount?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-gray-500">
                            Frete: R$ {(sale.shipping_amount || 0)?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Pago</p>
                        <p className="text-lg font-bold text-green-600">
                            R$ {totalPaid?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            {totalAmount > 0 ? ((totalPaid / totalAmount) * 100).toFixed(1) : 0}% do total
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Pendente</p>
                        <p className="text-lg font-bold text-yellow-600">
                            R$ {totalPending?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Aguardando aprovação
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Restante</p>
                        <p className="text-lg font-bold text-red-600">
                            R$ {remaining?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            {remaining > 0 ? 'A pagar' : 'Quitado'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Payments List */}
            <div className="p-6">
                {payments.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Nenhum pagamento registrado ainda.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {payments.map((payment) => {
                            const statusInfo = getStatusBadge(payment.status);
                            const StatusIcon = statusInfo.icon;

                            return (
                                <div key={payment.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                <StatusIcon className="w-5 h-5 text-gray-500" />
                                            </div>
                                            <div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="font-medium text-gray-800">
                                                        R$ {parseFloat(payment.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                    </span>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.class}`}>
                                                        {statusInfo.label}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                                                    <span>
                                                        <Calendar className="w-4 h-4 inline mr-1" />
                                                        {new Date(payment.payment_date).toLocaleDateString('pt-BR')}
                                                    </span>
                                                    <span>
                                                        <CreditCard className="w-4 h-4 inline mr-1" />
                                                        {payment.payment_method}
                                                    </span>
                                                </div>
                                                {payment.notes && (
                                                    <p className="text-sm text-gray-500 mt-1">{payment.notes}</p>
                                                )}
                                                {payment.rejection_reason && (
                                                    <p className="text-sm text-red-600 mt-1">
                                                        <strong>Motivo da rejeição:</strong> {payment.rejection_reason}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            {payment.receipt_path && (
                                                <a
                                                    href={`/storage/${payment.receipt_path}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Ver comprovante"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </a>
                                            )}
                                            
                                            {payment.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(payment)}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        title="Aprovar"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(payment)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Rejeitar"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                            
                                            {payment.status === 'pending' && (
                                                <button
                                                    onClick={() => handleDelete(payment)}
                                                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                                    title="Excluir"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg w-full max-w-md">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Rejeitar Pagamento</h3>
                            <form onSubmit={submitRejection}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Motivo da rejeição *
                                    </label>
                                    <textarea
                                        value={data.rejection_reason}
                                        onChange={(e) => setData('rejection_reason', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        rows="3"
                                        placeholder="Explique o motivo da rejeição..."
                                        required
                                    />
                                    {errors.rejection_reason && (
                                        <p className="text-red-500 text-sm mt-1">{errors.rejection_reason}</p>
                                    )}
                                </div>
                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowRejectModal(false)}
                                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                                    >
                                        {processing ? 'Rejeitando...' : 'Rejeitar'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}