import type { Metadata } from 'next';
import Link from 'next/link';
export const metadata: Metadata = {title:'Privacy Policy — BharatAI',alternates:{canonical:'/privacy'}};
export default function PrivacyPage(){return <main className="mx-auto max-w-3xl px-4 py-12 space-y-5">
<Link href="/">Back to BharatAI</Link><h1 className="text-3xl font-bold">Privacy Policy</h1>
<p>BharatAI operates bharat-ai2.vercel.app. Public learning resources can be read without an account or API key.</p>
<h2 className="text-xl font-semibold">Classroom data and processing</h2><p>Browser-based classrooms, preferences and API keys may be stored in browser storage. Requests for chat, lesson generation, PDF parsing, speech and other features are sent to our server endpoints and may be transmitted to your selected AI or media provider. API-generated classrooms and media may also be stored on the server. Do not submit confidential or sensitive personal information. Provider retention and use are governed by their own terms and privacy policies.</p>
<h2 className="text-xl font-semibold">Hosting and logs</h2><p>Hosting and service providers may process technical information such as IP addresses and request logs for delivery, security and troubleshooting. Contact requests contain the information you choose to send.</p>
<h2 className="text-xl font-semibold">Advertising and cookies</h2><p>Advertising is currently disabled in the application. If Google advertising is enabled in the future, Google and its partners may use cookies or similar identifiers to serve and measure ads, subject to applicable consent requirements. See <a className="underline" href="https://policies.google.com/technologies/partner-sites">how Google uses information from partner sites</a> and <a className="underline" href="https://adssettings.google.com/">Google Ads Settings</a>.</p>
<h2 className="text-xl font-semibold">Your choices</h2><p>Clear browser storage to remove local data and API keys. Revoke keys through your provider if necessary. For questions about server-held data or deletion requests, use our <Link className="underline" href="/contact">contact page</Link>.</p>
<h2 className="text-xl font-semibold">Young learners</h2><p>Students should avoid sharing identifying information and use AI services with appropriate parent or guardian guidance and in accordance with provider age requirements.</p>
</main>}
