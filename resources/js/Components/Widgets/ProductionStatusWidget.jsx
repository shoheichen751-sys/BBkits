import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';

export default function ProductionStatusWidget({ initialData = null }) {
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(!initialData);

    useEffect(() => {
        if (!initialData) {
            fetchData();
        }
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('/api/dashboard-widgets/production-status');
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error('Failed to fetch production status:', error);
        }
        setLoading(false);
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
    };

    const getStatusBadge = (status) => {
        const config = {
            pendente: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendente' },
            aprovado: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Aprovado' },
            em_producao: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Produção' },
            finalizado: { bg: 'bg-green-100', text: 'text-green-800', label: 'Finalizado' },
            enviado: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Enviado' },
        };
        const { bg, text, label } = config[status] || config.pendente;
        return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>{label}</span>;
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-12 bg-gray-100 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Status de Produção</h3>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {data?.stats?.total_pending || 0} em aberto
                </span>
            </div>
            <div className="p-4">
                {/* Status Summary */}
                <div className="grid grid-cols-5 gap-2 mb-4">
                    <div className="text-center p-2 bg-yellow-50 rounded">
                        <div className="text-lg font-bold text-yellow-700">{data?.by_status?.pending || 0}</div>
                        <div className="text-xs text-yellow-600">Pendentes</div>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded">
                        <div className="text-lg font-bold text-blue-700">{data?.by_status?.approved || 0}</div>
                        <div className="text-xs text-blue-600">Aprovados</div>
                    </div>
                    <div className="text-center p-2 bg-purple-50 rounded">
                        <div className="text-lg font-bold text-purple-700">{data?.by_status?.in_production || 0}</div>
                        <div className="text-xs text-purple-600">Produção</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded">
                        <div className="text-lg font-bold text-green-700">{data?.by_status?.completed || 0}</div>
                        <div className="text-xs text-green-600">Finalizados</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="text-lg font-bold text-gray-700">{data?.by_status?.shipped || 0}</div>
                        <div className="text-xs text-gray-600">Enviados</div>
                    </div>
                </div>

                {/* Recent Orders */}
                {data?.recent_orders?.length > 0 && (
                    <div>
                        <div className="text-xs text-gray-500 uppercase font-medium mb-2">Pedidos Recentes</div>
                        <div className="space-y-2">
                            {data.recent_orders.map((order) => (
                                <Link
                                    key={order.id}
                                    href={`/sales/${order.id}`}
                                    className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                                >
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">#{order.id} - {order.client}</div>
                                        <div className="text-xs text-gray-500">
                                            {order.products_count} produtos • {order.created_at}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-medium text-gray-900">{formatCurrency(order.total)}</div>
                                        {getStatusBadge(order.status)}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Weekly Stats */}
                <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{data?.stats?.weekly_completed || 0}</div>
                        <div className="text-xs text-gray-500">Finalizados esta semana</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{data?.stats?.monthly_completed || 0}</div>
                        <div className="text-xs text-gray-500">Finalizados este mês</div>
                    </div>
                </div>
            </div>
            <div className="px-6 py-3 border-t bg-gray-50">
                <Link href="/sales/kanban" className="text-sm text-pink-600 hover:text-pink-800">
                    Ver kanban de produção →
                </Link>
            </div>
        </div>
    );
}
