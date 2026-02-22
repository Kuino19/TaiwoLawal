import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
    const quickLinks = [
        { href: '/', label: 'Home' },
        { href: '/store', label: 'Store' },
        { href: '/quiz', label: 'Competitions' },
        { href: '/leaderboard', label: 'Leaderboard' },
    ];

    return (
        <footer style={{ background: 'linear-gradient(135deg, #1e0a4e 0%, #160840 100%)' }}>
            {/* Top accent line */}
            <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.5), transparent)' }} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Brand */}
                    <div className="space-y-5">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                                style={{ background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)', color: '#fbbf24' }}>
                                TL
                            </div>
                            <span className="font-serif font-bold text-2xl text-white">Taiwo Lawal</span>
                        </div>
                        <p className="text-white/50 text-sm font-sans leading-relaxed">
                            Raising a godly generation through books, faith-based education, and inspiring competitions for children.
                        </p>
                        <div className="flex gap-4">
                            {[
                                { Icon: Facebook, href: '#' },
                                { Icon: Instagram, href: '#' },
                                { Icon: Youtube, href: '#' },
                            ].map(({ Icon, href }, i) => (
                                <a key={i} href={href}
                                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <Icon className="w-4 h-4 text-white/60 hover:text-gold-400 transition-colors" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-xs font-bold tracking-[0.3em] uppercase text-gold-500 mb-6">Quick Links</h3>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href}
                                        className="text-white/50 hover:text-white text-sm font-sans transition-colors hover:translate-x-1 inline-block">
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
                            <li className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                    style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)' }}>
                                    <Mail className="w-4 h-4 text-gold-400" />
                                </div>
                                <a href="mailto:joygirl714u@gmail.com"
                                    className="text-white/50 hover:text-white text-sm font-sans transition-colors">
                                    joygirl714u@gmail.com
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                    style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)' }}>
                                    <Mail className="w-4 h-4 text-gold-400" />
                                </div>
                                <a href="mailto:tflwrite@gmail.com"
                                    className="text-white/50 hover:text-white text-sm font-sans transition-colors">
                                    tflwrite@gmail.com
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                    style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)' }}>
                                    <Phone className="w-4 h-4 text-gold-400" />
                                </div>
                                <a href="https://wa.me/2348098687742" target="_blank" rel="noopener noreferrer"
                                    className="text-white/50 hover:text-white text-sm font-sans transition-colors">
                                    +234 809 868 7742 (WhatsApp)
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                    style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)' }}>
                                    <MapPin className="w-4 h-4 text-gold-400" />
                                </div>
                                <span className="text-white/50 text-sm font-sans">Lagos, Nigeria</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                    <p className="text-white/30 text-sm font-sans">
                        © {new Date().getFullYear()} Taiwo Funmilayo Lawal. All rights reserved.
                    </p>
                    <p className="text-white/20 text-xs font-sans">Raising a Godly Generation</p>
                </div>
            </div>
        </footer>
    );
}
