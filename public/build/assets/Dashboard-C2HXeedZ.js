import{J as y,r as o,S as p,j as e,Q as N}from"./app-VoDeNzPT.js";import{A as k}from"./AuthenticatedLayout-BYTpjYcl.js";import{R as B}from"./RankingDisplay-Dh58nmeo.js";/* empty css            */import"./transition-_AUKL_ZA.js";import"./createLucideIcon-Dyn3Fri4.js";function S({stats:s,topPerformers:d,recentSales:c,monthlyData:F}){const{auth:x}=y().props,[h,r]=o.useState(!1),[n,g]=o.useState(!0),[m,C]=o.useState(30),u=()=>{r(!0),p.reload({only:["stats","topPerformers","recentSales","monthlyData"],preserveScroll:!0,preserveState:!0,onSuccess:()=>{r(!1)},onError:()=>{r(!1)}})};o.useEffect(()=>{if(!n)return;const a=setInterval(()=>{r(!0),p.reload({only:["stats","topPerformers","recentSales","monthlyData"],preserveScroll:!0,preserveState:!0,onSuccess:()=>{r(!1)},onError:()=>{r(!1)}})},m*1e3);return()=>clearInterval(a)},[n,m]);const l=a=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(a),f=a=>new Date(a).toLocaleDateString("pt-BR"),b=a=>{const t={pendente:"bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg",aprovado:"bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg",recusado:"bg-gradient-to-r from-red-400 to-pink-500 text-white shadow-lg"},i={pendente:"Pendente",aprovado:"Aprovado",recusado:"Recusado"};return e.jsx("span",{className:`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transform hover:scale-105 transition-all duration-300 ${t[a]}`,children:i[a]})},v=a=>a.map((t,i)=>({position:i+1,user:{id:t.id,name:t.name,email:t.email,role:t.role},monthly_total:t.total_revenue,monthly_sales_count:t.sales_count,level:{level:t.total_revenue>=6e4?"Elite":t.total_revenue>=5e4?"Avançada":t.total_revenue>=4e4?"Intermediária":"Iniciante"},badge:j(i+1),motivational_message:w(i+1,t.total_revenue),turnaround_alert:null})),j=a=>{switch(a){case 1:return{icon:"🥇",color:"text-yellow-500",bg_color:"bg-yellow-50",border_color:"border-yellow-300",name:"1º Lugar",title:"Campeã do Mês! 👑"};case 2:return{icon:"🥈",color:"text-gray-500",bg_color:"bg-gray-50",border_color:"border-gray-300",name:"2º Lugar",title:"Vice-Campeã! 🌟"};case 3:return{icon:"🥉",color:"text-orange-600",bg_color:"bg-orange-50",border_color:"border-orange-300",name:"3º Lugar",title:"Terceiro Lugar! 🎉"};default:return{icon:"🏅",color:"text-blue-500",bg_color:"bg-blue-50",border_color:"border-blue-300",name:a+"º Lugar",title:"Top "+a+"! 💪"}}},w=(a,t)=>{switch(a){case 1:return{type:"champion",title:"🏆 Vendedora Campeã BBKits!",message:"Parabéns! Você está liderando o ranking e inspirando toda a equipe com seu desempenho excepcional!",emoji:"👑"};case 2:return{type:"vice_champion",title:"🌟 Vice-Campeã BBKits!",message:"Excelente trabalho! Você está entre as melhores e muito próxima da liderança!",emoji:"🥈"};case 3:return{type:"third_place",title:"🎉 Terceiro Lugar BBKits!",message:"Ótimo desempenho! Você está no pódio e tem potencial para subir ainda mais!",emoji:"🥉"};default:return{type:"growth",title:"📈 Vendedora em Ascensão!",message:"Você está construindo um ótimo resultado! Continue assim e logo estará no pódio!",emoji:"🌟"}}};return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
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

                .table-row {
                    transition: all 0.3s ease;
                }

                .table-row:hover {
                    background: var(--gradient-soft);
                    transform: scale(1.01);
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                }

                .quick-action-btn {
                    background: rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    transition: all 0.3s ease;
                }

                .quick-action-btn:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
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

                .ranking-badge {
                    transition: all 0.3s ease;
                }

                .ranking-badge:hover {
                    transform: scale(1.2) rotate(5deg);
                }
            `}),e.jsxs(k,{header:e.jsxs("div",{className:"flex items-center justify-between bg-white/95 backdrop-blur-lg rounded-2xl px-6 py-4 shadow-lg border border-white/20",children:[e.jsx("h2",{className:"text-2xl font-bold logo-glow",children:"Dashboard Administrativo - BBKits ✨"}),e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsxs("div",{className:"flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full shadow-md",children:[e.jsxs("label",{className:"flex items-center cursor-pointer",children:[e.jsx("input",{type:"checkbox",checked:n,onChange:a=>g(a.target.checked),className:"sr-only"}),e.jsx("div",{className:`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${n?"bg-green-500":"bg-gray-300"}`,children:e.jsx("span",{className:`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${n?"translate-x-6":"translate-x-1"}`})}),e.jsxs("span",{className:"ml-2 text-sm font-medium text-gray-700",children:["Auto-refresh ",n&&`(${m}s)`]})]}),h&&e.jsxs("svg",{className:"animate-spin h-4 w-4 text-green-600",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),e.jsx("button",{onClick:u,disabled:h,className:"ml-2 p-2 text-gray-600 hover:text-green-600 transition-colors disabled:opacity-50",title:"Atualizar agora",children:e.jsx("svg",{className:"h-4 w-4",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"})})})]}),e.jsxs("div",{className:"text-sm text-gray-600 bg-gradient-to-r from-pink-100 to-purple-100 px-4 py-2 rounded-full shadow-md",children:["Bem-vindo, ",e.jsx("span",{className:"font-semibold text-pink-600",children:x.user.name}),"! 👋"]})]})]}),children:[e.jsx(N,{title:"Admin Dashboard - BBKits"}),e.jsxs("div",{className:"dashboard-bg relative overflow-hidden",children:[e.jsx("div",{className:"floating-particles",children:Array.from({length:15},(a,t)=>e.jsx("div",{className:"particle",style:{left:Math.random()*100+"%",width:Math.random()*8+4+"px",height:Math.random()*8+4+"px",animationDelay:Math.random()*15+"s",animationDuration:Math.random()*10+10+"s"}},t))}),e.jsx("div",{className:"py-12 relative z-10",children:e.jsxs("div",{className:"mx-auto max-w-7xl sm:px-6 lg:px-8",children:[e.jsxs("div",{className:"grid gap-8 mb-12 md:grid-cols-2 xl:grid-cols-4",children:[e.jsx("div",{className:"stat-card animate-fadeInUp",children:e.jsxs("div",{className:"p-6 flex items-center text-white relative z-10",children:[e.jsx("div",{className:"feature-icon p-4 rounded-full mr-6",children:e.jsx("svg",{className:"w-8 h-8",fill:"currentColor",viewBox:"0 0 20 20",children:e.jsx("path",{d:"M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"})})}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-sm font-medium text-white/90",children:"Total de Vendedoras"}),e.jsx("p",{className:"text-3xl font-bold drop-shadow-lg",children:s.totalSellers}),e.jsx("p",{className:"text-xs text-white/80 mt-1",children:"👥 Equipe BBKits"})]})]})}),e.jsx("div",{className:"stat-card animate-fadeInUp",children:e.jsxs("div",{className:"p-6 flex items-center text-white relative z-10",children:[e.jsx("div",{className:"feature-icon p-4 rounded-full mr-6",children:e.jsx("svg",{className:"w-8 h-8",fill:"currentColor",viewBox:"0 0 20 20",children:e.jsx("path",{d:"M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"})})}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-sm font-medium text-white/90",children:"Vendas Este Mês"}),e.jsx("p",{className:"text-2xl font-bold drop-shadow-lg",children:l(s.monthlyRevenue)}),e.jsx("p",{className:"text-xs text-white/80 mt-1",children:"💰 Faturamento"})]})]})}),e.jsx("div",{className:"stat-card animate-fadeInUp",children:e.jsxs("div",{className:"p-6 flex items-center text-white relative z-10",children:[e.jsx("div",{className:"feature-icon p-4 rounded-full mr-6",children:e.jsx("svg",{className:"w-8 h-8",fill:"currentColor",viewBox:"0 0 20 20",children:e.jsx("path",{d:"M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"})})}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-sm font-medium text-white/90",children:"Vendas Pendentes"}),e.jsx("p",{className:"text-3xl font-bold drop-shadow-lg",children:s.pendingSales}),e.jsx("p",{className:"text-xs text-white/80 mt-1",children:"⏳ Aguardando"})]})]})}),e.jsx("div",{className:"stat-card animate-fadeInUp",children:e.jsxs("div",{className:"p-6 flex items-center text-white relative z-10",children:[e.jsx("div",{className:"feature-icon p-4 rounded-full mr-6",children:e.jsx("svg",{className:"w-8 h-8",fill:"currentColor",viewBox:"0 0 20 20",children:e.jsx("path",{fillRule:"evenodd",d:"M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",clipRule:"evenodd"})})}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-sm font-medium text-white/90",children:"Comissões do Mês"}),e.jsx("p",{className:"text-2xl font-bold drop-shadow-lg",children:l(s.monthlyCommissions)}),e.jsx("p",{className:"text-xs text-white/80 mt-1",children:"🎯 Bonificações"})]})]})})]}),e.jsxs("div",{className:"grid gap-8 mb-12 md:grid-cols-2",children:[e.jsx("div",{className:"animate-fadeInUp",children:d&&d.length>0?e.jsxs("div",{className:"mb-4",children:[e.jsxs("div",{className:"flex items-center justify-between mb-4",children:[e.jsx("h4",{className:"text-lg font-bold text-gray-800",children:"Ranking das Vendedoras"}),e.jsx("a",{href:"/admin/reports",className:"text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-200 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg",children:"Ver Relatório Detalhado →"})]}),e.jsx(B,{ranking:v(d),currentUser:x.user,showFull:!0})]}):e.jsxs("div",{className:"card-gradient p-8 relative z-10",children:[e.jsxs("div",{className:"flex items-center mb-6",children:[e.jsx("div",{className:"w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-4 shadow-lg",children:e.jsx("span",{className:"text-2xl",children:"🏆"})}),e.jsx("h4",{className:"text-2xl font-bold text-gray-800",children:"Top Vendedoras do Mês"})]}),e.jsxs("div",{className:"text-center py-8",children:[e.jsx("div",{className:"w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4",children:e.jsx("span",{className:"text-2xl",children:"📊"})}),e.jsx("p",{className:"text-gray-500 text-lg",children:"Nenhuma venda este mês ainda"}),e.jsx("p",{className:"text-gray-400 text-sm",children:"Seja a primeira! 🚀"})]})]})}),e.jsxs("div",{className:"card-gradient p-8 relative z-10",children:[e.jsxs("div",{className:"flex items-center mb-6",children:[e.jsx("div",{className:"w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-4 shadow-lg",children:e.jsx("span",{className:"text-2xl",children:"📈"})}),e.jsx("h4",{className:"text-2xl font-bold text-gray-800",children:"Progresso Mensal"})]}),e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"flex justify-between mb-3",children:[e.jsx("span",{className:"text-lg font-medium text-gray-700",children:"🎯 Meta Coletiva"}),e.jsxs("span",{className:"text-lg font-bold text-gray-900",children:[l(s.monthlyRevenue)," / ",l(s.monthlyTarget)]})]}),e.jsx("div",{className:"w-full bg-gray-200 rounded-full h-4 shadow-inner",children:e.jsx("div",{className:"progress-bar h-4 rounded-full shadow-lg",style:{width:`${Math.min(s.monthlyRevenue/s.monthlyTarget*100,100)}%`}})}),e.jsxs("p",{className:"text-sm text-gray-600 mt-2 font-medium",children:["🔥 ",(s.monthlyRevenue/s.monthlyTarget*100).toFixed(1),"% da meta alcançada"]})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-6 pt-6 border-t border-gray-200",children:[e.jsxs("div",{className:"text-center p-4 bg-white/70 rounded-2xl shadow-md",children:[e.jsx("p",{className:"text-sm text-gray-600 mb-2",children:"✅ Vendas Aprovadas"}),e.jsx("p",{className:"text-3xl font-bold text-green-600",children:s.approvedSales})]}),e.jsxs("div",{className:"text-center p-4 bg-white/70 rounded-2xl shadow-md",children:[e.jsx("p",{className:"text-sm text-gray-600 mb-2",children:"📊 Taxa de Aprovação"}),e.jsx("p",{className:"text-3xl font-bold text-blue-600",children:s.totalSalesCount>0?(s.approvedSales/s.totalSalesCount*100).toFixed(1)+"%":"0%"})]})]})]})]})]}),e.jsxs("div",{className:"card-gradient p-8 mb-8 relative z-10",children:[e.jsxs("div",{className:"flex items-center mb-6",children:[e.jsx("div",{className:"w-12 h-12 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center mr-4 shadow-lg",children:e.jsx("span",{className:"text-2xl",children:"📋"})}),e.jsx("h4",{className:"text-2xl font-bold text-gray-800",children:"Vendas Recentes"})]}),e.jsx("div",{className:"overflow-x-auto rounded-2xl shadow-lg",children:e.jsxs("table",{className:"min-w-full divide-y divide-gray-200 bg-white/90 backdrop-blur-sm",children:[e.jsx("thead",{className:"bg-gradient-to-r from-pink-50 to-purple-50",children:e.jsxs("tr",{children:[e.jsx("th",{className:"px-6 py-4 text-left text-sm font-bold uppercase tracking-wider text-gray-700",children:"👩‍💼 Vendedora"}),e.jsx("th",{className:"px-6 py-4 text-left text-sm font-bold uppercase tracking-wider text-gray-700",children:"👤 Cliente"}),e.jsx("th",{className:"px-6 py-4 text-left text-sm font-bold uppercase tracking-wider text-gray-700",children:"💰 Valor"}),e.jsx("th",{className:"px-6 py-4 text-left text-sm font-bold uppercase tracking-wider text-gray-700",children:"📅 Data"}),e.jsx("th",{className:"px-6 py-4 text-left text-sm font-bold uppercase tracking-wider text-gray-700",children:"📊 Status"})]})}),e.jsx("tbody",{className:"divide-y divide-gray-200",children:c&&c.length>0?c.map((a,t)=>e.jsxs("tr",{className:"table-row",style:{animationDelay:`${t*.1}s`},children:[e.jsx("td",{className:"whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-900",children:a.user.name}),e.jsx("td",{className:"whitespace-nowrap px-6 py-4 text-sm text-gray-700 font-medium",children:a.client_name}),e.jsx("td",{className:"whitespace-nowrap px-6 py-4 text-sm font-bold text-green-600",children:l(a.received_amount)}),e.jsx("td",{className:"whitespace-nowrap px-6 py-4 text-sm text-gray-600",children:f(a.payment_date)}),e.jsx("td",{className:"whitespace-nowrap px-6 py-4 text-sm",children:b(a.status)})]},a.id)):e.jsx("tr",{children:e.jsx("td",{colSpan:"5",className:"px-6 py-12 text-center",children:e.jsxs("div",{className:"flex flex-col items-center",children:[e.jsx("div",{className:"w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4",children:e.jsx("span",{className:"text-3xl",children:"📋"})}),e.jsx("p",{className:"text-gray-500 text-lg font-medium",children:"Nenhuma venda recente"}),e.jsx("p",{className:"text-gray-400 text-sm",children:"As vendas aparecerão aqui assim que forem registradas"})]})})})})]})})]}),e.jsx("div",{className:"stat-card p-8 relative z-10",children:e.jsxs("div",{className:"flex items-center justify-between text-white",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center mb-3",children:[e.jsx("span",{className:"text-3xl mr-3",children:"⚡"}),e.jsx("h4",{className:"text-2xl font-bold",children:"Ações Rápidas"})]}),e.jsx("p",{className:"text-white/90 text-lg",children:"Gerencie o sistema BBKits com facilidade"})]}),e.jsxs("div",{className:"flex space-x-4",children:[e.jsx("a",{href:"/admin/sales",className:"quick-action-btn px-6 py-3 text-sm font-semibold text-white rounded-2xl transition-all duration-300 hover:scale-105",children:"✅ Aprovar Vendas"}),e.jsx("a",{href:"/admin/reports",className:"quick-action-btn px-6 py-3 text-sm font-semibold text-white rounded-2xl transition-all duration-300 hover:scale-105",children:"📊 Ver Relatórios"}),e.jsx("a",{href:`/admin/export/sales?month=${new Date().getMonth()+1}&year=${new Date().getFullYear()}`,className:"quick-action-btn px-6 py-3 text-sm font-semibold text-white rounded-2xl transition-all duration-300 hover:scale-105",children:"📥 Exportar Excel"}),e.jsx("a",{href:"/admin/commission-ranges",className:"quick-action-btn px-6 py-3 text-sm font-semibold text-white rounded-2xl transition-all duration-300 hover:scale-105",children:"💎 Comissões"})]})]})})]})})]})]}),e.jsx("link",{rel:"stylesheet",href:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"})]})}export{S as default};
