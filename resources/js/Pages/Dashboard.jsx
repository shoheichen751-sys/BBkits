import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import SalesModal from '@/Components/SalesModal';
import RankingDisplay from '@/Components/RankingDisplay';
import { formatBRL } from '@/utils/currency';

export default function Dashboard() {
    const { auth, gamification, salesData, recentSales, allMonthlySales, topPerformers } = usePage().props;
    const [modalOpen, setModalOpen] = useState(false);
    
    const handleViewSales = () => {
        setModalOpen(true);
    };
    
    // Debug log
    console.log('Dashboard Props:', { salesData, recentSales, topPerformers });
    console.log('Recent Sales Length:', recentSales ? recentSales.length : 'null/undefined');
    console.log('Top Performers:', topPerformers);
    
    return (
        <>
            {/* Add the same premium styles from Welcome page */}
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

                .card-gradient::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(45deg, rgba(212, 165, 116, 0.05) 0%, rgba(232, 180, 203, 0.05) 100%);
                    pointer-events: none;
                }

                .card-gradient:hover {
                    transform: translateY(-10px) scale(1.02);
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

                .stat-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    transition: left 0.6s;
                }

                .stat-card:hover::before {
                    left: 100%;
                }

                .stat-card:hover {
                    transform: translateY(-8px) scale(1.05);
                    box-shadow: var(--shadow-hover);
                }

                .feature-icon {
                    background: rgba(255, 255, 255, 0.2);
                    transition: all 0.3s ease;
                    backdrop-filter: blur(10px);
                }

                .feature-icon:hover {
                    transform: scale(1.2) rotate(10deg);
                    box-shadow: var(--shadow-glow);
                    background: rgba(255, 255, 255, 0.3);
                }

                .floating-particles {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    pointer-events: none;
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

                .level-progress {
                    background: rgba(255, 255, 255, 0.3);
                    backdrop-filter: blur(10px);
                    transition: width 2s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .logo-glow {
                    background: var(--gradient);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: logoGlow 3s ease-in-out infinite alternate;
                }

                @keyframes logoGlow {
                    0% { filter: drop-shadow(0 0 5px rgba(212, 165, 116, 0.3)); }
                    100% { filter: drop-shadow(0 0 15px rgba(212, 165, 116, 0.6)); }
                }

                .achievement-card {
                    background: linear-gradient(145deg, #FFF9C4 0%, #FEF3CD 100%);
                    border: 2px solid #F59E0B;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }

                .achievement-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(45deg, rgba(245, 158, 11, 0.1) 0%, rgba(251, 191, 36, 0.1) 100%);
                    pointer-events: none;
                }

                .achievement-card:hover {
                    transform: translateY(-5px) scale(1.05);
                    box-shadow: 0 15px 30px rgba(245, 158, 11, 0.3);
                    border-color: #D97706;
                }

                .ranking-card {
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }

                .ranking-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(45deg, rgba(212, 165, 116, 0.05) 0%, rgba(232, 180, 203, 0.05) 100%);
                    pointer-events: none;
                }

                .ranking-card:hover {
                    transform: scale(1.02);
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                }

                .user-highlight {
                    background: linear-gradient(135deg, #FCE7F3 0%, #FDF2F8 100%);
                    border: 2px solid var(--accent-color);
                }

                .motivational-card {
                    background: var(--gradient);
                    position: relative;
                    overflow: hidden;
                }

                .motivational-card::before {
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

                .cta-buttons {
                    backdrop-filter: blur(10px);
                    transition: all 0.3s ease;
                }

                .cta-buttons:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                }
            `}</style>

            <AuthenticatedLayout
                header={
                    <div className="flex items-center justify-between bg-white/95 backdrop-blur-lg rounded-2xl px-6 py-4 shadow-lg border border-white/20">
                        <h2 className="text-2xl font-bold logo-glow">
                            Dashboard BBKits ✨
                        </h2>
                        <div className="text-sm text-gray-600 bg-gradient-to-r from-pink-100 to-purple-100 px-4 py-2 rounded-full shadow-md">
                            Bem-vinda, <span className="font-semibold text-pink-600">{auth.user.name}</span>! 💎
                        </div>
                    </div>
                }
            >
                <Head title="Dashboard - BBKits" />

                <div className="dashboard-bg relative overflow-hidden">
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

                    <div className="py-12 relative z-10">
                        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                            {/* Quick Action Button for Salespeople */}
                            {auth.user.role === 'vendedora' && (
                                <div className="mb-8 text-center animate-fadeInUp">
                                    <a
                                        href="/sales/create-expanded"
                                        className="inline-flex items-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 group"
                                        style={{
                                            background: 'linear-gradient(135deg, #FF6B9D 0%, #C96CBE 50%, #95A5E8 100%)',
                                            boxShadow: '0 10px 30px rgba(255, 107, 157, 0.4), 0 0 20px rgba(201, 108, 190, 0.3)',
                                        }}
                                    >
                                        <svg className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        <span className="mr-2">✨ Nova Venda</span>
                                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
                                        </svg>
                                    </a>
                                    <p className="text-gray-600 mt-3 text-sm">
                                        💼 Registre uma venda e aumente suas comissões!
                                    </p>
                                </div>
                            )}
                            
                            {/* Enhanced Ranking Display - Moved to Top for Salespeople */}
                            {auth.user.role === 'vendedora' && gamification && gamification.ranking && gamification.ranking.length > 0 && (
                                <div className="mb-12 animate-fadeInUp">
                                    <RankingDisplay 
                                        ranking={gamification.ranking}
                                        currentUser={auth.user}
                                        showFull={false}
                                    />
                                </div>
                            )}

                            {/* Stats Cards */}
                            <div className="grid gap-8 mb-12 md:grid-cols-2 xl:grid-cols-4">
                                <div className="stat-card animate-fadeInUp">
                                    <div className="p-6 flex items-center text-white relative z-10">
                                        <div className="feature-icon p-4 rounded-full mr-6">
                                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="mb-2 text-sm font-medium text-white/90">Total de Vendas</p>
                                            <p className="text-2xl font-bold drop-shadow-lg">
                                                {formatBRL(salesData?.totalSalesAmount || 0)}
                                            </p>
                                            <p className="text-xs text-white/80 mt-1">💼 {salesData?.monthlySalesCount || 0} vendas cadastradas</p>
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
                                            <p className="mb-2 text-sm font-medium text-white/90">Comissão do Mês</p>
                                            <p className="text-2xl font-bold drop-shadow-lg">
                                                {formatBRL(salesData?.monthlyCommission || 0)}
                                            </p>
                                            <p className="text-xs text-white/80 mt-1">💰 Seus ganhos</p>
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
                                            <p className="mb-2 text-sm font-medium text-white/90">Vendas Aprovadas</p>
                                            <p className="text-2xl font-bold drop-shadow-lg">
                                                {formatBRL(salesData?.approvedSalesTotal || 0)}
                                            </p>
                                            <p className="text-xs text-white/80 mt-1">✅ {salesData?.approvedSalesCount || 0} aprovadas</p>
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
                                            <p className="mb-2 text-sm font-medium text-white/90">Meta do Mês</p>
                                            <p className="text-2xl font-bold drop-shadow-lg">
                                                {formatBRL(salesData?.monthlyGoal || 40000)}
                                            </p>
                                            <p className="text-xs text-white/80 mt-1">🎯 Objetivo</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid gap-8 mb-12 md:grid-cols-2">
                                {/* Progress Section */}
                                <div className="card-gradient p-8 relative z-10">
                                    <div className="flex items-center mb-6">
                                        <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
                                            <span className="text-2xl">🎯</span>
                                        </div>
                                        <h4 className="text-2xl font-bold text-gray-800">Progresso da Meta</h4>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner mb-4">
                                        <div className="progress-bar h-4 rounded-full shadow-lg" style={{width: `${salesData?.progressPercentage || 0}%`}}></div>
                                    </div>
                                    <div className="flex justify-between items-center mb-4">
                                        <p className="text-lg font-medium text-gray-700">{salesData?.progressPercentage || 0}% da meta mensal alcançada</p>
                                        <p className="text-sm text-gray-600 bg-white/70 px-3 py-1 rounded-full">
                                            Meta: {formatBRL(salesData?.monthlyGoal || 40000)}
                                        </p>
                                    </div>
                                    <div className="mb-6">
                                        <p className="text-sm text-gray-600 mb-2">
                                            Vendido: {formatBRL(salesData?.totalSalesAmount || 0)} de {formatBRL(salesData?.monthlyGoal || 40000)}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Faltam: {formatBRL(Math.max(0, (salesData?.monthlyGoal || 40000) - (salesData?.totalSalesAmount || 0)))}
                                        </p>
                                    </div>
                                    <div className="motivational-card p-6 rounded-2xl text-white relative overflow-hidden">
                                        <div className="relative z-10">
                                            <p className="text-lg font-semibold mb-2">💪 Dica Motivacional</p>
                                            <p className="text-pink-100 italic">"Cada venda é uma história de amor que você ajuda a criar. Continue brilhando!"</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Commission Insights */}
                                <div className="card-gradient p-8 relative z-10">
                                    <div className="flex items-center mb-6">
                                        <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
                                            <span className="text-2xl">💎</span>
                                        </div>
                                        <h4 className="text-2xl font-bold text-gray-800">Insights de Comissão</h4>
                                    </div>
                                    
                                    {/* Current Commission Rate */}
                                    <div className="mb-6 p-4 bg-white/70 rounded-xl">
                                        <p className="text-sm font-medium text-gray-600 mb-1">Taxa Atual de Comissão</p>
                                        <p className="text-3xl font-bold text-purple-600">{salesData?.currentRate || 0}%</p>
                                    </div>

                                    {/* Opportunity Alert */}
                                    {salesData?.opportunityAlert && (
                                        <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                                            <div className="flex items-start">
                                                <span className="text-2xl mr-3">🎯</span>
                                                <div>
                                                    <p className="font-semibold text-yellow-800 mb-1">Oportunidade!</p>
                                                    <p className="text-sm text-yellow-700">{salesData.opportunityAlert.message}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Next Bracket Info */}
                                    {salesData?.nextBracket && (
                                        <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                                            <p className="text-sm font-medium text-gray-600 mb-2">Próxima Faixa de Comissão</p>
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-lg font-semibold text-gray-800">
                                                    {formatBRL(salesData.nextBracket.min_amount)}
                                                </p>
                                                <p className="text-2xl font-bold text-purple-600">{salesData.nextBracket.percentage}%</p>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                Faltam <span className="font-bold text-purple-600">
                                                    {formatBRL(salesData.nextBracket.amount_needed)}
                                                </span> para alcançar
                                            </p>
                                        </div>
                                    )}

                                    {/* Earnings Simulation */}
                                    {salesData?.potentialEarnings && (
                                        <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                                            <div className="flex items-start">
                                                <span className="text-2xl mr-3">💰</span>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-green-800 mb-2">Simulação de Ganhos</p>
                                                    <p className="text-sm text-green-700 mb-1">
                                                        Comissão atual: <span className="font-bold">
                                                            {formatBRL(salesData.potentialEarnings.current_commission)}
                                                        </span>
                                                    </p>
                                                    <p className="text-sm text-green-700">
                                                        Se vender mais <span className="font-bold">{formatBRL(salesData.nextBracket?.amount_needed || 0)}</span>, 
                                                        você ganhará <span className="font-bold text-green-600">
                                                            +{formatBRL(salesData.potentialEarnings.additional_commission)}
                                                        </span> de comissão!
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Commission Ranges Table */}
                                    {salesData?.commissionRanges && salesData.commissionRanges.length > 0 && (
                                        <div className="mt-6">
                                            <p className="text-sm font-medium text-gray-600 mb-3">Tabela de Comissões</p>
                                            <div className="space-y-2">
                                                {salesData.commissionRanges.map((range, index) => (
                                                    <div key={index} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                                                        <span className="text-sm text-gray-700">
                                                            {formatBRL(range.min_amount)}
                                                            {range.max_amount ? ` - R$ ${formatBRL(range.max_amount)}` : '+'}
                                                        </span>
                                                        <span className="font-bold text-purple-600">{range.percentage}%</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                {/* 7-Point Detailed Information System */}
                                <div className="card-gradient p-8 relative z-10">
                                    <div className="flex items-center mb-6">
                                        <div className="w-12 h-12 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
                                            <span className="text-2xl">📊</span>
                                        </div>
                                        <h4 className="text-2xl font-bold text-gray-800">Informações Detalhadas</h4>
                                    </div>
                                    
                                    <div className="space-y-3 mb-6">
                                        {/* 1. Total Sales */}
                                        <div className="flex justify-between items-center p-4 bg-white/50 rounded-lg border border-gray-200">
                                            <span className="text-sm font-medium text-gray-600">1. Total de Vendas</span>
                                            <span className="text-lg font-bold text-gray-800">
                                                {formatBRL(salesData?.totalSalesAmount || 0)}
                                            </span>
                                        </div>
                                        
                                        {/* 2. Approved Sales */}
                                        <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                                            <span className="text-sm font-medium text-green-600">2. Vendas Aprovadas</span>
                                            <span className="text-lg font-bold text-green-800">
                                                {formatBRL(salesData?.approvedSalesTotal || 0)}
                                            </span>
                                        </div>
                                        
                                        {/* 3. Pending Sales */}
                                        <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                            <span className="text-sm font-medium text-yellow-600">3. Vendas Pendentes</span>
                                            <span className="text-lg font-bold text-yellow-800">
                                                {formatBRL(salesData?.pendingSalesTotal || 0)}
                                            </span>
                                        </div>
                                        
                                        {/* 4. Total Shipping */}
                                        <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                                            <span className="text-sm font-medium text-blue-600">4. Total de Frete</span>
                                            <span className="text-lg font-bold text-blue-800">
                                                {formatBRL(salesData?.totalShipping || 0)}
                                            </span>
                                        </div>
                                        
                                        {/* 5. Commission Base */}
                                        <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                                            <span className="text-sm font-medium text-purple-600">5. Base de Comissão</span>
                                            <span className="text-lg font-bold text-purple-800">
                                                {formatBRL(salesData?.commissionBase || 0)}
                                            </span>
                                        </div>
                                        
                                        {/* 6. Total Commission */}
                                        <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                                            <span className="text-sm font-medium text-orange-600">6. Comissão Total ({salesData?.currentRate || 0}%)</span>
                                            <span className="text-lg font-bold text-orange-800">
                                                {formatBRL(salesData?.monthlyCommission || 0)}
                                            </span>
                                        </div>
                                        
                                        {/* 7. View All Sales Button */}
                                        <button
                                            onClick={handleViewSales}
                                            className="w-full p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                            7. Ver Todas as Vendas
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Recent Sales */}
                                <div className="card-gradient p-8 relative z-10">
                                    <div className="flex items-center mb-6">
                                        <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
                                            <span className="text-2xl">📋</span>
                                        </div>
                                        <h4 className="text-2xl font-bold text-gray-800">Últimas Vendas</h4>
                                    </div>
                                    {recentSales && recentSales.length > 0 ? (
                                        <div className="space-y-4">
                                            {recentSales.map((sale, index) => (
                                                <div key={sale.id} className="flex items-center justify-between p-4 bg-white/50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-3 h-3 rounded-full ${
                                                                sale.status === 'aprovado' ? 'bg-green-500' :
                                                                sale.status === 'rejeitado' ? 'bg-red-500' :
                                                                'bg-yellow-500'
                                                            }`}></div>
                                                            <span className="font-medium text-gray-800">{sale.client_name}</span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            Recebido: {formatBRL(sale.received_amount || 0)} • {new Date(sale.payment_date).toLocaleDateString('pt-BR')}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-gray-800">
                                                            {formatBRL(sale.total_amount || 0)}
                                                        </p>
                                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                                            sale.status === 'aprovado' ? 'bg-green-100 text-green-800' :
                                                            sale.status === 'rejeitado' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                            {sale.status === 'aprovado' ? 'Aprovado' :
                                                             sale.status === 'rejeitado' ? 'Rejeitado' :
                                                             'Pendente'}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                                <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <p className="text-xl font-semibold text-gray-600 mb-2">Nenhuma venda registrada ainda</p>
                                            <p className="text-gray-500">Registre sua primeira venda para começar! 🚀</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Call to Action */}
                            <div className="stat-card p-8 mb-12 relative z-10">
                                <div className="flex items-center justify-between text-white">
                                    <div>
                                        <div className="flex items-center mb-3">
                                            <span className="text-3xl mr-3">
                                                {auth.user.role === 'vendedora' ? '💼' : '⚡'}
                                            </span>
                                            <h4 className="text-2xl font-bold">
                                                {auth.user.role === 'vendedora' ? 'Pronta para vender mais?' : 'Gerencie o Sistema BBKits'}
                                            </h4>
                                        </div>
                                        <p className="text-white/90 text-lg">
                                            {auth.user.role === 'vendedora' ? 
                                                'Registre uma nova venda e aumente suas comissões!' : 
                                                'Acesse as ferramentas administrativas'}
                                        </p>
                                    </div>
                                    <div className="flex space-x-4">
                                        {auth.user.role === 'vendedora' ? (
                                            <>
                                                <a href="/sales/create" className="cta-buttons px-6 py-3 text-sm font-semibold text-white bg-white/20 border border-white/30 rounded-2xl transition-all duration-300 hover:scale-105">
                                                    ✨ Nova Venda
                                                </a>
                                                <a href="/reports/sales" className="cta-buttons px-6 py-3 text-sm font-semibold text-white bg-white/20 border border-white/30 rounded-2xl transition-all duration-300 hover:scale-105">
                                                    📄 Relatório PDF
                                                </a>
                                            </>
                                        ) : (
                                            <>
                                                <a href="/admin/dashboard" className="cta-buttons px-6 py-3 text-sm font-semibold text-white bg-white/20 border border-white/30 rounded-2xl transition-all duration-300 hover:scale-105">
                                                    📊 Admin Dashboard
                                                </a>
                                                <a href="/admin/sales" className="cta-buttons px-6 py-3 text-sm font-semibold text-white bg-white/20 border border-white/30 rounded-2xl transition-all duration-300 hover:scale-105">
                                                    ✅ Aprovar Vendas
                                                </a>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Gamification Section for Vendedoras */}
                            {auth.user.role === 'vendedora' && gamification && (
                                <>
                                    {/* User Level and Progress */}
                                    <div className="stat-card p-10 mb-8 text-white relative overflow-hidden">
                                        <div className="flex items-center justify-between mb-8 relative z-10">
                                            <div>
                                                <h2 className="text-3xl font-bold mb-3 flex items-center">
                                                    <span className="text-4xl mr-3">{gamification.level.icon}</span>
                                                    Nível {gamification.level.level}
                                                </h2>
                                                <p className="text-xl text-white/90">
                                                    {gamification.level.message}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-5xl font-bold drop-shadow-lg">
                                                    {gamification.level.progress}%
                                                </div>
                                                <div className="text-lg text-white/80">Progresso para próximo nível</div>
                                                {/* Debug info - can be removed later */}
                                                <div className="text-xs text-white/60 mt-2">
                                                    Progresso Geral: {gamification.level.overallProgress}%
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full bg-white/20 rounded-full h-4 mb-4 shadow-inner relative z-10">
                                            <div 
                                                className="level-progress h-4 rounded-full shadow-lg" 
                                                style={{width: `${gamification.level.progress}%`}}
                                            ></div>
                                        </div>
                                        
                                        {/* Performance Breakdown */}
                                        <div className="mt-6 bg-white/10 rounded-lg p-4 relative z-10">
                                            <h4 className="text-lg font-semibold mb-3 text-white/90">📊 Detalhes do Progresso</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                <div className="bg-white/5 rounded-lg p-3">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-white/80">Vendas do Mês:</span>
                                                        <span className="font-semibold text-white">{gamification.level.salesProgress}%</span>
                                                    </div>
                                                    <div className="w-full bg-white/20 rounded-full h-2">
                                                        <div 
                                                            className="bg-white h-2 rounded-full"
                                                            style={{width: `${Math.min(100, gamification.level.salesProgress)}%`}}
                                                        ></div>
                                                    </div>
                                                    <div className="text-xs text-white/60 mt-1">
                                                        {formatBRL(gamification.level.currentSales)} / {formatBRL(gamification.level.salesGoal)}
                                                    </div>
                                                </div>
                                                
                                                <div className="bg-white/5 rounded-lg p-3">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-white/80">Comissão do Mês:</span>
                                                        <span className="font-semibold text-white">{gamification.level.commissionProgress}%</span>
                                                    </div>
                                                    <div className="w-full bg-white/20 rounded-full h-2">
                                                        <div 
                                                            className="bg-white h-2 rounded-full"
                                                            style={{width: `${Math.min(100, gamification.level.commissionProgress)}%`}}
                                                        ></div>
                                                    </div>
                                                    <div className="text-xs text-white/60 mt-1">
                                                        {formatBRL(gamification.level.currentCommission)} / {formatBRL(gamification.level.commissionGoal)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Motivational Quote */}
                                    <div className="motivational-card p-8 mb-8 text-white rounded-2xl relative overflow-hidden">
                                        <div className="relative z-10">
                                            <h3 className="text-2xl font-bold mb-4 flex items-center">
                                                <span className="text-3xl mr-3">🎆</span>
                                                Frase Motivacional do Dia
                                            </h3>
                                            <p className="text-xl italic leading-relaxed">
                                                "{gamification.motivationalQuote}"
                                            </p>
                                        </div>
                                    </div>

                                    {/* Achievements */}
                                    {gamification.achievements && gamification.achievements.length > 0 && (
                                        <div className="card-gradient p-8 mb-8 relative z-10">
                                            <div className="flex items-center mb-6">
                                                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
                                                    <span className="text-2xl">🏆</span>
                                                </div>
                                                <h3 className="text-2xl font-bold text-gray-900">Suas Conquistas</h3>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                                {gamification.achievements.map((achievement, index) => (
                                                    <div key={index} className="achievement-card p-6 rounded-2xl text-center shadow-lg">
                                                        <div className="relative z-10">
                                                            <div className="text-4xl mb-3">{achievement.icon}</div>
                                                            <div className="font-bold text-gray-900 text-lg mb-2">{achievement.name}</div>
                                                            <div className="text-sm text-gray-700">{achievement.description}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Enhanced Ranking Display - Removed duplicate */}
                                    
                                    {/* Motivational Message Only - Ranking moved to top */}
                                    <div className="mb-8 animate-fadeInUp">
                                        <div className="card-gradient p-8 relative z-10">
                                            <div className="flex items-center mb-6">
                                                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
                                                    <span className="text-2xl">💪</span>
                                                </div>
                                                <div>
                                                    <h4 className="text-2xl font-bold text-gray-800">Motivação do Dia</h4>
                                                    <p className="text-gray-600 text-sm">Continue brilhando e alcançando seus objetivos!</p>
                                                </div>
                                            </div>
                                            
                                            {/* Motivational Message */}
                                            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 border-l-4 border-pink-400">
                                                <p className="text-sm text-gray-700">
                                                    <span className="font-semibold">💪 Você consegue!</span> Cada venda é um passo mais próximo do topo. 
                                                    Continue se esforçando e inspire outras vendedoras! ✨
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
            
            {/* Sales Modal */}
            <SalesModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                sales={allMonthlySales || []}
                sellerName={auth.user.name || ''}
            />

            {/* Font Awesome Icons */}
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
            />
        </>
    );
}