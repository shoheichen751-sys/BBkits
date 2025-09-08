import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';

export default function Index({ auth, products, categories, filters }) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    
    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        description: '',
        price: '',
        category_id: categories && categories.length > 0 ? categories[0].id : '',
        sizes: ['P', 'M', 'G'],
        colors: ['Branco', 'Preto'],
        allows_embroidery: true,
        is_active: true,
        stock_quantity: 0,
        image: null,
        image_url: '',
    });
    
    const openAddModal = () => {
        reset();
        setShowAddModal(true);
    };
    
    const openEditModal = (product) => {
        setSelectedProduct(product);
        setData({
            name: product.name,
            description: product.description || '',
            price: product.price,
            category_id: product.category_id || (categories && categories.length > 0 ? categories[0].id : ''),
            sizes: Array.isArray(product.sizes) ? product.sizes : JSON.parse(product.sizes || '[]'),
            colors: Array.isArray(product.colors) ? product.colors : JSON.parse(product.colors || '[]'),
            allows_embroidery: product.allows_embroidery,
            is_active: product.is_active,
            stock_quantity: product.stock_quantity || 0,
            image: null,
            image_url: product.image_url || '',
        });
        // Set preview to existing image if it exists and isn't a placeholder
        if (product.image_url && !product.image_url.includes('placeholder')) {
            setImagePreview(product.image_url);
        } else {
            setImagePreview(null);
        }
        setShowEditModal(true);
    };
    
    const openDeleteModal = (product) => {
        setSelectedProduct(product);
        setShowDeleteModal(true);
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/products', {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setShowAddModal(false);
                reset();
                setImagePreview(null);
            },
        });
    };
    
    const handleUpdate = (e) => {
        e.preventDefault();
        post(`/admin/products/${selectedProduct.id}`, {
            _method: 'PUT',
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setShowEditModal(false);
                reset();
                setImagePreview(null);
            },
        });
    };
    
    const handleDelete = () => {
        destroy(`/admin/products/${selectedProduct.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteModal(false);
                setSelectedProduct(null);
            },
        });
    };

    const handleArrayInput = (field, value) => {
        const array = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
        setData(field, array);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearImage = () => {
        setData('image', null);
        setImagePreview(null);
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Gerenciamento de Produtos</h2>
                    <Link
                        href="/admin/embroidery"
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Voltar ao Dashboard
                    </Link>
                </div>
            }
        >
            <Head title="Gerenciamento de Produtos" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="mb-4">
                                <button 
                                    onClick={openAddModal}
                                    className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    + Adicionar Novo Produto
                                </button>
                            </div>

                            {products && products.data && products.data.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Nome
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Categoria
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Preço
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Bordado
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Ações
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {products.data.map((product) => (
                                                <tr key={product.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {product.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {product.product_category ? product.product_category.name : 'Sem categoria'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        R$ {parseFloat(product.price).toFixed(2)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            product.allows_embroidery 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {product.allows_embroidery ? 'Sim' : 'Não'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            product.is_active 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {product.is_active ? 'Ativo' : 'Inativo'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <button 
                                                            onClick={() => openEditModal(product)}
                                                            className="text-indigo-600 hover:text-indigo-900 mr-2"
                                                        >
                                                            Editar
                                                        </button>
                                                        <button 
                                                            onClick={() => openDeleteModal(product)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Excluir
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">Nenhum produto encontrado.</p>
                                    <p className="text-sm text-gray-400 mt-2">Adicione seu primeiro produto clicando no botão acima.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Product Modal */}
            <Modal show={showAddModal} onClose={() => setShowAddModal(false)}>
                <form onSubmit={handleSubmit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">Adicionar Novo Produto</h2>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <InputLabel value="Nome do Produto" />
                            <TextInput
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1 block w-full"
                                placeholder="Camiseta Básica"
                                required
                            />
                        </div>
                        <div>
                            <InputLabel value="Categoria" />
                            <select
                                value={data.category_id}
                                onChange={(e) => setData('category_id', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                required
                            >
                                <option value="">Selecione uma categoria</option>
                                {categories && categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <div className="mb-4">
                        <InputLabel value="Descrição" />
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            rows="3"
                            placeholder="Descrição do produto..."
                        />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                            <InputLabel value="Preço (R$)" />
                            <TextInput
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                                className="mt-1 block w-full"
                                required
                            />
                        </div>
                        <div>
                            <InputLabel value="Tamanhos (separados por vírgula)" />
                            <TextInput
                                value={data.sizes.join(', ')}
                                onChange={(e) => handleArrayInput('sizes', e.target.value)}
                                className="mt-1 block w-full"
                                placeholder="P, M, G, GG"
                            />
                        </div>
                        <div>
                            <InputLabel value="Estoque" />
                            <TextInput
                                type="number"
                                min="0"
                                value={data.stock_quantity}
                                onChange={(e) => setData('stock_quantity', parseInt(e.target.value) || 0)}
                                className="mt-1 block w-full"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <InputLabel value="Cores Disponíveis (separadas por vírgula)" />
                        <TextInput
                            value={data.colors.join(', ')}
                            onChange={(e) => handleArrayInput('colors', e.target.value)}
                            className="mt-1 block w-full"
                            placeholder="Branco, Preto, Azul, Vermelho"
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={data.allows_embroidery}
                                    onChange={(e) => setData('allows_embroidery', e.target.checked)}
                                    className="rounded"
                                />
                                <span className="ml-2">Permite Bordado</span>
                            </label>
                        </div>
                        <div>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="rounded"
                                />
                                <span className="ml-2">Produto Ativo</span>
                            </label>
                        </div>
                    </div>
                    
                    {/* Image Upload Section */}
                    <div className="mb-4">
                        <InputLabel value="Imagem do Produto" />
                        <div className="mt-1">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {imagePreview && (
                                <div className="mt-3">
                                    <div className="flex items-start space-x-3">
                                        <img 
                                            src={imagePreview} 
                                            alt="Preview" 
                                            className="w-20 h-20 object-cover rounded-lg border border-gray-300" 
                                        />
                                        <button
                                            type="button"
                                            onClick={clearImage}
                                            className="text-red-600 hover:text-red-800 text-sm"
                                        >
                                            Remover imagem
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                        <SecondaryButton onClick={() => setShowAddModal(false)}>Cancelar</SecondaryButton>
                        <PrimaryButton type="submit" disabled={processing}>Salvar</PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Edit Product Modal */}
            <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
                <form onSubmit={handleUpdate} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">Editar Produto</h2>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <InputLabel value="Nome do Produto" />
                            <TextInput
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1 block w-full"
                                required
                            />
                        </div>
                        <div>
                            <InputLabel value="Categoria" />
                            <select
                                value={data.category_id}
                                onChange={(e) => setData('category_id', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                required
                            >
                                <option value="">Selecione uma categoria</option>
                                {categories && categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <div className="mb-4">
                        <InputLabel value="Descrição" />
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            rows="3"
                            placeholder="Descrição do produto..."
                        />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                            <InputLabel value="Preço (R$)" />
                            <TextInput
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                                className="mt-1 block w-full"
                                required
                            />
                        </div>
                        <div>
                            <InputLabel value="Tamanhos (separados por vírgula)" />
                            <TextInput
                                value={data.sizes.join(', ')}
                                onChange={(e) => handleArrayInput('sizes', e.target.value)}
                                className="mt-1 block w-full"
                                placeholder="P, M, G, GG"
                            />
                        </div>
                        <div>
                            <InputLabel value="Estoque" />
                            <TextInput
                                type="number"
                                min="0"
                                value={data.stock_quantity}
                                onChange={(e) => setData('stock_quantity', parseInt(e.target.value) || 0)}
                                className="mt-1 block w-full"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <InputLabel value="Cores Disponíveis (separadas por vírgula)" />
                        <TextInput
                            value={data.colors.join(', ')}
                            onChange={(e) => handleArrayInput('colors', e.target.value)}
                            className="mt-1 block w-full"
                            placeholder="Branco, Preto, Azul, Vermelho"
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={data.allows_embroidery}
                                    onChange={(e) => setData('allows_embroidery', e.target.checked)}
                                    className="rounded"
                                />
                                <span className="ml-2">Permite Bordado</span>
                            </label>
                        </div>
                        <div>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="rounded"
                                />
                                <span className="ml-2">Produto Ativo</span>
                            </label>
                        </div>
                    </div>
                    
                    {/* Image Upload Section */}
                    <div className="mb-4">
                        <InputLabel value="Imagem do Produto" />
                        <div className="mt-1">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {imagePreview && (
                                <div className="mt-3">
                                    <div className="flex items-start space-x-3">
                                        <img 
                                            src={imagePreview} 
                                            alt="Preview" 
                                            className="w-20 h-20 object-cover rounded-lg border border-gray-300" 
                                        />
                                        <button
                                            type="button"
                                            onClick={clearImage}
                                            className="text-red-600 hover:text-red-800 text-sm"
                                        >
                                            Remover imagem
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                        <SecondaryButton onClick={() => setShowEditModal(false)}>Cancelar</SecondaryButton>
                        <PrimaryButton type="submit" disabled={processing}>Atualizar</PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Delete Product Modal */}
            <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Excluir Produto</h2>
                    <p className="text-sm text-gray-600 mb-6">
                        Tem certeza de que deseja excluir o produto "{selectedProduct?.name}"?
                    </p>
                    <div className="flex justify-end space-x-2">
                        <SecondaryButton onClick={() => setShowDeleteModal(false)}>Cancelar</SecondaryButton>
                        <DangerButton onClick={handleDelete} disabled={processing}>Excluir</DangerButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}