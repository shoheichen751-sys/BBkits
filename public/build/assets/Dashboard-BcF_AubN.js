import{J as N,r as w,j as e,Q as y}from"./app-D1JkyGej.js";import{A as k}from"./AuthenticatedLayout--Kg_QwId.js";import{S as F}from"./SalesModal-D5Yjgu4M.js";import{R as _,U as C,T as M}from"./RankingDisplay-CiT_d7V2.js";import{f as r}from"./currency-nnCpYJTe.js";import{c as o}from"./createLucideIcon-BFE2RcU7.js";import{D as z,F as B}from"./file-text-o7DtRGke.js";/* empty css            */import"./transition-BCuerwHP.js";import"./x-Cx8zfXYH.js";import"./eye-D1Nvb84W.js";/**
 * @license lucide-react v0.536.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]],A=o("arrow-right",S);/**
 * @license lucide-react v0.536.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P=[["path",{d:"m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526",key:"1yiouv"}],["circle",{cx:"12",cy:"8",r:"6",key:"1vp47v"}]],R=o("award",P);/**
 * @license lucide-react v0.536.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]],U=o("plus",I);function K(){var x;const{auth:l,gamification:a,salesData:s,recentSales:n,allMonthlySales:b,topPerformers:c}=N().props,[u,m]=w.useState(!1),f=t=>["","Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"][t]||"",v=()=>{m(!0)};return console.log("Dashboard Props:",{salesData:s,recentSales:n,topPerformers:c}),console.log("Recent Sales Length:",n?n.length:"null/undefined"),console.log("Top Performers:",c),e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
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
            `}),e.jsxs(k,{header:e.jsxs("div",{className:"flex items-center justify-between bg-white/95 backdrop-blur-lg rounded-2xl px-6 py-4 shadow-lg border border-white/20",children:[e.jsx("h2",{className:"text-2xl font-bold logo-glow",children:"Dashboard BBKits ✨"}),e.jsxs("div",{className:"text-sm text-gray-600 bg-gradient-to-r from-pink-100 to-purple-100 px-4 py-2 rounded-full shadow-md",children:["Bem-vinda, ",e.jsx("span",{className:"font-semibold text-pink-600",children:l.user.name}),"! 💎"]})]}),children:[e.jsx(y,{title:"Dashboard - BBKits"}),e.jsxs("div",{className:"dashboard-bg relative overflow-hidden",children:[e.jsx("div",{className:"floating-particles",children:Array.from({length:12},(t,i)=>e.jsx("div",{className:"particle",style:{left:Math.random()*100+"%",width:Math.random()*8+4+"px",height:Math.random()*8+4+"px",animationDelay:Math.random()*15+"s",animationDuration:Math.random()*10+10+"s"}},i))}),e.jsx("div",{className:"py-6 sm:py-8 lg:py-12 relative z-10",children:e.jsxs("div",{className:"mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",children:[l.user.role==="vendedora"&&e.jsxs("div",{className:"mb-8 text-center animate-fadeInUp",children:[e.jsxs("a",{href:"/sales/create-expanded",className:"inline-flex items-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 group",style:{background:"linear-gradient(135deg, #FF6B9D 0%, #C96CBE 50%, #95A5E8 100%)",boxShadow:"0 10px 30px rgba(255, 107, 157, 0.4), 0 0 20px rgba(201, 108, 190, 0.3)"},children:[e.jsx(U,{className:"w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300"}),e.jsx("span",{className:"mr-2",children:"✨ Nova Venda"}),e.jsx(A,{className:"w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"})]}),e.jsx("p",{className:"text-gray-600 mt-3 text-sm",children:"💼 Registre uma venda e aumente suas comissões!"})]}),l.user.role==="vendedora"&&a&&a.ranking&&a.ranking.length>0&&e.jsx("div",{className:"mb-12 animate-fadeInUp",children:e.jsx(_,{ranking:a.ranking,currentUser:l.user,showFull:!1})}),e.jsxs("div",{className:"grid gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4",children:[e.jsx("div",{className:"stat-card animate-fadeInUp",children:e.jsxs("div",{className:"p-4 sm:p-6 flex items-center text-white relative z-10",children:[e.jsx("div",{className:"feature-icon p-3 sm:p-4 rounded-full mr-4 sm:mr-6",children:e.jsx(C,{className:"w-6 sm:w-8 h-6 sm:h-8"})}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-white/90",children:"Total de Vendas"}),e.jsx("p",{className:"text-lg sm:text-2xl font-bold drop-shadow-lg",children:r((s==null?void 0:s.totalSalesAmount)||0)}),e.jsxs("p",{className:"text-xs text-white/80 mt-1",children:["💼 ",(s==null?void 0:s.monthlySalesCount)||0," vendas cadastradas"]})]})]})}),e.jsx("div",{className:"stat-card animate-fadeInUp",children:e.jsxs("div",{className:"p-4 sm:p-6 flex items-center text-white relative z-10",children:[e.jsx("div",{className:"feature-icon p-3 sm:p-4 rounded-full mr-4 sm:mr-6",children:e.jsx(z,{className:"w-6 sm:w-8 h-6 sm:h-8"})}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-white/90",children:"Comissão do Mês"}),e.jsx("p",{className:"text-lg sm:text-2xl font-bold drop-shadow-lg",children:r((s==null?void 0:s.monthlyCommission)||0)}),e.jsx("p",{className:"text-xs text-white/80 mt-1",children:"💰 Seus ganhos"})]})]})}),e.jsx("div",{className:"stat-card animate-fadeInUp",children:e.jsxs("div",{className:"p-4 sm:p-6 flex items-center text-white relative z-10",children:[e.jsx("div",{className:"feature-icon p-3 sm:p-4 rounded-full mr-4 sm:mr-6",children:e.jsx(R,{className:"w-6 sm:w-8 h-6 sm:h-8"})}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-white/90",children:"Vendas Aprovadas"}),e.jsx("p",{className:"text-lg sm:text-2xl font-bold drop-shadow-lg",children:r((s==null?void 0:s.approvedSalesTotal)||0)}),e.jsxs("p",{className:"text-xs text-white/80 mt-1",children:["✅ ",(s==null?void 0:s.approvedSalesCount)||0," aprovadas"]})]})]})}),e.jsx("div",{className:"stat-card animate-fadeInUp",children:e.jsxs("div",{className:"p-4 sm:p-6 flex items-center text-white relative z-10",children:[e.jsx("div",{className:"feature-icon p-3 sm:p-4 rounded-full mr-4 sm:mr-6",children:e.jsx(M,{className:"w-6 sm:w-8 h-6 sm:h-8"})}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-white/90",children:"Meta do Mês"}),e.jsx("p",{className:"text-lg sm:text-2xl font-bold drop-shadow-lg",children:r((s==null?void 0:s.monthlyGoal)||4e4)}),e.jsx("p",{className:"text-xs text-white/80 mt-1",children:"🎯 Objetivo"})]})]})})]}),e.jsxs("div",{className:"grid gap-6 sm:gap-8 mb-8 sm:mb-12 grid-cols-1 md:grid-cols-2",children:[e.jsxs("div",{className:"card-gradient p-4 sm:p-6 lg:p-8 relative z-10",children:[e.jsxs("div",{className:"flex items-center mb-6",children:[e.jsx("div",{className:"w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-4 shadow-lg",children:e.jsx("span",{className:"text-2xl",children:"🎯"})}),e.jsx("h4",{className:"text-lg sm:text-2xl font-bold text-gray-800",children:"Progresso da Meta"})]}),e.jsx("div",{className:"w-full bg-gray-200 rounded-full h-4 shadow-inner mb-4",children:e.jsx("div",{className:"progress-bar h-4 rounded-full shadow-lg",style:{width:`${(s==null?void 0:s.progressPercentage)||0}%`}})}),e.jsxs("div",{className:"flex justify-between items-center mb-4",children:[e.jsxs("p",{className:"text-lg font-medium text-gray-700",children:[(s==null?void 0:s.progressPercentage)||0,"% da meta mensal alcançada"]}),e.jsxs("p",{className:"text-sm text-gray-600 bg-white/70 px-3 py-1 rounded-full",children:["Meta: ",r((s==null?void 0:s.monthlyGoal)||4e4)]})]}),e.jsxs("div",{className:"mb-6",children:[e.jsxs("p",{className:"text-sm text-gray-600 mb-2",children:["Vendido: ",r((s==null?void 0:s.totalSalesAmount)||0)," de ",r((s==null?void 0:s.monthlyGoal)||4e4)]}),e.jsxs("p",{className:"text-sm text-gray-600",children:["Faltam: ",r(Math.max(0,((s==null?void 0:s.monthlyGoal)||4e4)-((s==null?void 0:s.totalSalesAmount)||0)))]})]}),e.jsx("div",{className:"motivational-card p-6 rounded-2xl text-white relative overflow-hidden",children:e.jsxs("div",{className:"relative z-10",children:[e.jsx("p",{className:"text-lg font-semibold mb-2",children:"💪 Dica Motivacional"}),e.jsx("p",{className:"text-pink-100 italic",children:'"Cada venda é uma história de amor que você ajuda a criar. Continue brilhando!"'})]})})]}),e.jsxs("div",{className:"card-gradient p-4 sm:p-6 lg:p-8 relative z-10",children:[e.jsxs("div",{className:"flex items-center mb-6",children:[e.jsx("div",{className:"w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mr-4 shadow-lg",children:e.jsx("span",{className:"text-2xl",children:"💎"})}),e.jsx("h4",{className:"text-lg sm:text-2xl font-bold text-gray-800",children:"Insights de Comissão"})]}),e.jsxs("div",{className:"mb-6 p-4 bg-white/70 rounded-xl",children:[e.jsx("p",{className:"text-sm font-medium text-gray-600 mb-1",children:"Taxa Atual de Comissão"}),e.jsxs("p",{className:"text-3xl font-bold text-purple-600",children:[(s==null?void 0:s.currentRate)||0,"%"]})]}),(s==null?void 0:s.opportunityAlert)&&e.jsx("div",{className:"mb-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl",children:e.jsxs("div",{className:"flex items-start",children:[e.jsx("span",{className:"text-2xl mr-3",children:"🎯"}),e.jsxs("div",{children:[e.jsx("p",{className:"font-semibold text-yellow-800 mb-1",children:"Oportunidade!"}),e.jsx("p",{className:"text-sm text-yellow-700",children:s.opportunityAlert.message})]})]})}),(s==null?void 0:s.nextBracket)&&e.jsxs("div",{className:"mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl",children:[e.jsx("p",{className:"text-sm font-medium text-gray-600 mb-2",children:"Próxima Faixa de Comissão"}),e.jsxs("div",{className:"flex items-center justify-between mb-2",children:[e.jsx("p",{className:"text-lg font-semibold text-gray-800",children:r(s.nextBracket.min_amount)}),e.jsxs("p",{className:"text-2xl font-bold text-purple-600",children:[s.nextBracket.percentage,"%"]})]}),e.jsxs("p",{className:"text-sm text-gray-600",children:["Faltam ",e.jsx("span",{className:"font-bold text-purple-600",children:r(s.nextBracket.amount_needed)})," para alcançar"]})]}),(s==null?void 0:s.potentialEarnings)&&e.jsx("div",{className:"p-4 bg-green-50 border-2 border-green-200 rounded-xl",children:e.jsxs("div",{className:"flex items-start",children:[e.jsx("span",{className:"text-2xl mr-3",children:"💰"}),e.jsxs("div",{className:"flex-1",children:[e.jsx("p",{className:"font-semibold text-green-800 mb-2",children:"Simulação de Ganhos"}),e.jsxs("p",{className:"text-sm text-green-700 mb-1",children:["Comissão atual: ",e.jsx("span",{className:"font-bold",children:r(s.potentialEarnings.current_commission)})]}),e.jsxs("p",{className:"text-sm text-green-700",children:["Se vender mais ",e.jsx("span",{className:"font-bold",children:r(((x=s.nextBracket)==null?void 0:x.amount_needed)||0)}),", você ganhará ",e.jsxs("span",{className:"font-bold text-green-600",children:["+",r(s.potentialEarnings.additional_commission)]})," de comissão!"]})]})]})}),(s==null?void 0:s.commissionRanges)&&s.commissionRanges.length>0&&e.jsxs("div",{className:"mt-6",children:[e.jsx("p",{className:"text-sm font-medium text-gray-600 mb-3",children:"Tabela de Comissões"}),e.jsx("div",{className:"space-y-2",children:s.commissionRanges.map((t,i)=>e.jsxs("div",{className:"flex items-center justify-between p-3 bg-white/50 rounded-lg",children:[e.jsxs("span",{className:"text-sm text-gray-700",children:[r(t.min_amount),t.max_amount?` - R$ ${r(t.max_amount)}`:"+"]}),e.jsxs("span",{className:"font-bold text-purple-600",children:[t.percentage,"%"]})]},i))})]})]}),e.jsxs("div",{className:"card-gradient p-4 sm:p-6 lg:p-8 relative z-10",children:[e.jsxs("div",{className:"flex items-center mb-6",children:[e.jsx("div",{className:"w-12 h-12 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center mr-4 shadow-lg",children:e.jsx("span",{className:"text-2xl",children:"📊"})}),e.jsxs("h4",{className:"text-2xl font-bold text-gray-800",children:["Informações Detalhadas",!(s!=null&&s.isCurrentMonth)&&e.jsxs("span",{className:"text-sm font-normal text-blue-600 ml-2",children:["(",f(s==null?void 0:s.displayMonth)," ",s==null?void 0:s.displayYear,")"]})]})]}),e.jsxs("div",{className:"space-y-3 mb-6",children:[!(s!=null&&s.isCurrentMonth)&&e.jsx("div",{className:"mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg",children:e.jsxs("div",{className:"flex items-center gap-2 text-sm text-blue-700",children:[e.jsx("svg",{className:"w-4 h-4",fill:"currentColor",viewBox:"0 0 20 20",children:e.jsx("path",{fillRule:"evenodd",d:"M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z",clipRule:"evenodd"})}),e.jsx("span",{children:"Exibindo dados do mês mais recente com vendas"})]})}),e.jsxs("div",{className:"flex justify-between items-center p-4 bg-white/50 rounded-lg border border-gray-200",children:[e.jsx("span",{className:"text-sm font-medium text-gray-600",children:"1. Total de Vendas"}),e.jsx("span",{className:"text-lg font-bold text-gray-800",children:r((s==null?void 0:s.totalSalesAmount)||0)})]}),e.jsxs("div",{className:"flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200",children:[e.jsx("span",{className:"text-sm font-medium text-green-600",children:"2. Vendas Aprovadas"}),e.jsx("span",{className:"text-lg font-bold text-green-800",children:r((s==null?void 0:s.approvedSalesTotal)||0)})]}),e.jsxs("div",{className:"flex justify-between items-center p-4 bg-yellow-50 rounded-lg border border-yellow-200",children:[e.jsx("span",{className:"text-sm font-medium text-yellow-600",children:"3. Vendas Pendentes"}),e.jsx("span",{className:"text-lg font-bold text-yellow-800",children:r((s==null?void 0:s.pendingSalesTotal)||0)})]}),e.jsxs("div",{className:"flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200",children:[e.jsx("span",{className:"text-sm font-medium text-blue-600",children:"4. Total de Frete"}),e.jsx("span",{className:"text-lg font-bold text-blue-800",children:r((s==null?void 0:s.totalShipping)||0)})]}),e.jsxs("div",{className:"flex justify-between items-center p-4 bg-purple-50 rounded-lg border border-purple-200",children:[e.jsx("span",{className:"text-sm font-medium text-purple-600",children:"5. Base de Comissão"}),e.jsx("span",{className:"text-lg font-bold text-purple-800",children:r((s==null?void 0:s.commissionBase)||0)})]}),e.jsxs("div",{className:"flex justify-between items-center p-4 bg-orange-50 rounded-lg border border-orange-200",children:[e.jsxs("span",{className:"text-sm font-medium text-orange-600",children:["6. Comissão Total (",(s==null?void 0:s.currentRate)||0,"%)"]}),e.jsx("span",{className:"text-lg font-bold text-orange-800",children:r((s==null?void 0:s.monthlyCommission)||0)})]}),e.jsxs("button",{onClick:v,className:"w-full p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg",children:[e.jsx(B,{className:"w-5 h-5"}),"7. Ver Todas as Vendas"]})]})]}),e.jsxs("div",{className:"card-gradient p-4 sm:p-6 lg:p-8 relative z-10",children:[e.jsxs("div",{className:"flex items-center mb-6",children:[e.jsx("div",{className:"w-12 h-12 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center mr-4 shadow-lg",children:e.jsx("span",{className:"text-2xl",children:"📋"})}),e.jsx("h4",{className:"text-2xl font-bold text-gray-800",children:"Últimas Vendas"})]}),n&&n.length>0?e.jsx("div",{className:"space-y-4",children:n.map((t,i)=>{var h,p;return e.jsxs("div",{className:"p-4 bg-white/50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow",children:[e.jsxs("div",{className:"flex items-center justify-between mb-3",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:`w-3 h-3 rounded-full ${t.status==="aprovado"?"bg-green-500":t.status==="rejeitado"?"bg-red-500":"bg-yellow-500"}`}),e.jsx("span",{className:"font-bold text-gray-900",children:t.client_name}),t.child_name&&e.jsxs("span",{className:"text-sm bg-pink-100 text-pink-700 px-2 py-1 rounded-full font-medium",children:["👶 ",t.child_name]})]}),e.jsxs("div",{className:"text-right",children:[e.jsx("p",{className:"font-bold text-gray-800 text-lg",children:r(t.total_amount||0)}),e.jsx("span",{className:`text-xs px-2 py-1 rounded-full ${t.status==="aprovado"?"bg-green-100 text-green-800":t.status==="rejeitado"?"bg-red-100 text-red-800":"bg-yellow-100 text-yellow-800"}`,children:t.status==="aprovado"?"Aprovado":t.status==="rejeitado"?"Rejeitado":"Pendente"})]})]}),t.sale_products&&t.sale_products.length>0?e.jsx("div",{className:"mb-3",children:e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-2",children:t.sale_products.map((d,j)=>{var g;return e.jsxs("div",{className:"text-sm bg-blue-50 rounded-md p-2",children:[e.jsxs("div",{className:"font-medium text-blue-900",children:["🛍️ ",((g=d.product)==null?void 0:g.name)||"Produto",e.jsxs("span",{className:"ml-1 text-blue-700",children:["(",d.size,")"]})]}),e.jsxs("div",{className:"text-blue-700 text-xs",children:["Qtd: ",d.quantity," • ",r((d.unit_price||0)*(d.quantity||1))]})]},j)})})}):t.product_category&&e.jsx("div",{className:"mb-3",children:e.jsx("div",{className:"text-sm bg-blue-50 rounded-md p-2",children:e.jsxs("div",{className:"font-medium text-blue-900",children:["🛍️ ",((h=t.product_category)==null?void 0:h.name)||"Produto",e.jsxs("span",{className:"ml-1 text-blue-700",children:["(",t.product_size||"N/A",")"]})]})})}),e.jsx("div",{className:"mb-3",children:e.jsxs("div",{className:"text-sm bg-purple-50 rounded-md p-2",children:[e.jsxs("div",{className:"flex items-center gap-2 text-purple-900 font-medium",children:[e.jsx("span",{children:"🎨"}),e.jsx("span",{children:"Bordado:"}),((p=t.embroidery_design)==null?void 0:p.name)&&e.jsx("span",{className:"bg-purple-100 px-2 py-0.5 rounded text-xs",children:t.embroidery_design.name})]}),e.jsxs("div",{className:"text-purple-700 text-xs mt-1 grid grid-cols-1 sm:grid-cols-3 gap-1",children:[t.embroidery_text&&e.jsxs("span",{children:['✍️ "',t.embroidery_text,'"']}),t.embroidery_font&&e.jsxs("span",{children:["🔤 Fonte: ",t.embroidery_font]}),t.embroidery_color&&e.jsxs("span",{children:["🎨 Cor: ",t.embroidery_color]})]}),t.embroidery_position&&e.jsxs("div",{className:"text-purple-600 text-xs mt-1",children:["📍 Posição: ",t.embroidery_position]})]})}),e.jsxs("div",{className:"flex justify-between items-center text-sm text-gray-600 pt-2 border-t border-gray-200",children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsxs("span",{children:["💰 Recebido: ",r(t.received_amount||0)]}),e.jsxs("span",{children:["📅 ",new Date(t.payment_date).toLocaleDateString("pt-BR")]})]}),e.jsxs("div",{className:"text-xs text-gray-500",children:["ID: #",t.unique_token||t.id]})]})]},t.id)})}):e.jsxs("div",{className:"text-center py-12",children:[e.jsx("div",{className:"w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg",children:e.jsx("svg",{className:"w-10 h-10 text-gray-400",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"})})}),e.jsx("p",{className:"text-xl font-semibold text-gray-600 mb-2",children:"Nenhuma venda registrada ainda"}),e.jsx("p",{className:"text-gray-500",children:"Registre sua primeira venda para começar! 🚀"})]})]})]}),e.jsx("div",{className:"stat-card p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12 relative z-10",children:e.jsxs("div",{className:"flex items-center justify-between text-white",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center mb-3",children:[e.jsx("span",{className:"text-3xl mr-3",children:l.user.role==="vendedora"?"💼":"⚡"}),e.jsx("h4",{className:"text-2xl font-bold",children:l.user.role==="vendedora"?"Pronta para vender mais?":"Gerencie o Sistema BBKits"})]}),e.jsx("p",{className:"text-white/90 text-lg",children:l.user.role==="vendedora"?"Registre uma nova venda e aumente suas comissões!":"Acesse as ferramentas administrativas"})]}),e.jsx("div",{className:"flex flex-col sm:flex-row gap-3 sm:gap-4",children:l.user.role==="vendedora"?e.jsxs(e.Fragment,{children:[e.jsx("a",{href:"/sales/create",className:"cta-buttons px-6 py-3 text-sm font-semibold text-white bg-white/20 border border-white/30 rounded-2xl transition-all duration-300 hover:scale-105",children:"✨ Nova Venda"}),e.jsx("a",{href:"/reports/sales",className:"cta-buttons px-6 py-3 text-sm font-semibold text-white bg-white/20 border border-white/30 rounded-2xl transition-all duration-300 hover:scale-105",children:"📄 Relatório PDF"})]}):e.jsxs(e.Fragment,{children:[e.jsx("a",{href:"/admin/dashboard",className:"cta-buttons px-6 py-3 text-sm font-semibold text-white bg-white/20 border border-white/30 rounded-2xl transition-all duration-300 hover:scale-105",children:"📊 Admin Dashboard"}),e.jsx("a",{href:"/admin/sales",className:"cta-buttons px-6 py-3 text-sm font-semibold text-white bg-white/20 border border-white/30 rounded-2xl transition-all duration-300 hover:scale-105",children:"✅ Aprovar Vendas"})]})})]})}),l.user.role==="vendedora"&&a&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"stat-card p-10 mb-8 text-white relative overflow-hidden",children:[e.jsxs("div",{className:"flex items-center justify-between mb-8 relative z-10",children:[e.jsxs("div",{children:[e.jsxs("h2",{className:"text-3xl font-bold mb-3 flex items-center",children:[e.jsx("span",{className:"text-4xl mr-3",children:a.level.icon}),"Nível ",a.level.level]}),e.jsx("p",{className:"text-xl text-white/90",children:a.level.message})]}),e.jsxs("div",{className:"text-right",children:[e.jsxs("div",{className:"text-5xl font-bold drop-shadow-lg",children:[a.level.progress,"%"]}),e.jsx("div",{className:"text-lg text-white/80",children:"Progresso para próximo nível"}),e.jsxs("div",{className:"text-xs text-white/60 mt-2",children:["Progresso Geral: ",a.level.overallProgress,"%"]})]})]}),e.jsx("div",{className:"w-full bg-white/20 rounded-full h-4 mb-4 shadow-inner relative z-10",children:e.jsx("div",{className:"level-progress h-4 rounded-full shadow-lg",style:{width:`${a.level.progress}%`}})}),e.jsxs("div",{className:"mt-6 bg-white/10 rounded-lg p-4 relative z-10",children:[e.jsx("h4",{className:"text-lg font-semibold mb-3 text-white/90",children:"📊 Detalhes do Progresso"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4 text-sm",children:[e.jsxs("div",{className:"bg-white/5 rounded-lg p-3",children:[e.jsxs("div",{className:"flex justify-between items-center mb-1",children:[e.jsx("span",{className:"text-white/80",children:"Vendas do Mês:"}),e.jsxs("span",{className:"font-semibold text-white",children:[a.level.salesProgress,"%"]})]}),e.jsx("div",{className:"w-full bg-white/20 rounded-full h-2",children:e.jsx("div",{className:"bg-white h-2 rounded-full",style:{width:`${Math.min(100,a.level.salesProgress)}%`}})}),e.jsxs("div",{className:"text-xs text-white/60 mt-1",children:[r(a.level.currentSales)," / ",r(a.level.salesGoal)]})]}),e.jsxs("div",{className:"bg-white/5 rounded-lg p-3",children:[e.jsxs("div",{className:"flex justify-between items-center mb-1",children:[e.jsx("span",{className:"text-white/80",children:"Comissão do Mês:"}),e.jsxs("span",{className:"font-semibold text-white",children:[a.level.commissionProgress,"%"]})]}),e.jsx("div",{className:"w-full bg-white/20 rounded-full h-2",children:e.jsx("div",{className:"bg-white h-2 rounded-full",style:{width:`${Math.min(100,a.level.commissionProgress)}%`}})}),e.jsxs("div",{className:"text-xs text-white/60 mt-1",children:[r(a.level.currentCommission)," / ",r(a.level.commissionGoal)]})]})]})]})]}),e.jsx("div",{className:"motivational-card p-8 mb-8 text-white rounded-2xl relative overflow-hidden",children:e.jsxs("div",{className:"relative z-10",children:[e.jsxs("h3",{className:"text-2xl font-bold mb-4 flex items-center",children:[e.jsx("span",{className:"text-3xl mr-3",children:"🎆"}),"Frase Motivacional do Dia"]}),e.jsxs("p",{className:"text-xl italic leading-relaxed",children:['"',a.motivationalQuote,'"']})]})}),a.achievements&&a.achievements.length>0&&e.jsxs("div",{className:"card-gradient p-8 mb-8 relative z-10",children:[e.jsxs("div",{className:"flex items-center mb-6",children:[e.jsx("div",{className:"w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-4 shadow-lg",children:e.jsx("span",{className:"text-2xl",children:"🏆"})}),e.jsx("h3",{className:"text-2xl font-bold text-gray-900",children:"Suas Conquistas"})]}),e.jsx("div",{className:"grid grid-cols-2 md:grid-cols-3 gap-6",children:a.achievements.map((t,i)=>e.jsx("div",{className:"achievement-card p-6 rounded-2xl text-center shadow-lg",children:e.jsxs("div",{className:"relative z-10",children:[e.jsx("div",{className:"text-4xl mb-3",children:t.icon}),e.jsx("div",{className:"font-bold text-gray-900 text-lg mb-2",children:t.name}),e.jsx("div",{className:"text-sm text-gray-700",children:t.description})]})},i))})]}),e.jsx("div",{className:"mb-8 animate-fadeInUp",children:e.jsxs("div",{className:"card-gradient p-8 relative z-10",children:[e.jsxs("div",{className:"flex items-center mb-6",children:[e.jsx("div",{className:"w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-4 shadow-lg",children:e.jsx("span",{className:"text-2xl",children:"💪"})}),e.jsxs("div",{children:[e.jsx("h4",{className:"text-2xl font-bold text-gray-800",children:"Motivação do Dia"}),e.jsx("p",{className:"text-gray-600 text-sm",children:"Continue brilhando e alcançando seus objetivos!"})]})]}),e.jsx("div",{className:"bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 border-l-4 border-pink-400",children:e.jsxs("p",{className:"text-sm text-gray-700",children:[e.jsx("span",{className:"font-semibold",children:"💪 Você consegue!"})," Cada venda é um passo mais próximo do topo. Continue se esforçando e inspire outras vendedoras! ✨"]})})]})})]})]})})]})]}),e.jsx(F,{isOpen:u,onClose:()=>m(!1),sales:b||[],sellerName:l.user.name||""}),e.jsx("link",{rel:"stylesheet",href:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"})]})}export{K as default};
