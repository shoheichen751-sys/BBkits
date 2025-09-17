import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Logs({ auth, logs, filters }) {
    const [selectedLog, setSelectedLog] = useState(null);

    const getStatusBadge = (status) => {
        const statusColors = {
            success: 'bg-green-100 text-green-800',
            error: 'bg-red-100 text-red-800',
            warning: 'bg-yellow-100 text-yellow-800',
            info: 'bg-blue-100 text-blue-800'
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
                {status}
            </span>
        );
    };

    const getServiceBadge = (service) => {
        const serviceColors = {
            tiny_erp: 'bg-purple-100 text-purple-800',
            whatsapp: 'bg-green-100 text-green-800',
            wati: 'bg-green-100 text-green-800'
        };

        const serviceLabels = {
            tiny_erp: 'Tiny ERP',
            whatsapp: 'WhatsApp',
            wati: 'WATI'
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${serviceColors[service] || 'bg-gray-100 text-gray-800'}`}>
                {serviceLabels[service] || service}
            </span>
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Logs de Integrações
                    </h2>
                    <Link
                        href={route('admin.integrations.index')}
                        className="text-sm text-pink-600 hover:text-pink-800"
                    >
                        ← Voltar para Integrações
                    </Link>
                </div>
            }
        >
            <Head title="Logs de Integrações" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Filters */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Filtros</h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Serviço
                                    </label>
                                    <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm">
                                        <option value="">Todos</option>
                                        <option value="tiny_erp">Tiny ERP</option>
                                        <option value="whatsapp">WhatsApp</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status
                                    </label>
                                    <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm">
                                        <option value="">Todos</option>
                                        <option value="success">Sucesso</option>
                                        <option value="error">Erro</option>
                                        <option value="warning">Aviso</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Data Início
                                    </label>
                                    <input
                                        type="date"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Data Fim
                                    </label>
                                    <input
                                        type="date"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Logs Table */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Data/Hora
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Serviço
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Ação
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Pedido
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Mensagem
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Ações
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {logs.map((log) => (
                                            <tr key={log.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(log.created_at).toLocaleString('pt-BR')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getServiceBadge(log.service)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {log.action}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getStatusBadge(log.status)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {log.order_id ? (
                                                        <Link
                                                            href={`/sales/${log.order_id}`}
                                                            className="text-pink-600 hover:text-pink-800"
                                                        >
                                                            #{log.order_token || log.order_id}
                                                        </Link>
                                                    ) : (
                                                        '-'
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    <div className="max-w-xs truncate">
                                                        {log.message}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        onClick={() => setSelectedLog(log)}
                                                        className="text-pink-600 hover:text-pink-900"
                                                    >
                                                        Ver detalhes
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {logs.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">Nenhum log encontrado</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Log Details Modal */}
            {selectedLog && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50">
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                                            <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-4">
                                                Detalhes do Log
                                            </h3>
                                            <div className="mt-2 space-y-4">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-700">Data/Hora:</p>
                                                    <p className="text-sm text-gray-500">
                                                        {new Date(selectedLog.created_at).toLocaleString('pt-BR')}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-700">Serviço:</p>
                                                    <p className="text-sm text-gray-500">{selectedLog.service}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-700">Ação:</p>
                                                    <p className="text-sm text-gray-500">{selectedLog.action}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-700">Status:</p>
                                                    <p className="text-sm text-gray-500">{selectedLog.status}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-700">Mensagem:</p>
                                                    <p className="text-sm text-gray-500">{selectedLog.message}</p>
                                                </div>
                                                {selectedLog.request_data && (
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-700">Dados da Requisição:</p>
                                                        <pre className="text-xs text-gray-500 bg-gray-100 p-2 rounded mt-1 overflow-auto max-h-40">
                                                            {JSON.stringify(selectedLog.request_data, null, 2)}
                                                        </pre>
                                                    </div>
                                                )}
                                                {selectedLog.response_data && (
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-700">Resposta:</p>
                                                        <pre className="text-xs text-gray-500 bg-gray-100 p-2 rounded mt-1 overflow-auto max-h-40">
                                                            {JSON.stringify(selectedLog.response_data, null, 2)}
                                                        </pre>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedLog(null)}
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                    >
                                        Fechar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}