import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Modal from '@/Components/Modal';
import ResponsiveForm, { FormSection, FormField, MobileFormActions } from '@/Components/ResponsiveForm';
import toast from 'react-hot-toast';

export default function CreateWithPreview() {
    const [showPreview, setShowPreview] = useState(false);
    const [receiptPreview, setReceiptPreview] = useState(null);
    
    const { data, setData, post, processing, errors } = useForm({
        // Client info - REQUIRED
        client_name: '',
        client_email: '',
        client_phone: '',
        client_cpf: '',
        
        // Child & embroidery - REQUIRED
        child_name: '',
        embroidery_position: '',
        embroidery_color: '',
        embroidery_font: '',
        
        // Payment - REQUIRED
        total_amount: '',
        shipping_amount: '',
        payment_method: 'pix',
        received_amount: '',
        payment_date: '',
        payment_receipt: null,
        
        // Delivery - REQUIRED
        delivery_address: '',
        delivery_number: '',
        delivery_complement: '',
        delivery_neighborhood: '',
        delivery_city: '',
        delivery_state: '',
        delivery_zipcode: '',
        
        // Optional
        notes: '',
        preferred_delivery_date: ''
    });

    const validateForm = () => {
        const requiredFields = [
            { field: 'client_name', label: 'Nome do Cliente' },
            { field: 'client_phone', label: 'Telefone' },
            { field: 'child_name', label: 'Nome da Criança' },
            { field: 'embroidery_position', label: 'Posição do Bordado' },
            { field: 'embroidery_color', label: 'Cor do Bordado' },
            { field: 'total_amount', label: 'Valor Total' },
            { field: 'shipping_amount', label: 'Valor do Frete' },
            { field: 'received_amount', label: 'Valor Recebido' },
            { field: 'payment_date', label: 'Data de Pagamento' },
            { field: 'delivery_address', label: 'Endereço de Entrega' },
            { field: 'delivery_city', label: 'Cidade' },
            { field: 'delivery_state', label: 'Estado' },
            { field: 'delivery_zipcode', label: 'CEP' }
        ];
        
        const missingFields = requiredFields.filter(item => !data[item.field]);
        
        if (missingFields.length > 0) {
            missingFields.forEach(item => {
                toast.error(`Campo obrigatório: ${item.label}`);
            });
            return false;
        }
        
        if (!data.payment_receipt) {
            toast.error('Comprovante de pagamento é obrigatório');
            return false;
        }
        
        return true;
    };

    const handlePreview = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setShowPreview(true);
    };

    const handleConfirmOrder = () => {
        post('/sales', {
            onSuccess: () => {
                toast.success('🎉 Venda registrada com sucesso! Link do cliente gerado.');
            },
            onError: (errors) => {
                Object.keys(errors).forEach(key => {
                    toast.error(errors[key]);
                });
            },
        });
    };

    const handleReceiptChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('payment_receipt', file);
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setReceiptPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const paymentMethodIcons = {
        pix: '🔗',
        boleto: '📄',
        cartao: '💳',
        dinheiro: '💰'
    };

    const paymentMethodLabels = {
        pix: 'PIX',
        boleto: 'Boleto Bancário',
        cartao: 'Cartão de Crédito/Débito',
        dinheiro: 'Dinheiro'
    };

    const embroideryPositions = {
        'top': 'Superior',
        'bottom': 'Inferior',
        'left': 'Esquerda',
        'right': 'Direita',
        'center': 'Centro'
    };

    const states = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-bold text-2xl text-gray-800 leading-tight">
                    📦 Registrar Nova Venda
                </h2>
            }
        >
            <Head title="Registrar Venda" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={handlePreview}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Cliente Section */}
                            <div className="bg-white p-6 rounded-xl shadow-lg">
                                <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-3">
                                    👤 Informações do Cliente
                                </h3>
                                
                                <div className="space-y-4">
                                    <div>
                                        <InputLabel htmlFor="client_name" value="Nome do Cliente *" />
                                        <TextInput
                                            id="client_name"
                                            value={data.client_name}
                                            onChange={(e) => setData('client_name', e.target.value)}
                                            required
                                            className="mt-1 block w-full"
                                        />
                                        {errors.client_name && <p className="text-red-500 text-sm mt-1">{errors.client_name}</p>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <InputLabel htmlFor="client_email" value="Email" />
                                            <TextInput
                                                id="client_email"
                                                type="email"
                                                value={data.client_email}
                                                onChange={(e) => setData('client_email', e.target.value)}
                                                className="mt-1 block w-full"
                                            />
                                        </div>
                                        
                                        <div>
                                            <InputLabel htmlFor="client_phone" value="Telefone *" />
                                            <TextInput
                                                id="client_phone"
                                                value={data.client_phone}
                                                onChange={(e) => setData('client_phone', e.target.value)}
                                                required
                                                className="mt-1 block w-full"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="client_cpf" value="CPF" />
                                        <TextInput
                                            id="client_cpf"
                                            value={data.client_cpf}
                                            onChange={(e) => setData('client_cpf', e.target.value)}
                                            className="mt-1 block w-full"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Bordado Section */}
                            <div className="bg-white p-6 rounded-xl shadow-lg">
                                <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-3">
                                    🧵 Detalhes do Bordado
                                </h3>
                                
                                <div className="space-y-4">
                                    <div>
                                        <InputLabel htmlFor="child_name" value="Nome da Criança/Bebê *" />
                                        <TextInput
                                            id="child_name"
                                            value={data.child_name}
                                            onChange={(e) => setData('child_name', e.target.value)}
                                            required
                                            className="mt-1 block w-full"
                                        />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="embroidery_position" value="Posição do Bordado *" />
                                        <select
                                            id="embroidery_position"
                                            value={data.embroidery_position}
                                            onChange={(e) => setData('embroidery_position', e.target.value)}
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300"
                                        >
                                            <option value="">Selecione...</option>
                                            {Object.entries(embroideryPositions).map(([key, value]) => (
                                                <option key={key} value={key}>{value}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <InputLabel htmlFor="embroidery_color" value="Cor do Bordado *" />
                                            <TextInput
                                                id="embroidery_color"
                                                value={data.embroidery_color}
                                                onChange={(e) => setData('embroidery_color', e.target.value)}
                                                required
                                                className="mt-1 block w-full"
                                            />
                                        </div>
                                        
                                        <div>
                                            <InputLabel htmlFor="embroidery_font" value="Fonte" />
                                            <TextInput
                                                id="embroidery_font"
                                                value={data.embroidery_font}
                                                onChange={(e) => setData('embroidery_font', e.target.value)}
                                                className="mt-1 block w-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Entrega Section */}
                            <div className="bg-white p-6 rounded-xl shadow-lg">
                                <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-3">
                                    📍 Endereço de Entrega
                                </h3>
                                
                                <div className="space-y-4">
                                    <div>
                                        <InputLabel htmlFor="delivery_zipcode" value="CEP *" />
                                        <TextInput
                                            id="delivery_zipcode"
                                            value={data.delivery_zipcode}
                                            onChange={(e) => setData('delivery_zipcode', e.target.value)}
                                            required
                                            className="mt-1 block w-full"
                                        />
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="col-span-2">
                                            <InputLabel htmlFor="delivery_address" value="Endereço *" />
                                            <TextInput
                                                id="delivery_address"
                                                value={data.delivery_address}
                                                onChange={(e) => setData('delivery_address', e.target.value)}
                                                required
                                                className="mt-1 block w-full"
                                            />
                                        </div>
                                        
                                        <div>
                                            <InputLabel htmlFor="delivery_number" value="Número" />
                                            <TextInput
                                                id="delivery_number"
                                                value={data.delivery_number}
                                                onChange={(e) => setData('delivery_number', e.target.value)}
                                                className="mt-1 block w-full"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="delivery_complement" value="Complemento" />
                                        <TextInput
                                            id="delivery_complement"
                                            value={data.delivery_complement}
                                            onChange={(e) => setData('delivery_complement', e.target.value)}
                                            className="mt-1 block w-full"
                                        />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="delivery_neighborhood" value="Bairro" />
                                        <TextInput
                                            id="delivery_neighborhood"
                                            value={data.delivery_neighborhood}
                                            onChange={(e) => setData('delivery_neighborhood', e.target.value)}
                                            className="mt-1 block w-full"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <InputLabel htmlFor="delivery_city" value="Cidade *" />
                                            <TextInput
                                                id="delivery_city"
                                                value={data.delivery_city}
                                                onChange={(e) => setData('delivery_city', e.target.value)}
                                                required
                                                className="mt-1 block w-full"
                                            />
                                        </div>
                                        
                                        <div>
                                            <InputLabel htmlFor="delivery_state" value="Estado *" />
                                            <select
                                                id="delivery_state"
                                                value={data.delivery_state}
                                                onChange={(e) => setData('delivery_state', e.target.value)}
                                                required
                                                className="mt-1 block w-full rounded-md border-gray-300"
                                            >
                                                <option value="">Selecione...</option>
                                                {states.map((state) => (
                                                    <option key={state} value={state}>{state}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="preferred_delivery_date" value="Data Preferencial de Entrega" />
                                        <TextInput
                                            id="preferred_delivery_date"
                                            type="date"
                                            value={data.preferred_delivery_date}
                                            onChange={(e) => setData('preferred_delivery_date', e.target.value)}
                                            className="mt-1 block w-full"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Pagamento Section */}
                            <div className="bg-white p-6 rounded-xl shadow-lg">
                                <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-3">
                                    💰 Informações de Pagamento
                                </h3>
                                
                                <div className="space-y-4">
                                    <div>
                                        <InputLabel htmlFor="payment_method" value="Forma de Pagamento *" />
                                        <select
                                            id="payment_method"
                                            value={data.payment_method}
                                            onChange={(e) => setData('payment_method', e.target.value)}
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300"
                                        >
                                            {Object.entries(paymentMethodLabels).map(([key, value]) => (
                                                <option key={key} value={key}>
                                                    {paymentMethodIcons[key]} {value}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <InputLabel htmlFor="total_amount" value="Valor Total *" />
                                            <TextInput
                                                id="total_amount"
                                                type="number"
                                                step="0.01"
                                                value={data.total_amount}
                                                onChange={(e) => setData('total_amount', e.target.value)}
                                                required
                                                className="mt-1 block w-full"
                                            />
                                        </div>
                                        
                                        <div>
                                            <InputLabel htmlFor="shipping_amount" value="Frete *" />
                                            <TextInput
                                                id="shipping_amount"
                                                type="number"
                                                step="0.01"
                                                value={data.shipping_amount}
                                                onChange={(e) => setData('shipping_amount', e.target.value)}
                                                required
                                                className="mt-1 block w-full"
                                            />
                                        </div>
                                        
                                        <div>
                                            <InputLabel htmlFor="received_amount" value="Valor Recebido *" />
                                            <TextInput
                                                id="received_amount"
                                                type="number"
                                                step="0.01"
                                                value={data.received_amount}
                                                onChange={(e) => setData('received_amount', e.target.value)}
                                                required
                                                className="mt-1 block w-full"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="payment_date" value="Data do Pagamento *" />
                                        <TextInput
                                            id="payment_date"
                                            type="date"
                                            value={data.payment_date}
                                            onChange={(e) => setData('payment_date', e.target.value)}
                                            required
                                            className="mt-1 block w-full"
                                        />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="payment_receipt" value="Comprovante de Pagamento *" />
                                        <input
                                            id="payment_receipt"
                                            type="file"
                                            onChange={handleReceiptChange}
                                            accept="image/*,application/pdf"
                                            required
                                            className="mt-1 block w-full"
                                        />
                                        {receiptPreview && (
                                            <img 
                                                src={receiptPreview} 
                                                alt="Preview" 
                                                className="mt-2 h-32 object-contain rounded"
                                            />
                                        )}
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="notes" value="Observações" />
                                        <textarea
                                            id="notes"
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300"
                                            rows="3"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-4">
                            <SecondaryButton
                                type="button"
                                onClick={() => router.visit('/sales')}
                            >
                                Cancelar
                            </SecondaryButton>
                            
                            <PrimaryButton type="submit" disabled={processing}>
                                📋 Visualizar Resumo
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>

            {/* Preview Modal */}
            <Modal show={showPreview} onClose={() => setShowPreview(false)} maxWidth="2xl">
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">
                        📋 Resumo do Pedido
                    </h2>
                    
                    <div className="space-y-6">
                        {/* Cliente Info */}
                        <div className="border-b pb-4">
                            <h3 className="font-semibold text-lg mb-2">👤 Cliente</h3>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div><span className="font-medium">Nome:</span> {data.client_name}</div>
                                <div><span className="font-medium">Telefone:</span> {data.client_phone}</div>
                                {data.client_email && <div><span className="font-medium">Email:</span> {data.client_email}</div>}
                                {data.client_cpf && <div><span className="font-medium">CPF:</span> {data.client_cpf}</div>}
                            </div>
                        </div>

                        {/* Bordado Info */}
                        <div className="border-b pb-4">
                            <h3 className="font-semibold text-lg mb-2">🧵 Bordado</h3>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div><span className="font-medium">Nome:</span> {data.child_name}</div>
                                <div><span className="font-medium">Posição:</span> {embroideryPositions[data.embroidery_position]}</div>
                                <div><span className="font-medium">Cor:</span> {data.embroidery_color}</div>
                                {data.embroidery_font && <div><span className="font-medium">Fonte:</span> {data.embroidery_font}</div>}
                            </div>
                        </div>

                        {/* Entrega Info */}
                        <div className="border-b pb-4">
                            <h3 className="font-semibold text-lg mb-2">📍 Entrega</h3>
                            <div className="text-sm">
                                <p>{data.delivery_address}, {data.delivery_number}</p>
                                {data.delivery_complement && <p>{data.delivery_complement}</p>}
                                <p>{data.delivery_neighborhood}</p>
                                <p>{data.delivery_city}/{data.delivery_state} - CEP: {data.delivery_zipcode}</p>
                                {data.preferred_delivery_date && (
                                    <p className="mt-2">
                                        <span className="font-medium">Data preferencial:</span> {new Date(data.preferred_delivery_date).toLocaleDateString('pt-BR')}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Pagamento Info */}
                        <div className="border-b pb-4">
                            <h3 className="font-semibold text-lg mb-2">💰 Pagamento</h3>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div><span className="font-medium">Método:</span> {paymentMethodIcons[data.payment_method]} {paymentMethodLabels[data.payment_method]}</div>
                                <div><span className="font-medium">Data:</span> {new Date(data.payment_date).toLocaleDateString('pt-BR')}</div>
                                <div><span className="font-medium">Valor Total:</span> {formatCurrency(data.total_amount)}</div>
                                <div><span className="font-medium">Frete:</span> {formatCurrency(data.shipping_amount)}</div>
                                <div><span className="font-medium">Valor Recebido:</span> {formatCurrency(data.received_amount)}</div>
                                {parseFloat(data.received_amount) < parseFloat(data.total_amount) && (
                                    <div className="col-span-2 text-orange-600">
                                        <span className="font-medium">Valor Restante:</span> {formatCurrency(data.total_amount - data.received_amount)}
                                    </div>
                                )}
                            </div>
                            {receiptPreview && (
                                <div className="mt-3">
                                    <span className="font-medium text-sm">Comprovante:</span>
                                    <img src={receiptPreview} alt="Comprovante" className="mt-1 h-24 object-contain rounded border" />
                                </div>
                            )}
                        </div>

                        {/* Observações */}
                        {data.notes && (
                            <div>
                                <h3 className="font-semibold text-lg mb-2">📝 Observações</h3>
                                <p className="text-sm text-gray-600">{data.notes}</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm text-yellow-800">
                            ⚠️ <strong>Atenção:</strong> Após confirmar, um link único será gerado para o cliente acompanhar o pedido.
                        </p>
                    </div>

                    <div className="mt-6 flex justify-end gap-4">
                        <SecondaryButton onClick={() => setShowPreview(false)}>
                            ✏️ Editar
                        </SecondaryButton>
                        
                        <PrimaryButton onClick={handleConfirmOrder} disabled={processing}>
                            ✅ Confirmar e Gerar Link do Cliente
                        </PrimaryButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}