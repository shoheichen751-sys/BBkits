import{x as u,r as g,V as s,j as e,Q as h,t as l}from"./app-VoDeNzPT.js";import"./TextInput-CF5x6HS8.js";/* empty css            */function j({status:o,canResetPassword:d}){const{data:i,setData:n,post:m,processing:c,errors:r,reset:x}=u({email:"",password:"",remember:!1});g.useEffect(()=>{o&&s.success(o)},[o]);const p=a=>{a.preventDefault(),m(route("login"),{onFinish:()=>x("password"),onSuccess:()=>{s.success("Login realizado com sucesso!")},onError:t=>{t.email&&s.error(t.email),t.password&&s.error(t.password)}})};return e.jsxs(e.Fragment,{children:[e.jsx(h,{title:"Entrar - BBKits"}),e.jsx("style",{children:`
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

                .login-bg {
                    background: var(--gradient),
                                url('https://images.unsplash.com/photo-1555252333-9f8e92e65df9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80') center/cover;
                    position: relative;
                    overflow: hidden;
                }

                .login-bg::before {
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
            `}),e.jsxs("div",{className:"min-h-screen login-bg flex flex-col py-12 px-4",children:[e.jsx("div",{className:"w-full max-w-6xl mx-auto mb-8",children:e.jsx("div",{className:"flex justify-start",children:e.jsx(l,{href:"/",children:e.jsx("img",{src:"/images/logo.webp",alt:"BBKits Logo",className:"object-contain drop-shadow-xl hover:drop-shadow-2xl transition-all duration-500 hover:scale-110 hover:rotate-3 filter hover:brightness-110 hover:saturate-125 cursor-pointer animate-pulse hover:animate-none rounded-xl bg-white from-white/20 to-transparent backdrop-blur-sm border border-white/30 p-1 shadow-xl hover:shadow-yellow-400/50"})})})}),e.jsx("div",{className:"flex-1 flex items-center justify-center",children:e.jsx("div",{className:"w-full max-w-md",children:e.jsxs("div",{className:"bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl",children:[e.jsx("h1",{className:"text-3xl font-bold text-center mb-2",style:{color:"#D4A574"},children:"Bem-vinda de Volta!"}),e.jsx("p",{className:"text-center text-gray-600 mb-8",children:"Acesse sua conta e continue vendendo"}),e.jsxs("form",{onSubmit:p,className:"space-y-6",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"E-mail"}),e.jsx("input",{id:"email",type:"email",name:"email",value:i.email,className:"w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all duration-300",autoComplete:"username",autoFocus:!0,onChange:a=>n("email",a.target.value),placeholder:"seu@email.com"}),r.email&&e.jsx("p",{className:"mt-2 text-sm text-red-600",children:r.email})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Senha"}),e.jsx("input",{id:"password",type:"password",name:"password",value:i.password,className:"w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all duration-300",autoComplete:"current-password",onChange:a=>n("password",a.target.value),placeholder:"Digite sua senha"}),r.password&&e.jsx("p",{className:"mt-2 text-sm text-red-600",children:r.password})]}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("label",{className:"flex items-center cursor-pointer",children:[e.jsx("input",{type:"checkbox",name:"remember",checked:i.remember,onChange:a=>n("remember",a.target.checked),className:"w-4 h-4 text-orange-400 border border-gray-300 rounded focus:ring-orange-300 focus:ring-2"}),e.jsx("span",{className:"ml-2 text-sm text-gray-600",children:"Lembrar-me"})]}),d&&e.jsx(l,{href:route("password.request"),className:"text-sm text-orange-600 hover:text-orange-700 transition-colors duration-200",children:"Esqueceu a senha?"})]}),e.jsx("button",{type:"submit",disabled:c,className:"w-full py-3 px-4 text-white font-medium rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",style:{background:"linear-gradient(135deg, #D4A574 0%, #E8B4CB 100%)"},children:c?e.jsxs("div",{className:"flex items-center justify-center",children:[e.jsxs("svg",{className:"animate-spin -ml-1 mr-3 h-5 w-5 text-white",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),"Entrando..."]}):"Entrar"}),e.jsxs("div",{className:"text-center",children:[e.jsx("span",{className:"text-sm text-gray-600",children:"Ainda não tem uma conta? "}),e.jsx(l,{href:route("register"),className:"text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors duration-200",children:"Criar Conta"})]})]})]})})})]}),e.jsx("link",{rel:"stylesheet",href:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"})]})}export{j as default};
