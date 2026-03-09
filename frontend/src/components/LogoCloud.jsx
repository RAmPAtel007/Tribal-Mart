import React from 'react';

// Placeholder icons using Lucide React for fair trade/ethical organizations
import { Leaf, Heart, Globe, ShieldCheck, Sun, Recycle } from 'lucide-react';

const logos = [
    { icon: <Leaf size={28} />, name: "Eco Cert" },
    { icon: <Heart size={28} />, name: "Fair Trade Alliance" },
    { icon: <Globe size={28} />, name: "Global Artisans" },
    { icon: <ShieldCheck size={28} />, name: "Ethical Sourcing" },
    { icon: <Sun size={28} />, name: "Heritage Trust" },
    { icon: <Recycle size={28} />, name: "Sustainable Goods" },
];

const LogoCloud = () => {
    return (
        <section className="py-16 border-y border-gray-100 bg-white overflow-hidden">
            <div className="container mx-auto px-6 mb-8 text-center">
                <p className="text-sm font-medium text-gray-400 uppercase tracking-widest text-center">
                    Supported by leading ethical organizations
                </p>
            </div>

            <div className="w-full relative flex items-center">
                {/* Left/Right fading gradients */}
                <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />

                {/* The scrolling container */}
                <div className="flex w-fit animate-marquee">
                    {/* We render the logos twice to create an infinite loop effect */}
                    {[...logos, ...logos, ...logos, ...logos].map((logo, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-3 px-12 opacity-50 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0 text-primary cursor-default"
                        >
                            {logo.icon}
                            <span className="font-semibold text-lg whitespace-nowrap">{logo.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LogoCloud;
