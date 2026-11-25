export const languages = [
  {
    "code": "hi-IN",
    "name": "Hindi",
    "native": "हिन्दी",
    "dir": "ltr"
  },
  {
    "code": "bn-IN",
    "name": "Bengali",
    "native": "বাংলা",
    "dir": "ltr"
  },
  {
    "code": "te-IN",
    "name": "Telugu",
    "native": "తెలుగు",
    "dir": "ltr"
  },
  {
    "code": "mr-IN",
    "name": "Marathi",
    "native": "मराठी",
    "dir": "ltr"
  },
  {
    "code": "ta-IN",
    "name": "Tamil",
    "native": "தமிழ்",
    "dir": "ltr"
  },
  {
    "code": "ur-IN",
    "name": "Urdu",
    "native": "اردو",
    "dir": "rtl"
  },
  {
    "code": "gu-IN",
    "name": "Gujarati",
    "native": "ગુજરાતી",
    "dir": "ltr"
  },
  {
    "code": "kn-IN",
    "name": "Kannada",
    "native": "ಕನ್ನಡ",
    "dir": "ltr"
  },
  {
    "code": "or-IN",
    "name": "Odia",
    "native": "ଓଡ଼ିଆ",
    "dir": "ltr"
  },
  {
    "code": "ml-IN",
    "name": "Malayalam",
    "native": "മലയാളം",
    "dir": "ltr"
  },
  {
    "code": "pa-IN",
    "name": "Punjabi",
    "native": "ਪੰਜਾਬੀ",
    "dir": "ltr"
  },
  {
    "code": "as-IN",
    "name": "Assamese",
    "native": "অসমীয়া",
    "dir": "ltr"
  },
  {
    "code": "mai-IN",
    "name": "Maithili",
    "native": "मैथिली",
    "dir": "ltr"
  },
  {
    "code": "en-US",
    "name": "English",
    "native": "English",
    "dir": "ltr"
  }
] as const;
export type Locale = (typeof languages)[number]['code'];
export const defaultLocale: Locale = 'hi-IN';
export function isLocale(value: unknown): value is Locale {return languages.some(l=>l.code===value);}
export function normalizeLocale(value?: string|null): Locale {return isLocale(value)?value:languages.find(l=>l.code.split('-')[0]===value?.split('-')[0])?.code ?? defaultLocale;}
export function languageName(value?: string): string {return languages.find(l=>l.code===normalizeLocale(value))!.name;}
export function languageInstruction(value?: string): string {return 'Write all learner-facing content in '+languageName(value)+' ('+normalizeLocale(value)+'). Use native script; preserve JSON keys, code and mathematical notation.';}
