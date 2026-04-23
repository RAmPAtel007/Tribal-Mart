import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home,
    ShoppingBag,
    Heart,
    User,
    Store,
    LogOut,
    Menu,
    X,
    Bell,
    Search
} from 'lucide-react';

const CustomerDashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isUpgrading, setIsUpgrading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { path: '/dashboard', icon: Home, label: 'Discover' },
        { path: '/dashboard/orders', icon: ShoppingBag, label: 'My Orders' },
        { path: '/dashboard/saved', icon: Heart, label: 'Saved Items' },
        { path: '/dashboard/profile', icon: User, label: 'Profile' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/auth');
    };

    const handleApplyRole = async (requestedRole) => {
        setIsUpgrading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) return navigate('/auth');

            const res = await fetch('http://localhost:5000/api/auth/apply-role', {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ requestedRole, govtIdUrl: "mock-id.jpg", category: "Handicrafts" })
            });
            const data = await res.json();

            if (res.ok) {
                // Update token
                localStorage.setItem('token', data.token);
                alert(`Successfully applied for ${requestedRole} role! An admin will review your request.`);
            } else {
                alert(data.message || 'Failed to apply');
            }
        } catch (error) {
            console.error('Apply role error:', error);
            alert('Error connecting to server');
        } finally {
            setIsUpgrading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            {/* Mobile Sidebar Overlay */}
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

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    width: isSidebarOpen ? '280px' : '0px',
                    x: isSidebarOpen ? 0 : -280
                }}
                className={`fixed lg:static inset-y-0 left-0 z-50 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${isSidebarOpen ? '' : 'lg:w-[80px] lg:translate-x-0 overflow-hidden'}`}
            >
                <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100 shrink-0">
                    <motion.div
                        className="font-bold text-2xl tracking-tight text-primary whitespace-nowrap overflow-hidden"
                        animate={{ opacity: isSidebarOpen ? 1 : 0 }}
                    >
                        Market<span className="text-accent-terracotta">place</span>
                    </motion.div>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden text-gray-400 hover:text-primary"
                    >
                        <X size={24} />
                    </button>
                    {/* Desktop Collapse Button */}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="hidden lg:block text-gray-400 hover:text-primary absolute right-[-16px] top-6 bg-white rounded-full p-1 border border-gray-200 shadow-sm"
                    >
                        <Menu size={16} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
                    <div className="text-xs uppercase text-gray-400 font-semibold mb-2 px-2 tracking-wider">
                        {isSidebarOpen ? 'Menu' : '•••'}
                    </div>
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path || (location.pathname === '/dashboard' && item.path === '/dashboard');
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                title={item.label}
                                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative ${isActive
                                        ? 'bg-accent-terracotta/10 text-accent-terracotta font-medium'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-primary'
                                    }`}
                            >
                                <Icon size={20} className={isActive ? 'text-accent-terracotta' : 'text-gray-400 group-hover:text-primary transition-colors'} />
                                <span className={`whitespace-nowrap transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>
                                    {item.label}
                                </span>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTabCustomer"
                                        className="absolute left-0 w-1 h-8 bg-accent-terracotta rounded-r-full"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </Link>
                        )
                    })}
                </div>

                <div className="p-4 border-t border-gray-100 flex flex-col gap-2 shrink-0">
                    <div className={`p-4 bg-accent-ochre/10 rounded-xl mb-2 transition-all duration-300 overflow-hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 h-0 p-0 m-0'}`}>
                        <h4 className="text-sm font-bold text-accent-ochre mb-1">Make an Impact</h4>
                        <p className="text-xs text-gray-600 mb-3">Join our community as an Artisan or Support Agent.</p>
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => handleApplyRole('seller')}
                                disabled={isUpgrading}
                                className="w-full py-2 bg-accent-ochre text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2"
                            >
                                {isUpgrading ? '...' : <><Store size={16} /> Become Seller</>}
                            </button>
                            <button
                                onClick={() => handleApplyRole('agent')}
                                disabled={isUpgrading}
                                className="w-full py-2 bg-[#1e293b] text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2"
                            >
                                {isUpgrading ? '...' : <><User size={16} /> Become Agent</>}
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        title="Logout"
                        className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 text-red-500 hover:bg-red-50"
                    >
                        <LogOut size={20} />
                        <span className={`whitespace-nowrap transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>
                            Log out
                        </span>
                    </button>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Top Header */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-30 shrink-0">
                    <div className="flex items-center gap-4">
                        {!isSidebarOpen && (
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="text-gray-500 hover:text-primary transition-colors"
                            >
                                <Menu size={24} />
                            </button>
                        )}
                        <h1 className="text-2xl font-semibold text-primary hidden sm:block tracking-tight">
                            {menuItems.find(i => i.path === location.pathname)?.label || 'Discover'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search products, artisans..."
                                className="pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-accent-terracotta/50 transition-all text-sm"
                            />
                        </div>
                        <button className="relative p-2 text-gray-500 hover:text-primary transition-colors rounded-full hover:bg-gray-100">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-terracotta rounded-full border-2 border-white"></span>
                        </button>
                        <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm flex items-center justify-center text-gray-500 font-bold overflow-hidden cursor-pointer">
                            <User size={20} />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-[#FAF9F6]">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default CustomerDashboardLayout;
