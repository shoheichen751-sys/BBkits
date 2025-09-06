import{j as e,Q as r}from"./app-VoDeNzPT.js";import{A as s}from"./AuthenticatedLayout-BYTpjYcl.js";import o from"./DeleteUserForm-nrZ_CCRj.js";import n from"./UpdatePasswordForm-zcYvC1wZ.js";import l from"./UpdateProfileInformationForm-BdChKGs3.js";/* empty css            */import"./transition-_AUKL_ZA.js";import"./InputLabel-D3flJZAc.js";import"./Modal-CLXZl5GB.js";import"./dialog-iI0iDF3O.js";import"./TextInput-CF5x6HS8.js";function w({mustVerifyEmail:t,status:a}){return e.jsxs(e.Fragment,{children:[e.jsx(r,{title:"Meu Perfil - BBKits"}),e.jsx("style",{children:`
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

                .profile-bg {
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
                    margin-bottom: 32px;
                    overflow: hidden;
                }

                .card-gradient:hover {
                    transform: translateY(-8px);
                    box-shadow: var(--shadow-hover);
                    border-color: var(--primary-color);
                }

                .profile-section {
                    background: white;
                    border-radius: 20px;
                    padding: 40px;
                    margin-bottom: 24px;
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
                    border: 2px solid transparent;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }

                .profile-section::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: var(--gradient);
                }

                .profile-section:hover {
                    border-color: rgba(212, 165, 116, 0.3);
                    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
                    transform: translateY(-5px);
                }

                .section-header {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    margin-bottom: 32px;
                    padding-bottom: 20px;
                    border-bottom: 2px solid #F3F4F6;
                }

                .section-icon {
                    width: 48px;
                    height: 48px;
                    background: var(--gradient);
                    border-radius: 15px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 20px;
                    box-shadow: 0 8px 20px rgba(212, 165, 116, 0.3);
                }

                .section-title {
                    flex: 1;
                }

                .section-title h3 {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: var(--text-dark);
                    margin: 0 0 4px 0;
                }

                .section-title p {
                    color: var(--text-light);
                    margin: 0;
                    font-size: 0.9rem;
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

                .profile-intro {
                    background: linear-gradient(135deg, #EBF8FF 0%, #DBEAFE 100%);
                    border: 2px solid #93C5FD;
                    border-radius: 20px;
                    padding: 24px;
                    margin-bottom: 32px;
                    position: relative;
                    overflow: hidden;
                }

                .profile-intro::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
                    animation: pulse 4s ease-in-out infinite;
                }

                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 0.7; }
                    50% { transform: scale(1.1); opacity: 0.3; }
                }

                .animate-fade-in {
                    animation: fadeIn 0.8s ease-out;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-slide-in-left {
                    animation: slideInLeft 0.6s ease-out;
                }

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

                .animate-slide-in-right {
                    animation: slideInRight 0.6s ease-out;
                }

                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                .security-highlight {
                    background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
                    border: 2px solid #F59E0B;
                    border-radius: 15px;
                    padding: 16px;
                    margin-bottom: 20px;
                }

                .danger-highlight {
                    background: linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%);
                    border: 2px solid #EF4444;
                    border-radius: 15px;
                    padding: 16px;
                    margin-bottom: 20px;
                }

                .section-divider {
                    height: 2px;
                    background: var(--gradient);
                    border-radius: 1px;
                    margin: 32px 0;
                    opacity: 0.3;
                }

                .profile-stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 16px;
                    margin-bottom: 32px;
                }

                .stat-card {
                    background: linear-gradient(135deg, rgba(212, 165, 116, 0.1) 0%, rgba(232, 180, 203, 0.1) 100%);
                    border: 2px solid rgba(212, 165, 116, 0.2);
                    border-radius: 15px;
                    padding: 20px;
                    text-align: center;
                    transition: all 0.3s ease;
                }

                .stat-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 25px rgba(212, 165, 116, 0.2);
                }

                .stat-icon {
                    width: 40px;
                    height: 40px;
                    background: var(--gradient);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 12px;
                    color: white;
                    font-size: 18px;
                }

                .motivational-quote {
                    background: var(--gradient);
                    border-radius: 20px;
                    padding: 24px;
                    color: white;
                    text-align: center;
                    margin-bottom: 32px;
                    position: relative;
                    overflow: hidden;
                }

                .motivational-quote::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="white" opacity="0.1"/><circle cx="80" cy="40" r="1" fill="white" opacity="0.1"/><circle cx="40" cy="80" r="1.5" fill="white" opacity="0.1"/></svg>');
                    animation: sparkle 20s linear infinite;
                }

                /* Enhanced form styling for nested components */
                .profile-section .max-w-xl {
                    max-width: 100% !important;
                }

                .profile-section input,
                .profile-section select,
                .profile-section textarea {
                    border-radius: 12px !important;
                    border: 2px solid #E5E7EB !important;
                    padding: 12px 16px !important;
                    transition: all 0.3s ease !important;
                    font-weight: 500 !important;
                }

                .profile-section input:focus,
                .profile-section select:focus,
                .profile-section textarea:focus {
                    border-color: var(--primary-color) !important;
                    box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.1) !important;
                    transform: translateY(-2px) !important;
                }

                .profile-section button {
                    border-radius: 12px !important;
                    font-weight: 600 !important;
                    text-transform: uppercase !important;
                    letter-spacing: 0.5px !important;
                    transition: all 0.3s ease !important;
                }

                .profile-section button:hover {
                    transform: translateY(-2px) !important;
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15) !important;
                }
            `}),e.jsx("div",{className:"floating-particles",children:Array.from({length:15},(d,i)=>e.jsx("div",{className:"particle",style:{left:Math.random()*100+"%",width:Math.random()*8+4+"px",height:Math.random()*8+4+"px",animationDelay:Math.random()*15+"s",animationDuration:Math.random()*10+10+"s"}},i))}),e.jsx(s,{header:e.jsx("div",{className:"header-gradient",children:e.jsxs("div",{className:"flex items-center gap-4 relative z-10",children:[e.jsx("div",{className:"w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl backdrop-blur-sm",children:e.jsx("i",{className:"fas fa-user-edit"})}),e.jsxs("div",{children:[e.jsx("h2",{className:"text-3xl font-bold leading-tight",children:"👤 Meu Perfil"}),e.jsx("p",{className:"text-white/80 text-lg",children:"Gerencie suas informações pessoais e configurações de conta"})]})]})}),children:e.jsx("div",{className:"profile-bg relative z-10",children:e.jsx("div",{className:"py-12",children:e.jsxs("div",{className:"mx-auto max-w-6xl space-y-0 sm:px-6 lg:px-8",children:[e.jsx("div",{className:"profile-intro animate-fade-in",children:e.jsxs("div",{className:"flex items-center gap-4 relative z-10",children:[e.jsx("div",{className:"w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full flex items-center justify-center text-white text-2xl font-bold",children:"✨"}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xl font-bold text-gray-800 mb-2",children:"Bem-vinda à sua área pessoal! 🌟"}),e.jsx("p",{className:"text-gray-600",children:"Aqui você pode atualizar suas informações, alterar sua senha e gerenciar sua conta com segurança. Mantenha seus dados sempre atualizados para uma melhor experiência! 💪"})]})]})}),e.jsx("div",{className:"motivational-quote animate-fade-in",children:e.jsxs("div",{className:"relative z-10",children:[e.jsx("h3",{className:"text-2xl font-bold mb-3",children:'"Cada conquista começa com a decisão de tentar" ✨'}),e.jsxs("div",{className:"flex justify-center items-center gap-3 text-2xl mb-3",children:[e.jsx("span",{children:"💼"}),e.jsx("span",{children:"👑"}),e.jsx("span",{children:"🎯"}),e.jsx("span",{children:"🌟"})]}),e.jsx("p",{className:"text-white/90 text-lg",children:"Continue sendo incrível, vendedora BBKits!"})]})}),e.jsxs("div",{className:"profile-section animate-slide-in-left",children:[e.jsxs("div",{className:"section-header",children:[e.jsx("div",{className:"section-icon",children:e.jsx("i",{className:"fas fa-user-circle"})}),e.jsxs("div",{className:"section-title",children:[e.jsx("h3",{children:"👤 Informações Pessoais"}),e.jsx("p",{children:"Atualize seus dados pessoais e informações de contato"})]})]}),a&&e.jsx("div",{className:"security-highlight mb-6",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold",children:"✓"}),e.jsxs("p",{className:"font-semibold text-yellow-800",children:[a==="profile-updated"&&"✅ Perfil atualizado com sucesso!",a==="password-updated"&&"🔒 Senha atualizada com sucesso!"]})]})}),e.jsx(l,{mustVerifyEmail:t,status:a,className:"max-w-xl"})]}),e.jsx("div",{className:"section-divider"}),e.jsxs("div",{className:"profile-section animate-slide-in-right",children:[e.jsxs("div",{className:"section-header",children:[e.jsx("div",{className:"section-icon",children:e.jsx("i",{className:"fas fa-shield-alt"})}),e.jsxs("div",{className:"section-title",children:[e.jsx("h3",{children:"🔒 Segurança da Conta"}),e.jsx("p",{children:"Altere sua senha para manter sua conta sempre segura"})]})]}),e.jsx("div",{className:"security-highlight",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold",children:"🛡️"}),e.jsxs("div",{children:[e.jsx("p",{className:"font-semibold text-yellow-800 mb-1",children:"Dica de Segurança"}),e.jsx("p",{className:"text-yellow-700 text-sm",children:"Use uma senha forte com pelo menos 8 caracteres, incluindo letras, números e símbolos."})]})]})}),e.jsx(n,{className:"max-w-xl"})]}),e.jsx("div",{className:"section-divider"}),e.jsxs("div",{className:"profile-section animate-fade-in",style:{animationDelay:"0.4s"},children:[e.jsxs("div",{className:"section-header",children:[e.jsx("div",{className:"section-icon",style:{background:"linear-gradient(135deg, #EF4444 0%, #DC2626 100%)"},children:e.jsx("i",{className:"fas fa-exclamation-triangle"})}),e.jsxs("div",{className:"section-title",children:[e.jsx("h3",{children:"⚠️ Zona de Perigo"}),e.jsx("p",{children:"Exclusão permanente da conta - esta ação não pode ser desfeita"})]})]}),e.jsx("div",{className:"danger-highlight",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold",children:"⚠️"}),e.jsxs("div",{children:[e.jsx("p",{className:"font-semibold text-red-800 mb-1",children:"Atenção: Ação Irreversível"}),e.jsx("p",{className:"text-red-700 text-sm",children:"A exclusão da conta é permanente e todos os seus dados serão perdidos. Certifique-se de que realmente deseja prosseguir."})]})]})}),e.jsx(o,{className:"max-w-xl"})]}),e.jsx("div",{className:"mt-12 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 animate-fade-in",children:e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("div",{className:"w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center text-white text-xl",children:"🎯"}),e.jsxs("div",{children:[e.jsx("h3",{className:"font-bold text-gray-800 mb-1",children:"Sua jornada de sucesso continua! 🚀"}),e.jsx("p",{className:"text-gray-600 text-sm",children:"Manter seus dados atualizados é essencial para o bom funcionamento do sistema. Continue focada nos seus objetivos - você está no caminho certo! ✨"})]})]})})]})})})}),e.jsx("link",{rel:"stylesheet",href:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"})]})}export{w as default};
