import { Head, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useEffect, useState } from 'react';
import RankingDisplay from '@/Components/RankingDisplay';
import {
    LowStockAlertsWidget,
    ThreadInventoryWidget,
    ProductionStatusWidget,
    CostTrendsWidget,
    PurchaseSuggestionsWidget
} from '@/Components/Widgets';

export default function EnhancedDashboard({ 
    stats, 
    topPerformers, 
    recentSales, 
    monthlyData, 
    filterOptions, 
    currentFilters 
}) {
    const { auth } = usePage().props;
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
    const [refreshInterval, setRefreshInterval] = useState(30);
    const [activeTab, setActiveTab] = useState('overview');
    const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
    const [filters, setFilters] = useState({
        date_filter: currentFilters.date_filter || 'current_month',
        status_filter: currentFilters.status_filter || 'all',
        start_date: currentFilters.start_date || '',
        end_date: currentFilters.end_date || ''
    });

    // Apply filters
    const applyFilters = () => {
        const queryParams = new URLSearchParams();
        Object.keys(filters).forEach(key => {
            if (filters[key]) {
                queryParams.set(key, filters[key]);
            }
        });
        
        router.get('/admin/dashboard?' + queryParams.toString(), {}, {
            preserveState: true,
            preserveScroll: true,
            onStart: () => setIsRefreshing(true),
            onFinish: () => setIsRefreshing(false)
        });
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
        
        if (key === 'date_filter') {
            setShowCustomDatePicker(value === 'custom');
        }
    };

    const handleManualRefresh = () => {
        setIsRefreshing(true);
        router.reload({
            only: ['stats', 'topPerformers', 'recentSales', 'monthlyData'],
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setIsRefreshing(false);
            },
            onError: () => {
                setIsRefreshing(false);
            }
        });
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

    const getStatusBadge = (status) => {
        const badges = {
            pendente: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg',
            aprovado: 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg',
            recusado: 'bg-gradient-to-r from-red-400 to-pink-500 text-white shadow-lg',
        };
        
        const labels = {
            pendente: 'Pendente',
            aprovado: 'Aprovado',
            recusado: 'Recusado',
        };

        return (
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transform hover:scale-105 transition-all duration-300 ${badges[status]}`}>
                {labels[status]}
            </span>
        );
    };

    const getOrderStatusBadge = (status) => {
        const badges = {
            pending_payment: 'bg-yellow-100 text-yellow-800',
            payment_approved: 'bg-green-100 text-green-800',
            in_production: 'bg-blue-100 text-blue-800',
            photo_sent: 'bg-purple-100 text-purple-800',
            photo_approved: 'bg-indigo-100 text-indigo-800',
            pending_final_payment: 'bg-orange-100 text-orange-800',
            ready_for_shipping: 'bg-teal-100 text-teal-800',
            shipped: 'bg-green-100 text-green-800'
        };

        const labels = {
            pending_payment: '⏳ Aguardando Pagamento',
            payment_approved: '✅ Pagamento Aprovado',
            in_production: '🏭 Em Produção',
            photo_sent: '📸 Foto Enviada',
            photo_approved: '✨ Foto Aprovada',
            pending_final_payment: '🟠 Pagamento Final',
            ready_for_shipping: '📦 Pronto p/ Envio',
            shipped: '🚚 Enviado'
        };

        return (
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badges[status]}`}>
                {labels[status] || status}
            </span>
        );
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'high': return 'bg-red-100 border-red-500 text-red-800';
            case 'medium': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
            case 'low': return 'bg-blue-100 border-blue-500 text-blue-800';
            default: return 'bg-gray-100 border-gray-500 text-gray-800';
        }
    };

    const tabs = [
        { id: 'overview', name: '📊 Visão Geral', icon: '📊' },
        { id: 'inventory', name: '📦 Estoque', icon: '📦' },
        { id: 'lifecycle', name: '🔄 Ciclo de Pedidos', icon: '🔄' },
        { id: 'performance', name: '⚡ Performance', icon: '⚡' },
        { id: 'bottlenecks', name: '🚨 Gargalos', icon: '🚨' }
    ];

    return (
        <>
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

                .dashboard-bg {
                    background: linear-gradient(135deg, #F5E6D3 0%, #FFFFFF 50%, #F0F9FF 100%);
                    min-height: 100vh;
                }

                .card-gradient {
                    background: var(--gradient-soft);
                    border-radius: 25px;
                    box-shadow: var(--shadow);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 2px solid transparent;
                    position: relative;
                    overflow: hidden;
                }

                .card-gradient:hover {
                    transform: translateY(-5px);
                    box-shadow: var(--shadow-hover);
                    border-color: var(--primary-color);
                }

                .stat-card {
                    background: var(--gradient);
                    border-radius: 20px;
                    box-shadow: var(--shadow);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }

                .stat-card:hover {
                    transform: translateY(-8px) scale(1.02);
                    box-shadow: var(--shadow-hover);
                }

                .feature-icon {
                    background: rgba(255, 255, 255, 0.2);
                    transition: all 0.3s ease;
                    backdrop-filter: blur(10px);
                }

                .feature-icon:hover {
                    transform: scale(1.1);
                    background: rgba(255, 255, 255, 0.3);
                }

                .animate-fadeInUp {
                    animation: fadeInUp 0.8s ease-out forwards;
                    opacity: 0;
                    transform: translateY(30px);
                }

                .animate-fadeInUp:nth-child(1) { animation-delay: 0.1s; }
                .animate-fadeInUp:nth-child(2) { animation-delay: 0.2s; }
                .animate-fadeInUp:nth-child(3) { animation-delay: 0.3s; }
                .animate-fadeInUp:nth-child(4) { animation-delay: 0.4s; }

                @keyframes fadeInUp {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .progress-bar {
                    background: var(--gradient);
                    transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }

                .progress-bar::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
                    animation: shimmer 2s infinite;
                }

                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }

                .tab-active {
                    background: var(--gradient);
                    color: white;
                    transform: translateY(-2px);
                    box-shadow: var(--shadow);
                }

                .tab-inactive {
                    background: rgba(255, 255, 255, 0.7);
                    color: var(--text-dark);
                }

                .tab-inactive:hover {
                    background: rgba(255, 255, 255, 0.9);
                    transform: translateY(-1px);
                }

                .filter-select {
                    background: rgba(255, 255, 255, 0.9);
                    border: 2px solid var(--primary-color);
                    border-radius: 12px;
                    transition: all 0.3s ease;
                }

                .filter-select:focus {
                    outline: none;
                    border-color: var(--accent-color);
                    box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.1);
                }

                .bottleneck-card {
                    border-left: 4px solid;
                    transition: all 0.3s ease;
                }

                .bottleneck-card:hover {
                    transform: translateX(5px);
                    box-shadow: var(--shadow);
                }
            `}</style>

            <AuthenticatedLayout
                header={
                    <div className="flex items-center justify-between bg-white/95 backdrop-blur-lg rounded-2xl px-6 py-4 shadow-lg border border-white/20">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                            Dashboard Avançado - BBKits ✨
                        </h2>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full shadow-md">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={autoRefreshEnabled}
                                        onChange={(e) => setAutoRefreshEnabled(e.target.checked)}
                                        className="sr-only"
                                    />
                                    <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        autoRefreshEnabled ? 'bg-green-500' : 'bg-gray-300'
                                    }`}>
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                            autoRefreshEnabled ? 'translate-x-6' : 'translate-x-1'
                                        }`} />
                                    </div>
                                    <span className="ml-2 text-sm font-medium text-gray-700">
                                        Auto-refresh {autoRefreshEnabled && `(${refreshInterval}s)`}
                                    </span>
                                </label>
                                {isRefreshing && (
                                    <svg className="animate-spin h-4 w-4 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                                <button
                                    onClick={handleManualRefresh}
                                    disabled={isRefreshing}
                                    className="ml-2 p-2 text-gray-600 hover:text-green-600 transition-colors disabled:opacity-50"
                                    title="Atualizar agora"
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </button>
                            </div>
                            <div className="text-sm text-gray-600 bg-gradient-to-r from-pink-100 to-purple-100 px-4 py-2 rounded-full shadow-md">
                                Bem-vindo, <span className="font-semibold text-pink-600">{auth.user.name}</span>! 👋
                            </div>
                        </div>
                    </div>
                }
            >
                <Head title="Dashboard Avançado - BBKits" />

                <div className="dashboard-bg relative overflow-hidden">
                    <div className="py-12 relative z-10">
                        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                            
                            {/* Advanced Filters */}
                            <div className="card-gradient p-6 mb-8">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">🔍 Filtros Avançados</h3>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
                                        <select 
                                            value={filters.date_filter}
                                            onChange={(e) => handleFilterChange('date_filter', e.target.value)}
                                            className="filter-select w-full px-3 py-2 text-sm"
                                        >
                                            {Object.entries(filterOptions.dateFilters).map(([key, label]) => (
                                                <option key={key} value={key}>{label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Status da Venda</label>
                                        <select 
                                            value={filters.status_filter}
                                            onChange={(e) => handleFilterChange('status_filter', e.target.value)}
                                            className="filter-select w-full px-3 py-2 text-sm"
                                        >
                                            {Object.entries(filterOptions.statusFilters).map(([key, label]) => (
                                                <option key={key} value={key}>{label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    {showCustomDatePicker && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Data Inicial</label>
                                                <input 
                                                    type="date"
                                                    value={filters.start_date}
                                                    onChange={(e) => handleFilterChange('start_date', e.target.value)}
                                                    className="filter-select w-full px-3 py-2 text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Data Final</label>
                                                <input 
                                                    type="date"
                                                    value={filters.end_date}
                                                    onChange={(e) => handleFilterChange('end_date', e.target.value)}
                                                    className="filter-select w-full px-3 py-2 text-sm"
                                                />
                                            </div>
                                        </>
                                    )}
                                    
                                    <div className="flex items-end">
                                        <button
                                            onClick={applyFilters}
                                            disabled={isRefreshing}
                                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                                        >
                                            {isRefreshing ? '🔄 Aplicando...' : '🔍 Aplicar Filtros'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation Tabs */}
                            <div className="flex space-x-2 mb-8">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                                            activeTab === tab.id ? 'tab-active' : 'tab-inactive'
                                        }`}
                                    >
                                        {tab.name}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            {activeTab === 'overview' && (
                                <div className="space-y-8">
                                    {/* Legacy Stats Cards */}
                                    <div className="grid gap-8 mb-12 md:grid-cols-2 xl:grid-cols-4">
                                        <div className="stat-card animate-fadeInUp">
                                            <div className="p-6 flex items-center text-white relative z-10">
                                                <div className="feature-icon p-4 rounded-full mr-6">
                                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="mb-2 text-sm font-medium text-white/90">Total de Vendedoras</p>
                                                    <p className="text-3xl font-bold drop-shadow-lg">{stats.totalSellers}</p>
                                                    <p className="text-xs text-white/80 mt-1">👥 Equipe BBKits</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="stat-card animate-fadeInUp">
                                            <div className="p-6 flex items-center text-white relative z-10">
                                                <div className="feature-icon p-4 rounded-full mr-6">
                                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"></path>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="mb-2 text-sm font-medium text-white/90">Receita do Período</p>
                                                    <p className="text-2xl font-bold drop-shadow-lg">{formatCurrency(stats.monthlyRevenue)}</p>
                                                    <p className="text-xs text-white/80 mt-1">💰 Faturamento</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="stat-card animate-fadeInUp">
                                            <div className="p-6 flex items-center text-white relative z-10">
                                                <div className="feature-icon p-4 rounded-full mr-6">
                                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="mb-2 text-sm font-medium text-white/90">Vendas Pendentes</p>
                                                    <p className="text-3xl font-bold drop-shadow-lg">{stats.pendingSales}</p>
                                                    <p className="text-xs text-white/80 mt-1">⏳ Aguardando</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="stat-card animate-fadeInUp">
                                            <div className="p-6 flex items-center text-white relative z-10">
                                                <div className="feature-icon p-4 rounded-full mr-6">
                                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="mb-2 text-sm font-medium text-white/90">Comissões</p>
                                                    <p className="text-2xl font-bold drop-shadow-lg">{formatCurrency(stats.monthlyCommissions)}</p>
                                                    <p className="text-xs text-white/80 mt-1">🎯 Bonificações</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Top Performers */}
                                    <div className="grid gap-8 mb-12 md:grid-cols-2">
                                        <div className="animate-fadeInUp">
                                            {topPerformers && topPerformers.length > 0 ? (
                                                <div className="mb-4">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h4 className="text-lg font-bold text-gray-800">🏆 Top Vendedoras</h4>
                                                        <a 
                                                            href="/admin/reports" 
                                                            className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-200 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg"
                                                        >
                                                            Ver Relatório Detalhado →
                                                        </a>
                                                    </div>
                                                    <div className="card-gradient p-6">
                                                        <div className="space-y-4">
                                                            {topPerformers.slice(0, 5).map((performer, index) => (
                                                                <div key={performer.id} className="flex items-center justify-between p-4 bg-white/70 rounded-xl shadow-md">
                                                                    <div className="flex items-center">
                                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                                                                            index === 0 ? 'bg-yellow-100 text-yellow-600' :
                                                                            index === 1 ? 'bg-gray-100 text-gray-600' :
                                                                            index === 2 ? 'bg-orange-100 text-orange-600' :
                                                                            'bg-blue-100 text-blue-600'
                                                                        }`}>
                                                                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}º`}
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-semibold text-gray-800">{performer.name}</p>
                                                                            <p className="text-sm text-gray-600">{performer.sales_count} vendas</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <p className="font-bold text-green-600">{formatCurrency(performer.total_revenue || 0)}</p>
                                                                        <p className="text-sm text-gray-600">{formatCurrency(performer.total_commission || 0)} comissão</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="card-gradient p-8">
                                                    <div className="text-center">
                                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                            <span className="text-2xl">📊</span>
                                                        </div>
                                                        <p className="text-gray-500 text-lg">Nenhuma venda no período selecionado</p>
                                                        <p className="text-gray-400 text-sm">Ajuste os filtros para ver dados</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Monthly Progress */}
                                        <div className="card-gradient p-8 animate-fadeInUp">
                                            <div className="flex items-center mb-6">
                                                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
                                                    <span className="text-2xl">📈</span>
                                                </div>
                                                <h4 className="text-2xl font-bold text-gray-800">Progresso</h4>
                                            </div>
                                            <div className="space-y-6">
                                                <div>
                                                    <div className="flex justify-between mb-3">
                                                        <span className="text-lg font-medium text-gray-700">🎯 Meta Mensal</span>
                                                        <span className="text-lg font-bold text-gray-900">
                                                            {formatCurrency(stats.monthlyRevenue)} / {formatCurrency(stats.monthlyTarget)}
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
                                                        <div 
                                                            className="progress-bar h-4 rounded-full shadow-lg" 
                                                            style={{width: `${Math.min((stats.monthlyRevenue / stats.monthlyTarget) * 100, 100)}%`}}
                                                        ></div>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mt-2 font-medium">
                                                        🔥 {((stats.monthlyRevenue / stats.monthlyTarget) * 100).toFixed(1)}% da meta alcançada
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'inventory' && (
                                <div className="space-y-8">
                                    {/* Low Stock Alerts & Purchase Suggestions - Top Row */}
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <LowStockAlertsWidget />
                                        <PurchaseSuggestionsWidget />
                                    </div>

                                    {/* Thread Inventory & Production Status - Middle Row */}
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <ThreadInventoryWidget />
                                        <ProductionStatusWidget />
                                    </div>

                                    {/* Cost Trends - Full Width */}
                                    <div>
                                        <CostTrendsWidget />
                                    </div>

                                    {/* Quick Links */}
                                    <div className="card-gradient p-6">
                                        <h3 className="text-lg font-bold text-gray-800 mb-4">🔗 Links Rápidos - Estoque</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <a
                                                href="/admin/materials"
                                                className="bg-white/70 p-4 rounded-xl text-center hover:bg-white transition-colors"
                                            >
                                                <span className="text-2xl block mb-2">📦</span>
                                                <span className="text-sm font-medium text-gray-700">Materiais</span>
                                            </a>
                                            <a
                                                href="/admin/threads"
                                                className="bg-white/70 p-4 rounded-xl text-center hover:bg-white transition-colors"
                                            >
                                                <span className="text-2xl block mb-2">🧵</span>
                                                <span className="text-sm font-medium text-gray-700">Linhas</span>
                                            </a>
                                            <a
                                                href="/admin/purchase-suggestions"
                                                className="bg-white/70 p-4 rounded-xl text-center hover:bg-white transition-colors"
                                            >
                                                <span className="text-2xl block mb-2">🛒</span>
                                                <span className="text-sm font-medium text-gray-700">Sugestões</span>
                                            </a>
                                            <a
                                                href="/admin/reports/advanced"
                                                className="bg-white/70 p-4 rounded-xl text-center hover:bg-white transition-colors"
                                            >
                                                <span className="text-2xl block mb-2">📊</span>
                                                <span className="text-sm font-medium text-gray-700">Relatórios</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'lifecycle' && (
                                <div className="space-y-8">
                                    <div className="card-gradient p-8">
                                        <h3 className="text-2xl font-bold text-gray-800 mb-6">🔄 Ciclo de Vida dos Pedidos</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                            {Object.entries(stats.orderLifecycle || {}).map(([status, count]) => (
                                                <div key={status} className="bg-white/70 p-6 rounded-xl shadow-md text-center">
                                                    <div className="text-3xl font-bold text-gray-800 mb-2">{count}</div>
                                                    <div className="text-sm">
                                                        {getOrderStatusBadge(status)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'performance' && (
                                <div className="space-y-8">
                                    <div className="card-gradient p-8">
                                        <h3 className="text-2xl font-bold text-gray-800 mb-6">⚡ Métricas de Performance</h3>
                                        {stats.performance && (
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div className="bg-white/70 p-6 rounded-xl shadow-md">
                                                    <h4 className="font-semibold text-gray-800 mb-2">⏱️ Tempo Médio de Entrega</h4>
                                                    <div className="text-3xl font-bold text-blue-600">
                                                        {stats.performance.avg_processing_time_days} dias
                                                    </div>
                                                </div>
                                                
                                                <div className="bg-white/70 p-6 rounded-xl shadow-md">
                                                    <h4 className="font-semibold text-gray-800 mb-2">✅ Taxa de Aprovação</h4>
                                                    <div className="text-3xl font-bold text-green-600">
                                                        {stats.performance.conversion_rates?.payment_approval_rate?.toFixed(1) || 0}%
                                                    </div>
                                                </div>
                                                
                                                <div className="bg-white/70 p-6 rounded-xl shadow-md">
                                                    <h4 className="font-semibold text-gray-800 mb-2">🎯 Taxa de Conclusão</h4>
                                                    <div className="text-3xl font-bold text-purple-600">
                                                        {stats.performance.conversion_rates?.completion_rate?.toFixed(1) || 0}%
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'bottlenecks' && (
                                <div className="space-y-8">
                                    <div className="card-gradient p-8">
                                        <h3 className="text-2xl font-bold text-gray-800 mb-6">🚨 Identificação de Gargalos</h3>
                                        {stats.bottlenecks && stats.bottlenecks.length > 0 ? (
                                            <div className="space-y-4">
                                                {stats.bottlenecks.map((bottleneck, index) => (
                                                    <div 
                                                        key={index}
                                                        className={`bottleneck-card p-6 rounded-xl ${getSeverityColor(bottleneck.severity)}`}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <p className="font-semibold text-lg">{bottleneck.message}</p>
                                                                <p className="text-sm opacity-80 mt-1">
                                                                    Severidade: <span className="font-medium">{bottleneck.severity.toUpperCase()}</span>
                                                                </p>
                                                            </div>
                                                            <a 
                                                                href={bottleneck.action_url}
                                                                className="bg-white/80 hover:bg-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                                                            >
                                                                ⚡ Resolver
                                                            </a>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-12">
                                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <span className="text-3xl">✅</span>
                                                </div>
                                                <p className="text-gray-500 text-lg font-medium">Nenhum gargalo identificado!</p>
                                                <p className="text-gray-400 text-sm">Tudo funcionando perfeitamente 🎉</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Quick Actions */}
                            <div className="stat-card p-8">
                                <div className="flex items-center justify-between text-white">
                                    <div>
                                        <div className="flex items-center mb-3">
                                            <span className="text-3xl mr-3">⚡</span>
                                            <h4 className="text-2xl font-bold">Ações Rápidas</h4>
                                        </div>
                                        <p className="text-white/90 text-lg">Acesse funcionalidades principais rapidamente</p>
                                    </div>
                                    <div className="flex space-x-4">
                                        <a 
                                            href="/admin/sales" 
                                            className="bg-white/20 backdrop-blur-lg px-6 py-3 text-sm font-semibold text-white rounded-2xl transition-all duration-300 hover:scale-105 hover:bg-white/30"
                                        >
                                            ✅ Gerenciar Vendas
                                        </a>
                                        <a 
                                            href="/finance/orders" 
                                            className="bg-white/20 backdrop-blur-lg px-6 py-3 text-sm font-semibold text-white rounded-2xl transition-all duration-300 hover:scale-105 hover:bg-white/30"
                                        >
                                            💳 Finanças
                                        </a>
                                        <a 
                                            href="/production/orders" 
                                            className="bg-white/20 backdrop-blur-lg px-6 py-3 text-sm font-semibold text-white rounded-2xl transition-all duration-300 hover:scale-105 hover:bg-white/30"
                                        >
                                            🏭 Produção
                                        </a>
                                        <a 
                                            href="/admin/reports" 
                                            className="bg-white/20 backdrop-blur-lg px-6 py-3 text-sm font-semibold text-white rounded-2xl transition-all duration-300 hover:scale-105 hover:bg-white/30"
                                        >
                                            📊 Relatórios
                                        </a>
                                        <a 
                                            href="/admin/embroidery" 
                                            className="bg-white/20 backdrop-blur-lg px-6 py-3 text-sm font-semibold text-white rounded-2xl transition-all duration-300 hover:scale-105 hover:bg-white/30"
                                        >
                                            🧵 Bordados
                                        </a>
                                        <div className="relative group">
                                            <button className="bg-white/20 backdrop-blur-lg px-6 py-3 text-sm font-semibold text-white rounded-2xl transition-all duration-300 hover:scale-105 hover:bg-white/30">
                                                💾 Exportar
                                            </button>
                                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                                                <div className="p-2">
                                                    <a 
                                                        href={`/admin/export/sales?date_filter=${filters.date_filter}&status_filter=${filters.status_filter}&start_date=${filters.start_date}&end_date=${filters.end_date}`}
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                                                    >
                                                        📋 Vendas Filtradas
                                                    </a>
                                                    <a 
                                                        href={`/admin/export/commissions?date_filter=${filters.date_filter}&status_filter=${filters.status_filter}`}
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                                                    >
                                                        💰 Comissões
                                                    </a>
                                                    <a 
                                                        href={`/admin/export/order-lifecycle?date_filter=${filters.date_filter}`}
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                                                    >
                                                        🔄 Ciclo de Pedidos
                                                    </a>
                                                    <a 
                                                        href={`/admin/export/performance-metrics?date_filter=${filters.date_filter}`}
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                                                    >
                                                        ⚡ Métricas Performance
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}