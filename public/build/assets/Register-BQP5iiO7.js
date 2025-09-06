import{x as p,j as e,Q as u,t as i,V as l}from"./app-VoDeNzPT.js";import"./TextInput-CF5x6HS8.js";/* empty css            */function b(){const{data:s,setData:t,post:d,processing:o,errors:r,reset:c}=p({name:"",email:"",password:"",password_confirmation:""}),m=a=>{a.preventDefault(),d(route("register"),{onFinish:()=>c("password","password_confirmation"),onSuccess:()=>{l.success("Conta criada com sucesso!")},onError:n=>{Object.keys(n).forEach(x=>{l.error(n[x])})}})};return e.jsxs(e.Fragment,{children:[e.jsx(u,{title:"Cadastro - BBKits"}),e.jsx("style",{children:`
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

                .register-bg {
                    background: var(--gradient),
                                url('https://images.unsplash.com/photo-1555252333-9f8e92e65df9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80') center/cover;
                    position: relative;
                    overflow: hidden;
                }

                .register-bg::before {
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
            `}),e.jsxs("div",{className:"min-h-screen register-bg flex flex-col py-12 px-4",children:[e.jsx("div",{className:"w-full max-w-6xl mx-auto mb-8",children:e.jsx("div",{className:"flex justify-start",children:e.jsx(i,{href:"/",children:e.jsx("img",{src:"/images/logo.webp",alt:"BBKits Logo",className:"object-contain drop-shadow-xl hover:drop-shadow-2xl transition-all duration-500 hover:scale-110 hover:rotate-3 filter hover:brightness-110 hover:saturate-125 cursor-pointer animate-pulse hover:animate-none rounded-xl bg-white from-white/20 to-transparent backdrop-blur-sm border border-white/30 p-1 shadow-xl hover:shadow-yellow-400/50"})})})}),e.jsx("div",{className:"flex-1 flex items-center justify-center",children:e.jsx("div",{className:"w-full max-w-md",children:e.jsxs("div",{className:"bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl",children:[e.jsx("h1",{className:"text-3xl font-bold text-center mb-2",style:{color:"#D4A574"},children:"Criar Conta"}),e.jsx("p",{className:"text-center text-gray-600 mb-8",children:"Junte-se às vendedoras de sucesso da BBkits"}),e.jsxs("form",{onSubmit:m,className:"space-y-6",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Nome Completo"}),e.jsx("input",{id:"name",type:"text",name:"name",value:s.name,className:"w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all duration-300",autoComplete:"name",autoFocus:!0,onChange:a=>t("name",a.target.value),placeholder:"Digite seu nome completo",required:!0}),r.name&&e.jsx("p",{className:"mt-2 text-sm text-red-600",children:r.name})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"E-mail"}),e.jsx("input",{id:"email",type:"email",name:"email",value:s.email,className:"w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all duration-300",autoComplete:"username",onChange:a=>t("email",a.target.value),placeholder:"seu@email.com",required:!0}),r.email&&e.jsx("p",{className:"mt-2 text-sm text-red-600",children:r.email})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Senha"}),e.jsx("input",{id:"password",type:"password",name:"password",value:s.password,className:"w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all duration-300",autoComplete:"new-password",onChange:a=>t("password",a.target.value),placeholder:"Crie uma senha forte",required:!0}),r.password&&e.jsx("p",{className:"mt-2 text-sm text-red-600",children:r.password})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Confirmar Senha"}),e.jsx("input",{id:"password_confirmation",type:"password",name:"password_confirmation",value:s.password_confirmation,className:"w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all duration-300",autoComplete:"new-password",onChange:a=>t("password_confirmation",a.target.value),placeholder:"Confirme sua senha",required:!0}),r.password_confirmation&&e.jsx("p",{className:"mt-2 text-sm text-red-600",children:r.password_confirmation})]}),e.jsx("button",{type:"submit",disabled:o,className:"w-full py-3 px-4 text-white font-medium rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",style:{background:"linear-gradient(135deg, #D4A574 0%, #E8B4CB 100%)"},children:o?e.jsxs("div",{className:"flex items-center justify-center",children:[e.jsxs("svg",{className:"animate-spin -ml-1 mr-3 h-5 w-5 text-white",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),"Criando conta..."]}):"Criar Minha Conta"}),e.jsxs("div",{className:"text-center",children:[e.jsx("span",{className:"text-sm text-gray-600",children:"Já possui uma conta? "}),e.jsx(i,{href:route("login"),className:"text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors duration-200",children:"Fazer Login"})]})]}),e.jsx("div",{className:"mt-6 pt-6 border-t border-gray-200",children:e.jsxs("div",{className:"text-center text-xs text-gray-500",children:[e.jsx("p",{children:"Ao criar uma conta, você concorda com nossos"}),e.jsxs("div",{className:"space-x-2 mt-1",children:[e.jsx("a",{href:"#",className:"text-orange-600 hover:text-orange-700",children:"Termos de Uso"}),e.jsx("span",{children:"e"}),e.jsx("a",{href:"#",className:"text-orange-600 hover:text-orange-700",children:"Política de Privacidade"})]})]})})]})})})]}),e.jsx("link",{rel:"stylesheet",href:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"})]})}export{b as default};
