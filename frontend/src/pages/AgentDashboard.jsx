import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Truck } from 'lucide-react';

const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };

const AgentDashboard = () => {
    const [pendingRequests, setPendingRequests] = useState([]);
    const [myRequests, setMyRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            };

            const pendingRes = await fetch('http://localhost:5000/api/agent/requests/pending', { headers });
            if (pendingRes.ok) setPendingRequests(await pendingRes.json());

            const myRes = await fetch('http://localhost:5000/api/agent/requests/my', { headers });
            if (myRes.ok) setMyRequests(await myRes.json());
        } catch (error) {
            console.error('Fetch agent data error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/agent/requests/${id}/accept`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                alert('Accepted assistance request!');
                fetchData();
            } else {
                const data = await res.json();
                alert(data.message);
            }
        } catch (err) { console.error(err); }
    };

    const handleComplete = async (id, orderId) => {
        try {
            const token = localStorage.getItem('token');
            // Complete the request
            await fetch(`http://localhost:5000/api/agent/requests/${id}/complete`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // Update the order status to shipped/delivered
            await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ status: 'delivered' })
            });

            fetchData();
            alert('Marked as delivered and completed!');
        } catch (err) { console.error(err); }
    };

    return (
        <motion.div className="max-w-7xl mx-auto space-y-8" variants={containerVariants} initial="hidden" animate="show">
            <div>
                <h2 className="text-3xl font-bold text-[#1e293b] tracking-tight">Agent Dashboard</h2>
                <p className="text-gray-500 mt-1">Assist local tribal artisans with packaging and delivery logistics.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pending Requests */}
                <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-[#1e293b] mb-6 flex items-center gap-2">
                        <CheckSquare className="text-accent-terracotta" size={24} /> Available Tasks
                    </h3>
                    <div className="space-y-4">
                        {pendingRequests.length === 0 ? <p className="text-gray-500">No pending requests right now.</p> : null}
                        {pendingRequests.map(req => (
                            <div key={req._id} className="p-4 border border-gray-100 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-gray-900">{req.message}</h4>
                                    <span className="text-xs bg-yellow-100 text-yellow-700 font-bold px-2 py-1 rounded-full">{req.status}</span>
                                </div>
                                <p className="text-sm text-gray-600 mb-1"><strong>Seller:</strong> {req.sellerId?.username} ({req.sellerId?.phone})</p>
                                <p className="text-sm text-gray-600 mb-3"><strong>Products:</strong> {req.orderId?.products?.map(p => p.productId?.name).join(', ')}</p>
                                <button onClick={() => handleAccept(req._id)} className="w-full py-2 bg-accent-terracotta text-white rounded-lg text-sm font-medium hover:bg-opacity-90">
                                    Accept Request
                                </button>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* My Active Tasks */}
                <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-[#1e293b] mb-6 flex items-center gap-2">
                        <Truck className="text-blue-500" size={24} /> My Deliveries
                    </h3>
                    <div className="space-y-4">
                        {myRequests.length === 0 ? <p className="text-gray-500">You haven't accepted any tasks yet.</p> : null}
                        {myRequests.map(req => (
                            <div key={req._id} className="p-4 border border-blue-100 rounded-xl bg-blue-50/30">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-gray-900">Order #{req.orderId?._id.slice(-6).toUpperCase()}</h4>
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${req.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{req.status}</span>
                                </div>
                                <p className="text-sm text-gray-600 mb-1"><strong>Pickup:</strong> {req.sellerId?.username} - {req.sellerId?.phone}</p>
                                <p className="text-sm text-gray-600 mb-3"><strong>Task:</strong> {req.message}</p>
                                
                                {req.status !== 'completed' && (
                                    <button onClick={() => handleComplete(req._id, req.orderId._id)} className="w-full py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 mt-2">
                                        Mark Delivered
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default AgentDashboard;
