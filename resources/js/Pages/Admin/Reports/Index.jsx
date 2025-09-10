import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SalesModal from '@/Components/SalesModal';

export default function ReportsIndex({ salesData, commissionData, totalStats }) {
    const { auth } = usePage().props;
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedSeller, setSelectedSeller] = useState(null);
    const [selectedSellerSales, setSelectedSellerSales] = useState([]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(amount);
    };

    const getCommissionLevel = (totalBase) => {
        if (totalBase >= 60000) return { level: 'Elite', color: 'bg-gradient-to-r from-purple-500 to-pink-500', icon: '👑' };
        if (totalBase >= 50000) return { level: 'Avançada', color: 'bg-gradient-to-r from-blue-500 to-cyan-500', icon: '🏆' };
        if (totalBase >= 40000) return { level: 'Intermediária', color: 'bg-gradient-to-r from-green-500 to-emerald-500', icon: '⭐' };
        return { level: 'Iniciante', color: 'bg-gradient-to-r from-gray-400 to-gray-600', icon: '🌟' };
    };

    const months = [
        { value: 1, label: 'Janeiro' },
        { value: 2, label: 'Fevereiro' },
        { value: 3, label: 'Março' },
        { value: 4, label: 'Abril' },
        { value: 5, label: 'Maio' },
        { value: 6, label: 'Junho' },
        { value: 7, label: 'Julho' },
        { value: 8, label: 'Agosto' },
        { value: 9, label: 'Setembro' },
        { value: 10, label: 'Outubro' },
        { value: 11, label: 'Novembro' },
        { value: 12, label: 'Dezembro' }
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 3 }, (_, i) => currentYear - i);

    const handleExport = (type) => {
        const url = `/admin/export/${type}?month=${selectedMonth}&year=${selectedYear}`;
        window.open(url, '_blank');
    };

    const handleViewSales = async (seller) => {
        setSelectedSeller(seller);
        // Use real sales data from the backend
        setSelectedSellerSales(seller.sales || []);
        setModalOpen(true);
    };

    return (
        <>
            <Head title="Relatórios de Vendas e Comissões - BBKits" />

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
                    --shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
                    --shadow-hover: 0 25px 50px rgba(0, 0, 0, 0.2);
                }

                * {
                    font-family: 'Poppins', sans-serif;
                }

                .reports-bg {
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

                .seller-card {
                    background: white;
                    border-radius: 20px;
                    padding: 24px;
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
                    border: 2px solid transparent;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }

                .seller-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
                    border-color: var(--primary-color);
                }

                .level-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 16px;
                    border-radius: 20px;
                    color: white;
                    font-weight: 600;
                    font-size: 14px;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }

                .export-btn {
                    background: var(--gradient);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    padding: 12px 24px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }

                .export-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
                }

                .filter-select {
                    background: white;
                    border: 2px solid #E5E7EB;
                    border-radius: 12px;
                    padding: 12px 16px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                }

                .filter-select:focus {
                    outline: none;
                    border-color: var(--primary-color);
                    box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.1);
                }

                .progress-bar {
                    background: var(--gradient);
                    height: 8px;
                    border-radius: 4px;
                    transition: width 1s ease;
                }

                .table-row {
                    transition: all 0.3s ease;
                }

                .table-row:hover {
                    background: var(--gradient-soft) !important;
                    transform: translateX(4px);
                }
            `}</style>

            <AuthenticatedLayout
                header={
                    <div className="header-gradient">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl backdrop-blur-sm">
                                    📊
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold leading-tight">
                                        Relatórios de Vendas e Comissões
                                    </h2>
                                    <p className="text-white/80 text-lg">
                                        Visão detalhada por vendedora e período
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleExport('sales')}
                                    className="export-btn"
                                >
                                    📊 Exportar Vendas
                                </button>
                                <button
                                    onClick={() => handleExport('commissions')}
                                    className="export-btn"
                                >
                                    💰 Exportar Comissões
                                </button>
                            </div>
                        </div>
                    </div>
                }
            >
                <div className="reports-bg">
                    <div className="py-12">
                        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                            
                            {/* Filter Section */}
                            <div className="card-gradient p-6 mb-8">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-gray-800">Filtros</h3>
                                    <div className="flex gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Mês</label>
                                            <select
                                                value={selectedMonth}
                                                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                                className="filter-select"
                                            >
                                                {months.map(month => (
                                                    <option key={month.value} value={month.value}>
                                                        {month.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Ano</label>
                                            <select
                                                value={selectedYear}
                                                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                                className="filter-select"
                                            >
                                                {years.map(year => (
                                                    <option key={year} value={year}>
                                                        {year}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Statistics Cards */}
                            <div className="grid gap-8 mb-8 md:grid-cols-2 xl:grid-cols-4">
                                <div className="stat-card bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl">
                                            👥
                                        </div>
                                        <div>
                                            <p className="text-sm text-blue-600 font-medium">Total Vendedoras</p>
                                            <p className="text-2xl font-bold text-blue-800">{totalStats?.totalSellers || 0}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="stat-card bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl">
                                            💰
                                        </div>
                                        <div>
                                            <p className="text-sm text-green-600 font-medium">Total Vendas</p>
                                            <p className="text-2xl font-bold text-green-800">{formatCurrency(totalStats?.totalSaleValue || 0)}</p>
                                            <p className="text-xs text-green-500">Recebido: {formatCurrency(totalStats?.totalReceivedAmount || 0)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="stat-card bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white text-xl">
                                            🎯
                                        </div>
                                        <div>
                                            <p className="text-sm text-purple-600 font-medium">Total Comissões</p>
                                            <p className="text-2xl font-bold text-purple-800">{formatCurrency(totalStats?.totalCommissions || 0)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="stat-card bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white text-xl">
                                            🏆
                                        </div>
                                        <div>
                                            <p className="text-sm text-orange-600 font-medium">Meta Atingida</p>
                                            <p className="text-2xl font-bold text-orange-800">{totalStats?.metaAchieved || 0}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sales by Seller */}
                            <div className="card-gradient p-8 mb-8">
                                <h3 className="text-2xl font-bold text-gray-800 mb-6">Vendas por Vendedora</h3>
                                <div className="grid gap-6">
                                    {salesData && salesData.length > 0 ? (
                                        salesData.map((seller, index) => {
                                            const level = getCommissionLevel(seller.commissionBase);
                                            const progressPercentage = Math.min((seller.commissionBase / 60000) * 100, 100);
                                            
                                            return (
                                                <div key={seller.id} className="seller-card">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xl font-bold">
                                                                {seller.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <h4 className="text-xl font-bold text-gray-800">{seller.name}</h4>
                                                                <div className={`level-badge ${level.color}`}>
                                                                    <span>{level.icon}</span>
                                                                    <span>{level.level}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-2xl font-bold text-green-600">
                                                                {formatCurrency(seller.totalSaleValue || seller.totalSales)}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {seller.salesCount} vendas
                                                            </div>
                                                            <div className="text-xs text-blue-600">
                                                                Recebido: {formatCurrency(seller.totalReceivedAmount || seller.totalSales)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Payment Status Information System */}
                                                    <div className="space-y-3 mb-4">
                                                        {/* 1. Total Sale Value */}
                                                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                                            <span className="text-sm font-medium text-gray-600">1. Valor Total das Vendas</span>
                                                            <span className="text-lg font-bold text-gray-800">{formatCurrency(seller.totalSaleValue || seller.totalSales)}</span>
                                                        </div>
                                                        
                                                        {/* 2. Total Received Amount */}
                                                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                                            <span className="text-sm font-medium text-blue-600">2. Valor Recebido</span>
                                                            <span className="text-lg font-bold text-blue-800">{formatCurrency(seller.totalReceivedAmount || seller.totalSales)}</span>
                                                        </div>
                                                        
                                                        {/* 3. Remaining Amount */}
                                                        <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                                                            <span className="text-sm font-medium text-red-600">3. Valor Restante</span>
                                                            <span className="text-lg font-bold text-red-800">{formatCurrency(seller.totalRemainingAmount || 0)}</span>
                                                        </div>
                                                        
                                                        {/* 4. Approved Sales Value */}
                                                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                                            <span className="text-sm font-medium text-green-600">4. Vendas Aprovadas (Valor)</span>
                                                            <span className="text-lg font-bold text-green-800">{formatCurrency(seller.approvedSaleValue || seller.approvedSales)}</span>
                                                        </div>
                                                        
                                                        {/* 5. Pending Sales Value */}
                                                        <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                                                            <span className="text-sm font-medium text-yellow-600">5. Vendas Pendentes (Valor)</span>
                                                            <span className="text-lg font-bold text-yellow-800">{formatCurrency(seller.pendingSaleValue || seller.pendingSales || 0)}</span>
                                                        </div>
                                                        
                                                        {/* 6. Total Shipping */}
                                                        <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
                                                            <span className="text-sm font-medium text-indigo-600">6. Total de Frete</span>
                                                            <span className="text-lg font-bold text-indigo-800">{formatCurrency(seller.totalShipping || 0)}</span>
                                                        </div>
                                                        
                                                        {/* 7. Commission Base */}
                                                        <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                                                            <span className="text-sm font-medium text-purple-600">7. Base de Comissão</span>
                                                            <span className="text-lg font-bold text-purple-800">{formatCurrency(seller.commissionBase)}</span>
                                                        </div>
                                                        
                                                        {/* 8. Total Commission */}
                                                        <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                                                            <span className="text-sm font-medium text-orange-600">8. Comissão Total ({seller.commissionRate}%)</span>
                                                            <span className="text-lg font-bold text-orange-800">{formatCurrency(seller.totalCommission)}</span>
                                                        </div>
                                                        
                                                        {/* 9. View All Sales Button */}
                                                        <button
                                                            onClick={() => handleViewSales(seller)}
                                                            className="w-full p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                            </svg>
                                                            9. Ver Todas as Vendas
                                                        </button>
                                                    </div>
                                                    
                                                    <div className="mt-4">
                                                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                                                            <span>Progresso para Elite (R$ 60.000)</span>
                                                            <span>{progressPercentage.toFixed(1)}%</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div 
                                                                className="progress-bar rounded-full h-2"
                                                                style={{ width: `${progressPercentage}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <span className="text-4xl">📊</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-800 mb-2">Nenhuma venda encontrada</h3>
                                            <p className="text-gray-600">Não há vendas registradas para o período selecionado.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Export Section */}
                            <div className="card-gradient p-8 text-center">
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">Exportar Relatórios</h3>
                                <p className="text-gray-600 mb-6">Baixe relatórios detalhados em formato Excel/CSV</p>
                                <div className="flex justify-center gap-4">
                                    <button
                                        onClick={() => handleExport('sales')}
                                        className="export-btn flex items-center gap-2"
                                    >
                                        <span>📊</span>
                                        Exportar Vendas
                                    </button>
                                    <button
                                        onClick={() => handleExport('commissions')}
                                        className="export-btn flex items-center gap-2"
                                    >
                                        <span>💰</span>
                                        Exportar Comissões
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
            
            {/* Sales Modal */}
            <SalesModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                sales={selectedSellerSales}
                sellerName={selectedSeller?.name || ''}
            />
        </>
    );
}