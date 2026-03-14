import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';

export default function CostTrendsWidget({ initialData = null }) {
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(!initialData);

    useEffect(() => {
        if (!initialData) {
            fetchData();
        }
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('/api/dashboard-widgets/cost-trends');
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error('Failed to fetch cost trends:', error);
        }
        setLoading(false);
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
    };

    const getTrendIcon = (direction) => {
        if (direction === 'up') {
            return <span className="text-red-500 text-lg">↑</span>;
        }
        if (direction === 'down') {
            return <span className="text-green-500 text-lg">↓</span>;
        }
        return <span className="text-gray-500 text-lg">→</span>;
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-32 bg-gray-100 rounded"></div>
            </div>
        );
    }

    // Calculate max value for chart scaling
    const maxCost = data?.daily_data ? Math.max(...data.daily_data.map(d => d.cost), 1) : 1;

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Tendência de Custos</h3>
                <div className="flex items-center gap-1">
                    {getTrendIcon(data?.summary?.trend_direction)}
                    <span className={`text-sm font-medium ${
                        data?.summary?.trend_direction === 'up' ? 'text-red-600' :
                        data?.summary?.trend_direction === 'down' ? 'text-green-600' : 'text-gray-600'
                    }`}>
                        {Math.abs(data?.summary?.trend_percent || 0)}%
                    </span>
                </div>
            </div>
            <div className="p-4">
                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-2 bg-blue-50 rounded">
                        <div className="text-sm font-bold text-blue-700">
                            {formatCurrency(data?.summary?.total_period)}
                        </div>
                        <div className="text-xs text-blue-600">30 dias</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="text-sm font-bold text-gray-700">
                            {formatCurrency(data?.summary?.average_daily)}
                        </div>
                        <div className="text-xs text-gray-600">Média/dia</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded">
                        <div className="text-sm font-bold text-green-700">
                            {formatCurrency(data?.summary?.last_7_days)}
                        </div>
                        <div className="text-xs text-green-600">Últimos 7 dias</div>
                    </div>
                </div>

                {/* Simple Bar Chart */}
                {data?.daily_data && (
                    <div className="h-24 flex items-end gap-px">
                        {data.daily_data.slice(-14).map((day, idx) => (
                            <div
                                key={idx}
                                className="flex-1 bg-pink-500 rounded-t transition-all hover:bg-pink-600"
                                style={{ height: `${(day.cost / maxCost) * 100}%`, minHeight: day.cost > 0 ? '4px' : '0' }}
                                title={`${day.date}: ${formatCurrency(day.cost)}`}
                            />
                        ))}
                    </div>
                )}
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>14 dias atrás</span>
                    <span>Hoje</span>
                </div>
            </div>
            <div className="px-6 py-3 border-t bg-gray-50">
                <Link href="/admin/reports/advanced/consumption-trends" className="text-sm text-pink-600 hover:text-pink-800">
                    Ver relatório detalhado →
                </Link>
            </div>
        </div>
    );
}
