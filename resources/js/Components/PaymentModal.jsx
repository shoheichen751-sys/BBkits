import React, { useState } from 'react';
import { X, Upload, Calendar, CreditCard, FileText, DollarSign } from 'lucide-react';
import { useForm } from '@inertiajs/react';

export default function PaymentModal({ isOpen, onClose, sale }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        amount: '',
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: 'PIX',
        receipt: null,
        notes: '',
    });

    const paymentMethods = [
        { value: 'PIX', label: 'PIX' },
        { value: 'Cartão de Crédito', label: 'Cartão de Crédito' },
        { value: 'Cartão de Débito', label: 'Cartão de Débito' },
        { value: 'Boleto', label: 'Boleto' },
        { value: 'Transferência', label: 'Transferência Bancária' },
        { value: 'Dinheiro', label: 'Dinheiro' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();

        // Ensure we have a valid sale ID
        if (!sale?.id) {
            console.error('Sale ID is missing:', sale);
            alert('Erro: ID da venda não encontrado. Tente recarregar a página.');
            return;
        }

        console.log('Submitting payment for sale ID:', sale.id);
        const url = `/sales/${sale.id}/payments`;
        console.log('Route URL will be:', url);

        post(url, {
            forceFormData: true,
            onSuccess: () => {
                console.log('Payment submitted successfully');
                reset();
                onClose();
            },
            onError: (errors) => {
                console.error('Payment submission failed:', errors);
                alert('Erro ao enviar pagamento. Verifique o console para detalhes.');
            }
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setData('receipt', file);
    };

    if (!isOpen) return null;

    const remainingAmount = sale.total_amount - (sale.paid_amount || 0);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Registrar Pagamento</h2>
                        <p className="text-gray-600">Venda: {sale.client_name}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Payment Summary */}
                <div className="p-6 border-b bg-gray-50">
                    <h3 className="text-lg font-semibold mb-4">Resumo do Pagamento</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">Valor Total da Venda</p>
                            <p className="text-lg font-bold text-gray-800">
                                R$ {sale.total_amount?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Valor Restante</p>
                            <p className="text-lg font-bold text-red-600">
                                R$ {remainingAmount?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <DollarSign className="w-4 h-4 inline mr-1" />
                            Valor do Pagamento *
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            max={remainingAmount}
                            value={data.amount}
                            onChange={(e) => setData('amount', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="0,00"
                            required
                        />
                        {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                    </div>

                    {/* Payment Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            Data do Pagamento *
                        </label>
                        <input
                            type="date"
                            value={data.payment_date}
                            onChange={(e) => setData('payment_date', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />
                        {errors.payment_date && <p className="text-red-500 text-sm mt-1">{errors.payment_date}</p>}
                    </div>

                    {/* Payment Method */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <CreditCard className="w-4 h-4 inline mr-1" />
                            Forma de Pagamento *
                        </label>
                        <select
                            value={data.payment_method}
                            onChange={(e) => setData('payment_method', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        >
                            {paymentMethods.map(method => (
                                <option key={method.value} value={method.value}>
                                    {method.label}
                                </option>
                            ))}
                        </select>
                        {errors.payment_method && <p className="text-red-500 text-sm mt-1">{errors.payment_method}</p>}
                    </div>

                    {/* Receipt Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Upload className="w-4 h-4 inline mr-1" />
                            Comprovante de Pagamento *
                        </label>
                        <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={handleFileChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Formatos aceitos: JPG, PNG, PDF (máximo 5MB)
                        </p>
                        {errors.receipt && <p className="text-red-500 text-sm mt-1">{errors.receipt}</p>}
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <FileText className="w-4 h-4 inline mr-1" />
                            Observações
                        </label>
                        <textarea
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            rows="3"
                            placeholder="Informações adicionais sobre o pagamento..."
                        />
                        {errors.notes && <p className="text-red-500 text-sm mt-1">{errors.notes}</p>}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end space-x-4 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                        >
                            {processing ? 'Enviando...' : 'Registrar Pagamento'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}