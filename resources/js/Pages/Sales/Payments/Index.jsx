import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PaymentHistory from '@/Components/PaymentHistory';
import PaymentModal from '@/Components/PaymentModal';
import { ArrowLeft } from 'lucide-react';

export default function PaymentIndex() {
    const { sale, payments, paymentSummary, auth } = usePage().props;
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const handleAddPayment = () => {
        setShowPaymentModal(true);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(amount);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'fully_paid':
                return 'text-green-600';
            case 'partially_paid':
                return 'text-yellow-600';
            case 'unpaid':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'fully_paid':
                return 'Totalmente Pago';
            case 'partially_paid':
                return 'Parcialmente Pago';
            case 'unpaid':
                return 'Não Pago';
            default:
                return 'Desconhecido';
        }
    };

    return (
        <>
            <Head title={`Pagamentos - ${sale.client_name} - BBKits`} />
            
            <AuthenticatedLayout
                user={auth.user}
                header={
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <a
                                href="/sales"
                                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                Voltar para Vendas
                            </a>
                            <div>
                                <h2 className="font-semibold text-xl text-gray-800">
                                    Gerenciar Pagamentos
                                </h2>
                                <p className="text-gray-600">
                                    Venda para {sale.client_name}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-600">Status do Pagamento</p>
                            <p className={`font-semibold ${getStatusColor(paymentSummary.status)}`}>
                                {getStatusLabel(paymentSummary.status)}
                            </p>
                        </div>
                    </div>
                }
            >
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        {/* Payment Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">Total com Frete</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {formatCurrency(paymentSummary.total_amount)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">Valor Pago</p>
                                        <p className="text-2xl font-bold text-green-600">
                                            {formatCurrency(paymentSummary.paid_amount)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">Pendente</p>
                                        <p className="text-2xl font-bold text-yellow-600">
                                            {formatCurrency(paymentSummary.pending_amount)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">Restante</p>
                                        <p className="text-2xl font-bold text-red-600">
                                            {formatCurrency(paymentSummary.remaining_amount)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment History */}
                        <PaymentHistory
                            sale={sale}
                            payments={payments}
                            onAddPayment={handleAddPayment}
                        />

                        {/* Payment Modal */}
                        <PaymentModal
                            isOpen={showPaymentModal}
                            onClose={() => setShowPaymentModal(false)}
                            sale={{
                                ...sale,
                                paid_amount: paymentSummary.paid_amount,
                            }}
                        />
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}