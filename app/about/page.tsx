import { PublicLanguageNav, SiteText, EnglishContent } from '@/components/site-language';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  alternates: { canonical: '/about' },
  title: 'About — BharatAI',
  description: 'About BharatAI — India\'s multi-agent AI classroom',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <PublicLanguageNav/><h1 className="text-3xl font-bold mb-6"><SiteText k="about"/></h1><EnglishContent>

        <div className="space-y-6 text-[15px] leading-relaxed">
          <p>
            <strong>BharatAI</strong> is an India-focused multi-agent AI classroom platform. 
            Open public labs or prepared classrooms without registration, or request a personalised lesson from a supported AI provider 
            with an AI teacher, quizzes, whiteboard, and classroom discussion — in your selected course language.
          </p>

          <p>
            We built BharatAI because most AI tools are made for Western users. 
            Indian students preparing for CBSE, JEE, NEET, and UPSC deserve tools 
            that understand Hinglish, Indian curriculum, and the way we actually learn.
          </p>

          <h2 className="text-xl font-semibold pt-4">Our Mission</h2>
          <p>
            Make public interactive learning resources free and accessible 
            to every Indian student — regardless of language, location, or income.
          </p>

          <h2 className="text-xl font-semibold pt-4">How it works</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Personalised generation may require a provider API key; provider limits and charges may apply.</li>
            <li>Browser sessions use local storage; requests may pass through server endpoints and external AI providers</li>
            <li>Lessons are generated on the fly with multi-agent AI teachers and students</li>
          </ul>

          <h2 className="text-xl font-semibold pt-4">Who built this</h2>
          <p>
            BharatAI is an independent project created by an Indian developer passionate 
            about education and AI. It is independent of NCERT, CBSE and the exam authorities; our resources are not official textbooks or endorsements.
          </p>

          <p className="pt-4">
            Explore our <Link href="/learn" className="text-primary underline">free learning resources</Link> and <Link href="/editorial-policy" className="text-primary underline">editorial policy</Link>. Questions? <Link href="/contact" className="text-primary underline">Contact us</Link>.
          </p>
        </div>
      </EnglishContent></div></main>
  );
}
