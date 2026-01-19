/**
 * Bilingual Utilities
 * Handles extraction and management of bilingual content (EN/AR)
 */

import { BilingualText } from "@/types/themeJson"

export type Locale = "en" | "ar"

/**
 * Extract text for a specific locale
 */
export function getText(
  value: BilingualText | string | undefined,
  locale: Locale = "en"
): string {
  if (!value) return ""
  if (typeof value === "string") return value
  
  const obj = value as any
  return obj[locale] || obj.en || obj.ar || ""
}

/**
 * Get English text
 */
export function getEnglish(value: BilingualText | undefined): string {
  return getText(value, "en")
}

/**
 * Get Arabic text
 */
export function getArabic(value: BilingualText | undefined): string {
  return getText(value, "ar")
}

/**
 * Create bilingual text object
 */
export function createBilingualText(en: string, ar: string): BilingualText {
  return { en, ar }
}

/**
 * Check if content is bilingual
 */
export function isBilingual(value: any): boolean {
  return (
    typeof value === "object" &&
    value !== null &&
    (typeof value.en === "string" || typeof value.ar === "string")
  )
}

/**
 * Get available locales for a field
 */
export function getAvailableLocales(value: BilingualText | undefined): Locale[] {
  if (!value) return []
  if (typeof value === "string") return ["en"]
  
  const obj = value as any
  const locales: Locale[] = []
  
  if (typeof obj.en === "string") locales.push("en")
  if (typeof obj.ar === "string") locales.push("ar")
  
  return locales
}

/**
 * Check if locale has content
 */
export function hasLocale(value: BilingualText | undefined, locale: Locale): boolean {
  if (!value) return false
  if (typeof value === "string") return locale === "en"
  
  const obj = value as any
  return typeof obj[locale] === "string" && obj[locale].length > 0
}

/**
 * Get direction for locale (LTR or RTL)
 */
export function getDirection(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr"
}

/**
 * Get locale display name
 */
export function getLocaleDisplayName(locale: Locale): string {
  return locale === "ar" ? "العربية (Arabic)" : "English"
}

/**
 * Get locale label
 */
export function getLocaleLabel(locale: Locale): string {
  return locale === "ar" ? "AR" : "EN"
}

/**
 * Merge bilingual texts (combine EN and AR)
 */
export function mergeBilingualText(
  primary: BilingualText | undefined,
  fallback: BilingualText | undefined
): BilingualText {
  const en = getText(primary, "en") || getText(fallback, "en") || ""
  const ar = getText(primary, "ar") || getText(fallback, "ar") || ""
  
  return { en, ar }
}

/**
 * Extract all bilingual fields from an object recursively
 */
export function extractBilingualFields(obj: any): Record<string, BilingualText> {
  const result: Record<string, BilingualText> = {}
  
  function traverse(current: any, path: string = ""): void {
    if (!current || typeof current !== "object") return
    
    for (const [key, value] of Object.entries(current)) {
      const fullPath = path ? `${path}.${key}` : key
      
      if (isBilingual(value)) {
        result[fullPath] = value as BilingualText
      } else if (typeof value === "object" && value !== null) {
        traverse(value, fullPath)
      }
    }
  }
  
  traverse(obj)
  return result
}

export default {
  getText,
  getEnglish,
  getArabic,
  createBilingualText,
  isBilingual,
  getAvailableLocales,
  hasLocale,
  getDirection,
  getLocaleDisplayName,
  getLocaleLabel,
  mergeBilingualText,
  extractBilingualFields,
}
