import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import toast from 'react-hot-toast';
import { formatBRL } from '@/utils/currency';

export default function ClientPage({ sale, orderStatus, orderStatusColor, remainingAmount, needsFinalPayment, productPhotoUrl }) {
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [showAddressForm, setShowAddressForm] = useState(!sale.delivery_address);
    const [paymentPreview, setPaymentPreview] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        delivery_address: sale.delivery_address || '',
        delivery_number: sale.delivery_number || '',
        delivery_complement: sale.delivery_complement || '',
        delivery_neighborhood: sale.delivery_neighborhood || '',
        delivery_city: sale.delivery_city || '',
        delivery_state: sale.delivery_state || '',
        delivery_zipcode: sale.delivery_zipcode || '',
        final_payment_proof: null,
        photo_approved: false,
        photo_rejection_reason: ''
    });

    const handlePaymentProofChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('final_payment_proof', file);
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setPaymentPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const submitAddress = (e) => {
        e.preventDefault();
        
        // Validate required address fields
        const requiredFields = ['delivery_address', 'delivery_number', 'delivery_neighborhood', 'delivery_city', 'delivery_state', 'delivery_zipcode'];
        const missingFields = requiredFields.filter(field => !data[field] || data[field].toString().trim() === '');
        
        if (missingFields.length > 0) {
            toast.error('Por favor, preencha todos os campos obrigatórios do endereço');
            return;
        }
        
        post(route('sales.client.update-address', { token: sale.unique_token }), {
            onSuccess: () => {
                toast.success('Endereço atualizado com sucesso!');
                setShowAddressForm(false);
            }
        });
    };

    const submitPayment = (e) => {
        e.preventDefault();
        post(route('sales.client.upload-payment', { token: sale.unique_token }), {
            onSuccess: () => {
                toast.success('Comprovante enviado com sucesso!');
                setShowPaymentForm(false);
            }
        });
    };

    const approvePhoto = () => {
        post(route('sales.client.approve-photo', { token: sale.unique_token }), {
            data: { approved: true },
            onSuccess: () => {
                toast.success('Foto aprovada! 🎉');
            }
        });
    };

    const rejectPhoto = () => {
        if (!data.photo_rejection_reason) {
            toast.error('Por favor, informe o motivo da solicitação de ajuste');
            return;
        }
        
        post(route('sales.client.approve-photo', { token: sale.unique_token }), {
            data: { approved: false, reason: data.photo_rejection_reason },
            onSuccess: () => {
                toast.success('Solicitação de ajuste enviada');
            }
        });
    };

    const statusColors = {
        yellow: 'bg-yellow-100 text-yellow-800',
        green: 'bg-green-100 text-green-800',
        blue: 'bg-blue-100 text-blue-800',
        purple: 'bg-purple-100 text-purple-800',
        indigo: 'bg-indigo-100 text-indigo-800',
        orange: 'bg-orange-100 text-orange-800',
        teal: 'bg-teal-100 text-teal-800',
        gray: 'bg-gray-100 text-gray-800'
    };

    const states = [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
        'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
        'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ];

    return (
        <>
            <Head title={`Pedido - ${sale.child_name}`} />
            
            <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
                {/* Header */}
                <div className="bg-white shadow-sm">
                    <div className="max-w-4xl mx-auto px-4 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                    BB
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">BBKits</h1>
                                    <p className="text-sm text-gray-600">Acompanhe seu pedido</p>
                                </div>
                            </div>
                            <div className={`px-4 py-2 rounded-full text-sm font-medium ${statusColors[orderStatusColor]}`}>
                                {orderStatus}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-4xl mx-auto px-4 py-8">
                    {/* Welcome Message */}
                    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Olá, {sale.client_name}! 👋
                        </h2>
                        <p className="text-gray-600">
                            Estamos preparando o kit da {sale.child_name} com muito carinho. 
                            Acompanhe todo o processo por aqui!
                        </p>
                    </div>

                    {/* Order Progress */}
                    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Progresso do Pedido</h3>
                        <div className="relative">
                            <div className="flex items-center justify-between mb-2">
                                {[
                                    { status: 'pending_payment', label: 'Pagamento', icon: '💳' },
                                    { status: 'in_production', label: 'Produção', icon: '🏭' },
                                    { status: 'photo_sent', label: 'Aprovação', icon: '📸' },
                                    { status: 'ready_for_shipping', label: 'Envio', icon: '📦' },
                                    { status: 'shipped', label: 'Entregue', icon: '🎉' }
                                ].map((step, index) => {
                                    const isActive = ['payment_approved', 'in_production', 'photo_sent', 'photo_approved', 'pending_final_payment', 'ready_for_shipping', 'shipped'].indexOf(sale.order_status) >= index;
                                    return (
                                        <div key={step.status} className="flex flex-col items-center">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${isActive ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}>
                                                {step.icon}
                                            </div>
                                            <span className={`text-xs mt-1 ${isActive ? 'text-purple-600 font-medium' : 'text-gray-400'}`}>
                                                {step.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 -z-10" />
                            <div 
                                className="absolute top-6 left-0 h-0.5 bg-purple-500 -z-10 transition-all duration-500"
                                style={{ 
                                    width: `${
                                        sale.order_status === 'pending_payment' ? '0%' :
                                        sale.order_status === 'payment_approved' ? '25%' :
                                        sale.order_status === 'in_production' ? '25%' :
                                        sale.order_status === 'photo_sent' ? '50%' :
                                        sale.order_status === 'photo_approved' ? '50%' :
                                        sale.order_status === 'pending_final_payment' ? '50%' :
                                        sale.order_status === 'ready_for_shipping' ? '75%' :
                                        sale.order_status === 'shipped' ? '100%' : '0%'
                                    }` 
                                }}
                            />
                        </div>
                    </div>

                    {/* Order Details */}
                    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalhes do Pedido</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Nome da Criança</p>
                                <p className="font-medium text-gray-900">{sale.child_name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Bordado</p>
                                <p className="font-medium text-gray-900">
                                    {sale.embroidery_color} • {sale.embroidery_font} • {sale.embroidery_position}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Valor Total com Frete</p>
                                <p className="font-medium text-gray-900">
                                    {formatBRL(parseFloat(sale.total_amount) + parseFloat(sale.shipping_amount || 0))}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Valor Pago</p>
                                <p className="font-medium text-gray-900">
                                    {formatBRL((parseFloat(sale.total_amount) + parseFloat(sale.shipping_amount || 0)) - remainingAmount)}
                                    {remainingAmount > 0 && (
                                        <span className="text-sm text-orange-600 ml-2">
                                            (Falta {formatBRL(remainingAmount)})
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Product Photo Approval */}
                    {sale.order_status === 'photo_sent' && productPhotoUrl && (
                        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                📸 Foto do Seu Kit
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Seu kit está pronto! Confira a foto e nos diga o que achou:
                            </p>
                            <div className="bg-gray-100 rounded-lg p-4 mb-4">
                                <img 
                                    src={productPhotoUrl} 
                                    alt="Foto do produto" 
                                    className="w-full rounded-lg shadow-md"
                                />
                            </div>
                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={approvePhoto}
                                    className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
                                >
                                    ✅ Aprovar - Está Perfeito!
                                </button>
                                <div>
                                    <textarea
                                        value={data.photo_rejection_reason}
                                        onChange={e => setData('photo_rejection_reason', e.target.value)}
                                        placeholder="Se precisar de algum ajuste, descreva aqui..."
                                        className="w-full rounded-lg border-gray-300 mb-2"
                                        rows={3}
                                    />
                                    <button
                                        onClick={rejectPhoto}
                                        disabled={!data.photo_rejection_reason}
                                        className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        🔄 Solicitar Ajuste
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Final Payment */}
                    {needsFinalPayment && (
                        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-6">
                            <h3 className="text-lg font-semibold text-orange-900 mb-2">
                                💰 Pagamento Final Pendente
                            </h3>
                            <p className="text-orange-700 mb-4">
                                Falta apenas o pagamento de {formatBRL(remainingAmount)} para enviarmos seu pedido!
                            </p>
                            {!showPaymentForm ? (
                                <button
                                    onClick={() => setShowPaymentForm(true)}
                                    className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                                >
                                    Enviar Comprovante
                                </button>
                            ) : (
                                <form onSubmit={submitPayment} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Comprovante de Pagamento
                                        </label>
                                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-orange-400 transition-colors">
                                            <div className="space-y-1 text-center">
                                                {paymentPreview ? (
                                                    <div>
                                                        <img 
                                                            src={paymentPreview} 
                                                            alt="Preview" 
                                                            className="mx-auto h-32 w-auto rounded"
                                                        />
                                                        <p className="text-sm text-gray-600 mt-2">
                                                            {data.final_payment_proof?.name}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                        </svg>
                                                        <div className="flex text-sm text-gray-600">
                                                            <label htmlFor="final_payment_proof" className="relative cursor-pointer rounded-md bg-white font-medium text-orange-600 hover:text-orange-500">
                                                                <span>Enviar arquivo</span>
                                                                <input
                                                                    id="final_payment_proof"
                                                                    type="file"
                                                                    className="sr-only"
                                                                    accept="image/*,application/pdf"
                                                                    onChange={handlePaymentProofChange}
                                                                    required
                                                                />
                                                            </label>
                                                        </div>
                                                        <p className="text-xs text-gray-500">
                                                            PNG, JPG, PDF até 2MB
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowPaymentForm(false)}
                                            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing || !data.final_payment_proof}
                                            className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing ? 'Enviando...' : 'Enviar Comprovante'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}

                    {/* Delivery Address */}
                    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">📍 Endereço de Entrega</h3>
                            {!showAddressForm && sale.delivery_address && (
                                <button
                                    onClick={() => setShowAddressForm(true)}
                                    className="text-purple-600 hover:text-purple-700 text-sm"
                                >
                                    Editar
                                </button>
                            )}
                        </div>
                        
                        {!showAddressForm && sale.delivery_address ? (
                            <div className="text-gray-700">
                                <p>{sale.delivery_address}, {sale.delivery_number}</p>
                                {sale.delivery_complement && <p>{sale.delivery_complement}</p>}
                                <p>{sale.delivery_neighborhood}</p>
                                <p>{sale.delivery_city}/{sale.delivery_state} - CEP: {sale.delivery_zipcode}</p>
                            </div>
                        ) : (
                            <>
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-amber-500 text-lg">⚠️</span>
                                        <div>
                                            <h4 className="text-amber-800 font-medium">Endereço Obrigatório</h4>
                                            <p className="text-amber-700 text-sm">
                                                Para finalizar seu pedido, precisamos do seu endereço de entrega completo.
                                                Preencha todos os campos abaixo.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <form onSubmit={submitAddress} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Endereço *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.delivery_address}
                                            onChange={e => setData('delivery_address', e.target.value)}
                                            className="w-full rounded-lg border-gray-300"
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Número *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.delivery_number}
                                            onChange={e => setData('delivery_number', e.target.value)}
                                            className="w-full rounded-lg border-gray-300"
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Complemento
                                        </label>
                                        <input
                                            type="text"
                                            value={data.delivery_complement}
                                            onChange={e => setData('delivery_complement', e.target.value)}
                                            className="w-full rounded-lg border-gray-300"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Bairro *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.delivery_neighborhood}
                                            onChange={e => setData('delivery_neighborhood', e.target.value)}
                                            className="w-full rounded-lg border-gray-300"
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Cidade *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.delivery_city}
                                            onChange={e => setData('delivery_city', e.target.value)}
                                            className="w-full rounded-lg border-gray-300"
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Estado *
                                        </label>
                                        <select
                                            value={data.delivery_state}
                                            onChange={e => setData('delivery_state', e.target.value)}
                                            className="w-full rounded-lg border-gray-300"
                                            required
                                        >
                                            <option value="">Selecione...</option>
                                            {states.map(state => (
                                                <option key={state} value={state}>{state}</option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            CEP *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.delivery_zipcode}
                                            onChange={e => setData('delivery_zipcode', e.target.value)}
                                            className="w-full rounded-lg border-gray-300"
                                            placeholder="00000-000"
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex gap-4">
                                    {sale.delivery_address && (
                                        <button
                                            type="button"
                                            onClick={() => setShowAddressForm(false)}
                                            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                                    >
                                        {processing ? 'Salvando...' : 'Salvar Endereço'}
                                    </button>
                                </div>
                            </form>
                            </>
                        )}
                    </div>

                    {/* Tracking Info */}
                    {sale.order_status === 'shipped' && sale.tracking_code && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
                            <h3 className="text-lg font-semibold text-green-900 mb-2">
                                🚚 Pedido Enviado!
                            </h3>
                            <p className="text-green-700 mb-2">
                                Seu pedido está a caminho! Acompanhe a entrega:
                            </p>
                            <p className="font-mono text-lg text-green-900">
                                Código de Rastreio: {sale.tracking_code}
                            </p>
                        </div>
                    )}

                    {/* Contact Info */}
                    <div className="bg-purple-50 rounded-xl p-6 text-center">
                        <p className="text-purple-700 mb-2">
                            Ficou com alguma dúvida? Entre em contato:
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a 
                                href={`https://wa.me/5581982233873?text=Olá! Meu pedido é ${sale.unique_token} - ${sale.child_name}. Cliente: ${sale.client_name}`}
                                className="inline-flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                </svg>
                                WhatsApp
                            </a>
                            <a 
                                href="mailto:vendas@bbkits.com.br"
                                className="inline-flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                E-mail
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}