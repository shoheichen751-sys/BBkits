import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import DropdownMenu from "@/Components/DropdownMenu";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import NotificationBell from "@/Components/NotificationBell";
import { Link, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Permission helpers
    const canViewMaterials = () => {
        return ['admin', 'manager', 'production_admin', 'finance_admin', 'financeiro'].includes(user.role);
    };

    const canViewSuppliers = () => {
        return ['admin', 'manager', 'production_admin', 'finance_admin', 'financeiro'].includes(user.role);
    };

    const canViewInventory = () => {
        return ['admin', 'manager', 'production_admin', 'finance_admin', 'financeiro'].includes(user.role);
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            {/* Add the same premium styles from Welcome page */}
            <style>{`
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

                .premium-bg {
                    background: linear-gradient(135deg, #F5E6D3 0%, #FFFFFF 30%, #F0F9FF 70%, #FDF2F8 100%);
                    position: relative;
                    overflow: hidden;
                }

                .floating-particles {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    pointer-events: none;
                    z-index: 0;
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
                        opacity: 0.3;
                    }
                    90% {
                        opacity: 0.3;
                    }
                    100% {
                        transform: translateY(-100px) rotate(360deg);
                        opacity: 0;
                    }
                }

                .navbar-glass {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(20px);
                    border-bottom: 1px solid rgba(212, 165, 116, 0.2);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .navbar-scrolled {
                    background: rgba(255, 255, 255, 0.98);
                    backdrop-filter: blur(25px);
                    box-shadow: var(--shadow);
                    border-bottom: 2px solid var(--primary-color);
                }

                .logo-container {
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                }

                .logo-container::before {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 0;
                    height: 0;
                    background: var(--gradient);
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    opacity: 0;
                    transition: all 0.4s ease;
                    z-index: -1;
                }

                .logo-container:hover::before {
                    width: 120%;
                    height: 120%;
                    opacity: 0.1;
                }

                .logo-container:hover {
                    transform: scale(1.1) rotate(5deg);
                    filter: drop-shadow(0 0 20px rgba(212, 165, 116, 0.4));
                }

                .nav-link {
                    position: relative;
                    padding: 6px 10px;
                    border-radius: 12px;
                    font-weight: 500;
                    font-size: 0.75rem;
                    color: var(--text-dark);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    overflow: hidden;
                    white-space: nowrap;
                }
                
                @media (min-width: 640px) {
                    .nav-link {
                        padding: 6px 12px;
                        font-size: 0.8125rem;
                    }
                }
                
                @media (min-width: 768px) {
                    .nav-link {
                        padding: 8px 14px;
                        font-size: 0.875rem;
                        border-radius: 14px;
                    }
                }
                
                @media (min-width: 1024px) {
                    .nav-link {
                        padding: 10px 16px;
                        font-size: 0.9375rem;
                        font-weight: 600;
                        border-radius: 15px;
                    }
                }
                
                @media (min-width: 1280px) {
                    .nav-link {
                        padding: 12px 20px;
                        font-size: 1rem;
                    }
                }

                .nav-link::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: var(--gradient-soft);
                    transition: left 0.5s ease;
                    z-index: -1;
                }

                .nav-link:hover::before,
                .nav-link.active::before {
                    left: 0;
                }

                .nav-link:hover {
                    color: var(--primary-color);
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(212, 165, 116, 0.2);
                }
                
                @media (min-width: 1024px) {
                    .nav-link:hover {
                        transform: translateY(-3px);
                        box-shadow: 0 10px 25px rgba(212, 165, 116, 0.2);
                    }
                }

                .nav-link.active {
                    color: var(--primary-color);
                    background: var(--gradient-soft);
                    box-shadow: 0 8px 20px rgba(212, 165, 116, 0.3);
                }

                .user-dropdown {
                    background: var(--gradient-soft);
                    border: 2px solid transparent;
                    background-clip: padding-box;
                    border-radius: 12px;
                    padding: 4px 8px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }
                
                @media (min-width: 768px) {
                    .user-dropdown {
                        padding: 6px 12px;
                        border-radius: 16px;
                    }
                }
                
                @media (min-width: 1024px) {
                    .user-dropdown {
                        padding: 8px 16px;
                        border-radius: 20px;
                    }
                }

                .user-dropdown::before {
                    content: '';
                    position: absolute;
                    top: -2px;
                    left: -2px;
                    right: -2px;
                    bottom: -2px;
                    background: var(--gradient);
                    border-radius: inherit;
                    z-index: -1;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .user-dropdown:hover::before {
                    opacity: 1;
                }

                .user-dropdown:hover {
                    transform: translateY(-2px) scale(1.05);
                    box-shadow: var(--shadow-hover);
                }

                .user-avatar {
                    background: var(--gradient);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(212, 165, 116, 0.3);
                }

                .user-avatar:hover {
                    transform: scale(1.1) rotate(10deg);
                    box-shadow: var(--shadow-glow);
                }

                .dropdown-content {
                    background: rgba(255, 255, 255, 0.98);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(212, 165, 116, 0.2);
                    border-radius: 20px;
                    box-shadow: var(--shadow-hover);
                    overflow: hidden;
                    margin-top: 8px;
                }

                .dropdown-header {
                    background: var(--gradient-soft);
                    padding: 16px;
                    border-bottom: 1px solid rgba(212, 165, 116, 0.1);
                }

                .dropdown-link {
                    padding: 12px 16px;
                    transition: all 0.3s ease;
                    border-radius: 0;
                    margin: 4px 8px;
                    border-radius: 12px;
                }

                .dropdown-link:hover {
                    background: var(--gradient-soft);
                    color: var(--primary-color);
                    transform: translateX(5px);
                }

                .mobile-menu {
                    background: rgba(255, 255, 255, 0.98);
                    backdrop-filter: blur(20px);
                    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                    border-bottom: 1px solid rgba(212, 165, 116, 0.2);
                }

                .mobile-toggle {
                    background: var(--gradient-soft);
                    border-radius: 12px;
                    padding: 6px;
                    transition: all 0.3s ease;
                    border: 2px solid transparent;
                }
                
                @media (min-width: 640px) {
                    .mobile-toggle {
                        padding: 8px;
                        border-radius: 15px;
                    }
                }

                .mobile-toggle:hover {
                    background: var(--gradient);
                    color: white;
                    transform: scale(1.1);
                    box-shadow: 0 5px 15px rgba(212, 165, 116, 0.3);
                }

                .header-section {
                    background: var(--gradient-soft);
                    border-bottom: 2px solid var(--primary-color);
                    box-shadow: var(--shadow);
                    position: relative;
                    overflow: hidden;
                }

                .header-section::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(45deg, rgba(212, 165, 116, 0.05) 0%, rgba(232, 180, 203, 0.05) 100%);
                    pointer-events: none;
                }

                .main-content {
                    position: relative;
                    z-index: 1;
                }

                .animate-fadeInUp {
                    animation: fadeInUp 0.8s ease-out forwards;
                    opacity: 0;
                    transform: translateY(30px);
                }

                .animate-fadeInUp.delay-200 {
                    animation-delay: 0.2s;
                }

                @keyframes fadeInUp {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .icon-hover {
                    transition: all 0.3s ease;
                }

                .icon-hover:hover {
                    transform: scale(1.2) rotate(10deg);
                    color: var(--primary-color);
                }

                /* Mobile responsive menu animations */
                .mobile-nav-item {
                    transition: all 0.3s ease;
                    margin: 4px 0;
                }

                .mobile-nav-item:hover {
                    transform: translateX(10px) scale(1.02);
                    background: var(--gradient-soft);
                    border-radius: 15px;
                }

                /* Scroll indicator */
                .scroll-indicator {
                    position: fixed;
                    top: 0;
                    left: 0;
                    height: 4px;
                    background: var(--gradient);
                    z-index: 9999;
                    transition: width 0.3s ease;
                }

                /* Custom scrollbar */
                ::-webkit-scrollbar {
                    width: 8px;
                }

                ::-webkit-scrollbar-track {
                    background: #f1f1f1;
                }

                ::-webkit-scrollbar-thumb {
                    background: var(--gradient);
                    border-radius: 4px;
                }

                ::-webkit-scrollbar-thumb:hover {
                    background: var(--accent-color);
                }
                
                /* Responsive icon sizes */
                .nav-icon {
                    width: 0.875rem;
                    height: 0.875rem;
                }
                
                @media (min-width: 768px) {
                    .nav-icon {
                        width: 1rem;
                        height: 1rem;
                    }
                }
                
                @media (min-width: 1024px) {
                    .nav-icon {
                        width: 1.125rem;
                        height: 1.125rem;
                    }
                }
                
                /* Hide text on smaller screens, show icons only */
                .nav-text {
                    display: none;
                }

                @media (min-width: 900px) {
                    .nav-text {
                        display: inline;
                    }
                }

                /* Better spacing for dropdown menus */
                .dropdown-menu {
                    min-width: 200px;
                }

                /* Compact navigation for tablets */
                @media (max-width: 1024px) {
                    .nav-link {
                        padding: 8px 10px;
                        gap: 0;
                    }

                    .nav-icon {
                        width: 1.125rem;
                        height: 1.125rem;
                    }
                }
                
                /* Adjust navbar height */
                .navbar-height {
                    height: 3rem;
                }
                
                @media (min-width: 640px) {
                    .navbar-height {
                        height: 3.5rem;
                    }
                }
                
                @media (min-width: 768px) {
                    .navbar-height {
                        height: 3.75rem;
                    }
                }
                
                @media (min-width: 1024px) {
                    .navbar-height {
                        height: 4rem;
                    }
                }
            `}</style>

            <div className="min-h-screen premium-bg">
                {/* Floating particles */}
                <div className="floating-particles">
                    {Array.from({ length: 25 }, (_, i) => (
                        <div
                            key={i}
                            className="particle"
                            style={{
                                left: Math.random() * 100 + "%",
                                width: Math.random() * 10 + 4 + "px",
                                height: Math.random() * 10 + 4 + "px",
                                animationDelay: Math.random() * 15 + "s",
                                animationDuration:
                                    Math.random() * 10 + 15 + "s",
                            }}
                        />
                    ))}
                </div>

                <nav
                    className={`fixed top-0 w-full z-50 navbar-glass ${
                        isScrolled ? "navbar-scrolled" : ""
                    }`}
                >
                    <div className="mx-auto w-full max-w-[100%] px-2 sm:px-3 md:px-4 lg:px-6 xl:max-w-7xl xl:px-8">
                        <div className="navbar-height flex justify-between items-center">
                            <div className="flex items-center flex-shrink-0">
                                <div className="flex shrink-0 items-center">
                                    <Link href="/" className="logo-container">
                                        <img
                                            src="/images/logo.webp"
                                            alt="BBKits Logo"
                                            className="h-6 sm:h-7 md:h-8 lg:h-9 xl:h-10 w-auto object-contain drop-shadow-xl hover:drop-shadow-2xl transition-all duration-500 hover:scale-110 hover:rotate-3 filter hover:brightness-110 hover:saturate-125 cursor-pointer animate-pulse hover:animate-none rounded-lg sm:rounded-xl bg-white from-white/20 to-transparent backdrop-blur-sm border border-white/30 p-0.5 sm:p-0.75 lg:p-1 shadow-xl hover:shadow-yellow-400/50"
                                        />
                                    </Link>
                                </div>

                                <div className="hidden md:flex items-center space-x-0.5 lg:space-x-1 xl:space-x-2 ms-2 sm:ms-3 md:ms-4 lg:ms-6 xl:ms-10">
                                    <NavLink
                                        href={route("dashboard")}
                                        active={window.location.pathname === "/dashboard"}
                                        className={`nav-link flex items-center gap-0.5 lg:gap-1 xl:gap-2 ${
                                            window.location.pathname === "/dashboard" ? "active" : ""
                                        }`}
                                    >
                                        <svg className="nav-icon icon-hover" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M13 9V3h8v6h-8ZM3 13V3h8v10H3Zm10 8V11h8v10h-8ZM3 21v-6h8v6H3Z" />
                                        </svg>
                                        <span className="nav-text">Dashboard</span>
                                    </NavLink>

                                    <NavLink
                                        href={route("sales.index")}
                                        active={window.location.pathname.includes("/sales")}
                                        className={`nav-link flex items-center gap-0.5 lg:gap-1 xl:gap-2 ${
                                            window.location.pathname.includes("/sales") ? "active" : ""
                                        }`}
                                    >
                                        <svg className="nav-icon icon-hover" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M7 4V2C7 1.45 7.45 1 8 1h8c.55 0 1 .45 1 1v2h5c.55 0 1 .45 1 1s-.45 1-1 1h-1v11c0 1.66-1.34 3-3 3H6c-1.66 0-3-1.34-3-3V6H2c-.55 0-1-.45-1-1s.45-1 1-1h5Zm2-1v1h6V3H9Zm6.5 15L19 14.5l-1.41-1.41L15 15.67l-1.59-1.58L12 15.5 15.5 18Z" />
                                        </svg>
                                        <span className="nav-text">Vendas</span>
                                    </NavLink>

                                    {/* Finance Admin Navigation */}
                                    {(user.role === "finance_admin" || user.role === "financeiro" || user.role === "admin") && (
                                        <NavLink
                                            href={route("finance.orders.index")}
                                            active={window.location.pathname.includes("/finance")}
                                            className={`nav-link flex items-center gap-0.5 lg:gap-1 xl:gap-2 ${
                                                window.location.pathname.includes("/finance") ? "active" : ""
                                            }`}
                                        >
                                            <svg className="nav-icon icon-hover" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4Z"/>
                                            </svg>
                                            <span className="nav-text">Financeiro</span>
                                        </NavLink>
                                    )}

                                    {/* Production Admin Navigation */}
                                    {(user.role === "production_admin" || user.role === "admin") && (
                                        <NavLink
                                            href={route("production.orders.index")}
                                            active={window.location.pathname.includes("/production")}
                                            className={`nav-link flex items-center gap-0.5 lg:gap-1 xl:gap-2 ${
                                                window.location.pathname.includes("/production") ? "active" : ""
                                            }`}
                                        >
                                            <svg className="nav-icon icon-hover" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z"/>
                                            </svg>
                                            <span className="nav-text">Produção</span>
                                        </NavLink>
                                    )}

                                    {/* Manager Dashboard */}
                                    {(user.role === "manager" || user.role === "admin") && (
                                        <NavLink
                                            href={route("manager.dashboard")}
                                            active={window.location.pathname.includes("/manager")}
                                            className={`nav-link flex items-center gap-0.5 lg:gap-1 xl:gap-2 ${
                                                window.location.pathname.includes("/manager") ? "active" : ""
                                            }`}
                                        >
                                            <svg className="nav-icon icon-hover" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10z"/>
                                                <path d="M18 11h-4v2h4v-2zm0 4h-4v2h4v-2z"/>
                                            </svg>
                                            <span className="nav-text">Gerência</span>
                                        </NavLink>
                                    )}

                                    {/* Admin Dropdown Menu */}
                                    {(user.role === "admin" || user.role === "financeiro") && (
                                        <DropdownMenu
                                            trigger={
                                                <>
                                                    <svg className="nav-icon icon-hover" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4Z"/>
                                                        <path d="M10 11l2 2 4-4" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                    <span className="nav-text">Admin</span>
                                                    <svg className="nav-icon ml-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </>
                                            }
                                        >
                                            <Link
                                                href={route("admin.dashboard")}
                                                className="dropdown-link flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg"
                                            >
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M13 9V3h8v6h-8ZM3 13V3h8v10H3Zm10 8V11h8v10h-8ZM3 21v-6h8v6H3Z" />
                                                </svg>
                                                Dashboard Admin
                                            </Link>
                                            <Link
                                                href={route("admin.users.index")}
                                                className="dropdown-link flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg"
                                            >
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7Z"/>
                                                </svg>
                                                Usuários
                                            </Link>
                                            <Link
                                                href={route("admin.sales.index")}
                                                className="dropdown-link flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg"
                                            >
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4Z"/>
                                                </svg>
                                                Painel Financeiro
                                            </Link>
                                            <Link
                                                href="/admin/embroidery"
                                                className="dropdown-link flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg"
                                            >
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M9.5 16a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13ZM9.5 4a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Z"/>
                                                    <path d="M6.5 9.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0Z"/>
                                                </svg>
                                                Bordados
                                            </Link>
                                            {user.role === 'admin' && (
                                                <Link
                                                    href={route("admin.permissions.index")}
                                                    className="dropdown-link flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg"
                                                >
                                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4Z"/>
                                                    </svg>
                                                    Permissões
                                                </Link>
                                            )}
                                            {['admin', 'manager'].includes(user.role) && (
                                                <Link
                                                    href={route("admin.reports.index")}
                                                    className="dropdown-link flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg"
                                                >
                                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M7 18h2V6H7v12Zm4 0h2v-6h-2v6Zm4 0h2V2h-2v16Z"/>
                                                    </svg>
                                                    Relatórios
                                                </Link>
                                            )}
                                        </DropdownMenu>
                                    )}

                                    {/* Materials Management Dropdown */}
                                    {canViewMaterials() && (
                                        <DropdownMenu
                                            trigger={
                                                <>
                                                    <svg className="nav-icon icon-hover" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M12 2 2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5Z"/>
                                                        <path d="m8 10 4 4 4-4" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                    <span className="nav-text">Materiais</span>
                                                    <svg className="nav-icon ml-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </>
                                            }
                                        >
                                            <Link
                                                href={route("admin.materials.index")}
                                                className="dropdown-link flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg"
                                            >
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 2 2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5Z"/>
                                                </svg>
                                                Gerenciar Materiais
                                            </Link>
                                            {canViewSuppliers() && (
                                                <Link
                                                    href={route("admin.suppliers.index")}
                                                    className="dropdown-link flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg"
                                                >
                                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10z"/>
                                                    </svg>
                                                    Fornecedores
                                                </Link>
                                            )}
                                            {canViewInventory() && (
                                                <Link
                                                    href={route("admin.inventory.index")}
                                                    className="dropdown-link flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg"
                                                >
                                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z"/>
                                                        <path d="M14 2v6h6M16 13H8m8 4H8m2-8H8" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                    Transações de Estoque
                                                </Link>
                                            )}
                                        </DropdownMenu>
                                    )}
                                </div>
                            </div>

                            <div className="hidden md:flex md:items-center md:gap-2 lg:gap-3">
                                <NotificationBell />
                                <div className="relative">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="user-dropdown"
                                                >
                                                    <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
                                                        <div className="user-avatar w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-[10px] sm:text-xs">
                                                            {user.name
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </div>
                                                        <span className="hidden lg:block font-medium text-xs lg:text-sm xl:text-base text-gray-700">
                                                            {user.name}
                                                        </span>
                                                        <svg
                                                            className="-me-0.5 ms-1 lg:ms-2 h-3 w-3 lg:h-4 lg:w-4 transition-transform duration-300 group-hover:rotate-180"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </div>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content className="dropdown-content w-64">
                                            <div className="dropdown-header">
                                                <div className="flex items-center gap-3">
                                                    <div className="user-avatar w-12 h-12 text-sm">
                                                        {user.name
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-800">
                                                            {user.name}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            {user.email}
                                                        </div>
                                                        <div className="text-xs text-purple-600 font-medium mt-1">
                                                            ✨{" "}
                                                            {user.role ===
                                                            "vendedora"
                                                                ? "Vendedora BBKits"
                                                                : user.role ===
                                                                  "admin"
                                                                ? "Administrador"
                                                                : user.role === "finance_admin"
                                                                ? "Financeiro Admin"
                                                                : user.role === "production_admin"
                                                                ? "Produção Admin"
                                                                : "Financeiro"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <Dropdown.Link
                                                href={route("profile.edit")}
                                                className="dropdown-link flex items-center gap-3"
                                            >
                                                <svg
                                                    className="w-4 h-4 icon-hover"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                    />
                                                </svg>
                                                👤 Meu Perfil
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route("logout")}
                                                method="post"
                                                as="button"
                                                className="dropdown-link flex items-center gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 w-full text-left"
                                            >
                                                <svg
                                                    className="w-4 h-4 icon-hover"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                                    />
                                                </svg>
                                                🚪 Sair
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            </div>

                            <div className="-me-2 flex items-center md:hidden">
                                <button
                                    onClick={() =>
                                        setShowingNavigationDropdown(
                                            !showingNavigationDropdown
                                        )
                                    }
                                    className="mobile-toggle"
                                >
                                    <div className="relative w-5 h-5 sm:w-6 sm:h-6">
                                        <div
                                            className={`absolute inset-0 transition-all duration-300 ${
                                                showingNavigationDropdown
                                                    ? "opacity-0 rotate-45"
                                                    : "opacity-100 rotate-0"
                                            }`}
                                        >
                                            <svg
                                                className="h-5 w-5 sm:h-6 sm:w-6"
                                                stroke="currentColor"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M4 6h16M4 12h16M4 18h16"
                                                />
                                            </svg>
                                        </div>
                                        <div
                                            className={`absolute inset-0 transition-all duration-300 ${
                                                showingNavigationDropdown
                                                    ? "opacity-100 rotate-0"
                                                    : "opacity-0 -rotate-45"
                                            }`}
                                        >
                                            <svg
                                                className="h-5 w-5 sm:h-6 sm:w-6"
                                                stroke="currentColor"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div
                        className={`md:hidden mobile-menu transition-all duration-500 ease-in-out overflow-hidden ${
                            showingNavigationDropdown
                                ? "max-h-screen opacity-100"
                                : "max-h-0 opacity-0"
                        }`}
                    >
                        <div className="space-y-2 pb-4 pt-4 px-4">
                            <ResponsiveNavLink
                                href={route("dashboard")}
                                active={window.location.pathname === "/dashboard"}
                                className="mobile-nav-item flex items-center gap-3 px-4 py-3 rounded-xl"
                            >
                                <svg
                                    className="w-4 h-4 icon-hover"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                                    />
                                </svg>
                                Dashboard
                            </ResponsiveNavLink>

                            <ResponsiveNavLink
                                href={route("sales.index")}
                                active={window.location.pathname.includes("/sales")}
                                className="mobile-nav-item flex items-center gap-3 px-4 py-3 rounded-xl"
                            >
                                <svg
                                    className="w-4 h-4 icon-hover"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                    />
                                </svg>
                                Minhas Vendas
                            </ResponsiveNavLink>

                            {/* Finance Admin Mobile Navigation */}
                            {(user.role === "finance_admin" || user.role === "financeiro" || user.role === "admin") && (
                                <ResponsiveNavLink
                                    href={route("finance.orders.index")}
                                    active={window.location.pathname.includes("/finance")}
                                    className="mobile-nav-item flex items-center gap-3 px-4 py-3 rounded-xl"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                    Financeiro
                                </ResponsiveNavLink>
                            )}

                            {/* Production Admin Mobile Navigation */}
                            {(user.role === "production_admin" || user.role === "admin") && (
                                <ResponsiveNavLink
                                    href={route("production.orders.index")}
                                    active={window.location.pathname.includes("/production")}
                                    className="mobile-nav-item flex items-center gap-3 px-4 py-3 rounded-xl"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                                    </svg>
                                    Produção
                                </ResponsiveNavLink>
                            )}

                            {(user.role === "admin" ||
                                user.role === "financeiro") && (
                                <>
                                    <ResponsiveNavLink
                                        href={route("admin.dashboard")}
                                        active={window.location.pathname === "/admin/dashboard"}
                                        className="mobile-nav-item flex items-center gap-3 px-4 py-3 rounded-xl"
                                    >
                                        <svg
                                            className="w-4 h-4 icon-hover"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                            />
                                        </svg>
                                        Admin Dashboard
                                    </ResponsiveNavLink>

                            {/* Manager Dashboard Mobile */}
                            {(user.role === "manager" || user.role === "admin") && (
                                <ResponsiveNavLink
                                    href={route("manager.dashboard")}
                                    active={window.location.pathname.includes("/manager")}
                                    className="mobile-nav-item flex items-center gap-3 px-4 py-3 rounded-xl"
                                >
                                    <svg
                                        className="w-4 h-4 icon-hover"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                        />
                                    </svg>
                                    Dashboard Gerencial
                                </ResponsiveNavLink>
                            )}

                                    <ResponsiveNavLink
                                        href={route("admin.users.index")}
                                        active={window.location.pathname === "/admin/users"}
                                        className="mobile-nav-item flex items-center gap-3 px-4 py-3 rounded-xl"
                                    >
                                        <svg
                                            className="w-4 h-4 icon-hover"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M19 7.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                                            />
                                        </svg>
                                        Gerenciar Usuários
                                    </ResponsiveNavLink>

                                    <ResponsiveNavLink
                                        href={route("admin.sales.index")}
                                        active={window.location.pathname.includes("/admin/sales")}
                                        className="mobile-nav-item flex items-center gap-3 px-4 py-3 rounded-xl"
                                    >
                                        <svg
                                            className="w-4 h-4 icon-hover"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                            />
                                        </svg>
                                        Painel Financeiro
                                    </ResponsiveNavLink>

                                    <ResponsiveNavLink
                                        href="/admin/embroidery"
                                        active={window.location.pathname.includes('/admin/embroidery')}
                                        className="mobile-nav-item flex items-center gap-3 px-4 py-3 rounded-xl"
                                    >
                                        <svg
                                            className="w-4 h-4 icon-hover"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                                            />
                                        </svg>
                                        Gerenciar Bordados
                                    </ResponsiveNavLink>

                                    {/* Materials Management Mobile Navigation */}
                                    {canViewMaterials() && (
                                        <ResponsiveNavLink
                                            href={route("admin.materials.index")}
                                            active={window.location.pathname.includes('/admin/materials')}
                                            className="mobile-nav-item flex items-center gap-3 px-4 py-3 rounded-xl"
                                        >
                                            <svg
                                                className="w-4 h-4 icon-hover"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                                />
                                            </svg>
                                            Gerenciar Materiais
                                        </ResponsiveNavLink>
                                    )}

                                    {canViewSuppliers() && (
                                        <ResponsiveNavLink
                                            href={route("admin.suppliers.index")}
                                            active={window.location.pathname.includes('/admin/suppliers')}
                                            className="mobile-nav-item flex items-center gap-3 px-4 py-3 rounded-xl"
                                        >
                                            <svg
                                                className="w-4 h-4 icon-hover"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                                />
                                            </svg>
                                            Gerenciar Fornecedores
                                        </ResponsiveNavLink>
                                    )}

                                    {canViewInventory() && (
                                        <ResponsiveNavLink
                                            href={route("admin.inventory.index")}
                                            active={window.location.pathname.includes('/admin/inventory')}
                                            className="mobile-nav-item flex items-center gap-3 px-4 py-3 rounded-xl"
                                        >
                                            <svg
                                                className="w-4 h-4 icon-hover"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                                                />
                                            </svg>
                                            Transações de Estoque
                                        </ResponsiveNavLink>
                                    )}

                                    {/* Permission Management Mobile Navigation - Admin Only */}
                                    {user.role === 'admin' && (
                                        <ResponsiveNavLink
                                            href={route("admin.permissions.index")}
                                            active={window.location.pathname.includes('/admin/permissions')}
                                            className="mobile-nav-item flex items-center gap-3 px-4 py-3 rounded-xl"
                                        >
                                            <svg
                                                className="w-4 h-4 icon-hover"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                                />
                                            </svg>
                                            Gerenciar Permissões
                                        </ResponsiveNavLink>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="border-t border-pink-200 mx-4 py-4">
                            <div className="px-4 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="user-avatar w-12 h-12 text-sm">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="text-base font-bold text-gray-800">
                                            {user.name}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {user.email}
                                        </div>
                                        <div className="text-xs text-purple-600 font-medium mt-1">
                                            ✨{" "}
                                            {user.role === "vendedora"
                                                ? "Vendedora BBKits"
                                                : user.role === "admin"
                                                ? "Administrador"
                                                : user.role === "finance_admin"
                                                ? "Financeiro Admin"
                                                : user.role === "production_admin"
                                                ? "Produção Admin"
                                                : "Financeiro"}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <ResponsiveNavLink
                                    href={route("profile.edit")}
                                    className="mobile-nav-item flex items-center gap-3 px-4 py-3 rounded-xl"
                                >
                                    <svg
                                        className="w-4 h-4 icon-hover"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                    👤 Meu Perfil
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    method="post"
                                    href={route("logout")}
                                    as="button"
                                    className="mobile-nav-item flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 w-full text-left"
                                >
                                    <svg
                                        className="w-4 h-4 icon-hover"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                        />
                                    </svg>
                                    🚪 Sair
                                </ResponsiveNavLink>
                            </div>
                        </div>
                    </div>
                </nav>

                {header && (
                    <header className="header-section mt-12 sm:mt-14 md:mt-15 lg:mt-16 border-b border-pink-100/50 relative z-10">
                        <div className="mx-auto max-w-7xl px-4 py-4 sm:py-5 md:py-6 sm:px-6 lg:px-8 relative z-10">
                            <div className="animate-fadeInUp">{header}</div>
                        </div>
                    </header>
                )}

                <main className="pt-12 sm:pt-14 md:pt-15 lg:pt-16 min-h-screen main-content">
                    <div className="animate-fadeInUp delay-200 relative z-10">
                        {children}
                    </div>
                </main>
            </div>
        </>
    );
}