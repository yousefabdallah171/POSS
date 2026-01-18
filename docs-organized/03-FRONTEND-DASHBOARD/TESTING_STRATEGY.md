# Testing Strategy for Phase 3

**Objective:** Ensure 160+ tests covering all functionality, performance, and accessibility
**Target Coverage:** 80%+

---

## 🧪 Testing Pyramid

```
        ╱╲ Manual Testing (Accessibility, Performance)
       ╱  ╲  5-10 tests / manual verification
      ╱────╲
     ╱      ╲ E2E Tests (User workflows)
    ╱        ╲ 5-10 tests
   ╱──────────╲
  ╱            ╲ Integration Tests (API, Store, Components)
 ╱              ╲ 15-20 tests
╱────────────────╲
                  Unit Tests (Utilities, Hooks, Store)
                  100+ tests

Total: 160+ tests
```

---

## 📋 Test Categories & Targets

### 1. Unit Tests: Stores & State Management

**Target:** 28+ tests
**File:** `__tests__/store/theme-store.test.ts`

```typescript
describe('useThemeStore', () => {
  // Initialization
  test('initializes with null theme', () => {
    const { result } = renderHook(() => useThemeStore())
    expect(result.current.currentTheme).toBeNull()
    expect(result.current.isLoading).toBe(false)
  })

  // Loading
  test('sets isLoading to true when fetching', () => { /* ... */ })
  test('sets isLoading to false when done', () => { /* ... */ })

  // Success path
  test('loads theme from API successfully', async () => { /* ... */ })
  test('persists theme to localStorage', () => { /* ... */ })
  test('loads theme from localStorage on init', () => { /* ... */ })

  // Error path
  test('handles API timeout error', async () => { /* ... */ })
  test('handles 404 error', async () => { /* ... */ })
  test('loads default theme on error', async () => { /* ... */ })
  test('stores error message in state', async () => { /* ... */ })

  // Caching
  test('uses cached theme on second load', async () => { /* ... */ })
  test('invalidates cache after TTL', async () => { /* ... */ })

  // Theme switching
  test('switches theme immediately', () => { /* ... */ })
  test('persists new theme to localStorage', () => { /* ... */ })
  test('clears error when switching theme', () => { /* ... */ })
})
```

### 2. Unit Tests: Utilities

**Target:** 80+ tests

#### Color Utilities (20+ tests)

```typescript
// __tests__/utils/theme-colors.test.ts
describe('hexToHsl', () => {
  test('converts #ffffff to 0 0% 100%', () => { /* ... */ })
  test('converts #000000 to 0 0% 0%', () => { /* ... */ })
  test('converts #b45309 correctly', () => { /* ... */ })
  test('handles uppercase hex', () => { /* ... */ })
  test('handles shorthand hex', () => { /* ... */ })
})

describe('contrast ratio', () => {
  test('calculates correct ratio for white on black', () => { /* ... */ })
  test('calculates correct ratio for black on white', () => { /* ... */ })
  test('returns 1 for same color', () => { /* ... */ })
})

describe('WCAG compliance', () => {
  test('validates WCAG AA (4.5:1)', () => { /* ... */ })
  test('validates WCAG AAA (7:1)', () => { /* ... */ })
  test('rejects low contrast', () => { /* ... */ })
})
```

#### Cache Utilities (30+ tests)

```typescript
// __tests__/utils/theme-cache.test.ts
describe('MemoryCache', () => {
  test('stores and retrieves values', () => { /* ... */ })
  test('respects TTL expiration', () => { /* ... */ })
  test('returns null for expired items', () => { /* ... */ })
  test('clears specific key', () => { /* ... */ })
  test('clears all items', () => { /* ... */ })
})

describe('StorageCache', () => {
  test('persists to localStorage', () => { /* ... */ })
  test('retrieves from localStorage', () => { /* ... */ })
  test('handles invalid JSON', () => { /* ... */ })
})

describe('ThemeCache (multi-level)', () => {
  test('checks memory first', () => { /* ... */ })
  test('falls back to localStorage', () => { /* ... */ })
  test('repopulates memory from storage', () => { /* ... */ })
  test('fetches from API when both empty', () => { /* ... */ })
})
```

#### Contrast Checker (20+ tests)

```typescript
// __tests__/utils/contrast-checker.test.ts
describe('ContrastChecker', () => {
  test('validates all warm-comfort theme colors', () => { /* ... */ })
  test('validates all modern-blue theme colors', () => { /* ... */ })
  test('detects contrast violations', () => { /* ... */ })
  test('generates contrast report', () => { /* ... */ })
  test('handles all 10 themes', () => { /* ... */ })
})
```

#### Keyboard Navigation (20+ tests)

```typescript
// __tests__/hooks/use-keyboard-navigation.test.ts
describe('useKeyboardNavigation', () => {
  test('handles Tab key', () => { /* ... */ })
  test('handles Arrow keys', () => { /* ... */ })
  test('handles Enter key', () => { /* ... */ })
  test('handles Escape key', () => { /* ... */ })
})
```

### 3. Component Tests: Rendering & Integration

**Target:** 100+ tests

#### Theme Provider Tests (15+ tests)

```typescript
// __tests__/components/theme-provider.test.tsx
describe('ThemeProvider', () => {
  test('renders children', () => { /* ... */ })
  test('injects CSS variables on mount', () => { /* ... */ })
  test('updates CSS variables on theme change', () => { /* ... */ })
  test('handles loading state', () => { /* ... */ })
  test('handles error state', () => { /* ... */ })
  test('passes through to error boundary on error', () => { /* ... */ })
})
```

#### Header Component Tests (26+ tests)

```typescript
// __tests__/components/header.test.tsx
describe('Header', () => {
  test('renders loading skeleton while theme loads', () => { /* ... */ })
  test('displays site title from theme', () => { /* ... */ })
  test('displays logo from theme', () => { /* ... */ })
  test('renders navigation items from theme', () => { /* ... */ })
  test('applies header background color', () => { /* ... */ })
  test('applies header text color', () => { /* ... */ })
  test('maintains sticky positioning', () => { /* ... */ })
  test('maintains RTL support', () => { /* ... */ })

  // For each of 10 themes
  test('warm-comfort theme renders correctly', () => { /* ... */ })
  test('modern-blue theme renders correctly', () => { /* ... */ })
  // ... 8 more
})
```

#### Footer Component Tests (24+ tests)

```typescript
// Similar to Header, covering footer-specific functionality
```

#### Product Card Tests (18+ tests)

```typescript
// __tests__/components/product-card.test.tsx
describe('ProductCard', () => {
  test('uses theme background color', () => { /* ... */ })
  test('uses theme text color', () => { /* ... */ })
  test('uses theme border color', () => { /* ... */ })
  test('uses theme primary color for price', () => { /* ... */ })
  test('works with all 10 themes', () => { /* ... */ })
  test('dark mode colors applied', () => { /* ... */ })
})
```

#### Other Components (10+ tests each)

- CartItem (18+ tests)
- CheckoutForm (18+ tests)
- OrderStatus (16+ tests)
- ThemeSelector (32+ tests)
- ThemePreview (15+ tests)
- ThemeErrorBoundary (8+ tests)
- ContrastReport (12+ tests)
- StatusIndicators (10+ tests)

### 4. Integration Tests: API & Store

**Target:** 15-20 tests

```typescript
// __tests__/integration/theme-loading.test.ts
describe('Theme Loading Flow', () => {
  test('loads theme from API and updates store', async () => { /* ... */ })
  test('persists to localStorage', async () => { /* ... */ })
  test('recovers from localStorage on reload', async () => { /* ... */ })
  test('handles API timeout gracefully', async () => { /* ... */ })
  test('falls back to default theme on error', async () => { /* ... */ })
})

// __tests__/integration/theme-switching.test.ts
describe('Theme Switching Flow', () => {
  test('switches theme < 500ms', async () => { /* ... */ })
  test('updates CSS variables on all pages', async () => { /* ... */ })
  test('persists switched theme', async () => { /* ... */ })
})
```

### 5. E2E Tests: User Workflows

**Target:** 5-10 tests
**Tools:** Cypress or Playwright

```typescript
// e2e/theme-switching.spec.ts
describe('Theme Switching E2E', () => {
  test('user can see theme selector', () => {
    cy.visit('/')
    cy.get('[data-testid="theme-selector"]').should('exist')
  })

  test('user can switch theme', () => {
    cy.visit('/')
    cy.get('[data-testid="theme-card-modern-blue"]').click()
    cy.get('body').should('have.css', '--theme-primary', expect.any(String))
  })

  test('theme persists on reload', () => {
    cy.visit('/')
    cy.get('[data-testid="theme-card-warm-comfort"]').click()
    cy.reload()
    cy.get('[data-testid="theme-card-warm-comfort"]').should('have.class', 'selected')
  })
})
```

### 6. Performance Tests

**Target:** 15+ tests

```typescript
// __tests__/performance/theme-loading.test.ts
describe('Performance Metrics', () => {
  test('theme load time < 1000ms', async () => {
    const start = performance.now()
    await loadTheme('warm-comfort')
    const duration = performance.now() - start
    expect(duration).toBeLessThan(1000)
  })

  test('CSS injection < 100ms', () => {
    const start = performance.now()
    applyThemeVariables(testTheme)
    const duration = performance.now() - start
    expect(duration).toBeLessThan(100)
  })

  test('cached theme load < 10ms', () => { /* ... */ })

  test('bundle size < 50KB', () => {
    // Analyze built bundle
    expect(bundleSize).toBeLessThan(50 * 1024)
  })
})
```

### 7. Accessibility Tests

**Target:** 60+ tests (including manual)

#### Automated Tests with axe-core

```typescript
// __tests__/a11y/axe-core.test.tsx
describe('Accessibility Audit (axe-core)', () => {
  test('no violations on page with warm-comfort theme', async () => {
    const { container } = render(<App theme="warm-comfort" />)
    const results = await axe(container)
    expect(results.violations).toHaveLength(0)
  })

  test('no violations on page with all 10 themes', async () => {
    for (const theme of allThemes) {
      const { container } = render(<App theme={theme.slug} />)
      const results = await axe(container)
      expect(results.violations).toHaveLength(0)
    }
  })
})
```

#### Manual Testing Checklist

```
Keyboard Navigation (18+ tests):
- [ ] Tab through all interactive elements
- [ ] Tab order is logical
- [ ] Focus visible on all focusable elements
- [ ] Arrow keys work in theme selector
- [ ] Enter key selects theme
- [ ] Escape key closes modals

Screen Reader (20+ tests):
- [ ] Test with NVDA
- [ ] Test with JAWS
- [ ] Test with VoiceOver
- [ ] All buttons have labels
- [ ] All images have alt text
- [ ] Color-only indicators have text

Color Contrast (22+ tests):
- [ ] All 10 themes: 4.5:1 ratio
- [ ] 0 violations reported
- [ ] Text on buttons readable
- [ ] Text on cards readable
- [ ] Links distinguishable
```

---

## 🔄 Test Execution Order

**Phase 1: Foundation**
1. Store tests (verify state management)
2. Utility tests (verify core functions)
3. Provider tests (verify injection)

**Phase 2: Components**
4. Header tests
5. Footer tests
6. Product Card tests
7. Other component tests

**Phase 3: Integration**
8. API integration tests
9. Store + Component tests
10. Full workflow tests

**Phase 4: Quality**
11. Performance tests
12. Accessibility tests
13. E2E tests

---

## 📊 Coverage Target

```
Statements   : 80%+
Branches     : 75%+
Functions    : 80%+
Lines        : 80%+
```

**Per Category:**
- Store: 95%+
- Utils: 90%+
- Components: 85%+
- API: 90%+
- Hooks: 85%+

---

## ✅ Test Checklist

- [ ] Install testing dependencies
  - [ ] jest
  - [ ] @testing-library/react
  - [ ] @testing-library/jest-dom
  - [ ] axe-core
  - [ ] jest-axe

- [ ] Configure Jest
  - [ ] jest.config.js created
  - [ ] setupFilesAfterEnv configured
  - [ ] moduleNameMapper for paths

- [ ] Create test utilities
  - [ ] renderWithTheme helper
  - [ ] mockThemeData fixtures
  - [ ] mockApiResponse helper

- [ ] Write tests
  - [ ] All store tests (28+)
  - [ ] All utility tests (80+)
  - [ ] All component tests (100+)
  - [ ] All integration tests (15+)
  - [ ] All accessibility tests (60+)

- [ ] Run tests
  - [ ] npm test passes all tests
  - [ ] Coverage report generated
  - [ ] 80%+ coverage achieved

- [ ] Manual testing
  - [ ] Keyboard navigation tested
  - [ ] Screen reader tested
  - [ ] Performance measured
  - [ ] All 10 themes verified

---

*Testing Strategy for Phase 3*
*Updated: 2026-01-07*
