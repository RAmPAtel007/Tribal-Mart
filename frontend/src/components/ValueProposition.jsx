import React from 'react';
import { motion } from 'framer-motion';

const ValueProposition = () => {
    // A simple stagger animation for words as they enter viewport
    const text = "Showcase, sell, & acquire authentic heritage pieces.";
    const words = text.split(" ");

    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            },
        },
    };

    const child = {
        hidden: { opacity: 0, y: 40, filter: "blur(4px)" },
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
                type: "spring",
                damping: 15,
                stiffness: 100,
            },
        },
    };

    return (
        <section className="py-32 bg-background-light relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-ochre/5 rounded-full blur-[80px]" />

            <div className="container mx-auto px-6 max-w-5xl text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="mb-8"
                >
                    <div className="w-16 h-1 bg-accent-terracotta mx-auto rounded-full" />
                </motion.div>

                <motion.h2
                    variants={container}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="text-4xl md:text-5xl lg:text-7xl font-sans font-medium text-primary leading-tight tracking-tight"
                    style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
                >
                    {words.map((word, index) => (
                        <motion.span
                            variants={child}
                            style={{ marginRight: "0.25em", paddingBottom: "0.1em" }}
                            key={index}
                            className={word.includes('&') ? 'text-accent-ochre mx-2' : ''}
                        >
                            {word}
                        </motion.span>
                    ))}
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="mt-12 text-lg md:text-xl text-primary-light max-w-2xl mx-auto font-light leading-relaxed"
                >
                    By connecting directly with traditional makers, we ensure fair compensation while giving you access to genuine artifacts that carry generations of cultural significance.
                </motion.p>
            </div>
        </section>
    );
};

export default ValueProposition;
