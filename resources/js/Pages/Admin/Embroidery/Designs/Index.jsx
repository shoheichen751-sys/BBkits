import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ auth, designs, categories, filters }) {
    // State management - simplified approach
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingDesign, setEditingDesign] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    // Search filters - direct state management
    const [searchTerm, setSearchTerm] = useState((filters?.search) || '');
    const [selectedCategory, setSelectedCategory] = useState((filters?.category) || 'all');
    const [selectedStatus, setSelectedStatus] = useState((filters?.status) || 'all');
    
    // Form data - separate objects instead of useForm
    const [createFormData, setCreateFormData] = useState({
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
    
    const [editFormData, setEditFormData] = useState({});
    const [formErrors, setFormErrors] = useState({});

    // Utility functions
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

    const resetCreateForm = () => {
        setCreateFormData({
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
        setFormErrors({});
    };

    // Event handlers - using router directly instead of useForm
    const handleSearch = (e) => {
        e.preventDefault();
        const params = {};
        if (searchTerm) params.search = searchTerm;
        if (selectedCategory !== 'all') params.category = selectedCategory;
        if (selectedStatus !== 'all') params.status = selectedStatus;
        
        router.get(route('admin.embroidery.designs.index'), params, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setFormErrors({});
        
        router.post(route('admin.embroidery.designs.store'), createFormData, {
            onSuccess: () => {
                setShowCreateModal(false);
                resetCreateForm();
                setIsLoading(false);
            },
            onError: (errors) => {
                setFormErrors(errors);
                setIsLoading(false);
            },
            onFinish: () => {
                setIsLoading(false);
            }
        });
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        if (!editingDesign?.id) return;
        
        setIsLoading(true);
        setFormErrors({});
        
        router.put(route('admin.embroidery.designs.update', editingDesign.id), editFormData, {
            onSuccess: () => {
                setShowEditModal(false);
                setEditingDesign(null);
                setEditFormData({});
                setIsLoading(false);
            },
            onError: (errors) => {
                setFormErrors(errors);
                setIsLoading(false);
            },
            onFinish: () => {
                setIsLoading(false);
            }
        });
    };

    const handleDelete = (design) => {
        if (!design?.id) return;
        
        const confirmed = confirm(`Tem certeza que deseja excluir o design "${design.name}"?`);
        if (!confirmed) return;
        
        setIsLoading(true);
        router.delete(route('admin.embroidery.designs.destroy', design.id), {
            onSuccess: () => {
                setIsLoading(false);
            },
            onError: (error) => {
                alert('Erro ao excluir o design');
                setIsLoading(false);
            },
            onFinish: () => {
                setIsLoading(false);
            }
        });
    };

    const openEditModal = (design) => {
        if (!design) return;
        
        setEditingDesign(design);
        setEditFormData({
            name: design.name || '',
            slug: design.slug || '',
            description: design.description || '',
            category: design.category || '',
            image_url: design.image_url || '',
            design_file_url: design.design_file_url || '',
            additional_cost: design.additional_cost || 0,
            is_active: design.is_active !== false, // Handle boolean properly
            sort_order: design.sort_order || 0,
            compatible_positions: design.compatible_positions || [],
            compatible_colors: design.compatible_colors || []
        });
        setFormErrors({});
        setShowEditModal(true);
    };

    const updateCreateForm = (field, value) => {
        setCreateFormData(prev => ({ ...prev, [field]: value }));
        if (field === 'name') {
            setCreateFormData(prev => ({ ...prev, slug: generateSlug(value) }));
        }
    };

    const updateEditForm = (field, value) => {
        setEditFormData(prev => ({ ...prev, [field]: value }));
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
                                    disabled={isLoading}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                                >
                                    Adicionar Novo Design
                                </button>
                            </div>

                            {/* Filters */}
                            <form onSubmit={handleSearch} className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                                <input
                                    type="text"
                                    placeholder="Buscar designs..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">Todas as Categorias</option>
                                    {categories && categories.map((cat, index) => (
                                        <option key={index} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">Todos os Status</option>
                                    <option value="active">Ativos</option>
                                    <option value="inactive">Inativos</option>
                                </select>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                                >
                                    {isLoading ? 'Buscando...' : 'Buscar'}
                                </button>
                            </form>

                            {/* Loading indicator */}
                            {isLoading && (
                                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-blue-700">
                                    Carregando...
                                </div>
                            )}

                            {/* Designs Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {designs?.data?.map((design) => (
                                    <div key={design.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                        {design.image_url && (
                                            <img
                                                src={design.image_url}
                                                alt={design.name}
                                                className="w-full h-32 object-cover rounded-md mb-3"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                }}
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
                                                R$ {parseFloat(design.additional_cost || 0).toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => openEditModal(design)}
                                                disabled={isLoading}
                                                className="flex-1 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 text-sm rounded disabled:opacity-50"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(design)}
                                                disabled={isLoading}
                                                className="flex-1 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 text-sm rounded disabled:opacity-50"
                                            >
                                                Excluir
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                
                                {/* No designs message */}
                                {(!designs?.data || designs.data.length === 0) && !isLoading && (
                                    <div className="col-span-full text-center py-12">
                                        <div className="text-gray-500">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                            </svg>
                                            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum design encontrado</h3>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Comece criando um novo design de bordado.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Pagination */}
                            {designs?.links && (
                                <div className="mt-6 flex justify-center">
                                    <div className="flex space-x-1">
                                        {designs.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
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
                                            value={createFormData.name}
                                            onChange={(e) => updateCreateForm('name', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                        {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                                        <input
                                            type="text"
                                            value={createFormData.slug}
                                            onChange={(e) => updateCreateForm('slug', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                        {formErrors.slug && <p className="text-red-500 text-xs mt-1">{formErrors.slug}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                                        <input
                                            type="text"
                                            value={createFormData.category}
                                            onChange={(e) => updateCreateForm('category', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="ex: Animais, Personagens, Brasões"
                                            required
                                        />
                                        {formErrors.category && <p className="text-red-500 text-xs mt-1">{formErrors.category}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Custo Adicional (R$)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={createFormData.additional_cost}
                                            onChange={(e) => updateCreateForm('additional_cost', parseFloat(e.target.value) || 0)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                        {formErrors.additional_cost && <p className="text-red-500 text-xs mt-1">{formErrors.additional_cost}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem</label>
                                        <input
                                            type="url"
                                            value={createFormData.image_url}
                                            onChange={(e) => updateCreateForm('image_url', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="https://exemplo.com/imagem.jpg"
                                        />
                                        {formErrors.image_url && <p className="text-red-500 text-xs mt-1">{formErrors.image_url}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Ordem</label>
                                        <input
                                            type="number"
                                            value={createFormData.sort_order}
                                            onChange={(e) => updateCreateForm('sort_order', parseInt(e.target.value) || 0)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                                    <textarea
                                        value={createFormData.description}
                                        onChange={(e) => updateCreateForm('description', e.target.value)}
                                        rows={3}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Descrição do design..."
                                    />
                                </div>

                                <div className="mt-4 flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={createFormData.is_active}
                                        onChange={(e) => updateCreateForm('is_active', e.target.checked)}
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
                                        resetCreateForm();
                                    }}
                                    disabled={isLoading}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                                >
                                    {isLoading ? 'Salvando...' : 'Salvar'}
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
                                            value={editFormData.name || ''}
                                            onChange={(e) => updateEditForm('name', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                        {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                                        <input
                                            type="text"
                                            value={editFormData.slug || ''}
                                            onChange={(e) => updateEditForm('slug', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                        {formErrors.slug && <p className="text-red-500 text-xs mt-1">{formErrors.slug}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                                        <input
                                            type="text"
                                            value={editFormData.category || ''}
                                            onChange={(e) => updateEditForm('category', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                        {formErrors.category && <p className="text-red-500 text-xs mt-1">{formErrors.category}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Custo Adicional (R$)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={editFormData.additional_cost || 0}
                                            onChange={(e) => updateEditForm('additional_cost', parseFloat(e.target.value) || 0)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                        {formErrors.additional_cost && <p className="text-red-500 text-xs mt-1">{formErrors.additional_cost}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem</label>
                                        <input
                                            type="url"
                                            value={editFormData.image_url || ''}
                                            onChange={(e) => updateEditForm('image_url', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {formErrors.image_url && <p className="text-red-500 text-xs mt-1">{formErrors.image_url}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Ordem</label>
                                        <input
                                            type="number"
                                            value={editFormData.sort_order || 0}
                                            onChange={(e) => updateEditForm('sort_order', parseInt(e.target.value) || 0)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                                    <textarea
                                        value={editFormData.description || ''}
                                        onChange={(e) => updateEditForm('description', e.target.value)}
                                        rows={3}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="mt-4 flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={editFormData.is_active !== false}
                                        onChange={(e) => updateEditForm('is_active', e.target.checked)}
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
                                        setEditFormData({});
                                        setFormErrors({});
                                    }}
                                    disabled={isLoading}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                                >
                                    {isLoading ? 'Salvando...' : 'Salvar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}