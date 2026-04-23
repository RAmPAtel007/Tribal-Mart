import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IndianRupee, ShoppingCart, Package, Plus, X, Bell, Clock, Edit2, Trash2 } from 'lucide-react';
import { io } from 'socket.io-client';

const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };

const SellerDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [analytics, setAnalytics] = useState({ escrowTotal: 0, releasedTotal: 0, totalOrdersCount: 0 });
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    
    const [loading, setLoading] = useState(true);
    const [showProductForm, setShowProductForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    
    const [formData, setFormData] = useState({
        name: '', description: '', price: '', stock: '', category: 'Handicrafts'
    });
    const [images, setImages] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        let userId;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            userId = payload.user.id;
        } catch(e) { console.error("Error decoding token"); }

        const socket = io('http://localhost:5000');
        socket.on('connect', () => {
            if (userId) socket.emit('join', userId);
        });

        socket.on('notification', (newNotif) => {
            setNotifications(prev => [newNotif, ...prev]);
        });

        fetchData();

        return () => socket.disconnect();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };

            const [prodRes, orderRes, statRes, notifRes] = await Promise.all([
                fetch('http://localhost:5000/api/products/seller?limit=100', { headers }),
                fetch('http://localhost:5000/api/orders/seller', { headers }),
                fetch('http://localhost:5000/api/orders/seller/analytics', { headers }),
                fetch('http://localhost:5000/api/notifications', { headers })
            ]);

            if (prodRes.ok) {
                const pd = await prodRes.json();
                setProducts(pd.data || []);
            }
            if (orderRes.ok) setOrders(await orderRes.json());
            if (statRes.ok) setAnalytics(await statRes.json());
            if (notifRes.ok) setNotifications(await notifRes.json());

        } catch (error) {
            console.error('Fetch seller data error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenForm = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name, description: product.description, price: product.price, stock: product.stock, category: product.category
            });
        } else {
            setEditingProduct(null);
            setFormData({ name: '', description: '', price: '', stock: '', category: 'Handicrafts' });
        }
        setImages(null);
        setShowProductForm(true);
    };

    const handleSubmitProduct = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const formPayload = new FormData();
            formPayload.append('name', formData.name);
            formPayload.append('description', formData.description);
            formPayload.append('price', formData.price);
            formPayload.append('stock', formData.stock);
            formPayload.append('category', formData.category);
            formPayload.append('pickupLocation', JSON.stringify({ city: 'Local' }));

            if (images) {
                for (let i = 0; i < images.length; i++) {
                    formPayload.append('images', images[i]);
                }
            }

            const url = editingProduct 
                ? `http://localhost:5000/api/products/${editingProduct._id}`
                : 'http://localhost:5000/api/products';
            
            const method = editingProduct ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Authorization': `Bearer ${token}` },
                body: formPayload
            });

            if (res.ok) {
                setShowProductForm(false);
                fetchData();
            } else {
                const data = await res.json();
                alert(`Error: ${data.message || data.details?.[0]}`);
            }
        } catch (error) {
            console.error(error);
            alert('Failed to save product');
        }
    };

    const handleDeleteProduct = async (id) => {
         if(!window.confirm("Are you sure you want to delete this product? (Soft Delete)")) return;
         try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/products/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if(res.ok) fetchData();
         } catch(e) {
             console.error(e);
         }
    };

    const handleUpdateOrder = async (orderId, newStatus) => {
         try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                fetchData();
            } else {
                const data = await res.json();
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const markNotificationRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchData();
        } catch(e) {}
    }

    const unreadCount = notifications.filter(n => !n.read).length;

    const stats = [
        { title: "Escrow Pending", value: `₹${analytics.escrowTotal}`, icon: Clock, color: "text-orange-600", bgColor: "bg-orange-100" },
        { title: "Earnings Released", value: `₹${analytics.releasedTotal}`, icon: IndianRupee, color: "text-green-600", bgColor: "bg-green-100" },
        { title: "Total Orders", value: analytics.totalOrdersCount, icon: ShoppingCart, color: "text-blue-600", bgColor: "bg-blue-100" },
        { title: "Active Listings", value: products.length, icon: Package, color: "text-purple-600", bgColor: "bg-purple-100" }
    ];

    if (loading) return <div className="p-8 text-center font-bold text-gray-500">Loading Dashboard...</div>;

    return (
        <motion.div className="max-w-7xl mx-auto space-y-8 relative" variants={containerVariants} initial="hidden" animate="show">
            {/* Product Modal Overlay */}
            {showProductForm && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-md relative shadow-2xl max-h-[90vh] overflow-y-auto">
                        <button onClick={() => setShowProductForm(false)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors">
                            <X size={24} />
                        </button>
                        <h3 className="text-2xl font-bold text-primary mb-6">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                        <form onSubmit={handleSubmitProduct} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Upload Images (Max 5)</label>
                                <input type="file" multiple accept="image/*" onChange={(e) => setImages(e.target.files)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-accent-terracotta file:text-white hover:file:bg-opacity-90 transition-all"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Product Name</label>
                                <input required type="text" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent-terracotta outline-none transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Description</label>
                                <textarea required rows="3" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent-terracotta outline-none transition-all" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Price (₹)</label>
                                    <input required type="number" min="0" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent-terracotta outline-none transition-all" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Stock Details</label>
                                    <input required type="number" min="0" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent-terracotta outline-none transition-all" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                                </div>
                            </div>
                            <button type="submit" className="w-full py-4 mt-4 bg-accent-terracotta text-white rounded-xl font-bold shadow-lg hover:-translate-y-0.5 transition-all">
                                {editingProduct ? 'Update Changes' : 'Submit for Review'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-primary tracking-tight">Seller Analytics</h2>
                    <p className="text-gray-500 mt-1">Manage listings and view aggregation-based earnings metrics.</p>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="relative">
                        <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-3 bg-white text-gray-600 hover:text-accent-terracotta shadow-sm border border-gray-100 rounded-full transition-colors">
                            <Bell size={22} />
                            {unreadCount > 0 && <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>}
                        </button>
                        
                        <AnimatePresence>
                            {showNotifications && (
                                <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                                    <div className="p-4 border-b border-gray-50 font-bold flex justify-between items-center text-primary">
                                        Notifications
                                        <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-red-500"><X size={18}/></button>
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        {notifications.length === 0 ? <p className="p-6 text-center text-gray-400 text-sm">You are caught up!</p> : 
                                            notifications.map(n => (
                                                <div key={n._id} onClick={() => markNotificationRead(n._id)} className={`p-4 border-b border-gray-50 cursor-pointer transition-colors ${n.read ? 'opacity-60 bg-white hover:bg-gray-50' : 'bg-blue-50/40 hover:bg-blue-50/60'}`}>
                                                    <p className={`text-sm ${!n.read && 'font-medium text-gray-900'}`}>{n.message}</p>
                                                    <span className="text-[10px] text-gray-400 mt-1.5 block">{new Date(n.createdAt).toLocaleString()}</span>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <button onClick={() => handleOpenForm()} className="px-5 py-3 bg-accent-terracotta text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                        <Plus size={18} /> New Listing
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div key={index} variants={itemVariants} className="bg-white rounded-3xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-50">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                                <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                            </div>
                            <div className={`p-3.5 rounded-2xl ${stat.bgColor} ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Orders */}
                <motion.div variants={itemVariants} className="xl:col-span-2 bg-white rounded-3xl p-8 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-50">
                    <h3 className="text-xl font-bold text-primary mb-6">Fulfillment Pipeline</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="text-gray-400 border-b border-gray-100">
                                    <th className="pb-4 font-medium uppercase tracking-wider text-xs">Customer</th>
                                    <th className="pb-4 font-medium uppercase tracking-wider text-xs">Product</th>
                                    <th className="pb-4 font-medium uppercase tracking-wider text-xs">Amount</th>
                                    <th className="pb-4 font-medium uppercase tracking-wider text-xs">Status</th>
                                    <th className="pb-4 font-medium uppercase tracking-wider text-xs text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order, ind) => (
                                    <tr key={ind} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 font-medium text-gray-900">{order.customerId?.username}</td>
                                        <td className="py-4 text-gray-700">{order.products[0]?.productId?.name}</td>
                                        <td className="py-4 font-bold text-gray-900">₹{order.totalAmount}</td>
                                        <td className="py-4">
                                            <div className="flex flex-col gap-1 items-start">
                                                <span className="px-2.5 py-1 text-[11px] font-bold uppercase rounded-full bg-blue-100 text-blue-700">{order.status}</span>
                                                <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full ${order.paymentStatus === 'escrow' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>{order.paymentStatus}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 text-right flex gap-2 justify-end items-center h-full">
                                            {order.status === 'placed' && (
                                                <button onClick={() => handleUpdateOrder(order._id, 'packaging')} className="text-xs bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200 font-bold transition-colors">Wrap Package</button>
                                            )}
                                            {order.status === 'packaging' && (
                                                 <button onClick={() => handleUpdateOrder(order._id, 'shipped')} className="text-xs bg-accent-forest text-white px-4 py-2 rounded-xl hover:bg-opacity-90 font-bold shadow-md hover:-translate-y-0.5 transition-all">Dispatch Item</button>
                                            )}
                                            {order.status === 'shipped' && (
                                                 <span className="text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg">En Route</span>
                                            )}
                                             {order.status === 'delivered' && (
                                                 <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">Closed</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {orders.length === 0 && (
                                    <tr><td colSpan="5" className="py-8 text-center text-gray-400">No active orders found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* My Products */}
                <motion.div variants={itemVariants} className="bg-white rounded-3xl p-8 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-50 self-start">
                    <h3 className="text-xl font-bold text-primary mb-6">Active Inventory</h3>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                        {products.map((p, i) => (
                            <div key={i} className="flex flex-col gap-3 p-4 border border-gray-100 rounded-2xl hover:shadow-lg transition-all bg-white group">
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-3">
                                        {p.images && p.images.length > 0 ? (
                                            <img src={p.images[0]} className="w-14 h-14 rounded-xl object-cover shadow-sm border border-gray-50" alt="product" />
                                        ) : (
                                            <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center"><Package size={20} className="text-gray-300" /></div>
                                        )}
                                        <div className="pt-1">
                                            <p className="font-bold text-sm text-gray-900 leading-tight">{p.name}</p>
                                            <p className="text-xs text-gray-500 font-medium mt-1">₹{p.price} • {p.stock} remain</p>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] px-2.5 py-1 rounded-full uppercase font-bold tracking-wider ${p.status === 'active' ? 'bg-green-100 text-green-700' : p.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {p.status}
                                    </span>
                                </div>
                                <div className="flex justify-end gap-2 border-t border-gray-50 pt-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleOpenForm(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"><Edit2 size={16}/></button>
                                    <button onClick={() => handleDeleteProduct(p._id)} className="p-2 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"><Trash2 size={16}/></button>
                                </div>
                            </div>
                        ))}
                        {products.length === 0 && (
                            <p className="text-center text-gray-400 py-8 text-sm">Your inventory is empty. Add a product to get started.</p>
                        )}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default SellerDashboard;
