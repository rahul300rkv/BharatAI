import { PublicLanguageNav, SiteText, EnglishContent } from '@/components/site-language';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  alternates: { canonical: '/contact' },
  title: 'Contact — BharatAI',
  description: 'Contact BharatAI support',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <PublicLanguageNav/><h1 className="text-3xl font-bold mb-2"><SiteText k="contact"/></h1><EnglishContent>
        <p className="text-muted-foreground mb-8">
          We'd love to hear from you. Reach out for support, feedback, or partnership.
        </p>

        <div className="rounded-xl border border-border/50 bg-muted/20 p-6 space-y-4">
          <div>
            <h2 className="font-semibold mb-1">Email</h2>
            <a 
              href="mailto:rahul.verma300@rediffmail.com" 
              className="text-primary text-lg underline"
            >
              rahul.verma300@rediffmail.com
            </a>
          </div>
          
          <div>
            <h2 className="font-semibold mb-1">Response time</h2>
            <p className="text-sm text-muted-foreground">
              We usually reply within 24–48 hours.
            </p>
          </div>

          <div>
            <h2 className="font-semibold mb-1">What to include</h2>
            <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
              <li>Your question or issue</li>
              <li>Browser / device (if reporting a bug)</li>
              <li>Screenshots if helpful</li>
            </ul>
          </div>
        </div>
      </EnglishContent></div></main>
  );
}
