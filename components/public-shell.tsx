'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useState} from 'react';
import {Settings} from 'lucide-react';
import {useI18n} from '@/lib/hooks/use-i18n';
import {useTheme} from '@/lib/hooks/use-theme';
import {LanguageSelect,LabText,SiteText} from '@/components/site-language';
import {SettingsDialog} from '@/components/settings';
import {engagementText} from '@/lib/i18n/engagement';
import {designText} from '@/lib/i18n/learning-design';
import {MobileLearningNav} from '@/components/mobile-learning-nav';
export function PublicShell({children}:{children:React.ReactNode}){
 const path=usePathname(),{locale,t}=useI18n(),{theme,setTheme}=useTheme();const [settings,S]=useState(false);
 if(!path||path.startsWith('/classroom')||path.startsWith('/generation-preview'))return <>{children}</>;
 const items=[{href:'/',label:t('site.home')},{href:'/demo',label:<LabText text="Classrooms"/>},{href:'/labs',label:<LabText text="Labs"/>},{href:'/learn',label:t('site.learn')},{href:'/history',label:engagementText(locale,'history')}];
 return <div className="public-shell min-h-dvh flex flex-col"><header className="border-b bg-background"><div className="site-container flex flex-wrap items-center justify-between gap-3 py-3"><Link href="/" aria-label="BharatAI" className="shrink-0"><img src="/logo-horizontal.svg" alt="BharatAI" className="h-9 sm:h-11 w-auto max-w-[120px]"/></Link><nav aria-label={designText(locale,'resources')} className="hidden sm:flex flex-wrap items-center gap-4 text-sm">{items.map(i=><Link key={i.href} href={i.href} aria-current={i.href==='/'?path==='/'?'page':undefined:path===i.href||path.startsWith(i.href+'/')?'page':undefined} className="site-nav-link">{i.label}</Link>)}</nav><div className="flex items-center gap-2 ms-auto"><LanguageSelect/><select className="site-control max-w-[110px]" aria-label={t('settings.theme')} value={theme} onChange={e=>{const v=e.target.value;if(v==='light'||v==='dark'||v==='system')setTheme(v)}}>{(['light','dark','system'] as const).map(v=><option key={v} value={v}>{t('settings.themeOptions.'+v)}</option>)}</select><button type="button" aria-label={t('settings.title')} title={t('settings.title')} onClick={()=>S(true)} className="site-control p-2"><Settings className="size-5"/></button></div></div></header><div className="flex-1">{children}</div><footer className="border-t mt-8"><div className="site-container py-6 space-y-3 text-center"><p className="text-sm text-muted-foreground">BharatAI · 14 {engagementText(locale,'languages')} · 20 <LabText text="Labs"/></p><nav className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">{(['about','guides','editorial','privacy','terms','contact'] as const).map(k=><Link key={k} href={k==='editorial'?'/editorial-policy':'/'+k} className="hover:underline"><SiteText k={k}/></Link>)}</nav></div></footer><MobileLearningNav/>{settings&&<SettingsDialog open={settings} onOpenChange={S}/>}</div>
}
export function Breadcrumb({parent,title}:{parent?:'labs'|'learn';title:React.ReactNode}){const {t}=useI18n();return <nav className="site-breadcrumb" aria-label={t('site.home')}><Link href="/">{t('site.home')}</Link><span aria-hidden="true">/</span>{parent&&<><Link href={'/'+parent}>{parent==='labs'?<LabText text="Labs"/>:t('site.learn')}</Link><span aria-hidden="true">/</span></>}<span aria-current="page">{title}</span></nav>}
