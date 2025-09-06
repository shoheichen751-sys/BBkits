import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { formatBRL } from '@/utils/currency';
import toast from 'react-hot-toast';

export default function Index({ sales }) {
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedSale, setSelectedSale] = useState(null);

    const { data, setData, post, processing, reset } = useForm({
        rejection_reason: ''
    });

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
            <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${config.bg} ${config.text} border-2 ${config.border} ${config.glow} shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105`}>
                <span className="text-base">{config.icon}</span>
                {labels[status]}
            </span>
        );
    };

    // Use centralized currency formatting

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('pt-BR');
    };

    const handleApprove = (sale) => {
        post(route('admin.sales.approve', sale.id), {
            onSuccess: () => {
                toast.success('Venda aprovada com sucesso! 🎉');
            },
            onError: () => {
                toast.error('Erro ao aprovar venda.');
            }
        });
    };

    const handleReject = (sale) => {
        setSelectedSale(sale);
        setShowRejectModal(true);
    };

    const submitRejection = (e) => {
        e.preventDefault();
        post(route('admin.sales.reject', selectedSale.id), {
            onSuccess: () => {
                toast.success('Venda recusada com sucesso.');
                setShowRejectModal(false);
                setSelectedSale(null);
                reset();
            },
            onError: () => {
                toast.error('Erro ao recusar venda.');
            }
        });
    };

    const pendingSales = sales.data.filter(sale => sale.status === 'pendente').length;
    const approvedSales = sales.data.filter(sale => sale.status === 'aprovado').length;
    const rejectedSales = sales.data.filter(sale => sale.status === 'recusado').length;

    return (
        <>
            <Head title="Painel Financeiro - BBKits" />

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

                .admin-bg {
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

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 24px;
                    margin-bottom: 32px;
                }

                .stat-card {
                    border-radius: 20px;
                    padding: 24px;
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
                    border: 2px solid transparent;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }

                .stat-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    transition: all 0.3s ease;
                }

                .stat-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
                }

                .stat-card.pending {
                    background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%);
                    border-color: #F59E0B;
                }

                .stat-card.pending::before {
                    background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
                }

                .stat-card.approved {
                    background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%);
                    border-color: #22C55E;
                }

                .stat-card.approved::before {
                    background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%);
                }

                .stat-card.rejected {
                    background: linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%);
                    border-color: #EF4444;
                }

                .stat-card.rejected::before {
                    background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
                }

                .table-row {
                    transition: all 0.3s ease;
                    border-radius: 12px;
                    margin: 4px 0;
                }

                .table-row:hover {
                    background: var(--gradient-soft) !important;
                    transform: translateX(8px);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
                }

                .action-btn {
                    padding: 8px 16px;
                    border-radius: 10px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    text-decoration: none;
                    display: inline-block;
                    margin: 2px;
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .action-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
                }

                .action-btn-view {
                    background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
                    color: white;
                }

                .action-btn-approve {
                    background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%);
                    color: white;
                }

                .action-btn-reject {
                    background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
                    color: white;
                }

                .action-btn-receipt {
                    background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
                    color: white;
                }

                .action-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
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
                    padding: 24px;
                    margin-bottom: 30px;
                    box-shadow: var(--shadow);
                    position: relative;
                    overflow: hidden;
                }

                .header-gradient::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="white" opacity="0.1"/><circle cx="80" cy="40" r="1" fill="white" opacity="0.1"/><circle cx="40" cy="80" r="1.5" fill="white" opacity="0.1"/></svg>');
                    animation: sparkle 20s linear infinite;
                }

                @keyframes sparkle {
                    0% { transform: translateY(0) rotate(0deg); }
                    100% { transform: translateY(-100px) rotate(360deg); }
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

                .modal-overlay {
                    background: rgba(0, 0, 0, 0.6);
                    backdrop-filter: blur(5px);
                }

                .modal-content {
                    background: var(--gradient-soft);
                    border-radius: 25px;
                    box-shadow: var(--shadow-hover);
                    border: 2px solid var(--primary-color);
                    animation: modalSlideIn 0.3s ease-out;
                }

                @keyframes modalSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-50px) scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                .modal-header {
                    background: var(--gradient);
                    color: white;
                    padding: 20px 24px;
                    border-radius: 23px 23px 0 0;
                    margin: -2px -2px 20px -2px;
                }

                .form-input {
                    background: white;
                    border: 2px solid #E5E7EB;
                    border-radius: 12px;
                    padding: 12px 16px;
                    transition: all 0.3s ease;
                    font-weight: 500;
                    width: 100%;
                }

                .form-input:focus {
                    outline: none;
                    border-color: var(--primary-color);
                    box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.1);
                    transform: translateY(-2px);
                }

                .btn-gradient {
                    background: var(--gradient);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                    border-radius: 12px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    padding: 12px 24px;
                    color: white;
                    border: none;
                    cursor: pointer;
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
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
                }

                .btn-cancel {
                    background: #F3F4F6;
                    color: #6B7280;
                    border: 2px solid #E5E7EB;
                    border-radius: 12px;
                    padding: 12px 24px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    cursor: pointer;
                }

                .btn-cancel:hover {
                    background: #E5E7EB;
                    transform: translateY(-2px);
                }

                .btn-danger {
                    background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    padding: 12px 24px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    transition: all 0.3s ease;
                    cursor: pointer;
                }

                .btn-danger:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3);
                }

                .btn-danger:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }
            `}</style>

            {/* Floating particles */}
            <div className="floating-particles">
                {Array.from({ length: 12 }, (_, i) => (
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
                        <div className="flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl backdrop-blur-sm">
                                    <i className="fas fa-chart-pie"></i>
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold leading-tight">
                                        💼 Painel Financeiro
                                    </h2>
                                    <p className="text-white/80 text-lg">
                                        Aprovação e gestão de vendas das vendedoras
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                                    <div className="text-2xl font-bold">{pendingSales}</div>
                                    <div className="text-sm text-white/80">Pendentes</div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            >
                <div className="admin-bg relative z-10">
                    <div className="py-12">
                        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                            
                            {/* Statistics Cards */}
                            <div className="stats-grid">
                                <div className="stat-card pending">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-white text-2xl">
                                            ⏳
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-yellow-800">{pendingSales}</h3>
                                            <p className="text-yellow-600 font-semibold">Vendas Pendentes</p>
                                            <p className="text-yellow-500 text-sm">Aguardando aprovação</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="stat-card approved">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center text-white text-2xl">
                                            ✅
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-green-800">{approvedSales}</h3>
                                            <p className="text-green-600 font-semibold">Vendas Aprovadas</p>
                                            <p className="text-green-500 text-sm">Processadas com sucesso</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="stat-card rejected">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-pink-400 rounded-full flex items-center justify-center text-white text-2xl">
                                            ❌
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-red-800">{rejectedSales}</h3>
                                            <p className="text-red-600 font-semibold">Vendas Recusadas</p>
                                            <p className="text-red-500 text-sm">Necessitam correção</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card-gradient overflow-hidden">
                                <div className="p-8 text-gray-900">
                                    {sales.data.length === 0 ? (
                                        <div className="empty-state">
                                            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                                                <i className="fas fa-chart-line text-4xl text-blue-500"></i>
                                            </div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                                Nenhuma venda registrada ainda! 📊
                                            </h3>
                                            <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto">
                                                As vendas das vendedoras aparecerão aqui quando forem registradas no sistema.
                                            </p>
                                            <div className="flex justify-center">
                                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl px-6 py-3">
                                                    <p className="text-blue-700 font-medium">
                                                        🔔 Aguardando registros das vendedoras
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-transparent hover:border-pink-200 transition-all duration-300">
                                                <table className="min-w-full">
                                                    <thead className="table-header">
                                                        <tr>
                                                            <th className="px-6 py-4 text-left text-sm font-bold">
                                                                <i className="fas fa-user-tie mr-2"></i>
                                                                Vendedora
                                                            </th>
                                                            <th className="px-6 py-4 text-left text-sm font-bold">
                                                                <i className="fas fa-user-heart mr-2"></i>
                                                                Cliente
                                                            </th>
                                                            <th className="px-6 py-4 text-left text-sm font-bold">
                                                                <i className="fas fa-money-bill-wave mr-2"></i>
                                                                Valor Total
                                                            </th>
                                                            <th className="px-6 py-4 text-left text-sm font-bold">
                                                                <i className="fas fa-hand-holding-usd mr-2"></i>
                                                                Valor Recebido
                                                            </th>
                                                            <th className="px-6 py-4 text-left text-sm font-bold">
                                                                <i className="fas fa-calendar-alt mr-2"></i>
                                                                Data Pagamento
                                                            </th>
                                                            <th className="px-6 py-4 text-left text-sm font-bold">
                                                                <i className="fas fa-flag mr-2"></i>
                                                                Status
                                                            </th>
                                                            <th className="px-6 py-4 text-left text-sm font-bold">
                                                                <i className="fas fa-cogs mr-2"></i>
                                                                Ações
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white">
                                                        {sales.data.map((sale, index) => (
                                                            <tr key={sale.id} className={`table-row ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                                                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                                                                            {sale.user.name.charAt(0).toUpperCase()}
                                                                        </div>
                                                                        {sale.user.name}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                                                            {sale.client_name.charAt(0).toUpperCase()}
                                                                        </div>
                                                                        {sale.client_name}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 text-sm font-bold text-green-600">
                                                                    {formatBRL(sale.total_amount)}
                                                                </td>
                                                                <td className="px-6 py-4 text-sm font-bold text-blue-600">
                                                                    {formatBRL(sale.received_amount)}
                                                                </td>
                                                                <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                                                    📅 {formatDate(sale.payment_date)}
                                                                </td>
                                                                <td className="px-6 py-4 text-sm">
                                                                    {getStatusBadge(sale.status)}
                                                                </td>
                                                                <td className="px-6 py-4 text-sm font-medium">
                                                                    <div className="flex flex-wrap gap-1">
                                                                        <Link 
                                                                            href={route('sales.show', sale.id)}
                                                                            className="action-btn action-btn-view"
                                                                        >
                                                                            <i className="fas fa-eye mr-1"></i>
                                                                            Ver
                                                                        </Link>
                                                                        {sale.status === 'pendente' && (
                                                                            <>
                                                                                <button
                                                                                    onClick={() => handleApprove(sale)}
                                                                                    className="action-btn action-btn-approve"
                                                                                    disabled={processing}
                                                                                >
                                                                                    <i className="fas fa-check mr-1"></i>
                                                                                    Aprovar
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => handleReject(sale)}
                                                                                    className="action-btn action-btn-reject"
                                                                                    disabled={processing}
                                                                                >
                                                                                    <i className="fas fa-times mr-1"></i>
                                                                                    Recusar
                                                                                </button>
                                                                            </>
                                                                        )}
                                                                        {(sale.payment_receipt || sale.receipt_data) && (
                                                                            sale.receipt_data ? (
                                                                                <button
                                                                                    onClick={() => {
                                                                                        // Create a more secure way to view base64 images
                                                                                        try {
                                                                                            const newWindow = window.open('', '_blank');
                                                                                            if (newWindow) {
                                                                                                newWindow.document.open();
                                                                                                newWindow.document.write(`
                                                                                                    <!DOCTYPE html>
                                                                                                    <html>
                                                                                                        <head>
                                                                                                            <title>Comprovante de Pagamento - ${sale.client_name}</title>
                                                                                                            <meta charset="UTF-8">
                                                                                                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                                                                                            <style>
                                                                                                                body { 
                                                                                                                    margin: 0; 
                                                                                                                    padding: 20px; 
                                                                                                                    text-align: center; 
                                                                                                                    background: #f5f5f5; 
                                                                                                                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                                                                                                                }
                                                                                                                h2 { color: #374151; margin-bottom: 20px; }
                                                                                                                img { 
                                                                                                                    max-width: 100%; 
                                                                                                                    height: auto; 
                                                                                                                    border-radius: 8px; 
                                                                                                                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                                                                                                                    background: white;
                                                                                                                    padding: 10px;
                                                                                                                }
                                                                                                                .info { color: #6B7280; margin-bottom: 15px; }
                                                                                                            </style>
                                                                                                        </head>
                                                                                                        <body>
                                                                                                            <h2>💰 Comprovante de Pagamento</h2>
                                                                                                            <div class="info"><strong>Cliente:</strong> ${sale.client_name}</div>
                                                                                                            <div class="info"><strong>Valor:</strong> ${formatBRL(sale.total_amount)}</div>
                                                                                                            <img src="${sale.receipt_data}" alt="Comprovante de Pagamento" />
                                                                                                        </body>
                                                                                                    </html>
                                                                                                `);
                                                                                                newWindow.document.close();
                                                                                            } else {
                                                                                                toast.error('Não foi possível abrir o comprovante. Verifique se o pop-up não foi bloqueado.');
                                                                                            }
                                                                                        } catch (error) {
                                                                                            console.error('Error opening receipt:', error);
                                                                                            toast.error('Erro ao abrir comprovante. Tente novamente.');
                                                                                        }
                                                                                    }}
                                                                                    className="action-btn action-btn-receipt"
                                                                                >
                                                                                    <i className="fas fa-file-image mr-1"></i>
                                                                                    Ver Comprovante
                                                                                </button>
                                                                            ) : (
                                                                                <a
                                                                                    href={`/storage/${sale.payment_receipt}`}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="action-btn action-btn-receipt"
                                                                                >
                                                                                    <i className="fas fa-file-pdf mr-1"></i>
                                                                                    Ver Comprovante
                                                                                </a>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

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

                            {/* Motivational Footer */}
                            <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xl">
                                        👨‍💼
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800 mb-1">
                                            Painel de controle financeiro! 💼
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            Gerencie as vendas com eficiência e transparência. 
                                            Cada aprovação impulsiona o sucesso das nossas vendedoras! ✨
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 modal-overlay overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                    <div className="modal-content w-full max-w-md">
                        <div className="modal-header">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">
                                    ❌
                                </div>
                                <h3 className="text-xl font-bold">
                                    Recusar Venda
                                </h3>
                            </div>
                        </div>
                        
                        <div className="p-6">
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 bg-red-400 rounded-full flex items-center justify-center text-white font-bold">
                                        <i className="fas fa-user"></i>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-red-900">Cliente: {selectedSale?.client_name}</p>
                                        <p className="text-red-700 text-sm">Valor: {selectedSale && formatBRL(selectedSale.received_amount)}</p>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={submitRejection}>
                                <div className="mb-6">
                                    <label htmlFor="rejection_reason" className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                        <i className="fas fa-comment-alt text-gray-500"></i>
                                        Motivo da recusa
                                    </label>
                                    <textarea
                                        id="rejection_reason"
                                        value={data.rejection_reason}
                                        onChange={(e) => setData('rejection_reason', e.target.value)}
                                        className="form-input"
                                        rows="4"
                                        required
                                        placeholder="Descreva detalhadamente o motivo da recusa para que a vendedora possa corrigir..."
                                    />
                                </div>
                                
                                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowRejectModal(false);
                                            setSelectedSale(null);
                                            reset();
                                        }}
                                        className="btn-cancel"
                                    >
                                        <i className="fas fa-times mr-2"></i>
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="btn-danger"
                                    >
                                        {processing ? (
                                            <>
                                                <i className="fas fa-spinner fa-spin mr-2"></i>
                                                Recusando...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-ban mr-2"></i>
                                                Recusar Venda
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Font Awesome Icons */}
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
            />
        </>
    );
}