import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Dashboard({ stats, recent_orders }) {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('pt-BR');
    };

    const getStatusBadge = (status) => {
        const badges = {
            payment_approved: 'bg-green-100 text-green-800',
            in_production: 'bg-blue-100 text-blue-800',
            photo_sent: 'bg-purple-100 text-purple-800',
            ready_for_shipping: 'bg-teal-100 text-teal-800'
        };
        
        const labels = {
            payment_approved: '✅ Pronto para Produção',
            in_production: '🏭 Em Produção',
            photo_sent: '📸 Foto Enviada',
            ready_for_shipping: '📦 Pronto para Envio'
        };

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status]}`}>
                {labels[status]}
            </span>
        );
    };

    return (
        <>
            <Head title="Dashboard Produção" />

            <AuthenticatedLayout
                header={
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold">
                            🏭 Dashboard Produção
                        </h2>
                        <p className="text-blue-100 mt-1">
                            Visão geral do processo de produção e envio
                        </p>
                    </div>
                }
            >
                <div className="py-12 bg-gray-50 min-h-screen">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                            <span className="text-green-600 text-lg">✅</span>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Pronto p/ Produção</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.payment_approved}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <span className="text-blue-600 text-lg">🏭</span>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Em Produção</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.in_production}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <span className="text-purple-600 text-lg">📸</span>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Foto Enviada</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.photo_sent}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                                            <span className="text-teal-600 text-lg">📦</span>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Pronto p/ Envio</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.ready_for_shipping}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                                            <span className="text-indigo-600 text-lg">👤</span>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Minhas Produções</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.my_productions}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    href="/production/orders?status=payment_approved"
                                    className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                                >
                                    <span>✅</span>
                                    Iniciar Produções
                                </Link>
                                <Link
                                    href="/production/orders?status=in_production"
                                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                                >
                                    <span>🏭</span>
                                    Em Produção
                                </Link>
                                <Link
                                    href="/production/orders?status=ready_for_shipping"
                                    className="bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 transition-colors flex items-center gap-2"
                                >
                                    <span>📦</span>
                                    Gerar Envios
                                </Link>
                                <Link
                                    href="/production/orders"
                                    className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
                                >
                                    <span>📋</span>
                                    Ver Todos os Pedidos
                                </Link>
                            </div>
                        </div>

                        {/* Recent Orders */}
                        {recent_orders && recent_orders.length > 0 && (
                            <div className="bg-white rounded-lg shadow-md">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900">Pedidos Recentes</h3>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {recent_orders.map((order) => (
                                            <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">
                                                                {order.client_name} - {order.child_name}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                Vendedora: {order.user.name} • {formatDate(order.created_at)}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                Bordado: {order.embroidery_color} • {order.embroidery_position}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    {getStatusBadge(order.order_status)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Empty State */}
                        {(!recent_orders || recent_orders.length === 0) && (
                            <div className="bg-white rounded-lg shadow-md p-12 text-center">
                                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                                    <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Nenhum pedido na produção
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    Quando houver pedidos para produzir, eles aparecerão aqui.
                                </p>
                                <Link
                                    href="/production/orders"
                                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Ver Pedidos
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}