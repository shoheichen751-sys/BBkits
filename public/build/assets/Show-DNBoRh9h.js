import{j as e,Q as N}from"./app-Z5jD7EM8.js";import{A as u}from"./AuthenticatedLayout-C3tggoLp.js";/* empty css            */import"./transition-yU0kzXfW.js";function k({sale:s}){var o;const b=t=>{const r={pendente:{bg:"bg-gradient-to-r from-yellow-100 to-yellow-200",text:"text-yellow-800",border:"border-yellow-300",icon:"⏳",glow:"shadow-yellow-200"},aprovado:{bg:"bg-gradient-to-r from-green-100 to-green-200",text:"text-green-800",border:"border-green-300",icon:"✅",glow:"shadow-green-200"},recusado:{bg:"bg-gradient-to-r from-red-100 to-red-200",text:"text-red-800",border:"border-red-300",icon:"❌",glow:"shadow-red-200"},cancelado:{bg:"bg-gradient-to-r from-gray-100 to-gray-200",text:"text-gray-800",border:"border-gray-300",icon:"⚪",glow:"shadow-gray-200"},estornado:{bg:"bg-gradient-to-r from-purple-100 to-purple-200",text:"text-purple-800",border:"border-purple-300",icon:"🔄",glow:"shadow-purple-200"}},l={pendente:"Pendente",aprovado:"Aprovada",recusado:"Recusada",cancelado:"Cancelada",estornado:"Estornada"},i=r[t]||r.pendente;return e.jsxs("span",{className:`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold ${i.bg} ${i.text} border-2 ${i.border} ${i.glow} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`,children:[e.jsx("span",{className:"text-lg",children:i.icon}),l[t]]})},a=t=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(t),j=t=>new Date(t).toLocaleDateString("pt-BR"),d=t=>new Date(t).toLocaleString("pt-BR"),n=(t=>({pix:{label:"PIX",icon:"🔗"},boleto:{label:"Boleto Bancário",icon:"📄"},cartao:{label:"Cartão de Crédito/Débito",icon:"💳"},dinheiro:{label:"Dinheiro",icon:"💰"}})[t]||{label:t,icon:"💳"})(s.payment_method);return e.jsxs(e.Fragment,{children:[e.jsx(N,{title:`Venda #${s.id} - BBKits`}),e.jsx("style",{children:`
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
            `}),e.jsx("div",{className:"floating-particles",children:Array.from({length:10},(t,r)=>e.jsx("div",{className:"particle",style:{left:Math.random()*100+"%",width:Math.random()*8+4+"px",height:Math.random()*8+4+"px",animationDelay:Math.random()*15+"s",animationDuration:Math.random()*10+10+"s"}},r))}),e.jsx(u,{header:e.jsx("div",{className:"header-gradient",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("div",{className:"w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl backdrop-blur-sm",children:e.jsx("i",{className:"fas fa-eye"})}),e.jsxs("div",{children:[e.jsxs("h2",{className:"text-2xl font-bold leading-tight",children:["📋 Detalhes da Venda #",s.id]}),e.jsx("p",{className:"text-white/80 text-sm",children:"Visualize todas as informações da sua venda"})]})]}),e.jsx("div",{children:b(s.status)})]})}),children:e.jsx("div",{className:"show-bg relative z-10",children:e.jsx("div",{className:"py-12",children:e.jsxs("div",{className:"mx-auto max-w-4xl sm:px-6 lg:px-8",children:[e.jsxs("div",{className:"detail-card animate-fade-in",children:[e.jsxs("div",{className:"section-title",children:[e.jsx("div",{className:"section-icon",children:e.jsx("i",{className:"fas fa-info-circle"})}),e.jsx("h3",{className:"text-xl font-bold text-gray-800",children:"📊 Resumo da Venda"})]}),e.jsx("div",{className:"bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6",children:e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsxs("div",{className:"w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full flex items-center justify-center text-white text-2xl font-bold",children:["#",s.id]}),e.jsxs("div",{className:"flex-1",children:[e.jsxs("h4",{className:"text-xl font-bold text-gray-800 mb-1",children:["Venda para ",s.client_name]}),e.jsxs("p",{className:"text-gray-600",children:["📅 Registrada em ",d(s.created_at)]}),e.jsxs("p",{className:"text-gray-600",children:["💰 Pagamento via ",n.icon," ",n.label]})]})]})})]}),e.jsxs("div",{className:"grid-enhanced",children:[e.jsxs("div",{className:"detail-card animate-fade-in",children:[e.jsxs("div",{className:"section-title",children:[e.jsx("div",{className:"section-icon",children:e.jsx("i",{className:"fas fa-users"})}),e.jsx("h3",{className:"text-lg font-bold text-gray-800",children:"👥 Informações Gerais"})]}),e.jsxs("div",{className:"space-y-3",children:[e.jsx("div",{className:"detail-item",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold",children:e.jsx("i",{className:"fas fa-user-tie"})}),e.jsxs("div",{children:[e.jsx("dt",{className:"text-sm text-gray-500 font-medium",children:"Vendedora"}),e.jsx("dd",{className:"text-lg font-bold text-gray-900",children:s.user.name})]})]})}),e.jsx("div",{className:"detail-item",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold",children:e.jsx("i",{className:"fas fa-user-heart"})}),e.jsxs("div",{children:[e.jsx("dt",{className:"text-sm text-gray-500 font-medium",children:"Cliente"}),e.jsx("dd",{className:"text-lg font-bold text-gray-900",children:s.client_name})]})]})}),e.jsx("div",{className:"detail-item",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center text-white text-lg",children:n.icon}),e.jsxs("div",{children:[e.jsx("dt",{className:"text-sm text-gray-500 font-medium",children:"Forma de Pagamento"}),e.jsx("dd",{className:"text-lg font-bold text-gray-900",children:n.label})]})]})}),e.jsx("div",{className:"detail-item",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-white font-bold",children:"📅"}),e.jsxs("div",{children:[e.jsx("dt",{className:"text-sm text-gray-500 font-medium",children:"Data do Pagamento"}),e.jsx("dd",{className:"text-lg font-bold text-gray-900",children:j(s.payment_date)})]})]})})]})]}),s.child_name&&e.jsxs("div",{className:"detail-card animate-fade-in",children:[e.jsxs("div",{className:"section-title",children:[e.jsx("div",{className:"section-icon",children:"👶"}),e.jsx("h3",{className:"text-lg font-bold text-gray-800",children:"Dados da Criança"})]}),e.jsx("div",{className:"bg-pink-50 border border-pink-200 rounded-xl p-6",children:e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("div",{className:"w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white text-2xl",children:"👶"}),e.jsxs("div",{children:[e.jsxs("h4",{className:"text-2xl font-bold text-pink-800 mb-1",children:['"',s.child_name,'"']}),e.jsx("p",{className:"text-pink-700 text-sm",children:"Nome usado para personalização dos bordados"})]})]})})]}),e.jsxs("div",{className:"detail-card animate-fade-in",children:[e.jsxs("div",{className:"section-title",children:[e.jsx("div",{className:"section-icon",children:"🛍️"}),e.jsx("h3",{className:"text-lg font-bold text-gray-800",children:"Produtos do Pedido"})]}),s.products&&s.products.length>0?e.jsxs("div",{className:"space-y-4",children:[e.jsx("div",{className:"bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("span",{className:"text-blue-600 text-xl",children:"📦"}),e.jsxs("span",{className:"font-bold text-blue-800",children:[s.products.length," ",s.products.length===1?"produto":"produtos"," no pedido"]})]}),e.jsxs("span",{className:"text-sm text-blue-600 font-medium",children:[s.products.reduce((t,r)=>t+parseInt(r.quantity||1),0)," unidades no total"]})]})}),s.products.map((t,r)=>{var l,i,c,x,m,h,g,p;return e.jsx("div",{className:"bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all",children:e.jsxs("div",{className:"flex items-start gap-4",children:[e.jsx("div",{className:"flex-shrink-0",children:e.jsx("div",{className:"w-20 h-20 rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200",children:(l=t.embroidery_design)!=null&&l.image_url?e.jsx("img",{src:t.embroidery_design.image_url,alt:t.embroidery_design.name,className:"w-full h-full object-cover",onError:f=>{f.target.src="/images/placeholder-embroidery.svg"}}):e.jsx("div",{className:"w-full h-full flex items-center justify-center text-gray-400",children:e.jsx("svg",{className:"w-8 h-8",fill:"currentColor",viewBox:"0 0 20 20",children:e.jsx("path",{fillRule:"evenodd",d:"M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z",clipRule:"evenodd"})})})})}),e.jsxs("div",{className:"flex-1",children:[e.jsxs("div",{className:"flex justify-between items-start mb-3",children:[e.jsxs("div",{children:[e.jsx("h4",{className:"text-xl font-bold text-gray-900 mb-1",children:t.product_name||"Produto"}),e.jsxs("div",{className:"flex items-center gap-4 text-sm text-gray-600",children:[e.jsxs("span",{className:"flex items-center gap-1",children:["📏 ",e.jsx("strong",{children:"Tamanho:"})," ",t.size||"N/A"]}),e.jsxs("span",{className:"flex items-center gap-1",children:["🔢 ",e.jsx("strong",{children:"Qtd:"})," ",t.quantity||1]}),t.product_category&&e.jsxs("span",{className:"flex items-center gap-1",children:["📂 ",e.jsx("strong",{children:"Categoria:"})," ",t.product_category]})]})]}),e.jsxs("div",{className:"text-right",children:[e.jsx("div",{className:"text-2xl font-bold text-green-600",children:a(t.total_price||0)}),e.jsxs("div",{className:"text-sm text-gray-500",children:[a(t.unit_total||0)," × ",t.quantity||1]})]})]}),e.jsxs("div",{className:"bg-pink-50 border border-pink-200 rounded-lg p-4 mb-4",children:[e.jsx("h5",{className:"font-bold text-pink-800 mb-2 flex items-center gap-2",children:"👶 Personalização do Bordado"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-3 text-sm",children:[e.jsxs("div",{children:[e.jsx("strong",{className:"text-pink-700",children:"Nome:"}),e.jsxs("span",{className:"ml-2 font-bold text-pink-900",children:['"',t.embroidery_text||s.child_name||"N/A",'"']})]}),e.jsxs("div",{children:[e.jsx("strong",{className:"text-pink-700",children:"Design:"}),e.jsx("span",{className:"ml-2 text-pink-900",children:((i=t.embroidery_design)==null?void 0:i.name)||"N/A"})]}),e.jsxs("div",{children:[e.jsx("strong",{className:"text-pink-700",children:"Fonte:"}),e.jsx("span",{className:"ml-2 text-pink-900",children:((c=t.embroidery_font)==null?void 0:c.display_name)||((x=t.embroidery_font)==null?void 0:x.name)||"N/A"})]}),e.jsxs("div",{children:[e.jsx("strong",{className:"text-pink-700",children:"Cor:"}),e.jsx("span",{className:"ml-2 text-pink-900",children:((m=t.embroidery_color)==null?void 0:m.name)||"N/A"})]}),e.jsxs("div",{children:[e.jsx("strong",{className:"text-pink-700",children:"Posição:"}),e.jsx("span",{className:"ml-2 text-pink-900",children:((h=t.embroidery_position)==null?void 0:h.display_name)||((g=t.embroidery_position)==null?void 0:g.name)||"N/A"})]}),((p=t.embroidery_design)==null?void 0:p.category)&&e.jsxs("div",{children:[e.jsx("strong",{className:"text-pink-700",children:"Categoria:"}),e.jsx("span",{className:"ml-2 text-pink-900",children:t.embroidery_design.category})]})]})]}),e.jsxs("div",{className:"bg-gray-50 border border-gray-200 rounded-lg p-4",children:[e.jsx("h5",{className:"font-bold text-gray-800 mb-2 flex items-center gap-2",children:"💰 Detalhamento do Preço"}),e.jsxs("div",{className:"space-y-2 text-sm",children:[e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-gray-600",children:"Preço base:"}),e.jsx("span",{className:"font-medium",children:a(t.unit_price||0)})]}),t.size_price>0&&e.jsxs("div",{className:"flex justify-between",children:[e.jsxs("span",{className:"text-gray-600",children:["Acréscimo tamanho (",t.size,"):"]}),e.jsxs("span",{className:"font-medium",children:["+",a(t.size_price||0)]})]}),t.embroidery_cost>0&&e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-gray-600",children:"Custo bordado:"}),e.jsxs("span",{className:"font-medium",children:["+",a(t.embroidery_cost||0)]})]}),e.jsxs("div",{className:"border-t border-gray-300 pt-2 flex justify-between font-bold",children:[e.jsx("span",{className:"text-gray-800",children:"Valor unitário:"}),e.jsx("span",{className:"text-green-600",children:a(t.unit_total||0)})]}),e.jsxs("div",{className:"flex justify-between font-bold text-lg",children:[e.jsxs("span",{className:"text-gray-800",children:["Total (× ",t.quantity,"):"]}),e.jsx("span",{className:"text-green-600",children:a(t.total_price||0)})]})]})]})]})]})},r)}),e.jsxs("div",{className:"bg-green-50 border border-green-200 rounded-xl p-6",children:[e.jsx("h4",{className:"font-bold text-green-800 mb-4 flex items-center gap-2",children:"📊 Resumo dos Produtos"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-4",children:[e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"text-2xl font-bold text-green-600",children:s.products.length}),e.jsxs("div",{className:"text-sm text-green-700",children:[s.products.length===1?"Produto":"Produtos"," diferentes"]})]}),e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"text-2xl font-bold text-green-600",children:s.products.reduce((t,r)=>t+parseInt(r.quantity||1),0)}),e.jsx("div",{className:"text-sm text-green-700",children:"Unidades no total"})]}),e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"text-2xl font-bold text-green-600",children:a(s.products.reduce((t,r)=>t+parseFloat(r.total_price||0),0))}),e.jsx("div",{className:"text-sm text-green-700",children:"Subtotal produtos"})]})]})]})]}):e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"bg-amber-50 border border-amber-200 rounded-xl p-6",children:[e.jsxs("div",{className:"flex items-center gap-3 mb-3",children:[e.jsx("span",{className:"text-amber-500 text-2xl",children:"ℹ️"}),e.jsx("h4",{className:"font-bold text-amber-800",children:"Informações Básicas do Produto"})]}),e.jsx("p",{className:"text-amber-700 text-sm mb-4",children:"Esta venda foi registrada antes da implementação do sistema detalhado de produtos. Apenas informações básicas estão disponíveis."})]}),s.product_category&&e.jsx("div",{className:"detail-item",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold",children:"📂"}),e.jsxs("div",{children:[e.jsx("dt",{className:"text-sm text-gray-500 font-medium",children:"Categoria"}),e.jsx("dd",{className:"text-lg font-bold text-gray-900",children:((o=s.product_category)==null?void 0:o.name)||"Não informado"})]})]})}),s.product_size&&e.jsx("div",{className:"detail-item",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold",children:"📏"}),e.jsxs("div",{children:[e.jsx("dt",{className:"text-sm text-gray-500 font-medium",children:"Tamanho"}),e.jsxs("dd",{className:"text-lg font-bold text-gray-900",children:[s.product_size," (",s.product_size==="P"?"Pequeno":s.product_size==="M"?"Médio":s.product_size==="G"?"Grande":"Extra Grande",")"]})]})]})}),s.product_price&&e.jsx("div",{className:"detail-item",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center text-white font-bold",children:"💰"}),e.jsxs("div",{children:[e.jsx("dt",{className:"text-sm text-gray-500 font-medium",children:"Preço Base do Produto"}),e.jsx("dd",{className:"text-lg font-bold text-gray-900",children:a(s.product_price)})]})]})})]})]}),e.jsxs("div",{className:"detail-card animate-fade-in",children:[e.jsxs("div",{className:"section-title",children:[e.jsx("div",{className:"section-icon",children:"📦"}),e.jsx("h3",{className:"text-lg font-bold text-gray-800",children:"Endereço de Entrega"})]}),s.delivery_address?e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"bg-green-50 border border-green-200 rounded-xl p-4 mb-4",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[e.jsx("span",{className:"text-green-500 text-lg",children:"✅"}),e.jsx("span",{className:"font-medium text-green-800",children:"Endereço Confirmado pelo Cliente"})]}),e.jsx("p",{className:"text-green-700 text-sm",children:"Cliente preencheu o endereço de entrega completo."})]}),e.jsx("div",{className:"detail-item",children:e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx("div",{className:"w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold",children:"🏠"}),e.jsxs("div",{className:"flex-1",children:[e.jsx("dt",{className:"text-sm text-gray-500 font-medium",children:"Endereço Completo"}),e.jsxs("dd",{className:"text-lg font-bold text-gray-900 mb-1",children:[s.delivery_address,", ",s.delivery_number]}),s.delivery_complement&&e.jsx("dd",{className:"text-sm text-gray-600 mb-1",children:s.delivery_complement}),e.jsxs("dd",{className:"text-sm text-gray-600",children:[s.delivery_neighborhood," - ",s.delivery_city,"/",s.delivery_state]}),e.jsxs("dd",{className:"text-sm text-gray-600 font-mono",children:["CEP: ",s.delivery_zipcode]})]})]})})]}):e.jsxs("div",{className:"bg-amber-50 border border-amber-200 rounded-xl p-6",children:[e.jsxs("div",{className:"flex items-center gap-3 mb-3",children:[e.jsx("span",{className:"text-amber-500 text-2xl",children:"⚠️"}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-bold text-amber-800",children:"Endereço Pendente"}),e.jsx("p",{className:"text-amber-700 text-sm",children:"Cliente ainda não preencheu o endereço de entrega."})]})]}),e.jsx("div",{className:"bg-amber-100 border border-amber-300 rounded-lg p-3",children:e.jsxs("p",{className:"text-sm text-amber-800",children:[e.jsx("strong",{children:"📋 Próximos passos:"}),e.jsx("br",{}),"• Cliente receberá link para preencher endereço",e.jsx("br",{}),"• Endereço é obrigatório para finalizar pedido",e.jsx("br",{}),"• Status será atualizado quando cliente completar"]})}),s.unique_token&&e.jsx("div",{className:"mt-3 pt-3 border-t border-amber-300",children:e.jsxs("p",{className:"text-xs text-amber-700",children:[e.jsx("strong",{children:"Link do cliente:"})," /pedido/",s.unique_token]})})]})]}),e.jsxs("div",{className:"detail-card animate-fade-in",children:[e.jsxs("div",{className:"section-title",children:[e.jsx("div",{className:"section-icon",children:e.jsx("i",{className:"fas fa-dollar-sign"})}),e.jsx("h3",{className:"text-lg font-bold text-gray-800",children:"💰 Valores Financeiros"})]}),e.jsxs("div",{className:"space-y-4",children:[e.jsx("div",{className:"detail-item",children:e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-sm text-gray-500 font-medium",children:"💵 Valor Total do Pedido"}),e.jsx("span",{className:"text-lg font-bold text-gray-900",children:a(s.total_amount)})]})}),e.jsx("div",{className:"detail-item",children:e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-sm text-gray-500 font-medium",children:"🚚 Valor do Frete"}),e.jsx("span",{className:"text-lg font-bold text-gray-900",children:a(s.shipping_amount)})]})}),e.jsx("div",{className:"value-display",children:e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-sm text-green-600 font-bold",children:"✅ Valor Recebido"}),e.jsx("span",{className:"text-2xl font-bold text-green-600",children:a(s.received_amount)})]})}),parseFloat(s.total_amount)+parseFloat(s.shipping_amount||0)>parseFloat(s.received_amount)&&e.jsxs("div",{className:"pending-amount-highlight",children:[e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-sm text-orange-600 font-bold",children:"⏳ Valor Pendente"}),e.jsx("span",{className:"text-xl font-bold text-orange-600",children:a(parseFloat(s.total_amount)+parseFloat(s.shipping_amount||0)-parseFloat(s.received_amount))})]}),e.jsx("p",{className:"text-xs text-orange-500 mt-2",children:"(Total com frete - valor recebido)"})]}),e.jsxs("div",{className:"commission-highlight",children:[e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-sm text-blue-600 font-bold",children:"📈 Base para Comissão"}),e.jsx("span",{className:"text-xl font-bold text-blue-600",children:a(s.total_amount)})]}),e.jsx("p",{className:"text-xs text-blue-500 mt-2",children:"(Valor total dos produtos - frete não incluído)"})]})]})]})]}),s.notes&&e.jsxs("div",{className:"detail-card animate-fade-in",children:[e.jsxs("div",{className:"section-title",children:[e.jsx("div",{className:"section-icon",children:e.jsx("i",{className:"fas fa-sticky-note"})}),e.jsx("h3",{className:"text-lg font-bold text-gray-800",children:"📝 Observações"})]}),e.jsx("div",{className:"notes-display",children:e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx("div",{className:"w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0",children:"💭"}),e.jsx("p",{className:"text-gray-700 font-medium leading-relaxed",children:s.notes})]})})]}),(s.payment_receipt||s.receipt_data)&&e.jsxs("div",{className:"detail-card animate-fade-in",children:[e.jsxs("div",{className:"section-title",children:[e.jsx("div",{className:"section-icon",children:e.jsx("i",{className:"fas fa-file-upload"})}),e.jsx("h3",{className:"text-lg font-bold text-gray-800",children:"📎 Comprovante de Pagamento"})]}),e.jsx("div",{className:"bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6",children:s.receipt_data?e.jsxs("div",{className:"text-center",children:[e.jsx("h4",{className:"font-bold text-gray-800 mb-4",children:"📄 Comprovante de Pagamento"}),e.jsx("img",{src:s.receipt_data,alt:"Comprovante de Pagamento",className:"max-w-full h-auto rounded-lg shadow-lg mx-auto",style:{maxHeight:"600px"}})]}):e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("div",{className:"w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full flex items-center justify-center text-white text-2xl",children:e.jsx("i",{className:"fas fa-file-pdf"})}),e.jsxs("div",{className:"flex-1",children:[e.jsx("h4",{className:"font-bold text-gray-800 mb-2",children:"📄 Comprovante Anexado"}),e.jsx("p",{className:"text-gray-600 text-sm mb-4",children:"Clique no botão abaixo para visualizar o comprovante de pagamento"}),e.jsxs("a",{href:`/storage/${s.payment_receipt}`,target:"_blank",rel:"noopener noreferrer",className:"btn-gradient",children:[e.jsx("i",{className:"fas fa-external-link-alt"}),"Ver Comprovante"]})]})]})})]}),e.jsxs("div",{className:"detail-card animate-fade-in",children:[e.jsxs("div",{className:"section-title",children:[e.jsx("div",{className:"section-icon",children:e.jsx("i",{className:"fas fa-history"})}),e.jsx("h3",{className:"text-lg font-bold text-gray-800",children:"🕐 Histórico da Venda"})]}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"timeline-item",children:[e.jsx("div",{className:"timeline-dot",children:"✨"}),e.jsxs("div",{className:"bg-blue-50 border border-blue-200 rounded-lg p-4",children:[e.jsx("h4",{className:"font-bold text-blue-900 mb-1",children:"Venda Registrada"}),e.jsxs("p",{className:"text-blue-700 text-sm",children:["📅 ",d(s.created_at)]})]})]}),s.status==="aprovado"&&s.approved_by&&e.jsxs("div",{className:"timeline-item",children:[e.jsx("div",{className:"timeline-dot",children:"✅"}),e.jsxs("div",{className:"bg-green-50 border border-green-200 rounded-lg p-4",children:[e.jsx("h4",{className:"font-bold text-green-900 mb-1",children:"Venda Aprovada! 🎉"}),e.jsxs("p",{className:"text-green-700 text-sm mb-2",children:["📅 ",d(s.approved_at)]}),e.jsxs("p",{className:"text-green-700 text-sm",children:["👨‍💼 Aprovada por: ",s.approved_by.name]})]})]}),s.status==="recusado"&&s.rejected_by&&e.jsxs("div",{className:"timeline-item",children:[e.jsx("div",{className:"timeline-dot",children:"❌"}),e.jsxs("div",{className:"bg-red-50 border border-red-200 rounded-lg p-4",children:[e.jsx("h4",{className:"font-bold text-red-900 mb-1",children:"Venda Recusada"}),e.jsxs("p",{className:"text-red-700 text-sm mb-2",children:["📅 ",d(s.rejected_at)]}),e.jsxs("p",{className:"text-red-700 text-sm mb-2",children:["👨‍💼 Recusada por: ",s.rejected_by.name]}),s.rejection_reason&&e.jsxs("div",{className:"bg-red-100 border border-red-300 rounded-lg p-3 mt-3",children:[e.jsx("p",{className:"text-sm font-bold text-red-900 mb-1",children:"💬 Motivo da recusa:"}),e.jsx("p",{className:"text-sm text-red-700",children:s.rejection_reason})]})]})]})]})]}),e.jsx("div",{className:"flex justify-center mt-8",children:e.jsxs("button",{onClick:()=>window.history.back(),className:"btn-back",children:[e.jsx("i",{className:"fas fa-arrow-left"}),"Voltar às Vendas"]})}),e.jsx("div",{className:"mt-8 bg-gradient-to-r from-pink-50 to-yellow-50 border border-pink-200 rounded-xl p-6",children:e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("div",{className:"w-12 h-12 bg-gradient-to-br from-pink-400 to-yellow-400 rounded-full flex items-center justify-center text-white text-xl",children:"🎯"}),e.jsxs("div",{children:[e.jsx("h3",{className:"font-bold text-gray-800 mb-1",children:"Continue assim, vendedora! 💪"}),e.jsx("p",{className:"text-gray-600 text-sm",children:"Cada venda registrada é um passo importante na sua jornada de sucesso. Você está construindo algo incrível! ✨"})]})]})})]})})})}),e.jsx("link",{rel:"stylesheet",href:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"})]})}export{k as default};
