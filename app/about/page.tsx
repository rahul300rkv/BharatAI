import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About — BharatAI',
  description: 'About BharatAI — India\'s multi-agent AI classroom',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Link href="/" className="text-sm text-primary hover:underline mb-8 inline-block">
          ← Back to BharatAI
        </Link>

        <h1 className="text-3xl font-bold mb-6">About BharatAI</h1>

        <div className="space-y-6 text-[15px] leading-relaxed">
          <p>
            <strong>BharatAI</strong> is India's first multi-agent AI classroom platform. 
            Type any topic or upload a PDF and instantly get a full interactive lesson 
            with an AI teacher, quizzes, whiteboard, and classroom discussion — in Hindi or English.
          </p>

          <p>
            We built BharatAI because most AI tools are made for Western users. 
            Indian students preparing for CBSE, JEE, NEET, and UPSC deserve tools 
            that understand Hinglish, Indian curriculum, and the way we actually learn.
          </p>

          <h2 className="text-xl font-semibold pt-4">Our Mission</h2>
          <p>
            Make high-quality, interactive AI-powered learning free and accessible 
            to every Indian student — regardless of language, location, or income.
          </p>

          <h2 className="text-xl font-semibold pt-4">How it works</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>You bring your own free API key (Groq is recommended and free)</li>
            <li>Your data never leaves your browser — we don't store conversations</li>
            <li>Lessons are generated on the fly with multi-agent AI teachers and students</li>
          </ul>

          <h2 className="text-xl font-semibold pt-4">Who built this</h2>
          <p>
            BharatAI is an independent project created by an Indian developer passionate 
            about education and AI. It is not affiliated with any large corporation.
          </p>

          <p className="pt-4">
            Questions? <Link href="/contact" className="text-primary underline">Contact us</Link>.
          </p>
        </div>
      </div>
    </main>
  );
}
