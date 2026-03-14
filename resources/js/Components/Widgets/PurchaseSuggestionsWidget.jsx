import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';

export default function PurchaseSuggestionsWidget({ initialData = null }) {
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(!initialData);

    useEffect(() => {
        if (!initialData) {
            fetchData();
        }
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('/api/dashboard-widgets/purchase-suggestions');
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error('Failed to fetch purchase suggestions:', error);
        }
        setLoading(false);
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
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
                    <h3 className="text-lg font-medium text-gray-900">Sugestões de Compra</h3>
                    <p className="text-sm text-gray-500">
                        Custo estimado: {formatCurrency(data?.total_estimated_cost)}
                    </p>
                </div>
                {data?.urgent_count > 0 && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                        {data.urgent_count} urgentes
                    </span>
                )}
            </div>
            <div className="p-4 max-h-80 overflow-y-auto">
                {data?.suggestions?.length > 0 ? (
                    <div className="space-y-2">
                        {data.suggestions.map((suggestion) => (
                            <div
                                key={suggestion.material_id}
                                className={`p-3 rounded-lg border ${
                                    suggestion.urgency === 'urgent'
                                        ? 'bg-red-50 border-red-200'
                                        : 'bg-gray-50 border-gray-200'
                                }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="font-medium text-sm text-gray-900">{suggestion.name}</div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            Sugerir: <span className="font-medium">{suggestion.suggested_quantity} {suggestion.unit}</span>
                                            {suggestion.supplier && (
                                                <> • {suggestion.supplier}</>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-medium text-gray-900">
                                            {formatCurrency(suggestion.estimated_cost)}
                                        </div>
                                        {suggestion.days_until_stockout !== null && (
                                            <div className={`text-xs ${
                                                suggestion.days_until_stockout <= 3 ? 'text-red-600' : 'text-gray-500'
                                            }`}>
                                                {suggestion.days_until_stockout} dias de estoque
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <svg className="mx-auto h-8 w-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <p className="mt-2 text-sm">Nenhuma sugestão de compra no momento</p>
                    </div>
                )}
            </div>
            <div className="px-6 py-3 border-t bg-gray-50 flex justify-between">
                <Link href="/admin/purchase-suggestions" className="text-sm text-pink-600 hover:text-pink-800">
                    Ver todas sugestões →
                </Link>
                <Link href="/admin/purchase-orders/create" className="text-sm text-green-600 hover:text-green-800">
                    Criar pedido →
                </Link>
            </div>
        </div>
    );
}
