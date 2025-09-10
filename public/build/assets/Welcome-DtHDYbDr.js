import{j as e,Q as s,t}from"./app-vPGu1-Ks.js";/* empty css            */function l({auth:a}){return e.jsxs(e.Fragment,{children:[e.jsx(s,{title:"BBKits - Sistema de Vendas"}),e.jsx("style",{children:`
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

                .hero-gradient {
                    background: var(--gradient-hero),
                                url('https://images.unsplash.com/photo-1555252333-9f8e92e65df9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80') center/cover;
                }

                .logo-glow {
                    background: var(--gradient);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: logoGlow 3s ease-in-out infinite alternate;
                }

                @keyframes logoGlow {
                    0% { filter: drop-shadow(0 0 5px rgba(212, 165, 116, 0.3)); }
                    100% { filter: drop-shadow(0 0 15px rgba(212, 165, 116, 0.6)); }
                }

                .btn-gradient {
                    background: var(--gradient);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
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

                .card-gradient {
                    background: var(--gradient-soft);
                    border-radius: 25px;
                    box-shadow: var(--shadow);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 2px solid transparent;
                }

                .card-gradient:hover {
                    transform: translateY(-10px) scale(1.02);
                    box-shadow: var(--shadow-hover);
                    border-color: var(--primary-color);
                }

                .feature-icon {
                    background: var(--gradient);
                    transition: all 0.3s ease;
                }

                .feature-icon:hover {
                    transform: scale(1.1);
                    box-shadow: var(--shadow-glow);
                }

                .floating-particles {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    pointer-events: none;
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

                .hero-title {
                    animation: heroTitle 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                    opacity: 0;
                    transform: translateY(50px);
                }

                @keyframes heroTitle {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .hero-subtitle {
                    animation: heroSubtitle 1.5s 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                    opacity: 0;
                    transform: translateY(30px);
                }

                @keyframes heroSubtitle {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .quote-gradient {
                    background: var(--gradient);
                    border-radius: 25px;
                    position: relative;
                    overflow: hidden;
                }

                .quote-gradient::before {
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
            `}),e.jsxs("div",{className:"min-h-screen hero-gradient relative overflow-hidden",children:[e.jsx("div",{className:"floating-particles",children:Array.from({length:20},(o,r)=>e.jsx("div",{className:"particle",style:{left:Math.random()*100+"%",width:Math.random()*10+5+"px",height:Math.random()*10+5+"px",animationDelay:Math.random()*15+"s",animationDuration:Math.random()*10+10+"s"}},r))}),e.jsxs("div",{className:"container mx-auto px-4 py-8 relative z-10",children:[e.jsxs("nav",{className:"flex items-center justify-between mb-16 bg-white/95 backdrop-blur-lg rounded-2xl px-6 py-4 shadow-lg border border-white/20",children:[e.jsx("div",{className:"flex items-center space-x-3",children:e.jsx("div",{className:"flex flex-col",children:e.jsx("img",{src:"/images/logo.webp",alt:"BBKits Logo",className:"object-contain drop-shadow-xl hover:drop-shadow-2xl transition-all duration-500 hover:scale-110 hover:rotate-3 filter hover:brightness-110 hover:saturate-125 cursor-pointer animate-pulse hover:animate-none rounded-2xl bg-gradient-to-br from-white/20 to-transparent backdrop-blur-sm border border-white/30 p-2 shadow-2xl hover:shadow-yellow-400/50"})})}),e.jsx("div",{className:"flex items-center space-x-4",children:a.user?e.jsx(t,{href:route("dashboard"),className:"btn-gradient text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition duration-300 uppercase tracking-wide",children:"Acessar Sistema"}):e.jsxs("div",{className:"flex items-center space-x-4",children:[e.jsx(t,{href:route("login"),className:"text-white/90 hover:text-white px-6 py-3 rounded-full font-medium transition duration-300 backdrop-blur-sm hover:bg-white/10 border border-white/20 hover:border-white/40",children:"Entrar"}),e.jsx(t,{href:route("register"),className:"bg-white/95 text-pink-600 hover:bg-white hover:text-pink-700 px-8 py-3 rounded-full font-semibold transition duration-300 shadow-lg hover:shadow-xl hover:scale-105 backdrop-blur-sm",children:"Cadastrar"})]})})]}),e.jsxs("div",{className:"text-center max-w-5xl mx-auto text-white",children:[e.jsxs("h1",{className:"text-6xl md:text-7xl font-bold mb-6 hero-title text-shadow-lg",children:["BBkits",e.jsx("span",{className:"block text-4xl md:text-5xl mt-4 text-white/90",children:"Sistema de Vendas Premium"})]}),e.jsx("p",{className:"text-xl md:text-2xl mb-12 leading-relaxed text-white/90 hero-subtitle max-w-3xl mx-auto",children:"Plataforma completa para gestão de vendas, controle de comissões e acompanhamento de metas para vendedoras de bolsas maternidade premium"}),!a.user&&e.jsxs("div",{className:"flex flex-col sm:flex-row gap-6 justify-center mb-20",children:[e.jsxs(t,{href:route("login"),className:"bg-white/95 text-pink-600 hover:text-pink-700 px-10 py-4 rounded-full text-xl font-bold transition duration-300 shadow-xl hover:shadow-2xl hover:scale-105 hover:bg-white backdrop-blur-sm border border-white/20",children:["Fazer Login",e.jsx("i",{className:"fas fa-arrow-right ml-3"})]}),e.jsxs(t,{href:route("register"),className:"btn-gradient text-white px-10 py-4 rounded-full text-xl font-bold shadow-xl hover:shadow-2xl uppercase tracking-wide",children:["Quero ser uma vendedora BBkits",e.jsx("i",{className:"fas fa-rocket ml-3"})]})]}),e.jsxs("div",{className:"flex justify-center gap-8 mb-16",children:[e.jsx("div",{className:"w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-2xl text-white backdrop-blur-sm hover:bg-white/20 transition duration-300 hover:scale-110",children:e.jsx("i",{className:"fas fa-heart"})}),e.jsx("div",{className:"w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-2xl text-white backdrop-blur-sm hover:bg-white/20 transition duration-300 hover:scale-110",children:e.jsx("i",{className:"fas fa-star"})}),e.jsx("div",{className:"w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-2xl text-white backdrop-blur-sm hover:bg-white/20 transition duration-300 hover:scale-110",children:e.jsx("i",{className:"fas fa-crown"})})]})]})]}),e.jsx("div",{className:"bg-white/95 backdrop-blur-lg",children:e.jsxs("div",{className:"container mx-auto px-4 py-20",children:[e.jsxs("div",{className:"text-center mb-16",children:[e.jsx("h2",{className:"text-4xl md:text-5xl font-bold text-gray-900 mb-4",children:"Como Funciona o Sistema"}),e.jsx("p",{className:"text-xl text-gray-600 max-w-3xl mx-auto",children:"Um processo simples e transparente para o seu sucesso"})]}),e.jsxs("div",{className:"grid md:grid-cols-3 gap-10 mt-16",children:[e.jsxs("div",{className:"card-gradient p-10 text-center group",children:[e.jsx("div",{className:"w-20 h-20 feature-icon rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition duration-300",children:e.jsx("svg",{className:"w-10 h-10 text-white",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"})})}),e.jsx("h3",{className:"text-2xl font-bold text-gray-900 mb-4",children:"Controle de Vendas"}),e.jsx("p",{className:"text-gray-600 leading-relaxed text-lg",children:"Registre suas vendas com comprovantes e acompanhe o status de aprovação em tempo real através do seu painel personalizado."})]}),e.jsxs("div",{className:"card-gradient p-10 text-center group",children:[e.jsx("div",{className:"w-20 h-20 feature-icon rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition duration-300",children:e.jsx("svg",{className:"w-10 h-10 text-white",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"})})}),e.jsx("h3",{className:"text-2xl font-bold text-gray-900 mb-4",children:"Cálculo de Comissões"}),e.jsx("p",{className:"text-gray-600 leading-relaxed text-lg",children:"Sistema automático de cálculo de comissões baseado em metas e valores recebidos com transparência total."})]}),e.jsxs("div",{className:"card-gradient p-10 text-center group",children:[e.jsx("div",{className:"w-20 h-20 feature-icon rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition duration-300",children:e.jsx("svg",{className:"w-10 h-10 text-white",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"})})}),e.jsx("h3",{className:"text-2xl font-bold text-gray-900 mb-4",children:"Dashboard Motivacional"}),e.jsx("p",{className:"text-gray-600 leading-relaxed text-lg",children:"Acompanhe seu progresso, ranking e metas com interface gamificada e motivacional que impulsiona seu sucesso."})]})]}),e.jsxs("div",{className:"mt-20 quote-gradient p-12 text-white text-center relative z-10",children:[e.jsx("h2",{className:"text-3xl md:text-4xl font-bold mb-6",children:'"Você não vende bolsas. Você entrega histórias, segurança e amor."'}),e.jsxs("div",{className:"flex justify-center items-center gap-4 text-2xl mb-4",children:[e.jsx("i",{className:"fas fa-heart"}),e.jsx("span",{children:"💼"}),e.jsx("span",{children:"👶"}),e.jsx("i",{className:"fas fa-star"})]}),e.jsx("p",{className:"text-white/90 text-xl font-medium",children:"Sistema desenvolvido especialmente para as vendedoras BBKits"})]})]})})]}),e.jsx("link",{rel:"stylesheet",href:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"})]})}export{l as default};
