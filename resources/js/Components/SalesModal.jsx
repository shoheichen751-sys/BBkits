import React, { useState, useMemo } from 'react';
import { X, Filter, Search, Download, Eye } from 'lucide-react';

export default function SalesModal({ isOpen, onClose, sales, sellerName }) {
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredSales = useMemo(() => {
        let filtered = sales;
        
        // Apply status filter
        if (filter !== 'all') {
            filtered = filtered.filter(sale => sale.status === filter);
        }
        
        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(sale => 
                sale.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                sale.sale_number?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        return filtered;
    }, [sales, filter, searchTerm]);

    const totalStats = useMemo(() => {
        return {
            total: filteredSales.reduce((sum, sale) => sum + (sale.received_amount || 0), 0),
            approved: filteredSales.filter(s => s.status === 'aprovado').reduce((sum, sale) => sum + (sale.received_amount || 0), 0),
            pending: filteredSales.filter(s => s.status === 'pendente').reduce((sum, sale) => sum + (sale.received_amount || 0), 0),
            rejected: filteredSales.filter(s => s.status === 'recusado').reduce((sum, sale) => sum + (sale.received_amount || 0), 0),
        };
    }, [filteredSales]);

    if (!isOpen) return null;

    const getStatusBadge = (status) => {
        const statusMap = {
            'aprovado': { label: 'Aprovado', class: 'bg-green-100 text-green-800' },
            'pendente': { label: 'Pendente', class: 'bg-yellow-100 text-yellow-800' },
            'recusado': { label: 'Recusado', class: 'bg-red-100 text-red-800' }
        };
        return statusMap[status] || { label: status, class: 'bg-gray-100 text-gray-800' };
    };

    const getPaymentStatusBadge = (paymentStatus) => {
        const statusMap = {
            'fully_paid': { label: 'Totalmente Pago', class: 'bg-green-100 text-green-800' },
            'partially_paid': { label: 'Parcialmente Pago', class: 'bg-orange-100 text-orange-800' },
            'unpaid': { label: 'Não Pago', class: 'bg-red-100 text-red-800' }
        };
        return statusMap[paymentStatus] || { label: paymentStatus, class: 'bg-gray-100 text-gray-800' };
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Todas as Vendas</h2>
                        <p className="text-gray-600">{sellerName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Filters and Search */}
                <div className="p-6 border-b bg-gray-50">
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-gray-500" />
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="all">Todos Status</option>
                                <option value="aprovado">Aprovadas</option>
                                <option value="pendente">Pendentes</option>
                                <option value="recusado">Recusadas</option>
                            </select>
                        </div>
                        
                        <div className="flex items-center gap-2 flex-1">
                            <Search className="w-5 h-5 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Buscar por cliente ou número..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="border rounded-lg px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                    </div>

                    {/* Summary Stats */}
                    <div className="grid grid-cols-4 gap-4 mt-4">
                        <div className="bg-white p-4 rounded-lg border">
                            <p className="text-sm text-gray-600">Total</p>
                            <p className="text-xl font-bold">
                                R$ {totalStats.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <p className="text-sm text-green-600">Aprovadas</p>
                            <p className="text-xl font-bold text-green-800">
                                R$ {totalStats.approved.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                            <p className="text-sm text-yellow-600">Pendentes</p>
                            <p className="text-xl font-bold text-yellow-800">
                                R$ {totalStats.pending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                            <p className="text-sm text-red-600">Recusadas</p>
                            <p className="text-xl font-bold text-red-800">
                                R$ {totalStats.rejected.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sales Table */}
                <div className="flex-1 overflow-auto p-6">
                    <table className="w-full">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Data
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cliente
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Valor Total
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Frete
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Valor Pago
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Restante
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status Venda
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status Pagamento
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredSales.map((sale) => {
                                const statusInfo = getStatusBadge(sale.status);
                                const paymentStatusInfo = getPaymentStatusBadge(sale.payment_status);
                                return (
                                    <tr key={sale.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {sale.payment_date ? new Date(sale.payment_date).toLocaleDateString('pt-BR') : '-'}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {sale.client_name}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                            R$ {(sale.total_amount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                            R$ {(sale.shipping_amount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <span className={sale.received_amount > 0 ? 'text-green-700 font-medium' : 'text-gray-500'}>
                                                R$ {(sale.received_amount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <span className={sale.remaining_amount > 0 ? 'text-orange-700 font-medium' : 'text-gray-500'}>
                                                R$ {(sale.remaining_amount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.class}`}>
                                                {statusInfo.label}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${paymentStatusInfo.class}`}>
                                                {paymentStatusInfo.label}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            <button className="text-purple-600 hover:text-purple-900 mx-1">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <a 
                                                href={`/sales/${sale.id}/payments`}
                                                className="text-blue-600 hover:text-blue-900 mx-1 inline-flex items-center"
                                                title="Gerenciar Pagamentos"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                                </svg>
                                                {sale.payments && sale.payments.length > 0 && (
                                                    <span className="ml-1 text-xs bg-blue-100 text-blue-800 px-1 rounded">
                                                        {sale.payments.length}
                                                    </span>
                                                )}
                                            </a>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    
                    {filteredSales.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">Nenhuma venda encontrada com os filtros aplicados.</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t bg-gray-50 flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                        Mostrando {filteredSales.length} de {sales.length} vendas
                    </p>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}