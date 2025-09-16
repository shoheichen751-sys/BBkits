import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import SaleCancellationModal from '@/Components/SaleCancellationModal';
import ResponsiveTable from '@/Components/ResponsiveTable';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { formatBRL } from '@/utils/currency';

export default function Index({ sales, auth }) {
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [saleToCancel, setSaleToCancel] = useState(null);
    const { post, processing } = useForm({});

    const handleCancelClick = (sale) => {
        setSaleToCancel(sale);
        setShowCancelModal(true);
    };

    const handleCancelConfirm = ({ password, explanation }) => {
        if (saleToCancel) {
            console.log('Attempting to cancel sale:', {
                saleId: saleToCancel.id,
                url: `/sales/${saleToCancel.id}/cancel`,
                passwordLength: password ? password.length : 0,
                explanationLength: explanation ? explanation.length : 0
            });

            post(`/sales/${saleToCancel.id}/cancel`, {
                admin_password: password,
                explanation: explanation
            }, {
                onSuccess: () => {
                    toast.success('Venda cancelada com sucesso!');
                    setShowCancelModal(false);
                    setSaleToCancel(null);
                },
                onError: (errors) => {
                    console.error('Cancel request failed:', errors);
                    console.error('Response status:', errors.response?.status);
                    console.error('Response headers:', errors.response?.headers);

                    if (errors.admin_password) {
                        toast.error('Senha do administrador incorreta.');
                    } else if (errors.explanation) {
                        toast.error('Explicação inválida.');
                    } else if (errors.error) {
                        toast.error('Erro ao cancelar a venda.');
                    } else {
                        toast.error('Erro ao cancelar a venda.');
                    }
                }
            });
        }
    };

    const handleCancelModalClose = () => {
        setShowCancelModal(false);
        setSaleToCancel(null);
    };

    const getStatusBadge = (status) => {
        const badges = {
            pendente: 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300',
            aprovado: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300',
            recusado: 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300',
            cancelado: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300',
            estornado: 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300'
        };
        
        const labels = {
            pendente: 'Pendente',
            aprovado: 'Aprovado',
            recusado: 'Recusado',
            cancelado: 'Cancelado',
            estornado: 'Estornado'
        };

        const icons = {
            pendente: '⏳',
            aprovado: '✅',
            recusado: '❌',
            cancelado: '⚪',
            estornado: '🔄'
        };

        return (
            <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${badges[status]} shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105`}>
                <span>{icons[status]}</span>
                {labels[status]}
            </span>
        );
    };

    // Use the centralized Brazilian currency formatter
    const formatCurrency = formatBRL;

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('pt-BR');
    };

    return (
        <>
            <Head title="Vendas" />

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

                .sales-bg {
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

                .table-row {
                    transition: all 0.3s ease;
                    border-radius: 15px;
                    margin: 8px 0;
                }

                .table-row:hover {
                    background: var(--gradient-soft) !important;
                    transform: translateX(5px);
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
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

                .action-btn {
                    padding: 8px 16px;
                    border-radius: 10px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    text-decoration: none;
                    display: inline-block;
                    margin: 2px;
                }

                .action-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                }

                .action-btn-view {
                    background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
                    color: white;
                }

                .action-btn-edit {
                    background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
                    color: white;
                }

                .action-btn-delete {
                    background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
                    color: white;
                }

                .action-btn-payment {
                    background: linear-gradient(135deg, #10B981 0%, #059669 100%);
                    color: white;
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

                .table-header {
                    background: var(--gradient);
                    color: white;
                    border-radius: 15px 15px 0 0;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .empty-state {
                    background: var(--gradient-soft);
                    border-radius: 25px;
                    padding: 60px 40px;
                    text-align: center;
                    box-shadow: var(--shadow);
                    border: 2px solid transparent;
                    transition: all 0.3s ease;
                }

                .empty-state:hover {
                    border-color: var(--primary-color);
                    box-shadow: var(--shadow-hover);
                }

                .pagination-btn {
                    border-radius: 10px;
                    transition: all 0.3s ease;
                    font-weight: 500;
                }

                .pagination-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                }

                .pagination-active {
                    background: var(--gradient) !important;
                    color: white !important;
                }
            `}</style>

            {/* Floating particles */}
            <div className="floating-particles">
                {Array.from({ length: 15 }, (_, i) => (
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
                                    <i className="fas fa-chart-line"></i>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold leading-tight">
                                        💼 Minhas Vendas
                                    </h2>
                                    <p className="text-white/80 text-sm">
                                        Gerencie suas vendas com elegância
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Link href="/sales/create-expanded">
                                    <button className="btn-gradient text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition duration-300">
                                        <i className="fas fa-plus-circle mr-2"></i>
                                        Nova Venda Completa
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                }
            >
                <div className="sales-bg relative z-10">
                    <div className="py-12">
                        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                            <div className="card-gradient overflow-hidden">
                                <div className="p-8 text-gray-900">
                                    {sales.data.length === 0 ? (
                                        <div className="empty-state">
                                            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-pink-100 to-yellow-100 rounded-full flex items-center justify-center">
                                                <i className="fas fa-shopping-bag text-4xl text-pink-500"></i>
                                            </div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                                Nenhuma venda registrada ainda! 🌟
                                            </h3>
                                            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                                                Que tal começar sua jornada de sucesso registrando sua primeira venda? 
                                                Cada grande vendedora começou com uma única venda! 💪
                                            </p>
                                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                                <Link href="/sales/create-expanded">
                                                    <button className="btn-gradient text-white px-10 py-4 rounded-full text-lg font-bold shadow-xl hover:shadow-2xl">
                                                        <i className="fas fa-rocket mr-3"></i>
                                                        Registrar Primeira Venda
                                                    </button>
                                                </Link>
                                                <button className="bg-white/80 text-gray-700 hover:bg-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition duration-300 border border-gray-200">
                                                    <i className="fas fa-question-circle mr-2"></i>
                                                    Como Funciona?
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <div className="mb-6 bg-gradient-to-r from-pink-50 to-yellow-50 border border-pink-200 rounded-xl p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-yellow-400 rounded-full flex items-center justify-center">
                                                        <i className="fas fa-chart-bar text-white"></i>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-800">
                                                            Total de {sales.data.length} vendas registradas
                                                        </h3>
                                                        <p className="text-sm text-gray-600">
                                                            Continue assim! Cada venda te aproxima do sucesso! 🎯
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <ResponsiveTable
                                                data={sales.data}
                                                keyField="id"
                                                columns={[
                                                    {
                                                        header: 'Cliente',
                                                        accessor: 'client_name',
                                                        render: (sale) => (
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-yellow-400 rounded-full flex items-center justify-center text-white font-bold">
                                                                    {sale.client_name.charAt(0).toUpperCase()}
                                                                </div>
                                                                <span className="font-semibold">{sale.client_name}</span>
                                                            </div>
                                                        )
                                                    },
                                                    {
                                                        header: 'Valor Total',
                                                        accessor: 'total_amount',
                                                        render: (sale) => <span className="font-bold text-green-600">{formatCurrency(sale.total_amount)}</span>,
                                                        mobileQuickView: true
                                                    },
                                                    {
                                                        header: 'Valor Recebido',
                                                        accessor: 'received_amount',
                                                        render: (sale) => <span className="font-bold text-blue-600">{formatCurrency(sale.received_amount)}</span>
                                                    },
                                                    {
                                                        header: 'Data Pagamento',
                                                        accessor: 'payment_date',
                                                        render: (sale) => <span className="text-gray-600 font-medium">📅 {formatDate(sale.payment_date)}</span>
                                                    },
                                                    {
                                                        header: 'Status',
                                                        accessor: 'status',
                                                        render: (sale) => getStatusBadge(sale.status),
                                                        mobileQuickView: true
                                                    },
                                                    {
                                                        header: 'Ações',
                                                        accessor: 'actions',
                                                        render: (sale) => (
                                                            <div className="flex gap-2">
                                                                <Link 
                                                                    href={`/sales/${sale.id}`}
                                                                    className="action-btn action-btn-view"
                                                                >
                                                                    <i className="fas fa-eye mr-1"></i>
                                                                    Ver
                                                                </Link>
                                                                <Link 
                                                                    href={`/sales/${sale.id}/payments`}
                                                                    className="action-btn action-btn-payment"
                                                                    title="Gerenciar Pagamentos"
                                                                >
                                                                    <i className="fas fa-dollar-sign mr-1"></i>
                                                                    Pagamentos
                                                                </Link>
                                                                {sale.unique_token && (
                                                                    <button
                                                                        onClick={() => {
                                                                            const url = `${window.location.origin}/pedido/${sale.unique_token}`;
                                                                            navigator.clipboard.writeText(url);
                                                                            toast.success('Link do cliente copiado!');
                                                                        }}
                                                                        className="action-btn bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                                                                        title="Copiar link do cliente"
                                                                    >
                                                                        <i className="fas fa-link mr-1"></i>
                                                                        Link
                                                                    </button>
                                                                )}
                                                                {sale.status === 'pendente' && (
                                                                    <Link 
                                                                        href={`/sales/${sale.id}/edit`}
                                                                        className="action-btn action-btn-edit"
                                                                    >
                                                                        <i className="fas fa-edit mr-1"></i>
                                                                        Editar
                                                                    </Link>
                                                                )}
                                                                {/* Show cancel button for all users but require admin password */}
                                                                {sale.status !== 'cancelado' && (
                                                                    <button
                                                                        onClick={() => handleCancelClick(sale)}
                                                                        className="action-btn action-btn-delete"
                                                                        title="Cancelar venda (requer senha do administrador)"
                                                                    >
                                                                        <i className="fas fa-ban mr-1"></i>
                                                                        Cancelar
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )
                                                    }
                                                ]}
                                            />

                                            {/* Pagination */}
                                            {sales.links && sales.links.length > 0 && (
                                                <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg">
                                                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                                        <div className="text-sm text-gray-700 font-medium bg-gray-50 px-4 py-2 rounded-full">
                                                            📊 Mostrando {sales.from} a {sales.to} de {sales.total} resultados
                                                        </div>
                                                        <div className="flex gap-2">
                                                            {sales.links.filter(link => link && link.url !== null).map((link, index) => (
                                                                link.url ? (
                                                                    <Link
                                                                        key={index}
                                                                        href={link.url}
                                                                        className={`pagination-btn px-4 py-2 text-sm ${
                                                                            link.active 
                                                                                ? 'pagination-active' 
                                                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                                        }`}
                                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                                    />
                                                                ) : (
                                                                    <span
                                                                        key={index}
                                                                        className="pagination-btn px-4 py-2 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                                    />
                                                                )
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>

            <SaleCancellationModal
                show={showCancelModal}
                onClose={handleCancelModalClose}
                onConfirm={handleCancelConfirm}
                sale={saleToCancel}
                processing={processing}
            />

            {/* Font Awesome Icons */}
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
            />
        </>
    );
}