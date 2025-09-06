import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';

export default function Index({ auth, colors, filters }) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedColor, setSelectedColor] = useState(null);
    
    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        hex_code: '#000000',
        thread_code: '',
        description: '',
        additional_cost: '0',
        is_active: true,
        sort_order: 0,
    });
    
    const openAddModal = () => {
        reset();
        setShowAddModal(true);
    };
    
    const openEditModal = (color) => {
        setSelectedColor(color);
        setData({
            name: color.name,
            hex_code: color.hex_code,
            thread_code: color.thread_code || '',
            description: color.description || '',
            additional_cost: color.additional_cost,
            is_active: color.is_active,
            sort_order: color.sort_order,
        });
        setShowEditModal(true);
    };
    
    const openDeleteModal = (color) => {
        setSelectedColor(color);
        setShowDeleteModal(true);
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/embroidery/colors', {
            preserveScroll: true,
            onSuccess: () => {
                setShowAddModal(false);
                reset();
            },
        });
    };
    
    const handleUpdate = (e) => {
        e.preventDefault();
        put(`/admin/embroidery/colors/${selectedColor.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowEditModal(false);
                reset();
            },
        });
    };
    
    const handleDelete = () => {
        destroy(`/admin/embroidery/colors/${selectedColor.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteModal(false);
                setSelectedColor(null);
            },
        });
    };
    
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Cores de Bordado</h2>
                    <Link
                        href={route('admin.embroidery.dashboard')}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Voltar ao Dashboard
                    </Link>
                </div>
            }
        >
            <Head title="Cores de Bordado" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="mb-4">
                                <button 
                                    onClick={openAddModal}
                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    + Adicionar Nova Cor
                                </button>
                            </div>

                            {colors && colors.data && colors.data.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Cor
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Nome
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Código Hex
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Código do Fio
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Custo Adicional
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
                                            {colors.data.map((color) => (
                                                <tr key={color.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div 
                                                            className="w-8 h-8 rounded-full border-2 border-gray-300"
                                                            style={{ backgroundColor: color.hex_code }}
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {color.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {color.hex_code}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {color.thread_code || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        R$ {parseFloat(color.additional_cost).toFixed(2)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            color.is_active 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {color.is_active ? 'Ativa' : 'Inativa'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <button 
                                                            onClick={() => openEditModal(color)}
                                                            className="text-indigo-600 hover:text-indigo-900 mr-2"
                                                        >
                                                            Editar
                                                        </button>
                                                        <button 
                                                            onClick={() => openDeleteModal(color)}
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
                                    <p className="text-gray-500">Nenhuma cor encontrada.</p>
                                    <p className="text-sm text-gray-400 mt-2">Adicione sua primeira cor de bordado clicando no botão acima.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Color Modal */}
            <Modal show={showAddModal} onClose={() => setShowAddModal(false)}>
                <form onSubmit={handleSubmit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">
                        Adicionar Nova Cor de Bordado
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <InputLabel htmlFor="name" value="Nome da Cor" />
                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className="mt-1 block w-full"
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            {errors.name && <div className="text-red-600 text-sm mt-1">{errors.name}</div>}
                        </div>

                        <div>
                            <InputLabel htmlFor="hex_code" value="Código Hex" />
                            <div className="flex items-center mt-1">
                                <input
                                    type="color"
                                    id="hex_code"
                                    name="hex_code"
                                    value={data.hex_code}
                                    onChange={(e) => setData('hex_code', e.target.value)}
                                    className="h-10 w-16 rounded border-gray-300 mr-2"
                                />
                                <TextInput
                                    value={data.hex_code}
                                    onChange={(e) => setData('hex_code', e.target.value)}
                                    className="flex-1"
                                    placeholder="#000000"
                                    required
                                />
                            </div>
                            {errors.hex_code && <div className="text-red-600 text-sm mt-1">{errors.hex_code}</div>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <InputLabel htmlFor="thread_code" value="Código do Fio (Opcional)" />
                            <TextInput
                                id="thread_code"
                                name="thread_code"
                                value={data.thread_code}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('thread_code', e.target.value)}
                                placeholder="Ex: DMC-310"
                            />
                            {errors.thread_code && <div className="text-red-600 text-sm mt-1">{errors.thread_code}</div>}
                        </div>

                        <div>
                            <InputLabel htmlFor="additional_cost" value="Custo Adicional (R$)" />
                            <TextInput
                                id="additional_cost"
                                name="additional_cost"
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.additional_cost}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('additional_cost', e.target.value)}
                                required
                            />
                            {errors.additional_cost && <div className="text-red-600 text-sm mt-1">{errors.additional_cost}</div>}
                        </div>
                    </div>

                    <div className="mb-4">
                        <InputLabel htmlFor="description" value="Descrição (Opcional)" />
                        <textarea
                            id="description"
                            name="description"
                            value={data.description}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            rows="3"
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Descrição da cor..."
                        />
                        {errors.description && <div className="text-red-600 text-sm mt-1">{errors.description}</div>}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                                <span className="ml-2 text-sm text-gray-600">Cor Ativa</span>
                            </label>
                        </div>

                        <div>
                            <InputLabel htmlFor="sort_order" value="Ordem de Exibição" />
                            <TextInput
                                id="sort_order"
                                name="sort_order"
                                type="number"
                                min="0"
                                value={data.sort_order}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('sort_order', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end space-x-2">
                        <SecondaryButton onClick={() => setShowAddModal(false)}>
                            Cancelar
                        </SecondaryButton>
                        <PrimaryButton type="submit" disabled={processing}>
                            {processing ? 'Salvando...' : 'Salvar Cor'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Edit Color Modal */}
            <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
                <form onSubmit={handleUpdate} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">
                        Editar Cor de Bordado
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <InputLabel htmlFor="edit_name" value="Nome da Cor" />
                            <TextInput
                                id="edit_name"
                                name="name"
                                value={data.name}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="edit_hex_code" value="Código Hex" />
                            <div className="flex items-center mt-1">
                                <input
                                    type="color"
                                    id="edit_hex_code"
                                    value={data.hex_code}
                                    onChange={(e) => setData('hex_code', e.target.value)}
                                    className="h-10 w-16 rounded border-gray-300 mr-2"
                                />
                                <TextInput
                                    value={data.hex_code}
                                    onChange={(e) => setData('hex_code', e.target.value)}
                                    className="flex-1"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <InputLabel htmlFor="edit_thread_code" value="Código do Fio" />
                            <TextInput
                                id="edit_thread_code"
                                value={data.thread_code}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('thread_code', e.target.value)}
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="edit_additional_cost" value="Custo Adicional (R$)" />
                            <TextInput
                                id="edit_additional_cost"
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.additional_cost}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('additional_cost', e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <InputLabel htmlFor="edit_description" value="Descrição" />
                        <textarea
                            id="edit_description"
                            value={data.description}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            rows="3"
                            onChange={(e) => setData('description', e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                                <span className="ml-2 text-sm text-gray-600">Cor Ativa</span>
                            </label>
                        </div>

                        <div>
                            <InputLabel htmlFor="edit_sort_order" value="Ordem de Exibição" />
                            <TextInput
                                id="edit_sort_order"
                                type="number"
                                min="0"
                                value={data.sort_order}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('sort_order', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end space-x-2">
                        <SecondaryButton onClick={() => setShowEditModal(false)}>
                            Cancelar
                        </SecondaryButton>
                        <PrimaryButton type="submit" disabled={processing}>
                            {processing ? 'Salvando...' : 'Atualizar Cor'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Delete Color Modal */}
            <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        Excluir Cor de Bordado
                    </h2>
                    
                    <p className="text-sm text-gray-600 mb-6">
                        Tem certeza de que deseja excluir a cor "{selectedColor?.name}"? 
                        Esta ação não pode ser desfeita.
                    </p>
                    
                    <div className="flex items-center justify-end space-x-2">
                        <SecondaryButton onClick={() => setShowDeleteModal(false)}>
                            Cancelar
                        </SecondaryButton>
                        <DangerButton onClick={handleDelete} disabled={processing}>
                            {processing ? 'Excluindo...' : 'Excluir'}
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}