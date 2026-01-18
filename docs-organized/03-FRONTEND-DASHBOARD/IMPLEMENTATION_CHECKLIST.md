# Phase 3: Implementation Checklist

**Date Started:** 2026-01-07
**Current Status:** 📋 Planning Phase
**Progress:** 0/48 tasks

---

## 🎯 Task Execution Order

### ✅ Foundation Phase (Days 1-2)

#### Task 3.1: Theme Store Integration - Zustand + API
**Status:** ⏳ Pending
**Files to Create:**
- [ ] `lib/store/theme-store.ts` - Main Zustand store
- [ ] `lib/api/theme-api.ts` - Theme API client
- [ ] `lib/utils/theme-cache.ts` - Caching utility
- [ ] `lib/utils/default-theme.ts` - Fallback theme
- [ ] `lib/hooks/use-theme.ts` - useTheme hook
- [ ] Tests: `__tests__/store/theme-store.test.ts` (28+ tests)

**Success Criteria:**
- [ ] Theme store creates successfully with Zustand
- [ ] API client connects to backend `/public/themes/:slug`
- [ ] API timeout set to 5 seconds
- [ ] Theme persists to localStorage
- [ ] Default theme loads on API error
- [ ] 28+ unit tests passing
- [ ] 0 TypeScript errors (strict mode)
- [ ] store exports useThemeStore hook
- [ ] localStorage key is 'theme-storage'
- [ ] Caching works with TTL (1 hour default)

**Definition of Done:**
```
- [ ] All 5 files created and committed
- [ ] Store hook can be imported: import { useThemeStore } from '@/lib/store/theme-store'
- [ ] Jest tests: 28+ passing
- [ ] No red squiggles in VS Code
- [ ] Package.json dependencies satisfied (zustand, axios)
```

---

#### Task 3.2: CSS Variables + Theme Provider - Foundation
**Status:** ⏳ Pending (Depends on Task 3.1)
**Files to Create:**
- [ ] `styles/theme-variables.css` - CSS variable definitions
- [ ] `lib/utils/theme-colors.ts` - Hex to HSL conversion
- [ ] `lib/utils/theme-typography.ts` - Typography utilities
- [ ] `components/theme-provider.tsx` - React Provider
- [ ] `lib/hooks/use-theme-performance.ts` - Performance hook
- [ ] Tests: `__tests__/utils/theme-colors.test.ts` (31+ tests)

**Success Criteria:**
- [ ] CSS variables inject in <100ms (requestAnimationFrame)
- [ ] All 7 color variables working: primary, secondary, accent, background, text, border, shadow
- [ ] Typography variables: font-family, font-size, line-height, border-radius
- [ ] Variables update dynamically when theme changes
- [ ] No FOUC (Flash of Unstyled Content)
- [ ] 31+ unit tests passing
- [ ] Dark mode CSS variables defined
- [ ] HSL format used for Tailwind compatibility

**Definition of Done:**
```
- [ ] theme-variables.css imported in app/globals.css
- [ ] ThemeProvider wraps app in app/layout.tsx
- [ ] Colors convert hex → HSL correctly
- [ ] Performance hook measures injection time
- [ ] All tests passing in Jest
```

---

### 📊 Component Integration Phase (Days 3-5)

#### Task 3.3: Header Component Integration
**Status:** ⏳ Pending (Depends on Task 3.2)
**Files to Modify:**
- [ ] `components/header.tsx` - Read theme config
- [ ] `styles/header.css` - NEW: Use CSS variables
- [ ] Tests: `__tests__/components/header.test.tsx` (26+ tests)

**Success Criteria:**
- [ ] Header background color from `theme.header.background_color`
- [ ] Header text color from `theme.header.text_color`
- [ ] Navigation items from `theme.header.navigation_items` array
- [ ] Logo/title from `theme.identity`
- [ ] Sticky header behavior preserved
- [ ] 26+ unit tests passing
- [ ] RTL support maintained
- [ ] Loading skeleton displayed while theme loads

**Definition of Done:**
```
- [ ] Header renders theme colors
- [ ] Navigation items populate from JSON
- [ ] No hardcoded colors left in header.tsx
- [ ] Jest tests: 26+ passing
- [ ] Visual check: Header looks right with warm-comfort theme
```

---

#### Task 3.4: Footer Component Integration
**Status:** ⏳ Pending (Depends on Task 3.2)
**Files to Modify:**
- [ ] `components/footer.tsx` - Read theme config
- [ ] `styles/footer.css` - NEW: Use CSS variables
- [ ] Tests: `__tests__/components/footer.test.tsx` (24+ tests)

**Success Criteria:**
- [ ] Footer config loaded from `theme.footer`
- [ ] Footer sections rendered dynamically
- [ ] Background color from `theme.footer.background_color`
- [ ] Text color from `theme.footer.text_color`
- [ ] Social links from `theme.footer.social_links`
- [ ] 24+ unit tests passing
- [ ] Responsive layout maintained
- [ ] RTL support maintained

**Definition of Done:**
```
- [ ] Footer renders theme colors
- [ ] Footer sections display from JSON
- [ ] No hardcoded colors left in footer.tsx
- [ ] Jest tests: 24+ passing
```

---

#### Task 3.5: Component Library Integration
**Status:** ⏳ Pending (Depends on Task 3.2)
**Files to Modify:**
- [ ] `components/product-card.tsx` - Use CSS variables
- [ ] `components/cart-item.tsx` - Use CSS variables
- [ ] `components/checkout-form.tsx` - Use CSS variables
- [ ] `components/order-status.tsx` - Use CSS variables
- [ ] Associated CSS files - NEW: Use CSS variables
- [ ] Tests: `__tests__/components/product-card.test.tsx` (70+ tests)

**Success Criteria:**
- [ ] All components use `hsl(var(--theme-*))` instead of hardcoded colors
- [ ] No hardcoded hex values remaining
- [ ] No Tailwind color names (bg-gray-100, etc.) remaining
- [ ] 70+ component tests passing
- [ ] All 10 themes tested for visual compatibility
- [ ] No visual regression from original design
- [ ] Dark mode working for all components

**Checklist per Component:**
```
ProductCard:
- [ ] Background uses --theme-background
- [ ] Text uses --theme-text
- [ ] Border uses --theme-border
- [ ] Price uses --theme-primary
- [ ] Tests passing (18+ tests)

CartItem:
- [ ] All colors mapped to CSS variables
- [ ] Tests passing (18+ tests)

CheckoutForm:
- [ ] All form colors mapped
- [ ] Input styling uses theme colors
- [ ] Tests passing (18+ tests)

OrderStatus:
- [ ] Status badges use semantic colors
- [ ] Tests passing (16+ tests)
```

**Definition of Done:**
```
- [ ] All 4 components converted
- [ ] No hardcoded colors in any component file
- [ ] Jest tests: 70+ passing
- [ ] Visual inspection: All 10 themes look good
- [ ] No visual regressions reported
```

---

### 🎨 Theme Switching Phase (Days 6-8)

#### Task 3.6: Dynamic Theme Switching
**Status:** ⏳ Pending (Depends on Task 3.5)
**Files to Create:**
- [ ] `components/theme-selector.tsx` - UI selector (grid of theme cards)
- [ ] `components/theme-preview.tsx` - Preview modal
- [ ] `styles/theme-transitions.css` - Smooth transitions
- [ ] Tests: `__tests__/components/theme-selector.test.tsx` (32+ tests)

**Success Criteria:**
- [ ] Theme selector displays all 10 themes
- [ ] Preview shows theme before applying
- [ ] Switch time < 500ms
- [ ] Smooth color transitions (0.3s)
- [ ] 32+ unit tests passing
- [ ] Keyboard accessible (Tab navigation)
- [ ] Works on mobile (touch-friendly)
- [ ] Selected theme highlighted

**Definition of Done:**
```
- [ ] Theme selector renders in app
- [ ] Can switch between all 10 themes
- [ ] Switch time measured < 500ms
- [ ] Transitions are smooth
- [ ] Jest tests: 32+ passing
- [ ] Manual keyboard test: Tab works
- [ ] Manual mobile test: Touch works
```

---

#### Task 3.7: Page-Level Integration
**Status:** ⏳ Pending (Depends on Task 3.6)
**Files to Modify:**
- [ ] `app/(pages)/menu/page.tsx` - Add theme styling
- [ ] `app/(pages)/cart/page.tsx` - Add theme styling
- [ ] `app/(pages)/checkout/page.tsx` - Add theme styling
- [ ] `app/(pages)/orders/page.tsx` - Add theme styling
- [ ] `app/layout.tsx` - Add ThemeProvider wrapper
- [ ] `app/globals.css` - Import theme-variables.css
- [ ] Tests: `__tests__/app/pages.integration.test.ts` (40+ tests)

**Success Criteria:**
- [ ] All pages styled with active theme
- [ ] RTL support maintained
- [ ] Dark mode working
- [ ] 40+ integration tests passing
- [ ] No layout shift on theme load
- [ ] Theme persists across navigation
- [ ] Responsive on all devices (mobile, tablet, desktop)

**Checklist per Page:**
```
Menu Page:
- [ ] Product cards use theme colors
- [ ] Categories use theme styling
- [ ] Tests passing (10+ tests)

Cart Page:
- [ ] Cart items use theme colors
- [ ] Totals use theme styling
- [ ] Tests passing (10+ tests)

Checkout Page:
- [ ] Form fields use theme colors
- [ ] Buttons use theme styling
- [ ] Tests passing (10+ tests)

Orders Page:
- [ ] Order items use theme colors
- [ ] Status badges use theme styling
- [ ] Tests passing (10+ tests)
```

**Definition of Done:**
```
- [ ] All 4 pages modified
- [ ] Layout.tsx wraps with ThemeProvider
- [ ] globals.css imports theme-variables.css
- [ ] Jest tests: 40+ passing
- [ ] Manual test: Theme changes all pages
- [ ] Manual test: RTL still works
- [ ] Manual test: Dark mode still works
```

---

## 🚨 Error Handling Phase (Days 5-7)

### Task E.1: Loading Fallbacks
**Status:** ⏳ Pending (Depends on Task 3.1)
**Files to Create/Modify:**
- [ ] `lib/utils/default-theme.ts` - Fallback theme
- [ ] Modify `lib/api/theme-api.ts` - Add timeout + error handling
- [ ] Tests: `__tests__/api/theme-api.test.ts` (13+ tests)

**Success Criteria:**
- [ ] API timeout set to 5 seconds
- [ ] Default theme loads on timeout
- [ ] Default theme loads on 404
- [ ] Default theme loads on 500 error
- [ ] Error message logged to console
- [ ] 13+ unit tests passing
- [ ] User sees loading state, then default theme

**Definition of Done:**
```
- [ ] Test: Simulate API timeout
- [ ] Test: API returns 404
- [ ] Test: API returns 500
- [ ] Test: Default theme loads
- [ ] Tests: 13+ passing
```

---

### Task E.2: Error Boundaries
**Status:** ⏳ Pending (Depends on Task 3.2)
**Files to Create:**
- [ ] `components/theme-error-boundary.tsx` - Error boundary
- [ ] Tests: `__tests__/components/theme-error-boundary.test.tsx` (8+ tests)

**Success Criteria:**
- [ ] Catches JavaScript errors in theme code
- [ ] Displays fallback UI (error message)
- [ ] Retry button to reload theme
- [ ] 8+ unit tests passing
- [ ] Doesn't break entire app on error

**Definition of Done:**
```
- [ ] ThemeErrorBoundary component created
- [ ] Wraps theme-related code
- [ ] Error caught with fallback UI
- [ ] Retry mechanism works
- [ ] Tests: 8+ passing
```

---

### Task E.3: Cache Invalidation
**Status:** ⏳ Pending (Depends on Task 3.1)
**Files to Modify:**
- [ ] `lib/utils/theme-cache.ts` - Cache invalidation logic
- [ ] Tests: `__tests__/utils/theme-cache.test.ts` (10+ tests)

**Success Criteria:**
- [ ] Cache expires after 1 hour (TTL)
- [ ] Manual invalidation method works
- [ ] Handles corrupted cache gracefully
- [ ] Cache version mismatch detection
- [ ] 10+ unit tests passing

**Definition of Done:**
```
- [ ] Cache TTL set to 1 hour
- [ ] clearCache() method works
- [ ] Corrupted cache detected
- [ ] Tests: 10+ passing
```

---

## ⚡ Performance Phase (Days 7-10)

### Task P.1: Loading Performance
**Status:** ⏳ Pending (Depends on Task 3.2)
**Files to Create/Modify:**
- [ ] `lib/hooks/use-theme-performance.ts` - Performance monitoring
- [ ] Modify CSS variable injection - Use requestAnimationFrame
- [ ] Tests: `__tests__/performance/theme-loading.test.ts` (23+ tests)

**Success Criteria:**
- [ ] Theme load time < 1000ms
- [ ] CSS variable injection < 100ms
- [ ] No layout shift (CLS = 0)
- [ ] 60fps maintained during injection
- [ ] 23+ unit tests passing
- [ ] Lighthouse performance score > 90

**Definition of Done:**
```
- [ ] Performance hook created
- [ ] Measure load times
- [ ] Test: Load time < 1000ms
- [ ] Test: CSS injection < 100ms
- [ ] Lighthouse: > 90 score
- [ ] Tests: 23+ passing
```

---

### Task P.2: Multi-Level Caching
**Status:** ⏳ Pending (Depends on Task 3.1)
**Files to Create/Modify:**
- [ ] Enhance `lib/utils/theme-cache.ts` - Multi-level caching
- [ ] Add memory cache layer
- [ ] Add localStorage layer
- [ ] Optional: IndexedDB layer
- [ ] Tests: `__tests__/utils/theme-cache.test.ts` (extended, 23+ new tests)

**Success Criteria:**
- [ ] Memory cache (fastest, 0.001ms)
- [ ] localStorage cache (persistent)
- [ ] Optional IndexedDB (large data)
- [ ] Subsequent loads < 10ms
- [ ] Cache fallback: memory → localStorage → fetch
- [ ] TTL: 1 hour default
- [ ] 23+ new cache tests passing

**Definition of Done:**
```
- [ ] Tiered cache implemented
- [ ] Memory cache working
- [ ] localStorage cache working
- [ ] First load: API
- [ ] Second load: < 10ms (from cache)
- [ ] Tests: 23+ new tests passing
```

---

### Task P.3: Bundle Size
**Status:** ⏳ Pending (Depends on Task 3.1-3.7)
**Files to Create/Modify:**
- [ ] Modify `next.config.js` - Enable tree-shaking
- [ ] Configure code splitting
- [ ] Lazy load theme components
- [ ] Tests: `__tests__/performance/bundle-size.test.ts` (tests)

**Success Criteria:**
- [ ] Theme code < 50KB (gzipped)
- [ ] CSS tree-shaking enabled
- [ ] Code splitting for lazy components
- [ ] Unused CSS removed
- [ ] Bundle size measured and reported

**Definition of Done:**
```
- [ ] tree-shaking enabled
- [ ] Code splitting configured
- [ ] Bundle analyzed: npx next build --analyze
- [ ] Theme code < 50KB
```

---

## ♿ Accessibility Phase (Days 8-10)

### Task A.1: Color Contrast Validation
**Status:** ⏳ Pending (Depends on Task 3.2)
**Files to Create:**
- [ ] `lib/utils/contrast-checker.ts` - WCAG contrast validation
- [ ] `components/contrast-report.tsx` - Contrast report dashboard
- [ ] Tests: `__tests__/utils/contrast-checker.test.ts` (18+ tests)

**Success Criteria:**
- [ ] WCAG AA: 4.5:1 minimum for text
- [ ] WCAG AAA: 7:1 for enhanced (optional)
- [ ] All 10 themes validated
- [ ] Contrast report dashboard functional
- [ ] 18+ unit tests passing
- [ ] 0 violations for all 10 themes

**Validation Checklist:**
```
For all 10 themes validate:
- [ ] Primary text on primary background: 4.5:1
- [ ] Secondary text on background: 4.5:1
- [ ] Button text on button background: 4.5:1
- [ ] All color pairs checked
- [ ] Report: All pass WCAG AA
```

**Definition of Done:**
```
- [ ] contrast-checker.ts created
- [ ] Validates hex colors to HSL
- [ ] Calculates luminance per W3C spec
- [ ] contrast-report.tsx displays results
- [ ] All 10 themes: 0 violations
- [ ] Tests: 18+ passing
```

---

### Task A.2: Keyboard Navigation
**Status:** ⏳ Pending (Depends on Task 3.6)
**Files to Create:**
- [ ] `lib/hooks/use-keyboard-navigation.ts` - Keyboard hook
- [ ] `styles/focus-indicators.css` - Focus indicator styles
- [ ] Tests: `__tests__/hooks/use-keyboard-navigation.test.ts` (18+ tests)

**Success Criteria:**
- [ ] Tab key navigation works
- [ ] Arrow key navigation works (theme selector)
- [ ] Focus indicators visible (3px outline)
- [ ] Focus order is logical
- [ ] Skip link to main content
- [ ] 18+ unit tests passing

**Keyboard Navigation Checklist:**
```
- [ ] Tab through theme selector
- [ ] Tab order: logical flow
- [ ] Arrow keys: navigate themes (left/right)
- [ ] Enter: select theme
- [ ] Focus indicator: visible on all interactive elements
- [ ] Focus indicator: contrasts with background
- [ ] Skip link: before header
```

**Definition of Done:**
```
- [ ] use-keyboard-navigation.ts created
- [ ] focus-indicators.css created
- [ ] Manual keyboard test passed
- [ ] Tests: 18+ passing
```

---

### Task A.3: Screen Reader Compatibility
**Status:** ⏳ Pending (Depends on Task 3.2)
**Files to Create/Modify:**
- [ ] `components/status-indicators.tsx` - Accessible status badges
- [ ] Add ARIA labels to interactive elements
- [ ] Add semantic HTML throughout
- [ ] Tests: `__tests__/a11y/screen-reader.test.ts` (16+ tests)

**Success Criteria:**
- [ ] Semantic HTML (nav, main, footer, etc.)
- [ ] ARIA labels on all interactive elements
- [ ] Screen reader text (sr-only class) for visual-only content
- [ ] Status messages announced
- [ ] No color-only status indicators
- [ ] 16+ unit tests passing

**Accessibility Checklist:**
```
- [ ] Use <button> not <div> for buttons
- [ ] Use <nav> for navigation
- [ ] Use <main> for main content
- [ ] Use <footer> for footer
- [ ] aria-label on icon buttons
- [ ] aria-describedby for descriptions
- [ ] Role="region" for important sections
- [ ] Status indicators have text + icon
```

**Definition of Done:**
```
- [ ] status-indicators.tsx created
- [ ] ARIA labels added
- [ ] Semantic HTML throughout
- [ ] Manual screen reader test (NVDA/JAWS)
- [ ] Tests: 16+ passing
```

---

### Task A.4: Accessibility Testing
**Status:** ⏳ Pending (Depends on A.1-A.3)
**Files to Create/Modify:**
- [ ] `__tests__/a11y/axe-core.test.ts` - Automated accessibility tests
- [ ] Manual keyboard testing checklist
- [ ] Manual screen reader testing checklist
- [ ] CI/CD: Add accessibility gate

**Success Criteria:**
- [ ] axe-core automated tests passing
- [ ] 0 critical accessibility issues
- [ ] 0 serious accessibility issues
- [ ] Manual keyboard testing complete
- [ ] Manual screen reader testing complete (NVDA, JAWS, VoiceOver)
- [ ] Contrast validation in CI/CD

**Accessibility Audit Checklist:**
```
Automated (axe-core):
- [ ] Run axe-core tests
- [ ] 0 violations
- [ ] 0 warnings

Manual Keyboard Testing:
- [ ] Test with Tab key
- [ ] Test with arrow keys
- [ ] Test with Enter/Space
- [ ] Focus visible on all elements
- [ ] Tab order makes sense

Manual Screen Reader Testing:
- [ ] Test with NVDA
- [ ] Test with JAWS
- [ ] Test with VoiceOver
- [ ] All text readable
- [ ] All buttons labeled
- [ ] Status messages announced

Contrast Validation:
- [ ] All color pairs: 4.5:1
- [ ] Generated accessibility report
```

**Definition of Done:**
```
- [ ] axe-core: 0 violations
- [ ] Manual keyboard: passed
- [ ] Manual screen reader: passed
- [ ] CI/CD gate: accessibility passes
- [ ] Accessibility audit report generated
```

---

## 🧪 Testing & QA Phase

### Quality Assurance Checklist

**Unit Tests: 160+ total**
- [ ] Task 3.1: 28+ tests ✅
- [ ] Task 3.2: 31+ tests ✅
- [ ] Task 3.3: 26+ tests ✅
- [ ] Task 3.4: 24+ tests ✅
- [ ] Task 3.5: 70+ tests ✅
- [ ] Task 3.6: 32+ tests ✅
- [ ] Task 3.7: 40+ tests ✅
- [ ] Task E.1: 13+ tests ✅
- [ ] Task E.2: 8+ tests ✅
- [ ] Task E.3: 10+ tests ✅
- [ ] Task P.1: 23+ tests ✅
- [ ] Task P.2: 23+ tests ✅
- [ ] Task P.3: tests ✅
- [ ] Task A.1: 18+ tests ✅
- [ ] Task A.2: 18+ tests ✅
- [ ] Task A.3: 16+ tests ✅
- [ ] Task A.4: tests ✅

**Code Coverage**
- [ ] Overall coverage: > 80%
- [ ] Critical paths: > 95%
- [ ] Components: > 85%
- [ ] Utils: > 90%

**Performance Testing**
- [ ] Theme load: < 1000ms
- [ ] CSS injection: < 100ms
- [ ] Switch time: < 500ms
- [ ] Lighthouse score: > 90

**Accessibility Audit**
- [ ] WCAG AA: Pass
- [ ] Contrast ratio: 4.5:1 (all themes)
- [ ] Keyboard navigation: Pass
- [ ] Screen reader: Pass

**Cross-Browser Testing**
- [ ] Chrome: ✅
- [ ] Firefox: ✅
- [ ] Safari: ✅
- [ ] Edge: ✅

**Mobile Responsive Testing**
- [ ] Mobile (< 640px): ✅
- [ ] Tablet (640-1024px): ✅
- [ ] Desktop (> 1024px): ✅

---

## 📚 Documentation Tasks

### Documentation Checklist

**README Updates**
- [ ] Installation instructions
- [ ] Configuration guide
- [ ] Quick start example

**Theme Integration Guide**
- [ ] How to use themes
- [ ] Theme structure
- [ ] Adding new themes

**Error Handling Guide**
- [ ] Common errors
- [ ] Troubleshooting
- [ ] FAQ

**Accessibility Guide**
- [ ] WCAG compliance
- [ ] Testing procedure
- [ ] Keyboard shortcuts

---

## ✅ Definition of Done for Phase 3

### Code Requirements
- [ ] All 48 tasks completed
- [ ] All 20+ files created/updated
- [ ] All 160+ tests passing
- [ ] 80%+ code coverage
- [ ] 0 critical issues
- [ ] TypeScript strict mode

### Functionality Requirements
- [ ] All 10 themes load
- [ ] Theme switching < 500ms
- [ ] All pages styled
- [ ] RTL support maintained
- [ ] Dark mode maintained
- [ ] Theme persists to localStorage

### Performance Requirements
- [ ] Load: < 1000ms
- [ ] Injection: < 100ms
- [ ] Bundle: < 50KB
- [ ] Lighthouse: > 90
- [ ] No memory leaks
- [ ] Core Web Vitals passed

### Accessibility Requirements
- [ ] WCAG AA compliant
- [ ] 4.5:1 contrast
- [ ] Keyboard navigation
- [ ] Screen reader compatible
- [ ] Focus indicators visible
- [ ] No color-only indicators

---

## 📊 Progress Summary

**Total Tasks:** 48
**Completed:** 0
**In Progress:** 0
**Pending:** 48

**Progress:** 0%

```
████████████████████████████ 0% (0/48 tasks completed)
```

**Last Updated:** 2026-01-07
**Ready for Implementation:** ✅ Yes

