import type { MetadataRoute } from 'next';
import { lessons } from '@/lib/public-lessons';
export default function sitemap(): MetadataRoute.Sitemap {
 const base='https://bharat-ai2.vercel.app';
 return ['', '/about','/contact','/privacy','/terms','/learn','/guides','/editorial-policy',...lessons.map(l=>'/learn/'+l.slug)].map(path=>({url:base+path}));
}
