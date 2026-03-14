import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ simulations }) {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value || 0);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadge = (status, canProduce) => {
        if (status === 'archived') {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Arquivada
                </span>
            );
        }
        if (canProduce) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Viável
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Faltam Materiais
            </span>
        );
    };

    const handleArchive = (id) => {
        if (confirm('Arquivar esta simulação?')) {
            router.post(`/admin/batch-simulation/${id}/archive`);
        }
    };

    const handleDelete = (id) => {
        if (confirm('Tem certeza que deseja excluir esta simulação?')) {
            router.delete(`/admin/batch-simulation/${id}`);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Simulador de Produção em Lote</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Simule a produção e verifique disponibilidade de materiais
                        </p>
                    </div>
                    <Link
                        href="/admin/batch-simulation/create"
                        className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        Nova Simulação
                    </Link>
                </div>
            }
        >
            <Head title="Simulador de Produção" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Simulations List */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Simulação
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Produtos
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Unidades
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Custo Total
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
                                {simulations.data.map((sim) => (
                                    <tr key={sim.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{sim.name}</div>
                                                {sim.description && (
                                                    <div className="text-xs text-gray-500 max-w-xs truncate">
                                                        {sim.description}
                                                    </div>
                                                )}
                                                <div className="text-xs text-gray-400 mt-1">
                                                    {formatDate(sim.created_at)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className="text-sm font-medium text-gray-900">
                                                {sim.results?.summary?.total_products || 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className="text-sm font-medium text-gray-900">
                                                {sim.results?.summary?.total_units || 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <span className="text-sm font-medium text-gray-900">
                                                {formatCurrency(sim.results?.summary?.total_cost)}
                                            </span>
                                            {sim.results?.summary?.shortages_count > 0 && (
                                                <div className="text-xs text-red-600">
                                                    {sim.results.summary.shortages_count} faltantes
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            {getStatusBadge(sim.status, sim.results?.summary?.can_produce)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link
                                                href={`/admin/batch-simulation/${sim.id}`}
                                                className="text-pink-600 hover:text-pink-900 mr-3"
                                            >
                                                Ver
                                            </Link>
                                            <a
                                                href={`/admin/batch-simulation/${sim.id}/export-pdf`}
                                                className="text-blue-600 hover:text-blue-900 mr-3"
                                            >
                                                PDF
                                            </a>
                                            <button
                                                onClick={() => handleArchive(sim.id)}
                                                className="text-gray-600 hover:text-gray-900 mr-3"
                                            >
                                                Arquivar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(sim.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {simulations.data.length === 0 && (
                            <div className="text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma simulação</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Crie uma simulação para planejar a produção em lote.
                                </p>
                                <div className="mt-6">
                                    <Link
                                        href="/admin/batch-simulation/create"
                                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700"
                                    >
                                        Nova Simulação
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Pagination */}
                        {simulations.links && simulations.links.length > 3 && (
                            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Mostrando {simulations.from} a {simulations.to} de {simulations.total} resultados
                                    </div>
                                    <div className="flex gap-1">
                                        {simulations.links.map((link, index) => (
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
