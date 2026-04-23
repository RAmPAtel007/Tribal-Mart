import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const Auth = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // 'login' or 'register'
    const initialMode = searchParams.get('mode') || 'login';
    const [isLogin, setIsLogin] = useState(initialMode !== 'register');

    // Form States
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [regRole, setRegRole] = useState('customer');

    const [regEmail, setRegEmail] = useState('');
    const [regUsername, setRegUsername] = useState('');
    const [password, setPassword] = useState(''); // regPassword

    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showRegPassword, setShowRegPassword] = useState(false);

    const [strengthScore, setStrengthScore] = useState(0);
    const [authMessage, setAuthMessage] = useState({ text: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);

    const evaluateStrength = (val) => {
        let score = 0;
        if (val.length > 7) score += 1;
        if (/[A-Z]/.test(val)) score += 1;
        if (/[a-z]/.test(val)) score += 1;
        if (/[0-9]/.test(val)) score += 1;
        if (/[^A-Za-z0-9]/.test(val)) score += 1;
        return score;
    };

    const handlePasswordChange = (e) => {
        const val = e.target.value;
        setPassword(val);
        setStrengthScore(evaluateStrength(val));
    };

    const getStrengthWord = () => {
        switch (strengthScore) {
            case 0: return '';
            case 1: return 'Weak';
            case 2: return 'Fair';
            case 3: return 'Good';
            case 4: return 'Strong';
            case 5: return 'Very Strong';
            default: return '';
        }
    };

    const getStrengthColor = () => {
        switch (strengthScore) {
            case 0: return 'bg-gray-200';
            case 1: return 'bg-red-500';
            case 2: return 'bg-orange-400';
            case 3: return 'bg-yellow-400';
            case 4: return 'bg-green-400';
            case 5: return 'bg-green-600';
            default: return 'bg-gray-200';
        }
    };

    // Sync state with URL params if they change
    useEffect(() => {
        setIsLogin(searchParams.get('mode') !== 'register');
        setAuthMessage({ text: '', type: '' });
    }, [searchParams]);

    const handleSwitchMode = () => {
        setIsLogin(!isLogin);
        setAuthMessage({ text: '', type: '' });
    };

    const handleBack = () => {
        navigate('/');
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setAuthMessage({ text: '', type: '' });
        setIsLoading(true);

        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: loginEmail, password: loginPassword })
            });
            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);

                // Determine redirect path based on role
                let redirectPath = '/dashboard';
                if (data.user.role === 'admin') redirectPath = '/admin-dashboard';
                else if (data.user.role === 'seller') redirectPath = '/seller-dashboard';
                else if (data.user.role === 'agent') redirectPath = '/agent-dashboard';

                setAuthMessage({ text: `Login successful! Welcome ${data.user.role}.`, type: 'success' });
                setTimeout(() => navigate(redirectPath), 1500);
            } else {
                setAuthMessage({ text: data.message || 'Login failed', type: 'error' });
            }
        } catch (error) {
            setAuthMessage({ text: 'Error connecting to server', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setAuthMessage({ text: '', type: '' });
        setIsLoading(true);

        try {
            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: regUsername, email: regEmail, password: password, role: regRole })
            });
            const data = await res.json();

            if (res.ok) {
                setAuthMessage({ text: 'Registration successful! Please log in.', type: 'success' });
                setTimeout(() => handleSwitchMode(), 2000);
            } else {
                setAuthMessage({ text: data.message || 'Registration failed', type: 'error' });
            }
        } catch (error) {
            setAuthMessage({ text: 'Error connecting to server', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-8 font-sans">
            {/* Absolute Back Button */}
            <button
                onClick={handleBack}
                className="absolute top-8 left-8 text-primary font-medium hover:text-accent-terracotta transition-colors z-50 flex items-center gap-2"
            >
                ← Back to Home
            </button>

            {/* Main Auth Container */}
            <div className="relative w-full max-w-5xl h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden flex">

                {/* Left Side: Login Form (Static underneath) */}
                <div className="w-1/2 h-full flex flex-col justify-center px-16 z-10">
                    <h2 className="text-4xl font-semibold text-primary mb-2 tracking-tight">Login</h2>

                    {/* Status Message */}
                    {isLogin && authMessage.text && (
                        <div className={`mb-4 p-3 rounded-xl text-sm ${authMessage.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                            {authMessage.text}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleLoginSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-2">Email</label>
                            <input
                                type="email"
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-accent-terracotta focus:ring-1 focus:ring-accent-terracotta transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showLoginPassword ? "text" : "password"}
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-accent-terracotta focus:ring-1 focus:ring-accent-terracotta transition-all pr-12"
                                />
                                <button
                                    type="button"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                                >
                                    {showLoginPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                        <div className="text-right">
                            <a href="#" className="text-sm text-accent-terracotta hover:underline font-medium">forgot password?</a>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-accent-terracotta text-white rounded-xl font-semibold text-lg hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
                        >
                            {isLoading ? 'Processing...' : 'Login'}
                        </button>
                    </form>
                    <p className="text-center mt-8 text-sm text-gray-500 font-medium">
                        Don't have any account?{' '}
                        <button onClick={handleSwitchMode} className="text-accent-terracotta hover:underline" type="button">
                            Create an account
                        </button>
                    </p>
                </div>

                {/* Right Side: Register Form (Static underneath) */}
                <div className="w-1/2 h-full flex flex-col justify-center px-16 z-10">
                    <h2 className="text-4xl font-semibold text-primary mb-2 tracking-tight">Register</h2>

                    {/* Status Message */}
                    {!isLogin && authMessage.text && (
                        <div className={`mb-4 p-3 rounded-xl text-sm ${authMessage.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                            {authMessage.text}
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={handleRegisterSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-2">Email</label>
                            <input
                                type="email"
                                value={regEmail}
                                onChange={(e) => setRegEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-accent-ochre focus:ring-1 focus:ring-accent-ochre transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-2">Username</label>
                            <input
                                type="text"
                                value={regUsername}
                                onChange={(e) => setRegUsername(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-accent-ochre focus:ring-1 focus:ring-accent-ochre transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-2">Role</label>
                            <select
                                value={regRole}
                                onChange={(e) => setRegRole(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-accent-ochre focus:ring-1 focus:ring-accent-ochre transition-all bg-white"
                            >
                                <option value="customer">Customer</option>
                                <option value="seller">Seller</option>
                                <option value="agent">Agent</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showRegPassword ? "text" : "password"}
                                    value={password}
                                    onChange={handlePasswordChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-accent-ochre focus:ring-1 focus:ring-accent-ochre transition-all pr-12"
                                />
                                <button
                                    type="button"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                    onClick={() => setShowRegPassword(!showRegPassword)}
                                >
                                    {showRegPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {password && (
                                <div className="mt-2">
                                    <div className="flex justify-between items-center mb-1 text-xs">
                                        <span className={`font-medium ${strengthScore < 3 ? 'text-red-500' : strengthScore < 5 ? 'text-yellow-600' : 'text-green-600'}`}>
                                            Password Strength: {getStrengthWord()}
                                        </span>
                                    </div>
                                    <div className="flex gap-1 h-1.5 w-full rounded-full overflow-hidden">
                                        {[1, 2, 3, 4, 5].map((index) => (
                                            <div
                                                key={index}
                                                className={`flex-1 ${index <= strengthScore ? getStrengthColor() : 'bg-gray-100'} transition-all duration-300`}
                                            />
                                        ))}
                                    </div>
                                    {strengthScore < 5 && (
                                        <p className="text-xs text-gray-400 mt-1">
                                            Make it stronger with 8+ letters, uppercase, lowercase, numbers, and symbols.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-accent-ochre text-white rounded-xl font-semibold text-lg hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
                        >
                            {isLoading ? 'Processing...' : 'Create Account'}
                        </button>
                    </form>
                    <p className="text-center mt-6 text-sm text-gray-500 font-medium">
                        Already have an account?{' '}
                        <button onClick={handleSwitchMode} className="text-accent-ochre hover:underline" type="button">
                            Login here
                        </button>
                    </p>
                </div>

                {/* The Sliding Overlay Panel */}
                <motion.div
                    className="absolute top-0 left-0 w-1/2 h-full z-20 overflow-hidden bg-primary/90"
                    initial={false}
                    animate={{ x: isLogin ? '100%' : '0%' }}
                    transition={{ type: "spring", stiffness: 70, damping: 15, mass: 0.8 }}
                >
                    <AnimatePresence>
                        {!isLogin && (
                            <motion.div
                                key="register-panel"
                                className="absolute inset-0 w-full h-full"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="absolute inset-0 bg-primary/80 mix-blend-multiply z-10" />
                                <img src="/textile-throw.png" alt="Tribal pattern" className="absolute inset-0 w-full h-full object-cover" />

                                <div className="absolute inset-0 z-20 flex flex-col justify-center px-10 sm:px-12 text-white">
                                    <h1 className="text-4xl sm:text-5xl font-light mb-4">Hello!</h1>
                                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">Join the<br />Marketplace</h1>
                                    <p className="mt-6 text-gray-200 text-base sm:text-lg font-light max-w-sm">Support indigenous artisans and acquire authentic heritage.</p>
                                </div>
                            </motion.div>
                        )}

                        {isLogin && (
                            <motion.div
                                key="login-panel"
                                className="absolute inset-0 w-full h-full"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="absolute inset-0 bg-accent-forest/80 mix-blend-multiply z-10" />
                                <img src="/beaded-necklace.png" alt="Maasai beads" className="absolute inset-0 w-full h-full object-cover" />

                                <div className="absolute inset-0 z-20 flex flex-col justify-center px-12 text-white">
                                    <h1 className="text-5xl font-light mb-4">Welcome</h1>
                                    <h1 className="text-6xl font-bold tracking-tight leading-tight">Back<br />Artisan</h1>
                                    <p className="mt-6 text-gray-200 text-lg font-light">Continue supporting ethical trade and preserving tradition.</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default Auth;
