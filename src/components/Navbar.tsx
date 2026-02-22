'use client';

import Link from 'next/link';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '@/store/useCart';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const totalItems = useCart((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/store', label: 'Store' },
        { href: '/quiz', label: 'Competitions' },
        { href: '/leaderboard', label: 'Leaderboard' },
    ];

    return (
        <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled
                ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 py-2'
                : 'bg-transparent py-4'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-14 items-center">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${scrolled ? 'bg-royal-800 text-gold-400' : 'bg-white/20 text-gold-300'}`}>
                            TL
                        </div>
                        <span className={`font-serif font-bold text-xl tracking-wide transition-colors ${scrolled ? 'text-royal-950' : 'text-white'}`}>
                            Taiwo Lawal
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex md:items-center md:gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${scrolled
                                        ? 'text-gray-600 hover:text-royal-800 hover:bg-royal-50'
                                        : 'text-white/80 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* Cart */}
                        <Link
                            href="/cart"
                            className={`relative ml-2 p-2.5 rounded-full transition-all ${scrolled
                                    ? 'text-gray-600 hover:text-royal-800 hover:bg-royal-50'
                                    : 'text-white/80 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            <ShoppingCart className="h-5 w-5" />
                            {totalItems > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-gold-500 text-white text-xs font-bold flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Mobile toggle */}
                    <div className="flex md:hidden items-center gap-3">
                        <Link href="/cart" className="relative p-2">
                            <ShoppingCart className={`h-5 w-5 ${scrolled ? 'text-gray-700' : 'text-white'}`} />
                            {totalItems > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-gold-500 text-white text-xs font-bold flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`p-2 rounded-lg ${scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 shadow-xl">
                    <div className="px-4 py-4 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center px-4 py-3 rounded-xl text-gray-700 hover:text-royal-800 hover:bg-royal-50 font-medium transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}
