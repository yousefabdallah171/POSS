/**
 * Theme Definitions
 * Central registry of all available theme presets
 */

export { default as RAKMYAT_THEME_BASE } from './rakmyat'

// Theme registry for easy lookup
export const AVAILABLE_THEMES = {
  rakmyat: 'Rakmyat Restaurant',
  // Add more themes here as needed
} as const

export type AvailableThemeKey = keyof typeof AVAILABLE_THEMES
