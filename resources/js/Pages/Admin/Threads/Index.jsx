import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ threads, filters, summary }) {
    const [search, setSearch] = useState(filters.search || '');
    const [type, setType] = useState(filters.type || '');
    const [status, setStatus] = useState(filters.status || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/threads', { search, type, status }, { preserveState: true });
    };

    const getStockStatusBadge = (status) => {
        const badges = {
            'in_stock': 'bg-green-100 text-green-800',
            'low_stock': 'bg-yellow-100 text-yellow-800',
            'out_of_stock': 'bg-red-100 text-red-800',
        };
        const labels = {
            'in_stock': 'Em Estoque',
            'low_stock': 'Baixo',
            'out_of_stock': 'Esgotado',
        };
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badges[status]}`}>
                {labels[status]}
            </span>
        );
    };

    const getTypeBadge = (threadType) => {
        if (threadType === 'standard') {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    Standard
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Specialty
            </span>
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Linhas de Bordado</h2>
                        <p className="mt-1 text-sm text-gray-600">Gerencie o estoque de linhas para bordado</p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href="/admin/threads/analysis-8020"
                            className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg transition-colors"
                        >
                            Análise 80/20
                        </Link>
                        <Link
                            href="/admin/threads/usage"
                            className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg transition-colors"
                        >
                            Relatório de Uso
                        </Link>
                        <Link
                            href="/admin/threads/create"
                            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Nova Linha
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Linhas de Bordado" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="text-xs text-gray-500 uppercase">Total Linhas</div>
                            <div className="text-2xl font-bold text-gray-900">{summary.total_threads}</div>
                        </div>
                        <div className="bg-emerald-50 rounded-lg shadow p-4 border border-emerald-200">
                            <div className="text-xs text-emerald-600 uppercase">Standard</div>
                            <div className="text-2xl font-bold text-emerald-700">{summary.standard_count}</div>
                        </div>
                        <div className="bg-purple-50 rounded-lg shadow p-4 border border-purple-200">
                            <div className="text-xs text-purple-600 uppercase">Specialty</div>
                            <div className="text-2xl font-bold text-purple-700">{summary.specialty_count}</div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="text-xs text-gray-500 uppercase">Carretéis</div>
                            <div className="text-2xl font-bold text-gray-900">{summary.total_spools}</div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="text-xs text-gray-500 uppercase">Metros Disp.</div>
                            <div className="text-2xl font-bold text-gray-900">
                                {new Intl.NumberFormat('pt-BR').format(summary.total_meters)}m
                            </div>
                        </div>
                        <div className="bg-yellow-50 rounded-lg shadow p-4 border border-yellow-200">
                            <div className="text-xs text-yellow-600 uppercase">Estoque Baixo</div>
                            <div className="text-2xl font-bold text-yellow-700">{summary.low_stock_count}</div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white shadow rounded-lg mb-6">
                        <form onSubmit={handleSearch} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Buscar por nome ou código..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                                    />
                                </div>
                                <div>
                                    <select
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                                    >
                                        <option value="">Todos os tipos</option>
                                        <option value="standard">Standard (80%)</option>
                                        <option value="specialty">Specialty (20%)</option>
                                    </select>
                                </div>
                                <div>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                                    >
                                        <option value="">Todos os status</option>
                                        <option value="active">Ativas</option>
                                        <option value="low_stock">Estoque Baixo</option>
                                    </select>
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        className="w-full bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition-colors"
                                    >
                                        Filtrar
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Threads Table */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Linha
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tipo
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Material
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Carretéis
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Metros
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Preço
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {threads.data.map((thread) => (
                                    <tr key={thread.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {thread.hex_code && (
                                                    <div
                                                        className="w-8 h-8 rounded-full mr-3 border-2 border-gray-200"
                                                        style={{ backgroundColor: thread.hex_code }}
                                                    />
                                                )}
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{thread.name}</div>
                                                    <div className="text-xs text-gray-500">
                                                        {thread.color_code}
                                                        {thread.brand && ` • ${thread.brand}`}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getTypeBadge(thread.type)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                                            {thread.material_type}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className="text-sm font-medium text-gray-900">{thread.spool_count}</span>
                                            <span className="text-xs text-gray-500 block">mín: {thread.minimum_spools}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                                            {new Intl.NumberFormat('pt-BR').format(thread.meters_remaining)}m
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                                            R$ {Number(thread.purchase_price).toFixed(2).replace('.', ',')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            {getStockStatusBadge(thread.stock_status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link
                                                href={`/admin/threads/${thread.id}`}
                                                className="text-pink-600 hover:text-pink-900 mr-3"
                                            >
                                                Ver
                                            </Link>
                                            <Link
                                                href={`/admin/threads/${thread.id}/edit`}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                Editar
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {threads.data.length === 0 && (
                            <div className="text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma linha encontrada</h3>
                                <p className="mt-1 text-sm text-gray-500">Comece adicionando uma nova linha de bordado.</p>
                                <div className="mt-6">
                                    <Link
                                        href="/admin/threads/create"
                                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700"
                                    >
                                        Nova Linha
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Pagination */}
                        {threads.links && threads.links.length > 3 && (
                            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Mostrando {threads.from} a {threads.to} de {threads.total} resultados
                                    </div>
                                    <div className="flex gap-1">
                                        {threads.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`px-3 py-1 rounded text-sm ${
                                                    link.active
                                                        ? 'bg-pink-600 text-white'
                                                        : link.url
                                                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                        : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
