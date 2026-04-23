'use client';

import Link from 'next/link';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '@/store/useCart';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const totalItems = useCart((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => { setIsOpen(false); }, [pathname]);

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/store', label: 'Store' },
        { href: '/event', label: 'Events' },
        { href: '/quiz', label: 'Competitions' },
        { href: '/leaderboard', label: 'Leaderboard' },
    ];

    const isActive = (href: string) =>
        href === '/' ? pathname === '/' : pathname.startsWith(href);

    return (
        <nav className={`fixed w-full z-50 transition-all duration-500 ${
            scrolled
                ? 'py-2'
                : 'py-4'
        }`} style={{
            background: scrolled
                ? 'rgba(14,6,40,0.97)'
                : 'rgba(14,6,40,0.55)',
            backdropFilter: 'blur(16px)',
            borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.04)',
        }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-14 items-center">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 0 12px rgba(245,158,11,0.4)' }}>
                            <span className="text-white font-serif font-bold text-sm">TL</span>
                        </div>
                        <span className="font-serif font-bold text-xl tracking-wide text-white">
                            Taiwo Lawal
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex md:items-center md:gap-1">
                        {navLinks.map((link) => {
                            const active = isActive(link.href);
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
                                    style={{
                                        color: active ? '#fbbf24' : 'rgba(255,255,255,0.65)',
                                        background: active ? 'rgba(251,191,36,0.1)' : 'transparent',
                                    }}
                                >
                                    {link.label}
                                    {active && (
                                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold-400" />
                                    )}
                                </Link>
                            );
                        })}

                        {/* Cart */}
                        <Link
                            href="/cart"
                            className="relative ml-2 p-2.5 rounded-full transition-all hover:bg-white/10"
                            style={{ color: 'rgba(255,255,255,0.65)' }}
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
                            <ShoppingCart className="h-5 w-5 text-white/70" />
                            {totalItems > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-gold-500 text-white text-xs font-bold flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all"
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={isOpen ? 'close' : 'open'}
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                                </motion.div>
                            </AnimatePresence>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="md:hidden overflow-hidden"
                        style={{ borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(14,6,40,0.98)' }}
                    >
                        <div className="px-4 py-4 space-y-1">
                            {navLinks.map((link) => {
                                const active = isActive(link.href);
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="flex items-center px-4 py-3 rounded-xl font-medium transition-colors"
                                        style={{
                                            color: active ? '#fbbf24' : 'rgba(255,255,255,0.7)',
                                            background: active ? 'rgba(251,191,36,0.1)' : 'transparent',
                                        }}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
