import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Separate Word component for staggered text reveal
const AnimatedWord = ({ text, delayOffset = 0 }) => {
    const words = text.split(" ");

    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: 0.04 * i + delayOffset },
        }),
    };

    const child = {
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
        hidden: {
            opacity: 0,
            y: 20,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
    };

    return (
        <motion.h1
            style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
            variants={container}
            initial="hidden"
            animate="visible"
            className="text-5xl md:text-7xl lg:text-8xl font-sans font-bold text-primary tracking-tight"
        >
            {words.map((word, index) => (
                <motion.span
                    variants={child}
                    style={{ marginRight: "0.25em", paddingBottom: "0.1em" }}
                    key={index}
                >
                    {word}
                </motion.span>
            ))}
        </motion.h1>
    );
};

const defaultImages = [
    {
        id: 1,
        src: "/wood-sculpture.png",
        tag: "tribal_carving",
    },
    {
        id: 2,
        src: "/beaded-necklace.png",
        tag: "bead_patterns",
    },
    {
        id: 3,
        src: "/woven-basket.png",
        tag: "weaving_heritage",
    },
    {
        id: 4,
        src: "/tribal-pottery.png",
        tag: "hand_coiled",
    },
    {
        id: 5,
        src: "/textile-throw.png",
        tag: "native_textiles",
    }
];

// Configuration defining where each index in the array physically sits
const fanPositions = [
    { rotate: 0, zIndex: 50, x: 0, y: -20, scale: 1.1 },      // 0: Active front card
    { rotate: 10, zIndex: 40, x: 80, y: 10, scale: 0.95 },    // 1: Right 
    { rotate: -10, zIndex: 30, x: -80, y: 10, scale: 0.95 },  // 2: Left 
    { rotate: 20, zIndex: 20, x: 160, y: 30, scale: 0.9 },    // 3: Far right 
    { rotate: -20, zIndex: 10, x: -160, y: 30, scale: 0.9 }   // 4: Far left (back of deck)
];

// Inline tooltip tag component for the cards
const CardTag = ({ name }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="absolute bottom-4 right-4 md:bottom-6 md:right-6 z-20 cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative">
                <motion.div
                    className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-xl text-sm font-semibold text-primary flex items-center gap-2 border border-gray-100/50"
                    whileHover={{ scale: 1.05 }}
                >
                    <div className="w-2.5 h-2.5 rounded-full bg-accent-terracotta"></div>
                    @{name}
                </motion.div>

                {/* Tooltip Content */}
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute bottom-full right-0 mb-3 w-48 bg-primary text-white p-3 rounded-xl shadow-xl z-30 pointer-events-none"
                    >
                        <p className="text-xs font-medium mb-1">Authentic Maker</p>
                        <p className="text-xs text-gray-300">Curated sustainable heritage pieces.</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

const Hero = () => {
    const [images, setImages] = useState(defaultImages);

    // Automates the book flip/card shuffling
    useEffect(() => {
        const timer = setInterval(() => {
            setImages((prev) => {
                const next = [...prev];
                const first = next.shift(); // Remove the top card
                next.push(first);           // Add it to the back of the deck
                return next;
            });
        }, 3000); // 3 seconds per image

        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative min-h-[90vh] pt-32 pb-20 flex flex-col items-center justify-center overflow-hidden bg-background">
            {/* Background Soft Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent-terracotta/5 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent-green/5 blur-[120px]" />
            </div>

            <div className="relative z-10 container mx-auto px-6 text-center max-w-5xl mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-6 flex justify-center"
                >
                    <span className="px-4 py-1.5 rounded-full bg-gray-100 text-primary-light text-sm font-medium tracking-wide uppercase">
                        Curated Heritage Collection
                    </span>
                </motion.div>

                <AnimatedWord text="Authentic creations from traditional tribes." delayOffset={0.2} />

                <motion.p
                    className="mt-8 text-xl text-primary-light max-w-2xl mx-auto font-light"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                >
                    Discover one-of-a-kind handcrafted pieces that preserve ancient techniques and support indigenous communities worldwide.
                </motion.p>

                <motion.div
                    className="mt-10 flex gap-4 justify-center relative z-20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 0.8 }}
                >
                    <Link
                        to="/auth?mode=register"
                        className="px-8 py-4 bg-primary text-white rounded-full font-medium hover:bg-black transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300"
                    >
                        Explore Marketplace
                    </Link>
                    <Link
                        to="/auth?mode=login"
                        className="px-8 py-4 bg-white text-primary border border-gray-200 rounded-full font-medium hover:border-gray-300 transition-colors shadow-sm hover:shadow-md transform hover:-translate-y-1 duration-300"
                    >
                        Meet the Artisans
                    </Link>
                </motion.div>
            </div>

            {/* Visually striking fan of floating images (Automated Book Flip / Deck Shuffle Animation) */}
            <div className="relative w-full max-w-4xl mx-auto h-[400px] md:h-[600px] mt-12 md:mt-24 z-10 flex justify-center items-center">
                <motion.div
                    className="relative w-full h-full flex justify-center items-center"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                    {images.map((img, i) => (
                        <motion.div
                            key={img.id}
                            className="absolute w-[200px] md:w-[320px] h-[280px] md:h-[460px] rounded-2xl overflow-hidden shadow-2xl border-4 md:border-8 border-white bg-white"
                            style={{
                                zIndex: fanPositions[i].zIndex,
                                transformOrigin: 'bottom center'
                            }}
                            initial={false}
                            animate={{
                                opacity: 1,
                                rotate: fanPositions[i].rotate,
                                y: fanPositions[i].y,
                                x: fanPositions[i].x,
                                scale: fanPositions[i].scale
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 80,
                                damping: 14,
                                mass: 0.8
                            }}
                            whileHover={{
                                scale: fanPositions[i].scale * 1.05,
                                zIndex: 100,
                                transition: { duration: 0.2 }
                            }}
                        >
                            <img
                                src={img.src}
                                alt="Tribal Craft"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>

                            <CardTag name={img.tag} />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
