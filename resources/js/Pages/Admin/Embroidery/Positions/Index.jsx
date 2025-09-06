import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';

export default function Index({ auth, positions, filters }) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState(null);
    
    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        display_name: '',
        description: '',
        additional_cost: '0',
        is_active: true,
        sort_order: 0,
        preview_image: '',
    });
    
    const openAddModal = () => {
        reset();
        setShowAddModal(true);
    };
    
    const openEditModal = (position) => {
        setSelectedPosition(position);
        setData({
            name: position.name,
            display_name: position.display_name,
            description: position.description || '',
            additional_cost: position.additional_cost,
            is_active: position.is_active,
            sort_order: position.sort_order,
            preview_image: position.preview_image || '',
        });
        setShowEditModal(true);
    };
    
    const openDeleteModal = (position) => {
        setSelectedPosition(position);
        setShowDeleteModal(true);
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/embroidery/positions', {
            preserveScroll: true,
            onSuccess: () => {
                setShowAddModal(false);
                reset();
            },
        });
    };
    
    const handleUpdate = (e) => {
        e.preventDefault();
        put(`/admin/embroidery/positions/${selectedPosition.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowEditModal(false);
                reset();
            },
        });
    };
    
    const handleDelete = () => {
        destroy(`/admin/embroidery/positions/${selectedPosition.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteModal(false);
                setSelectedPosition(null);
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Posições de Bordado</h2>
                    <Link
                        href={route('admin.embroidery.dashboard')}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Voltar ao Dashboard
                    </Link>
                </div>
            }
        >
            <Head title="Posições de Bordado" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="mb-4">
                                <button 
                                    onClick={openAddModal}
                                    className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    + Adicionar Nova Posição
                                </button>
                            </div>

                            {positions && positions.data && positions.data.length > 0 ? (
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
                                            {positions.data.map((position) => (
                                                <tr key={position.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {position.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {position.display_name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        R$ {parseFloat(position.additional_cost).toFixed(2)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            position.is_active 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {position.is_active ? 'Ativa' : 'Inativa'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <button 
                                                            onClick={() => openEditModal(position)}
                                                            className="text-indigo-600 hover:text-indigo-900 mr-2"
                                                        >
                                                            Editar
                                                        </button>
                                                        <button 
                                                            onClick={() => openDeleteModal(position)}
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
                                    <p className="text-gray-500">Nenhuma posição encontrada.</p>
                                    <p className="text-sm text-gray-400 mt-2">Adicione sua primeira posição de bordado clicando no botão acima.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Position Modal */}
            <Modal show={showAddModal} onClose={() => setShowAddModal(false)}>
                <form onSubmit={handleSubmit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">Adicionar Nova Posição</h2>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <InputLabel value="Nome da Posição" />
                            <TextInput
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1 block w-full"
                                placeholder="peito_esquerdo"
                                required
                            />
                        </div>
                        <div>
                            <InputLabel value="Nome para Exibição" />
                            <TextInput
                                value={data.display_name}
                                onChange={(e) => setData('display_name', e.target.value)}
                                className="mt-1 block w-full"
                                placeholder="Peito Esquerdo"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="mb-4">
                        <InputLabel value="Descrição" />
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            rows="3"
                            placeholder="Descrição da posição de bordado..."
                        />
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
                                <span className="ml-2">Posição Ativa</span>
                            </label>
                        </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                        <SecondaryButton onClick={() => setShowAddModal(false)}>Cancelar</SecondaryButton>
                        <PrimaryButton type="submit" disabled={processing}>Salvar</PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Edit Position Modal */}
            <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
                <form onSubmit={handleUpdate} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">Editar Posição</h2>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <InputLabel value="Nome da Posição" />
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
                    
                    <div className="mb-4">
                        <InputLabel value="Descrição" />
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            rows="3"
                            placeholder="Descrição da posição de bordado..."
                        />
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
                                <span className="ml-2">Posição Ativa</span>
                            </label>
                        </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                        <SecondaryButton onClick={() => setShowEditModal(false)}>Cancelar</SecondaryButton>
                        <PrimaryButton type="submit" disabled={processing}>Atualizar</PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Delete Position Modal */}
            <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Excluir Posição</h2>
                    <p className="text-sm text-gray-600 mb-6">
                        Tem certeza de que deseja excluir a posição "{selectedPosition?.display_name}"?
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