import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { GeistMono } from 'geist/font/mono';
import { Mukta, Yatra_One } from 'next/font/google';
import './globals.css';
import 'animate.css';
import Script from 'next/script';
import 'katex/dist/katex.min.css';
import { ThemeProvider } from '@/lib/hooks/use-theme';
import { I18nProvider } from '@/lib/hooks/use-i18n';
import { Toaster } from '@/components/ui/sonner';
import { ServerProvidersInit } from '@/components/server-providers-init';

/* ─── BharatAI Fonts ─────────────────────────────────────────
   Mukta  — designed for Devanagari + Latin, crisp at small sizes
   Yatra One — bold Indian display face for headings
   GeistMono — kept for code
   ─────────────────────────────────────────────────────────── */
const mukta = Mukta({
  subsets: ['latin', 'devanagari'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const yatraOne = Yatra_One({
  subsets: ['latin', 'devanagari'],
  weight: ['400'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'BharatAI — Interactive Classroom',
  description:
    'Bharat ka apna AI classroom. Upload a document or describe any topic to instantly generate an immersive, multi-agent learning experience in Hinglish.',
  keywords: ['BharatAI', 'Indian AI', 'CBSE', 'JEE', 'UPSC', 'NEET', 'Hindi', 'classroom', 'AI teacher'],
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  verification: {
    google: 'RBbljzCIw3mPRaMp6kDl03gswB9HqiyYYwUSdhC8cEA',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${mukta.variable} ${yatraOne.variable}`}
      suppressHydrationWarning
    >
        <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3532554351654388"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${mukta.className} ${GeistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <I18nProvider>
            <ServerProvidersInit />
            {children}
            <Toaster position="top-center" />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
