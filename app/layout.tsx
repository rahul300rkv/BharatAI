import { MobileLearningNav } from '@/components/mobile-learning-nav';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { GeistMono } from 'geist/font/mono';
import { Mukta, Yatra_One } from 'next/font/google';
import './globals.css';
import 'animate.css';
import 'katex/dist/katex.min.css';
import { ThemeProvider } from '@/lib/hooks/use-theme';
import { I18nProvider } from '@/lib/hooks/use-i18n';
import { Toaster } from '@/components/ui/sonner';
import { ServerProvidersInit } from '@/components/server-providers-init';

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
  title: 'BharatAI — Bharat Ka Apna AI Classroom | AI Teacher for Students',
  description:
    'BharatAI is a multi-agent AI classroom. Get an AI teacher, AI assistant, and AI students for CBSE, JEE, NEET, UPSC preparation. Explore 20 free virtual labs, worked lessons and prepared classrooms without sign-in; personalised AI generation is optional.',
  keywords: [
    'BharatAI', 'AI classroom India', 'AI teacher Hindi', 'CBSE AI tutor',
    'JEE preparation AI', 'NEET study AI', 'UPSC AI assistant', 'Hindi AI learning',
    'Indian AI education', 'free AI tutor India', 'interactive AI learning',
    'Bharat ka AI', 'AI se padhai', 'online AI teacher', 'multi-agent AI classroom',
  ],
  authors: [{ name: 'BharatAI' }],
  creator: 'BharatAI',
  publisher: 'BharatAI',
  metadataBase: new URL('https://bharat-ai2.vercel.app'),

  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://bharat-ai2.vercel.app',
    siteName: 'BharatAI',
    title: 'BharatAI — AI Classroom for Every Indian Student',
    description:
      'Generate a full AI classroom with teacher, quiz, whiteboard & discussion for any topic. Public labs and prepared lessons are free; optional AI generation may require provider setup.',

  },
  twitter: {
    card: 'summary_large_image',
    title: 'BharatAI — AI Classroom for Every Indian Student',
    description:
      'Generate a full AI classroom for any topic. Free AI teacher for CBSE, JEE, NEET, UPSC.',

  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
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
      lang="en-IN"
      className={`${mukta.variable} ${yatraOne.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* JSON-LD: WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'BharatAI',
              url: 'https://bharat-ai2.vercel.app',
              description:
                "a multi-agent AI classroom for CBSE, JEE, NEET and UPSC students.",

            }),
          }}
        />
        {/* JSON-LD: SoftwareApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'BharatAI',
              applicationCategory: 'EducationalApplication',
              operatingSystem: 'Web',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'INR',
              },
              description:
                'AI-powered interactive classroom with multi-agent learning for Indian students.',

            }),
          }}
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
            <MobileLearningNav/>
            <Toaster position="top-center" />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
