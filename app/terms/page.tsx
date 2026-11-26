import { PublicLanguageNav, SiteText, EnglishContent } from '@/components/site-language';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  alternates: { canonical: '/terms' },
  title: 'Terms of Service — BharatAI',
};

export default function TermsPage() {
  return (
    <main className="site-page site-reading">
        <h1 className="site-title"><SiteText k="terms"/></h1><EnglishContent>
        <p className="text-sm text-muted-foreground mb-8">Last updated: November 16, 2026</p>

        <div className="space-y-6 text-sm leading-relaxed">
          <p>
            By using BharatAI you agree to these terms. The service is provided "as is". 
            You are responsible for any API costs from the providers you connect 
            (such as NVIDIA or OpenRouter). Public experiments are educational models, not professional advice or safety instructions. AI-generated content may contain errors.
          </p>
          <p>
            You may not use the service for illegal purposes or to generate harmful content. 
            We reserve the right to restrict access if these terms are violated.
          </p>
          <p>
            For the full privacy practices see our{' '}
            <Link href="/privacy" className="text-primary underline">Privacy Policy</Link>.
          </p>
          <p>
            Contact: <a href="mailto:rahul.verma300@rediffmail.com" className="text-primary underline">rahul.verma300@rediffmail.com</a>
          </p>
        </div>
      </EnglishContent></main>
  );
}
