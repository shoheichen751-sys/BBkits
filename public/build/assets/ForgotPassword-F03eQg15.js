import{x,r as u,V as s,j as e,Q as h,t as i}from"./app-VoDeNzPT.js";import"./TextInput-CF5x6HS8.js";/* empty css            */function b({status:a}){const{data:n,setData:d,post:c,processing:t,errors:o}=x({email:""});u.useEffect(()=>{a&&s.success(a)},[a]);const m=r=>{r.preventDefault(),c(route("password.email"),{onSuccess:()=>{s.success("Link de recuperação enviado com sucesso!")},onError:l=>{l.email&&s.error(l.email)}})};return e.jsxs(e.Fragment,{children:[e.jsx(h,{title:"Recuperar Senha - BBKits"}),e.jsx("style",{children:`
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

                .forgot-bg {
                    background: var(--gradient),
                                url('https://images.unsplash.com/photo-1555252333-9f8e92e65df9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80') center/cover;
                    position: relative;
                    overflow: hidden;
                }

                .forgot-bg::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: radial-gradient(circle at 30% 50%, rgba(212, 165, 116, 0.3) 0%, transparent 50%),
                                radial-gradient(circle at 70% 30%, rgba(232, 180, 203, 0.3) 0%, transparent 50%);
                    animation: gradientShift 8s ease-in-out infinite;
                }

                @keyframes gradientShift {
                    0%, 100% { opacity: 0.8; }
                    50% { opacity: 1; }
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
            `}),e.jsxs("div",{className:"min-h-screen forgot-bg flex flex-col py-12 px-4",children:[e.jsx("div",{className:"w-full max-w-6xl mx-auto mb-8",children:e.jsx("div",{className:"flex justify-start",children:e.jsx(i,{href:"/",children:e.jsx("img",{src:"/images/logo.webp",alt:"BBKits Logo",className:"object-contain drop-shadow-xl hover:drop-shadow-2xl transition-all duration-500 hover:scale-110 hover:rotate-3 filter hover:brightness-110 hover:saturate-125 cursor-pointer animate-pulse hover:animate-none rounded-xl bg-white from-white/20 to-transparent backdrop-blur-sm border border-white/30 p-1 shadow-xl hover:shadow-yellow-400/50"})})})}),e.jsx("div",{className:"flex-1 flex items-center justify-center",children:e.jsx("div",{className:"w-full max-w-md",children:e.jsxs("div",{className:"bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl",children:[e.jsxs("div",{className:"text-center mb-6",children:[e.jsx("div",{className:"mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center",style:{background:"linear-gradient(135deg, #D4A574 0%, #E8B4CB 100%)"},children:e.jsx("svg",{className:"w-8 h-8 text-white",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"})})}),e.jsx("h1",{className:"text-3xl font-bold mb-2",style:{color:"#D4A574"},children:"Esqueceu a Senha?"}),e.jsx("p",{className:"text-gray-600",children:"Sem problemas! Informe seu e-mail e enviaremos um link para você criar uma nova senha."})]}),a&&e.jsx("div",{className:"mb-6 p-4 bg-green-50 border border-green-200 rounded-xl",children:e.jsxs("div",{className:"flex items-center",children:[e.jsx("svg",{className:"w-5 h-5 text-green-600 mr-2",fill:"currentColor",viewBox:"0 0 20 20",children:e.jsx("path",{fillRule:"evenodd",d:"M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",clipRule:"evenodd"})}),e.jsx("span",{className:"text-sm text-green-800 font-medium",children:a})]})}),e.jsxs("form",{onSubmit:m,className:"space-y-6",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"E-mail"}),e.jsx("input",{id:"email",type:"email",name:"email",value:n.email,className:"w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all duration-300",autoComplete:"username",autoFocus:!0,onChange:r=>d("email",r.target.value),placeholder:"seu@email.com"}),o.email&&e.jsx("p",{className:"mt-2 text-sm text-red-600",children:o.email})]}),e.jsx("button",{type:"submit",disabled:t,className:"w-full py-3 px-4 text-white font-medium rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",style:{background:"linear-gradient(135deg, #D4A574 0%, #E8B4CB 100%)"},children:t?e.jsxs("div",{className:"flex items-center justify-center",children:[e.jsxs("svg",{className:"animate-spin -ml-1 mr-3 h-5 w-5 text-white",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),"Enviando..."]}):e.jsxs("div",{className:"flex items-center justify-center",children:[e.jsx("svg",{className:"w-5 h-5 mr-2",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 19l9 2-9-18-9 18 9-2zm0 0v-8"})}),"Enviar Link de Recuperação"]})}),e.jsxs("div",{className:"text-center",children:[e.jsx("span",{className:"text-sm text-gray-600",children:"Lembrou da senha? "}),e.jsx(i,{href:route("login"),className:"text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors duration-200",children:"Voltar ao Login"})]})]}),e.jsx("div",{className:"mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl",children:e.jsxs("div",{className:"flex items-start",children:[e.jsx("svg",{className:"w-5 h-5 text-blue-600 mr-2 mt-0.5",fill:"currentColor",viewBox:"0 0 20 20",children:e.jsx("path",{fillRule:"evenodd",d:"M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z",clipRule:"evenodd"})}),e.jsxs("div",{children:[e.jsx("h4",{className:"text-sm font-medium text-blue-800 mb-1",children:"Dica"}),e.jsx("p",{className:"text-sm text-blue-700",children:"Verifique sua caixa de spam se não receber o e-mail em alguns minutos."})]})]})})]})})})]}),e.jsx("link",{rel:"stylesheet",href:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"})]})}export{b as default};
