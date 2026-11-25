import type { MetadataRoute } from 'next';
import { labs } from '@/lib/virtual-labs';
import { lessons } from '@/lib/public-lessons';
export default function sitemap(): MetadataRoute.Sitemap {
 const base='https://bharat-ai2.vercel.app';
 return ['', '/about','/contact','/privacy','/terms','/learn','/demo','/labs',...labs.map(l=>'/labs/'+l.slug),'/guides','/editorial-policy',...lessons.map(l=>'/learn/'+l.slug)].map(path=>({url:base+path}));
}
