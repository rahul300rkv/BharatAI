import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — BharatAI',
  description: 'Privacy Policy for BharatAI AI Classroom',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Link href="/" className="text-sm text-primary hover:underline mb-8 inline-block">
          ← Back to BharatAI
        </Link>
        
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: November 16, 2026</p>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold">1. Introduction</h2>
            <p>
              BharatAI ("we", "our", or "us") operates the website bharat-ai2.vercel.app 
              (the "Service"). This Privacy Policy explains how we collect, use, and 
              protect your information when you use our AI classroom platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">2. Information We Collect</h2>
            <p>
              BharatAI is designed with privacy in mind. We do <strong>not</strong> store 
              your conversations, PDFs, or generated lessons on our servers. All processing 
              happens using <strong>your own API keys</strong> (Groq, OpenAI, Gemini, Claude, etc.).
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>API keys you enter are stored only in your browser (localStorage).</li>
              <li>We may collect basic anonymous usage analytics (page views, device type).</li>
              <li>If you contact us, we collect the email/name you provide.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">3. Cookies and Advertising</h2>
            <p>
              We use Google AdSense to display advertisements. Google uses cookies 
              (including the DoubleClick cookie) to serve ads based on your prior visits 
              to this and other websites.
            </p>
            <p>
              Google's use of advertising cookies enables it and its partners to serve 
              ads based on your visit to our site and/or other sites on the Internet.
            </p>
            <p>
              You may opt out of personalized advertising by visiting{' '}
              <a 
                href="https://www.google.com/settings/ads" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                Google Ads Settings
              </a>.
            </p>
            <p>
              For more information, see{' '}
              <a 
                href="https://policies.google.com/technologies/ads" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                How Google uses cookies in advertising
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">4. How We Use Information</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To operate and improve the Service</li>
              <li>To display relevant advertisements via Google AdSense</li>
              <li>To respond to support requests</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">5. Data Sharing</h2>
            <p>
              We do not sell your personal data. We may share limited data with:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Google (for AdSense and analytics)</li>
              <li>Service providers who help us operate the site (e.g. Vercel hosting)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">6. Your Rights</h2>
            <p>
              You can clear localStorage in your browser at any time to remove stored 
              API keys and preferences. For any other requests, contact us using the 
              details below.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">7. Contact</h2>
            <p>
              Questions about this Privacy Policy? Email us at:{' '}
              <a href="mailto:rahul.verma300@rediffmail.com" className="text-primary underline">
                YOUR_EMAIL@example.com
              </a>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Replace the email above with your real contact email before deploying.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
