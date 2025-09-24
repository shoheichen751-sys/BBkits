import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ sale }) {
    const getStatusBadge = (status) => {
        const badges = {
            pendente: {
                bg: 'bg-gradient-to-r from-yellow-100 to-yellow-200',
                text: 'text-yellow-800',
                border: 'border-yellow-300',
                icon: '⏳',
                glow: 'shadow-yellow-200'
            },
            aprovado: {
                bg: 'bg-gradient-to-r from-green-100 to-green-200',
                text: 'text-green-800',
                border: 'border-green-300',
                icon: '✅',
                glow: 'shadow-green-200'
            },
            recusado: {
                bg: 'bg-gradient-to-r from-red-100 to-red-200',
                text: 'text-red-800',
                border: 'border-red-300',
                icon: '❌',
                glow: 'shadow-red-200'
            },
            cancelado: {
                bg: 'bg-gradient-to-r from-gray-100 to-gray-200',
                text: 'text-gray-800',
                border: 'border-gray-300',
                icon: '⚪',
                glow: 'shadow-gray-200'
            },
            estornado: {
                bg: 'bg-gradient-to-r from-purple-100 to-purple-200',
                text: 'text-purple-800',
                border: 'border-purple-300',
                icon: '🔄',
                glow: 'shadow-purple-200'
            }
        };
        
        const labels = {
            pendente: 'Pendente',
            aprovado: 'Aprovada',
            recusado: 'Recusada',
            cancelado: 'Cancelada',
            estornado: 'Estornada'
        };

        const config = badges[status] || badges.pendente;

        return (
            <span className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold ${config.bg} ${config.text} border-2 ${config.border} ${config.glow} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
                <span className="text-lg">{config.icon}</span>
                {labels[status]}
            </span>
        );
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(amount);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('pt-BR');
    };

    const formatDateTime = (dateTime) => {
        return new Date(dateTime).toLocaleString('pt-BR');
    };

    const getPaymentMethodLabel = (method) => {
        const methods = {
            pix: { label: 'PIX', icon: '🔗' },
            boleto: { label: 'Boleto Bancário', icon: '📄' },
            cartao: { label: 'Cartão de Crédito/Débito', icon: '💳' },
            dinheiro: { label: 'Dinheiro', icon: '💰' }
        };
        return methods[method] || { label: method, icon: '💳' };
    };

    const paymentMethod = getPaymentMethodLabel(sale.payment_method);

    return (
        <>
            <Head title={`Venda #${sale.id} - BBKits`} />

            {/* Add custom styles matching the standard design */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
                
                :root {
                    --primary-color: #D4A574;
                    --secondary-color: #F5E6D3;
                    --accent-color: #E8B4CB;
                    --accent-dark: #C8869B;
                    --text-dark: #2C2C2C;
                    --text-light: #666;
                    --white: #FFFFFF;
                    --gradient: linear-gradient(135deg, #D4A574 0%, #E8B4CB 100%);
                    --gradient-soft: linear-gradient(135deg, #F5E6D3 0%, #FFFFFF 100%);
                    --gradient-hero: linear-gradient(135deg, rgba(212, 165, 116, 0.95) 0%, rgba(232, 180, 203, 0.95) 100%);
                    --shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
                    --shadow-hover: 0 25px 50px rgba(0, 0, 0, 0.2);
                    --shadow-glow: 0 0 30px rgba(212, 165, 116, 0.3);
                }

                * {
                    font-family: 'Poppins', sans-serif;
                }

                .show-bg {
                    background: linear-gradient(135deg, #F5E6D3 0%, #FFFFFF 50%, #F0F9FF 100%);
                    min-height: 100vh;
                }

                .card-gradient {
                    background: var(--gradient-soft);
                    border-radius: 25px;
                    box-shadow: var(--shadow);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 2px solid transparent;
                    backdrop-filter: blur(10px);
                }

                .card-gradient:hover {
                    transform: translateY(-5px);
                    box-shadow: var(--shadow-hover);
                    border-color: var(--primary-color);
                }

                .detail-card {
                    background: white;
                    border-radius: 20px;
                    padding: 32px;
                    margin-bottom: 24px;
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
                    border: 2px solid transparent;
                    transition: all 0.3s ease;
                }

                .detail-card:hover {
                    border-color: rgba(212, 165, 116, 0.3);
                    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
                    transform: translateY(-2px);
                }

                .section-title {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 24px;
                    padding-bottom: 16px;
                    border-bottom: 2px solid #F3F4F6;
                }

                .section-icon {
                    width: 32px;
                    height: 32px;
                    background: var(--gradient);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 16px;
                }

                .floating-particles {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    pointer-events: none;
                    z-index: 1;
                }

                .particle {
                    position: absolute;
                    background: rgba(212, 165, 116, 0.1);
                    border-radius: 50%;
                    animation: float 15s infinite linear;
                }

                @keyframes float {
                    0% {
                        transform: translateY(100vh) rotate(0deg);
                        opacity: 0;
                    }
                    10% {
                        opacity: 1;
                    }
                    90% {
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(-100px) rotate(360deg);
                        opacity: 0;
                    }
                }

                .header-gradient {
                    background: var(--gradient);
                    color: white;
                    border-radius: 20px;
                    padding: 20px;
                    margin-bottom: 30px;
                    box-shadow: var(--shadow);
                }

                .value-display {
                    background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%);
                    border: 2px solid #BBF7D0;
                    border-radius: 15px;
                    padding: 16px;
                    text-align: center;
                    transition: all 0.3s ease;
                }

                .value-display:hover {
                    transform: scale(1.02);
                    box-shadow: 0 8px 25px rgba(34, 197, 94, 0.2);
                }

                .detail-item {
                    background: linear-gradient(135deg, #FAFAFA 0%, #FFFFFF 100%);
                    border-radius: 12px;
                    padding: 16px;
                    margin-bottom: 12px;
                    border: 1px solid #E5E7EB;
                    transition: all 0.3s ease;
                }

                .detail-item:hover {
                    background: linear-gradient(135deg, #F5F5F5 0%, #FFFFFF 100%);
                    border-color: var(--primary-color);
                    transform: translateX(5px);
                }

                .btn-gradient {
                    background: var(--gradient);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                    border-radius: 15px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    padding: 16px 32px;
                    color: white;
                    border: none;
                    cursor: pointer;
                    font-size: 16px;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                }

                .btn-gradient::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    transition: left 0.6s;
                }

                .btn-gradient:hover::before {
                    left: 100%;
                }

                .btn-gradient:hover {
                    transform: translateY(-3px);
                    box-shadow: var(--shadow-hover);
                }

                .btn-back {
                    background: transparent;
                    color: var(--text-light);
                    padding: 16px 24px;
                    border-radius: 15px;
                    border: 2px solid #E5E7EB;
                    font-weight: 600;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                }

                .btn-back:hover {
                    background: #F3F4F6;
                    border-color: var(--primary-color);
                    color: var(--text-dark);
                    transform: translateY(-2px);
                }

                .status-alert {
                    border-radius: 20px;
                    padding: 24px;
                    margin-bottom: 24px;
                    border: 2px solid;
                    backdrop-filter: blur(10px);
                    transition: all 0.3s ease;
                }

                .status-alert:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
                }

                .notes-display {
                    background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%);
                    border: 2px solid #FDE68A;
                    border-radius: 15px;
                    padding: 20px;
                    margin-bottom: 24px;
                }

                .commission-highlight {
                    background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
                    border: 2px solid #93C5FD;
                    border-radius: 15px;
                    padding: 16px;
                    text-align: center;
                    margin-top: 16px;
                }

                .pending-amount-highlight {
                    background: linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%);
                    border: 2px solid #FED7AA;
                    border-radius: 15px;
                    padding: 16px;
                    text-align: center;
                    margin-top: 16px;
                    transition: all 0.3s ease;
                }

                .pending-amount-highlight:hover {
                    transform: scale(1.02);
                    box-shadow: 0 8px 25px rgba(251, 146, 60, 0.2);
                }

                .grid-enhanced {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 24px;
                }

                .animate-fade-in {
                    animation: fadeIn 0.6s ease-out;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .timeline-item {
                    position: relative;
                    padding-left: 40px;
                    margin-bottom: 20px;
                }

                .timeline-item::before {
                    content: '';
                    position: absolute;
                    left: 12px;
                    top: 8px;
                    width: 3px;
                    height: calc(100% + 12px);
                    background: linear-gradient(to bottom, var(--primary-color), transparent);
                }

                .timeline-dot {
                    position: absolute;
                    left: 0;
                    top: 8px;
                    width: 24px;
                    height: 24px;
                    background: var(--gradient);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 12px;
                    font-weight: bold;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                }
            `}</style>

            {/* Floating particles */}
            <div className="floating-particles">
                {Array.from({ length: 10 }, (_, i) => (
                    <div
                        key={i}
                        className="particle"
                        style={{
                            left: Math.random() * 100 + "%",
                            width: Math.random() * 8 + 4 + "px",
                            height: Math.random() * 8 + 4 + "px",
                            animationDelay: Math.random() * 15 + "s",
                            animationDuration: Math.random() * 10 + 10 + "s",
                        }}
                    />
                ))}
            </div>

            <AuthenticatedLayout
                header={
                    <div className="header-gradient">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl backdrop-blur-sm">
                                    <i className="fas fa-eye"></i>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold leading-tight">
                                        📋 Detalhes da Venda #{sale.id}
                                    </h2>
                                    <p className="text-white/80 text-sm">
                                        Visualize todas as informações da sua venda
                                    </p>
                                </div>
                            </div>
                            <div>
                                {getStatusBadge(sale.status)}
                            </div>
                        </div>
                    </div>
                }
            >
                <div className="show-bg relative z-10">
                    <div className="py-12">
                        <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                            {/* Sale Overview */}
                            <div className="detail-card animate-fade-in">
                                <div className="section-title">
                                    <div className="section-icon">
                                        <i className="fas fa-info-circle"></i>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800">
                                        📊 Resumo da Venda
                                    </h3>
                                </div>

                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                            #{sale.id}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-xl font-bold text-gray-800 mb-1">
                                                Venda para {sale.client_name}
                                            </h4>
                                            <p className="text-gray-600">
                                                📅 Registrada em {formatDateTime(sale.created_at)}
                                            </p>
                                            <p className="text-gray-600">
                                                💰 Pagamento via {paymentMethod.icon} {paymentMethod.label}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sale Details Grid */}
                            <div className="grid-enhanced">
                                {/* Seller and Client Info */}
                                <div className="detail-card animate-fade-in">
                                    <div className="section-title">
                                        <div className="section-icon">
                                            <i className="fas fa-users"></i>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-800">
                                            👥 Informações Gerais
                                        </h3>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="detail-item">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                                                    <i className="fas fa-user-tie"></i>
                                                </div>
                                                <div>
                                                    <dt className="text-sm text-gray-500 font-medium">Vendedora</dt>
                                                    <dd className="text-lg font-bold text-gray-900">{sale.user.name}</dd>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="detail-item">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold">
                                                    <i className="fas fa-user-heart"></i>
                                                </div>
                                                <div>
                                                    <dt className="text-sm text-gray-500 font-medium">Cliente</dt>
                                                    <dd className="text-lg font-bold text-gray-900">{sale.client_name}</dd>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="detail-item">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center text-white text-lg">
                                                    {paymentMethod.icon}
                                                </div>
                                                <div>
                                                    <dt className="text-sm text-gray-500 font-medium">Forma de Pagamento</dt>
                                                    <dd className="text-lg font-bold text-gray-900">{paymentMethod.label}</dd>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="detail-item">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-white font-bold">
                                                    📅
                                                </div>
                                                <div>
                                                    <dt className="text-sm text-gray-500 font-medium">Data do Pagamento</dt>
                                                    <dd className="text-lg font-bold text-gray-900">{formatDate(sale.payment_date)}</dd>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Child Information */}
                                {sale.child_name && (
                                    <div className="detail-card animate-fade-in">
                                        <div className="section-title">
                                            <div className="section-icon">
                                                👶
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-800">
                                                Dados da Criança
                                            </h3>
                                        </div>
                                        
                                        <div className="bg-pink-50 border border-pink-200 rounded-xl p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white text-2xl">
                                                    👶
                                                </div>
                                                <div>
                                                    <h4 className="text-2xl font-bold text-pink-800 mb-1">
                                                        "{sale.child_name}"
                                                    </h4>
                                                    <p className="text-pink-700 text-sm">
                                                        Nome usado para personalização dos bordados
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Products Information */}
                                <div className="detail-card animate-fade-in">
                                    <div className="section-title">
                                        <div className="section-icon">
                                            🛍️
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-800">
                                            Produtos do Pedido
                                        </h3>
                                    </div>
                                    
                                    {sale.products && sale.products.length > 0 ? (
                                        <div className="space-y-4">
                                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-blue-600 text-xl">📦</span>
                                                        <span className="font-bold text-blue-800">
                                                            {sale.products.length} {sale.products.length === 1 ? 'produto' : 'produtos'} no pedido
                                                        </span>
                                                    </div>
                                                    <span className="text-sm text-blue-600 font-medium">
                                                        {sale.products.reduce((sum, product) => sum + parseInt(product.quantity || 1), 0)} unidades no total
                                                    </span>
                                                </div>
                                            </div>

                                            {sale.products.map((product, index) => (
                                                <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                                                    <div className="flex items-start gap-4">
                                                        {/* Embroidery Design Image */}
                                                        <div className="flex-shrink-0">
                                                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
                                                                {product.embroidery_design?.image_url ? (
                                                                    <img
                                                                        src={product.embroidery_design.image_url}
                                                                        alt={product.embroidery_design.name}
                                                                        className="w-full h-full object-cover"
                                                                        onError={(e) => {
                                                                            e.target.src = '/images/placeholder-embroidery.svg';
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                                                        </svg>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Product Details */}
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-start mb-3">
                                                                <div>
                                                                    <h4 className="text-xl font-bold text-gray-900 mb-1">
                                                                        {product.product_name || 'Produto'}
                                                                    </h4>
                                                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                                                        <span className="flex items-center gap-1">
                                                                            📏 <strong>Tamanho:</strong> {product.size || 'N/A'}
                                                                        </span>
                                                                        <span className="flex items-center gap-1">
                                                                            🔢 <strong>Qtd:</strong> {product.quantity || 1}
                                                                        </span>
                                                                        {product.product_category && (
                                                                            <span className="flex items-center gap-1">
                                                                                📂 <strong>Categoria:</strong> {product.product_category}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <div className="text-2xl font-bold text-green-600">
                                                                        {formatCurrency(product.total_price || 0)}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500">
                                                                        {formatCurrency(product.unit_total || 0)} × {product.quantity || 1}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Personalization Details */}
                                                            <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-4">
                                                                <h5 className="font-bold text-pink-800 mb-2 flex items-center gap-2">
                                                                    👶 Personalização do Bordado
                                                                </h5>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                                    <div>
                                                                        <strong className="text-pink-700">Nome:</strong> 
                                                                        <span className="ml-2 font-bold text-pink-900">
                                                                            "{product.embroidery_text || sale.child_name || 'N/A'}"
                                                                        </span>
                                                                    </div>
                                                                    <div>
                                                                        <strong className="text-pink-700">Design:</strong> 
                                                                        <span className="ml-2 text-pink-900">
                                                                            {product.embroidery_design?.name || 'N/A'}
                                                                        </span>
                                                                    </div>
                                                                    <div>
                                                                        <strong className="text-pink-700">Fonte:</strong> 
                                                                        <span className="ml-2 text-pink-900">
                                                                            {product.embroidery_font?.display_name || product.embroidery_font?.name || 'N/A'}
                                                                        </span>
                                                                    </div>
                                                                    <div>
                                                                        <strong className="text-pink-700">Cor:</strong> 
                                                                        <span className="ml-2 text-pink-900">
                                                                            {product.embroidery_color?.name || 'N/A'}
                                                                        </span>
                                                                    </div>
                                                                    <div>
                                                                        <strong className="text-pink-700">Posição:</strong> 
                                                                        <span className="ml-2 text-pink-900">
                                                                            {product.embroidery_position?.display_name || product.embroidery_position?.name || 'N/A'}
                                                                        </span>
                                                                    </div>
                                                                    {product.embroidery_design?.category && (
                                                                        <div>
                                                                            <strong className="text-pink-700">Categoria:</strong> 
                                                                            <span className="ml-2 text-pink-900">
                                                                                {product.embroidery_design.category}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Price Breakdown */}
                                                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                                                <h5 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                                                                    💰 Detalhamento do Preço
                                                                </h5>
                                                                <div className="space-y-2 text-sm">
                                                                    <div className="flex justify-between">
                                                                        <span className="text-gray-600">Preço base:</span>
                                                                        <span className="font-medium">{formatCurrency(product.unit_price || 0)}</span>
                                                                    </div>
                                                                    {product.size_price > 0 && (
                                                                        <div className="flex justify-between">
                                                                            <span className="text-gray-600">Acréscimo tamanho ({product.size}):</span>
                                                                            <span className="font-medium">+{formatCurrency(product.size_price || 0)}</span>
                                                                        </div>
                                                                    )}
                                                                    {product.embroidery_cost > 0 && (
                                                                        <div className="flex justify-between">
                                                                            <span className="text-gray-600">Custo bordado:</span>
                                                                            <span className="font-medium">+{formatCurrency(product.embroidery_cost || 0)}</span>
                                                                        </div>
                                                                    )}
                                                                    <div className="border-t border-gray-300 pt-2 flex justify-between font-bold">
                                                                        <span className="text-gray-800">Valor unitário:</span>
                                                                        <span className="text-green-600">{formatCurrency(product.unit_total || 0)}</span>
                                                                    </div>
                                                                    <div className="flex justify-between font-bold text-lg">
                                                                        <span className="text-gray-800">Total (× {product.quantity}):</span>
                                                                        <span className="text-green-600">{formatCurrency(product.total_price || 0)}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Products Summary */}
                                            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                                                <h4 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                                                    📊 Resumo dos Produtos
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="text-center">
                                                        <div className="text-2xl font-bold text-green-600">
                                                            {sale.products.length}
                                                        </div>
                                                        <div className="text-sm text-green-700">
                                                            {sale.products.length === 1 ? 'Produto' : 'Produtos'} diferentes
                                                        </div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-2xl font-bold text-green-600">
                                                            {sale.products.reduce((sum, product) => sum + parseInt(product.quantity || 1), 0)}
                                                        </div>
                                                        <div className="text-sm text-green-700">
                                                            Unidades no total
                                                        </div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-2xl font-bold text-green-600">
                                                            {formatCurrency(sale.products.reduce((sum, product) => sum + parseFloat(product.total_price || 0), 0))}
                                                        </div>
                                                        <div className="text-sm text-green-700">
                                                            Subtotal produtos
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        // Fallback for older sales without detailed product data
                                        <div className="space-y-4">
                                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <span className="text-amber-500 text-2xl">ℹ️</span>
                                                    <h4 className="font-bold text-amber-800">Informações Básicas do Produto</h4>
                                                </div>
                                                <p className="text-amber-700 text-sm mb-4">
                                                    Esta venda foi registrada antes da implementação do sistema detalhado de produtos. 
                                                    Apenas informações básicas estão disponíveis.
                                                </p>
                                            </div>

                                            {sale.product_category && (
                                                <div className="detail-item">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                                                            📂
                                                        </div>
                                                        <div>
                                                            <dt className="text-sm text-gray-500 font-medium">Categoria</dt>
                                                            <dd className="text-lg font-bold text-gray-900">
                                                                {sale.product_category?.name || 'Não informado'}
                                                            </dd>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {sale.product_size && (
                                                <div className="detail-item">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold">
                                                            📏
                                                        </div>
                                                        <div>
                                                            <dt className="text-sm text-gray-500 font-medium">Tamanho</dt>
                                                            <dd className="text-lg font-bold text-gray-900">
                                                                {sale.product_size} ({sale.product_size === 'P' ? 'Pequeno' : sale.product_size === 'M' ? 'Médio' : sale.product_size === 'G' ? 'Grande' : 'Extra Grande'})
                                                            </dd>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {sale.product_price && (
                                                <div className="detail-item">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center text-white font-bold">
                                                            💰
                                                        </div>
                                                        <div>
                                                            <dt className="text-sm text-gray-500 font-medium">Preço Base do Produto</dt>
                                                            <dd className="text-lg font-bold text-gray-900">
                                                                {formatCurrency(sale.product_price)}
                                                            </dd>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Embroidery Information */}
                                            {sale.embroidery_type && (
                                                <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <span className="text-purple-500 text-2xl">✨</span>
                                                        <h4 className="font-bold text-purple-800">Informações do Bordado</h4>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {sale.embroidery_type && (
                                                            <div>
                                                                <dt className="text-sm text-purple-600 font-medium">Tipo</dt>
                                                                <dd className="text-base font-semibold text-purple-800 capitalize">
                                                                    {sale.embroidery_type === 'text' ? 'Texto' : sale.embroidery_type === 'design' ? 'Desenho' : 'Texto + Desenho'}
                                                                </dd>
                                                            </div>
                                                        )}

                                                        {sale.embroidery_text && (
                                                            <div>
                                                                <dt className="text-sm text-purple-600 font-medium">Texto</dt>
                                                                <dd className="text-base font-semibold text-purple-800">
                                                                    "{sale.embroidery_text}"
                                                                </dd>
                                                            </div>
                                                        )}

                                                        {sale.embroidery_position && (
                                                            <div>
                                                                <dt className="text-sm text-purple-600 font-medium">Posição</dt>
                                                                <dd className="text-base font-semibold text-purple-800 capitalize">
                                                                    {sale.embroidery_position}
                                                                </dd>
                                                            </div>
                                                        )}

                                                        {sale.embroidery_color && (
                                                            <div>
                                                                <dt className="text-sm text-purple-600 font-medium">Cor</dt>
                                                                <dd className="text-base font-semibold text-purple-800 capitalize">
                                                                    {sale.embroidery_color}
                                                                </dd>
                                                            </div>
                                                        )}

                                                        {sale.embroidery_font && (
                                                            <div>
                                                                <dt className="text-sm text-purple-600 font-medium">Fonte</dt>
                                                                <dd className="text-base font-semibold text-purple-800 capitalize">
                                                                    {sale.embroidery_font}
                                                                </dd>
                                                            </div>
                                                        )}

                                                        {sale.embroidery_design && (
                                                            <div>
                                                                <dt className="text-sm text-purple-600 font-medium">Desenho</dt>
                                                                <dd className="text-base font-semibold text-purple-800">
                                                                    {sale.embroidery_design.name}
                                                                </dd>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Child Name if available */}
                                            {sale.child_name && (
                                                <div className="detail-item">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full flex items-center justify-center text-white font-bold">
                                                            👶
                                                        </div>
                                                        <div>
                                                            <dt className="text-sm text-gray-500 font-medium">Nome da Criança</dt>
                                                            <dd className="text-lg font-bold text-gray-900">
                                                                {sale.child_name}
                                                            </dd>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Delivery Address */}
                                <div className="detail-card animate-fade-in">
                                    <div className="section-title">
                                        <div className="section-icon">
                                            📦
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-800">
                                            Endereço de Entrega
                                        </h3>
                                    </div>
                                    
                                    {sale.delivery_address ? (
                                        // Address is provided
                                        <div className="space-y-4">
                                            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-green-500 text-lg">✅</span>
                                                    <span className="font-medium text-green-800">Endereço Confirmado pelo Cliente</span>
                                                </div>
                                                <p className="text-green-700 text-sm">
                                                    Cliente preencheu o endereço de entrega completo.
                                                </p>
                                            </div>
                                            
                                            <div className="detail-item">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold">
                                                        🏠
                                                    </div>
                                                    <div className="flex-1">
                                                        <dt className="text-sm text-gray-500 font-medium">Endereço Completo</dt>
                                                        <dd className="text-lg font-bold text-gray-900 mb-1">
                                                            {sale.delivery_address}, {sale.delivery_number}
                                                        </dd>
                                                        {sale.delivery_complement && (
                                                            <dd className="text-sm text-gray-600 mb-1">
                                                                {sale.delivery_complement}
                                                            </dd>
                                                        )}
                                                        <dd className="text-sm text-gray-600">
                                                            {sale.delivery_neighborhood} - {sale.delivery_city}/{sale.delivery_state}
                                                        </dd>
                                                        <dd className="text-sm text-gray-600 font-mono">
                                                            CEP: {sale.delivery_zipcode}
                                                        </dd>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        // Address not provided yet
                                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="text-amber-500 text-2xl">⚠️</span>
                                                <div>
                                                    <h4 className="font-bold text-amber-800">Endereço Pendente</h4>
                                                    <p className="text-amber-700 text-sm">
                                                        Cliente ainda não preencheu o endereço de entrega.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="bg-amber-100 border border-amber-300 rounded-lg p-3">
                                                <p className="text-sm text-amber-800">
                                                    <strong>📋 Próximos passos:</strong><br />
                                                    • Cliente receberá link para preencher endereço<br />
                                                    • Endereço é obrigatório para finalizar pedido<br />
                                                    • Status será atualizado quando cliente completar
                                                </p>
                                            </div>
                                            {sale.unique_token && (
                                                <div className="mt-3 pt-3 border-t border-amber-300">
                                                    <p className="text-xs text-amber-700">
                                                        <strong>Link do cliente:</strong> /pedido/{sale.unique_token}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Financial Details */}
                                <div className="detail-card animate-fade-in">
                                    <div className="section-title">
                                        <div className="section-icon">
                                            <i className="fas fa-dollar-sign"></i>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-800">
                                            💰 Valores Financeiros
                                        </h3>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="detail-item">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-500 font-medium">💵 Valor Total do Pedido</span>
                                                <span className="text-lg font-bold text-gray-900">{formatCurrency(sale.total_amount)}</span>
                                            </div>
                                        </div>

                                        <div className="detail-item">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-500 font-medium">🚚 Valor do Frete</span>
                                                <span className="text-lg font-bold text-gray-900">{formatCurrency(sale.shipping_amount)}</span>
                                            </div>
                                        </div>

                                        <div className="value-display">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-green-600 font-bold">✅ Valor Recebido</span>
                                                <span className="text-2xl font-bold text-green-600">{formatCurrency(sale.received_amount)}</span>
                                            </div>
                                        </div>

                                        {/* Pending Amount */}
                                        {(parseFloat(sale.total_amount) + parseFloat(sale.shipping_amount || 0)) > parseFloat(sale.received_amount) && (
                                            <div className="pending-amount-highlight">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-orange-600 font-bold">⏳ Valor Pendente</span>
                                                    <span className="text-xl font-bold text-orange-600">
                                                        {formatCurrency((parseFloat(sale.total_amount) + parseFloat(sale.shipping_amount || 0)) - parseFloat(sale.received_amount))}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-orange-500 mt-2">
                                                    (Total com frete - valor recebido)
                                                </p>
                                            </div>
                                        )}

                                        <div className="commission-highlight">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-blue-600 font-bold">📈 Base para Comissão</span>
                                                <span className="text-xl font-bold text-blue-600">{formatCurrency(sale.total_amount)}</span>
                                            </div>
                                            <p className="text-xs text-blue-500 mt-2">
                                                (Valor total dos produtos - frete não incluído)
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            {sale.notes && (
                                <div className="detail-card animate-fade-in">
                                    <div className="section-title">
                                        <div className="section-icon">
                                            <i className="fas fa-sticky-note"></i>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-800">
                                            📝 Observações
                                        </h3>
                                    </div>
                                    <div className="notes-display">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                                                💭
                                            </div>
                                            <p className="text-gray-700 font-medium leading-relaxed">
                                                {sale.notes}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Payment Receipt */}
                            {(sale.payment_receipt || sale.receipt_data) && (
                                <div className="detail-card animate-fade-in">
                                    <div className="section-title">
                                        <div className="section-icon">
                                            <i className="fas fa-file-upload"></i>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-800">
                                            📎 Comprovante de Pagamento
                                        </h3>
                                    </div>
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                                        {sale.receipt_data ? (
                                            // If we have base64 data, display the image directly
                                            <div className="text-center">
                                                <h4 className="font-bold text-gray-800 mb-4">
                                                    📄 Comprovante de Pagamento
                                                </h4>
                                                <img 
                                                    src={sale.receipt_data} 
                                                    alt="Comprovante de Pagamento" 
                                                    className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
                                                    style={{maxHeight: '600px'}}
                                                />
                                            </div>
                                        ) : (
                                            // Fallback to the old method
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full flex items-center justify-center text-white text-2xl">
                                                    <i className="fas fa-file-pdf"></i>
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-gray-800 mb-2">
                                                        📄 Comprovante Anexado
                                                    </h4>
                                                    <p className="text-gray-600 text-sm mb-4">
                                                        Clique no botão abaixo para visualizar o comprovante de pagamento
                                                    </p>
                                                    <a
                                                        href={`/storage/${sale.payment_receipt}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn-gradient"
                                                    >
                                                        <i className="fas fa-external-link-alt"></i>
                                                        Ver Comprovante
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Status History */}
                            <div className="detail-card animate-fade-in">
                                <div className="section-title">
                                    <div className="section-icon">
                                        <i className="fas fa-history"></i>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800">
                                        🕐 Histórico da Venda
                                    </h3>
                                </div>

                                <div className="space-y-4">
                                    {/* Created */}
                                    <div className="timeline-item">
                                        <div className="timeline-dot">
                                            ✨
                                        </div>
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <h4 className="font-bold text-blue-900 mb-1">Venda Registrada</h4>
                                            <p className="text-blue-700 text-sm">
                                                📅 {formatDateTime(sale.created_at)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Approval */}
                                    {sale.status === 'aprovado' && sale.approved_by && (
                                        <div className="timeline-item">
                                            <div className="timeline-dot">
                                                ✅
                                            </div>
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                                <h4 className="font-bold text-green-900 mb-1">Venda Aprovada! 🎉</h4>
                                                <p className="text-green-700 text-sm mb-2">
                                                    📅 {formatDateTime(sale.approved_at)}
                                                </p>
                                                <p className="text-green-700 text-sm">
                                                    👨‍💼 Aprovada por: {sale.approved_by.name}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Rejection */}
                                    {sale.status === 'recusado' && sale.rejected_by && (
                                        <div className="timeline-item">
                                            <div className="timeline-dot">
                                                ❌
                                            </div>
                                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                                <h4 className="font-bold text-red-900 mb-1">Venda Recusada</h4>
                                                <p className="text-red-700 text-sm mb-2">
                                                    📅 {formatDateTime(sale.rejected_at)}
                                                </p>
                                                <p className="text-red-700 text-sm mb-2">
                                                    👨‍💼 Recusada por: {sale.rejected_by.name}
                                                </p>
                                                {sale.rejection_reason && (
                                                    <div className="bg-red-100 border border-red-300 rounded-lg p-3 mt-3">
                                                        <p className="text-sm font-bold text-red-900 mb-1">💬 Motivo da recusa:</p>
                                                        <p className="text-sm text-red-700">{sale.rejection_reason}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Back Button */}
                            <div className="flex justify-center mt-8">
                                <button
                                    onClick={() => window.history.back()}
                                    className="btn-back"
                                >
                                    <i className="fas fa-arrow-left"></i>
                                    Voltar às Vendas
                                </button>
                            </div>

                            {/* Motivational Footer */}
                            <div className="mt-8 bg-gradient-to-r from-pink-50 to-yellow-50 border border-pink-200 rounded-xl p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-yellow-400 rounded-full flex items-center justify-center text-white text-xl">
                                        🎯
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800 mb-1">
                                            Continue assim, vendedora! 💪
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            Cada venda registrada é um passo importante na sua jornada de sucesso. 
                                            Você está construindo algo incrível! ✨
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>

            {/* Font Awesome Icons */}
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
            />
        </>
    );
}