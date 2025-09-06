import{J as R,r as i,j as e,Q as E,S as j}from"./app-VoDeNzPT.js";import{A as I}from"./AuthenticatedLayout-BYTpjYcl.js";/* empty css            */import"./transition-_AUKL_ZA.js";function L({stats:s,topPerformers:h,recentSales:M,monthlyData:$,filterOptions:g,currentFilters:o}){var b,u,f,v;const{auth:N}=R().props,[c,n]=i.useState(!1),[m,y]=i.useState(!0),[w,D]=i.useState(30),[d,_]=i.useState("overview"),[k,F]=i.useState(!1),[r,C]=i.useState({date_filter:o.date_filter||"current_month",status_filter:o.status_filter||"all",start_date:o.start_date||"",end_date:o.end_date||""}),S=()=>{const a=new URLSearchParams;Object.keys(r).forEach(t=>{r[t]&&a.set(t,r[t])}),j.get("/admin/dashboard?"+a.toString(),{},{preserveState:!0,preserveScroll:!0,onStart:()=>n(!0),onFinish:()=>n(!1)})},x=(a,t)=>{C(p=>({...p,[a]:t})),a==="date_filter"&&F(t==="custom")},z=()=>{n(!0),j.reload({only:["stats","topPerformers","recentSales","monthlyData"],preserveScroll:!0,preserveState:!0,onSuccess:()=>{n(!1)},onError:()=>{n(!1)}})},l=a=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(a),A=a=>{const t={pending_payment:"bg-yellow-100 text-yellow-800",payment_approved:"bg-green-100 text-green-800",in_production:"bg-blue-100 text-blue-800",photo_sent:"bg-purple-100 text-purple-800",photo_approved:"bg-indigo-100 text-indigo-800",pending_final_payment:"bg-orange-100 text-orange-800",ready_for_shipping:"bg-teal-100 text-teal-800",shipped:"bg-green-100 text-green-800"},p={pending_payment:"⏳ Aguardando Pagamento",payment_approved:"✅ Pagamento Aprovado",in_production:"🏭 Em Produção",photo_sent:"📸 Foto Enviada",photo_approved:"✨ Foto Aprovada",pending_final_payment:"🟠 Pagamento Final",ready_for_shipping:"📦 Pronto p/ Envio",shipped:"🚚 Enviado"};return e.jsx("span",{className:`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${t[a]}`,children:p[a]||a})},B=a=>{switch(a){case"high":return"bg-red-100 border-red-500 text-red-800";case"medium":return"bg-yellow-100 border-yellow-500 text-yellow-800";case"low":return"bg-blue-100 border-blue-500 text-blue-800";default:return"bg-gray-100 border-gray-500 text-gray-800"}},P=[{id:"overview",name:"📊 Visão Geral",icon:"📊"},{id:"lifecycle",name:"🔄 Ciclo de Pedidos",icon:"🔄"},{id:"performance",name:"⚡ Performance",icon:"⚡"},{id:"bottlenecks",name:"🚨 Gargalos",icon:"🚨"}];return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
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
            `}),e.jsxs(I,{header:e.jsxs("div",{className:"flex items-center justify-between bg-white/95 backdrop-blur-lg rounded-2xl px-6 py-4 shadow-lg border border-white/20",children:[e.jsx("h2",{className:"text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent",children:"Dashboard Avançado - BBKits ✨"}),e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsxs("div",{className:"flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full shadow-md",children:[e.jsxs("label",{className:"flex items-center cursor-pointer",children:[e.jsx("input",{type:"checkbox",checked:m,onChange:a=>y(a.target.checked),className:"sr-only"}),e.jsx("div",{className:`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${m?"bg-green-500":"bg-gray-300"}`,children:e.jsx("span",{className:`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${m?"translate-x-6":"translate-x-1"}`})}),e.jsxs("span",{className:"ml-2 text-sm font-medium text-gray-700",children:["Auto-refresh ",m&&`(${w}s)`]})]}),c&&e.jsxs("svg",{className:"animate-spin h-4 w-4 text-green-600",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),e.jsx("button",{onClick:z,disabled:c,className:"ml-2 p-2 text-gray-600 hover:text-green-600 transition-colors disabled:opacity-50",title:"Atualizar agora",children:e.jsx("svg",{className:"h-4 w-4",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"})})})]}),e.jsxs("div",{className:"text-sm text-gray-600 bg-gradient-to-r from-pink-100 to-purple-100 px-4 py-2 rounded-full shadow-md",children:["Bem-vindo, ",e.jsx("span",{className:"font-semibold text-pink-600",children:N.user.name}),"! 👋"]})]})]}),children:[e.jsx(E,{title:"Dashboard Avançado - BBKits"}),e.jsx("div",{className:"dashboard-bg relative overflow-hidden",children:e.jsx("div",{className:"py-12 relative z-10",children:e.jsxs("div",{className:"mx-auto max-w-7xl sm:px-6 lg:px-8",children:[e.jsxs("div",{className:"card-gradient p-6 mb-8",children:[e.jsx("h3",{className:"text-lg font-bold text-gray-800 mb-4",children:"🔍 Filtros Avançados"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-4 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Período"}),e.jsx("select",{value:r.date_filter,onChange:a=>x("date_filter",a.target.value),className:"filter-select w-full px-3 py-2 text-sm",children:Object.entries(g.dateFilters).map(([a,t])=>e.jsx("option",{value:a,children:t},a))})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Status da Venda"}),e.jsx("select",{value:r.status_filter,onChange:a=>x("status_filter",a.target.value),className:"filter-select w-full px-3 py-2 text-sm",children:Object.entries(g.statusFilters).map(([a,t])=>e.jsx("option",{value:a,children:t},a))})]}),k&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Data Inicial"}),e.jsx("input",{type:"date",value:r.start_date,onChange:a=>x("start_date",a.target.value),className:"filter-select w-full px-3 py-2 text-sm"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Data Final"}),e.jsx("input",{type:"date",value:r.end_date,onChange:a=>x("end_date",a.target.value),className:"filter-select w-full px-3 py-2 text-sm"})]})]}),e.jsx("div",{className:"flex items-end",children:e.jsx("button",{onClick:S,disabled:c,className:"w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50",children:c?"🔄 Aplicando...":"🔍 Aplicar Filtros"})})]})]}),e.jsx("div",{className:"flex space-x-2 mb-8",children:P.map(a=>e.jsx("button",{onClick:()=>_(a.id),className:`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${d===a.id?"tab-active":"tab-inactive"}`,children:a.name},a.id))}),d==="overview"&&e.jsxs("div",{className:"space-y-8",children:[e.jsxs("div",{className:"grid gap-8 mb-12 md:grid-cols-2 xl:grid-cols-4",children:[e.jsx("div",{className:"stat-card animate-fadeInUp",children:e.jsxs("div",{className:"p-6 flex items-center text-white relative z-10",children:[e.jsx("div",{className:"feature-icon p-4 rounded-full mr-6",children:e.jsx("svg",{className:"w-8 h-8",fill:"currentColor",viewBox:"0 0 20 20",children:e.jsx("path",{d:"M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"})})}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-sm font-medium text-white/90",children:"Total de Vendedoras"}),e.jsx("p",{className:"text-3xl font-bold drop-shadow-lg",children:s.totalSellers}),e.jsx("p",{className:"text-xs text-white/80 mt-1",children:"👥 Equipe BBKits"})]})]})}),e.jsx("div",{className:"stat-card animate-fadeInUp",children:e.jsxs("div",{className:"p-6 flex items-center text-white relative z-10",children:[e.jsx("div",{className:"feature-icon p-4 rounded-full mr-6",children:e.jsx("svg",{className:"w-8 h-8",fill:"currentColor",viewBox:"0 0 20 20",children:e.jsx("path",{d:"M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"})})}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-sm font-medium text-white/90",children:"Receita do Período"}),e.jsx("p",{className:"text-2xl font-bold drop-shadow-lg",children:l(s.monthlyRevenue)}),e.jsx("p",{className:"text-xs text-white/80 mt-1",children:"💰 Faturamento"})]})]})}),e.jsx("div",{className:"stat-card animate-fadeInUp",children:e.jsxs("div",{className:"p-6 flex items-center text-white relative z-10",children:[e.jsx("div",{className:"feature-icon p-4 rounded-full mr-6",children:e.jsx("svg",{className:"w-8 h-8",fill:"currentColor",viewBox:"0 0 20 20",children:e.jsx("path",{d:"M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"})})}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-sm font-medium text-white/90",children:"Vendas Pendentes"}),e.jsx("p",{className:"text-3xl font-bold drop-shadow-lg",children:s.pendingSales}),e.jsx("p",{className:"text-xs text-white/80 mt-1",children:"⏳ Aguardando"})]})]})}),e.jsx("div",{className:"stat-card animate-fadeInUp",children:e.jsxs("div",{className:"p-6 flex items-center text-white relative z-10",children:[e.jsx("div",{className:"feature-icon p-4 rounded-full mr-6",children:e.jsx("svg",{className:"w-8 h-8",fill:"currentColor",viewBox:"0 0 20 20",children:e.jsx("path",{fillRule:"evenodd",d:"M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",clipRule:"evenodd"})})}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-sm font-medium text-white/90",children:"Comissões"}),e.jsx("p",{className:"text-2xl font-bold drop-shadow-lg",children:l(s.monthlyCommissions)}),e.jsx("p",{className:"text-xs text-white/80 mt-1",children:"🎯 Bonificações"})]})]})})]}),e.jsxs("div",{className:"grid gap-8 mb-12 md:grid-cols-2",children:[e.jsx("div",{className:"animate-fadeInUp",children:h&&h.length>0?e.jsxs("div",{className:"mb-4",children:[e.jsxs("div",{className:"flex items-center justify-between mb-4",children:[e.jsx("h4",{className:"text-lg font-bold text-gray-800",children:"🏆 Top Vendedoras"}),e.jsx("a",{href:"/admin/reports",className:"text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-200 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg",children:"Ver Relatório Detalhado →"})]}),e.jsx("div",{className:"card-gradient p-6",children:e.jsx("div",{className:"space-y-4",children:h.slice(0,5).map((a,t)=>e.jsxs("div",{className:"flex items-center justify-between p-4 bg-white/70 rounded-xl shadow-md",children:[e.jsxs("div",{className:"flex items-center",children:[e.jsx("div",{className:`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${t===0?"bg-yellow-100 text-yellow-600":t===1?"bg-gray-100 text-gray-600":t===2?"bg-orange-100 text-orange-600":"bg-blue-100 text-blue-600"}`,children:t===0?"🥇":t===1?"🥈":t===2?"🥉":`${t+1}º`}),e.jsxs("div",{children:[e.jsx("p",{className:"font-semibold text-gray-800",children:a.name}),e.jsxs("p",{className:"text-sm text-gray-600",children:[a.sales_count," vendas"]})]})]}),e.jsxs("div",{className:"text-right",children:[e.jsx("p",{className:"font-bold text-green-600",children:l(a.total_revenue||0)}),e.jsxs("p",{className:"text-sm text-gray-600",children:[l(a.total_commission||0)," comissão"]})]})]},a.id))})})]}):e.jsx("div",{className:"card-gradient p-8",children:e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4",children:e.jsx("span",{className:"text-2xl",children:"📊"})}),e.jsx("p",{className:"text-gray-500 text-lg",children:"Nenhuma venda no período selecionado"}),e.jsx("p",{className:"text-gray-400 text-sm",children:"Ajuste os filtros para ver dados"})]})})}),e.jsxs("div",{className:"card-gradient p-8 animate-fadeInUp",children:[e.jsxs("div",{className:"flex items-center mb-6",children:[e.jsx("div",{className:"w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-4 shadow-lg",children:e.jsx("span",{className:"text-2xl",children:"📈"})}),e.jsx("h4",{className:"text-2xl font-bold text-gray-800",children:"Progresso"})]}),e.jsx("div",{className:"space-y-6",children:e.jsxs("div",{children:[e.jsxs("div",{className:"flex justify-between mb-3",children:[e.jsx("span",{className:"text-lg font-medium text-gray-700",children:"🎯 Meta Mensal"}),e.jsxs("span",{className:"text-lg font-bold text-gray-900",children:[l(s.monthlyRevenue)," / ",l(s.monthlyTarget)]})]}),e.jsx("div",{className:"w-full bg-gray-200 rounded-full h-4 shadow-inner",children:e.jsx("div",{className:"progress-bar h-4 rounded-full shadow-lg",style:{width:`${Math.min(s.monthlyRevenue/s.monthlyTarget*100,100)}%`}})}),e.jsxs("p",{className:"text-sm text-gray-600 mt-2 font-medium",children:["🔥 ",(s.monthlyRevenue/s.monthlyTarget*100).toFixed(1),"% da meta alcançada"]})]})})]})]})]}),d==="lifecycle"&&e.jsx("div",{className:"space-y-8",children:e.jsxs("div",{className:"card-gradient p-8",children:[e.jsx("h3",{className:"text-2xl font-bold text-gray-800 mb-6",children:"🔄 Ciclo de Vida dos Pedidos"}),e.jsx("div",{className:"grid grid-cols-2 md:grid-cols-4 gap-6",children:Object.entries(s.orderLifecycle||{}).map(([a,t])=>e.jsxs("div",{className:"bg-white/70 p-6 rounded-xl shadow-md text-center",children:[e.jsx("div",{className:"text-3xl font-bold text-gray-800 mb-2",children:t}),e.jsx("div",{className:"text-sm",children:A(a)})]},a))})]})}),d==="performance"&&e.jsx("div",{className:"space-y-8",children:e.jsxs("div",{className:"card-gradient p-8",children:[e.jsx("h3",{className:"text-2xl font-bold text-gray-800 mb-6",children:"⚡ Métricas de Performance"}),s.performance&&e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6",children:[e.jsxs("div",{className:"bg-white/70 p-6 rounded-xl shadow-md",children:[e.jsx("h4",{className:"font-semibold text-gray-800 mb-2",children:"⏱️ Tempo Médio de Entrega"}),e.jsxs("div",{className:"text-3xl font-bold text-blue-600",children:[s.performance.avg_processing_time_days," dias"]})]}),e.jsxs("div",{className:"bg-white/70 p-6 rounded-xl shadow-md",children:[e.jsx("h4",{className:"font-semibold text-gray-800 mb-2",children:"✅ Taxa de Aprovação"}),e.jsxs("div",{className:"text-3xl font-bold text-green-600",children:[((u=(b=s.performance.conversion_rates)==null?void 0:b.payment_approval_rate)==null?void 0:u.toFixed(1))||0,"%"]})]}),e.jsxs("div",{className:"bg-white/70 p-6 rounded-xl shadow-md",children:[e.jsx("h4",{className:"font-semibold text-gray-800 mb-2",children:"🎯 Taxa de Conclusão"}),e.jsxs("div",{className:"text-3xl font-bold text-purple-600",children:[((v=(f=s.performance.conversion_rates)==null?void 0:f.completion_rate)==null?void 0:v.toFixed(1))||0,"%"]})]})]})]})}),d==="bottlenecks"&&e.jsx("div",{className:"space-y-8",children:e.jsxs("div",{className:"card-gradient p-8",children:[e.jsx("h3",{className:"text-2xl font-bold text-gray-800 mb-6",children:"🚨 Identificação de Gargalos"}),s.bottlenecks&&s.bottlenecks.length>0?e.jsx("div",{className:"space-y-4",children:s.bottlenecks.map((a,t)=>e.jsx("div",{className:`bottleneck-card p-6 rounded-xl ${B(a.severity)}`,children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("p",{className:"font-semibold text-lg",children:a.message}),e.jsxs("p",{className:"text-sm opacity-80 mt-1",children:["Severidade: ",e.jsx("span",{className:"font-medium",children:a.severity.toUpperCase()})]})]}),e.jsx("a",{href:a.action_url,className:"bg-white/80 hover:bg-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105",children:"⚡ Resolver"})]})},t))}):e.jsxs("div",{className:"text-center py-12",children:[e.jsx("div",{className:"w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4",children:e.jsx("span",{className:"text-3xl",children:"✅"})}),e.jsx("p",{className:"text-gray-500 text-lg font-medium",children:"Nenhum gargalo identificado!"}),e.jsx("p",{className:"text-gray-400 text-sm",children:"Tudo funcionando perfeitamente 🎉"})]})]})}),e.jsx("div",{className:"stat-card p-8",children:e.jsxs("div",{className:"flex items-center justify-between text-white",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center mb-3",children:[e.jsx("span",{className:"text-3xl mr-3",children:"⚡"}),e.jsx("h4",{className:"text-2xl font-bold",children:"Ações Rápidas"})]}),e.jsx("p",{className:"text-white/90 text-lg",children:"Acesse funcionalidades principais rapidamente"})]}),e.jsxs("div",{className:"flex space-x-4",children:[e.jsx("a",{href:"/admin/sales",className:"bg-white/20 backdrop-blur-lg px-6 py-3 text-sm font-semibold text-white rounded-2xl transition-all duration-300 hover:scale-105 hover:bg-white/30",children:"✅ Gerenciar Vendas"}),e.jsx("a",{href:"/finance/orders",className:"bg-white/20 backdrop-blur-lg px-6 py-3 text-sm font-semibold text-white rounded-2xl transition-all duration-300 hover:scale-105 hover:bg-white/30",children:"💳 Finanças"}),e.jsx("a",{href:"/production/orders",className:"bg-white/20 backdrop-blur-lg px-6 py-3 text-sm font-semibold text-white rounded-2xl transition-all duration-300 hover:scale-105 hover:bg-white/30",children:"🏭 Produção"}),e.jsx("a",{href:"/admin/reports",className:"bg-white/20 backdrop-blur-lg px-6 py-3 text-sm font-semibold text-white rounded-2xl transition-all duration-300 hover:scale-105 hover:bg-white/30",children:"📊 Relatórios"}),e.jsx("a",{href:"/admin/embroidery",className:"bg-white/20 backdrop-blur-lg px-6 py-3 text-sm font-semibold text-white rounded-2xl transition-all duration-300 hover:scale-105 hover:bg-white/30",children:"🧵 Bordados"}),e.jsxs("div",{className:"relative group",children:[e.jsx("button",{className:"bg-white/20 backdrop-blur-lg px-6 py-3 text-sm font-semibold text-white rounded-2xl transition-all duration-300 hover:scale-105 hover:bg-white/30",children:"💾 Exportar"}),e.jsx("div",{className:"absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50",children:e.jsxs("div",{className:"p-2",children:[e.jsx("a",{href:`/admin/export/sales?date_filter=${r.date_filter}&status_filter=${r.status_filter}&start_date=${r.start_date}&end_date=${r.end_date}`,className:"block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md",children:"📋 Vendas Filtradas"}),e.jsx("a",{href:`/admin/export/commissions?date_filter=${r.date_filter}&status_filter=${r.status_filter}`,className:"block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md",children:"💰 Comissões"}),e.jsx("a",{href:`/admin/export/order-lifecycle?date_filter=${r.date_filter}`,className:"block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md",children:"🔄 Ciclo de Pedidos"}),e.jsx("a",{href:`/admin/export/performance-metrics?date_filter=${r.date_filter}`,className:"block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md",children:"⚡ Métricas Performance"})]})})]})]})]})})]})})})]})]})}export{L as default};
