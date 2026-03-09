import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const products = [
    {
        id: 1,
        name: "Handcrafted Earth Bowl",
        artisan: "Nuhu Collective",
        price: "₹12,450",
        image: "/tribal-pottery.png",
        bgColor: "bg-[#eaddcf]"
    },
    {
        id: 2,
        name: "Woven Mesa Throw",
        artisan: "Maya Community",
        price: "₹17,800",
        image: "/textile-throw.png",
        bgColor: "bg-[#d0d8df]"
    },
    {
        id: 3,
        name: "Ceremonial Wood Sculpture",
        artisan: "Kamba Group",
        price: "₹23,900",
        image: "/wood-sculpture.png",
        bgColor: "bg-[#e5ddd3]"
    },
    {
        id: 4,
        name: "Beaded Heritage Necklace",
        artisan: "Maasai Artisans",
        price: "₹10,500",
        image: "/beaded-necklace.png",
        bgColor: "bg-[#dfd0cd]"
    },
    {
        id: 5,
        name: "Hand-woven Rattan Basket",
        artisan: "Bali Masters",
        price: "₹8,200",
        image: "/woven-basket.png",
        bgColor: "bg-[#dbdfd0]"
    }
];

// Individual product card with hover animations
const ProductCard = ({ product }) => {
    return (
        <motion.div
            className="min-w-[320px] md:min-w-[400px] h-[500px] flex-shrink-0 group cursor-pointer"
            whileHover={{ y: -10 }}
            transition={{ duration: 0.3 }}
        >
            <div className={`w-full h-[380px] rounded-3xl overflow-hidden mb-6 ${product.bgColor} relative`}>
                {/* Slight image scaling on hover */}
                <motion.div
                    className="w-full h-full relative"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover mix-blend-multiply opacity-90 p-8"
                    />
                </motion.div>

                {/* Quick add button floating overlay */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8">
                    <button className="bg-white text-primary px-6 py-3 rounded-full font-medium shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        Quick Add
                    </button>
                </div>
            </div>

            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-medium text-primary mb-1">{product.name}</h3>
                    <p className="text-sm font-medium text-gray-500">by {product.artisan}</p>
                </div>
                <p className="text-xl font-semibold text-primary">{product.price}</p>
            </div>
        </motion.div>
    );
};

const ProductCarousel = () => {
    const scrollRef = useRef(null);

    // Set up horizontal scroll logic tied to vertical scroll utilizing Framer Motion
    const { scrollYProgress } = useScroll({
        target: scrollRef,
    });

    // Calculate transform purely based on vertical scroll within this section
    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

    return (
        <section id="shop" ref={scrollRef} className="h-[200vh] relative bg-white">
            <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">

                {/* Header content */}
                <div className="container mx-auto px-6 mb-16 flex justify-between items-end">
                    <div>
                        <motion.h2
                            className="text-4xl md:text-6xl font-sans font-medium text-primary tracking-tight"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            Explore the Marketplace.
                        </motion.h2>
                        <motion.p
                            className="mt-4 text-gray-500 text-lg max-w-lg"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            Drag to view our latest arrivals, carefully sourced directly from creators mapping authentic traditions.
                        </motion.p>
                    </div>

                    <motion.button
                        className="hidden md:flex items-center gap-2 text-primary font-medium hover:text-accent-terracotta border-b border-primary hover:border-accent-terracotta pb-1 transition-all"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        View All Collection <ChevronRight size={18} />
                    </motion.button>
                </div>

                {/* The horizontally scrolling gallery */}
                <motion.div style={{ x }} className="flex gap-8 px-6 md:px-12 w-[200%] md:w-[150%]">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                    {/* Duplicate products for smooth continuous feel during scroll */}
                    {products.map((product) => (
                        <ProductCard key={`${product.id}-dup`} product={product} />
                    ))}
                </motion.div>

            </div>
        </section>
    );
};

export default ProductCarousel;
