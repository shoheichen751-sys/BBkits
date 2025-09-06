import{x as g,j as e,Q as u,V as l}from"./app-VoDeNzPT.js";import{A as f}from"./AuthenticatedLayout-BYTpjYcl.js";import"./TextInput-CF5x6HS8.js";/* empty css            */import"./transition-_AUKL_ZA.js";function k({sale:t}){const c=r=>r?new Date(r).toISOString().split("T")[0]:"",{data:o,setData:n,put:p,processing:d}=g({client_name:t.client_name||"",total_amount:t.total_amount?parseFloat(t.total_amount).toString():"",shipping_amount:t.shipping_amount?parseFloat(t.shipping_amount).toString():"",payment_method:t.payment_method||"pix",received_amount:t.received_amount?parseFloat(t.received_amount).toString():"",payment_date:c(t.payment_date),payment_receipt:null,notes:t.notes||""}),x=r=>{r.preventDefault(),p(route("sales.update",t.id),{onSuccess:()=>{l.success("Venda atualizada com sucesso! 🎉")},onError:s=>{Object.keys(s).forEach(b=>{l.error(s[b])})}})},m={pix:"🔗",boleto:"📄",cartao:"💳",dinheiro:"💰"},h={pix:"PIX",boleto:"Boleto Bancário",cartao:"Cartão de Crédito/Débito",dinheiro:"Dinheiro"},i=(r=>{const s={pendente:{icon:"⏳",label:"Pendente",color:"from-yellow-400 to-orange-400",bgColor:"from-yellow-50 to-orange-50",borderColor:"border-yellow-300"},aprovado:{icon:"✅",label:"Aprovada",color:"from-green-400 to-emerald-400",bgColor:"from-green-50 to-emerald-50",borderColor:"border-green-300"},recusado:{icon:"❌",label:"Recusada",color:"from-red-400 to-pink-400",bgColor:"from-red-50 to-pink-50",borderColor:"border-red-300"}};return s[r]||s.pendente})(t.status),a=t.status==="pendente";return e.jsxs(e.Fragment,{children:[e.jsx(u,{title:`Editar Venda #${t.id} - BBKits`}),e.jsx("style",{children:`
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

                .edit-bg {
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

                .input-enhanced:disabled {
                    background: #F9FAFB;
                    border-color: #E5E7EB;
                    color: #9CA3AF;
                    cursor: not-allowed;
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

                .label-icon.disabled {
                    background: #D1D5DB;
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

                .select-enhanced:disabled {
                    background: #F9FAFB;
                    border-color: #E5E7EB;
                    color: #9CA3AF;
                    cursor: not-allowed;
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

                .textarea-enhanced:disabled {
                    background: #F9FAFB;
                    border-color: #E5E7EB;
                    color: #9CA3AF;
                    cursor: not-allowed;
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

                .file-upload:hover:not(.disabled) {
                    border-color: var(--primary-color);
                    background: var(--gradient-soft);
                    transform: translateY(-2px);
                }

                .file-upload.disabled {
                    background: #F9FAFB;
                    border-color: #D1D5DB;
                    cursor: not-allowed;
                    opacity: 0.6;
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

                .file-upload-icon.disabled {
                    background: #D1D5DB;
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

                .form-section.disabled {
                    opacity: 0.7;
                    background: #FAFAFA;
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

                .section-icon.disabled {
                    background: #D1D5DB;
                }

                .form-row {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 24px;
                    margin-bottom: 24px;
                }

                .status-alert {
                    border-radius: 20px;
                    padding: 24px;
                    margin-bottom: 24px;
                    border: 2px solid;
                    backdrop-filter: blur(10px);
                }

                .current-file {
                    background: linear-gradient(135deg, #EBF8FF 0%, #DBEAFE 100%);
                    border: 2px solid #60A5FA;
                    border-radius: 15px;
                    padding: 16px;
                    margin-bottom: 16px;
                    display: flex;
                    items-center;
                    gap: 12px;
                }

                .file-icon {
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 16px;
                }
            `}),e.jsx("div",{className:"floating-particles",children:Array.from({length:12},(r,s)=>e.jsx("div",{className:"particle",style:{left:Math.random()*100+"%",width:Math.random()*8+4+"px",height:Math.random()*8+4+"px",animationDelay:Math.random()*15+"s",animationDuration:Math.random()*10+10+"s"}},s))}),e.jsx(f,{header:e.jsx("div",{className:"header-gradient",children:e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("div",{className:"w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl backdrop-blur-sm",children:e.jsx("i",{className:"fas fa-edit"})}),e.jsxs("div",{children:[e.jsxs("h2",{className:"text-2xl font-bold leading-tight",children:["✏️ Editar Venda #",t.id]}),e.jsx("p",{className:"text-white/80 text-sm",children:"Atualize as informações da sua venda"})]}),e.jsxs("div",{className:`ml-auto bg-gradient-to-r ${i.color} text-white px-4 py-2 rounded-full font-semibold flex items-center gap-2`,children:[e.jsx("span",{children:i.icon}),i.label]})]})}),children:e.jsx("div",{className:"edit-bg relative z-10",children:e.jsx("div",{className:"py-12",children:e.jsxs("div",{className:"mx-auto max-w-4xl sm:px-6 lg:px-8",children:[!a&&e.jsx("div",{className:`status-alert bg-gradient-to-r ${i.bgColor} ${i.borderColor}`,children:e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("div",{className:`w-12 h-12 bg-gradient-to-br ${i.color} rounded-full flex items-center justify-center text-white text-xl`,children:i.icon}),e.jsxs("div",{children:[e.jsx("h3",{className:"font-bold text-gray-800 mb-1",children:"⚠️ Venda já processada"}),e.jsxs("p",{className:"text-gray-600",children:['Esta venda está com status "',i.label,'" e não pode mais ser editada. Apenas vendas pendentes podem ser modificadas.']})]})]})}),a&&e.jsx("div",{className:"bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-6",children:e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("div",{className:"w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center text-white text-xl",children:"✨"}),e.jsxs("div",{children:[e.jsx("h3",{className:"font-bold text-gray-800 mb-1",children:"Venda editável! 🎯"}),e.jsx("p",{className:"text-gray-600 text-sm",children:"Você pode modificar todos os campos desta venda enquanto ela estiver pendente."})]})]})}),e.jsx("div",{className:"card-gradient overflow-hidden",children:e.jsxs("form",{onSubmit:x,className:"p-8",children:[e.jsxs("div",{className:`form-section ${a?"":"disabled"}`,children:[e.jsxs("div",{className:"section-title",children:[e.jsx("div",{className:`section-icon ${a?"":"disabled"}`,children:e.jsx("i",{className:"fas fa-user-heart"})}),e.jsx("h3",{className:"text-xl font-bold text-gray-800",children:"👥 Informações da Cliente"})]}),e.jsxs("div",{className:"form-row",children:[e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{className:"label-enhanced",children:[e.jsx("div",{className:`label-icon ${a?"":"disabled"}`,children:e.jsx("i",{className:"fas fa-user"})}),"Nome da Cliente"]}),e.jsx("input",{type:"text",className:"input-enhanced",value:o.client_name,onChange:r=>n("client_name",r.target.value),placeholder:"Ex: Maria Silva",required:!0,disabled:!a})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{className:"label-enhanced",children:[e.jsx("div",{className:`label-icon ${a?"":"disabled"}`,children:"💳"}),"Forma de Pagamento"]}),e.jsx("select",{className:"select-enhanced",value:o.payment_method,onChange:r=>n("payment_method",r.target.value),required:!0,disabled:!a,children:Object.entries(h).map(([r,s])=>e.jsxs("option",{value:r,children:[m[r]," ",s]},r))})]})]})]}),e.jsxs("div",{className:`form-section ${a?"":"disabled"}`,children:[e.jsxs("div",{className:"section-title",children:[e.jsx("div",{className:`section-icon ${a?"":"disabled"}`,children:e.jsx("i",{className:"fas fa-dollar-sign"})}),e.jsx("h3",{className:"text-xl font-bold text-gray-800",children:"💰 Valores da Venda"})]}),e.jsxs("div",{className:"form-row",children:[e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{className:"label-enhanced",children:[e.jsx("div",{className:`label-icon ${a?"":"disabled"}`,children:"💵"}),"Valor Total do Pedido"]}),e.jsx("input",{type:"number",step:"0.01",min:"0",className:"input-enhanced",value:o.total_amount,onChange:r=>n("total_amount",r.target.value),placeholder:"0,00",required:!0,disabled:!a})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{className:"label-enhanced",children:[e.jsx("div",{className:`label-icon ${a?"":"disabled"}`,children:"🚚"}),"Valor do Frete"]}),e.jsx("input",{type:"number",step:"0.01",min:"0",className:"input-enhanced",value:o.shipping_amount,onChange:r=>n("shipping_amount",r.target.value),placeholder:"0,00",required:!0,disabled:!a})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{className:"label-enhanced",children:[e.jsx("div",{className:`label-icon ${a?"":"disabled"}`,children:"✅"}),"Valor Recebido"]}),e.jsx("input",{type:"number",step:"0.01",min:"0",className:"input-enhanced",value:o.received_amount,onChange:r=>n("received_amount",r.target.value),placeholder:"0,00",required:!0,disabled:!a})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{className:"label-enhanced",children:[e.jsx("div",{className:`label-icon ${a?"":"disabled"}`,children:"📅"}),"Data do Pagamento"]}),e.jsx("input",{type:"date",className:"input-enhanced",value:o.payment_date,onChange:r=>n("payment_date",r.target.value),required:!0,disabled:!a})]})]})]}),e.jsxs("div",{className:`form-section ${a?"":"disabled"}`,children:[e.jsxs("div",{className:"section-title",children:[e.jsx("div",{className:`section-icon ${a?"":"disabled"}`,children:e.jsx("i",{className:"fas fa-file-upload"})}),e.jsx("h3",{className:"text-xl font-bold text-gray-800",children:"📎 Comprovante de Pagamento"})]}),t.payment_receipt&&e.jsxs("div",{className:"current-file",children:[e.jsx("div",{className:"file-icon",children:e.jsx("i",{className:"fas fa-file-pdf"})}),e.jsxs("div",{className:"flex-1",children:[e.jsx("h4",{className:"font-semibold text-gray-800 mb-1",children:"📄 Comprovante atual"}),e.jsx("a",{href:`/storage/${t.payment_receipt}`,target:"_blank",rel:"noopener noreferrer",className:"text-blue-600 hover:text-blue-800 underline font-medium",children:"🔗 Ver arquivo atual"})]})]}),e.jsx("div",{className:"form-group",children:e.jsxs("label",{htmlFor:"payment_receipt",className:`file-upload ${a?"":"disabled"}`,children:[e.jsx("div",{className:`file-upload-icon ${a?"":"disabled"}`,children:e.jsx("i",{className:"fas fa-cloud-upload-alt"})}),e.jsx("h4",{className:"font-semibold text-gray-800 mb-2",children:a?o.payment_receipt?`📄 ${o.payment_receipt.name}`:"Clique para alterar o comprovante":"Não é possível alterar o comprovante"}),e.jsx("p",{className:"text-sm text-gray-500 mb-2",children:a?"Deixe em branco para manter o atual. JPG, PNG, PDF (máx. 2MB)":"Comprovante não pode ser alterado após processamento"}),a&&e.jsxs("div",{className:"flex justify-center gap-2 text-xs text-gray-400",children:[e.jsx("span",{children:"📸 JPG"}),e.jsx("span",{children:"🖼️ PNG"}),e.jsx("span",{children:"📋 PDF"})]}),e.jsx("input",{id:"payment_receipt",type:"file",accept:"image/*,application/pdf",onChange:r=>n("payment_receipt",r.target.files[0]),disabled:!a})]})})]}),e.jsxs("div",{className:`form-section ${a?"":"disabled"}`,children:[e.jsxs("div",{className:"section-title",children:[e.jsx("div",{className:`section-icon ${a?"":"disabled"}`,children:e.jsx("i",{className:"fas fa-sticky-note"})}),e.jsx("h3",{className:"text-xl font-bold text-gray-800",children:"📝 Observações Adicionais"})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{className:"label-enhanced",children:[e.jsx("div",{className:`label-icon ${a?"":"disabled"}`,children:"💭"}),"Observações (opcional)"]}),e.jsx("textarea",{className:"textarea-enhanced",value:o.notes,onChange:r=>n("notes",r.target.value),placeholder:"Informações adicionais sobre a venda, detalhes especiais, comentários da cliente...",disabled:!a})]})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row items-center justify-end gap-4 mt-8 pt-6 border-t-2 border-gray-100",children:[e.jsxs("a",{href:route("sales.index"),className:"btn-cancel",children:[e.jsx("i",{className:"fas fa-arrow-left"}),"Voltar às Vendas"]}),a&&e.jsx("button",{type:"submit",className:"btn-gradient",disabled:d,children:d?e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"fas fa-spinner fa-spin mr-2"}),"Salvando..."]}):e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"fas fa-save mr-2"}),"Atualizar Venda"]})})]})]})}),e.jsx("div",{className:"mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6",children:e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("div",{className:"w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full flex items-center justify-center text-white text-xl",children:a?"✏️":"🔒"}),e.jsxs("div",{children:[e.jsx("h3",{className:"font-bold text-gray-800 mb-1",children:a?"Mantenha seus dados atualizados! 📊":"Venda protegida! 🛡️"}),e.jsx("p",{className:"text-gray-600 text-sm",children:a?"Dados precisos garantem cálculos corretos de comissão e melhor controle das suas vendas.":"Esta venda já foi processada e está protegida contra alterações acidentais."})]})]})})]})})})}),e.jsx("link",{rel:"stylesheet",href:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"})]})}export{k as default};
