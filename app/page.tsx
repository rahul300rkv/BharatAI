'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LearningPreview } from '@/components/learning-preview';
import { designText, localizedLabTitle } from '@/lib/i18n/learning-design';
import { LabText } from '@/components/site-language';
import { LearningHome } from '@/components/learning-home';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import {
  ArrowUp,
  Check,
  ChevronDown,
  Clock,
  Copy,
  ImagePlus,
  Pencil,
  Trash2,
  Settings,
  Sun,
  Moon,
  Monitor,
  BotOff,
  ChevronUp,
} from 'lucide-react';
import { languages, isLocale, type Locale, normalizeLocale } from '@/lib/i18n';
import { SiteText } from '@/components/site-language';
import { useI18n } from '@/lib/hooks/use-i18n';
import { createLogger } from '@/lib/logger';
import { Button } from '@/components/ui/button';
import { Textarea as UITextarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { SettingsDialog } from '@/components/settings';
import { GenerationToolbar } from '@/components/generation/generation-toolbar';
import { AgentBar } from '@/components/agent/agent-bar';
import { useTheme } from '@/lib/hooks/use-theme';
import { nanoid } from 'nanoid';
import { storePdfBlob } from '@/lib/utils/image-storage';
import type { UserRequirements } from '@/lib/types/generation';
import { useSettingsStore } from '@/lib/store/settings';
import { useUserProfileStore, AVATAR_OPTIONS } from '@/lib/store/user-profile';
import {
  StageListItem,
  listStages,
  deleteStageData,
  getFirstSlideByStages,
} from '@/lib/utils/stage-storage';
import { ThumbnailSlide } from '@/components/slide-renderer/components/ThumbnailSlide';
import type { Slide } from '@/lib/types/slides';
import { useMediaGenerationStore } from '@/lib/store/media-generation';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useDraftCache } from '@/lib/hooks/use-draft-cache';
import { SpeechButton } from '@/components/audio/speech-button';

const log = createLogger('Home');

const WEB_SEARCH_STORAGE_KEY = 'webSearchEnabled';
const LANGUAGE_STORAGE_KEY = 'generationLanguage';
const RECENT_OPEN_STORAGE_KEY = 'recentClassroomsOpen';

interface FormState {
  pdfFile: File | null;
  requirement: string;
  language: Locale;
  webSearch: boolean;
}

const initialFormState: FormState = {
  pdfFile: null,
  requirement: '',
  language: 'hi-IN',
  webSearch: false,
};

// ─── API Key Onboarding Banner ────────────────────────────────────────────────
function OnboardingBanner({ onSetupClick }: { onSetupClick: () => void }) {
  const { locale } = useI18n();
  const hi = locale === 'hi-IN';
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem('onboardingDismissed') === 'true') setDismissed(true);
    } catch { /* ignore */ }
  }, []);

  if (dismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="w-full max-w-[800px] mb-4 rounded-2xl border border-primary/20 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3"
    >
      <span className="text-2xl shrink-0">🔑</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-orange-900 dark:text-orange-200">
          {hi ? 'कक्षा बनाने के लिए AI API कुंजी सेट करें' : 'Set up an AI API key to generate a classroom'}
        </p>
        <p className="text-xs text-orange-700/80 dark:text-orange-300/70 mt-0.5 leading-relaxed">
          {hi ? 'NVIDIA की API कुंजी यहाँ प्राप्त करें: ' : 'Get an NVIDIA API key at ' }
          <a
            href="https://build.nvidia.com/models"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-medium hover:text-orange-900 dark:hover:text-orange-100 transition-colors"
          >
            build.nvidia.com
          </a>
          {hi ? '। फिर सेटिंग्स में LLM अनुभाग खोलकर API कुंजी जोड़ें। OpenAI, Gemini, Claude और अन्य प्रदाता भी समर्थित हैं। प्रदाता की शुल्क व उपयोग सीमाएँ लागू हो सकती हैं।' : '. Then open Settings → LLM and add your API key. Other providers are supported. Provider charges and limits may apply.'}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onSetupClick}
          className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm"
        >
          {hi ? 'अभी सेट करें' : 'Set up now'}
        </button>
        <button
          onClick={() => {
            setDismissed(true);
            try { localStorage.setItem('onboardingDismissed', 'true'); } catch { /* ignore */ }
          }}
          className="px-2 py-1.5 rounded-lg text-xs text-orange-600/60 hover:text-orange-700 dark:text-orange-400/60 dark:hover:text-orange-300 transition-colors"
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
}

function HomePage() {
  const { t, locale, setLocale } = useI18n();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialFormState);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsSection, setSettingsSection] = useState<
    import('@/lib/types/settings').SettingsSection | undefined
  >(undefined);

 // Draft cache for requirement text
const {
  cachedValue: cachedRequirement,
  updateCache: updateRequirementCache,
} = useDraftCache<string>({ key: 'requirementDraft' });

/* eslint-disable react-hooks/set-state-in-effect */
useEffect(() => {
  if (!cachedRequirement) return;

  setForm((prev) =>
    prev.requirement === cachedRequirement
      ? prev
      : { ...prev, requirement: cachedRequirement },
  );
}, [cachedRequirement]);
/* eslint-enable react-hooks/set-state-in-effect */

  // Model setup state
  const currentModelId = useSettingsStore((s) => s.modelId);
  const [recentOpen, setRecentOpen] = useState(true);

  // Hydrate client-only state after mount (avoids SSR mismatch)
  /* eslint-disable react-hooks/set-state-in-effect -- Hydration from localStorage must happen in effect */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_OPEN_STORAGE_KEY);
      if (saved !== null) setRecentOpen(saved !== 'false');
    } catch {
      /* localStorage unavailable */
    }
    try {
      const savedWebSearch = localStorage.getItem(WEB_SEARCH_STORAGE_KEY);
      const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      const updates: Partial<FormState> = {};
      if (savedWebSearch === 'true') updates.webSearch = true;
      if (isLocale(savedLanguage)) {
        updates.language = savedLanguage;
      } else {
        const detected = normalizeLocale(navigator.language);
        updates.language = detected;
      }
      if (Object.keys(updates).length > 0) {
        setForm((prev) => ({ ...prev, ...updates }));
      }
    } catch {
      /* localStorage unavailable */
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Restore requirement draft from cache (derived state pattern — no effect needed)
  const [prevCachedRequirement, setPrevCachedRequirement] = useState(cachedRequirement);
  if (cachedRequirement !== prevCachedRequirement) {
    setPrevCachedRequirement(cachedRequirement);
    if (cachedRequirement) {
      setForm((prev) => ({ ...prev, requirement: cachedRequirement }));
    }
  }

  const [languageOpen, setLanguageOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [classrooms, setClassrooms] = useState<StageListItem[]>([]);
  const [thumbnails, setThumbnails] = useState<Record<string, Slide>>({});
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    if (!languageOpen && !themeOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setLanguageOpen(false);
        setThemeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [languageOpen, themeOpen]);

  const loadClassrooms = async () => {
    try {
      const list = await listStages();
      setClassrooms(list);
      // Load first slide thumbnails
      if (list.length > 0) {
        const slides = await getFirstSlideByStages(list.map((c) => c.id));
        setThumbnails(slides);
      }
    } catch (err) {
      log.error('Failed to load classrooms:', err);
    }
  };

  useEffect(() => {
    // Clear stale media store to prevent cross-course thumbnail contamination.
    // The store may hold tasks from a previously visited classroom whose elementIds
    // (gen_img_1, etc.) collide with other courses' placeholders.
    useMediaGenerationStore.getState().revokeObjectUrls();
    useMediaGenerationStore.setState({ tasks: {} });

    // eslint-disable-next-line react-hooks/set-state-in-effect -- Store hydration on mount
    loadClassrooms();
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPendingDeleteId(id);
  };

  const confirmDelete = async (id: string) => {
    setPendingDeleteId(null);
    try {
      await deleteStageData(id);
      await loadClassrooms();
    } catch (err) {
      log.error('Failed to delete classroom:', err);
      toast.error(locale === 'hi-IN' ? 'कक्षा हटाने में विफल' : 'Failed to delete classroom');
    }
  };

  const updateForm = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    try {
      if (field === 'webSearch') localStorage.setItem(WEB_SEARCH_STORAGE_KEY, String(value));
      if (field === 'language') localStorage.setItem(LANGUAGE_STORAGE_KEY, String(value));
      if (field === 'requirement') updateRequirementCache(value as string);
    } catch {
      /* ignore */
    }
  };

  const showSetupToast = (icon: React.ReactNode, title: string, desc: string) => {
    toast.custom(
      (id) => (
        <div
          className="w-[356px] rounded-xl border border-amber-200/60 dark:border-amber-800/40 bg-gradient-to-r from-amber-50 via-white to-amber-50 dark:from-amber-950/60 dark:via-slate-900 dark:to-amber-950/60 shadow-lg shadow-amber-500/8 dark:shadow-amber-900/20 p-4 flex items-start gap-3 cursor-pointer"
          onClick={() => {
            toast.dismiss(id);
            setSettingsOpen(true);
          }}
        >
          <div className="shrink-0 mt-0.5 size-9 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center ring-1 ring-amber-200/50 dark:ring-amber-800/30">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-900 dark:text-amber-200 leading-tight">
              {title}
            </p>
            <p className="text-xs text-amber-700/80 dark:text-amber-400/70 mt-0.5 leading-relaxed">
              {desc}
            </p>
          </div>
          <div className="shrink-0 mt-1 text-[10px] font-medium text-amber-500 dark:text-amber-500/70 tracking-wide">
            <Settings className="size-3.5 animate-[spin_3s_linear_infinite]" />
          </div>
        </div>
      ),
      { duration: 4000 },
    );
  };

  const handleGenerate = async () => {
    // Validate setup before proceeding
    if (!currentModelId) {
      showSetupToast(
        <BotOff className="size-4.5 text-amber-600 dark:text-amber-400" />,
        t('settings.modelNotConfigured'),
        t('settings.setupNeeded'),
      );
      setSettingsOpen(true);
      return;
    }

    if (!form.requirement.trim()) {
      setError(t('upload.requirementRequired'));
      return;
    }

    setError(null);

    try {
      const userProfile = useUserProfileStore.getState();
      const requirements: UserRequirements = {
        requirement: form.requirement,
        language: form.language,
        userNickname: userProfile.nickname || undefined,
        userBio: userProfile.bio || undefined,
        webSearch: form.webSearch || undefined,
      };

      let pdfStorageKey: string | undefined;
      let pdfFileName: string | undefined;
      let pdfProviderId: string | undefined;
      let pdfProviderConfig: { apiKey?: string; baseUrl?: string } | undefined;

      if (form.pdfFile) {
        pdfStorageKey = await storePdfBlob(form.pdfFile);
        pdfFileName = form.pdfFile.name;

        const settings = useSettingsStore.getState();
        pdfProviderId = settings.pdfProviderId;
        const providerCfg = settings.pdfProvidersConfig?.[settings.pdfProviderId];
        if (providerCfg) {
          pdfProviderConfig = {
            apiKey: providerCfg.apiKey,
            baseUrl: providerCfg.baseUrl,
          };
        }
      }

      const sessionState = {
        sessionId: nanoid(),
        requirements,
        pdfText: '',
        pdfImages: [],
        imageStorageIds: [],
        pdfStorageKey,
        pdfFileName,
        pdfProviderId,
        pdfProviderConfig,
        sceneOutlines: null,
        currentStep: 'generating' as const,
      };
      sessionStorage.setItem('generationSession', JSON.stringify(sessionState));

      router.push('/generation-preview');
    } catch (err) {
      log.error('Error preparing generation:', err);
      setError(err instanceof Error ? err.message : t('upload.generateFailed'));
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return t('classroom.today');
    if (diffDays === 1) return t('classroom.yesterday');
    if (diffDays < 7) return `${diffDays} ${t('classroom.daysAgo')}`;
    return date.toLocaleDateString(locale);
  };

  const canGenerate = !!form.requirement.trim();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      if (canGenerate) handleGenerate();
    }
  };

  return (
    <div className="learning-hero relative w-full flex flex-col items-center px-4 pt-16 sm:px-8 sm:pt-20 overflow-x-clip">
      {/* ═══ Top-right pill (unchanged) ═══ */}
      <div
        ref={toolbarRef}
        className="fixed top-4 right-4 z-50 flex items-center gap-1 bg-popover/95 backdrop-blur-md px-2 py-1.5 rounded-full border border-primary/15 shadow-sm"
      >
        {/* Language Selector */}
          <div className="relative" >
            <select aria-label={t('settings.language')} value={locale} onChange={e=>{const value=e.target.value;if(isLocale(value)){setLocale(value);updateForm('language',value);}setLanguageOpen(false);setThemeOpen(false);}} className="max-w-[110px] rounded-full bg-background text-foreground px-2 py-1 text-xs border">
            {languages.map(l=><option key={l.code} value={l.code} lang={l.code}>{l.native}</option>)}
            </select>
          </div>


        <div className="w-[1px] h-4 bg-border" />

        {/* Theme Selector */}
        <div className="relative">
          <button
            onClick={() => {
              setThemeOpen(!themeOpen);
              setLanguageOpen(false);
            }}
            className="p-2 rounded-full text-muted-foreground hover:bg-primary/8 hover:text-primary hover:shadow-sm transition-all"
          >
            {theme === 'light' && <Sun className="w-4 h-4" />}
            {theme === 'dark' && <Moon className="w-4 h-4" />}
            {theme === 'system' && <Monitor className="w-4 h-4" />}
          </button>
          {themeOpen && (
            <div className="absolute top-full mt-2 right-0 bg-popover border border-primary/15 rounded-xl shadow-lg overflow-hidden z-50 min-w-[140px]">
              <button
                onClick={() => {
                  setTheme('light');
                  setThemeOpen(false);
                }}
                className={cn(
                  'w-full px-4 py-2 text-left text-sm hover:bg-primary/8 hover:text-primary transition-colors flex items-center gap-2',
                  theme === 'light' &&
                    'bg-primary/8 dark:bg-primary/15 text-primary dark:text-primary',
                )}
              >
                <Sun className="w-4 h-4" />
                {t('settings.themeOptions.light')}
              </button>
              <button
                onClick={() => {
                  setTheme('dark');
                  setThemeOpen(false);
                }}
                className={cn(
                  'w-full px-4 py-2 text-left text-sm hover:bg-primary/8 hover:text-primary transition-colors flex items-center gap-2',
                  theme === 'dark' &&
                    'bg-primary/8 dark:bg-primary/15 text-primary dark:text-primary',
                )}
              >
                <Moon className="w-4 h-4" />
                {t('settings.themeOptions.dark')}
              </button>
              <button
                onClick={() => {
                  setTheme('system');
                  setThemeOpen(false);
                }}
                className={cn(
                  'w-full px-4 py-2 text-left text-sm hover:bg-primary/8 hover:text-primary transition-colors flex items-center gap-2',
                  theme === 'system' &&
                    'bg-primary/8 dark:bg-primary/15 text-primary dark:text-primary',
                )}
              >
                <Monitor className="w-4 h-4" />
                {t('settings.themeOptions.system')}
              </button>
            </div>
          )}
        </div>

        <div className="w-[1px] h-4 bg-border" />

        {/* Settings Button */}
        <div className="relative">
          <button
            onClick={() => setSettingsOpen(true)}
            className="p-2 rounded-full text-muted-foreground hover:bg-primary/8 hover:text-primary hover:shadow-sm transition-all group"
          >
            <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
          </button>
        </div>
      </div>
      <SettingsDialog
        open={settingsOpen}
        onOpenChange={(open) => {
          setSettingsOpen(open);
          if (!open) setSettingsSection(undefined);
        }}
        initialSection={settingsSection}
      />

      {/* ═══ Hero section: title + input (centered, wider) ═══ */}
      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={cn(
          'relative z-20 w-full max-w-[800px] flex flex-col items-center',
          'justify-center py-8',
        )}
      >
        {/* ── Logo ── */}
        <motion.img
          src="/logo-horizontal.svg"
          alt="BharatAI"
          initial={false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.1,
            type: 'spring',
            stiffness: 200,
            damping: 20,
          }}
          className="h-14 md:h-20 mb-3 -ml-2 md:-ml-3 drop-shadow-sm"
        />

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold text-center mb-3 tracking-tight max-w-3xl">{designText(locale,'hero')}</h1>
        <p className="text-center text-base text-muted-foreground max-w-xl mb-4">{designText(locale,'intro')}</p>
        <nav aria-label={designText(locale,'resources')} className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm mb-6"><Link href="/demo"><LabText text="Free demo classrooms"/></Link><Link href="/labs"><LabText text="Labs"/></Link><Link href="/learn"><SiteText k="learn"/></Link><Link href="/guides"><SiteText k="guides"/></Link></nav>
        {/* ── Unified input area ── */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35 }}
          className="w-full"
        >
          <div className="w-full rounded-2xl border border-border/60 bg-card shadow-xl shadow-black/[0.04] dark:shadow-black/25 transition-shadow focus-within:shadow-2xl focus-within:shadow-primary/[0.08] focus-within:border-primary/30">
            {/* ── Greeting + Profile + Agents ── */}
            <div className="relative z-20 flex items-start justify-between">
              <GreetingBar />
              <div className="pr-3 pt-3.5 shrink-0">
                <AgentBar />
              </div>
            </div>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              placeholder={designText(locale,'prompt')}
              aria-label={designText(locale,'prompt')}
              className="w-full resize-none border-0 bg-transparent px-4 pt-1 pb-2 text-base leading-relaxed placeholder:text-muted-foreground focus:outline-none min-h-[104px] max-h-[300px]"
              value={form.requirement}
              onChange={(e) => updateForm('requirement', e.target.value)}
              onKeyDown={handleKeyDown}
              rows={4}
            />

            {/* Toolbar row */}
            <div className="px-3 pb-3 flex items-end gap-2">
              <div className="flex-1 min-w-0">
                <GenerationToolbar
                  language={form.language}
                  onLanguageChange={(lang) => updateForm('language', lang)}
                  webSearch={form.webSearch}
                  onWebSearchChange={(v) => updateForm('webSearch', v)}
                  onSettingsOpen={(section) => {
                    setSettingsSection(section);
                    setSettingsOpen(true);
                  }}
                  pdfFile={form.pdfFile}
                  onPdfFileChange={(f) => updateForm('pdfFile', f)}
                  onPdfError={setError}
                />
              </div>

              {/* Voice input */}
              <SpeechButton
                size="md"
                onTranscription={(text) => {
                  setForm((prev) => {
                    const next = prev.requirement + (prev.requirement ? ' ' : '') + text;
                    updateRequirementCache(next);
                    return { ...prev, requirement: next };
                  });
                }}
              />

              {/* Send button */}
              <button
                onClick={handleGenerate}
                disabled={!canGenerate}
                className={cn(
                  'shrink-0 h-8 rounded-lg flex items-center justify-center gap-1.5 transition-all px-3',
                  canGenerate
                    ? 'bg-primary text-primary-foreground hover:opacity-95 shadow-md shadow-primary/30 cursor-pointer transition-all hover:shadow-lg hover:shadow-primary/35 hover:-translate-y-px'
                    : 'bg-muted text-muted-foreground/40 cursor-not-allowed',
                )}
              >
                <span className="text-xs font-medium">{designText(locale,'create')}</span>
                <ArrowUp className="size-3.5" />
              </button>
            </div>
          </div>
        </motion.div>

        <div className="w-full flex flex-wrap gap-2 mt-4 items-center"><span className="text-sm text-muted-foreground">{designText(locale,'topics')}</span>{(['ohms-law','projectile-motion','quadratic-equations'] as const).map(slug=><button type="button" key={slug} className="rounded-full border bg-card px-3 py-2 text-sm hover:border-primary" onClick={()=>{updateForm('requirement',localizedLabTitle(locale,slug));textareaRef.current?.focus()}}>{localizedLabTitle(locale,slug)}</button>)}</div>
        <div className="mt-5 w-full text-center space-y-2"><p className="text-sm font-medium">{designText(locale,'free')}</p><div className="flex flex-wrap justify-center gap-3"><Link href="/demo" className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"><LabText text="Free demo classrooms"/></Link><Link href="/labs" className="rounded-xl border px-4 py-3 text-sm font-semibold"><LabText text="Free virtual labs"/></Link></div><p className="text-sm text-muted-foreground">{designText(locale,'key')}</p></div>
      {/* ═══ Onboarding banner — shown until dismissed or model configured ═══ */}
      {!currentModelId && (
        <div className="relative z-20 w-full max-w-[800px] mt-4">
          <AnimatePresence>
            <OnboardingBanner
              onSetupClick={() => {
                setSettingsSection('providers' as import('@/lib/types/settings').SettingsSection);
                setSettingsOpen(true);
              }}
            />
          </AnimatePresence>
        </div>
      )}


        {/* ── Error ── */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 w-full p-3 bg-destructive/10 border border-destructive/20 rounded-lg"
            >
              <p className="text-sm text-destructive">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ═══ Recent classrooms — collapsible ═══ */}
      {classrooms.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="relative z-10 mt-10 w-full max-w-6xl flex flex-col items-center"
        >
          {/* Trigger — divider-line with centered text */}
          <button
            onClick={() => {
              const next = !recentOpen;
              setRecentOpen(next);
              try {
                localStorage.setItem(RECENT_OPEN_STORAGE_KEY, String(next));
              } catch {
                /* ignore */
              }
            }}
            className="group w-full flex items-center gap-4 py-2 cursor-pointer"
          >
            <div className="flex-1 h-px bg-border/40 group-hover:bg-border/70 transition-colors" />
            <span className="shrink-0 flex items-center gap-2 text-[13px] text-muted-foreground/60 group-hover:text-foreground/70 transition-colors select-none">
              <Clock className="size-3.5" />
              {t('classroom.recentClassrooms')}
              <span className="text-[11px] tabular-nums opacity-60">{classrooms.length}</span>
              <motion.div
                animate={{ rotate: recentOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <ChevronDown className="size-3.5" />
              </motion.div>
            </span>
            <div className="flex-1 h-px bg-border/40 group-hover:bg-border/70 transition-colors" />
          </button>

          {/* Expandable content */}
          <AnimatePresence>
            {recentOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                className="w-full overflow-hidden"
              >
                <div className="pt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8">
                  {classrooms.map((classroom, i) => (
                    <motion.div
                      key={classroom.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: i * 0.04,
                        duration: 0.35,
                        ease: 'easeOut',
                      }}
                    >
                      <ClassroomCard
                        classroom={classroom}
                        slide={thumbnails[classroom.id]}
                        formatDate={formatDate}
                        onDelete={handleDelete}
                        confirmingDelete={pendingDeleteId === classroom.id}
                        onConfirmDelete={() => confirmDelete(classroom.id)}
                        onCancelDelete={() => setPendingDeleteId(null)}
                        onClick={() => router.push(`/classroom/${classroom.id}`)}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Footer — flows with content, at the very end */}
      <div className="mt-auto pt-12 pb-4 text-center text-xs text-muted-foreground/50 flex flex-col items-center gap-1">
        {locale === 'hi-IN' ? 'BharatAI — भारत की अपनी AI कक्षा 🇮🇳' : 'BharatAI — Bharat ka Apna AI Classroom 🇮🇳'}
      </div>
    </div>
  );
}

// ─── Greeting Bar — avatar + "Hi, Name", click to edit in-place ────
const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

function isCustomAvatar(src: string) {
  return src.startsWith('data:');
}

function GreetingBar() {
  const { t } = useI18n();
  const avatar = useUserProfileStore((s) => s.avatar);
  const nickname = useUserProfileStore((s) => s.nickname);
  const bio = useUserProfileStore((s) => s.bio);
  const setAvatar = useUserProfileStore((s) => s.setAvatar);
  const setNickname = useUserProfileStore((s) => s.setNickname);
  const setBio = useUserProfileStore((s) => s.setBio);

  const [open, setOpen] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const displayName = nickname || t('profile.defaultNickname');

  // Click-outside to collapse
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setEditingName(false);
        setAvatarPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const startEditName = () => {
    setNameDraft(nickname);
    setEditingName(true);
    setTimeout(() => nameInputRef.current?.focus(), 50);
  };

  const commitName = () => {
    setNickname(nameDraft.trim());
    setEditingName(false);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_AVATAR_SIZE) {
      toast.error(t('profile.fileTooLarge'));
      return;
    }
    if (!file.type.startsWith('image/')) {
      toast.error(t('profile.invalidFileType'));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d')!;
        const scale = Math.max(128 / img.width, 128 / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        ctx.drawImage(img, (128 - w) / 2, (128 - h) / 2, w, h);
        setAvatar(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div ref={containerRef} className="relative pl-4 pr-2 pt-3.5 pb-1 w-auto">
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAvatarUpload}
      />

      {/* ── Collapsed pill (always in flow) ── */}
      {!open && (
        <div
          className="flex items-center gap-2.5 cursor-pointer transition-all duration-200 group rounded-full px-2.5 py-1.5 border border-primary/15 text-muted-foreground/70 hover:text-foreground hover:bg-muted/60 active:scale-[0.97]"
          onClick={() => setOpen(true)}
        >
          <div className="shrink-0 relative">
            <div className="size-8 rounded-full overflow-hidden ring-[1.5px] ring-border/30 group-hover:ring-primary/60 dark:group-hover:ring-primary/50 transition-all duration-300">
              <img src={avatar} alt="" className="size-full object-cover" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full bg-card border border-border/40 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity">
              <Pencil className="size-[7px] text-muted-foreground/70" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="leading-none select-none flex items-center gap-1">
                  <span>
                    <span className="text-xs text-muted-foreground/60 group-hover:text-muted-foreground transition-colors">
                      {t('home.greeting')}
                    </span>
                    <span className="text-[13px] font-semibold text-foreground/85 group-hover:text-foreground transition-colors">
                      {displayName}
                    </span>
                  </span>
                  <ChevronDown className="size-3 text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors shrink-0" />
                </span>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={4}>
                {t('profile.editTooltip')}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      )}

      {/* ── Expanded panel (absolute, floating) ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute left-4 top-3.5 z-50 w-64"
          >
            <div className="rounded-2xl bg-[#FFF9F2]/98 dark:bg-[#2A1500]/98 backdrop-blur-sm ring-1 ring-primary/[0.04] dark:ring-white/[0.06] shadow-[0_1px_8px_-2px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_8px_-2px_rgba(0,0,0,0.3)] px-2.5 py-2">
              {/* ── Row: avatar + name ── */}
              <div
                className="flex items-center gap-2.5 cursor-pointer transition-all duration-200"
                onClick={() => {
                  setOpen(false);
                  setEditingName(false);
                  setAvatarPickerOpen(false);
                }}
              >
                {/* Avatar */}
                <div
                  className="shrink-0 relative cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAvatarPickerOpen(!avatarPickerOpen);
                  }}
                >
                  <div className="size-8 rounded-full overflow-hidden ring-[1.5px] ring-primary/55 dark:ring-primary/40 transition-all duration-300">
                    <img src={avatar} alt="" className="size-full object-cover" />
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full bg-card dark:bg-card border border-border/60 flex items-center justify-center"
                  >
                    <ChevronDown
                      className={cn(
                        'size-2 text-muted-foreground/70 transition-transform duration-200',
                        avatarPickerOpen && 'rotate-180',
                      )}
                    />
                  </motion.div>
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  {editingName ? (
                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <input
                        ref={nameInputRef}
                        value={nameDraft}
                        onChange={(e) => setNameDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') commitName();
                          if (e.key === 'Escape') {
                            setEditingName(false);
                          }
                        }}
                        onBlur={commitName}
                        maxLength={20}
                        placeholder={t('profile.defaultNickname')}
                        className="flex-1 min-w-0 h-6 bg-transparent border-b border-border/80 text-[13px] font-semibold text-foreground outline-none placeholder:text-muted-foreground/40"
                      />
                      <button
                        onClick={commitName}
                        className="shrink-0 size-5 rounded flex items-center justify-center text-primary hover:bg-primary/10"
                      >
                        <Check className="size-3" />
                      </button>
                    </div>
                  ) : (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditName();
                      }}
                      className="group/name inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span className="text-[13px] font-semibold text-foreground/85 group-hover/name:text-foreground transition-colors">
                        {displayName}
                      </span>
                      <Pencil className="size-2.5 text-muted-foreground/30 opacity-0 group-hover/name:opacity-100 transition-opacity" />
                    </span>
                  )}
                </div>

                {/* Collapse arrow */}
                <motion.div
                  initial={{ opacity: 0, y: -2 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="shrink-0 size-6 rounded-full flex items-center justify-center hover:bg-primary/6 dark:hover:bg-primary/8 transition-colors"
                >
                  <ChevronUp className="size-3.5 text-muted-foreground/50" />
                </motion.div>
              </div>

              {/* ── Expandable content ── */}
              <div className="pt-2" onClick={(e) => e.stopPropagation()}>
                {/* Avatar picker */}
                <AnimatePresence>
                  {avatarPickerOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.15, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="p-1 pb-2.5 flex items-center gap-1.5 flex-wrap">
                        {AVATAR_OPTIONS.map((url) => (
                          <button
                            key={url}
                            onClick={() => setAvatar(url)}
                            className={cn(
                              'size-7 rounded-full overflow-hidden bg-muted/40 dark:bg-card cursor-pointer transition-all duration-150',
                              'hover:scale-110 active:scale-95',
                              avatar === url
                                ? 'ring-2 ring-primary dark:ring-primary ring-offset-0'
                                : 'hover:ring-1 hover:ring-muted-foreground/30',
                            )}
                          >
                            <img src={url} alt="" className="size-full" />
                          </button>
                        ))}
                        <label
                          className={cn(
                            'size-7 rounded-full flex items-center justify-center cursor-pointer transition-all duration-150 border border-dashed',
                            'hover:scale-110 active:scale-95',
                            isCustomAvatar(avatar)
                              ? 'ring-2 ring-primary dark:ring-primary ring-offset-0 border-primary/50 dark:border-primary/60 bg-primary/8 dark:bg-primary/15'
                              : 'border-muted-foreground/30 text-muted-foreground/50 hover:border-muted-foreground/50',
                          )}
                          onClick={() => avatarInputRef.current?.click()}
                          title={t('profile.uploadAvatar')}
                        >
                          <ImagePlus className="size-3" />
                        </label>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Bio */}
                <UITextarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder={t('profile.bioPlaceholder')}
                  maxLength={200}
                  rows={2}
                  className="resize-none border-border/40 bg-transparent min-h-[72px] !text-[13px] !leading-relaxed placeholder:!text-[11px] placeholder:!leading-relaxed focus-visible:ring-1 focus-visible:ring-border/60"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Classroom Card — clean, minimal style ──────────────────────
function ClassroomCard({
  classroom,
  slide,
  formatDate,
  onDelete,
  confirmingDelete,
  onConfirmDelete,
  onCancelDelete,
  onClick,
}: {
  classroom: StageListItem;
  slide?: Slide;
  formatDate: (ts: number) => string;
  onDelete: (id: string, e: React.MouseEvent) => void;
  confirmingDelete: boolean;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
  onClick: () => void;
}) {
  const { t } = useI18n();
  const thumbRef = useRef<HTMLDivElement>(null);
  const [thumbWidth, setThumbWidth] = useState(0);

  useEffect(() => {
    const el = thumbRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setThumbWidth(Math.round(entry.contentRect.width));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="group cursor-pointer" onClick={confirmingDelete ? undefined : onClick}>
      {/* Thumbnail — large radius, no border, subtle bg */}
      <div
        ref={thumbRef}
        className="relative w-full aspect-[16/9] rounded-2xl bg-muted/60 dark:bg-[#2A1500]/80 border border-border/50 overflow-hidden transition-transform duration-200 group-hover:scale-[1.02] group-hover:border-primary/30 group-hover:shadow-md group-hover:shadow-primary/10"
      >
        {slide && thumbWidth > 0 ? (
          <ThumbnailSlide
            slide={slide}
            size={thumbWidth}
            viewportSize={slide.viewportSize ?? 1000}
            viewportRatio={slide.viewportRatio ?? 0.5625}
          />
        ) : !slide ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="size-12 rounded-2xl bg-gradient-to-br from-primary/10 to-[#006B8F]/10 dark:from-primary/20 dark:to-[#006B8F]/15 flex items-center justify-center">
              <span className="text-xl opacity-50">📄</span>
            </div>
          </div>
        ) : null}

        {/* Delete — top-right, only on hover */}
        <AnimatePresence>
          {!confirmingDelete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 size-7 opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 hover:bg-destructive/80 text-white hover:text-white backdrop-blur-sm rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(classroom.id, e);
                }}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Inline delete confirmation overlay */}
        <AnimatePresence>
          {confirmingDelete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-black/50 backdrop-blur-[6px]"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-[13px] font-medium text-white/90">
                {t('classroom.deleteConfirmTitle')}?
              </span>
              <div className="flex gap-2">
                <button
                  className="px-3.5 py-1 rounded-lg text-[12px] font-medium bg-white/15 text-white/80 hover:bg-white/25 backdrop-blur-sm transition-colors"
                  onClick={onCancelDelete}
                >
                  {t('common.cancel')}
                </button>
                <button
                  className="px-3.5 py-1 rounded-lg text-[12px] font-medium bg-red-500/90 text-white hover:bg-red-500 transition-colors"
                  onClick={onConfirmDelete}
                >
                  {t('classroom.delete')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info — outside the thumbnail */}
      <div className="mt-2.5 px-1 flex items-center gap-2">
        <span className="shrink-0 inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[11px] font-medium text-primary">
          {classroom.sceneCount} {t('classroom.slides')} · {formatDate(classroom.updatedAt)}
        </span>
        <Tooltip>
          <TooltipTrigger asChild>
            <p className="font-medium text-[15px] truncate text-foreground/90 min-w-0">
              {classroom.name}
            </p>
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
            sideOffset={4}
            className="!max-w-[min(90vw,32rem)] break-words whitespace-normal"
          >
            <div className="flex items-center gap-1.5">
              <span className="break-all">{classroom.name}</span>
              <button
                className="shrink-0 p-0.5 rounded hover:bg-foreground/10 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(classroom.name);
                  toast.success(t('classroom.nameCopied'));
                }}
              >
                <Copy className="size-3 opacity-60" />
              </button>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

// ─── Static SEO content — visible to crawlers, subtle for users ──────────────
function SEOContent() {
  const { locale } = useI18n();
  const tr = (en: string, hi: string) => locale === 'hi-IN' ? hi : en;
  return (
    <section aria-label="About BharatAI" className="w-full max-w-4xl mx-auto px-4 pb-16 mt-4">
      {/* Features */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-center mb-2 text-foreground/80">
          {tr("What BharatAI Offers","BharatAI की विशेषताएँ")}
        </h2>
        <p className="text-center text-sm text-muted-foreground/70 mb-8">
          {tr("An interactive AI classroom — built for CBSE, JEE, NEET & UPSC","CBSE, JEE, NEET और UPSC के लिए इंटरैक्टिव AI कक्षा")}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              emoji: '🎓',
              title: tr("Multi-Agent AI Classroom","मल्टी-एजेंट AI कक्षा"),
              desc: tr("A full class with AI Teacher, AI Assistant, and student agents who discuss, debate and explain — not just one bot answering questions.","AI शिक्षक, सहायक और छात्र एजेंट मिलकर चर्चा करते हैं, प्रश्न पूछते हैं और विषय समझाते हैं।"),
            },
            {
              emoji: '📄',
              title: tr("PDF to Lesson in Seconds","PDF से इंटरैक्टिव पाठ"),
              desc: tr("Upload your NCERT chapter, notes or any PDF and generate an interactive lesson with slides, quiz and whiteboard where supported.","NCERT अध्याय, नोट्स या PDF अपलोड करें और स्लाइड, प्रश्नोत्तरी तथा व्हाइटबोर्ड सहित पाठ तैयार करें।"),
            },
            {
              emoji: '🇮🇳',
              title: tr("13 Indian languages + English","13 भारतीय भाषाएँ और अंग्रेज़ी"),
              desc: tr("Choose a course language from 13 Indian languages or English. Output quality depends on your AI model.","पाठ के लिए 13 भारतीय भाषाओं या अंग्रेज़ी में से चुनें। परिणाम की गुणवत्ता चयनित AI मॉडल पर निर्भर करती है।"),
            },
            {
              emoji: '📝',
              title: tr("Auto-Generated Quizzes","स्वचालित प्रश्नोत्तरी"),
              desc: tr("Generated lessons may include MCQs, short answers and AI-graded quizzes to test understanding — like a real exam practice.","बहुविकल्पीय और लघु उत्तरीय प्रश्नों के माध्यम से अपनी समझ जाँचें। AI मूल्यांकन भी उपलब्ध है।"),
            },
            {
              emoji: '🖊️',
              title: tr("Interactive Whiteboard","इंटरैक्टिव व्हाइटबोर्ड"),
              desc: tr("AI teacher draws diagrams, writes formulas and explains concepts on a live whiteboard — just like a real class.","AI शिक्षक व्हाइटबोर्ड पर आरेख और सूत्र बनाकर अवधारणाएँ समझाता है।"),
            },
            {
              emoji: '🔒',
              title: tr("Your API Key and Data","आपकी API कुंजी और डेटा"),
              desc: tr("BharatAI runs on your own AI API key. Requests may pass through our server and your chosen AI provider.","BharatAI आपकी AI API कुंजी का उपयोग कर सकता है। अनुरोध हमारे सर्वर और चयनित AI प्रदाता तक जा सकते हैं।"),
            },
          ].map(({ emoji, title, desc }) => (
            <div
              key={title}
              className="rounded-xl border border-border/40 bg-muted/20 p-4 flex flex-col gap-2"
            >
              <span className="text-2xl">{emoji}</span>
              <h3 className="font-semibold text-sm text-foreground/85">{title}</h3>
              <p className="text-xs text-muted-foreground/70 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Use cases */}
      <div className="mb-12 rounded-xl border border-border/40 bg-muted/20 p-6">
        <h2 className="text-lg font-bold mb-4 text-foreground/80">{tr("Who BharatAI Is Designed For","BharatAI किसके लिए है?")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: tr("Class 10–12 CBSE Students","CBSE कक्षा 10–12 के विद्यार्थी"), detail: tr("Learn Science, Maths, Social Science with AI explanations and auto-generated notes.","AI की व्याख्याओं और नोट्स से विज्ञान, गणित तथा सामाजिक विज्ञान पढ़ें।") },
            { label: tr("JEE Aspirants","JEE अभ्यर्थी"), detail: tr("Master Physics, Chemistry and Maths concepts with whiteboard diagrams and formula walkthroughs.","व्हाइटबोर्ड के आरेख और सूत्रों से भौतिकी, रसायन विज्ञान और गणित समझें।") },
            { label: tr("NEET Aspirants","NEET अभ्यर्थी"), detail: tr("Study Biology and Chemistry with detailed AI explanations and practice quizzes.","विस्तृत व्याख्याओं और अभ्यास प्रश्नों से जीव विज्ञान एवं रसायन विज्ञान पढ़ें।") },
            { label: tr("UPSC Aspirants","UPSC अभ्यर्थी"), detail: tr("Cover History, Polity, Geography and Current Affairs with structured AI-generated lessons.","संरचित पाठों के साथ इतिहास, राजव्यवस्था, भूगोल और समसामयिक विषय पढ़ें।") },
            { label: tr("College Students","महाविद्यालय के विद्यार्थी"), detail: tr("Understand complex university topics by uploading lecture notes or textbook PDFs.","व्याख्यान नोट्स और पाठ्यपुस्तक PDF से जटिल विषय समझें।") },
            { label: tr("Curious Learners","जिज्ञासु शिक्षार्थी"), detail: tr("Learn anything — from Quantum Physics to Indian Classical Music — in minutes.","क्वांटम भौतिकी से भारतीय शास्त्रीय संगीत तक नए विषय सीखें।") },
          ].map(({ label, detail }) => (
            <div key={label} className="flex gap-3 items-start">
              <span className="mt-0.5 text-primary text-sm">✓</span>
              <div>
                <p className="text-sm font-medium text-foreground/80">{label}</p>
                <p className="text-xs text-muted-foreground/60 leading-relaxed">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
{/* How it works */}
<div className="mb-12">
  <h2 className="text-xl font-bold text-foreground/80 mb-3">
    {tr("How BharatAI Turns Topics Into Lessons","BharatAI विषयों को पाठों में कैसे बदलता है")}
  </h2>

  <p className="text-sm text-muted-foreground/70 leading-relaxed mb-6">
    {tr("Start with a question, syllabus topic, chapter name or PDF. BharatAI organizes the material into a structured classroom experience designed to help students understand ideas, practise recall and revise important concepts.","प्रश्न, पाठ्यक्रम, अध्याय या PDF से शुरू करें। BharatAI सामग्री को संरचित कक्षा में बदलता है ताकि विद्यार्थी अवधारणाएँ समझें, याद करने का अभ्यास करें और पुनरावृत्ति कर सकें।")}
  </p>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {[
      {
        title: tr("1. Describe What You Want to Learn","1. बताएं कि आप क्या सीखना चाहते हैं"),
        description:
          tr("Enter a focused request such as Newton laws for Class 11, organic chemistry reaction mechanisms, Indian polity for UPSC or a summary of an NCERT chapter. You can also upload study material to guide the lesson.","कक्षा 11 के न्यूटन के नियम, कार्बनिक रसायन की अभिक्रियाएँ, UPSC की भारतीय राजव्यवस्था या NCERT अध्याय जैसे किसी विषय को लिखें। अध्ययन सामग्री भी अपलोड कर सकते हैं।"),
      },
      {
        title: tr("2. Generate a Structured AI Classroom","2. संरचित AI कक्षा तैयार करें"),
        description:
          tr("BharatAI converts the request into connected explanations, presentation slides, classroom discussions, diagrams, whiteboard activities and quizzes. Each part supports the same learning objective, helping students move from an introduction to practical understanding.","BharatAI आपके अनुरोध से व्याख्याएँ, स्लाइड, चर्चा, आरेख, व्हाइटबोर्ड गतिविधियाँ और प्रश्नोत्तरी तैयार करता है। ये सभी विषय की व्यावहारिक समझ बढ़ाने में मदद करते हैं।"),
      },
      {
        title: tr("3. Learn, Practise and Revise","3. सीखें, अभ्यास करें और दोहराएँ"),
        description:
          tr("Follow the AI teacher, answer questions and use quizzes to identify gaps. Students can revisit generated classrooms whenever they need revision, making BharatAI useful for daily study, homework support and exam preparation.","AI शिक्षक की व्याख्या सुनें, प्रश्नों के उत्तर दें और अपनी कमज़ोरियाँ पहचानें। पुनरावृत्ति, गृहकार्य और परीक्षा की तैयारी के लिए पुरानी कक्षाएँ फिर खोल सकते हैं।"),
      },
    ].map(({ title, description }) => (
      <article
        key={title}
        className="rounded-xl border border-border/40 bg-muted/20 p-5"
      >
        <h3 className="text-sm font-semibold text-foreground/85 mb-2">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground/70 leading-relaxed">
          {description}
        </p>
      </article>
    ))}
  </div>
</div>

{/* Subjects */}
<div className="mb-12 rounded-xl border border-border/40 bg-muted/20 p-6">
  <h2 className="text-lg font-bold text-foreground/80 mb-3">
    {tr("Subjects and Exams You Can Study","विषय और परीक्षाएँ")}
  </h2>

  <p className="text-sm text-muted-foreground/70 leading-relaxed">
    {tr("Create lessons for school Science, Mathematics, Social Science, English and Computer Science, or explore college and professional topics. Competitive-exam learners can build focused classrooms for JEE Physics, Chemistry and Mathematics, NEET Biology, and UPSC History, Geography, Economy, Environment and Indian Polity.","स्कूल के विज्ञान, गणित, सामाजिक विज्ञान, अंग्रेज़ी और कंप्यूटर विज्ञान के पाठ बनाएँ या उच्च शिक्षा के विषय पढ़ें। JEE के लिए भौतिकी, रसायन और गणित; NEET के लिए जीव विज्ञान; तथा UPSC के लिए इतिहास, भूगोल, अर्थव्यवस्था, पर्यावरण और राजव्यवस्था पढ़ें।")}
  </p>
</div>

{/* Active learning */}
<div className="mb-12">
  <h2 className="text-lg font-bold text-foreground/80 mb-3">
    {tr("Designed for Active Learning","सक्रिय अध्ययन के लिए बनाया गया")}
  </h2>

  <div className="space-y-3 text-sm text-muted-foreground/70 leading-relaxed">
    <p>
      {tr("BharatAI is designed to make students participate instead of passively reading long answers. Explanations are divided into manageable sections and reinforced through questions, examples and visual teaching. Indian language options help learners study in the language they understand best, while PDF-based generation keeps lessons connected to their own books and notes.","BharatAI विद्यार्थियों को केवल लंबे उत्तर पढ़ने के बजाय सक्रिय भागीदारी के लिए प्रेरित करता है। छोटे खंडों, प्रश्नों, उदाहरणों और दृश्य शिक्षण से अवधारणाएँ स्पष्ट होती हैं। भारतीय भाषाओं में पढ़ने और अपनी PDF से पाठ बनाने की सुविधा मिलती है।")}
    </p>

    <p>
      {tr("Unlike a standard chatbot response, a generated classroom combines several learning formats in one place. This gives learners multiple ways to approach difficult concepts and makes the material easier to review before tests. Teachers and parents can also use the generated structure to support guided study sessions.","सामान्य चैटबॉट से अलग, यह कक्षा कई अध्ययन प्रारूप एक जगह लाती है। इससे कठिन अवधारणाओं को अलग-अलग तरीकों से समझना और परीक्षा से पहले दोहराना आसान होता है। शिक्षक और अभिभावक भी निर्देशित अध्ययन में इसका उपयोग कर सकते हैं।")}
    </p>
  </div>
</div>
      {/* FAQ */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-6 text-foreground/80">
          {tr("Frequently Asked Questions","अक्सर पूछे जाने वाले प्रश्न")}
        </h2>
        <div className="flex flex-col gap-4">
          {[
            {
              q: tr("What is BharatAI?","BharatAI क्या है?"),
              a: tr("BharatAI is India-focused multi-agent AI classroom. Type any topic or upload a PDF and request an interactive lesson with an AI teacher, quizzes, whiteboard and classroom discussion — in your selected language.","BharatAI भारतीय विद्यार्थियों के लिए मल्टी-एजेंट AI कक्षा है। विषय लिखें या PDF अपलोड करें और अपनी चुनी हुई भाषा में पाठ, प्रश्नोत्तरी, व्हाइटबोर्ड तथा चर्चा प्राप्त करें।"),
            },
            {
              q: tr("Is BharatAI free?","क्या BharatAI मुफ़्त है?"),
              a: tr("Public labs, lessons and prepared classrooms are free without a key. Personalised generation may require your own API key; provider limits and charges apply.","सार्वजनिक पाठ मुफ़्त हैं। व्यक्तिगत कक्षा बनाने के लिए AI प्रदाता की API कुंजी आवश्यक हो सकती है। प्रदाता का शुल्क और उपयोग सीमा लागू हो सकती है।"),
            },
            {
              q: tr("Can BharatAI help with JEE, NEET and UPSC preparation?","क्या BharatAI JEE, NEET और UPSC की तैयारी में मदद करता है?"),
              a: tr("Yes. BharatAI is purpose-built for Indian competitive exam preparation. Generate lessons on any Physics, Chemistry, Biology, Mathematics, History, Polity or Geography topic. Use official syllabi and past papers to verify exam alignment.","हाँ। भौतिकी, रसायन विज्ञान, जीव विज्ञान, गणित, इतिहास, राजव्यवस्था और भूगोल के पाठ तैयार करें। अभ्यास के लिए आधिकारिक पाठ्यक्रम और पुराने प्रश्नपत्रों से भी मिलान करें।"),
            },
            {
              q: tr("Which languages can I learn in?","मैं किन भाषाओं में सीख सकता हूँ?"),
              a: tr("Choose Hindi, Bengali, Telugu, Marathi, Tamil, Urdu, Gujarati, Kannada, Odia, Malayalam, Punjabi, Assamese, Maithili or English for classroom generation. Interface translations are being expanded; voice support varies by provider.","कक्षा के लिए हिन्दी, बंगाली, तेलुगु, मराठी, तमिल, उर्दू, गुजराती, कन्नड़, ओड़िया, मलयालम, पंजाबी, असमिया, मैथिली या अंग्रेज़ी चुनें। इंटरफ़ेस अनुवाद का विस्तार जारी है; आवाज़ की उपलब्धता प्रदाता पर निर्भर है।"),
            },
            {
              q: tr("Can I upload an NCERT PDF and get a lesson?","क्या NCERT PDF से पाठ बना सकता हूँ?"),
              a: tr("Yes. Upload a permitted PDF within the size and page limits. Text extraction works best with selectable text; scanned pages may require OCR. Review generated content against the source.","हाँ। अनुमति प्राप्त NCERT पुस्तक, नोट्स या पुराने प्रश्नपत्र की PDF अपलोड करें। BharatAI उससे पाठ तैयार करने का प्रयास करेगा। परिणाम मूल सामग्री से जाँचें।"),
            },
            {
              q: tr("Which AI models work with BharatAI?","BharatAI के साथ कौन से AI मॉडल काम करते हैं?"),
              a: tr("Supported providers include NVIDIA, OpenRouter and other configured providers. Check Settings for available models; availability and pricing can change.","OpenAI, Google Gemini, Anthropic Claude, DeepSeek, Qwen, Groq, Kimi, GLM, MiniMax, SiliconFlow और OpenAI-संगत प्रदाता समर्थित हैं। उपलब्ध मॉडल सेटिंग्स में देखें।"),
            },
            {
              q: tr("Is my data private?","क्या मेरा डेटा निजी है?"),
              a: tr("BharatAI stores classroom data locally for browser-based sessions and uses server endpoints and external AI providers for processing. See our privacy policy before uploading sensitive material.","ब्राउज़र आधारित कक्षाओं का डेटा स्थानीय रूप से रखा जाता है। प्रसंस्करण के लिए सर्वर और बाहरी AI प्रदाता उपयोग हो सकते हैं। संवेदनशील सामग्री अपलोड करने से पहले गोपनीयता नीति पढ़ें।"),
            },
          ].map(({ q, a }) => (
            <div
              key={q}
              className="rounded-xl border border-border/40 bg-muted/20 p-4"
            >
              <h3 className="text-sm font-semibold text-foreground/85 mb-1.5">{q}</h3>
              <p className="text-xs text-muted-foreground/70 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer trust line */}
     {/* Footer */}
<footer className="mt-16 border-t border-border/40 pt-8 pb-6">
  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
    <p className="text-muted-foreground/60">
      {tr("BharatAI — Bharat Ka Apna AI Classroom 🇮🇳","BharatAI — भारत की अपनी AI कक्षा 🇮🇳")}
    </p>
    <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2"><Link href="/labs" className="text-muted-foreground hover:text-foreground transition-colors">{tr("Virtual labs","आभासी प्रयोगशाला")}</Link><Link href="/demo" className="text-muted-foreground hover:text-foreground transition-colors">{tr("Demo classrooms","नमूना कक्षाएँ")}</Link>
      <Link href="/learn" className="text-muted-foreground hover:text-foreground transition-colors"><SiteText k="learn"/></Link>
      <Link href="/guides" className="text-muted-foreground hover:text-foreground transition-colors"><SiteText k="guides"/></Link>
      <Link href="/editorial-policy" className="text-muted-foreground hover:text-foreground transition-colors"><SiteText k="editorial"/></Link>
      <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors"><SiteText k="about"/></Link>
      <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors"><SiteText k="privacy"/></Link>
      <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors"><SiteText k="terms"/></Link>
      <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors"><SiteText k="contact"/></Link>
    </nav>
  </div>
  <p className="text-center text-xs text-muted-foreground/40 mt-4">
    {tr("Made with ❤️ for Indian students · CBSE · JEE · NEET · UPSC","भारतीय विद्यार्थियों के लिए ❤️ · CBSE · JEE · NEET · UPSC")}
  </p>
</footer>
    </section>
  );
}

export default function Page() {
  return (
    <>
      <MotionConfig reducedMotion="user"><main><section id="personalised-classroom" className="scroll-mt-6"><HomePage /></section><LearningPreview/><LearningHome /><SEOContent /></main></MotionConfig>
    </>
  );
}
