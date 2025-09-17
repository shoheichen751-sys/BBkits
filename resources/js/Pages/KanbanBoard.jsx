import { useState, useEffect, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import toast from 'react-hot-toast';

export default function KanbanBoard({ sales = [], users = [] }) {
    const [draggedItem, setDraggedItem] = useState(null);
    const [columns, setColumns] = useState({});
    const [loading, setLoading] = useState(false);
    
    const columnConfig = {
        pending_payment: {
            title: '⏳ Aguardando Pagamento',
            color: 'yellow',
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-200'
        },
        payment_approved: {
            title: '✅ Pagamento Aprovado',
            color: 'green', 
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200'
        },
        in_production: {
            title: '🏭 Em Produção',
            color: 'blue',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200'
        },
        photo_sent: {
            title: '📸 Foto Enviada',
            color: 'purple',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200'
        },
        photo_approved: {
            title: '✨ Foto Aprovada',
            color: 'indigo',
            bgColor: 'bg-indigo-50',
            borderColor: 'border-indigo-200'
        },
        pending_final_payment: {
            title: '🟠 Pagamento Final',
            color: 'orange',
            bgColor: 'bg-orange-50',
            borderColor: 'border-orange-200'
        },
        ready_for_shipping: {
            title: '🚚 Pronto para Envio',
            color: 'teal',
            bgColor: 'bg-teal-50',
            borderColor: 'border-teal-200'
        },
        shipped: {
            title: '🎉 Enviado',
            color: 'green',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200'
        },
        under_review: {
            title: '🔍 Em Revisão',
            color: 'red',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200'
        }
    };

    useEffect(() => {
        // Organize sales by status
        const organized = {};
        
        // Initialize all columns
        Object.keys(columnConfig).forEach(status => {
            organized[status] = [];
        });
        
        // Add sales to appropriate columns
        sales.forEach(sale => {
            const status = sale.order_status || 'pending_payment';
            if (organized[status]) {
                organized[status].push(sale);
            }
        });
        
        setColumns(organized);
    }, [sales]);

    const handleDragStart = (e, sale) => {
        setDraggedItem(sale);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, newStatus) => {
        e.preventDefault();
        
        if (!draggedItem || draggedItem.order_status === newStatus) {
            setDraggedItem(null);
            return;
        }

        // Check if status change is valid
        if (!isValidStatusTransition(draggedItem.order_status, newStatus)) {
            toast.error('Transição de status inválida');
            setDraggedItem(null);
            return;
        }

        updateOrderStatus(draggedItem.id, newStatus);
        setDraggedItem(null);
    };

    const isValidStatusTransition = (from, to) => {
        const validTransitions = {
            'pending_payment': ['payment_approved', 'under_review'],
            'payment_approved': ['in_production', 'under_review'],
            'in_production': ['photo_sent', 'under_review'],
            'photo_sent': ['photo_approved', 'under_review'],
            'photo_approved': ['pending_final_payment', 'ready_for_shipping', 'under_review'],
            'pending_final_payment': ['ready_for_shipping', 'under_review'],
            'ready_for_shipping': ['shipped', 'under_review'],
            'under_review': ['pending_payment', 'payment_approved', 'in_production', 'photo_sent', 'photo_approved', 'pending_final_payment', 'ready_for_shipping']
        };

        return validTransitions[from]?.includes(to) || false;
    };

    const updateOrderStatus = async (saleId, newStatus) => {
        setLoading(true);
        
        try {
            router.patch(`/sales/${saleId}/status`, {
                order_status: newStatus
            }, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Status atualizado com sucesso!');
                    // Update local state immediately
                    setColumns(prev => {
                        const updated = { ...prev };
                        
                        // Remove from old column
                        Object.keys(updated).forEach(status => {
                            updated[status] = updated[status].filter(sale => sale.id !== saleId);
                        });
                        
                        // Add to new column
                        const sale = sales.find(s => s.id === saleId);
                        if (sale && updated[newStatus]) {
                            updated[newStatus].push({ ...sale, order_status: newStatus });
                        }
                        
                        return updated;
                    });
                },
                onError: (errors) => {
                    toast.error('Erro ao atualizar status');
                    console.error(errors);
                }
            });
        } catch (error) {
            toast.error('Erro ao atualizar status');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const getTimeAgo = (date) => {
        const now = new Date();
        const created = new Date(date);
        const diffInHours = Math.floor((now - created) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return 'Agora';
        if (diffInHours < 24) return `${diffInHours}h atrás`;
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}d atrás`;
        return created.toLocaleDateString('pt-BR');
    };

    const getSaleCard = (sale) => {
        const isStalled = sale.updated_at && new Date() - new Date(sale.updated_at) > 48 * 60 * 60 * 1000;
        const isUrgent = sale.created_at && new Date() - new Date(sale.created_at) > 72 * 60 * 60 * 1000;
        
        return (
            <div
                key={sale.id}
                draggable
                onDragStart={(e) => handleDragStart(e, sale)}
                className={`
                    bg-white rounded-lg border shadow-sm p-4 mb-3 cursor-move transition-all duration-200
                    hover:shadow-md hover:scale-105 transform
                    ${isStalled ? 'border-l-4 border-l-yellow-500' : ''}
                    ${isUrgent ? 'border-l-4 border-l-red-500 bg-red-50' : ''}
                    ${draggedItem?.id === sale.id ? 'opacity-50 rotate-3' : ''}
                `}
            >
                <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-gray-900 text-sm">
                        #{sale.unique_token}
                    </div>
                    <div className="text-xs text-gray-500">
                        {getTimeAgo(sale.updated_at)}
                    </div>
                </div>
                
                <div className="space-y-1 text-sm">
                    <div className="text-gray-800 font-medium">
                        {sale.client_name}
                    </div>
                    {sale.child_name && (
                        <div className="text-gray-600">
                            👶 {sale.child_name}
                        </div>
                    )}
                    <div className="text-gray-600">
                        💰 {formatCurrency(sale.total_amount)}
                    </div>
                    {sale.user?.name && (
                        <div className="text-gray-500 text-xs">
                            📱 {sale.user.name}
                        </div>
                    )}
                </div>

                {isStalled && (
                    <div className="mt-2 text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded">
                        ⏰ Parado há mais de 48h
                    </div>
                )}

                {isUrgent && (
                    <div className="mt-2 text-xs text-red-700 bg-red-100 px-2 py-1 rounded">
                        🚨 URGENTE - Mais de 72h
                    </div>
                )}

                <div className="mt-3 flex justify-between items-center">
                    <button
                        onClick={() => router.visit(`/sales/${sale.id}`)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                    >
                        Ver detalhes →
                    </button>
                    <div className="text-xs text-gray-400">
                        {sale.comments_count || 0} 💬
                    </div>
                </div>
            </div>
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-bold text-2xl text-gray-800 leading-tight">
                        📋 Kanban - Gestão de Pedidos
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            🔄 Atualizar
                        </button>
                        <button
                            onClick={() => router.visit('/sales')}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            📋 Lista
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Kanban Board" />

            <div className="py-6">
                <div className="max-w-full mx-auto px-4">
                    <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: '80vh' }}>
                        {Object.entries(columnConfig).map(([status, config]) => (
                            <div
                                key={status}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, status)}
                                className={`
                                    flex-shrink-0 w-80 ${config.bgColor} ${config.borderColor} border-2 border-dashed 
                                    rounded-lg p-4 transition-all duration-200
                                    ${draggedItem && isValidStatusTransition(draggedItem.order_status, status) 
                                        ? 'border-solid shadow-lg transform scale-105' 
                                        : ''
                                    }
                                `}
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-semibold text-gray-800 text-sm">
                                        {config.title}
                                    </h3>
                                    <span className={`
                                        text-xs px-2 py-1 rounded-full
                                        ${config.color === 'yellow' ? 'bg-yellow-200 text-yellow-800' : ''}
                                        ${config.color === 'green' ? 'bg-green-200 text-green-800' : ''}
                                        ${config.color === 'blue' ? 'bg-blue-200 text-blue-800' : ''}
                                        ${config.color === 'purple' ? 'bg-purple-200 text-purple-800' : ''}
                                        ${config.color === 'indigo' ? 'bg-indigo-200 text-indigo-800' : ''}
                                        ${config.color === 'orange' ? 'bg-orange-200 text-orange-800' : ''}
                                        ${config.color === 'teal' ? 'bg-teal-200 text-teal-800' : ''}
                                        ${config.color === 'red' ? 'bg-red-200 text-red-800' : ''}
                                    `}>
                                        {columns[status]?.length || 0}
                                    </span>
                                </div>
                                
                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {columns[status]?.map(sale => getSaleCard(sale))}
                                </div>

                                {(!columns[status] || columns[status].length === 0) && (
                                    <div className="text-center text-gray-500 py-8 text-sm">
                                        <div className="text-2xl mb-2">📭</div>
                                        <p>Nenhum pedido</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 flex items-center gap-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span>Atualizando status...</span>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}