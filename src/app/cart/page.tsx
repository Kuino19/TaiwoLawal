'use client';

import { useCart } from '@/store/useCart';
import Link from 'next/link';
import { Trash2, ShoppingCart, ArrowRight, BookOpen, Minus, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
    const { items, removeItem, updateQuantity, total } = useCart();

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 pt-20"
                style={{ background: '#0d0520' }}>
                <div className="text-center">
                    <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
                        style={{ background: 'rgba(109,40,217,0.1)', border: '1px solid rgba(109,40,217,0.2)' }}>
                        <ShoppingCart className="w-10 h-10 text-royal-400" />
                    </div>
                    <h2 className="font-serif font-bold text-3xl text-white mb-3">Your cart is empty</h2>
                    <p className="text-white/40 font-sans mb-8">Looks like you haven't added any books yet.</p>
                    <Link href="/store" className="btn-gold">Browse Books</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-28 pb-24 px-4" style={{ background: '#0d0520' }}>
            <div className="max-w-5xl mx-auto">
                <div className="mb-10">
                    <p className="section-label mb-1">Your Orders</p>
                    <h1 className="font-serif font-bold text-4xl text-white">Shopping Cart</h1>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 items-start">
                    {/* Items */}
                    <div className="lg:col-span-2 space-y-4">
                        <AnimatePresence>
                            {items.map((item) => (
                                <motion.div
                                    key={item.$id}
                                    layout
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="rounded-2xl p-5 flex gap-5 items-center"
                                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                                >
                                    {/* Cover thumb */}
                                    <div className="w-16 h-20 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
                                        style={{ background: 'linear-gradient(135deg, #2e1065, #6d28d9)' }}>
                                        {item.image_url
                                            ? <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                                            : <BookOpen className="w-6 h-6 text-white/50" />}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-serif font-bold text-white text-base leading-tight truncate">{item.title}</h3>
                                        <p className="text-white/35 text-xs font-sans mt-0.5 capitalize">{item.type}</p>
                                        <p className="font-bold text-gold-400 mt-2">₦{item.price.toLocaleString()}</p>
                                    </div>

                                    {/* Quantity controls */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <button onClick={() => updateQuantity(item.$id, item.quantity - 1)}
                                            className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:bg-white/10"
                                            style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)' }}>
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="w-6 text-center text-white font-semibold text-sm">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.$id, item.quantity + 1)}
                                            className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:bg-white/10"
                                            style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)' }}>
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>

                                    {/* Subtotal + remove */}
                                    <div className="text-right flex-shrink-0">
                                        <p className="font-serif font-bold text-white text-base">₦{(item.price * item.quantity).toLocaleString()}</p>
                                        <button onClick={() => removeItem(item.$id)}
                                            className="mt-2 text-rose-400/60 hover:text-rose-400 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary */}
                    <div className="rounded-2xl p-7 sticky top-24"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <h2 className="font-serif font-bold text-white text-xl mb-6">Order Summary</h2>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm font-sans">
                                <span className="text-white/45">Subtotal</span>
                                <span className="text-white">₦{total().toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm font-sans">
                                <span className="text-white/45">Delivery</span>
                                <span className="text-white/45">Arranged on order</span>
                            </div>
                        </div>

                        <div className="border-t border-white/8 pt-4 mb-6">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-white">Total</span>
                                <span className="font-serif font-bold text-2xl text-gold-400">₦{total().toLocaleString()}</span>
                            </div>
                        </div>

                        <Link href="/checkout"
                            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90"
                            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                            Proceed to Checkout <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link href="/store"
                            className="w-full flex items-center justify-center py-3 mt-3 rounded-xl text-sm font-sans transition-colors hover:text-white"
                            style={{ color: 'rgba(255,255,255,0.4)' }}>
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
