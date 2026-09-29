import type { Metadata } from 'next';
import Hero from '@/components/Hero';
import FeaturedBooks from '@/components/FeaturedBooks';
import StatsCounter from '@/components/StatsCounter';
import { Trophy, Heart, BookOpen, Quote, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'Taiwo Funmilayo Lawal — Evangelist, Teacher & Author',
    description: 'Official website of Taiwo Funmilayo Lawal. Raising a godly generation through books, competitions, and ministry. Shop faith-based books for children.',
    openGraph: {
        title: 'Taiwo Funmilayo Lawal — Raising a Godly Generation',
        description: 'Children\'s evangelist, teacher, and author. Books, competitions, and ministry for children.',
        images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Taiwo Funmilayo Lawal' }],
        type: 'website',
    },
    twitter: { card: 'summary_large_image', title: 'Taiwo Funmilayo Lawal', description: 'Raising a Godly Generation' },
};

const stats = [
    { value: 5, suffix: '+', label: 'Books Published' },
    { value: 100, suffix: '+', label: 'Competitions Hosted' },
    { value: 500, suffix: '+', label: 'Children Impacted' },
];

const features = [
    { icon: Trophy, title: 'Competitive Spirit', desc: 'Organizing quizzes, debates, and challenges to sharpen young minds and reward brilliance.', color: 'from-gold-400 to-gold-600' },
    { icon: Heart, title: 'Heart for Ministry', desc: 'Teaching the undiluted word of God in simple, relatable, and engaging ways for children.', color: 'from-rose-400 to-rose-600' },
    { icon: BookOpen, title: 'Author & Educator', desc: 'Writing books that bridge faith and learning, equipping children with timeless wisdom.', color: 'from-royal-400 to-royal-700' },
];

const testimonials = [
    {
        quote: "My daughter came home buzzing after the competition! She placed 2nd and has been asking to read more Bible stories ever since. This ministry is a blessing.",
        author: "Mrs. Adunola Okonkwo",
        role: "Parent, Lagos",
        initials: "AO",
    },
    {
        quote: "The books by Mrs. Taiwo are simply outstanding. They speak to children at their level, blend faith and learning beautifully, and keep them engaged.",
        author: "Pastor Emmanuel Bello",
        role: "Children's Church Leader",
        initials: "EB",
    },
    {
        quote: "Kingdom Stars Vol. 1 has transformed our Sunday School class completely. Every week the children beg us to read from it. Highly recommended!",
        author: "Sister Grace Adeyemi",
        role: "Sunday School Teacher, Abuja",
        initials: "GA",
    },
];

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
            <Hero />

            {/* Stats Bar — animated counters */}
            <StatsCounter items={stats} />

            <FeaturedBooks />

            {/* About Section */}
            <section className="py-28 relative overflow-hidden bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Text */}
                        <div>
                            <p className="text-amber-600 font-bold tracking-widest uppercase text-xs mb-4">Who I Am</p>
                            <h2 className="font-serif font-bold text-5xl text-slate-900 mb-6 leading-tight">
                                More Than Just<br />an Author
                            </h2>
                            <p className="text-slate-600 text-lg font-sans leading-relaxed mb-10">
                                My mission is to bridge the gap between faith and academic excellence. I believe every child carries a God-given potential waiting to be ignited through the right words, the right guidance, and the right community.
                            </p>

                            <div className="space-y-6">
                                {features.map(({ icon: Icon, title, desc, color }) => (
                                    <div key={title} className="flex gap-5">
                                        <div className={`flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md`}>
                                            <Icon className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="font-serif font-bold text-slate-900 text-lg mb-1">{title}</h4>
                                            <p className="text-slate-600 text-sm font-sans leading-relaxed">{desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Visual card */}
                        <div className="relative">
                            <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-xl">
                                <div className="h-96 relative overflow-hidden">
                                    <Image
                                        src="/taiwo.jpg"
                                        alt="Mrs. Taiwo Funmilayo Lawal"
                                        fill
                                        className="object-cover object-top"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 h-24 flex items-end px-6 pb-4 bg-gradient-to-t from-black/80 to-transparent">
                                        <div>
                                            <p className="text-white font-serif font-semibold text-lg leading-tight">Mrs. Taiwo Funmilayo Lawal</p>
                                            <p className="text-amber-400 text-xs font-sans mt-0.5">Children's Evangelist & Educator</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Quote bar */}
                                <div className="px-8 py-6 bg-slate-50 border-t border-slate-100">
                                    <p className="text-slate-600 text-sm font-sans italic leading-relaxed">
                                        "Train up a child in the way he should go: and when he is old, he will not depart from it." — Proverbs 22:6
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 relative overflow-hidden bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <p className="text-amber-600 font-bold tracking-widest uppercase text-xs mb-3">Testimonials</p>
                        <h2 className="font-serif font-bold text-5xl text-slate-900 mb-4">
                            What Families Say
                        </h2>
                        <p className="text-slate-600 font-sans max-w-lg mx-auto">
                            Real stories from parents, teachers, and church leaders whose children have been impacted.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
                        {testimonials.map((t, i) => (
                            <div
                                key={i}
                                className="rounded-2xl p-7 flex flex-col relative bg-white border border-slate-200 shadow-sm transition-shadow hover:shadow-md"
                            >
                                {/* Quote icon */}
                                <Quote className="w-8 h-8 text-amber-200 mb-4 flex-shrink-0" />

                                <p className="text-slate-600 text-sm font-sans leading-relaxed flex-1 mb-6 italic">
                                    "{t.quote}"
                                </p>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-serif font-bold text-white text-sm bg-gradient-to-br from-amber-400 to-amber-600">
                                        {t.initials}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900 text-sm">{t.author}</p>
                                        <p className="text-slate-500 text-xs font-sans">{t.role}</p>
                                    </div>
                                </div>

                                {/* Star rating */}
                                <div className="flex gap-0.5 mt-4">
                                    {[1,2,3,4,5].map((s) => (
                                        <Star key={s} className="w-3.5 h-3.5 text-amber-400 fill-current" />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative overflow-hidden py-24 bg-white border-t border-slate-100">
                <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 bg-amber-50 border border-amber-200">
                        <Trophy className="w-3 h-3 text-amber-600" />
                        <span className="text-amber-700 text-xs font-semibold tracking-widest uppercase">Next Competition</span>
                    </div>
                    <h2 className="font-serif font-bold text-5xl text-slate-900 mb-6 leading-tight">
                        Ready to Test Your<br />Knowledge?
                    </h2>
                    <p className="text-slate-600 font-sans text-lg mb-10 leading-relaxed">
                        Join our competitions, showcase your intelligence, and win incredible prizes. Register for the upcoming quiz today!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/quiz"
                            className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full font-semibold text-white transition-all hover:opacity-90 hover:scale-[1.02] bg-gradient-to-r from-amber-500 to-amber-600 shadow-lg shadow-amber-500/20">
                            Start a Quiz
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link href="/store"
                            className="inline-flex items-center justify-center px-10 py-4 rounded-full font-semibold transition-all hover:bg-slate-50 text-slate-700 border border-slate-200">
                            Browse Store
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
