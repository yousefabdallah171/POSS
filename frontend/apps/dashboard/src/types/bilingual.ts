/**
 * Bilingual Content Types
 * Support for English and Arabic text with RTL direction awareness
 */

/**
 * BilingualText represents text content in both English and Arabic
 * @property en - English text (LTR)
 * @property ar - Arabic text (RTL)
 */
export interface BilingualText {
  en: string
  ar: string
}

/**
 * BilingualTextInput represents input data for bilingual text
 * Can be a string (converted to both languages) or BilingualText object
 */
export type BilingualTextInput = string | BilingualText

/**
 * Language type
 */
export type Language = 'en' | 'ar'

/**
 * Language configuration
 */
export interface LanguageConfig {
  code: Language
  name: string
  direction: 'ltr' | 'rtl'
  nativeName: string
}

/**
 * Available languages configuration
 */
export const LANGUAGES: Record<Language, LanguageConfig> = {
  en: {
    code: 'en',
    name: 'English',
    direction: 'ltr',
    nativeName: 'English',
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    direction: 'rtl',
    nativeName: 'العربية',
  },
}

/**
 * Helper function to create a BilingualText object
 * @param en - English text
 * @param ar - Arabic text (optional, defaults to English)
 */
export function createBilingualText(en: string, ar?: string): BilingualText {
  return {
    en,
    ar: ar || en,
  }
}

/**
 * Helper function to convert input to BilingualText
 * @param input - String or BilingualText object
 * @returns BilingualText object
 */
export function convertToBilingualText(input: BilingualTextInput): BilingualText {
  if (typeof input === 'string') {
    return createBilingualText(input)
  }
  return input
}

/**
 * Helper function to get text for a specific language
 * @param text - BilingualText object
 * @param language - Language code ('en' or 'ar')
 * @returns Text in the specified language, falls back to English if not available
 */
export function getTextByLanguage(text: BilingualText | null | undefined, language: Language = 'en'): string {
  if (!text) return ''
  if (language === 'ar' && text.ar) return text.ar
  return text.en || ''
}

/**
 * Helper function to check if BilingualText is empty
 * @param text - BilingualText object
 * @returns True if both English and Arabic are empty
 */
export function isBilingualTextEmpty(text: BilingualText | null | undefined): boolean {
  if (!text) return true
  return !text.en && !text.ar
}

/**
 * Bilingual component interface with text content in both languages
 */
export interface BilingualComponent {
  title: BilingualText
  subtitle?: BilingualText
  description?: BilingualText
  buttonText?: BilingualText
}

/**
 * Bilingual theme interface
 */
export interface BilingualTheme {
  id: string
  name: string
  description?: string
  primaryLanguage: Language
  supportedLanguages: Language[]
}

/**
 * Context for bilingual operations
 */
export interface BilingualContextType {
  currentLanguage: Language
  setCurrentLanguage: (language: Language) => void
  supportedLanguages: Language[]
}
