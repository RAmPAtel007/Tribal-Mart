import React, { useState } from 'react';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Link } from 'react-router-dom';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { scrollY } = useScroll();

    // Update header styling on scroll
    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50);
    });

    const navLinks = [
        { name: 'Shop', href: '#shop' },
        { name: 'Our Artisans', href: '#' },
        { name: 'Impact', href: '#impact' },
    ];

    return (
        <motion.header
            className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${isScrolled ? 'glass-panel py-4' : 'bg-transparent py-6'
                }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">

                {/* Placeholder Logo */}
                <div className="flex items-center gap-2 cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-accent-terracotta flex items-center justify-center text-white font-bold text-xl">
                        T
                    </div>
                    <span className="font-sans font-bold text-xl tracking-tight text-primary">
                        TribalMarket
                    </span>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-primary hover:text-accent-terracotta font-medium transition-colors"
                        >
                            {link.name}
                        </a>
                    ))}
                </nav>

                {/* Action Icons */}
                <div className="flex items-center gap-5">
                    <Link to="/auth?mode=login" aria-label="User Profile" className="text-primary hover:text-accent-terracotta transition-colors">
                        <User size={20} />
                    </Link>
                    <button aria-label="Cart" className="text-primary hover:text-accent-terracotta transition-colors flex items-center gap-1">
                        <ShoppingCart size={20} />
                        <span className="bg-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                            2
                        </span>
                    </button>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden text-primary"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            {mobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="md:hidden glass-panel border-t border-white/20 px-6 py-4 flex flex-col gap-4 absolute top-full left-0 right-0"
                >
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-primary font-medium hover:text-accent-terracotta"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.name}
                        </a>
                    ))}
                </motion.div>
            )}
        </motion.header>
    );
};

export default Header;
