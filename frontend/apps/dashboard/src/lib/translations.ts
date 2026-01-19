/**
 * Translation Helper for Client Components
 * Centralizes all text access from JSON translation files
 * No hardcoded strings in pages or components!
 */

import enMessages from '@/i18n/messages/en.json'
import arMessages from '@/i18n/messages/ar.json'

const messages = {
  en: enMessages,
  ar: arMessages,
}

export type Locale = 'en' | 'ar'
export type TranslationPath = string

/**
 * Get translation value from centralized JSON files
 * @param locale - Current locale ('en' or 'ar')
 * @param path - Dot notation path: 'categories.title', 'hr.employees.firstName'
 * @param fallback - Fallback text if translation not found
 * @returns Translated string
 */
export function getTranslation(
  locale: Locale,
  path: TranslationPath,
  fallback?: string
): string {
  try {
    const keys = path.split('.')
    let value: any = messages[locale]

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key]
      } else {
        console.warn(`Translation key not found: ${locale}.${path}`)
        return fallback || path
      }
    }

    return typeof value === 'string' ? value : fallback || path
  } catch (error) {
    console.error(`Error accessing translation: ${locale}.${path}`, error)
    return fallback || path
  }
}

/**
 * Create a translation helper function for a specific locale
 * Usage: const t = createTranslator('en')
 * Then: t('categories.title')
 */
export function createTranslator(locale: Locale) {
  return (path: TranslationPath, fallback?: string) =>
    getTranslation(locale, path, fallback)
}

/**
 * Extract locale from pathname
 * Usage: const locale = getLocaleFromPath('/en/dashboard/products')
 */
export function getLocaleFromPath(pathname: string): Locale {
  const parts = pathname.split('/')
  const locale = parts[1]
  return (locale === 'ar' ? 'ar' : 'en') as Locale
}

/**
 * Hook-like function for getting translations in client components
 * Extracts locale from pathname automatically
 * Usage in client components:
 * const t = usePageTranslations()
 * t('categories.title')
 */
export function usePageTranslations() {
  // This would be called with pathname from usePathname()
  // But we return a function that can be called with pathname
  return (pathname: string) => {
    const locale = getLocaleFromPath(pathname)
    return createTranslator(locale)
  }
}
