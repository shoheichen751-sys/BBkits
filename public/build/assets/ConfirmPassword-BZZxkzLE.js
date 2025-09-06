import{x as m,j as e,Q as x,t as h,V as o}from"./app-VoDeNzPT.js";import"./TextInput-CF5x6HS8.js";/* empty css            */function g(){const{data:i,setData:n,post:l,processing:a,errors:s,reset:d}=m({password:""}),c=r=>{r.preventDefault(),l(route("password.confirm"),{onFinish:()=>d("password"),onSuccess:()=>{o.success("Senha confirmada com sucesso!")},onError:t=>{t.password&&o.error(t.password)}})};return e.jsxs(e.Fragment,{children:[e.jsx(x,{title:"Confirmar Senha - BBKits"}),e.jsx("style",{children:`
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

                .confirm-bg {
                    background: var(--gradient),
                                url('https://images.unsplash.com/photo-1555252333-9f8e92e65df9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80') center/cover;
                    position: relative;
                    overflow: hidden;
                }

                .confirm-bg::before {
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
            `}),e.jsxs("div",{className:"min-h-screen confirm-bg flex flex-col py-12 px-4",children:[e.jsx("div",{className:"w-full max-w-6xl mx-auto mb-8",children:e.jsx("div",{className:"flex justify-start",children:e.jsx(h,{href:"/",children:e.jsx("img",{src:"/images/logo.webp",alt:"BBKits Logo",className:"object-contain drop-shadow-xl hover:drop-shadow-2xl transition-all duration-500 hover:scale-110 hover:rotate-3 filter hover:brightness-110 hover:saturate-125 cursor-pointer animate-pulse hover:animate-none rounded-xl bg-white from-white/20 to-transparent backdrop-blur-sm border border-white/30 p-1 shadow-xl hover:shadow-yellow-400/50"})})})}),e.jsx("div",{className:"flex-1 flex items-center justify-center",children:e.jsx("div",{className:"w-full max-w-md",children:e.jsxs("div",{className:"bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl",children:[e.jsxs("div",{className:"text-center mb-6",children:[e.jsx("div",{className:"mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center",style:{background:"linear-gradient(135deg, #D4A574 0%, #E8B4CB 100%)"},children:e.jsx("svg",{className:"w-8 h-8 text-white",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"})})}),e.jsx("h1",{className:"text-3xl font-bold mb-2",style:{color:"#D4A574"},children:"Área Segura"}),e.jsx("p",{className:"text-gray-600",children:"Esta é uma área segura do aplicativo. Por favor, confirme sua senha antes de continuar."})]}),e.jsxs("form",{onSubmit:c,className:"space-y-6",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Senha"}),e.jsx("input",{id:"password",type:"password",name:"password",value:i.password,className:"w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all duration-300",autoComplete:"current-password",autoFocus:!0,onChange:r=>n("password",r.target.value),placeholder:"Digite sua senha"}),s.password&&e.jsx("p",{className:"mt-2 text-sm text-red-600",children:s.password})]}),e.jsx("button",{type:"submit",disabled:a,className:"w-full py-3 px-4 text-white font-medium rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",style:{background:"linear-gradient(135deg, #D4A574 0%, #E8B4CB 100%)"},children:a?e.jsxs("div",{className:"flex items-center justify-center",children:[e.jsxs("svg",{className:"animate-spin -ml-1 mr-3 h-5 w-5 text-white",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),"Confirmando..."]}):e.jsxs("div",{className:"flex items-center justify-center",children:[e.jsx("svg",{className:"w-5 h-5 mr-2",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"})}),"Confirmar Senha"]})})]}),e.jsx("div",{className:"mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl",children:e.jsxs("div",{className:"flex items-center",children:[e.jsx("svg",{className:"w-5 h-5 text-amber-600 mr-2",fill:"currentColor",viewBox:"0 0 20 20",children:e.jsx("path",{fillRule:"evenodd",d:"M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z",clipRule:"evenodd"})}),e.jsx("span",{className:"text-sm text-amber-800",children:"Por sua segurança, precisamos confirmar sua identidade"})]})})]})})})]}),e.jsx("link",{rel:"stylesheet",href:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"})]})}export{g as default};
