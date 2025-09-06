import{j as e,r as l,x as b}from"./app-VoDeNzPT.js";import{I as w}from"./InputLabel-D3flJZAc.js";import{M as v}from"./Modal-CLXZl5GB.js";import{T as y}from"./TextInput-CF5x6HS8.js";/* empty css            */import"./dialog-iI0iDF3O.js";import"./transition-_AUKL_ZA.js";function j({message:a,className:s="",...r}){return a?e.jsx("p",{...r,className:"text-sm text-red-600 "+s,children:a}):null}function U({className:a=""}){const[s,r]=l.useState(!1),n=l.useRef(),{data:c,setData:m,delete:x,processing:i,reset:d,errors:p,clearErrors:u}=b({password:""}),h=()=>{r(!0)},f=t=>{t.preventDefault(),x(route("profile.destroy"),{preserveScroll:!0,onSuccess:()=>o(),onError:()=>n.current.focus(),onFinish:()=>d()})},o=()=>{r(!1),u(),d()};return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
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
                    --gradient-danger: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
                    --shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
                    --shadow-hover: 0 25px 50px rgba(0, 0, 0, 0.2);
                    --shadow-glow: 0 0 30px rgba(212, 165, 116, 0.3);
                    --shadow-danger: 0 0 30px rgba(239, 68, 68, 0.3);
                }

                * {
                    font-family: 'Poppins', sans-serif;
                }

                .delete-form-container {
                    background: var(--gradient-soft);
                    border-radius: 25px;
                    box-shadow: var(--shadow);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 2px solid transparent;
                    animation: fadeInUp 0.6s ease-out;
                }

                .delete-form-container:hover {
                    transform: translateY(-5px);
                    box-shadow: var(--shadow-hover);
                    border-color: var(--primary-color);
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .header-title {
                    background: var(--gradient);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: titleGlow 3s ease-in-out infinite alternate;
                }

                @keyframes titleGlow {
                    0% { filter: drop-shadow(0 0 5px rgba(212, 165, 116, 0.3)); }
                    100% { filter: drop-shadow(0 0 15px rgba(212, 165, 116, 0.6)); }
                }

                .btn-danger-gradient {
                    background: var(--gradient-danger);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                    border: none;
                    border-radius: 15px;
                    box-shadow: var(--shadow);
                }

                .btn-danger-gradient::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    transition: left 0.6s;
                }

                .btn-danger-gradient:hover::before {
                    left: 100%;
                }

                .btn-danger-gradient:hover {
                    transform: translateY(-3px);
                    box-shadow: var(--shadow-danger);
                }

                .btn-secondary-gradient {
                    background: var(--gradient-soft);
                    border: 2px solid var(--primary-color);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    border-radius: 15px;
                    box-shadow: var(--shadow);
                }

                .btn-secondary-gradient:hover {
                    transform: translateY(-3px);
                    box-shadow: var(--shadow-hover);
                    background: var(--gradient);
                    color: white;
                }

                .input-gradient {
                    background: rgba(255, 255, 255, 0.9);
                    border: 2px solid var(--primary-color);
                    border-radius: 15px;
                    transition: all 0.3s ease;
                    box-shadow: var(--shadow);
                }

                .input-gradient:focus {
                    box-shadow: var(--shadow-glow);
                    border-color: var(--accent-color);
                    transform: scale(1.02);
                }

                .modal-backdrop {
                    backdrop-filter: blur(10px);
                    background: rgba(0, 0, 0, 0.5);
                }

                .modal-content {
                    background: var(--gradient-soft);
                    border-radius: 25px;
                    box-shadow: var(--shadow-hover);
                    border: 2px solid var(--primary-color);
                    animation: modalSlideIn 0.4s ease-out;
                }

                @keyframes modalSlideIn {
                    from {
                        opacity: 0;
                        transform: scale(0.9) translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }

                .warning-icon {
                    color: #EF4444;
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }

                .floating-particles {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    pointer-events: none;
                    z-index: -1;
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
            `}),e.jsxs("section",{className:`space-y-6 ${a} relative`,children:[e.jsx("div",{className:"floating-particles",children:Array.from({length:10},(t,g)=>e.jsx("div",{className:"particle",style:{left:Math.random()*100+"%",width:Math.random()*8+3+"px",height:Math.random()*8+3+"px",animationDelay:Math.random()*15+"s",animationDuration:Math.random()*10+10+"s"}},g))}),e.jsxs("div",{className:"delete-form-container p-8 relative z-10",children:[e.jsxs("header",{className:"text-center mb-8",children:[e.jsx("div",{className:"w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-lg",children:e.jsx("i",{className:"fas fa-exclamation-triangle text-white text-2xl warning-icon"})}),e.jsx("h2",{className:"text-3xl font-bold header-title mb-3",children:"Excluir Conta"}),e.jsx("p",{className:"text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto",children:"Uma vez que sua conta for excluída, todos os seus recursos e dados serão permanentemente deletados. Antes de excluir sua conta, faça o download de quaisquer dados ou informações que você deseja manter."})]}),e.jsx("div",{className:"text-center",children:e.jsxs("button",{onClick:h,className:"btn-danger-gradient text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition duration-300 uppercase tracking-wide",children:[e.jsx("i",{className:"fas fa-trash mr-3"}),"Excluir Conta"]})})]}),e.jsx(v,{show:s,onClose:o,className:"modal-backdrop",children:e.jsx("div",{className:"modal-content p-8 m-4 max-w-md mx-auto",children:e.jsxs("form",{onSubmit:f,children:[e.jsxs("div",{className:"text-center mb-6",children:[e.jsx("div",{className:"w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-lg",children:e.jsx("i",{className:"fas fa-exclamation-triangle text-white text-3xl warning-icon"})}),e.jsx("h2",{className:"text-2xl font-bold text-gray-900 mb-4",children:"Tem certeza que deseja excluir sua conta?"}),e.jsx("p",{className:"text-gray-600 leading-relaxed",children:"Uma vez que sua conta for excluída, todos os seus recursos e dados serão permanentemente deletados. Digite sua senha para confirmar que você gostaria de excluir permanentemente sua conta."})]}),e.jsxs("div",{className:"mb-6",children:[e.jsx(w,{htmlFor:"password",value:"Senha",className:"sr-only"}),e.jsx(y,{id:"password",type:"password",name:"password",ref:n,value:c.password,onChange:t=>m("password",t.target.value),className:"input-gradient w-full px-4 py-3 text-lg",isFocused:!0,placeholder:"Digite sua senha"}),e.jsx(j,{message:p.password,className:"mt-2 text-red-500 font-medium"})]}),e.jsxs("div",{className:"flex gap-4 justify-center",children:[e.jsxs("button",{type:"button",onClick:o,className:"btn-secondary-gradient text-gray-700 px-6 py-3 rounded-2xl font-semibold transition duration-300 hover:scale-105",children:[e.jsx("i",{className:"fas fa-times mr-2"}),"Cancelar"]}),e.jsx("button",{type:"submit",disabled:i,className:"btn-danger-gradient text-white px-6 py-3 rounded-2xl font-semibold transition duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed",children:i?e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"fas fa-spinner fa-spin mr-2"}),"Excluindo..."]}):e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"fas fa-trash mr-2"}),"Excluir Conta"]})})]})]})})}),e.jsx("link",{rel:"stylesheet",href:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"})]})]})}export{U as default};
