# Theme API Integration Guide

**Purpose:** Document the backend API integration for theme loading
**Status:** Ready for Implementation

---

## 🔌 API Endpoints

### Get Theme by Slug
```
GET /api/v1/public/themes/:slug
Host: localhost:8080
Content-Type: application/json
```

**Parameters:**
- `slug` (string): Theme identifier (e.g., "warm-comfort", "modern-blue")

**Request:**
```bash
curl http://localhost:8080/api/v1/public/themes/warm-comfort
```

**Response (200 OK):**
```json
{
  "name": "Warm Comfort",
  "slug": "warm-comfort",
  "description": "Cozy, traditional design with warm colors",
  "colors": {
    "primary": "#b45309",
    "secondary": "#92400e",
    "accent": "#fbbf24",
    "background": "#fffbeb",
    "text": "#78350f",
    "border": "#fed7aa",
    "shadow": "#000000"
  },
  "typography": {
    "font_family": "Georgia, serif",
    "base_font_size": 17,
    "line_height": 1.7,
    "border_radius": 4
  },
  "identity": {
    "site_title": "Warm Comfort Restaurant",
    "logo_url": "https://cdn.example.com/logos/warm-comfort.svg",
    "favicon_url": "https://cdn.example.com/favicons/warm-comfort.ico"
  },
  "header": {
    "style": "classic",
    "sticky_nav": true,
    "show_search": false,
    "show_language": true,
    "logo_url": "https://cdn.example.com/logos/warm-comfort.svg",
    "show_logo": true,
    "navigation_items": [
      {"id": "nav-1", "label": "Menu", "href": "/menu", "order": 1},
      {"id": "nav-2", "label": "About", "href": "/about", "order": 2},
      {"id": "nav-3", "label": "Contact", "href": "/contact", "order": 3}
    ],
    "background_color": "#b45309",
    "text_color": "#ffffff",
    "height": 64,
    "padding": 16,
    "show_shadow": true,
    "sticky_header": true,
    "hide_nav_on_mobile": false,
    "nav_position": "right"
  },
  "footer": {
    "style": "classic",
    "columns": 3,
    "show_social": true,
    "company_name": "Warm Comfort Restaurant",
    "company_description": "Cozy traditional restaurant with warm atmosphere",
    "address": "456 Oak Street, City",
    "phone": "(555) 987-6543",
    "email": "contact@warmcomfort.com",
    "copyright_text": "(c) 2025 Warm Comfort Restaurant. All rights reserved.",
    "social_links": {
      "facebook": "https://facebook.com/warmcomfort",
      "instagram": "https://instagram.com/warmcomfort"
    },
    "footer_sections": [
      {
        "id": "quick-links",
        "title": "Quick Links",
        "links": [
          {"label": "Menu", "href": "/menu"},
          {"label": "About Us", "href": "/about"},
          {"label": "Contact", "href": "/contact"}
        ]
      },
      {
        "id": "hours",
        "title": "Hours",
        "content": "Mon-Thu: 10am-9pm\nFri-Sat: 10am-10pm\nSun: 11am-8pm"
      }
    ],
    "legal_links": [
      {"label": "Privacy Policy", "href": "/privacy"},
      {"label": "Terms of Service", "href": "/terms"}
    ],
    "background_color": "#78350f",
    "text_color": "#ffffff",
    "show_links": true
  },
  "components": [
    {
      "id": "hero-1",
      "type": "hero",
      "enabled": true,
      "order": 1,
      "title": "Welcome to Warm Comfort",
      "subtitle": "Traditional flavors in a cozy setting",
      "button_text": "View Menu"
    }
  ]
}
```

**Error Responses:**

```json
// 404 Not Found
{
  "error": "Theme not found",
  "slug": "unknown-theme"
}

// 500 Internal Server Error
{
  "error": "Internal server error",
  "message": "Failed to fetch theme"
}
```

---

## 🛠️ Implementation Pattern

### API Client (lib/api/theme-api.ts)

```typescript
import { apiClient } from './api-client'

export interface ThemeData {
  name: string
  slug: string
  description: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
    border: string
    shadow: string
  }
  typography: {
    font_family: string
    base_font_size: number
    line_height: number
    border_radius: number
  }
  identity: {
    site_title: string
    logo_url: string
    favicon_url: string
  }
  header: {
    style: string
    sticky_nav: boolean
    show_search: boolean
    show_language: boolean
    logo_url: string
    show_logo: boolean
    navigation_items: Array<{
      id: string
      label: string
      href: string
      order: number
    }>
    background_color: string
    text_color: string
    height: number
    padding: number
    show_shadow: boolean
    sticky_header: boolean
    hide_nav_on_mobile: boolean
    nav_position: string
  }
  footer: {
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
    footer_sections: Array<{
      id: string
      title: string
      links?: Array<{ label: string; href: string }>
      content?: string
    }>
    legal_links: Array<{ label: string; href: string }>
    background_color: string
    text_color: string
    show_links: boolean
  }
  components: Array<{
    id: string
    type: string
    enabled: boolean
    order: number
    [key: string]: unknown
  }>
}

export class ThemeApiError extends Error {
  constructor(
    public message: string,
    public slug: string,
    public originalError?: unknown
  ) {
    super(message)
    this.name = 'ThemeApiError'
  }
}

/**
 * Get a theme by its slug
 * @param slug - Theme slug (e.g., "warm-comfort")
 * @throws {ThemeApiError} if fetch fails
 * @returns Promise<ThemeData>
 */
export async function getThemeBySlug(slug: string): Promise<ThemeData> {
  try {
    const data = await apiClient.get<ThemeData>(
      `/public/themes/${slug}`,
      {
        timeout: 5000, // 5-second timeout
      }
    )
    return data
  } catch (error) {
    throw new ThemeApiError(
      `Failed to load theme: ${slug}`,
      slug,
      error
    )
  }
}

/**
 * Get all available themes (optional endpoint)
 * @returns Promise<ThemeData[]>
 */
export async function getAllThemes(): Promise<ThemeData[]> {
  try {
    return await apiClient.get<ThemeData[]>('/public/themes', {
      timeout: 10000,
    })
  } catch (error) {
    return []
  }
}
```

### Using in Store

```typescript
// lib/store/theme-store.ts
import { getThemeBySlug } from '@/lib/api/theme-api'
import { getDefaultTheme } from '@/lib/utils/default-theme'

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      currentTheme: null,
      isLoading: false,
      error: null,

      loadTheme: async (slug: string) => {
        set({ isLoading: true, error: null })
        try {
          const theme = await getThemeBySlug(slug)
          set({ currentTheme: theme, isLoading: false })
        } catch (error) {
          console.error('Failed to load theme:', error)
          set({
            currentTheme: getDefaultTheme(),
            isLoading: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          })
        }
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
```

---

## 🔄 Request/Response Flow

### Success Path
```
Component mounts
  ↓
useTheme() hook
  ↓
useThemeStore.loadTheme('warm-comfort')
  ↓
API request: GET /public/themes/warm-comfort
  ↓ (100-500ms network delay)
Backend responds with ThemeData
  ↓
Zustand store updates state
  ↓
localStorage 'theme-storage' updated
  ↓
ThemeProvider watches store
  ↓
useEffect triggers
  ↓
CSS variables injected
  ↓
Component renders with theme colors
```

### Error Path
```
Component mounts
  ↓
useThemeStore.loadTheme('warm-comfort')
  ↓
API request fails (timeout, 404, 500, etc.)
  ↓
catch block in loadTheme
  ↓
getDefaultTheme() loads fallback
  ↓
Zustand updates with default theme
  ↓
localStorage updates with default
  ↓
ThemeProvider injects default theme
  ↓
Component renders with fallback colors
```

---

## 🧪 Testing API Calls

### Mock API Response

```typescript
// __tests__/api/theme-api.test.ts
import { getThemeBySlug } from '@/lib/api/theme-api'
import { mockThemeData } from '@/__mocks__/theme-data'

jest.mock('@/lib/api/api-client', () => ({
  apiClient: {
    get: jest.fn(),
  },
}))

describe('Theme API', () => {
  it('should fetch theme by slug', async () => {
    const { apiClient } = require('@/lib/api/api-client')
    apiClient.get.mockResolvedValue(mockThemeData.warmComfort)

    const theme = await getThemeBySlug('warm-comfort')
    expect(theme.slug).toBe('warm-comfort')
    expect(apiClient.get).toHaveBeenCalledWith(
      '/public/themes/warm-comfort',
      { timeout: 5000 }
    )
  })

  it('should handle API timeout', async () => {
    const { apiClient } = require('@/lib/api/api-client')
    const timeoutError = new Error('Request timeout')
    apiClient.get.mockRejectedValue(timeoutError)

    await expect(getThemeBySlug('unknown')).rejects.toThrow(
      'Failed to load theme'
    )
  })

  it('should handle 404 error', async () => {
    const { apiClient } = require('@/lib/api/api-client')
    const notFoundError = {
      response: { status: 404, data: { error: 'Theme not found' } },
    }
    apiClient.get.mockRejectedValue(notFoundError)

    await expect(getThemeBySlug('nonexistent')).rejects.toThrow()
  })
})
```

### Integration Test

```typescript
// __tests__/store/theme-store.integration.test.ts
import { renderHook, act, waitFor } from '@testing-library/react'
import { useThemeStore } from '@/lib/store/theme-store'

describe('Theme Store Integration', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should load theme from API and save to localStorage', async () => {
    const { result } = renderHook(() => useThemeStore())

    act(() => {
      result.current.loadTheme('warm-comfort')
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
      expect(result.current.currentTheme?.slug).toBe('warm-comfort')
    })

    // Verify localStorage
    const stored = localStorage.getItem('theme-storage')
    expect(stored).toBeTruthy()
    const parsed = JSON.parse(stored!)
    expect(parsed.state.currentTheme.slug).toBe('warm-comfort')
  })
})
```

---

## 🚨 Error Handling

### Timeout (5 seconds)

```typescript
// Handled automatically by apiClient with timeout: 5000
// Falls through to catch block → default theme loaded
```

### Network Error

```typescript
try {
  const theme = await getThemeBySlug(slug)
} catch (error) {
  // Network is down, load default theme
  return getDefaultTheme()
}
```

### Invalid Response

```typescript
// Backend returns malformed JSON
// Axios will throw error
// Caught by catch block → default theme loaded
```

### Rate Limiting (429)

```typescript
// Retry logic (if needed) in apiClient interceptor
// Or fall back to cache
```

---

## 📊 API Configuration

**Base URL:**
```
development:  http://localhost:8080/api/v1
staging:      https://staging-api.restaurant.com/api/v1
production:   https://api.restaurant.com/api/v1
```

**Timeout:**
- Theme API: 5 seconds
- Other APIs: 30 seconds (default)

**Retry Logic:**
- Max retries: 1 (optional)
- Backoff: Exponential
- Only on 5xx errors (not 4xx)

---

## 🔐 Authentication

**Multi-Tenancy Headers:**
```typescript
// Automatically added by apiClient
// No additional setup needed for theme endpoints
// (They are public endpoints)

// But stored in header for consistency
const headers = {
  'Content-Type': 'application/json',
  'X-Tenant-ID': tenantId,        // Optional
  'X-Restaurant-ID': restaurantId, // Optional
}
```

---

## ✅ Checklist: API Integration Ready

- [ ] Backend `/public/themes/:slug` endpoint working
- [ ] Response includes all ThemeData fields
- [ ] All 10 themes return valid data
- [ ] 404 for non-existent slug
- [ ] 5-second timeout works
- [ ] Tested with curl: `curl http://localhost:8080/api/v1/public/themes/warm-comfort`
- [ ] API documentation available

---

*API Integration Documentation*
*Phase 3 Theme Integration*
*Last Updated: 2026-01-07*
