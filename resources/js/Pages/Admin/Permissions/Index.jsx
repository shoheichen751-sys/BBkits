import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    CheckCircleIcon,
    XCircleIcon,
    UserIcon,
    ShieldCheckIcon,
    CubeIcon,
    TruckIcon,
    ArchiveBoxIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon,
    PlusIcon,
    Cog6ToothIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    Squares2X2Icon,
    TableCellsIcon
} from '@heroicons/react/24/outline';

export default function Index({ permissionMatrix, roleDefinitions, permissionDescriptions }) {
    const { auth } = usePage().props;
    const [selectedRole, setSelectedRole] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('');
    const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'

    const getPermissionIcon = (hasPermission, size = 'w-5 h-5') => {
        return hasPermission ? (
            <CheckCircleIcon className={`${size} text-green-500`} />
        ) : (
            <XCircleIcon className={`${size} text-red-500`} />
        );
    };

    const getPermissionBadge = (hasPermission) => {
        return hasPermission
            ? 'bg-green-50 text-green-700 border-green-200'
            : 'bg-red-50 text-red-700 border-red-200';
    };

    const handleRoleChange = (e) => {
        const role = e.target.value;
        setSelectedRole(role);

        if (role) {
            fetch(`/admin/permissions/role/${role}`)
                .then(response => response.json())
                .then(data => {
                    console.log('Role permissions:', data);
                })
                .catch(error => {
                    console.error('Error fetching role permissions:', error);
                });
        }
    };

    // Filter users based on search and role filter
    const filteredUsers = permissionMatrix.filter(userMatrix => {
        const matchesSearch = userMatrix.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            userMatrix.user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = !filterRole || userMatrix.user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const getRoleIcon = (role) => {
        switch (role) {
            case 'admin': return <ShieldCheckIcon className="w-5 h-5 text-purple-500" />;
            case 'manager': return <UserIcon className="w-5 h-5 text-blue-500" />;
            case 'production_admin': return <CubeIcon className="w-5 h-5 text-green-500" />;
            case 'finance_admin': return <ArchiveBoxIcon className="w-5 h-5 text-yellow-500" />;
            default: return <UserIcon className="w-5 h-5 text-gray-500" />;
        }
    };

    const getPermissionTypeIcon = (type) => {
        switch (type) {
            case 'view': return <EyeIcon className="w-4 h-4" />;
            case 'edit': return <PencilIcon className="w-4 h-4" />;
            case 'create': return <PlusIcon className="w-4 h-4" />;
            case 'delete': return <TrashIcon className="w-4 h-4" />;
            case 'manage': return <Cog6ToothIcon className="w-4 h-4" />;
            case 'adjust': return <ArchiveBoxIcon className="w-4 h-4" />;
            case 'bulk': return <Squares2X2Icon className="w-4 h-4" />;
            default: return <EyeIcon className="w-4 h-4" />;
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <ShieldCheckIcon className="w-8 h-8 text-purple-600" />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Gerenciamento de Permissões</h2>
                            <p className="mt-1 text-sm text-gray-600">Visualizar e gerenciar permissões de usuários por função</p>
                        </div>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => setViewMode(viewMode === 'cards' ? 'table' : 'cards')}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                        >
                            {viewMode === 'cards' ? (
                                <>
                                    <TableCellsIcon className="w-4 h-4 mr-2" />
                                    Tabela
                                </>
                            ) : (
                                <>
                                    <Squares2X2Icon className="w-4 h-4 mr-2" />
                                    Cards
                                </>
                            )}
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Gerenciamento de Permissões" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Search and Filter Controls */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 flex-1">
                                <div className="relative flex-1 max-w-md">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Buscar por nome ou email..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                    />
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FunnelIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <select
                                        value={filterRole}
                                        onChange={(e) => setFilterRole(e.target.value)}
                                        className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                    >
                                        <option value="">Todas as funções</option>
                                        {Object.entries(roleDefinitions).map(([roleKey, role]) => (
                                            <option key={roleKey} value={roleKey}>{role.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="text-sm text-gray-500">
                                {filteredUsers.length} usuário(s) encontrado(s)
                            </div>
                        </div>
                    </div>

                    {/* Role Definitions */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center space-x-3">
                                <UserIcon className="w-6 h-6 text-gray-600" />
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Definições de Funções</h3>
                                    <p className="mt-1 text-sm text-gray-600">Descrição das funções disponíveis no sistema</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Object.entries(roleDefinitions).map(([roleKey, role]) => (
                                    <div key={roleKey} className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                                        <div className="flex items-center space-x-3 mb-4">
                                            {getRoleIcon(roleKey)}
                                            <h4 className="font-semibold text-gray-900">{role.name}</h4>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-4">{role.description}</p>
                                        <div className="space-y-3">
                                            <div>
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <CubeIcon className="w-4 h-4 text-blue-500" />
                                                    <span className="text-xs font-medium text-gray-700">Materiais</span>
                                                </div>
                                                <div className="flex flex-wrap gap-1">
                                                    {role.materials.map(permission => (
                                                        <span key={permission} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                                            {getPermissionTypeIcon(permission)}
                                                            <span className="ml-1">{permission}</span>
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <TruckIcon className="w-4 h-4 text-green-500" />
                                                    <span className="text-xs font-medium text-gray-700">Fornecedores</span>
                                                </div>
                                                <div className="flex flex-wrap gap-1">
                                                    {role.suppliers.map(permission => (
                                                        <span key={permission} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                                            {getPermissionTypeIcon(permission)}
                                                            <span className="ml-1">{permission}</span>
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <ArchiveBoxIcon className="w-4 h-4 text-purple-500" />
                                                    <span className="text-xs font-medium text-gray-700">Inventário</span>
                                                </div>
                                                <div className="flex flex-wrap gap-1">
                                                    {role.inventory.map(permission => (
                                                        <span key={permission} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                                                            {getPermissionTypeIcon(permission)}
                                                            <span className="ml-1">{permission}</span>
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Permission Descriptions */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center space-x-3">
                                <Cog6ToothIcon className="w-6 h-6 text-gray-600" />
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Descrição das Permissões</h3>
                                    <p className="mt-1 text-sm text-gray-600">O que cada permissão permite fazer no sistema</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {Object.entries(permissionDescriptions).map(([category, permissions]) => {
                                    const categoryIcon = category === 'materials' ? <CubeIcon className="w-5 h-5 text-blue-500" /> :
                                                        category === 'suppliers' ? <TruckIcon className="w-5 h-5 text-green-500" /> :
                                                        <ArchiveBoxIcon className="w-5 h-5 text-purple-500" />;
                                    return (
                                        <div key={category} className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-5 space-y-4">
                                            <div className="flex items-center space-x-3">
                                                {categoryIcon}
                                                <h4 className="font-semibold text-gray-900 capitalize">{category}</h4>
                                            </div>
                                            <div className="space-y-3">
                                                {Object.entries(permissions).map(([permission, description]) => (
                                                    <div key={permission} className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-sm transition-shadow">
                                                        <div className="flex items-center space-x-2 mb-1">
                                                            {getPermissionTypeIcon(permission)}
                                                            <div className="text-sm font-medium text-gray-900">{permission}</div>
                                                        </div>
                                                        <div className="text-xs text-gray-600 ml-6">{description}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* User Permission Matrix */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <UserIcon className="w-6 h-6 text-gray-600" />
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">Matriz de Permissões por Usuário</h3>
                                        <p className="mt-1 text-sm text-gray-600">Visualização das permissões de cada usuário no sistema</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {viewMode === 'table' ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <div className="flex items-center space-x-2">
                                                    <UserIcon className="w-4 h-4" />
                                                    <span>Usuário</span>
                                                </div>
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Função
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan="4">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <CubeIcon className="w-4 h-4" />
                                                    <span>Materiais</span>
                                                </div>
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan="4">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <TruckIcon className="w-4 h-4" />
                                                    <span>Fornecedores</span>
                                                </div>
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan="5">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <ArchiveBoxIcon className="w-4 h-4" />
                                                    <span>Inventário</span>
                                                </div>
                                            </th>
                                        </tr>
                                        <tr className="bg-gray-50">
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th className="px-2 py-2 text-xs font-medium text-gray-500"><EyeIcon className="w-4 h-4 mx-auto" /></th>
                                            <th className="px-2 py-2 text-xs font-medium text-gray-500"><PencilIcon className="w-4 h-4 mx-auto" /></th>
                                            <th className="px-2 py-2 text-xs font-medium text-gray-500"><Cog6ToothIcon className="w-4 h-4 mx-auto" /></th>
                                            <th className="px-2 py-2 text-xs font-medium text-gray-500"><TrashIcon className="w-4 h-4 mx-auto" /></th>
                                            <th className="px-2 py-2 text-xs font-medium text-gray-500"><EyeIcon className="w-4 h-4 mx-auto" /></th>
                                            <th className="px-2 py-2 text-xs font-medium text-gray-500"><PencilIcon className="w-4 h-4 mx-auto" /></th>
                                            <th className="px-2 py-2 text-xs font-medium text-gray-500"><Cog6ToothIcon className="w-4 h-4 mx-auto" /></th>
                                            <th className="px-2 py-2 text-xs font-medium text-gray-500"><TrashIcon className="w-4 h-4 mx-auto" /></th>
                                            <th className="px-2 py-2 text-xs font-medium text-gray-500"><EyeIcon className="w-4 h-4 mx-auto" /></th>
                                            <th className="px-2 py-2 text-xs font-medium text-gray-500"><PlusIcon className="w-4 h-4 mx-auto" /></th>
                                            <th className="px-2 py-2 text-xs font-medium text-gray-500"><ArchiveBoxIcon className="w-4 h-4 mx-auto" /></th>
                                            <th className="px-2 py-2 text-xs font-medium text-gray-500"><Squares2X2Icon className="w-4 h-4 mx-auto" /></th>
                                            <th className="px-2 py-2 text-xs font-medium text-gray-500"><Cog6ToothIcon className="w-4 h-4 mx-auto" /></th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredUsers.map((userMatrix) => (
                                            <tr key={userMatrix.user.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center">
                                                            <span className="text-xs font-medium text-white">
                                                                {userMatrix.user.name.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div className="ml-3">
                                                            <div className="text-sm font-medium text-gray-900">{userMatrix.user.name}</div>
                                                            <div className="text-sm text-gray-500">{userMatrix.user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <div className="flex items-center justify-center space-x-2">
                                                        {getRoleIcon(userMatrix.user.role)}
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            {roleDefinitions[userMatrix.user.role]?.name || userMatrix.user.role}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        userMatrix.user.approved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {userMatrix.user.approved ? 'Aprovado' : 'Pendente'}
                                                    </span>
                                                </td>

                                            {/* Materials permissions */}
                                            <td className="px-2 py-4 text-center">
                                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getPermissionBadge(userMatrix.materials.view)}`}>
                                                    {getPermissionIcon(userMatrix.materials.view)}
                                                </span>
                                            </td>
                                            <td className="px-2 py-4 text-center">
                                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getPermissionBadge(userMatrix.materials.edit)}`}>
                                                    {getPermissionIcon(userMatrix.materials.edit)}
                                                </span>
                                            </td>
                                            <td className="px-2 py-4 text-center">
                                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getPermissionBadge(userMatrix.materials.manage)}`}>
                                                    {getPermissionIcon(userMatrix.materials.manage)}
                                                </span>
                                            </td>
                                            <td className="px-2 py-4 text-center">
                                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getPermissionBadge(userMatrix.materials.delete)}`}>
                                                    {getPermissionIcon(userMatrix.materials.delete)}
                                                </span>
                                            </td>

                                            {/* Suppliers permissions */}
                                            <td className="px-2 py-4 text-center">
                                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getPermissionBadge(userMatrix.suppliers.view)}`}>
                                                    {getPermissionIcon(userMatrix.suppliers.view)}
                                                </span>
                                            </td>
                                            <td className="px-2 py-4 text-center">
                                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getPermissionBadge(userMatrix.suppliers.edit)}`}>
                                                    {getPermissionIcon(userMatrix.suppliers.edit)}
                                                </span>
                                            </td>
                                            <td className="px-2 py-4 text-center">
                                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getPermissionBadge(userMatrix.suppliers.manage)}`}>
                                                    {getPermissionIcon(userMatrix.suppliers.manage)}
                                                </span>
                                            </td>
                                            <td className="px-2 py-4 text-center">
                                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getPermissionBadge(userMatrix.suppliers.delete)}`}>
                                                    {getPermissionIcon(userMatrix.suppliers.delete)}
                                                </span>
                                            </td>

                                            {/* Inventory permissions */}
                                            <td className="px-2 py-4 text-center">
                                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getPermissionBadge(userMatrix.inventory.view)}`}>
                                                    {getPermissionIcon(userMatrix.inventory.view)}
                                                </span>
                                            </td>
                                            <td className="px-2 py-4 text-center">
                                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getPermissionBadge(userMatrix.inventory.create)}`}>
                                                    {getPermissionIcon(userMatrix.inventory.create)}
                                                </span>
                                            </td>
                                            <td className="px-2 py-4 text-center">
                                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getPermissionBadge(userMatrix.inventory.adjust)}`}>
                                                    {getPermissionIcon(userMatrix.inventory.adjust)}
                                                </span>
                                            </td>
                                            <td className="px-2 py-4 text-center">
                                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getPermissionBadge(userMatrix.inventory.bulk)}`}>
                                                    {getPermissionIcon(userMatrix.inventory.bulk)}
                                                </span>
                                            </td>
                                            <td className="px-2 py-4 text-center">
                                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getPermissionBadge(userMatrix.inventory.manage)}`}>
                                                    {getPermissionIcon(userMatrix.inventory.manage)}
                                                </span>
                                            </td>
                                        </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredUsers.map((userMatrix) => (
                                        <div key={userMatrix.user.id} className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                                            <div className="flex items-center space-x-3 mb-4">
                                                <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                                                    <span className="text-sm font-medium text-white">
                                                        {userMatrix.user.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-sm font-medium text-gray-900">{userMatrix.user.name}</div>
                                                    <div className="text-xs text-gray-500">{userMatrix.user.email}</div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center space-x-2">
                                                    {getRoleIcon(userMatrix.user.role)}
                                                    <span className="text-sm font-medium text-gray-700">
                                                        {roleDefinitions[userMatrix.user.role]?.name || userMatrix.user.role}
                                                    </span>
                                                </div>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    userMatrix.user.approved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {userMatrix.user.approved ? 'Aprovado' : 'Pendente'}
                                                </span>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="border border-blue-200 rounded-lg p-3">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <CubeIcon className="w-4 h-4 text-blue-500" />
                                                        <span className="text-xs font-medium text-gray-700">Materiais</span>
                                                    </div>
                                                    <div className="grid grid-cols-4 gap-2">
                                                        <div className="text-center">
                                                            {getPermissionIcon(userMatrix.materials.view, 'w-4 h-4')}
                                                            <div className="text-xs text-gray-500 mt-1">Ver</div>
                                                        </div>
                                                        <div className="text-center">
                                                            {getPermissionIcon(userMatrix.materials.edit, 'w-4 h-4')}
                                                            <div className="text-xs text-gray-500 mt-1">Editar</div>
                                                        </div>
                                                        <div className="text-center">
                                                            {getPermissionIcon(userMatrix.materials.manage, 'w-4 h-4')}
                                                            <div className="text-xs text-gray-500 mt-1">Gerenciar</div>
                                                        </div>
                                                        <div className="text-center">
                                                            {getPermissionIcon(userMatrix.materials.delete, 'w-4 h-4')}
                                                            <div className="text-xs text-gray-500 mt-1">Deletar</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="border border-green-200 rounded-lg p-3">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <TruckIcon className="w-4 h-4 text-green-500" />
                                                        <span className="text-xs font-medium text-gray-700">Fornecedores</span>
                                                    </div>
                                                    <div className="grid grid-cols-4 gap-2">
                                                        <div className="text-center">
                                                            {getPermissionIcon(userMatrix.suppliers.view, 'w-4 h-4')}
                                                            <div className="text-xs text-gray-500 mt-1">Ver</div>
                                                        </div>
                                                        <div className="text-center">
                                                            {getPermissionIcon(userMatrix.suppliers.edit, 'w-4 h-4')}
                                                            <div className="text-xs text-gray-500 mt-1">Editar</div>
                                                        </div>
                                                        <div className="text-center">
                                                            {getPermissionIcon(userMatrix.suppliers.manage, 'w-4 h-4')}
                                                            <div className="text-xs text-gray-500 mt-1">Gerenciar</div>
                                                        </div>
                                                        <div className="text-center">
                                                            {getPermissionIcon(userMatrix.suppliers.delete, 'w-4 h-4')}
                                                            <div className="text-xs text-gray-500 mt-1">Deletar</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="border border-purple-200 rounded-lg p-3">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <ArchiveBoxIcon className="w-4 h-4 text-purple-500" />
                                                        <span className="text-xs font-medium text-gray-700">Inventário</span>
                                                    </div>
                                                    <div className="grid grid-cols-5 gap-1">
                                                        <div className="text-center">
                                                            {getPermissionIcon(userMatrix.inventory.view, 'w-4 h-4')}
                                                            <div className="text-xs text-gray-500 mt-1">Ver</div>
                                                        </div>
                                                        <div className="text-center">
                                                            {getPermissionIcon(userMatrix.inventory.create, 'w-4 h-4')}
                                                            <div className="text-xs text-gray-500 mt-1">Criar</div>
                                                        </div>
                                                        <div className="text-center">
                                                            {getPermissionIcon(userMatrix.inventory.adjust, 'w-4 h-4')}
                                                            <div className="text-xs text-gray-500 mt-1">Ajustar</div>
                                                        </div>
                                                        <div className="text-center">
                                                            {getPermissionIcon(userMatrix.inventory.bulk, 'w-4 h-4')}
                                                            <div className="text-xs text-gray-500 mt-1">Lote</div>
                                                        </div>
                                                        <div className="text-center">
                                                            {getPermissionIcon(userMatrix.inventory.manage, 'w-4 h-4')}
                                                            <div className="text-xs text-gray-500 mt-1">Gerenciar</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Role Permission Simulator */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center space-x-3">
                                <Cog6ToothIcon className="w-6 h-6 text-gray-600" />
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Simulador de Permissões por Função</h3>
                                    <p className="mt-1 text-sm text-gray-600">Visualize as permissões de uma função específica</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">Selecionar Função</label>
                                <div className="relative">
                                    <select
                                        value={selectedRole}
                                        onChange={handleRoleChange}
                                        className="w-full md:w-1/3 pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:border-purple-500 focus:ring-purple-500 bg-white text-sm"
                                    >
                                        <option value="">Selecione uma função...</option>
                                        {Object.entries(roleDefinitions).map(([roleKey, role]) => (
                                            <option key={roleKey} value={roleKey}>{role.name}</option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <UserIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                </div>
                            </div>

                            {selectedRole && roleDefinitions[selectedRole] && (
                                <div className="mt-6">
                                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 mb-6">
                                        <div className="flex items-center space-x-3">
                                            {getRoleIcon(selectedRole)}
                                            <div>
                                                <h4 className="text-lg font-semibold text-gray-900">{roleDefinitions[selectedRole].name}</h4>
                                                <p className="text-sm text-gray-600">{roleDefinitions[selectedRole].description}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-xl p-6">
                                            <div className="flex items-center space-x-3 mb-4">
                                                <CubeIcon className="w-6 h-6 text-blue-500" />
                                                <h4 className="font-semibold text-gray-900">Materiais</h4>
                                            </div>
                                            <div className="space-y-3">
                                                {Object.entries(permissionDescriptions.materials).map(([permission, description]) => {
                                                    const hasPermission = roleDefinitions[selectedRole].materials.includes(permission);
                                                    return (
                                                        <div key={permission} className={`flex items-start space-x-3 p-3 rounded-lg border transition-all ${
                                                            hasPermission
                                                                ? 'bg-green-50 border-green-200 hover:bg-green-100'
                                                                : 'bg-red-50 border-red-200 hover:bg-red-100'
                                                        }`}>
                                                            <div className="flex-shrink-0 mt-0.5">
                                                                {getPermissionIcon(hasPermission, 'w-5 h-5')}
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex items-center space-x-2">
                                                                    {getPermissionTypeIcon(permission)}
                                                                    <div className="text-sm font-medium text-gray-900">{permission}</div>
                                                                </div>
                                                                <div className="text-xs text-gray-600 mt-1">{description}</div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-xl p-6">
                                            <div className="flex items-center space-x-3 mb-4">
                                                <TruckIcon className="w-6 h-6 text-green-500" />
                                                <h4 className="font-semibold text-gray-900">Fornecedores</h4>
                                            </div>
                                            <div className="space-y-3">
                                                {Object.entries(permissionDescriptions.suppliers).map(([permission, description]) => {
                                                    const hasPermission = roleDefinitions[selectedRole].suppliers.includes(permission);
                                                    return (
                                                        <div key={permission} className={`flex items-start space-x-3 p-3 rounded-lg border transition-all ${
                                                            hasPermission
                                                                ? 'bg-green-50 border-green-200 hover:bg-green-100'
                                                                : 'bg-red-50 border-red-200 hover:bg-red-100'
                                                        }`}>
                                                            <div className="flex-shrink-0 mt-0.5">
                                                                {getPermissionIcon(hasPermission, 'w-5 h-5')}
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex items-center space-x-2">
                                                                    {getPermissionTypeIcon(permission)}
                                                                    <div className="text-sm font-medium text-gray-900">{permission}</div>
                                                                </div>
                                                                <div className="text-xs text-gray-600 mt-1">{description}</div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-200 rounded-xl p-6">
                                            <div className="flex items-center space-x-3 mb-4">
                                                <ArchiveBoxIcon className="w-6 h-6 text-purple-500" />
                                                <h4 className="font-semibold text-gray-900">Inventário</h4>
                                            </div>
                                            <div className="space-y-3">
                                                {Object.entries(permissionDescriptions.inventory).map(([permission, description]) => {
                                                    const hasPermission = roleDefinitions[selectedRole].inventory.includes(permission);
                                                    return (
                                                        <div key={permission} className={`flex items-start space-x-3 p-3 rounded-lg border transition-all ${
                                                            hasPermission
                                                                ? 'bg-green-50 border-green-200 hover:bg-green-100'
                                                                : 'bg-red-50 border-red-200 hover:bg-red-100'
                                                        }`}>
                                                            <div className="flex-shrink-0 mt-0.5">
                                                                {getPermissionIcon(hasPermission, 'w-5 h-5')}
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex items-center space-x-2">
                                                                    {getPermissionTypeIcon(permission)}
                                                                    <div className="text-sm font-medium text-gray-900">{permission}</div>
                                                                </div>
                                                                <div className="text-xs text-gray-600 mt-1">{description}</div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}