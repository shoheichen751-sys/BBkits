import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Dashboard({ stats, recent_approvals }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(amount);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('pt-BR');
    };

    return (
        <>
            <Head title="Dashboard Financeiro" />

            <AuthenticatedLayout
                header={
                    <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold">
                            💰 Dashboard Financeiro
                        </h2>
                        <p className="text-green-100 mt-1">
                            Visão geral das aprovações de pagamento
                        </p>
                    </div>
                }
            >
                <div className="py-12 bg-gray-50 min-h-screen">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                                            <span className="text-yellow-600 text-lg">⏳</span>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Pagamentos Pendentes</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.pending_payments}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                            <span className="text-orange-600 text-lg">🟠</span>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Pagamentos Finais</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.pending_final_payments}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                            <span className="text-green-600 text-lg">✅</span>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Aprovações Recentes</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.recent_approvals_count}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <span className="text-blue-600 text-lg">💎</span>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Valor Total Pendente</p>
                                        <p className="text-lg font-bold text-gray-900">{formatCurrency(stats.total_pending_value)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">🔧 Ações Rápidas - Aprovação de Pagamentos</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Clique nos botões abaixo para ir diretamente à página de aprovações e processar pagamentos pendentes.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    href={route('finance.orders.index', { status: 'pending_payment' })}
                                    className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-2 shadow-md"
                                >
                                    <span>⏳</span>
                                    <div className="flex flex-col items-start">
                                        <span className="font-semibold">Aprovar Pagamentos Iniciais</span>
                                        <span className="text-xs text-yellow-100">({stats.pending_payments} pendentes)</span>
                                    </div>
                                </Link>
                                <Link
                                    href={route('finance.orders.index', { status: 'pending_final_payment' })}
                                    className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 shadow-md"
                                >
                                    <span>🟠</span>
                                    <div className="flex flex-col items-start">
                                        <span className="font-semibold">Aprovar Pagamentos Finais</span>
                                        <span className="text-xs text-orange-100">({stats.pending_final_payments} pendentes)</span>
                                    </div>
                                </Link>
                                {(stats.pending_payments > 0 || stats.pending_final_payments > 0) && (
                                    <Link
                                        href={route('finance.orders.index')}
                                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center gap-2 shadow-md"
                                    >
                                        <span>📋</span>
                                        <div className="flex flex-col items-start">
                                            <span className="font-semibold">Ver Todos os Pedidos</span>
                                            <span className="text-xs text-blue-100">Página completa de aprovações</span>
                                        </div>
                                    </Link>
                                )}
                            </div>
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-sm text-blue-800">
                                        <strong>Importante:</strong> Estes botões levam à página de aprovações onde você pode clicar em cada pedido para aprovar/rejeitar pagamentos.
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Approvals */}
                        {recent_approvals && recent_approvals.length > 0 && (
                            <div className="bg-white rounded-lg shadow-md">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900">Aprovações Recentes (7 dias)</h3>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {recent_approvals.map((approval) => (
                                            <div key={approval.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">
                                                                {approval.client_name} - {approval.child_name}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                Vendedora: {approval.user.name}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-gray-900">
                                                        {formatCurrency(approval.total_amount)}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {formatDate(approval.initial_payment_approved_at)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Empty State */}
                        {(!recent_approvals || recent_approvals.length === 0) && (
                            <div className="bg-white rounded-lg shadow-md p-12 text-center">
                                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                                    <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    📋 Nenhuma aprovação recente
                                </h3>
                                <p className="text-gray-500 mb-4">
                                    Quando você aprovar pagamentos, eles aparecerão aqui.
                                </p>
                                <p className="text-sm text-blue-600 font-medium">
                                    💡 Use os botões "Ações Rápidas" acima para começar a aprovar pagamentos pendentes
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}