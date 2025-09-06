import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth, stats }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gerenciamento de Bordados</h2>}
        >
            <Head title="Gerenciamento de Bordados" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="text-lg font-semibold text-gray-900">Fontes</div>
                            <div className="text-3xl font-bold text-blue-600">
                                {stats?.total_fonts || 0}
                            </div>
                            <div className="text-sm text-gray-600">
                                {stats?.active_fonts || 0} ativas
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="text-lg font-semibold text-gray-900">Cores</div>
                            <div className="text-3xl font-bold text-green-600">
                                {stats?.total_colors || 0}
                            </div>
                            <div className="text-sm text-gray-600">
                                {stats?.active_colors || 0} ativas
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="text-lg font-semibold text-gray-900">Posições</div>
                            <div className="text-3xl font-bold text-purple-600">
                                {stats?.total_positions || 0}
                            </div>
                            <div className="text-sm text-gray-600">
                                {stats?.active_positions || 0} ativas
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="text-lg font-semibold text-gray-900">Designs</div>
                            <div className="text-3xl font-bold text-indigo-600">
                                {stats?.total_designs || 0}
                            </div>
                            <div className="text-sm text-gray-600">
                                {stats?.active_designs || 0} ativos
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="text-lg font-semibold text-gray-900">Produtos</div>
                            <div className="text-3xl font-bold text-orange-600">
                                {stats?.embroidery_enabled_products || 0}
                            </div>
                            <div className="text-sm text-gray-600">
                                com bordado habilitado
                            </div>
                        </div>
                    </div>

                    {/* Management Links */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <Link
                            href={route('admin.embroidery.fonts.index')}
                            className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900">Gerenciar Fontes</div>
                                    <div className="text-sm text-gray-600">Adicionar e editar fontes de bordado</div>
                                </div>
                            </div>
                        </Link>

                        <Link
                            href={route('admin.embroidery.colors.index')}
                            className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900">Gerenciar Cores</div>
                                    <div className="text-sm text-gray-600">Adicionar e editar cores de bordado</div>
                                </div>
                            </div>
                        </Link>

                        <Link
                            href={route('admin.embroidery.positions.index')}
                            className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900">Gerenciar Posições</div>
                                    <div className="text-sm text-gray-600">Adicionar e editar posições de bordado</div>
                                </div>
                            </div>
                        </Link>

                        <Link
                            href={route('admin.embroidery.designs.index')}
                            className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900">Gerenciar Designs</div>
                                    <div className="text-sm text-gray-600">Adicionar e editar designs decorativos</div>
                                </div>
                            </div>
                        </Link>

                        <Link
                            href={route('admin.products.index')}
                            className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900">Gerenciar Produtos</div>
                                    <div className="text-sm text-gray-600">Adicionar e editar produtos</div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}