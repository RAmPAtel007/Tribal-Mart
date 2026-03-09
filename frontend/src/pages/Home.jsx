import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ValueProposition from '../components/ValueProposition';
import LogoCloud from '../components/LogoCloud';
import ProductCarousel from '../components/ProductCarousel';
import SupportTiers from '../components/SupportTiers';
import Footer from '../components/Footer';

function Home() {
    return (
        <div className="bg-background min-h-screen text-primary selection:bg-accent-terracotta/30">
            <Header />
            <main>
                <Hero />
                <ValueProposition />
                <LogoCloud />
                <ProductCarousel />
                <SupportTiers />
            </main>
            <Footer />
        </div>
    );
}

export default Home;
