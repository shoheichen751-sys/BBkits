import{J as j,r as h,j as e,Q as u,S as f}from"./app-VoDeNzPT.js";import{A as N}from"./AuthenticatedLayout-BYTpjYcl.js";/* empty css            */import"./transition-_AUKL_ZA.js";function k({tinyErp:i,whatsApp:r,stats:t}){const{auth:v}=j().props,[d,c]=h.useState({tinyErp:!1,whatsApp:!1}),[l,o]=h.useState({tinyErp:null,whatsApp:null}),g=async()=>{c(s=>({...s,tinyErp:!0}));try{const n=await(await fetch("/admin/integrations/test-tiny-erp",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":document.querySelector('meta[name="csrf-token"]').content}})).json();o(x=>({...x,tinyErp:n}))}catch{o(n=>({...n,tinyErp:{success:!1,message:"Erro de conexão"}}))}finally{c(s=>({...s,tinyErp:!1}))}},p=async()=>{c(s=>({...s,whatsApp:!0}));try{const n=await(await fetch("/admin/integrations/test-whatsapp",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":document.querySelector('meta[name="csrf-token"]').content}})).json();o(x=>({...x,whatsApp:n}))}catch{o(n=>({...n,whatsApp:{success:!1,message:"Erro de conexão"}}))}finally{c(s=>({...s,whatsApp:!1}))}},b=()=>{confirm("Sincronizar todos os pedidos com Tiny ERP? Esta operação pode demorar alguns minutos.")&&f.post("/admin/integrations/bulk-sync")},m=s=>s.success?e.jsx("span",{className:"inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800",children:"✅ Conectado"}):e.jsx("span",{className:"inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800",children:"❌ Desconectado"}),a=s=>new Intl.NumberFormat("pt-BR").format(s);return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
                
                :root {
                    --primary-color: #D4A574;
                    --secondary-color: #F5E6D3;
                    --accent-color: #E8B4CB;
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
                }

                .stat-card:hover {
                    transform: translateY(-5px);
                }

                .integration-card {
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%);
                    border-radius: 20px;
                    box-shadow: var(--shadow);
                    border: 2px solid transparent;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }

                .integration-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: var(--gradient);
                }

                .integration-card:hover {
                    transform: translateY(-3px);
                    border-color: var(--primary-color);
                    box-shadow: var(--shadow-hover);
                }

                .btn-primary {
                    background: var(--gradient);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    padding: 10px 20px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(212, 165, 116, 0.3);
                }

                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(212, 165, 116, 0.4);
                }

                .btn-secondary {
                    background: rgba(255, 255, 255, 0.9);
                    color: var(--primary-color);
                    border: 2px solid var(--primary-color);
                    border-radius: 12px;
                    padding: 10px 20px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }

                .btn-secondary:hover {
                    background: var(--primary-color);
                    color: white;
                    transform: translateY(-2px);
                }

                .animate-pulse {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }

                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: .5;
                    }
                }
            `}),e.jsxs(N,{header:e.jsxs("div",{className:"flex items-center justify-between bg-white/95 backdrop-blur-lg rounded-2xl px-6 py-4 shadow-lg border border-white/20",children:[e.jsx("h2",{className:"text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent",children:"Integrações BBKits 🔗"}),e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("a",{href:"/admin/integrations/logs",className:"btn-secondary text-sm",children:"📋 Ver Logs"}),e.jsx("button",{onClick:b,className:"btn-primary text-sm",children:"🔄 Sincronizar Tudo"})]})]}),children:[e.jsx(u,{title:"Integrações - BBKits"}),e.jsx("div",{className:"dashboard-bg",children:e.jsx("div",{className:"py-12",children:e.jsxs("div",{className:"mx-auto max-w-7xl sm:px-6 lg:px-8",children:[e.jsxs("div",{className:"grid gap-8 mb-12 md:grid-cols-2",children:[e.jsxs("div",{className:"integration-card p-8",children:[e.jsxs("div",{className:"flex items-start justify-between mb-6",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center mb-2",children:[e.jsx("div",{className:"w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4",children:e.jsx("span",{className:"text-2xl",children:"📊"})}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-bold text-gray-800",children:"Tiny ERP"}),e.jsx("p",{className:"text-sm text-gray-600",children:"Sistema de gestão empresarial"})]})]}),m(i.status)]}),e.jsx("button",{onClick:g,disabled:d.tinyErp,className:`btn-secondary text-sm ${d.tinyErp?"opacity-50 animate-pulse":""}`,children:d.tinyErp?"🔄 Testando...":"🧪 Testar Conexão"})]}),l.tinyErp&&e.jsx("div",{className:`mb-4 p-3 rounded-lg ${l.tinyErp.success?"bg-green-50 text-green-800":"bg-red-50 text-red-800"}`,children:e.jsx("p",{className:"text-sm font-medium",children:l.tinyErp.message})}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-sm text-gray-600",children:"🌐 URL Base:"}),e.jsx("span",{className:"text-sm font-medium",children:i.config.base_url})]}),e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-sm text-gray-600",children:"🔑 Token Configurado:"}),e.jsx("span",{className:`text-sm font-medium ${i.config.has_token?"text-green-600":"text-red-600"}`,children:i.config.has_token?"✅ Sim":"❌ Não"})]}),e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-sm text-gray-600",children:"📦 Remetente Configurado:"}),e.jsx("span",{className:`text-sm font-medium ${i.config.sender_configured?"text-green-600":"text-red-600"}`,children:i.config.sender_configured?"✅ Sim":"❌ Não"})]})]}),e.jsxs("div",{className:"mt-6 pt-6 border-t border-gray-200",children:[e.jsx("h4",{className:"font-semibold text-gray-800 mb-3",children:"📈 Estatísticas"}),e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsxs("div",{className:"text-center p-3 bg-white/70 rounded-lg",children:[e.jsx("div",{className:"text-2xl font-bold text-blue-600",children:a(t.tiny_erp.invoices_generated)}),e.jsx("div",{className:"text-xs text-gray-600",children:"Notas Geradas"})]}),e.jsxs("div",{className:"text-center p-3 bg-white/70 rounded-lg",children:[e.jsx("div",{className:"text-2xl font-bold text-green-600",children:a(t.tiny_erp.shipping_labels_generated)}),e.jsx("div",{className:"text-xs text-gray-600",children:"Etiquetas Geradas"})]}),e.jsxs("div",{className:"text-center p-3 bg-white/70 rounded-lg",children:[e.jsxs("div",{className:"text-2xl font-bold text-purple-600",children:[t.tiny_erp.success_rate,"%"]}),e.jsx("div",{className:"text-xs text-gray-600",children:"Taxa de Sucesso"})]}),e.jsxs("div",{className:"text-center p-3 bg-white/70 rounded-lg",children:[e.jsx("div",{className:"text-2xl font-bold text-orange-600",children:a(t.tiny_erp.invoices_this_month)}),e.jsx("div",{className:"text-xs text-gray-600",children:"Este Mês"})]})]})]})]}),e.jsxs("div",{className:"integration-card p-8",children:[e.jsxs("div",{className:"flex items-start justify-between mb-6",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center mb-2",children:[e.jsx("div",{className:"w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4",children:e.jsx("span",{className:"text-2xl",children:"💬"})}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-bold text-gray-800",children:"WhatsApp WATI"}),e.jsx("p",{className:"text-sm text-gray-600",children:"Mensagens automatizadas"})]})]}),m(r.status)]}),e.jsx("button",{onClick:p,disabled:d.whatsApp,className:`btn-secondary text-sm ${d.whatsApp?"opacity-50 animate-pulse":""}`,children:d.whatsApp?"🔄 Testando...":"🧪 Testar Conexão"})]}),l.whatsApp&&e.jsx("div",{className:`mb-4 p-3 rounded-lg ${l.whatsApp.success?"bg-green-50 text-green-800":"bg-red-50 text-red-800"}`,children:e.jsx("p",{className:"text-sm font-medium",children:l.whatsApp.message})}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-sm text-gray-600",children:"🌐 URL Base:"}),e.jsx("span",{className:"text-sm font-medium",children:r.config.base_url})]}),e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-sm text-gray-600",children:"🔑 Token Configurado:"}),e.jsx("span",{className:`text-sm font-medium ${r.config.has_token?"text-green-600":"text-red-600"}`,children:r.config.has_token?"✅ Sim":"❌ Não"})]}),e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-sm text-gray-600",children:"🔥 Ativo:"}),e.jsx("span",{className:`text-sm font-medium ${r.config.enabled?"text-green-600":"text-red-600"}`,children:r.config.enabled?"✅ Sim":"❌ Não"})]}),e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-sm text-gray-600",children:"📝 Templates:"}),e.jsxs("span",{className:"text-sm font-medium text-blue-600",children:[r.config.templates_count," configurados"]})]})]}),e.jsxs("div",{className:"mt-6 pt-6 border-t border-gray-200",children:[e.jsx("h4",{className:"font-semibold text-gray-800 mb-3",children:"📈 Estatísticas"}),e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsxs("div",{className:"text-center p-3 bg-white/70 rounded-lg",children:[e.jsx("div",{className:"text-2xl font-bold text-green-600",children:a(t.whatsapp.total_sent)}),e.jsx("div",{className:"text-xs text-gray-600",children:"Total Enviadas"})]}),e.jsxs("div",{className:"text-center p-3 bg-white/70 rounded-lg",children:[e.jsx("div",{className:"text-2xl font-bold text-blue-600",children:a(t.whatsapp.sent_this_month)}),e.jsx("div",{className:"text-xs text-gray-600",children:"Este Mês"})]}),e.jsxs("div",{className:"text-center p-3 bg-white/70 rounded-lg",children:[e.jsxs("div",{className:"text-2xl font-bold text-purple-600",children:[t.whatsapp.success_rate,"%"]}),e.jsx("div",{className:"text-xs text-gray-600",children:"Taxa de Sucesso"})]}),e.jsxs("div",{className:"text-center p-3 bg-white/70 rounded-lg",children:[e.jsx("div",{className:"text-2xl font-bold text-orange-600",children:a(t.whatsapp.photo_requests)}),e.jsx("div",{className:"text-xs text-gray-600",children:"Fotos Enviadas"})]})]})]})]})]}),e.jsxs("div",{className:"stat-card p-8 mb-8",children:[e.jsx("div",{className:"flex items-center justify-between text-white",children:e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center mb-3",children:[e.jsx("span",{className:"text-3xl mr-3",children:"📊"}),e.jsx("h4",{className:"text-2xl font-bold",children:"Visão Geral das Integrações"})]}),e.jsx("p",{className:"text-white/90 text-lg",children:"Performance geral dos sistemas integrados"})]})}),e.jsxs("div",{className:"mt-8 grid grid-cols-1 md:grid-cols-4 gap-6",children:[e.jsxs("div",{className:"text-center p-6 bg-white/20 backdrop-blur-lg rounded-xl",children:[e.jsx("div",{className:"text-3xl font-bold text-white mb-2",children:a(t.orders.total_orders)}),e.jsx("div",{className:"text-white/80 text-sm",children:"Total de Pedidos"})]}),e.jsxs("div",{className:"text-center p-6 bg-white/20 backdrop-blur-lg rounded-xl",children:[e.jsx("div",{className:"text-3xl font-bold text-white mb-2",children:a(t.orders.orders_this_month)}),e.jsx("div",{className:"text-white/80 text-sm",children:"Pedidos Este Mês"})]}),e.jsxs("div",{className:"text-center p-6 bg-white/20 backdrop-blur-lg rounded-xl",children:[e.jsx("div",{className:"text-3xl font-bold text-white mb-2",children:a(t.orders.integrated_orders)}),e.jsx("div",{className:"text-white/80 text-sm",children:"Pedidos Integrados"})]}),e.jsxs("div",{className:"text-center p-6 bg-white/20 backdrop-blur-lg rounded-xl",children:[e.jsxs("div",{className:"text-3xl font-bold text-white mb-2",children:[t.orders.integration_rate,"%"]}),e.jsx("div",{className:"text-white/80 text-sm",children:"Taxa de Integração"})]})]})]}),e.jsxs("div",{className:"card-gradient p-8",children:[e.jsx("h4",{className:"text-xl font-bold text-gray-800 mb-6",children:"🚀 Ações Rápidas"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-4",children:[e.jsxs("a",{href:"/admin/sales",className:"flex items-center p-4 bg-white/70 rounded-lg hover:bg-white/90 transition-all duration-300 hover:transform hover:scale-105",children:[e.jsx("span",{className:"text-2xl mr-3",children:"📋"}),e.jsxs("div",{children:[e.jsx("div",{className:"font-semibold text-gray-800",children:"Gerenciar Vendas"}),e.jsx("div",{className:"text-sm text-gray-600",children:"Processar pedidos manualmente"})]})]}),e.jsxs("a",{href:"/admin/integrations/logs",className:"flex items-center p-4 bg-white/70 rounded-lg hover:bg-white/90 transition-all duration-300 hover:transform hover:scale-105",children:[e.jsx("span",{className:"text-2xl mr-3",children:"📊"}),e.jsxs("div",{children:[e.jsx("div",{className:"font-semibold text-gray-800",children:"Ver Logs"}),e.jsx("div",{className:"text-sm text-gray-600",children:"Histórico de integrações"})]})]}),e.jsxs("a",{href:"/admin/enhanced-dashboard",className:"flex items-center p-4 bg-white/70 rounded-lg hover:bg-white/90 transition-all duration-300 hover:transform hover:scale-105",children:[e.jsx("span",{className:"text-2xl mr-3",children:"📈"}),e.jsxs("div",{children:[e.jsx("div",{className:"font-semibold text-gray-800",children:"Dashboard"}),e.jsx("div",{className:"text-sm text-gray-600",children:"Visão geral do sistema"})]})]})]})]})]})})})]})]})}export{k as default};
