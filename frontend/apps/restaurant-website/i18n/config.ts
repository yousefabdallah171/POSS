export const LOCALES = ['en', 'ar'] as const;
export const DEFAULT_LOCALE = 'en';

export const LOCALE_NAMES = {
  en: 'English',
  ar: 'العربية',
};

export type Locale = (typeof LOCALES)[number];
