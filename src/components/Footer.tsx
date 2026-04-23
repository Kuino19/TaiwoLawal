import Link from 'next/link';
import { Mail, Phone, MapPin, MessageCircle, ArrowRight } from 'lucide-react';

export default function Footer() {
    const quickLinks = [
        { href: '/', label: 'Home' },
        { href: '/store', label: 'Store' },
        { href: '/event', label: 'Events' },
        { href: '/quiz', label: 'Competitions' },
        { href: '/leaderboard', label: 'Leaderboard' },
    ];

    const socials = [
        { label: 'Facebook', href: 'https://facebook.com', icon: 'f', color: '#1877f2' },
        { label: 'Instagram', href: 'https://instagram.com', icon: 'ig', color: '#e4405f' },
        { label: 'YouTube', href: 'https://youtube.com', icon: '▶', color: '#ff0000' },
    ];

    return (
        <footer style={{ background: 'linear-gradient(160deg, #0d0520 0%, #1e0a4e 100%)' }}>
            {/* Top accent line */}
            <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.5), transparent)' }} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                {/* WhatsApp Newsletter Strip */}
                <div className="mb-16 rounded-2xl px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(251,191,36,0.15)' }}>
                    <div>
                        <p className="text-xs font-bold tracking-[0.3em] uppercase text-gold-400 mb-1">Stay Connected</p>
                        <h3 className="font-serif font-bold text-white text-2xl mb-1">Get Updates on WhatsApp</h3>
                        <p className="text-white/40 text-sm font-sans">New books, competitions, and ministry updates — delivered to you.</p>
                    </div>
                    <a
                        href="https://wa.me/2348098687742?text=Hello%21+I%27d+like+to+receive+updates+about+books+and+competitions."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 inline-flex items-center gap-3 px-7 py-3.5 rounded-full font-semibold text-white transition-all hover:opacity-90 hover:scale-[1.02]"
                        style={{ background: 'linear-gradient(135deg, #25d366, #128c7e)', boxShadow: '0 0 24px rgba(37,211,102,0.3)' }}
                    >
                        <MessageCircle className="w-5 h-5" />
                        Join on WhatsApp
                        <ArrowRight className="w-4 h-4" />
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Brand */}
                    <div className="space-y-5">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                                <span className="text-white font-serif font-bold text-sm">TL</span>
                            </div>
                            <span className="font-serif font-bold text-2xl text-white">Taiwo Lawal</span>
                        </div>
                        <p className="text-white/45 text-sm font-sans leading-relaxed">
                            Raising a godly generation through books, faith-based education, and inspiring competitions for children.
                        </p>
                        {/* Social icons */}
                        <div className="flex gap-3">
                            <a href="https://wa.me/2348098687742" target="_blank" rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                                style={{ background: 'rgba(37,211,102,0.15)', border: '1px solid rgba(37,211,102,0.25)', color: '#25d366' }}
                                title="WhatsApp">
                                <MessageCircle className="w-4 h-4" />
                            </a>
                            <a href="mailto:tflwrite@gmail.com"
                                className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                                style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)', color: '#fbbf24' }}
                                title="Email">
                                <Mail className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-xs font-bold tracking-[0.3em] uppercase text-gold-500 mb-6">Quick Links</h3>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href}
                                        className="text-white/45 hover:text-white text-sm font-sans transition-colors hover:translate-x-1 inline-flex items-center gap-1.5 group">
                                        <span className="w-1 h-1 rounded-full bg-gold-500/50 group-hover:bg-gold-400 transition-colors flex-shrink-0" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-xs font-bold tracking-[0.3em] uppercase text-gold-500 mb-6">Get In Touch</h3>
                        <ul className="space-y-4">
                            {[
                                { icon: Mail, text: 'joygirl714u@gmail.com', href: 'mailto:joygirl714u@gmail.com' },
                                { icon: Mail, text: 'tflwrite@gmail.com', href: 'mailto:tflwrite@gmail.com' },
                                { icon: Phone, text: '+234 809 868 7742 (WhatsApp)', href: 'https://wa.me/2348098687742' },
                                { icon: MapPin, text: 'Lagos, Nigeria', href: null },
                            ].map(({ icon: Icon, text, href }, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                        style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.18)' }}>
                                        <Icon className="w-4 h-4 text-gold-400" />
                                    </div>
                                    {href ? (
                                        <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                                            className="text-white/45 hover:text-white text-sm font-sans transition-colors">
                                            {text}
                                        </a>
                                    ) : (
                                        <span className="text-white/45 text-sm font-sans">{text}</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-white/25 text-sm font-sans">
                        © {new Date().getFullYear()} Taiwo Funmilayo Lawal. All rights reserved.
                    </p>
                    <p className="text-white/20 text-xs font-sans italic">Raising a Godly Generation</p>
                </div>
            </div>
        </footer>
    );
}
