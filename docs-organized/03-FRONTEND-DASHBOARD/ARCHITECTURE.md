# Phase 3: Architecture & Design Decisions

**Date:** 2026-01-07
**Version:** 1.0

---

## 🏛️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      App Layout (layout.tsx)                │
│                  ↓ Wraps with ThemeProvider                 │
├─────────────────────────────────────────────────────────────┤
│
│  ┌───────────────────────────────────────────────────────┐
│  │           ThemeProvider Component                      │
│  │  • Watches useThemeStore                              │
│  │  • Injects CSS variables                              │
│  │  • Applies theme colors via requestAnimationFrame     │
│  └────────────┬────────────────────────────────────────┘
│               │
│  ┌────────────▼────────────────────────────────────────┐
│  │         useThemeStore (Zustand)                      │
│  │  • currentTheme: ThemeData | null                    │
│  │  • isLoading: boolean                                │
│  │  • error: string | null                              │
│  │  • loadTheme(slug): Promise<void>                    │
│  │  • Persists to localStorage                          │
│  └────────────┬────────────────────────────────────────┘
│               │
│  ┌────────────▼────────────────────────────────────────┐
│  │       Theme API Client (theme-api.ts)               │
│  │  • GET /public/themes/:slug                          │
│  │  • 5-second timeout                                  │
│  │  • Error handling with fallback                      │
│  └────────────┬────────────────────────────────────────┘
│               │
│  ┌────────────▼────────────────────────────────────────┐
│  │       Backend Theme API                              │
│  │  http://localhost:8080/api/v1/public/themes/:slug   │
│  │  Returns: ThemeData JSON                             │
│  └────────────────────────────────────────────────────┘
│
│  CSS Variables: :root { --theme-primary, --theme-secondary, ... }
│                 ↓ Used by all components
│                 Tailwind config references variables
│                 Components use: bg-primary, text-primary, etc.
│
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Key Architecture Decisions

### 1. State Management: Zustand (Not Redux, Context, or Jotai)

**Decision:** Use Zustand with persist middleware

**Why Zustand?**
- ✅ Already used in the codebase (`preferences-store.ts`, `cart-store.ts`)
- ✅ Minimal boilerplate (compared to Redux)
- ✅ Built-in persist middleware for localStorage
- ✅ No provider wrapper needed (direct hook usage)
- ✅ Excellent TypeScript support
- ✅ Small bundle size (~5KB)

**Architecture:**
```typescript
export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      currentTheme: null,
      isLoading: false,
      error: null,
      loadTheme: async (slug: string) => { /* ... */ },
      setTheme: (theme: ThemeData) => { /* ... */ },
    }),
    {
      name: 'theme-storage',        // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
)
```

**Trade-offs:**
- ❌ Cannot use in async server components (but OK for this app)
- ✅ Excellent performance
- ✅ DevTools support available

---

### 2. CSS Variables Strategy: HSL Format in :root

**Decision:** Use HSL-formatted CSS variables mapped from theme JSON hex colors

**Why HSL?**
- ✅ Tailwind natively supports HSL (`hsl(var(--color))`)
- ✅ Easy to adjust lightness for dark mode (`hsl(var(--color) / 0.8)`)
- ✅ W3C standard for color manipulation
- ✅ More intuitive than RGB for designers

**Variable Naming Convention:**
```css
/* Primary colors */
--theme-primary: 0 100% 50%;        /* H S L format */
--theme-secondary: 240 100% 50%;
--theme-accent: 120 100% 50%;

/* Semantic colors */
--theme-background: 0 0% 100%;
--theme-text: 0 0% 0%;
--theme-border: 0 0% 80%;
--theme-shadow: 0 0% 0%;

/* Typography */
--theme-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
--theme-font-size: 16px;
--theme-line-height: 1.5;
--theme-border-radius: 4px;
```

**Usage in Components:**
```css
/* In CSS files */
background-color: hsl(var(--theme-primary));
color: hsl(var(--theme-text));
border-color: hsl(var(--theme-border) / 0.5);  /* With opacity */
```

**Performance Optimization:**
```typescript
// Use requestAnimationFrame to batch DOM updates
requestAnimationFrame(() => {
  const root = document.documentElement
  root.style.setProperty('--theme-primary', '0 100% 50%')
  root.style.setProperty('--theme-secondary', '240 100% 50%')
  // ... other variables
})
// This prevents layout thrashing and ensures < 100ms injection
```

---

### 3. Component Provider Pattern: Theme Provider Component

**Decision:** Create a ThemeProvider React component to wrap the app

**Why Separate Component?**
- ✅ Separation of concerns
- ✅ Handles side effects (watching store, injecting CSS)
- ✅ Can show loading skeleton while theme loads
- ✅ Can catch errors with error boundary
- ✅ Testing isolation

**Architecture:**
```typescript
export function ThemeProvider({ children }: { children: ReactNode }) {
  const { currentTheme, isLoading, error } = useThemeStore()

  useEffect(() => {
    if (currentTheme) {
      applyThemeVariables(currentTheme)
    }
  }, [currentTheme])

  if (error) {
    return <ThemeErrorBoundary>{children}</ThemeErrorBoundary>
  }

  return <>{children}</>
}

// Usage in layout.tsx:
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

---

### 4. API Client: Axios Class Wrapper (Existing Pattern)

**Decision:** Extend existing `apiClient` in `lib/api-client.ts` with theme methods

**Why Use Existing Pattern?**
- ✅ Already integrated in the app
- ✅ Handles auth tokens automatically
- ✅ Built-in error handling
- ✅ Multi-tenancy headers (X-Tenant-ID, X-Restaurant-ID)
- ✅ Consistent with other API calls

**Pattern:**
```typescript
// Extend existing apiClient with theme method
class ApiClient {
  // ... existing methods

  async getTheme(slug: string): Promise<ThemeData> {
    try {
      return await this.get<ThemeData>(
        `/public/themes/${slug}`,
        { timeout: 5000 }  // 5-second timeout
      )
    } catch (error) {
      throw new ThemeApiError('Failed to load theme', slug, error)
    }
  }
}
```

---

### 5. Error Handling: Three Layers

**Layer 1: API Error Handling**
```typescript
// lib/api/theme-api.ts
try {
  const theme = await apiClient.getTheme(slug)
} catch (error) {
  // Timeout, network error, 404, 500
  return getDefaultTheme()  // Fallback
}
```

**Layer 2: Error Boundary**
```typescript
// Catches React errors during rendering
<ThemeErrorBoundary>
  <App />
</ThemeErrorBoundary>
```

**Layer 3: Cache Fallback**
```typescript
// If current theme is invalid, try cache
const cachedTheme = getCachedTheme()
if (cachedTheme) {
  setTheme(cachedTheme)
}
```

---

### 6. Caching: Multi-Level Strategy

**Cache Hierarchy:**
```
Request Theme
  ↓
1. Memory Cache (fastest, session-scoped)
  ↓ [Hit: < 1ms]
2. localStorage Cache (persistent, 1-hour TTL)
  ↓ [Hit: < 10ms]
3. IndexedDB Cache (optional, large data)
  ↓ [Hit: < 50ms]
4. API Request (slowest, always as fallback)
  ↓ [Hit: 100-1000ms]
```

**Implementation:**
```typescript
interface CacheLayer {
  get(key: string): ThemeData | null
  set(key: string, value: ThemeData, ttl?: number): void
  clear(key: string): void
}

// Memory cache (Map-based, fastest)
class MemoryCache implements CacheLayer {
  private cache = new Map<string, { data: ThemeData; expires: number }>()
  get(key: string) { /* ... */ }
  set(key: string, value: ThemeData, ttl = 1000 * 60 * 60) { /* ... */ }
}

// localStorage cache (persistent)
class StorageCache implements CacheLayer {
  get(key: string) { /* JSON.parse(localStorage.getItem(key)) */ }
  set(key: string, value: ThemeData) { /* JSON.stringify and save */ }
}

// Unified cache manager
class ThemeCache {
  constructor(
    private memory = new MemoryCache(),
    private storage = new StorageCache()
  ) {}

  async getTheme(slug: string): Promise<ThemeData> {
    // Check memory first
    let theme = this.memory.get(slug)
    if (theme) return theme

    // Check storage second
    theme = this.storage.get(slug)
    if (theme) {
      this.memory.set(slug, theme)  // Repopulate memory
      return theme
    }

    // Fetch from API
    theme = await apiClient.getTheme(slug)
    this.memory.set(slug, theme)
    this.storage.set(slug, theme)
    return theme
  }
}
```

---

### 7. Accessibility: WCAG AA Standard

**Color Contrast Validation:**
```typescript
// Luminance calculation (W3C formula)
function getLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex)
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

// Contrast ratio calculation
function getContrastRatio(foreground: string, background: string): number {
  const l1 = getLuminance(foreground)
  const l2 = getLuminance(background)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

// Validation
function meetsWCAGAA(fg: string, bg: string): boolean {
  return getContrastRatio(fg, bg) >= 4.5
}
```

**Keyboard Navigation:**
- Tab order is logical (left-to-right, top-to-bottom)
- Focus indicators visible (3px outline with 2px gap)
- Skip link before main content
- Arrow keys for theme selector navigation

**Screen Reader Support:**
- Semantic HTML (`<nav>`, `<main>`, `<footer>`)
- ARIA labels on all interactive elements
- Status announcements via `aria-live="polite"`
- sr-only class for visual-only content

---

### 8. Performance: Target Metrics

**Load Time < 1000ms:**
```
User clicks "Apply Theme"
  ↓ 0ms
API request starts (or cache hit)
  ↓ 100-500ms (API) or < 10ms (cache)
Response received
  ↓ 5ms
Data validation & processing
  ↓ 5ms
CSS variables prepared
  ↓ requestAnimationFrame schedules update
  ↓ 5ms
DOM update (all variables at once)
  ↓ < 100ms
Browser paints new styles
  ↓ 200ms
Page visually updated

Total: 100-1000ms (depending on cache)
```

**CSS Injection < 100ms:**
```typescript
// Use requestAnimationFrame to batch updates
requestAnimationFrame(() => {
  const root = document.documentElement
  // Set all variables in one batch
  const variables = {
    '--theme-primary': hexToHsl(theme.colors.primary),
    '--theme-secondary': hexToHsl(theme.colors.secondary),
    // ... 20+ variables
  }
  Object.entries(variables).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })
})
// Browser batches repaints, no layout thrashing
```

**Memory Optimization:**
- Theme data reused from store (no copies)
- Cache cleaned up after 1 hour
- No circular references in theme objects
- Zustand auto-cleans subscriptions

---

## 📁 File Structure Rationale

```
lib/
├── store/
│   └── theme-store.ts          # Zustand store (state management)
├── api/
│   └── theme-api.ts             # API client (data fetching)
├── hooks/
│   ├── use-theme.ts             # Hook to access store (component API)
│   ├── use-keyboard-navigation.ts
│   └── use-theme-performance.ts
└── utils/
    ├── theme-cache.ts           # Caching logic (performance)
    ├── theme-colors.ts          # Color conversion (utilities)
    ├── theme-typography.ts      # Typography utilities
    ├── contrast-checker.ts      # WCAG validation (a11y)
    └── default-theme.ts         # Fallback theme (error handling)

styles/
├── theme-variables.css          # CSS variable definitions
├── theme-transitions.css        # Smooth transitions
├── focus-indicators.css         # Accessibility (a11y)
└── color-not-alone.css          # Color-independent indicators (a11y)

components/
├── theme-provider.tsx           # Provider component (architecture)
├── theme-selector.tsx           # UI for theme selection
├── theme-preview.tsx            # Preview modal
├── theme-error-boundary.tsx    # Error boundary (error handling)
├── contrast-report.tsx          # Accessibility dashboard (a11y)
└── status-indicators.tsx        # Accessible badges (a11y)
```

---

## 🔄 Data Flow

### Initial App Load

```
1. App renders with ThemeProvider
2. ThemeProvider calls useThemeStore
3. Store checks localStorage for 'theme-storage'
   a. If exists: Load cached theme
   b. If not: Set currentTheme = null
4. useEffect in ThemeProvider triggers
5. If currentTheme is null:
   a. Call loadTheme(defaultSlug) from store
   b. Store fetches from API (or cache)
6. CSS variables injected (requestAnimationFrame)
7. Page renders with theme colors

Timeline: 100-500ms
```

### User Changes Theme

```
1. User clicks theme card in selector
2. onClick: setTheme(newTheme) in store
3. Zustand updates state & localStorage
4. ThemeProvider's useEffect watches currentTheme
5. currentTheme changed → run effect
6. applyThemeVariables(newTheme)
   a. requestAnimationFrame batches updates
   b. document.documentElement.style.setProperty(...)
   c. CSS variables updated
   d. Browser repaints
7. All components reactively update (they use CSS vars)
8. Smooth transition via CSS (0.3s)

Timeline: < 500ms (mostly from browser paint)
```

### Theme Switching Flow Diagram

```
ThemeSelector
    ↓ onClick
useThemeStore.setTheme()
    ↓ (Zustand updates state)
localStorage updated
    ↓
ThemeProvider watches store
    ↓
useEffect triggers
    ↓
applyThemeVariables()
    ↓ (requestAnimationFrame)
document.documentElement.style.setProperty()
    ↓
CSS variables updated in :root
    ↓
Components using hsl(var(--theme-*))
    ↓
Browser repaints
    ↓
Smooth transition (0.3s CSS)
    ↓
Page visually updated
```

---

## 🧪 Testing Strategy

### Unit Testing (Jest)

**Store Tests (28+ tests)**
- Test loadTheme() success path
- Test loadTheme() with API error
- Test loadTheme() with timeout
- Test setTheme()
- Test localStorage persistence
- Test default theme fallback

**Utility Tests (80+ tests)**
- Color conversion tests (hex → HSL)
- Contrast ratio calculations
- Cache get/set operations
- Cache TTL expiration
- Keyboard navigation logic

**Component Tests (100+ tests)**
- ThemeProvider renders correctly
- ThemeSelector displays all 10 themes
- Theme changes apply to DOM
- Error boundary catches errors
- Contrast report shows violations

### Integration Tests (15+ tests)
- Full flow: Load theme → Apply → See changes
- Theme persists across page reload
- RTL support maintained
- Dark mode switching works

### E2E Tests (5+ tests)
- User can switch themes
- Colors update on page
- Theme persists on reload
- Mobile responsive

### Accessibility Tests (automated + manual)
- axe-core automated testing
- Manual keyboard navigation
- Screen reader testing (NVDA, JAWS, VoiceOver)
- Contrast validation for all 10 themes

### Performance Tests
- Measure theme load time
- Measure CSS injection time
- Measure memory usage
- Measure bundle size

---

## 🚀 Implementation Priority

1. **Critical (Foundation)** - Must complete first
   - Task 3.1: Theme Store
   - Task 3.2: CSS Variables
   - Task E.1: Error Handling

2. **High (Visible Impact)** - Complete second
   - Task 3.3: Header
   - Task 3.4: Footer
   - Task 3.5: Components

3. **Medium (Features)** - Complete third
   - Task 3.6: Theme Switching
   - Task 3.7: Pages

4. **Low (Polish)** - Complete last
   - Task P.1-P.3: Performance
   - Task A.1-A.4: Accessibility

---

## 🎓 Design Patterns Used

| Pattern | Location | Purpose |
|---------|----------|---------|
| **Zustand Store** | `lib/store/theme-store.ts` | State management |
| **React Provider** | `components/theme-provider.tsx` | Dependency injection |
| **Custom Hook** | `lib/hooks/use-theme.ts` | Encapsulation |
| **Error Boundary** | `components/theme-error-boundary.tsx` | Error handling |
| **Cache Layer** | `lib/utils/theme-cache.ts` | Performance |
| **Validation** | `lib/utils/contrast-checker.ts` | Quality assurance |

---

## 📊 Comparison: Before vs After

| Aspect | Before | After |
|--------|--------|-------|
| **Theme Switching** | ❌ Not possible | ✅ Dynamic, <500ms |
| **Color Management** | Hardcoded hex | CSS variables |
| **Performance** | Static CSS | Optimized caching |
| **Error Handling** | None | 3-layer fallback |
| **Accessibility** | Basic | WCAG AA compliant |
| **Code Duplication** | Colors repeated | Single source of truth |

---

*Architecture Documentation*
*Phase 3 Theme Integration*
*Last Updated: 2026-01-07*
