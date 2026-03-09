import React from 'react';
import { ArrowRight, Instagram, Twitter, Facebook } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#111111] text-white pt-24 pb-12 border-t border-gray-800">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded-full bg-accent-terracotta flex items-center justify-center font-bold text-xl text-white">
                                T
                            </div>
                            <span className="font-sans font-bold text-xl tracking-tight">
                                TribalMarket
                            </span>
                        </div>
                        <p className="text-gray-400 mb-6 font-light">
                            Elevating indigenous craft and protecting cultural heritage through honest trade.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-colors">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-colors">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-colors">
                                <Facebook size={18} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-medium text-lg mb-6">Shop</h4>
                        <ul className="space-y-4 text-gray-400 font-light">
                            <li><a href="#" className="hover:text-accent-ochre transition-colors">New Arrivals</a></li>
                            <li><a href="#" className="hover:text-accent-ochre transition-colors">By Origin</a></li>
                            <li><a href="#" className="hover:text-accent-ochre transition-colors">By Craft</a></li>
                            <li><a href="#" className="hover:text-accent-ochre transition-colors">Bespoke Orders</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-medium text-lg mb-6">About</h4>
                        <ul className="space-y-4 text-gray-400 font-light">
                            <li><a href="#" className="hover:text-accent-ochre transition-colors">Our Mission</a></li>
                            <li><a href="#" className="hover:text-accent-ochre transition-colors">Artisan Directory</a></li>
                            <li><a href="#" className="hover:text-accent-ochre transition-colors">Impact Reports</a></li>
                            <li><a href="#" className="hover:text-accent-ochre transition-colors">Ethical Standards</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-medium text-lg mb-6">Newsletter</h4>
                        <p className="text-gray-400 mb-4 font-light text-sm">
                            Subscribe to stories from the field and new artisan drops.
                        </p>
                        <form className="relative group">
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="w-full bg-transparent border-b border-gray-800 py-3 pr-12 text-white placeholder-gray-600 focus:outline-none focus:border-white transition-colors"
                                required
                            />
                            <button
                                type="submit"
                                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-white transition-colors"
                            >
                                <ArrowRight size={20} />
                            </button>
                        </form>
                    </div>

                </div>

                <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 font-light">
                    <p>&copy; {new Date().getFullYear()} Tribal Artisan Marketplace. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
