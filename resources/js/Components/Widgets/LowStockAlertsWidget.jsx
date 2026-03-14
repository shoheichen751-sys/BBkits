import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';

export default function LowStockAlertsWidget({ initialData = null }) {
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(!initialData);

    useEffect(() => {
        if (!initialData) {
            fetchData();
        }
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('/api/dashboard-widgets/low-stock-alerts');
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error('Failed to fetch low stock alerts:', error);
        }
        setLoading(false);
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'critical': return 'bg-red-100 border-red-300 text-red-800';
            case 'high': return 'bg-orange-100 border-orange-300 text-orange-800';
            default: return 'bg-yellow-100 border-yellow-300 text-yellow-800';
        }
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
                <div>
                    <h3 className="text-lg font-medium text-gray-900">Alertas de Estoque Baixo</h3>
                    <p className="text-sm text-gray-500">
                        {data?.total_count || 0} itens abaixo do ponto de reposição
                    </p>
                </div>
                {data?.critical_count > 0 && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                        {data.critical_count} críticos
                    </span>
                )}
            </div>
            <div className="p-4 max-h-80 overflow-y-auto">
                {data?.alerts?.length > 0 ? (
                    <div className="space-y-2">
                        {data.alerts.map((alert) => (
                            <div
                                key={`${alert.type}-${alert.id}`}
                                className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="font-medium text-sm">{alert.name}</div>
                                        <div className="text-xs mt-1">
                                            Estoque: {alert.current_stock} {alert.unit} | Mínimo: {alert.reorder_point} {alert.unit}
                                        </div>
                                    </div>
                                    <span className={`text-xs px-2 py-0.5 rounded ${
                                        alert.type === 'thread' ? 'bg-purple-200 text-purple-800' : 'bg-blue-200 text-blue-800'
                                    }`}>
                                        {alert.type === 'thread' ? 'Linha' : 'Material'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <svg className="mx-auto h-8 w-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <p className="mt-2 text-sm">Todos os itens com estoque adequado</p>
                    </div>
                )}
            </div>
            <div className="px-6 py-3 border-t bg-gray-50">
                <Link href="/admin/purchase-suggestions" className="text-sm text-pink-600 hover:text-pink-800">
                    Ver sugestões de compra →
                </Link>
            </div>
        </div>
    );
}
