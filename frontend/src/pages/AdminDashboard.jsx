import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, CheckCircle, PieChart, IndianRupee } from 'lucide-react';

const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [pendingProducts, setPendingProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };

            const statsRes = await fetch('http://localhost:5000/api/admin/stats', { headers });
            if (statsRes.ok) setStats(await statsRes.json());

            const usersRes = await fetch('http://localhost:5000/api/admin/users/pending', { headers });
            if (usersRes.ok) setPendingUsers(await usersRes.json());

            const prodRes = await fetch('http://localhost:5000/api/admin/products/pending', { headers });
            if (prodRes.ok) setPendingProducts(await prodRes.json());

        } catch (error) {
            console.error('Fetch admin data error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApproveUser = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/admin/users/${id}/approve`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                alert('User Approved!');
                fetchData();
            }
        } catch (err) { console.error(err); }
    };

    const handleApproveProduct = async (id, status) => {
         try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/products/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                alert(`Product ${status}!`);
                fetchData();
            }
        } catch (err) { console.error(err); }
    };

    return (
        <motion.div className="max-w-screen-xl mx-auto space-y-8" variants={containerVariants} initial="hidden" animate="show">
            <div>
                <h2 className="text-3xl font-bold text-[#691e0e] tracking-tight">Admin Control Panel</h2>
                <p className="text-gray-500 mt-1">Manage users, approve listings, and view platform health.</p>
            </div>

            {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Total Verified Sellers</p>
                                <h3 className="text-2xl font-bold text-[#8c2f1b]">{stats.users.totalSellers}</h3>
                            </div>
                            <div className="p-3 rounded-2xl bg-[#ffb4a5]/20 text-[#8c2f1b]"><Users size={24} /></div>
                        </div>
                    </motion.div>
                    <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Escrow Revenue</p>
                                <h3 className="text-2xl font-bold text-[#8c2f1b]">₹{stats.revenue}</h3>
                            </div>
                            <div className="p-3 rounded-2xl bg-[#ffb4a5]/20 text-[#8c2f1b]"><IndianRupee size={24} /></div>
                        </div>
                    </motion.div>
                    <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Active Products</p>
                                <h3 className="text-2xl font-bold text-[#8c2f1b]">{stats.products.totalProducts}</h3>
                            </div>
                            <div className="p-3 rounded-2xl bg-[#ffb4a5]/20 text-[#8c2f1b]"><CheckCircle size={24} /></div>
                        </div>
                    </motion.div>
                    <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Total Orders</p>
                                <h3 className="text-2xl font-bold text-[#8c2f1b]">{stats.orders.totalOrders}</h3>
                            </div>
                            <div className="p-3 rounded-2xl bg-[#ffb4a5]/20 text-[#8c2f1b]"><PieChart size={24} /></div>
                        </div>
                    </motion.div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* User Approvals */}
                <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-[#691e0e] mb-6">Pending Role Approvals</h3>
                    <div className="space-y-4">
                        {pendingUsers.length === 0 ? <p className="text-gray-500">No users awaiting verification.</p> : null}
                        {pendingUsers.map(user => (
                            <div key={user._id} className="p-4 border border-gray-100 rounded-xl bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold text-gray-900">{user.username}</h4>
                                        <p className="text-sm text-gray-500">Wants to become: <span className="uppercase font-bold text-accent-ochre">{user.role}</span></p>
                                        <p className="text-xs text-gray-400 mt-1">ID: {user.verificationDetails?.govtIdUrl || 'Not provided'}</p>
                                    </div>
                                    <button onClick={() => handleApproveUser(user._id)} className="px-4 py-2 bg-[#8c2f1b] text-white text-sm font-medium rounded-lg hover:bg-[#691e0e]">
                                        Approve
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Product Approvals */}
                <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-[#691e0e] mb-6">Pending Product Listings</h3>
                    <div className="space-y-4">
                        {pendingProducts.length === 0 ? <p className="text-gray-500">No products awaiting approval.</p> : null}
                        {pendingProducts.map(prod => (
                            <div key={prod._id} className="p-4 border border-gray-100 rounded-xl bg-gray-50">
                                <h4 className="font-bold text-gray-900">{prod.name}</h4>
                                <p className="text-sm text-gray-500">By {prod.sellerId?.username} • ₹{prod.price}</p>
                                <p className="text-xs text-gray-400 mt-1 mb-3 line-clamp-2">{prod.description}</p>
                                <div className="flex gap-2">
                                    <button onClick={() => handleApproveProduct(prod._id, 'active')} className="flex-1 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600">
                                        Approve
                                    </button>
                                    <button onClick={() => handleApproveProduct(prod._id, 'rejected')} className="flex-1 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600">
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default AdminDashboard;
