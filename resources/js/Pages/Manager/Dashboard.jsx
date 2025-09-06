import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function ManagerDashboard({ auth }) {
    return (
        <>
            <Head title="Dashboard Gerente" />

            <AuthenticatedLayout
                user={auth.user}
                header={
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold">
                            🏢 Dashboard Gerencial
                        </h2>
                        <p className="text-indigo-100 mt-1">
                            Gestão de pedidos e operações de produção
                        </p>
                    </div>
                }
            >
                <div className="py-12 bg-gray-50 min-h-screen">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {/* Quick Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            <Link
                                href={route('manager.orders.index')}
                                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow group"
                            >
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                            <span className="text-blue-600 text-xl">📋</span>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Gerenciar Pedidos</h3>
                                        <p className="text-sm text-gray-600">Visualizar e gerenciar todos os pedidos</p>
                                    </div>
                                </div>
                                <div className="mt-4 text-right">
                                    <span className="text-blue-600 text-sm font-medium group-hover:text-blue-700">
                                        Ver Pedidos →
                                    </span>
                                </div>
                            </Link>

                            <Link
                                href={route('manager.orders.index', { status: 'payment_approved' })}
                                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow group"
                            >
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                                            <span className="text-green-600 text-xl">🏭</span>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Enviar à Produção</h3>
                                        <p className="text-sm text-gray-600">Pedidos aprovados para produção</p>
                                    </div>
                                </div>
                                <div className="mt-4 text-right">
                                    <span className="text-green-600 text-sm font-medium group-hover:text-green-700">
                                        Ver Aprovados →
                                    </span>
                                </div>
                            </Link>

                            <Link
                                href={route('manager.orders.index', { status: 'ready_for_shipping' })}
                                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow group"
                            >
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                                            <span className="text-purple-600 text-xl">🖨️</span>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Imprimir Pedidos</h3>
                                        <p className="text-sm text-gray-600">Pedidos prontos para impressão</p>
                                    </div>
                                </div>
                                <div className="mt-4 text-right">
                                    <span className="text-purple-600 text-sm font-medium group-hover:text-purple-700">
                                        Ver Prontos →
                                    </span>
                                </div>
                            </Link>
                        </div>

                        {/* Manager Information Card */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bem-vindo, {auth.user.name}!</h3>
                            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border-l-4 border-indigo-400">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <span className="text-2xl">👨‍💼</span>
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="font-semibold text-gray-800 mb-2">Suas Responsabilidades como Gerente:</h4>
                                        <ul className="text-sm text-gray-700 space-y-1">
                                            <li>• <strong>Visualizar Pedidos:</strong> Acompanhar status de todos os pedidos</li>
                                            <li>• <strong>Imprimir Detalhes:</strong> Gerar comprovantes e detalhes para a equipe</li>
                                            <li>• <strong>Enviar à Produção:</strong> Autorizar início da produção de pedidos aprovados</li>
                                            <li>• <strong>Coordenar Equipe:</strong> Facilitar comunicação entre vendas e produção</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Acesso Rápido</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Link
                                    href={route('manager.orders.index', { status: 'pending_payment' })}
                                    className="text-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
                                >
                                    <div className="text-2xl mb-2">⏳</div>
                                    <div className="text-sm font-medium text-gray-700">Aguardando Pagamento</div>
                                </Link>

                                <Link
                                    href={route('manager.orders.index', { status: 'in_production' })}
                                    className="text-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                    <div className="text-2xl mb-2">🏭</div>
                                    <div className="text-sm font-medium text-gray-700">Em Produção</div>
                                </Link>

                                <Link
                                    href={route('manager.orders.index', { status: 'photo_sent' })}
                                    className="text-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                                >
                                    <div className="text-2xl mb-2">📸</div>
                                    <div className="text-sm font-medium text-gray-700">Foto Enviada</div>
                                </Link>

                                <Link
                                    href={route('manager.orders.index', { status: 'shipped' })}
                                    className="text-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                                >
                                    <div className="text-2xl mb-2">🚚</div>
                                    <div className="text-sm font-medium text-gray-700">Enviados</div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}