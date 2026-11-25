'use client';
import Link from 'next/link';
import { useI18n } from '@/lib/hooks/use-i18n';
import {languages,isLocale} from '@/lib/i18n';
export function LanguageSelect(){const {locale,setLocale,t}=useI18n();return <select aria-label={t('settings.language')} value={locale} onChange={e=>{if(isLocale(e.target.value))setLocale(e.target.value)}} className="rounded-md border bg-background text-foreground p-2 text-sm">{languages.map(l=><option key={l.code} value={l.code} lang={l.code}>{l.native}</option>)}</select>}
export function SiteText({k}:{k:string}){const {t}=useI18n();return <>{t('site.'+k)}</>}
export function PublicLanguageNav(){return <nav className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b"><Link href="/" className="underline"><SiteText k="home"/></Link><LanguageSelect/></nav>}
export function EnglishContent({children}:{children:React.ReactNode}){const {locale,t}=useI18n();return <>{locale!=='en-US'&&<p className="rounded-md border p-3 text-sm text-muted-foreground">{t('site.fallback')}</p>}<div lang="en" dir="ltr" className="space-y-5">{children}</div></>}
