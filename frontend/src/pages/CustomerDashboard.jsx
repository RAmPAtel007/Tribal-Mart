import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, Clock, Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const CustomerDashboard = () => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
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

            // Fetch active products
            const prodRes = await fetch('http://localhost:5000/api/products', { headers });
            const prodData = await prodRes.json();
            if (prodRes.ok) setProducts(prodData);

            // Fetch user orders if logged in
            if (token) {
                const orderRes = await fetch('http://localhost:5000/api/orders/customer', { headers });
                const orderData = await orderRes.json();
                if (orderRes.ok) setOrders(orderData);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBuyNow = async (product) => {
        const token = localStorage.getItem('token');
        if (!token) return alert('Please login first to buy');

        try {
             const res = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    sellerId: product.sellerId._id,
                    products: [{ productId: product._id, quantity: 1 }],
                    shippingAddress: { street: "123 Dev St", city: "Techville", state: "TS", zip: "10001" } // mock address
                })
            });

            if (res.ok) {
                alert(`Order placed successfully for ${product.name}! Payment is secure in Escrow.`);
                fetchData(); // refresh data
            } else {
                const data = await res.json();
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error("Buy error:", error);
            alert("Failed to place order");
        }
    };

    return (
        <motion.div
            className="max-w-7xl mx-auto space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            {/* Greeting */}
            <div className="bg-primary text-white rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-accent-forest/30 mix-blend-multiply z-10" />
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-accent-terracotta rounded-full blur-3xl opacity-20" />
                <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-accent-ochre rounded-full blur-3xl opacity-20" />

                <div className="relative z-20 max-w-2xl">
                    <h2 className="text-3xl sm:text-4xl font-light mb-2">Welcome back,</h2>
                    <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Shopper</h2>
                    <p className="text-gray-200 text-lg sm:text-xl font-light">Ready to discover more unique, handcrafted items?</p>
                </div>
            </div>

            {/* Quick Stats/Actions */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition-all group cursor-pointer">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-3 group-hover:scale-110 transition-transform">
                        <ShoppingBag size={24} />
                    </div>
                    <h3 className="font-bold text-primary text-xl">{orders.length}</h3>
                    <p className="text-sm text-gray-500 font-medium">Total Orders</p>
                </motion.div>
                
                {/* Other stats mock placeholders */}
                <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition-all group cursor-pointer">
                    <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-3 group-hover:scale-110 transition-transform">
                        <Heart size={24} />
                    </div>
                    <h3 className="font-bold text-primary text-xl">24</h3>
                    <p className="text-sm text-gray-500 font-medium">Saved Items</p>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition-all group cursor-pointer">
                    <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 mb-3 group-hover:scale-110 transition-transform">
                        <Clock size={24} />
                    </div>
                    <h3 className="font-bold text-primary text-xl">
                        {orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">Delivery Pending</p>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition-all group cursor-pointer">
                    <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-500 mb-3 group-hover:scale-110 transition-transform">
                        <Star size={24} />
                    </div>
                    <h3 className="font-bold text-primary text-xl">8</h3>
                    <p className="text-sm text-gray-500 font-medium">Reviews Left</p>
                </motion.div>
            </div>

            {/* Sections */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Available Products */}
                <motion.div variants={itemVariants} className="xl:col-span-2 space-y-6">
                    <div className="flex justify-between items-end">
                        <h3 className="text-2xl font-bold text-primary tracking-tight">Available Products</h3>
                    </div>

                    {loading ? (
                        <p>Loading products...</p>
                    ) : products.length === 0 ? (
                        <p className="text-gray-500 bg-white p-6 rounded-2xl border border-gray-100">No active products found. Sellers need to add some!</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {products.map((product) => (
                                <div key={product._id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-lg transition-all flex flex-col group">
                                    <div className="aspect-[4/3] bg-gray-100 rounded-xl mb-4 overflow-hidden relative">
                                        {product.images && product.images.length > 0 ? (
                                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center text-gray-400">No Image</div>
                                        )}
                                        <button className="absolute top-3 right-3 z-20 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-gray-500 hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Heart size={16} />
                                        </button>
                                    </div>
                                    <h4 className="font-bold text-gray-900 line-clamp-1">{product.name}</h4>
                                    <p className="text-sm text-gray-500 mb-2 truncate">By {product.sellerId?.username || 'Unknown Artisan'}</p>
                                    <p className="text-xs text-gray-400 mb-4 line-clamp-2 min-h-[32px]">{product.description}</p>
                                    
                                    <div className="flex justify-between items-center mt-auto">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-xl text-primary">₹{product.price}</span>
                                            <span className="text-[10px] text-gray-400 text-left">Stock: {product.stock}</span>
                                        </div>
                                        <button 
                                            onClick={() => handleBuyNow(product)}
                                            disabled={product.stock < 1}
                                            className="px-4 py-2 bg-accent-terracotta text-white rounded-lg font-medium text-sm hover:bg-opacity-90 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            <ShoppingCart size={16} /> Buy
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Recent Orders */}
                <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 self-start">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-primary">Recent Orders</h3>
                    </div>

                    <div className="space-y-6">
                        {orders.length === 0 ? (
                            <p className="text-sm text-gray-500">You haven't placed any orders yet.</p>
                        ) : (
                            orders.slice(0, 5).map((order) => (
                                <div key={order._id} className="flex gap-4 items-start relative pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                                    <div className="min-w-0 flex-1">
                                        <h4 className="font-bold text-gray-900 truncate text-sm">
                                            {order.products.map(p => p.productId?.name).join(', ')}
                                        </h4>
                                        <p className="text-xs text-gray-500 mt-1">From: {order.sellerId?.username}</p>
                                        <div className="flex gap-2 items-center mt-2 flex-wrap">
                                            <span className="font-bold text-sm text-primary">₹{order.totalAmount}</span>
                                            <span className={`px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded-md ${
                                                order.status === 'delivered' ? 'bg-green-50 text-green-600' : 
                                                order.status === 'placed' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                                            }`}>
                                                {order.status}
                                            </span>
                                            <span className="px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded-md bg-purple-50 text-purple-600">
                                                {order.paymentStatus}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default CustomerDashboard;
