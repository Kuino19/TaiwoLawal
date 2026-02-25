'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, User, Phone, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { registerForEventAction } from '@/app/actions/event';
import toast from 'react-hot-toast';

export default function EventRegistrationPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [isFreeBook, setIsFreeBook] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setSuccessMessage('');
        setIsFreeBook(false);
        try {
            const result = await registerForEventAction(formData);
            if (result.success) {
                setSuccessMessage(result.message);
                setIsFreeBook(result.getsFreeBook);
                toast.success('Registration successful!');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to register. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#c5a059]/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-amber-600/10 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-xl w-full z-10 space-y-8"
            >
                {/* Header */}
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="inline-flex items-center justify-center p-4 bg-white/5 border border-white/10 rounded-full mb-4 shadow-[0_0_30px_rgba(197,160,89,0.2)]"
                    >
                        <BookOpen className="w-8 h-8 text-[#c5a059]" />
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 drop-shadow-sm">
                        Exclusive Book Release
                    </h1>
                    <p className="text-lg text-slate-300 leading-relaxed max-w-lg mx-auto">
                        Be among the selected few to experience our newest masterpiece. <span className="text-amber-400 font-semibold border-b border-amber-400/50">The first 50 registrations will receive the book absolutely FREE.</span>
                    </p>
                </div>

                {/* Form Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative"
                >
                    {/* Decorative border highlight */}
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#c5a059]/50 to-transparent" />

                    {successMessage ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-8 space-y-6"
                        >
                            <div className="flex justify-center">
                                {isFreeBook ? (
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full" />
                                        <CheckCircle2 className="w-20 h-20 text-green-400 relative z-10" />
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
                                        <CheckCircle2 className="w-20 h-20 text-blue-400 relative z-10" />
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2 text-center">
                                <h2 className="text-2xl font-bold text-white">
                                    Registration Confirmed
                                </h2>
                                <p className={`text-lg px-4 ${isFreeBook ? "text-amber-300" : "text-slate-300"}`}>
                                    {successMessage}
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <form className="space-y-6" action={handleSubmit}>
                            {/* Name Input */}
                            <div className="space-y-2 group">
                                <label htmlFor="name" className="text-sm font-medium text-slate-300 block ml-1 transition-colors group-hover:text-amber-200">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-hover:text-amber-400 transition-colors" />
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        placeholder="Enter your full name"
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-12 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#c5a059]/50 focus:border-[#c5a059] transition-all"
                                    />
                                </div>
                            </div>

                            {/* WhatsApp Input */}
                            <div className="space-y-2 group">
                                <label htmlFor="whatsapp" className="text-sm font-medium text-slate-300 block ml-1 transition-colors group-hover:text-amber-200">
                                    WhatsApp Number
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-hover:text-amber-400 transition-colors" />
                                    <input
                                        type="tel"
                                        id="whatsapp"
                                        name="whatsapp"
                                        required
                                        placeholder="+123 456 7890"
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-12 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#c5a059]/50 focus:border-[#c5a059] transition-all"
                                    />
                                </div>
                            </div>

                            {/* Email Input */}
                            <div className="space-y-2 group">
                                <label htmlFor="email" className="text-sm font-medium text-slate-300 block ml-1 transition-colors group-hover:text-amber-200">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-hover:text-amber-400 transition-colors" />
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        placeholder="you@example.com"
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-12 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#c5a059]/50 focus:border-[#c5a059] transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full relative group overflow-hidden bg-[#c5a059] text-black font-bold text-lg rounded-xl py-4 transition-all hover:bg-amber-400 hover:shadow-[0_0_20px_rgba(197,160,89,0.5)] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed`}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {isLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                            Registering...
                                        </>
                                    ) : (
                                        "Secure Your Spot"
                                    )}
                                </span>
                                {/* Button Hover Effect */}
                                <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                            </button>

                            <div className="flex items-center justify-center gap-2 text-sm text-slate-400 mt-4">
                                <AlertCircle className="w-4 h-4" />
                                <span>Limited to first 50 free spots. Act quickly.</span>
                            </div>
                        </form>
                    )}
                </motion.div>
            </motion.div>
        </div>
    );
}
