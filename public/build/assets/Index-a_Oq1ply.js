import{r as i,j as e,x as k,Q as F,t as p,V as f}from"./app-VoDeNzPT.js";import{A as C}from"./AuthenticatedLayout-BYTpjYcl.js";import{D}from"./DangerButton-BKHkWjWx.js";import{S as E}from"./SecondaryButton-Cb8Q-iW6.js";import{z as u}from"./transition-_AUKL_ZA.js";import{L as b}from"./dialog-iI0iDF3O.js";import{f as L}from"./currency-Ct0iAvPU.js";/* empty css            */function R({title:r,titleId:s,...o},d){return i.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:d,"aria-labelledby":s},o),r?i.createElement("title",{id:s},r):null,i.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"m19.5 8.25-7.5 7.5-7.5-7.5"}))}const _=i.forwardRef(R);function B({title:r,titleId:s,...o},d){return i.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:d,"aria-labelledby":s},o),r?i.createElement("title",{id:s},r):null,i.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"m4.5 15.75 7.5-7.5 7.5 7.5"}))}const T=i.forwardRef(B);function V({title:r,titleId:s,...o},d){return i.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:d,"aria-labelledby":s},o),r?i.createElement("title",{id:s},r):null,i.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"}))}const M=i.forwardRef(V);function S({show:r,onClose:s,onConfirm:o,title:d,message:h,processing:c}){return e.jsx(u.Root,{show:r,as:i.Fragment,children:e.jsxs(b,{as:"div",className:"relative z-50",onClose:s,children:[e.jsx(u.Child,{as:i.Fragment,enter:"ease-out duration-300",enterFrom:"opacity-0",enterTo:"opacity-100",leave:"ease-in duration-200",leaveFrom:"opacity-100",leaveTo:"opacity-0",children:e.jsx("div",{className:"fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"})}),e.jsx("div",{className:"fixed inset-0 z-10 overflow-y-auto",children:e.jsx("div",{className:"flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0",children:e.jsx(u.Child,{as:i.Fragment,enter:"ease-out duration-300",enterFrom:"opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",enterTo:"opacity-100 translate-y-0 sm:scale-100",leave:"ease-in duration-200",leaveFrom:"opacity-100 translate-y-0 sm:scale-100",leaveTo:"opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",children:e.jsxs(b.Panel,{className:"relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg",children:[e.jsx("div",{className:"bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4",children:e.jsxs("div",{className:"sm:flex sm:items-start",children:[e.jsx("div",{className:"mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10",children:e.jsx(M,{className:"h-6 w-6 text-red-600","aria-hidden":"true"})}),e.jsxs("div",{className:"mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left",children:[e.jsx(b.Title,{as:"h3",className:"text-base font-semibold leading-6 text-gray-900",children:d}),e.jsx("div",{className:"mt-2",children:e.jsx("p",{className:"text-sm text-gray-500",children:h})})]})]})}),e.jsxs("div",{className:"bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6",children:[e.jsx(D,{onClick:o,disabled:c,className:"sm:ml-3",children:c?"Excluindo...":"Excluir"}),e.jsx(E,{onClick:s,disabled:c,children:"Cancelar"})]})]})})})})]})})}function z({data:r,columns:s,keyField:o="id"}){const[d,h]=i.useState([]),c=n=>{h(l=>l.includes(n)?l.filter(t=>t!==n):[...l,n])};return e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"hidden md:block overflow-x-auto rounded-xl shadow-lg",children:e.jsxs("table",{className:"min-w-full divide-y divide-gray-200",children:[e.jsx("thead",{className:"bg-gradient-to-r from-pink-50 to-purple-50",children:e.jsx("tr",{children:s.map((n,l)=>e.jsx("th",{className:"px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700",children:n.header},l))})}),e.jsx("tbody",{className:"bg-white divide-y divide-gray-200",children:r.map((n,l)=>e.jsx("tr",{className:"hover:bg-gray-50 transition-colors duration-200",style:{animationDelay:`${l*.05}s`},children:s.map((t,m)=>e.jsx("td",{className:"px-6 py-4 whitespace-nowrap text-sm text-gray-900",children:t.render?t.render(n):n[t.accessor]},m))},n[o]))})]})}),e.jsx("div",{className:"md:hidden space-y-4",children:r.map((n,l)=>e.jsxs("div",{className:"bg-white rounded-xl shadow-md overflow-hidden animate-fadeInUp",style:{animationDelay:`${l*.05}s`},children:[e.jsx("div",{className:"bg-gradient-to-r from-pink-50 to-purple-50 p-4",children:e.jsxs("div",{className:"flex justify-between items-start",children:[e.jsx("div",{className:"flex-1",children:s.slice(0,2).map((t,m)=>e.jsxs("div",{className:"mb-2",children:[e.jsxs("span",{className:"text-xs text-gray-600 uppercase font-semibold",children:[t.header,":"]}),e.jsx("div",{className:"text-sm font-medium text-gray-900 mt-1",children:t.render?t.render(n):n[t.accessor]})]},m))}),e.jsx("button",{onClick:()=>c(n[o]),className:"ml-4 p-2 rounded-full hover:bg-white/50 transition-colors duration-200",children:d.includes(n[o])?e.jsx(T,{className:"h-5 w-5 text-gray-600"}):e.jsx(_,{className:"h-5 w-5 text-gray-600"})})]})}),d.includes(n[o])&&e.jsx("div",{className:"px-4 py-3 bg-gray-50 space-y-3 animate-slideDown",children:s.slice(2).map((t,m)=>e.jsxs("div",{className:"flex justify-between items-start",children:[e.jsxs("span",{className:"text-xs text-gray-600 uppercase font-semibold",children:[t.header,":"]}),e.jsx("div",{className:"text-sm text-gray-900 text-right ml-2",children:t.render?t.render(n):n[t.accessor]})]},m))}),s.some(t=>t.mobileQuickView)&&e.jsx("div",{className:"px-4 py-2 bg-white border-t border-gray-100 flex justify-between items-center",children:s.filter(t=>t.mobileQuickView).map((t,m)=>e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"text-xs text-gray-500",children:t.header}),e.jsx("div",{className:"text-sm font-semibold text-gray-900",children:t.render?t.render(n):n[t.accessor]})]},m))})]},n[o]))}),e.jsx("style",{jsx:!0,children:`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes slideDown {
                    from {
                        opacity: 0;
                        max-height: 0;
                    }
                    to {
                        opacity: 1;
                        max-height: 500px;
                    }
                }

                .animate-fadeInUp {
                    animation: fadeInUp 0.5s ease-out forwards;
                    opacity: 0;
                }

                .animate-slideDown {
                    animation: slideDown 0.3s ease-out forwards;
                }
            `})]})}function H({sales:r,auth:s}){const[o,d]=i.useState(!1),[h,c]=i.useState(null),{delete:n,processing:l}=k(),t=a=>{c(a),d(!0)},m=()=>{h&&n(route("sales.destroy",h.id),{onSuccess:()=>{f.success("Venda excluída com sucesso!"),d(!1),c(null)},onError:()=>{f.error("Erro ao excluir a venda."),d(!1),c(null)}})},j=()=>{d(!1),c(null)},w=a=>{const x={pendente:"bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300",aprovado:"bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300",recusado:"bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300",cancelado:"bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300",estornado:"bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300"},g={pendente:"Pendente",aprovado:"Aprovado",recusado:"Recusado",cancelado:"Cancelado",estornado:"Estornado"},N={pendente:"⏳",aprovado:"✅",recusado:"❌",cancelado:"⚪",estornado:"🔄"};return e.jsxs("span",{className:`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${x[a]} shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105`,children:[e.jsx("span",{children:N[a]}),g[a]]})},v=L,y=a=>new Date(a).toLocaleDateString("pt-BR");return e.jsxs(e.Fragment,{children:[e.jsx(F,{title:"Vendas"}),e.jsx("style",{children:`
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

                .sales-bg {
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

                .table-row {
                    transition: all 0.3s ease;
                    border-radius: 15px;
                    margin: 8px 0;
                }

                .table-row:hover {
                    background: var(--gradient-soft) !important;
                    transform: translateX(5px);
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
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

                .action-btn {
                    padding: 8px 16px;
                    border-radius: 10px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    text-decoration: none;
                    display: inline-block;
                    margin: 2px;
                }

                .action-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                }

                .action-btn-view {
                    background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
                    color: white;
                }

                .action-btn-edit {
                    background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
                    color: white;
                }

                .action-btn-delete {
                    background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
                    color: white;
                }

                .action-btn-payment {
                    background: linear-gradient(135deg, #10B981 0%, #059669 100%);
                    color: white;
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
            `}),e.jsx("div",{className:"floating-particles",children:Array.from({length:15},(a,x)=>e.jsx("div",{className:"particle",style:{left:Math.random()*100+"%",width:Math.random()*8+4+"px",height:Math.random()*8+4+"px",animationDelay:Math.random()*15+"s",animationDuration:Math.random()*10+10+"s"}},x))}),e.jsx(C,{header:e.jsx("div",{className:"header-gradient",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("div",{className:"w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl backdrop-blur-sm",children:e.jsx("i",{className:"fas fa-chart-line"})}),e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-bold leading-tight",children:"💼 Minhas Vendas"}),e.jsx("p",{className:"text-white/80 text-sm",children:"Gerencie suas vendas com elegância"})]})]}),e.jsx("div",{className:"flex gap-2",children:e.jsx(p,{href:route("sales.create-expanded"),children:e.jsxs("button",{className:"btn-gradient text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition duration-300",children:[e.jsx("i",{className:"fas fa-plus-circle mr-2"}),"Nova Venda Completa"]})})})]})}),children:e.jsx("div",{className:"sales-bg relative z-10",children:e.jsx("div",{className:"py-12",children:e.jsx("div",{className:"mx-auto max-w-7xl sm:px-6 lg:px-8",children:e.jsx("div",{className:"card-gradient overflow-hidden",children:e.jsx("div",{className:"p-8 text-gray-900",children:r.data.length===0?e.jsxs("div",{className:"empty-state",children:[e.jsx("div",{className:"w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-pink-100 to-yellow-100 rounded-full flex items-center justify-center",children:e.jsx("i",{className:"fas fa-shopping-bag text-4xl text-pink-500"})}),e.jsx("h3",{className:"text-2xl font-bold text-gray-900 mb-4",children:"Nenhuma venda registrada ainda! 🌟"}),e.jsx("p",{className:"text-lg text-gray-600 mb-8 max-w-md mx-auto",children:"Que tal começar sua jornada de sucesso registrando sua primeira venda? Cada grande vendedora começou com uma única venda! 💪"}),e.jsxs("div",{className:"flex flex-col sm:flex-row gap-4 justify-center",children:[e.jsx(p,{href:route("sales.create-expanded"),children:e.jsxs("button",{className:"btn-gradient text-white px-10 py-4 rounded-full text-lg font-bold shadow-xl hover:shadow-2xl",children:[e.jsx("i",{className:"fas fa-rocket mr-3"}),"Registrar Primeira Venda"]})}),e.jsxs("button",{className:"bg-white/80 text-gray-700 hover:bg-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition duration-300 border border-gray-200",children:[e.jsx("i",{className:"fas fa-question-circle mr-2"}),"Como Funciona?"]})]})]}):e.jsxs("div",{className:"overflow-x-auto",children:[e.jsx("div",{className:"mb-6 bg-gradient-to-r from-pink-50 to-yellow-50 border border-pink-200 rounded-xl p-4",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-10 h-10 bg-gradient-to-br from-pink-400 to-yellow-400 rounded-full flex items-center justify-center",children:e.jsx("i",{className:"fas fa-chart-bar text-white"})}),e.jsxs("div",{children:[e.jsxs("h3",{className:"font-semibold text-gray-800",children:["Total de ",r.data.length," vendas registradas"]}),e.jsx("p",{className:"text-sm text-gray-600",children:"Continue assim! Cada venda te aproxima do sucesso! 🎯"})]})]})}),e.jsx(z,{data:r.data,keyField:"id",columns:[{header:"Cliente",accessor:"client_name",render:a=>e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-10 h-10 bg-gradient-to-br from-pink-400 to-yellow-400 rounded-full flex items-center justify-center text-white font-bold",children:a.client_name.charAt(0).toUpperCase()}),e.jsx("span",{className:"font-semibold",children:a.client_name})]})},{header:"Valor Total",accessor:"total_amount",render:a=>e.jsx("span",{className:"font-bold text-green-600",children:v(a.total_amount)}),mobileQuickView:!0},{header:"Valor Recebido",accessor:"received_amount",render:a=>e.jsx("span",{className:"font-bold text-blue-600",children:v(a.received_amount)})},{header:"Data Pagamento",accessor:"payment_date",render:a=>e.jsxs("span",{className:"text-gray-600 font-medium",children:["📅 ",y(a.payment_date)]})},{header:"Status",accessor:"status",render:a=>w(a.status),mobileQuickView:!0},{header:"Ações",accessor:"actions",render:a=>{var x;return e.jsxs("div",{className:"flex gap-2",children:[e.jsxs(p,{href:route("sales.show",a.id),className:"action-btn action-btn-view",children:[e.jsx("i",{className:"fas fa-eye mr-1"}),"Ver"]}),e.jsxs(p,{href:route("payments.index",a.id),className:"action-btn action-btn-payment",title:"Gerenciar Pagamentos",children:[e.jsx("i",{className:"fas fa-dollar-sign mr-1"}),"Pagamentos"]}),a.unique_token&&e.jsxs("button",{onClick:()=>{const g=`${window.location.origin}/pedido/${a.unique_token}`;navigator.clipboard.writeText(g),f.success("Link do cliente copiado!")},className:"action-btn bg-gradient-to-r from-purple-500 to-pink-500 text-white",title:"Copiar link do cliente",children:[e.jsx("i",{className:"fas fa-link mr-1"}),"Link"]}),a.status==="pendente"&&e.jsxs(e.Fragment,{children:[e.jsxs(p,{href:route("sales.edit",a.id),className:"action-btn action-btn-edit",children:[e.jsx("i",{className:"fas fa-edit mr-1"}),"Editar"]}),((x=s==null?void 0:s.user)==null?void 0:x.role)==="admin"&&e.jsxs("button",{onClick:()=>t(a),className:"action-btn action-btn-delete",children:[e.jsx("i",{className:"fas fa-trash mr-1"}),"Excluir"]})]})]})}}]}),r.links&&r.links.length>0&&e.jsx("div",{className:"mt-8 bg-white rounded-2xl p-6 shadow-lg",children:e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between items-center gap-4",children:[e.jsxs("div",{className:"text-sm text-gray-700 font-medium bg-gray-50 px-4 py-2 rounded-full",children:["📊 Mostrando ",r.from," a ",r.to," de ",r.total," resultados"]}),e.jsx("div",{className:"flex gap-2",children:r.links.filter(a=>a&&a.url!==null).map((a,x)=>a.url?e.jsx(p,{href:a.url,className:`pagination-btn px-4 py-2 text-sm ${a.active?"pagination-active":"bg-gray-100 text-gray-700 hover:bg-gray-200"}`,dangerouslySetInnerHTML:{__html:a.label}},x):e.jsx("span",{className:"pagination-btn px-4 py-2 text-sm bg-gray-50 text-gray-400 cursor-not-allowed",dangerouslySetInnerHTML:{__html:a.label}},x))})]})})]})})})})})})}),e.jsx(S,{show:o,onClose:j,onConfirm:m,title:"Excluir Venda",message:h?`Tem certeza que deseja excluir a venda para ${h.client_name}? Esta ação não pode ser desfeita.`:"",processing:l}),e.jsx("link",{rel:"stylesheet",href:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"})]})}export{H as default};
