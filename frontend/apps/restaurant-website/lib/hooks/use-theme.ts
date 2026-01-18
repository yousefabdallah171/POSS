'use client'

import { useEffect } from 'react'
import { useThemeStore } from '@/lib/store/theme-store'
import type { ThemeData } from '@/lib/store/theme-store'

/**
 * Custom hook to access theme from Zustand store
 * Automatically loads theme on first use
 * Caching is handled internally by the store (memory cache → localStorage → API)
 *
 * @param defaultSlug - Theme slug to load if not cached (default: 'warm-comfort')
 * @returns Theme state and actions
 *
 * @example
 * const { currentTheme, isLoading, error, loadTheme } = useTheme()
 *
 * // In effect
 * useEffect(() => {
 *   if (!currentTheme && !isLoading) {
 *     loadTheme('warm-comfort')
 *   }
 * }, [currentTheme, isLoading, loadTheme])
 */
export function useTheme(defaultSlug: string = 'warm-comfort') {
  const store = useThemeStore()

  /**
   * Load theme on mount
   * Store handles cache checking internally (memory → localStorage → API)
   */
  useEffect(() => {
    // If already loaded, skip
    if (store.currentTheme) {
      return
    }

    // Load theme (store will check caches internally)
    store.loadTheme(defaultSlug)
  }, [defaultSlug, store])

  return {
    currentTheme: store.currentTheme,
    isLoading: store.isLoading,
    error: store.error,
    loadTheme: store.loadTheme,
    setTheme: store.setTheme,
    clearError: store.clearError,
  }
}

/**
 * Hook to load a specific theme by slug
 * Useful for theme switcher components
 *
 * @param slug - Theme slug to load
 * @returns Loading state and error
 *
 * @example
 * const { isLoading, error } = useLoadTheme('modern-blue')
 */
export function useLoadTheme(slug: string) {
  const store = useThemeStore()

  const load = async () => {
    await store.loadTheme(slug)
  }

  return {
    isLoading: store.isLoading,
    error: store.error,
    load,
  }
}

/**
 * Hook to access current theme colors
 *
 * @returns Current theme colors or default if not loaded
 *
 * @example
 * const colors = useThemeColors()
 * // { primary: '#b45309', secondary: '#92400e', ... }
 */
export function useThemeColors() {
  const { currentTheme } = useTheme()
  return currentTheme?.colors || {}
}

/**
 * Hook to access current theme typography
 *
 * @returns Current theme typography or default if not loaded
 *
 * @example
 * const typography = useThemeTypography()
 * // { font_family: 'Georgia, serif', base_font_size: 17, ... }
 */
export function useThemeTypography() {
  const { currentTheme } = useTheme()
  return currentTheme?.typography || {}
}

/**
 * Hook to access current theme identity
 *
 * @returns Current theme identity or default if not loaded
 *
 * @example
 * const { site_title, logo_url } = useThemeIdentity()
 */
export function useThemeIdentity() {
  const { currentTheme } = useTheme()
  return currentTheme?.identity || {}
}

/**
 * Hook to access current theme header config
 *
 * @returns Current theme header config or empty object if not loaded
 *
 * @example
 * const header = useThemeHeader()
 * // { background_color: '#b45309', text_color: '#ffffff', ... }
 */
export function useThemeHeader() {
  const { currentTheme } = useTheme()
  return currentTheme?.header || {}
}

/**
 * Hook to access current theme footer config
 *
 * @returns Current theme footer config or empty object if not loaded
 *
 * @example
 * const footer = useThemeFooter()
 * // { background_color: '#78350f', text_color: '#ffffff', ... }
 */
export function useThemeFooter() {
  const { currentTheme } = useTheme()
  return currentTheme?.footer || {}
}

/**
 * Hook to switch theme
 * Useful for theme selector components
 *
 * @returns Switch function
 *
 * @example
 * const switchTheme = useSwitchTheme()
 * const handleThemeChange = (slug: string) => {
 *   switchTheme(slug)
 * }
 */
export function useSwitchTheme() {
  const store = useThemeStore()

  const switchTheme = async (slug: string) => {
    await store.loadTheme(slug)
  }

  return switchTheme
}

/**
 * Hook to check if theme is loading
 *
 * @returns true if loading, false otherwise
 *
 * @example
 * const isLoading = useThemeLoading()
 * if (isLoading) return <ThemeSkeleton />
 */
export function useThemeLoading() {
  const { isLoading } = useTheme()
  return isLoading
}

/**
 * Hook to check if theme has error
 *
 * @returns Error message if any, null otherwise
 *
 * @example
 * const error = useThemeError()
 * if (error) return <ThemeError message={error} />
 */
export function useThemeError() {
  const { error } = useTheme()
  return error
}

/**
 * Hook to get theme loading progress
 * Useful for showing progress bars or spinners
 *
 * @returns Object with isLoading and error
 *
 * @example
 * const { isLoading, error } = useThemeProgress()
 * return (
 *   <>
 *     {isLoading && <Spinner />}
 *     {error && <ErrorMessage />}
 *   </>
 * )
 */
export function useThemeProgress() {
  const { isLoading, error } = useTheme()
  return { isLoading, error }
}

/**
 * Type exports
 */
export type { ThemeData }
