import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';

export default function ThreadInventoryWidget({ initialData = null }) {
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(!initialData);

    useEffect(() => {
        if (!initialData) {
            fetchData();
        }
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('/api/dashboard-widgets/thread-inventory');
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error('Failed to fetch thread inventory:', error);
        }
        setLoading(false);
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
    };

    const formatMeters = (value) => {
        return new Intl.NumberFormat('pt-BR').format(value || 0);
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="grid grid-cols-2 gap-4">
                    {[1, 2].map(i => (
                        <div key={i} className="h-24 bg-gray-100 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Estoque de Linhas</h3>
                <span className="text-sm text-gray-500">
                    Valor: {formatCurrency(data?.total_value)}
                </span>
            </div>
            <div className="p-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* Standard */}
                    <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                        <div className="text-xs text-emerald-600 uppercase font-medium">Standard (80%)</div>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                            <div>
                                <div className="text-lg font-bold text-emerald-900">{data?.standard?.count || 0}</div>
                                <div className="text-xs text-emerald-600">cores</div>
                            </div>
                            <div>
                                <div className="text-lg font-bold text-emerald-900">{data?.standard?.total_spools || 0}</div>
                                <div className="text-xs text-emerald-600">carretéis</div>
                            </div>
                        </div>
                        {data?.standard?.low_stock > 0 && (
                            <div className="mt-2 text-xs text-red-600">
                                {data.standard.low_stock} com estoque baixo
                            </div>
                        )}
                    </div>

                    {/* Specialty */}
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="text-xs text-purple-600 uppercase font-medium">Specialty (20%)</div>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                            <div>
                                <div className="text-lg font-bold text-purple-900">{data?.specialty?.count || 0}</div>
                                <div className="text-xs text-purple-600">cores</div>
                            </div>
                            <div>
                                <div className="text-lg font-bold text-purple-900">{data?.specialty?.total_spools || 0}</div>
                                <div className="text-xs text-purple-600">carretéis</div>
                            </div>
                        </div>
                        {data?.specialty?.low_stock > 0 && (
                            <div className="mt-2 text-xs text-red-600">
                                {data.specialty.low_stock} com estoque baixo
                            </div>
                        )}
                    </div>
                </div>

                {/* Top Threads */}
                {data?.top_threads?.length > 0 && (
                    <div>
                        <div className="text-xs text-gray-500 uppercase font-medium mb-2">Mais Usadas (Mês)</div>
                        <div className="space-y-2">
                            {data.top_threads.slice(0, 3).map((thread) => (
                                <div key={thread.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                    <div className="flex items-center gap-2">
                                        {thread.hex_code && (
                                            <div
                                                className="w-4 h-4 rounded-full border"
                                                style={{ backgroundColor: thread.hex_code }}
                                            />
                                        )}
                                        <span className="text-sm text-gray-900">{thread.name}</span>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        {formatMeters(thread.total_meters)}m
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="px-6 py-3 border-t bg-gray-50 flex justify-between">
                <Link href="/admin/threads" className="text-sm text-pink-600 hover:text-pink-800">
                    Gerenciar linhas →
                </Link>
                <Link href="/admin/threads/analysis-8020" className="text-sm text-purple-600 hover:text-purple-800">
                    Análise 80/20 →
                </Link>
            </div>
        </div>
    );
}
