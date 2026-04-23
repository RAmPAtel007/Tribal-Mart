import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home,
    Truck,
    CheckSquare,
    LogOut,
    Menu,
    X,
    User
} from 'lucide-react';

const AgentDashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { path: '/agent-dashboard', icon: Home, label: 'Overview' },
        { path: '/agent-dashboard/requests', icon: CheckSquare, label: 'Available Requests' },
        { path: '/agent-dashboard/deliveries', icon: Truck, label: 'My Deliveries' },
        { path: '/agent-dashboard/profile', icon: User, label: 'Profile' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/auth');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            <AnimatePresence>
                {!isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/20 z-40 lg:hidden"
                        onClick={() => setIsSidebarOpen(true)}
                    />
                )}
            </AnimatePresence>

            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? '280px' : '0px', x: isSidebarOpen ? 0 : -280 }}
                className={`fixed lg:static inset-y-0 left-0 z-50 bg-[#1e293b] text-white border-r border-[#334155] flex flex-col transition-all duration-300 ${isSidebarOpen ? '' : 'lg:w-[80px] lg:translate-x-0 overflow-hidden'}`}
            >
                <div className="h-20 flex items-center justify-between px-6 border-b border-[#334155] shrink-0">
                    <motion.div className="font-bold text-2xl tracking-tight text-white whitespace-nowrap overflow-hidden" animate={{ opacity: isSidebarOpen ? 1 : 0 }}>
                        Agent<span className="text-accent-terracotta">Support</span>
                    </motion.div>
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white"><X size={24} /></button>
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="hidden lg:block text-gray-400 hover:text-white absolute right-[-16px] top-6 bg-[#1e293b] rounded-full p-1 border border-[#334155] shadow-sm"><Menu size={16} /></button>
                </div>
                <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path || (location.pathname === '/agent-dashboard' && item.path === '/agent-dashboard');
                        return (
                            <Link key={item.path} to={item.path} className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative ${isActive ? 'bg-[#334155] text-accent-terracotta font-medium' : 'text-gray-400 hover:bg-[#334155] hover:text-white'}`}>
                                <Icon size={20} className={isActive ? 'text-accent-terracotta' : 'text-gray-400 group-hover:text-white transition-colors'} />
                                <span className={`whitespace-nowrap transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>{item.label}</span>
                                {isActive && <motion.div layoutId="activeTabAgent" className="absolute left-0 w-1 h-8 bg-accent-terracotta rounded-r-full" initial={false} transition={{ type: "spring", stiffness: 300, damping: 30 }} />}
                            </Link>
                        )
                    })}
                </div>
                <div className="p-4 border-t border-[#334155] flex flex-col gap-2 shrink-0">
                    <button onClick={handleLogout} className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 text-red-400 hover:bg-red-400/10"><LogOut size={20} />
                        <span className={`whitespace-nowrap transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>Log out</span>
                    </button>
                </div>
            </motion.aside>

            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-30 shrink-0">
                    <div className="flex items-center gap-4">
                        {!isSidebarOpen && <button onClick={() => setIsSidebarOpen(true)} className="text-gray-500 hover:text-primary transition-colors"><Menu size={24} /></button>}
                        <h1 className="text-2xl font-semibold text-primary hidden sm:block tracking-tight">{menuItems.find(i => i.path === location.pathname)?.label || 'Overview'}</h1>
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-[#FAF9F6]">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AgentDashboardLayout;
