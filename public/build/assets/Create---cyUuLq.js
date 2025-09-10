import{x as m,j as e,Q as h,V as o}from"./app-vPGu1-Ks.js";import{A as g}from"./AuthenticatedLayout-CrgCo1hI.js";import"./TextInput-DuTBkNcH.js";/* empty css            */import"./transition-B1a7D--F.js";function N(){const{data:s,setData:t,post:l,processing:i,errors:r}=m({client_name:"",total_amount:"",shipping_amount:"",payment_method:"pix",received_amount:"",payment_date:"",payment_receipt:null,notes:""}),d=a=>{a.preventDefault(),l(route("sales.store"),{onSuccess:()=>{o.success("Venda registrada com sucesso! 🎉")},onError:n=>{Object.keys(n).forEach(x=>{o.error(n[x])})}})},c={pix:"🔗",boleto:"📄",cartao:"💳",dinheiro:"💰"},p={pix:"PIX",boleto:"Boleto Bancário",cartao:"Cartão de Crédito/Débito",dinheiro:"Dinheiro"};return e.jsxs(e.Fragment,{children:[e.jsx(h,{title:"Registrar Venda"}),e.jsx("style",{children:`
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

                .create-bg {
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

                .form-group {
                    position: relative;
                    margin-bottom: 1.5rem;
                }

                .input-enhanced {
                    background: white;
                    border: 2px solid #E5E7EB;
                    border-radius: 15px;
                    padding: 16px 20px;
                    transition: all 0.3s ease;
                    font-size: 16px;
                    font-weight: 500;
                    width: 100%;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                }

                .input-enhanced:focus {
                    outline: none;
                    border-color: var(--primary-color);
                    box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.1), 0 8px 20px rgba(0, 0, 0, 0.1);
                    transform: translateY(-2px);
                }

                .label-enhanced {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 600;
                    color: var(--text-dark);
                    margin-bottom: 8px;
                    font-size: 14px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .label-icon {
                    width: 24px;
                    height: 24px;
                    background: var(--gradient);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 12px;
                }

                .select-enhanced {
                    background: white;
                    border: 2px solid #E5E7EB;
                    border-radius: 15px;
                    padding: 16px 20px;
                    transition: all 0.3s ease;
                    font-size: 16px;
                    font-weight: 500;
                    width: 100%;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                    appearance: none;
                    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
                    background-position: right 12px center;
                    background-repeat: no-repeat;
                    background-size: 16px;
                    padding-right: 48px;
                }

                .select-enhanced:focus {
                    outline: none;
                    border-color: var(--primary-color);
                    box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.1), 0 8px 20px rgba(0, 0, 0, 0.1);
                    transform: translateY(-2px);
                }

                .textarea-enhanced {
                    background: white;
                    border: 2px solid #E5E7EB;
                    border-radius: 15px;
                    padding: 16px 20px;
                    transition: all 0.3s ease;
                    font-size: 16px;
                    font-weight: 500;
                    width: 100%;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                    resize: vertical;
                    min-height: 120px;
                }

                .textarea-enhanced:focus {
                    outline: none;
                    border-color: var(--primary-color);
                    box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.1), 0 8px 20px rgba(0, 0, 0, 0.1);
                    transform: translateY(-2px);
                }

                .file-upload {
                    position: relative;
                    display: inline-block;
                    width: 100%;
                    overflow: hidden;
                    background: white;
                    border: 2px dashed #E5E7EB;
                    border-radius: 15px;
                    padding: 32px 20px;
                    text-align: center;
                    transition: all 0.3s ease;
                    cursor: pointer;
                }

                .file-upload:hover {
                    border-color: var(--primary-color);
                    background: var(--gradient-soft);
                    transform: translateY(-2px);
                }

                .file-upload input[type=file] {
                    position: absolute;
                    left: -9999px;
                }

                .file-upload-icon {
                    width: 48px;
                    height: 48px;
                    background: var(--gradient);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 16px;
                    color: white;
                    font-size: 20px;
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

                .btn-gradient:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                    transform: none;
                }

                .btn-cancel {
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
                }

                .btn-cancel:hover {
                    background: #F3F4F6;
                    border-color: var(--primary-color);
                    color: var(--text-dark);
                    transform: translateY(-2px);
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

                .form-section {
                    background: white;
                    border-radius: 20px;
                    padding: 32px;
                    margin-bottom: 24px;
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
                    border: 2px solid transparent;
                    transition: all 0.3s ease;
                }

                .form-section:hover {
                    border-color: rgba(212, 165, 116, 0.3);
                    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
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

                .form-row {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 24px;
                    margin-bottom: 24px;
                }

                .progress-indicator {
                    background: var(--gradient-soft);
                    border-radius: 15px;
                    padding: 20px;
                    margin-bottom: 24px;
                    border: 2px solid rgba(212, 165, 116, 0.2);
                }

                .error-message {
                    background: #FEE2E2;
                    border: 1px solid #FECACA;
                    color: #DC2626;
                    padding: 12px 16px;
                    border-radius: 10px;
                    margin-top: 8px;
                    font-size: 14px;
                    font-weight: 500;
                }
            `}),e.jsx("div",{className:"floating-particles",children:Array.from({length:12},(a,n)=>e.jsx("div",{className:"particle",style:{left:Math.random()*100+"%",width:Math.random()*8+4+"px",height:Math.random()*8+4+"px",animationDelay:Math.random()*15+"s",animationDuration:Math.random()*10+10+"s"}},n))}),e.jsx(g,{header:e.jsx("div",{className:"header-gradient",children:e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("div",{className:"w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl backdrop-blur-sm",children:e.jsx("i",{className:"fas fa-plus"})}),e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-bold leading-tight",children:"✨ Registrar Nova Venda"}),e.jsx("p",{className:"text-white/80 text-sm",children:"Cadastre sua venda e acompanhe seu progresso"})]})]})}),children:e.jsx("div",{className:"create-bg relative z-10",children:e.jsx("div",{className:"py-12",children:e.jsxs("div",{className:"mx-auto max-w-4xl sm:px-6 lg:px-8",children:[e.jsxs("div",{className:"progress-indicator",children:[e.jsxs("div",{className:"flex items-center gap-3 mb-2",children:[e.jsx("div",{className:"w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm",children:"💪"}),e.jsx("h3",{className:"font-bold text-gray-800",children:"Vamos registrar mais uma venda!"})]}),e.jsx("p",{className:"text-gray-600 text-sm ml-11",children:"Preencha os dados com carinho - cada venda é um passo rumo ao seu sucesso! 🎯"})]}),e.jsx("div",{className:"card-gradient overflow-hidden",children:e.jsxs("form",{onSubmit:d,className:"p-8",children:[e.jsxs("div",{className:"form-section",children:[e.jsxs("div",{className:"section-title",children:[e.jsx("div",{className:"section-icon",children:e.jsx("i",{className:"fas fa-user-heart"})}),e.jsx("h3",{className:"text-xl font-bold text-gray-800",children:"👥 Informações da Cliente"})]}),e.jsxs("div",{className:"form-row",children:[e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{className:"label-enhanced",children:[e.jsx("div",{className:"label-icon",children:e.jsx("i",{className:"fas fa-user"})}),"Nome da Cliente"]}),e.jsx("input",{type:"text",className:"input-enhanced",value:s.client_name,onChange:a=>t("client_name",a.target.value),placeholder:"Ex: Maria Silva",required:!0}),r.client_name&&e.jsx("div",{className:"error-message",children:r.client_name})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{className:"label-enhanced",children:[e.jsx("div",{className:"label-icon",children:"💳"}),"Forma de Pagamento"]}),e.jsx("select",{className:"select-enhanced",value:s.payment_method,onChange:a=>t("payment_method",a.target.value),required:!0,children:Object.entries(p).map(([a,n])=>e.jsxs("option",{value:a,children:[c[a]," ",n]},a))}),r.payment_method&&e.jsx("div",{className:"error-message",children:r.payment_method})]})]})]}),e.jsxs("div",{className:"form-section",children:[e.jsxs("div",{className:"section-title",children:[e.jsx("div",{className:"section-icon",children:e.jsx("i",{className:"fas fa-dollar-sign"})}),e.jsx("h3",{className:"text-xl font-bold text-gray-800",children:"💰 Valores da Venda"})]}),e.jsxs("div",{className:"form-row",children:[e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{className:"label-enhanced",children:[e.jsx("div",{className:"label-icon",children:"💵"}),"Valor Total do Pedido"]}),e.jsx("input",{type:"number",step:"0.01",min:"0",className:"input-enhanced",value:s.total_amount,onChange:a=>t("total_amount",a.target.value),placeholder:"0,00",required:!0}),r.total_amount&&e.jsx("div",{className:"error-message",children:r.total_amount})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{className:"label-enhanced",children:[e.jsx("div",{className:"label-icon",children:"🚚"}),"Valor do Frete"]}),e.jsx("input",{type:"number",step:"0.01",min:"0",className:"input-enhanced",value:s.shipping_amount,onChange:a=>t("shipping_amount",a.target.value),placeholder:"0,00",required:!0}),r.shipping_amount&&e.jsx("div",{className:"error-message",children:r.shipping_amount})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{className:"label-enhanced",children:[e.jsx("div",{className:"label-icon",children:"✅"}),"Valor Recebido"]}),e.jsx("input",{type:"number",step:"0.01",min:"0",className:"input-enhanced",value:s.received_amount,onChange:a=>t("received_amount",a.target.value),placeholder:"0,00",required:!0}),r.received_amount&&e.jsx("div",{className:"error-message",children:r.received_amount})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{className:"label-enhanced",children:[e.jsx("div",{className:"label-icon",children:"📅"}),"Data do Pagamento"]}),e.jsx("input",{type:"date",className:"input-enhanced",value:s.payment_date,onChange:a=>t("payment_date",a.target.value),required:!0}),r.payment_date&&e.jsx("div",{className:"error-message",children:r.payment_date})]})]})]}),e.jsxs("div",{className:"form-section",children:[e.jsxs("div",{className:"section-title",children:[e.jsx("div",{className:"section-icon",children:e.jsx("i",{className:"fas fa-file-upload"})}),e.jsx("h3",{className:"text-xl font-bold text-gray-800",children:"📎 Comprovante de Pagamento"})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"payment_receipt",className:"file-upload",children:[e.jsx("div",{className:"file-upload-icon",children:e.jsx("i",{className:"fas fa-cloud-upload-alt"})}),e.jsx("h4",{className:"font-semibold text-gray-800 mb-2",children:"Clique para enviar o comprovante"}),e.jsx("p",{className:"text-sm text-gray-500 mb-2",children:s.payment_receipt?`📄 ${s.payment_receipt.name}`:"Formatos aceitos: JPG, PNG, PDF (máx. 2MB)"}),e.jsxs("div",{className:"flex justify-center gap-2 text-xs text-gray-400",children:[e.jsx("span",{children:"📸 JPG"}),e.jsx("span",{children:"🖼️ PNG"}),e.jsx("span",{children:"📋 PDF"})]}),e.jsx("input",{id:"payment_receipt",type:"file",accept:"image/*,application/pdf",onChange:a=>t("payment_receipt",a.target.files[0])})]}),r.payment_receipt&&e.jsx("div",{className:"error-message",children:r.payment_receipt})]})]}),e.jsxs("div",{className:"form-section",children:[e.jsxs("div",{className:"section-title",children:[e.jsx("div",{className:"section-icon",children:e.jsx("i",{className:"fas fa-sticky-note"})}),e.jsx("h3",{className:"text-xl font-bold text-gray-800",children:"📝 Observações Adicionais"})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{className:"label-enhanced",children:[e.jsx("div",{className:"label-icon",children:"💭"}),"Observações (opcional)"]}),e.jsx("textarea",{className:"textarea-enhanced",value:s.notes,onChange:a=>t("notes",a.target.value),placeholder:"Informações adicionais sobre a venda, detalhes especiais, comentários da cliente..."}),r.notes&&e.jsx("div",{className:"error-message",children:r.notes})]})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row items-center justify-end gap-4 mt-8 pt-6 border-t-2 border-gray-100",children:[e.jsxs("a",{href:route("sales.index"),className:"btn-cancel",children:[e.jsx("i",{className:"fas fa-times"}),"Cancelar"]}),e.jsx("button",{type:"submit",className:"btn-gradient",disabled:i,children:i?e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"fas fa-spinner fa-spin mr-2"}),"Salvando..."]}):e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"fas fa-save mr-2"}),"Registrar Venda"]})})]})]})}),e.jsx("div",{className:"mt-8 bg-gradient-to-r from-pink-50 to-yellow-50 border border-pink-200 rounded-xl p-6",children:e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("div",{className:"w-12 h-12 bg-gradient-to-br from-pink-400 to-yellow-400 rounded-full flex items-center justify-center text-white text-xl",children:"🌟"}),e.jsxs("div",{children:[e.jsx("h3",{className:"font-bold text-gray-800 mb-1",children:"Você está arrasando! 💪"}),e.jsx("p",{className:"text-gray-600 text-sm",children:"Cada venda registrada é um passo a mais na sua jornada de sucesso. Continue assim! 🚀"})]})]})})]})})})}),e.jsx("link",{rel:"stylesheet",href:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"})]})}export{N as default};
