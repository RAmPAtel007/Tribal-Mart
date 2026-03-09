import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const tiers = [
    {
        name: "Supporter",
        price: "₹1,250/mo",
        description: "Help fund raw materials for an entire artisan family.",
        features: ["Monthly updates", "10% off all purchases", "Access to community forum"],
        buttonText: "Join as Supporter",
        popular: false,
        delay: 0
    },
    {
        name: "Patron",
        price: "₹3,800/mo",
        description: "Provide sustainable living wages and community healthcare.",
        features: ["Direct artisan contact", "20% off all purchases", "Early access to drops", "Annual impact report"],
        buttonText: "Become a Patron",
        popular: true,
        delay: 0.2
    },
    {
        name: "Advocate",
        price: "₹9,900/mo",
        description: "Sponsor community development projects and workshops.",
        features: ["All Patron benefits", "Exclusive bespoke items", "Voting rights on projects", "VIP event invitations"],
        buttonText: "Join as Advocate",
        popular: false,
        delay: 0.4
    }
];

const SupportTiers = () => {
    return (
        <section id="impact" className="py-32 bg-background-muted relative overflow-hidden">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="text-center mb-20">
                    <motion.h2
                        className="text-4xl md:text-5xl font-sans font-medium text-primary mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        Directly Fund Communities
                    </motion.h2>
                    <motion.p
                        className="text-lg text-primary-light max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        Beyond purchasing, you can become a sustaining partner. Support traditional techniques and living wages directly.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
                    {tiers.map((tier, index) => (
                        <motion.div
                            key={index}
                            className={`relative rounded-3xl p-8 backdrop-blur-sm ${tier.popular
                                ? 'bg-primary text-white shadow-2xl scale-105 border border-primary-light/30 z-10'
                                : 'bg-white text-primary shadow-xl border border-gray-100 z-0'
                                }`}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: tier.delay }}
                            whileHover={{ y: -10, transition: { duration: 0.2 } }}
                        >
                            {tier.popular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent-terracotta text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                    Most Impactful
                                </div>
                            )}

                            <h3 className="text-2xl font-medium mb-2">{tier.name}</h3>
                            <div className="flex items-baseline gap-2 mb-4">
                                <span className="text-4xl font-bold">{tier.price}</span>
                            </div>
                            <p className={`mb-8 min-h-[48px] ${tier.popular ? 'text-gray-300' : 'text-gray-500'}`}>
                                {tier.description}
                            </p>

                            <div className="space-y-4 mb-8">
                                {tier.features.map((feature, idx) => (
                                    <div key={idx} className="flex gap-3">
                                        <Check size={20} className={tier.popular ? "text-accent-ochre" : "text-accent-green"} />
                                        <span className={tier.popular ? "text-gray-200" : "text-gray-600"}>{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <button className={`w-full py-4 rounded-xl font-medium transition-all ${tier.popular
                                ? 'bg-accent-terracotta hover:bg-white hover:text-primary text-white'
                                : 'bg-primary/5 hover:bg-primary hover:text-white text-primary'
                                }`}>
                                {tier.buttonText}
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SupportTiers;
