import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

/**
 * Simple in-memory cache for theme data
 * Improves performance by avoiding unnecessary API calls within a session
 */
class InMemoryThemeCache {
  private cache = new Map<string, { data: any; timestamp: number }>()
  private readonly TTL_MS = 1000 * 60 * 60 // 1 hour

  get(slug: string): any | null {
    const entry = this.cache.get(slug)
    if (!entry) return null

    // Check if expired
    if (Date.now() - entry.timestamp > this.TTL_MS) {
      this.cache.delete(slug)
      return null
    }

    return entry.data
  }

  set(slug: string, data: any): void {
    this.cache.set(slug, { data, timestamp: Date.now() })
  }

  clear(slug?: string): void {
    if (slug) {
      this.cache.delete(slug)
    } else {
      this.cache.clear()
    }
  }
}

const memoryCache = new InMemoryThemeCache()

/**
 * Theme Data Interface
 * Matches the structure returned from backend API
 */
export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
  border: string
  shadow: string
}

export interface ThemeTypography {
  font_family: string
  base_font_size: number
  line_height: number
  border_radius: number
}

export interface ThemeIdentity {
  site_title: string
  logo_url: string
  favicon_url: string
}

export interface ThemeNavigationItem {
  id: string
  label: string
  href: string
  order: number
}

export interface ThemeHeader {
  style: string
  sticky_nav: boolean
  show_search: boolean
  show_language: boolean
  logo_url: string
  show_logo: boolean
  navigation_items: ThemeNavigationItem[]
  background_color: string
  text_color: string
  height: number
  padding: number
  show_shadow: boolean
  sticky_header: boolean
  hide_nav_on_mobile: boolean
  nav_position: string
}

export interface ThemeFooterSection {
  id: string
  title: string
  links?: Array<{ label: string; href: string }>
  content?: string
}

export interface ThemeFooterLink {
  label: string
  href: string
}

export interface ThemeFooter {
  style: string
  columns: number
  show_social: boolean
  company_name: string
  company_description: string
  address: string
  phone: string
  email: string
  copyright_text: string
  social_links: Record<string, string>
  footer_sections: ThemeFooterSection[]
  legal_links: ThemeFooterLink[]
  background_color: string
  text_color: string
  show_links: boolean
}

export interface ThemeComponent {
  id: string
  type: string
  enabled: boolean
  order: number
  [key: string]: unknown
}

export interface ThemeData {
  name: string
  slug: string
  description: string
  colors: ThemeColors
  typography: ThemeTypography
  identity: ThemeIdentity
  header: ThemeHeader
  footer: ThemeFooter
  components: ThemeComponent[]
}

/**
 * Theme Store State
 */
interface ThemeStoreState {
  currentTheme: ThemeData | null
  isLoading: boolean
  error: string | null
  loadTheme: (slug: string) => Promise<void>
  setTheme: (theme: ThemeData) => void
  clearError: () => void
  reset: () => void
}

/**
 * Create Zustand store for theme management
 * Persists to localStorage with key 'theme-storage'
 */
export const useThemeStore = create<ThemeStoreState>()(
  persist(
    (set) => ({
      currentTheme: null,
      isLoading: false,
      error: null,

      /**
       * Load theme from API
       * Checks memory cache first, then localStorage (via persist), then API
       * Falls back to default theme on error
       */
      loadTheme: async (slug: string) => {
        // Check memory cache first (fastest)
        const cachedTheme = memoryCache.get(slug)
        if (cachedTheme) {
          set({ currentTheme: cachedTheme, isLoading: false, error: null })
          return
        }

        set({ isLoading: true, error: null })
        try {
          // Import API function here to avoid circular dependency
          const { getThemeBySlug } = await import('@/lib/api/theme-api')
          const theme = await getThemeBySlug(slug)

          // Cache the theme in memory
          memoryCache.set(slug, theme)

          set({ currentTheme: theme, isLoading: false, error: null })
        } catch (error) {
          console.error(`Failed to load theme: ${slug}`, error)

          // Load default theme on error
          try {
            const { getDefaultTheme } = await import('@/lib/utils/default-theme')
            const defaultTheme = getDefaultTheme()
            set({
              currentTheme: defaultTheme,
              isLoading: false,
              error: error instanceof Error ? error.message : 'Failed to load theme',
            })
          } catch (defaultError) {
            set({
              currentTheme: null,
              isLoading: false,
              error: 'Failed to load both theme and default fallback',
            })
          }
        }
      },

      /**
       * Set theme directly (e.g., from cache or hardcoded)
       */
      setTheme: (theme: ThemeData) => {
        set({ currentTheme: theme, error: null })
      },

      /**
       * Clear error message
       */
      clearError: () => {
        set({ error: null })
      },

      /**
       * Reset to initial state and clear all caches
       */
      reset: () => {
        memoryCache.clear()
        set({ currentTheme: null, isLoading: false, error: null })
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
)

/**
 * Type exports for use in other files
 */
export type { ThemeStoreState }
