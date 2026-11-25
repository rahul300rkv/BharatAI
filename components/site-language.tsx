'use client';
import Link from 'next/link';
import {engagementText} from '@/lib/i18n/engagement';
import {labText} from '@/lib/i18n/lab-ui';
export function LabText({text}:{text:string}){const {locale}=useI18n();return <>{labText(locale,text)}</>}
export function LabTitle({title,hi}:{title:string;hi:string}){const {locale}=useI18n();return <>{locale==='hi-IN'?hi:title}</>}
import { useI18n } from '@/lib/hooks/use-i18n';
import {languages,isLocale} from '@/lib/i18n';
export function LanguageSelect(){const {locale,setLocale,t}=useI18n();return <select aria-label={t('settings.language')} value={locale} onChange={e=>{if(isLocale(e.target.value))setLocale(e.target.value)}} className="rounded-md border bg-background text-foreground p-2 text-sm">{languages.map(l=><option key={l.code} value={l.code} lang={l.code}>{l.native}</option>)}</select>}
export function SiteText({k}:{k:string}){const {t}=useI18n();return <>{t('site.'+k)}</>}
export function PublicLanguageNav(){const {locale}=useI18n();return <nav className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b"><div className="flex flex-wrap gap-x-4 gap-y-2 text-sm"><Link href="/"><SiteText k="home"/></Link><Link href="/labs"><LabText text="Labs"/></Link><Link href="/learn"><SiteText k="learn"/></Link><Link href="/demo"><LabText text="Classrooms"/></Link><Link href="/history">{engagementText(locale,'history')}</Link><Link href="/guides"><SiteText k="guides"/></Link><Link href="/privacy"><SiteText k="privacy"/></Link><Link href="/contact"><SiteText k="contact"/></Link></div><LanguageSelect/></nav>}
export function EnglishContent({children}:{children:React.ReactNode}){const {locale,t}=useI18n();return <>{locale!=='en-US'&&<p className="rounded-md border p-3 text-sm text-muted-foreground">{t('site.fallback')}</p>}<div lang="en" dir="ltr" className="space-y-5">{children}</div></>}
