import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';

export default function Index({ auth, fonts, filters }) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedFont, setSelectedFont] = useState(null);
    
    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        display_name: '',
        description: '',
        preview_image: '',
        additional_cost: '0',
        is_active: true,
        sort_order: 0,
    });
    
    const openAddModal = () => {
        reset();
        setShowAddModal(true);
    };
    
    const openEditModal = (font) => {
        setSelectedFont(font);
        setData({
            name: font.name,
            display_name: font.display_name,
            description: font.description || '',
            preview_image: font.preview_image || '',
            additional_cost: font.additional_cost,
            is_active: font.is_active,
            sort_order: font.sort_order,
        });
        setShowEditModal(true);
    };
    
    const openDeleteModal = (font) => {
        setSelectedFont(font);
        setShowDeleteModal(true);
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/embroidery/fonts', {
            preserveScroll: true,
            onSuccess: () => {
                setShowAddModal(false);
                reset();
            },
        });
    };
    
    const handleUpdate = (e) => {
        e.preventDefault();
        put(`/admin/embroidery/fonts/${selectedFont.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowEditModal(false);
                reset();
            },
        });
    };
    
    const handleDelete = () => {
        destroy(`/admin/embroidery/fonts/${selectedFont.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteModal(false);
                setSelectedFont(null);
            },
        });
    };
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Fontes de Bordado</h2>
                    <Link
                        href={route('admin.embroidery.dashboard')}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Voltar ao Dashboard
                    </Link>
                </div>
            }
        >
            <Head title="Fontes de Bordado" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="mb-4">
                                <button 
                                    onClick={openAddModal}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    + Adicionar Nova Fonte
                                </button>
                            </div>

                            {fonts && fonts.data && fonts.data.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Nome
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Nome de Exibição
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
                                            {fonts.data.map((font) => (
                                                <tr key={font.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {font.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {font.display_name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        R$ {parseFloat(font.additional_cost).toFixed(2)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            font.is_active 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {font.is_active ? 'Ativa' : 'Inativa'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <button 
                                                            onClick={() => openEditModal(font)}
                                                            className="text-indigo-600 hover:text-indigo-900 mr-2"
                                                        >
                                                            Editar
                                                        </button>
                                                        <button 
                                                            onClick={() => openDeleteModal(font)}
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
                                    <p className="text-gray-500">Nenhuma fonte encontrada.</p>
                                    <p className="text-sm text-gray-400 mt-2">Adicione sua primeira fonte de bordado clicando no botão acima.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* Add Font Modal */}
            <Modal show={showAddModal} onClose={() => setShowAddModal(false)}>
                <form onSubmit={handleSubmit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">Adicionar Nova Fonte</h2>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <InputLabel value="Nome da Fonte" />
                            <TextInput
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1 block w-full"
                                placeholder="arial"
                                required
                            />
                        </div>
                        <div>
                            <InputLabel value="Nome para Exibição" />
                            <TextInput
                                value={data.display_name}
                                onChange={(e) => setData('display_name', e.target.value)}
                                className="mt-1 block w-full"
                                placeholder="Arial"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <InputLabel value="Custo Adicional (R$)" />
                            <TextInput
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.additional_cost}
                                onChange={(e) => setData('additional_cost', e.target.value)}
                                className="mt-1 block w-full"
                                required
                            />
                        </div>
                        <div>
                            <label className="flex items-center mt-6">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="rounded"
                                />
                                <span className="ml-2">Fonte Ativa</span>
                            </label>
                        </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                        <SecondaryButton onClick={() => setShowAddModal(false)}>Cancelar</SecondaryButton>
                        <PrimaryButton type="submit" disabled={processing}>Salvar</PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Edit Font Modal */}
            <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
                <form onSubmit={handleUpdate} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">Editar Fonte</h2>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <InputLabel value="Nome da Fonte" />
                            <TextInput
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1 block w-full"
                                required
                            />
                        </div>
                        <div>
                            <InputLabel value="Nome para Exibição" />
                            <TextInput
                                value={data.display_name}
                                onChange={(e) => setData('display_name', e.target.value)}
                                className="mt-1 block w-full"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <InputLabel value="Custo Adicional (R$)" />
                            <TextInput
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.additional_cost}
                                onChange={(e) => setData('additional_cost', e.target.value)}
                                className="mt-1 block w-full"
                                required
                            />
                        </div>
                        <div>
                            <label className="flex items-center mt-6">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="rounded"
                                />
                                <span className="ml-2">Fonte Ativa</span>
                            </label>
                        </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                        <SecondaryButton onClick={() => setShowEditModal(false)}>Cancelar</SecondaryButton>
                        <PrimaryButton type="submit" disabled={processing}>Atualizar</PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Delete Font Modal */}
            <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Excluir Fonte</h2>
                    <p className="text-sm text-gray-600 mb-6">
                        Tem certeza de que deseja excluir a fonte "{selectedFont?.name}"?
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