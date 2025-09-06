import{r as d,x,j as a}from"./app-VoDeNzPT.js";import"./TextInput-CF5x6HS8.js";import{z as g}from"./transition-_AUKL_ZA.js";/* empty css            */function y({className:p=""}){const i=d.useRef(),l=d.useRef(),{data:t,setData:o,errors:s,put:m,reset:n,processing:c,recentlySuccessful:f}=x({current_password:"",password:"",password_confirmation:""}),u=e=>{e.preventDefault(),m(route("password.update"),{preserveScroll:!0,onSuccess:()=>n(),onError:r=>{r.password&&(n("password","password_confirmation"),i.current.focus()),r.current_password&&(n("current_password"),l.current.focus())}})};return a.jsxs(a.Fragment,{children:[a.jsx("style",{children:`
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
                    --gradient-success: linear-gradient(135deg, #10B981 0%, #059669 100%);
                    --shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
                    --shadow-hover: 0 25px 50px rgba(0, 0, 0, 0.2);
                    --shadow-glow: 0 0 30px rgba(212, 165, 116, 0.3);
                    --shadow-success: 0 0 30px rgba(16, 185, 129, 0.3);
                }

                * {
                    font-family: 'Poppins', sans-serif;
                }

                .password-form-container {
                    background: var(--gradient-soft);
                    border-radius: 25px;
                    box-shadow: var(--shadow);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 2px solid transparent;
                    animation: fadeInUp 0.6s ease-out;
                    position: relative;
                    overflow: hidden;
                }

                .password-form-container::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="1" fill="rgba(212,165,116,0.1)"/><circle cx="80" cy="40" r="0.5" fill="rgba(212,165,116,0.1)"/><circle cx="40" cy="80" r="1.5" fill="rgba(212,165,116,0.1)"/></svg>');
                    animation: sparkle 20s linear infinite;
                    pointer-events: none;
                }

                @keyframes sparkle {
                    0% { transform: translateY(0) rotate(0deg); }
                    100% { transform: translateY(-100px) rotate(360deg); }
                }

                .password-form-container:hover {
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

                .input-group {
                    position: relative;
                    animation: slideInLeft 0.6s ease-out;
                    animation-fill-mode: backwards;
                }

                .input-group:nth-child(1) { animation-delay: 0.1s; }
                .input-group:nth-child(2) { animation-delay: 0.2s; }
                .input-group:nth-child(3) { animation-delay: 0.3s; }

                @keyframes slideInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                .input-gradient {
                    background: rgba(255, 255, 255, 0.9);
                    border: 2px solid var(--primary-color);
                    border-radius: 15px;
                    transition: all 0.3s ease;
                    box-shadow: var(--shadow);
                    padding: 12px 16px;
                    font-size: 16px;
                    position: relative;
                }

                .input-gradient:focus {
                    box-shadow: var(--shadow-glow);
                    border-color: var(--accent-color);
                    transform: scale(1.02);
                    background: white;
                }

                .input-gradient:hover {
                    border-color: var(--accent-color);
                    box-shadow: var(--shadow-hover);
                }

                .label-gradient {
                    color: var(--text-dark);
                    font-weight: 600;
                    font-size: 16px;
                    margin-bottom: 8px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .btn-primary-gradient {
                    background: var(--gradient);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                    border: none;
                    border-radius: 15px;
                    box-shadow: var(--shadow);
                    padding: 12px 32px;
                    font-size: 18px;
                    font-weight: 600;
                    color: white;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .btn-primary-gradient::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    transition: left 0.6s;
                }

                .btn-primary-gradient:hover::before {
                    left: 100%;
                }

                .btn-primary-gradient:hover {
                    transform: translateY(-3px);
                    box-shadow: var(--shadow-hover);
                }

                .btn-primary-gradient:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }

                .success-message {
                    background: var(--gradient-success);
                    color: white;
                    padding: 12px 24px;
                    border-radius: 15px;
                    font-weight: 600;
                    box-shadow: var(--shadow-success);
                    animation: successPulse 0.6s ease-out;
                }

                @keyframes successPulse {
                    0% {
                        transform: scale(0.8);
                        opacity: 0;
                    }
                    50% {
                        transform: scale(1.1);
                    }
                    100% {
                        transform: scale(1);
                        opacity: 1;
                    }
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

                .security-icon {
                    background: var(--gradient);
                    animation: iconPulse 2s ease-in-out infinite;
                }

                @keyframes iconPulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }

                .form-actions {
                    animation: slideInUp 0.6s 0.4s ease-out;
                    animation-fill-mode: backwards;
                }

                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}),a.jsxs("section",{className:`${p} relative`,children:[a.jsx("div",{className:"floating-particles",children:Array.from({length:8},(e,r)=>a.jsx("div",{className:"particle",style:{left:Math.random()*100+"%",width:Math.random()*6+3+"px",height:Math.random()*6+3+"px",animationDelay:Math.random()*15+"s",animationDuration:Math.random()*10+10+"s"}},r))}),a.jsxs("div",{className:"password-form-container p-8 relative z-10",children:[a.jsxs("header",{className:"text-center mb-8",children:[a.jsx("div",{className:"w-16 h-16 security-icon mx-auto mb-4 rounded-full flex items-center justify-center shadow-lg",children:a.jsx("i",{className:"fas fa-shield-alt text-white text-2xl"})}),a.jsx("h2",{className:"text-3xl font-bold header-title mb-3",children:"Atualizar Senha"}),a.jsx("p",{className:"text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto",children:"Certifique-se de que sua conta está usando uma senha longa e aleatória para permanecer segura."})]}),a.jsxs("form",{onSubmit:u,className:"space-y-6",children:[a.jsxs("div",{className:"input-group",children:[a.jsxs("label",{className:"label-gradient",children:[a.jsx("i",{className:"fas fa-lock text-lg"}),"Senha Atual"]}),a.jsx("input",{id:"current_password",ref:l,value:t.current_password,onChange:e=>o("current_password",e.target.value),type:"password",className:"input-gradient w-full",autoComplete:"current-password",placeholder:"Digite sua senha atual"}),s.current_password&&a.jsxs("p",{className:"mt-2 text-red-500 font-medium flex items-center gap-2",children:[a.jsx("i",{className:"fas fa-exclamation-circle"}),s.current_password]})]}),a.jsxs("div",{className:"input-group",children:[a.jsxs("label",{className:"label-gradient",children:[a.jsx("i",{className:"fas fa-key text-lg"}),"Nova Senha"]}),a.jsx("input",{id:"password",ref:i,value:t.password,onChange:e=>o("password",e.target.value),type:"password",className:"input-gradient w-full",autoComplete:"new-password",placeholder:"Digite sua nova senha"}),s.password&&a.jsxs("p",{className:"mt-2 text-red-500 font-medium flex items-center gap-2",children:[a.jsx("i",{className:"fas fa-exclamation-circle"}),s.password]})]}),a.jsxs("div",{className:"input-group",children:[a.jsxs("label",{className:"label-gradient",children:[a.jsx("i",{className:"fas fa-check-double text-lg"}),"Confirmar Senha"]}),a.jsx("input",{id:"password_confirmation",value:t.password_confirmation,onChange:e=>o("password_confirmation",e.target.value),type:"password",className:"input-gradient w-full",autoComplete:"new-password",placeholder:"Confirme sua nova senha"}),s.password_confirmation&&a.jsxs("p",{className:"mt-2 text-red-500 font-medium flex items-center gap-2",children:[a.jsx("i",{className:"fas fa-exclamation-circle"}),s.password_confirmation]})]}),a.jsxs("div",{className:"form-actions flex items-center gap-6 justify-center",children:[a.jsx("button",{type:"submit",disabled:c,className:"btn-primary-gradient",children:c?a.jsxs(a.Fragment,{children:[a.jsx("i",{className:"fas fa-spinner fa-spin mr-2"}),"Salvando..."]}):a.jsxs(a.Fragment,{children:[a.jsx("i",{className:"fas fa-save mr-2"}),"Salvar Senha"]})}),a.jsx(g,{show:f,enter:"transition ease-in-out",enterFrom:"opacity-0",leave:"transition ease-in-out",leaveTo:"opacity-0",children:a.jsxs("div",{className:"success-message flex items-center gap-2",children:[a.jsx("i",{className:"fas fa-check-circle"}),"Senha atualizada com sucesso!"]})})]})]})]}),a.jsx("link",{rel:"stylesheet",href:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"})]})]})}export{y as default};
