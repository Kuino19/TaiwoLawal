import type { Metadata } from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', weight: ['300', '400', '500', '600', '700'] });
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://taiwolawal.com'),
  title: {
    default: 'Taiwo Funmilayo Lawal — Evangelist, Teacher & Author',
    template: '%s | Taiwo Funmilayo Lawal',
  },
  description: 'Official website of Taiwo Funmilayo Lawal. Raising a godly generation through books, faith-based competitions, and children\'s ministry.',
  keywords: ['children\'s evangelist', 'faith books', 'Bible quiz', 'children ministry', 'Taiwo Lawal', 'Lagos Nigeria'],
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    siteName: 'Taiwo Funmilayo Lawal',
    title: 'Taiwo Funmilayo Lawal — Raising a Godly Generation',
    description: 'Children\'s evangelist, teacher, and author. Books, competitions, and ministry for children.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Taiwo Funmilayo Lawal' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Taiwo Funmilayo Lawal',
    description: 'Raising a Godly Generation — Books, Competitions & Ministry',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${cormorant.variable} font-sans`} suppressHydrationWarning>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#1e0a4e',
                color: '#fff',
                border: '1px solid rgba(251, 191, 36, 0.3)',
              },
            }}
          />
        </div>
      </body>
    </html>
  );
}
