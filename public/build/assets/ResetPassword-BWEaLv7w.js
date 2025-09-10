import{x as p,j as e,Q as f,t as n,V as l}from"./app-vPGu1-Ks.js";import"./TextInput-DuTBkNcH.js";/* empty css            */function j({token:d,email:c}){const{data:r,setData:t,post:m,processing:o,errors:s,reset:x}=p({token:d,email:c,password:"",password_confirmation:""}),u=a=>{a.preventDefault(),m(route("password.store"),{onFinish:()=>x("password","password_confirmation"),onSuccess:()=>{l.success("Senha redefinida com sucesso!")},onError:i=>{Object.keys(i).forEach(h=>{l.error(i[h])})}})};return e.jsxs(e.Fragment,{children:[e.jsx(f,{title:"Redefinir Senha - BBKits"}),e.jsx("style",{children:`
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

                .reset-bg {
                    background: var(--gradient),
                                url('https://images.unsplash.com/photo-1555252333-9f8e92e65df9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80') center/cover;
                    position: relative;
                    overflow: hidden;
                }

                .reset-bg::before {
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
            `}),e.jsxs("div",{className:"min-h-screen reset-bg flex flex-col py-12 px-4",children:[e.jsx("div",{className:"w-full max-w-6xl mx-auto mb-8",children:e.jsx("div",{className:"flex justify-start",children:e.jsx(n,{href:"/",children:e.jsx("img",{src:"/images/logo.webp",alt:"BBKits Logo",className:"object-contain drop-shadow-xl hover:drop-shadow-2xl transition-all duration-500 hover:scale-110 hover:rotate-3 filter hover:brightness-110 hover:saturate-125 cursor-pointer animate-pulse hover:animate-none rounded-xl bg-white from-white/20 to-transparent backdrop-blur-sm border border-white/30 p-1 shadow-xl hover:shadow-yellow-400/50"})})})}),e.jsx("div",{className:"flex-1 flex items-center justify-center",children:e.jsx("div",{className:"w-full max-w-md",children:e.jsxs("div",{className:"bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl",children:[e.jsxs("div",{className:"text-center mb-6",children:[e.jsx("div",{className:"mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center",style:{background:"linear-gradient(135deg, #D4A574 0%, #E8B4CB 100%)"},children:e.jsx("svg",{className:"w-8 h-8 text-white",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"})})}),e.jsx("h1",{className:"text-3xl font-bold mb-2",style:{color:"#D4A574"},children:"Redefinir Senha"}),e.jsx("p",{className:"text-gray-600",children:"Crie uma nova senha segura para sua conta"})]}),e.jsxs("form",{onSubmit:u,className:"space-y-6",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"E-mail"}),e.jsx("input",{id:"email",type:"email",name:"email",value:r.email,className:"w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all duration-300 bg-gray-50",autoComplete:"username",onChange:a=>t("email",a.target.value),placeholder:"seu@email.com",readOnly:!0}),s.email&&e.jsx("p",{className:"mt-2 text-sm text-red-600",children:s.email})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Nova Senha"}),e.jsx("input",{id:"password",type:"password",name:"password",value:r.password,className:"w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all duration-300",autoComplete:"new-password",autoFocus:!0,onChange:a=>t("password",a.target.value),placeholder:"Digite sua nova senha"}),s.password&&e.jsx("p",{className:"mt-2 text-sm text-red-600",children:s.password})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Confirmar Nova Senha"}),e.jsx("input",{id:"password_confirmation",type:"password",name:"password_confirmation",value:r.password_confirmation,className:"w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all duration-300",autoComplete:"new-password",onChange:a=>t("password_confirmation",a.target.value),placeholder:"Confirme sua nova senha"}),s.password_confirmation&&e.jsx("p",{className:"mt-2 text-sm text-red-600",children:s.password_confirmation})]}),e.jsx("button",{type:"submit",disabled:o,className:"w-full py-3 px-4 text-white font-medium rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",style:{background:"linear-gradient(135deg, #D4A574 0%, #E8B4CB 100%)"},children:o?e.jsxs("div",{className:"flex items-center justify-center",children:[e.jsxs("svg",{className:"animate-spin -ml-1 mr-3 h-5 w-5 text-white",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),"Redefinindo..."]}):e.jsxs("div",{className:"flex items-center justify-center",children:[e.jsx("svg",{className:"w-5 h-5 mr-2",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"})}),"Redefinir Senha"]})}),e.jsxs("div",{className:"text-center",children:[e.jsx("span",{className:"text-sm text-gray-600",children:"Lembrou da senha? "}),e.jsx(n,{href:route("login"),className:"text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors duration-200",children:"Voltar ao Login"})]})]}),e.jsx("div",{className:"mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl",children:e.jsxs("div",{className:"flex items-start",children:[e.jsx("svg",{className:"w-5 h-5 text-amber-600 mr-2 mt-0.5",fill:"currentColor",viewBox:"0 0 20 20",children:e.jsx("path",{fillRule:"evenodd",d:"M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z",clipRule:"evenodd"})}),e.jsxs("div",{children:[e.jsx("h4",{className:"text-sm font-medium text-amber-800 mb-1",children:"Dicas para uma senha segura"}),e.jsxs("ul",{className:"text-sm text-amber-700 space-y-1",children:[e.jsx("li",{children:"• Mínimo de 8 caracteres"}),e.jsx("li",{children:"• Combine letras, números e símbolos"}),e.jsx("li",{children:"• Evite informações pessoais"})]})]})]})})]})})})]}),e.jsx("link",{rel:"stylesheet",href:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"})]})}export{j as default};
