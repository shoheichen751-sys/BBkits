import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';

export default function Index({ auth, designs, categories, filters }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingDesign, setEditingDesign] = useState(null);
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || 'all');
    const [status, setStatus] = useState(filters.status || 'all');

    const { data: createData, setData: setCreateData, post, processing: createProcessing, errors: createErrors, reset: resetCreate } = useForm({
        name: '',
        slug: '',
        description: '',
        category: '',
        image_url: '',
        design_file_url: '',
        additional_cost: 0,
        is_active: true,
        sort_order: 0,
        compatible_positions: [],
        compatible_colors: []
    });

    const { data: editData, setData: setEditData, put, processing: editProcessing, errors: editErrors, reset: resetEdit } = useForm({
        name: '',
        slug: '',
        description: '',
        category: '',
        image_url: '',
        design_file_url: '',
        additional_cost: 0,
        is_active: true,
        sort_order: 0,
        compatible_positions: [],
        compatible_colors: []
    });

    const { delete: destroy } = useForm();

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.embroidery.designs.index'), {
            search,
            category,
            status
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleCreate = (e) => {
        e.preventDefault();
        post(route('admin.embroidery.designs.store'), {
            onSuccess: () => {
                setShowCreateModal(false);
                resetCreate();
            }
        });
    };

    const handleEdit = (e) => {
        e.preventDefault();
        if (!editingDesign || !editingDesign.id) return;
        put(route('admin.embroidery.designs.update', editingDesign.id), {
            onSuccess: () => {
                setShowEditModal(false);
                setEditingDesign(null);
                resetEdit();
            }
        });
    };

    const handleDelete = (design) => {
        if (!design || !design.id) return;
        if (confirm(`Tem certeza que deseja excluir o design "${design.name}"?`)) {
            destroy(route('admin.embroidery.designs.destroy', design.id));
        }
    };

    const openEditModal = (design) => {
        setEditingDesign(design);
        setEditData({
            name: design.name,
            slug: design.slug,
            description: design.description || '',
            category: design.category,
            image_url: design.image_url || '',
            design_file_url: design.design_file_url || '',
            additional_cost: design.additional_cost,
            is_active: design.is_active,
            sort_order: design.sort_order,
            compatible_positions: design.compatible_positions || [],
            compatible_colors: design.compatible_colors || []
        });
        setShowEditModal(true);
    };

    const generateSlug = (name) => {
        return name.toLowerCase()
            .replace(/[àáâãäå]/g, 'a')
            .replace(/[èéêë]/g, 'e')
            .replace(/[ìíîï]/g, 'i')
            .replace(/[òóôõö]/g, 'o')
            .replace(/[ùúûü]/g, 'u')
            .replace(/[ç]/g, 'c')
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '-')
            .trim();
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Gerenciar Designs de Bordado
                    </h2>
                    <Link
                        href={route('admin.embroidery.dashboard')}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Voltar ao Dashboard
                    </Link>
                </div>
            }
        >
            <Head title="Gerenciar Designs de Bordado" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold">Designs de Bordado</h3>
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Adicionar Novo Design
                                </button>
                            </div>

                            {/* Filters */}
                            <form onSubmit={handleSearch} className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                                <input
                                    type="text"
                                    placeholder="Buscar designs..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">Todas as Categorias</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">Todos os Status</option>
                                    <option value="active">Ativos</option>
                                    <option value="inactive">Inativos</option>
                                </select>
                                <button
                                    type="submit"
                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Buscar
                                </button>
                            </form>

                            {/* Designs Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {designs.data.map((design) => (
                                    <div key={design.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                        {design.image_url && (
                                            <img
                                                src={design.image_url}
                                                alt={design.name}
                                                className="w-full h-32 object-cover rounded-md mb-3"
                                            />
                                        )}
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-semibold text-lg text-gray-800">{design.name}</h4>
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                design.is_active 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {design.is_active ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">{design.description}</p>
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-sm font-medium text-blue-600">{design.category}</span>
                                            <span className="text-lg font-bold text-green-600">
                                                R$ {parseFloat(design.additional_cost).toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => openEditModal(design)}
                                                className="flex-1 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 text-sm rounded"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(design)}
                                                className="flex-1 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 text-sm rounded"
                                            >
                                                Excluir
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {designs.links && (
                                <div className="mt-6 flex justify-center">
                                    <div className="flex space-x-1">
                                        {designs.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url}
                                                className={`px-3 py-2 text-sm rounded ${
                                                    link.active
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                        <form onSubmit={handleCreate}>
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Adicionar Novo Design</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                                        <input
                                            type="text"
                                            value={createData.name}
                                            onChange={(e) => {
                                                setCreateData('name', e.target.value);
                                                setCreateData('slug', generateSlug(e.target.value));
                                            }}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                        {createErrors.name && <p className="text-red-500 text-xs mt-1">{createErrors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                                        <input
                                            type="text"
                                            value={createData.slug}
                                            onChange={(e) => setCreateData('slug', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                        {createErrors.slug && <p className="text-red-500 text-xs mt-1">{createErrors.slug}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                                        <input
                                            type="text"
                                            value={createData.category}
                                            onChange={(e) => setCreateData('category', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="ex: Animais, Personagens, Brasões"
                                            required
                                        />
                                        {createErrors.category && <p className="text-red-500 text-xs mt-1">{createErrors.category}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Custo Adicional (R$)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={createData.additional_cost}
                                            onChange={(e) => setCreateData('additional_cost', parseFloat(e.target.value) || 0)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                        {createErrors.additional_cost && <p className="text-red-500 text-xs mt-1">{createErrors.additional_cost}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem</label>
                                        <input
                                            type="url"
                                            value={createData.image_url}
                                            onChange={(e) => setCreateData('image_url', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="https://exemplo.com/imagem.jpg"
                                        />
                                        {createErrors.image_url && <p className="text-red-500 text-xs mt-1">{createErrors.image_url}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Ordem</label>
                                        <input
                                            type="number"
                                            value={createData.sort_order}
                                            onChange={(e) => setCreateData('sort_order', parseInt(e.target.value) || 0)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                                    <textarea
                                        value={createData.description}
                                        onChange={(e) => setCreateData('description', e.target.value)}
                                        rows={3}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Descrição do design..."
                                    />
                                </div>

                                <div className="mt-4 flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={createData.is_active}
                                        onChange={(e) => setCreateData('is_active', e.target.checked)}
                                        className="mr-2"
                                    />
                                    <label className="text-sm font-medium text-gray-700">Ativo</label>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        resetCreate();
                                    }}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={createProcessing}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                                >
                                    {createProcessing ? 'Salvando...' : 'Salvar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && editingDesign && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                        <form onSubmit={handleEdit}>
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Editar Design</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                                        <input
                                            type="text"
                                            value={editData.name}
                                            onChange={(e) => setEditData('name', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                        {editErrors.name && <p className="text-red-500 text-xs mt-1">{editErrors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                                        <input
                                            type="text"
                                            value={editData.slug}
                                            onChange={(e) => setEditData('slug', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                        {editErrors.slug && <p className="text-red-500 text-xs mt-1">{editErrors.slug}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                                        <input
                                            type="text"
                                            value={editData.category}
                                            onChange={(e) => setEditData('category', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                        {editErrors.category && <p className="text-red-500 text-xs mt-1">{editErrors.category}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Custo Adicional (R$)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={editData.additional_cost}
                                            onChange={(e) => setEditData('additional_cost', parseFloat(e.target.value) || 0)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                        {editErrors.additional_cost && <p className="text-red-500 text-xs mt-1">{editErrors.additional_cost}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem</label>
                                        <input
                                            type="url"
                                            value={editData.image_url}
                                            onChange={(e) => setEditData('image_url', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {editErrors.image_url && <p className="text-red-500 text-xs mt-1">{editErrors.image_url}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Ordem</label>
                                        <input
                                            type="number"
                                            value={editData.sort_order}
                                            onChange={(e) => setEditData('sort_order', parseInt(e.target.value) || 0)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                                    <textarea
                                        value={editData.description}
                                        onChange={(e) => setEditData('description', e.target.value)}
                                        rows={3}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="mt-4 flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={editData.is_active}
                                        onChange={(e) => setEditData('is_active', e.target.checked)}
                                        className="mr-2"
                                    />
                                    <label className="text-sm font-medium text-gray-700">Ativo</label>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setEditingDesign(null);
                                        resetEdit();
                                    }}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={editProcessing}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                                >
                                    {editProcessing ? 'Salvando...' : 'Salvar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}