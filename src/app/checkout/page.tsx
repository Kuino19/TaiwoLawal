'use client';

import { useCart } from '@/store/useCart';
import { useState } from 'react';
import { MessageCircle, ArrowRight, CheckCircle2, BookOpen, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
    const { total, items, clearCart } = useCart();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [ordered, setOrdered] = useState(false);

    if (items.length === 0 && !ordered) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 pt-20" style={{ background: '#0d0520' }}>
                <div className="text-center">
                    <h2 className="font-serif font-bold text-3xl text-white mb-3">No items in cart</h2>
                    <Link href="/store" className="btn-gold">Browse Books</Link>
                </div>
            </div>
        );
    }

    const orderText = encodeURIComponent(
        `Hello! I'd like to place an order:\n\n` +
        items.map(i => `• ${i.title} × ${i.quantity} = ₦${(i.price * i.quantity).toLocaleString()}`).join('\n') +
        `\n\nTotal: ₦${total().toLocaleString()}` +
        (name ? `\n\nName: ${name}` : '') +
        (address ? `\nAddress: ${address}` : '') +
        (phone ? `\nPhone: ${phone}` : '')
    );

    const whatsappUrl = `https://wa.me/2348098687742?text=${orderText}`;

    const handleWhatsAppOrder = () => {
        window.open(whatsappUrl, '_blank');
        clearCart();
        setOrdered(true);
    };

    if (ordered) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 pt-20" style={{ background: '#0d0520' }}>
                <div className="text-center max-w-md">
                    <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
                        style={{ background: 'rgba(37,211,102,0.12)', border: '2px solid rgba(37,211,102,0.35)', boxShadow: '0 0 40px rgba(37,211,102,0.2)' }}>
                        <CheckCircle2 className="w-12 h-12" style={{ color: '#25d366' }} />
                    </div>
                    <p className="section-label mb-3">Order Sent</p>
                    <h2 className="font-serif font-bold text-4xl text-white mb-3">Thank You!</h2>
                    <p className="text-white/45 font-sans mb-8 leading-relaxed">
                        Your order has been sent via WhatsApp. We'll confirm your order and arrange delivery shortly.
                    </p>
                    <Link href="/store" className="btn-gold">Continue Shopping</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-28 pb-24 px-4" style={{ background: '#0d0520' }}>
            <div className="max-w-5xl mx-auto">
                <div className="mb-10">
                    <p className="section-label mb-1">Order Details</p>
                    <h1 className="font-serif font-bold text-4xl text-white">Checkout</h1>
                </div>

                <div className="grid lg:grid-cols-2 gap-10 items-start">
                    {/* Contact form */}
                    <div className="rounded-2xl p-8"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <h2 className="font-serif font-bold text-white text-xl mb-6">Your Details</h2>
                        <div className="space-y-5">
                            {[
                                { id: 'name', label: 'Full Name', type: 'text', placeholder: 'Your full name', value: name, onChange: setName },
                                { id: 'phone', label: 'Phone / WhatsApp', type: 'tel', placeholder: '+234 ...', value: phone, onChange: setPhone },
                                { id: 'address', label: 'Delivery Address', type: 'text', placeholder: 'Street, City, State', value: address, onChange: setAddress },
                            ].map(({ id, label, type, placeholder, value, onChange }) => (
                                <div key={id}>
                                    <label htmlFor={id} className="block text-xs font-bold tracking-widest uppercase text-white/40 mb-2">{label}</label>
                                    <input
                                        id={id} type={type} placeholder={placeholder} value={value}
                                        onChange={(e) => onChange(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl font-sans text-sm focus:outline-none transition-all"
                                        style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                                        onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(251,191,36,0.4)'; }}
                                        onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* WhatsApp Note */}
                        <div className="mt-6 rounded-xl p-4 flex items-start gap-3"
                            style={{ background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.2)' }}>
                            <MessageCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm font-sans" style={{ color: 'rgba(167,243,208,0.8)' }}>
                                Your order will be sent directly to our WhatsApp. We'll confirm and arrange payment & delivery personally.
                            </p>
                        </div>
                    </div>

                    {/* Order summary */}
                    <div className="space-y-6">
                        <div className="rounded-2xl p-7"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <h2 className="font-serif font-bold text-white text-xl mb-5">Order Summary</h2>
                            <div className="space-y-3 mb-5">
                                {items.map((item) => (
                                    <div key={item.$id} className="flex items-center gap-3">
                                        <div className="w-9 h-11 rounded-lg flex-shrink-0 flex items-center justify-center"
                                            style={{ background: 'linear-gradient(135deg, #2e1065, #6d28d9)' }}>
                                            {item.image_url
                                                ? <img src={item.image_url} alt={item.title} className="w-full h-full object-cover rounded-lg" />
                                                : <BookOpen className="w-4 h-4 text-white/50" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white text-sm font-medium truncate">{item.title}</p>
                                            <p className="text-white/35 text-xs">× {item.quantity}</p>
                                        </div>
                                        <p className="text-white text-sm font-semibold flex-shrink-0">₦{(item.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-white/8 pt-4 flex justify-between items-center">
                                <span className="font-semibold text-white">Total</span>
                                <span className="font-serif font-bold text-2xl text-gold-400">₦{total().toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Place order button */}
                        <button
                            onClick={handleWhatsAppOrder}
                            className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-semibold text-white text-base transition-all hover:opacity-90 hover:scale-[1.01]"
                            style={{ background: 'linear-gradient(135deg, #25d366, #128c7e)', boxShadow: '0 0 24px rgba(37,211,102,0.35)' }}
                        >
                            <MessageCircle className="w-5 h-5" />
                            Order via WhatsApp
                            <ArrowRight className="w-4 h-4" />
                        </button>

                        <div className="flex items-center gap-2 justify-center text-white/25 text-xs font-sans">
                            <ShieldCheck className="w-4 h-4" />
                            Secure · Personal · Trusted
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
