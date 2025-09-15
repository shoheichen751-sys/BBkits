import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import toast from 'react-hot-toast';

export default function Index({ materials, filters, stats }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    // Permission helpers
    const canEditMaterials = () => {
        return ['admin', 'manager', 'production_admin'].includes(user.role);
    };

    const canManageMaterials = () => {
        return ['admin', 'manager'].includes(user.role);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/materials', { search, status }, { preserveState: true });
    };

    const getStockBadge = (material) => {
        if (material.current_stock <= 0) {
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Sem Estoque</span>;
        } else if (material.is_low_stock) {
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Estoque Baixo</span>;
        }
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Normal</span>;
    };

    const formatPrice = (price) => {
        return 'R$ ' + Number(price).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    };

    const formatStock = (stock, unit) => {
        return Number(stock).toLocaleString('pt-BR', { minimumFractionDigits: 3 }) + ' ' + unit;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Materiais</h2>
                        <p className="mt-1 text-sm text-gray-600">Gerencie materiais e controle de estoque</p>
                    </div>
                    {canEditMaterials() && (
                        <Link
                            href="/admin/materials/create"
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Novo Material
                        </Link>
                    )}
                </div>
            }
        >
            <Head title="Materiais" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">📦</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Total Materiais</dt>
                                            <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">✅</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Ativos</dt>
                                            <dd className="text-lg font-medium text-gray-900">{stats.active}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">⚠️</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Estoque Baixo</dt>
                                            <dd className="text-lg font-medium text-gray-900">{stats.low_stock}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">🚫</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Sem Estoque</dt>
                                            <dd className="text-lg font-medium text-gray-900">{stats.out_of_stock}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white shadow rounded-lg mb-6">
                        <form onSubmit={handleSearch} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Buscar por nome ou referência..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                    />
                                </div>
                                <div>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                    >
                                        <option value="">Todos os status</option>
                                        <option value="active">Ativos</option>
                                        <option value="low_stock">Estoque Baixo</option>
                                        <option value="out_of_stock">Sem Estoque</option>
                                    </select>
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                                    >
                                        Filtrar
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Materials Table */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Material
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estoque
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Preço
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fornecedor
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {materials.data.map((material) => (
                                    <tr key={material.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{material.name}</div>
                                                <div className="text-sm text-gray-500">Ref: {material.reference}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{formatStock(material.current_stock, material.unit)}</div>
                                            <div className="text-sm text-gray-500">Mín: {formatStock(material.minimum_stock, material.unit)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatPrice(material.purchase_price)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {material.supplier?.name || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStockBadge(material)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link
                                                href={`/admin/materials/${material.id}`}
                                                className="text-purple-600 hover:text-purple-900 mr-3"
                                            >
                                                Ver
                                            </Link>
                                            {canEditMaterials() && (
                                                <Link
                                                    href={`/admin/materials/${material.id}/edit`}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    Editar
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {materials.links && (
                            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Mostrando {materials.from} a {materials.to} de {materials.total} resultados
                                    </div>
                                    <div className="flex space-x-1">
                                        {materials.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url}
                                                className={`px-3 py-2 text-sm ${
                                                    link.active
                                                        ? 'bg-purple-500 text-white'
                                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                                } border border-gray-300 rounded`}
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