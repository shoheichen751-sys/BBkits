import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';

export default function SaleCancellationModal({ show, onClose, onConfirm, sale, processing }) {
    const [password, setPassword] = useState('');
    const [explanation, setExplanation] = useState('');
    const [errors, setErrors] = useState({});

    const handleConfirm = () => {
        // Reset errors
        setErrors({});
        
        // Validate fields
        const newErrors = {};
        if (!password.trim()) {
            newErrors.password = 'Senha do administrador é obrigatória';
        }
        if (!explanation.trim()) {
            newErrors.explanation = 'Explicação para o cancelamento é obrigatória';
        }
        if (explanation.trim().length < 10) {
            newErrors.explanation = 'Explicação deve ter pelo menos 10 caracteres';
        }
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        
        // Call the confirm handler with the additional data
        onConfirm({
            password: password,
            explanation: explanation
        });
    };

    const handleClose = () => {
        setPassword('');
        setExplanation('');
        setErrors({});
        onClose();
    };

    return (
        <Transition.Root show={show} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={handleClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                            <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                                        </div>
                                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                                            <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                                Cancelar Venda
                                            </Dialog.Title>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500 mb-4">
                                                    {sale ? `Tem certeza que deseja cancelar a venda para ${sale.client_name}?` : ''}
                                                </p>
                                                <div className="text-xs mb-4 space-y-2">
                                                    <p className="text-orange-600 bg-orange-50 p-2 rounded">
                                                        ⚠️ Esta ação irá cancelar a venda e remover os valores das estatísticas gerais e comissão da vendedora.
                                                    </p>
                                                    <p className="text-blue-600 bg-blue-50 p-2 rounded">
                                                        🔐 Senha de administrador necessária para confirmar o cancelamento. Vendedoras podem solicitar, mas apenas administradores podem autorizar.
                                                    </p>
                                                </div>
                                                
                                                <div className="space-y-4">
                                                    <div>
                                                        <InputLabel htmlFor="admin_password" value="Senha do Administrador *" />
                                                        <TextInput
                                                            id="admin_password"
                                                            type="password"
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                            className="mt-1 block w-full"
                                                            placeholder="Digite sua senha para confirmar"
                                                        />
                                                        {errors.password && (
                                                            <p className="text-red-600 text-xs mt-1">{errors.password}</p>
                                                        )}
                                                    </div>
                                                    
                                                    <div>
                                                        <InputLabel htmlFor="explanation" value="Motivo do Cancelamento *" />
                                                        <textarea
                                                            id="explanation"
                                                            value={explanation}
                                                            onChange={(e) => setExplanation(e.target.value)}
                                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                            rows="3"
                                                            placeholder="Ex: Cliente solicitou cancelamento, produto com defeito, etc."
                                                        />
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Mínimo 10 caracteres. Esta informação será registrada para auditoria.
                                                        </p>
                                                        {errors.explanation && (
                                                            <p className="text-red-600 text-xs mt-1">{errors.explanation}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <DangerButton
                                        onClick={handleConfirm}
                                        disabled={processing}
                                        className="sm:ml-3"
                                    >
                                        {processing ? 'Cancelando...' : 'Confirmar Cancelamento'}
                                    </DangerButton>
                                    <SecondaryButton
                                        onClick={handleClose}
                                        disabled={processing}
                                    >
                                        Fechar
                                    </SecondaryButton>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}