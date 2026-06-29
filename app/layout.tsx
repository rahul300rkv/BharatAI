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
    'BharatAI is India\'s first multi-agent AI classroom. Get an AI teacher, AI assistant, and AI students for CBSE, JEE, NEET, UPSC preparation. Learn any topic in Hindi or English — free, instant, and personalized.',
  keywords: [
    'BharatAI', 'AI classroom India', 'AI teacher Hindi', 'CBSE AI tutor',
    'JEE preparation AI', 'NEET study AI', 'UPSC AI assistant', 'Hindi AI learning',
    'Indian AI education', 'free AI tutor India', 'interactive AI learning',
    'Bharat ka AI', 'AI se padhai', 'online AI teacher', 'multi-agent AI classroom',
  ],
  authors: [{ name: 'BharatAI' }],
  creator: 'BharatAI',
  publisher: 'BharatAI',
  metadataBase: new URL('https://bharatai.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://bharatai.vercel.app',
    siteName: 'BharatAI',
    title: 'BharatAI — AI Classroom for Every Indian Student',
    description:
      'Generate a full AI classroom with teacher, quiz, whiteboard & discussion for any topic. Free. Instant. Made for India.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BharatAI — Bharat Ka Apna AI Classroom',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BharatAI — AI Classroom for Every Indian Student',
    description:
      'Generate a full AI classroom for any topic. Free AI teacher for CBSE, JEE, NEET, UPSC.',
    images: ['/og-image.png'],
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
              url: 'https://bharatai.vercel.app',
              description:
                "India's first multi-agent AI classroom for CBSE, JEE, NEET and UPSC students.",
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://bharatai.vercel.app/?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
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
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                ratingCount: '512',
              },
            }),
          }}
        />
        {/* JSON-LD: FAQPage */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'What is BharatAI?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'BharatAI is India\'s first multi-agent AI classroom platform where you can learn any topic with an AI teacher, AI assistant, quiz system, whiteboard and interactive discussions — all generated instantly from your topic or PDF.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Is BharatAI free to use?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes, BharatAI is completely free to use. Simply bring your own AI API key (OpenAI, Gemini, Claude, DeepSeek, Groq, etc.) and start learning immediately.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Can BharatAI help with JEE, NEET, UPSC and CBSE preparation?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Absolutely. BharatAI is designed for Indian competitive exam preparation. You can generate full AI-powered lessons on Physics, Chemistry, Mathematics, Biology, History, Polity and any other subject relevant to JEE, NEET, UPSC or CBSE board exams.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Does BharatAI support Hindi?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes. BharatAI supports both Hindi (हिन्दी) and English. You can generate lessons, quizzes and discussions in Hindi or English depending on your preference.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Can I upload a PDF and get an AI lesson from it?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes. Upload any PDF — textbook, notes, NCERT chapter or reference material — and BharatAI will instantly generate a complete AI-powered interactive classroom from it including slides, quiz, whiteboard and AI teacher narration.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'What AI models does BharatAI support?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'BharatAI works with all major AI providers: OpenAI (GPT-4o), Google Gemini, Anthropic Claude, DeepSeek, Qwen, Kimi, GLM, Groq, MiniMax, SiliconFlow and any OpenAI-compatible API.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'How many AI agents are in BharatAI classroom?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'BharatAI uses a multi-agent system. By default you get an AI Teacher, AI Assistant, and student agents like Curious Mind, Note Taker and Deep Thinker. You can configure 1 to 6 agents depending on your learning style.',
                  },
                },
              ],
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
            <Toaster position="top-center" />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
