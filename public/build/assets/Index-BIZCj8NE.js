import{r as h,x as C,j as e,Q as _,t as b,V as n}from"./app-VoDeNzPT.js";import{A as D}from"./AuthenticatedLayout-BYTpjYcl.js";import{f as l}from"./currency-Ct0iAvPU.js";/* empty css            */import"./transition-_AUKL_ZA.js";function Y({sales:t}){const[f,c]=h.useState(!1),[o,x]=h.useState(null),{data:u,setData:v,post:m,processing:d,reset:p}=C({rejection_reason:""}),j=a=>{const r={pendente:{bg:"bg-gradient-to-r from-yellow-100 to-yellow-200",text:"text-yellow-800",border:"border-yellow-300",icon:"⏳",glow:"shadow-yellow-200"},aprovado:{bg:"bg-gradient-to-r from-green-100 to-green-200",text:"text-green-800",border:"border-green-300",icon:"✅",glow:"shadow-green-200"},recusado:{bg:"bg-gradient-to-r from-red-100 to-red-200",text:"text-red-800",border:"border-red-300",icon:"❌",glow:"shadow-red-200"},cancelado:{bg:"bg-gradient-to-r from-gray-100 to-gray-200",text:"text-gray-800",border:"border-gray-300",icon:"⚪",glow:"shadow-gray-200"},estornado:{bg:"bg-gradient-to-r from-purple-100 to-purple-200",text:"text-purple-800",border:"border-purple-300",icon:"🔄",glow:"shadow-purple-200"}},s={pendente:"Pendente",aprovado:"Aprovada",recusado:"Recusada",cancelado:"Cancelada",estornado:"Estornada"},i=r[a]||r.pendente;return e.jsxs("span",{className:`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${i.bg} ${i.text} border-2 ${i.border} ${i.glow} shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105`,children:[e.jsx("span",{className:"text-base",children:i.icon}),s[a]]})},w=a=>new Date(a).toLocaleDateString("pt-BR"),y=a=>{m(route("admin.sales.approve",a.id),{onSuccess:()=>{n.success("Venda aprovada com sucesso! 🎉")},onError:()=>{n.error("Erro ao aprovar venda.")}})},N=a=>{x(a),c(!0)},F=a=>{a.preventDefault(),m(route("admin.sales.reject",o.id),{onSuccess:()=>{n.success("Venda recusada com sucesso."),c(!1),x(null),p()},onError:()=>{n.error("Erro ao recusar venda.")}})},g=t.data.filter(a=>a.status==="pendente").length,k=t.data.filter(a=>a.status==="aprovado").length,E=t.data.filter(a=>a.status==="recusado").length;return e.jsxs(e.Fragment,{children:[e.jsx(_,{title:"Painel Financeiro - BBKits"}),e.jsx("style",{children:`
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
            `}),e.jsx("div",{className:"floating-particles",children:Array.from({length:12},(a,r)=>e.jsx("div",{className:"particle",style:{left:Math.random()*100+"%",width:Math.random()*8+4+"px",height:Math.random()*8+4+"px",animationDelay:Math.random()*15+"s",animationDuration:Math.random()*10+10+"s"}},r))}),e.jsx(D,{header:e.jsx("div",{className:"header-gradient",children:e.jsxs("div",{className:"flex items-center justify-between relative z-10",children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("div",{className:"w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl backdrop-blur-sm",children:e.jsx("i",{className:"fas fa-chart-pie"})}),e.jsxs("div",{children:[e.jsx("h2",{className:"text-3xl font-bold leading-tight",children:"💼 Painel Financeiro"}),e.jsx("p",{className:"text-white/80 text-lg",children:"Aprovação e gestão de vendas das vendedoras"})]})]}),e.jsx("div",{className:"text-right",children:e.jsxs("div",{className:"bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2",children:[e.jsx("div",{className:"text-2xl font-bold",children:g}),e.jsx("div",{className:"text-sm text-white/80",children:"Pendentes"})]})})]})}),children:e.jsx("div",{className:"admin-bg relative z-10",children:e.jsx("div",{className:"py-12",children:e.jsxs("div",{className:"mx-auto max-w-7xl sm:px-6 lg:px-8",children:[e.jsxs("div",{className:"stats-grid",children:[e.jsx("div",{className:"stat-card pending",children:e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("div",{className:"w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-white text-2xl",children:"⏳"}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-2xl font-bold text-yellow-800",children:g}),e.jsx("p",{className:"text-yellow-600 font-semibold",children:"Vendas Pendentes"}),e.jsx("p",{className:"text-yellow-500 text-sm",children:"Aguardando aprovação"})]})]})}),e.jsx("div",{className:"stat-card approved",children:e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("div",{className:"w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center text-white text-2xl",children:"✅"}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-2xl font-bold text-green-800",children:k}),e.jsx("p",{className:"text-green-600 font-semibold",children:"Vendas Aprovadas"}),e.jsx("p",{className:"text-green-500 text-sm",children:"Processadas com sucesso"})]})]})}),e.jsx("div",{className:"stat-card rejected",children:e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("div",{className:"w-16 h-16 bg-gradient-to-br from-red-400 to-pink-400 rounded-full flex items-center justify-center text-white text-2xl",children:"❌"}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-2xl font-bold text-red-800",children:E}),e.jsx("p",{className:"text-red-600 font-semibold",children:"Vendas Recusadas"}),e.jsx("p",{className:"text-red-500 text-sm",children:"Necessitam correção"})]})]})})]}),e.jsx("div",{className:"card-gradient overflow-hidden",children:e.jsx("div",{className:"p-8 text-gray-900",children:t.data.length===0?e.jsxs("div",{className:"empty-state",children:[e.jsx("div",{className:"w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center",children:e.jsx("i",{className:"fas fa-chart-line text-4xl text-blue-500"})}),e.jsx("h3",{className:"text-2xl font-bold text-gray-900 mb-4",children:"Nenhuma venda registrada ainda! 📊"}),e.jsx("p",{className:"text-lg text-gray-600 mb-6 max-w-md mx-auto",children:"As vendas das vendedoras aparecerão aqui quando forem registradas no sistema."}),e.jsx("div",{className:"flex justify-center",children:e.jsx("div",{className:"bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl px-6 py-3",children:e.jsx("p",{className:"text-blue-700 font-medium",children:"🔔 Aguardando registros das vendedoras"})})})]}):e.jsxs("div",{className:"overflow-x-auto",children:[e.jsx("div",{className:"bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-transparent hover:border-pink-200 transition-all duration-300",children:e.jsxs("table",{className:"min-w-full",children:[e.jsx("thead",{className:"table-header",children:e.jsxs("tr",{children:[e.jsxs("th",{className:"px-6 py-4 text-left text-sm font-bold",children:[e.jsx("i",{className:"fas fa-user-tie mr-2"}),"Vendedora"]}),e.jsxs("th",{className:"px-6 py-4 text-left text-sm font-bold",children:[e.jsx("i",{className:"fas fa-user-heart mr-2"}),"Cliente"]}),e.jsxs("th",{className:"px-6 py-4 text-left text-sm font-bold",children:[e.jsx("i",{className:"fas fa-money-bill-wave mr-2"}),"Valor Total"]}),e.jsxs("th",{className:"px-6 py-4 text-left text-sm font-bold",children:[e.jsx("i",{className:"fas fa-hand-holding-usd mr-2"}),"Valor Recebido"]}),e.jsxs("th",{className:"px-6 py-4 text-left text-sm font-bold",children:[e.jsx("i",{className:"fas fa-calendar-alt mr-2"}),"Data Pagamento"]}),e.jsxs("th",{className:"px-6 py-4 text-left text-sm font-bold",children:[e.jsx("i",{className:"fas fa-flag mr-2"}),"Status"]}),e.jsxs("th",{className:"px-6 py-4 text-left text-sm font-bold",children:[e.jsx("i",{className:"fas fa-cogs mr-2"}),"Ações"]})]})}),e.jsx("tbody",{className:"bg-white",children:t.data.map((a,r)=>e.jsxs("tr",{className:`table-row ${r%2===0?"bg-gray-50":"bg-white"}`,children:[e.jsx("td",{className:"px-6 py-4 text-sm font-semibold text-gray-900",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold",children:a.user.name.charAt(0).toUpperCase()}),a.user.name]})}),e.jsx("td",{className:"px-6 py-4 text-sm font-semibold text-gray-900",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-xs",children:a.client_name.charAt(0).toUpperCase()}),a.client_name]})}),e.jsx("td",{className:"px-6 py-4 text-sm font-bold text-green-600",children:l(a.total_amount)}),e.jsx("td",{className:"px-6 py-4 text-sm font-bold text-blue-600",children:l(a.received_amount)}),e.jsxs("td",{className:"px-6 py-4 text-sm text-gray-600 font-medium",children:["📅 ",w(a.payment_date)]}),e.jsx("td",{className:"px-6 py-4 text-sm",children:j(a.status)}),e.jsx("td",{className:"px-6 py-4 text-sm font-medium",children:e.jsxs("div",{className:"flex flex-wrap gap-1",children:[e.jsxs(b,{href:route("sales.show",a.id),className:"action-btn action-btn-view",children:[e.jsx("i",{className:"fas fa-eye mr-1"}),"Ver"]}),a.status==="pendente"&&e.jsxs(e.Fragment,{children:[e.jsxs("button",{onClick:()=>y(a),className:"action-btn action-btn-approve",disabled:d,children:[e.jsx("i",{className:"fas fa-check mr-1"}),"Aprovar"]}),e.jsxs("button",{onClick:()=>N(a),className:"action-btn action-btn-reject",disabled:d,children:[e.jsx("i",{className:"fas fa-times mr-1"}),"Recusar"]})]}),(a.payment_receipt||a.receipt_data)&&(a.receipt_data?e.jsxs("button",{onClick:()=>{try{const s=window.open("","_blank");s?(s.document.open(),s.document.write(`
                                                                                                    <!DOCTYPE html>
                                                                                                    <html>
                                                                                                        <head>
                                                                                                            <title>Comprovante de Pagamento - ${a.client_name}</title>
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
                                                                                                            <div class="info"><strong>Cliente:</strong> ${a.client_name}</div>
                                                                                                            <div class="info"><strong>Valor:</strong> ${l(a.total_amount)}</div>
                                                                                                            <img src="${a.receipt_data}" alt="Comprovante de Pagamento" />
                                                                                                        </body>
                                                                                                    </html>
                                                                                                `),s.document.close()):n.error("Não foi possível abrir o comprovante. Verifique se o pop-up não foi bloqueado.")}catch(s){console.error("Error opening receipt:",s),n.error("Erro ao abrir comprovante. Tente novamente.")}},className:"action-btn action-btn-receipt",children:[e.jsx("i",{className:"fas fa-file-image mr-1"}),"Ver Comprovante"]}):e.jsxs("a",{href:`/storage/${a.payment_receipt}`,target:"_blank",rel:"noopener noreferrer",className:"action-btn action-btn-receipt",children:[e.jsx("i",{className:"fas fa-file-pdf mr-1"}),"Ver Comprovante"]}))]})})]},a.id))})]})}),t.links&&t.links.length>0&&e.jsx("div",{className:"mt-8 bg-white rounded-2xl p-6 shadow-lg",children:e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between items-center gap-4",children:[e.jsxs("div",{className:"text-sm text-gray-700 font-medium bg-gray-50 px-4 py-2 rounded-full",children:["📊 Mostrando ",t.from," a ",t.to," de ",t.total," resultados"]}),e.jsx("div",{className:"flex gap-2",children:t.links.filter(a=>a&&a.url!==null).map((a,r)=>a.url?e.jsx(b,{href:a.url,className:`pagination-btn px-4 py-2 text-sm ${a.active?"pagination-active":"bg-gray-100 text-gray-700 hover:bg-gray-200"}`,dangerouslySetInnerHTML:{__html:a.label}},r):e.jsx("span",{className:"pagination-btn px-4 py-2 text-sm bg-gray-50 text-gray-400 cursor-not-allowed",dangerouslySetInnerHTML:{__html:a.label}},r))})]})})]})})}),e.jsx("div",{className:"mt-8 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6",children:e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("div",{className:"w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xl",children:"👨‍💼"}),e.jsxs("div",{children:[e.jsx("h3",{className:"font-bold text-gray-800 mb-1",children:"Painel de controle financeiro! 💼"}),e.jsx("p",{className:"text-gray-600 text-sm",children:"Gerencie as vendas com eficiência e transparência. Cada aprovação impulsiona o sucesso das nossas vendedoras! ✨"})]})]})})]})})})}),f&&e.jsx("div",{className:"fixed inset-0 modal-overlay overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4",children:e.jsxs("div",{className:"modal-content w-full max-w-md",children:[e.jsx("div",{className:"modal-header",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl",children:"❌"}),e.jsx("h3",{className:"text-xl font-bold",children:"Recusar Venda"})]})}),e.jsxs("div",{className:"p-6",children:[e.jsx("div",{className:"bg-red-50 border border-red-200 rounded-xl p-4 mb-6",children:e.jsxs("div",{className:"flex items-center gap-3 mb-3",children:[e.jsx("div",{className:"w-8 h-8 bg-red-400 rounded-full flex items-center justify-center text-white font-bold",children:e.jsx("i",{className:"fas fa-user"})}),e.jsxs("div",{children:[e.jsxs("p",{className:"font-semibold text-red-900",children:["Cliente: ",o==null?void 0:o.client_name]}),e.jsxs("p",{className:"text-red-700 text-sm",children:["Valor: ",o&&l(o.received_amount)]})]})]})}),e.jsxs("form",{onSubmit:F,children:[e.jsxs("div",{className:"mb-6",children:[e.jsxs("label",{htmlFor:"rejection_reason",className:"block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2",children:[e.jsx("i",{className:"fas fa-comment-alt text-gray-500"}),"Motivo da recusa"]}),e.jsx("textarea",{id:"rejection_reason",value:u.rejection_reason,onChange:a=>v("rejection_reason",a.target.value),className:"form-input",rows:"4",required:!0,placeholder:"Descreva detalhadamente o motivo da recusa para que a vendedora possa corrigir..."})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row gap-3 justify-end",children:[e.jsxs("button",{type:"button",onClick:()=>{c(!1),x(null),p()},className:"btn-cancel",children:[e.jsx("i",{className:"fas fa-times mr-2"}),"Cancelar"]}),e.jsx("button",{type:"submit",disabled:d,className:"btn-danger",children:d?e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"fas fa-spinner fa-spin mr-2"}),"Recusando..."]}):e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"fas fa-ban mr-2"}),"Recusar Venda"]})})]})]})]})]})}),e.jsx("link",{rel:"stylesheet",href:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"})]})}export{Y as default};
