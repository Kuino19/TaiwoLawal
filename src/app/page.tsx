'use client';

import Hero from '@/components/Hero';
import FeaturedBooks from '@/components/FeaturedBooks';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Trophy, Heart, BookOpen, Sparkles } from 'lucide-react';
import Link from 'next/link';

const stats = [
  { value: '5+', label: 'Books Published' },
  { value: '100+', label: 'Competitions Hosted' },
  { value: '500+', label: 'Children Impacted' },
];

const features = [
  {
    icon: Trophy,
    title: 'Competitive Spirit',
    desc: 'Organizing quizzes, debates, and challenges to sharpen young minds and reward brilliance.',
    color: 'from-gold-400 to-gold-600',
  },
  {
    icon: Heart,
    title: 'Heart for Ministry',
    desc: 'Teaching the undiluted word of God in simple, relatable, and engaging ways for children.',
    color: 'from-rose-400 to-rose-600',
  },
  {
    icon: BookOpen,
    title: 'Author & Educator',
    desc: 'Writing books that bridge faith and learning, equipping children with timeless wisdom.',
    color: 'from-royal-400 to-royal-700',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />

      {/* Stats Bar */}
      <div style={{ background: 'linear-gradient(135deg, #160840, #2e1065)' }}>
        <div className="max-w-7xl mx-auto px-4 py-14">
          <div className="grid grid-cols-3 gap-6 divide-x divide-white/10">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center px-4"
              >
                <div className="font-serif font-bold text-4xl sm:text-5xl mb-1"
                  style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  {s.value}
                </div>
                <div className="text-white/50 text-xs font-sans tracking-widest uppercase">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <FeaturedBooks />

      {/* About Section */}
      <section className="py-28 bg-gray-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-[0.04]"
          style={{ background: '#8b5cf6' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="section-label mb-4">Who I Am</p>
              <h2 className="font-serif font-bold text-5xl text-gray-900 mb-6 leading-tight">
                More Than Just<br />an Author
              </h2>
              <p className="text-gray-500 text-lg font-sans leading-relaxed mb-10">
                My mission is to bridge the gap between faith and academic excellence. I believe every child carries a God-given potential waiting to be ignited through the right words, the right guidance, and the right community.
              </p>

              <div className="space-y-6">
                {features.map(({ icon: Icon, title, desc, color }) => (
                  <div key={title} className="flex gap-5">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-gray-900 text-lg mb-1">{title}</h4>
                      <p className="text-gray-500 text-sm font-sans leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Visual card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute inset-0 rounded-3xl blur-2xl opacity-20 scale-95"
                style={{ background: 'linear-gradient(135deg, #8b5cf6, #f59e0b)' }} />
              <div className="relative rounded-3xl overflow-hidden border border-white shadow-2xl">
                <div className="h-96 relative overflow-hidden">
                  <Image
                    src="/taiwo.jpg"
                    alt="Mrs. Taiwo Funmilayo Lawal"
                    fill
                    className="object-cover object-top"
                  />
                  {/* Gold gradient overlay */}
                  <div className="absolute inset-x-0 bottom-0 h-24 flex items-end px-6 pb-4"
                    style={{ background: 'linear-gradient(to top, rgba(30,10,78,0.9), transparent)' }}>
                    <div>
                      <p className="text-white font-serif font-semibold text-lg leading-tight">Mrs. Taiwo Funmilayo Lawal</p>
                      <p className="text-gold-400 text-xs font-sans mt-0.5">Children's Evangelist & Educator</p>
                    </div>
                  </div>
                </div>

                {/* Quote bar */}
                <div className="px-8 py-6" style={{ background: '#0f0628' }}>
                  <p className="text-white/60 text-sm font-sans italic leading-relaxed">
                    "Train up a child in the way he should go: and when he is old, he will not depart from it." — Proverbs 22:6
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-24" style={{ background: 'linear-gradient(135deg, #1e0a4e, #2e1065)' }}>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-[0.08]"
            style={{ background: '#f59e0b' }} />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-[0.06]"
            style={{ background: '#8b5cf6' }} />
        </div>

        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
              style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.3)' }}>
              <Trophy className="w-3 h-3 text-gold-400" />
              <span className="text-gold-300 text-xs font-semibold tracking-widest uppercase">Next Competition</span>
            </div>
            <h2 className="font-serif font-bold text-5xl text-white mb-6 leading-tight">
              Ready to Test Your<br />Knowledge?
            </h2>
            <p className="text-white/50 font-sans text-lg mb-10 leading-relaxed">
              Join our competitions, showcase your intelligence, and win incredible prizes. Register for the upcoming quiz today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/quiz"
                className="inline-flex items-center justify-center px-10 py-4 rounded-full font-semibold text-white transition-all"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 0 30px rgba(245,158,11,0.4)' }}>
                Start a Quiz
              </Link>
              <Link href="/store"
                className="inline-flex items-center justify-center px-10 py-4 rounded-full font-semibold text-white/80 border border-white/20 hover:bg-white/10 hover:border-white/30 transition-all">
                Browse Store
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
