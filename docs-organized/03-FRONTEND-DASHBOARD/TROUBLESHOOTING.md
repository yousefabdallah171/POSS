# Phase 3 Troubleshooting Guide

**Purpose:** Solve common issues during Phase 3 implementation
**Last Updated:** 2026-01-07

---

## 🔴 Common Issues & Solutions

### Issue: Theme doesn't load (blank page or white page)

**Symptom:** App loads but no theme colors visible

**Causes:**
1. Backend API not running
2. API endpoint path incorrect
3. CORS issue
4. Timeout (5 seconds) exceeded

**Solutions:**

```bash
# 1. Check backend is running
curl http://localhost:8080/api/v1/public/themes/warm-comfort

# 2. Check browser console for errors
# Look for 404, 500, timeout messages

# 3. Verify API URL in config
# apps/restaurant-website/lib/api/api-client.ts
// Should show: http://localhost:8080/api/v1

# 4. Check browser network tab
# Should show successful theme-api request

# 5. If timeout, check backend performance
# Increase timeout from 5000ms to 10000ms temporarily:
// lib/api/theme-api.ts
timeout: 10000  // instead of 5000
```

---

### Issue: CSS variables not injecting

**Symptom:** Theme loads but colors don't apply

**Causes:**
1. CSS variables not defined in stylesheet
2. Theme provider not wrapping app
3. CSS variables using wrong format (should be HSL)
4. requestAnimationFrame not being called

**Solutions:**

```bash
# 1. Check CSS variables exist in browser
# Open DevTools → Elements → <html>
# Should show: --theme-primary, --theme-secondary, etc.

# 2. Verify ThemeProvider in layout.tsx
# app/layout.tsx should have:
// <ThemeProvider>
//   {children}
// </ThemeProvider>

# 3. Check CSS variable format
# styles/theme-variables.css should use HSL:
// --theme-primary: 0 100% 50%;  ✅ CORRECT
// --theme-primary: #ff0000;    ❌ WRONG

# 4. Check requestAnimationFrame is called
// lib/utils/theme-colors.ts
// Should use: requestAnimationFrame(() => { ... })

# 5. Manual test in browser console:
document.documentElement.style.getPropertyValue('--theme-primary')
// Should return HSL value like "0 100% 50%"
```

---

### Issue: Components don't see theme colors

**Symptom:** Components rendered but all showing default colors

**Causes:**
1. Components using old hardcoded colors instead of CSS variables
2. CSS variables not being used in component CSS
3. Tailwind config not referencing theme variables
4. Import order issue

**Solutions:**

```typescript
// ✅ CORRECT: Using CSS variables
<div style={{ color: `hsl(var(--theme-text))` }}>

// ❌ WRONG: Still using hardcoded colors
<div className="text-gray-900">

// ✅ In CSS:
.my-component {
  background-color: hsl(var(--theme-background));
  color: hsl(var(--theme-text));
}

// Check component files:
// 1. Grep for hardcoded colors
grep -r "text-gray-900\|bg-gray-100\|#[0-9a-f]" src/components/

// 2. Replace with CSS variables
// Find: className="text-gray-900"
// Replace with: style={{ color: 'hsl(var(--theme-text))' }}

// 3. Check Tailwind config
// apps/restaurant-website/tailwind.config.js
// Should reference CSS variables:
// primary: 'hsl(var(--theme-primary))'
```

---

### Issue: useThemeStore is undefined

**Symptom:** Error: "useThemeStore is not exported"

**Causes:**
1. Store file not created yet
2. Export statement missing
3. Wrong import path
4. TypeScript import issue

**Solutions:**

```typescript
// Verify file exists:
// lib/store/theme-store.ts

// Verify export statement at end of file:
export const useThemeStore = create<ThemeStore>(...) ✅

// Verify import path is correct:
import { useThemeStore } from '@/lib/store/theme-store' ✅
// NOT: from './lib/store/theme-store'
// NOT: from '@/store/theme-store'

// Clear TypeScript cache:
rm -rf node_modules/.cache
npm run build

// Restart TypeScript server in VS Code:
// Cmd+Shift+P → "TypeScript: Restart TS Server"
```

---

### Issue: localStorage not persisting theme

**Symptom:** Theme resets on page reload

**Causes:**
1. Zustand persist middleware not configured
2. localStorage quota exceeded
3. Private browsing mode (localStorage disabled)
4. Storage key name mismatch

**Solutions:**

```typescript
// Check persist middleware in store:
export const useThemeStore = create<ThemeStore>()(
  persist(  // ✅ Middleware must be here
    (set) => ({ /* store logic */ }),
    {
      name: 'theme-storage',  // ✅ Key name
      storage: createJSONStorage(() => localStorage),  // ✅ Must use localStorage
    }
  )
)

// Check localStorage in browser:
// DevTools → Application → Local Storage → current URL
// Should show 'theme-storage' key with theme data

// If not showing:
// 1. Private browsing mode? → Won't work, use normal mode
// 2. localStorage quota? → Clear some data
//    localStorage.clear()  // Clears all
// 3. Check browser console for errors:
//    QuotaExceededError → storage full

// Manually test persistence:
localStorage.setItem('test', 'data')
localStorage.getItem('test')  // Should return 'data'
```

---

### Issue: Theme API returns 404

**Symptom:** Error: "Theme not found"

**Causes:**
1. Theme slug spelling wrong
2. Backend theme not created
3. API endpoint wrong
4. Database empty

**Solutions:**

```bash
# 1. Check theme slug spelling
# Should match backend exactly (case-sensitive):
warm-comfort  ✅
Warm-Comfort  ❌
warmcomfort   ❌

# 2. Test API directly:
curl http://localhost:8080/api/v1/public/themes/warm-comfort
# Should return theme JSON, not 404

# 3. List all available themes:
curl http://localhost:8080/api/v1/public/themes
# Check if theme exists in list

# 4. Check backend theme database:
# Verify themes were created in Phase 2
# Check database: SELECT * FROM themes;

# 5. Use getDefaultTheme() while backend is being fixed
// lib/utils/default-theme.ts
// Returns a valid theme immediately
```

---

### Issue: Tests failing

**Symptom:** Jest tests not passing

**Causes:**
1. Mock data not set up
2. Test environment not configured
3. Async not awaited
4. Missing test file

**Solutions:**

```bash
# 1. Run specific test file:
npm test -- theme-store.test.ts

# 2. Watch mode for development:
npm test -- --watch

# 3. Check test output for specific error
# Look for: TypeError, ReferenceError, SyntaxError, AssertionError

# 4. Verify test file exists:
ls __tests__/store/theme-store.test.ts

# 5. Check imports are correct:
import { useThemeStore } from '@/lib/store/theme-store'  ✅
import { getThemeBySlug } from '@/lib/api/theme-api'  ✅

# 6. Mock API in tests:
jest.mock('@/lib/api/theme-api', () => ({
  getThemeBySlug: jest.fn(),
}))

# 7. Clear cache:
npm test -- --clearCache
```

---

### Issue: Performance slow (> 1000ms)

**Symptom:** Theme takes a long time to load

**Causes:**
1. API slow (backend issue)
2. No caching enabled
3. CSS injection not using requestAnimationFrame
4. Large theme data size

**Solutions:**

```typescript
// 1. Measure where time is spent:
const start = performance.now()

// API call
const apiStart = performance.now()
const theme = await getThemeBySlug(slug)
console.log(`API: ${performance.now() - apiStart}ms`)

// CSS injection
const cssStart = performance.now()
applyThemeVariables(theme)
console.log(`CSS: ${performance.now() - cssStart}ms`)

const total = performance.now() - start
console.log(`Total: ${total}ms`)

// 2. Enable caching:
// lib/store/theme-store.ts should use ThemeCache
// Not calling API directly every time

// 3. Verify requestAnimationFrame:
requestAnimationFrame(() => {
  // Batch all DOM updates here
  for (let [key, value] of Object.entries(variables)) {
    root.style.setProperty(key, value)
  }
})
// Not: document.documentElement.style.setProperty() in loop

// 4. Check theme data size:
console.log(JSON.stringify(theme).length)  // Should be < 10KB

// 5. Use Lighthouse:
// Open DevTools → Lighthouse
// Run Performance audit
// Look for slow themes load
```

---

### Issue: TypeScript errors

**Symptom:** Red squiggles in editor, build fails

**Causes:**
1. Type definition missing
2. Wrong type imported
3. tsconfig.json not including paths
4. No-implicit-any error

**Solutions:**

```typescript
// 1. Define types properly:
interface ThemeData {
  name: string
  slug: string
  colors: {
    primary: string
    secondary: string
    // ... all required fields
  }
  // ... all other fields
}

// 2. Use interfaces not just objects:
const theme: ThemeData = { /* ... */ }  ✅
const theme = { /* ... */ }  // Missing explicit type

// 3. Check tsconfig.json:
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]  // ✅ Required for @/ imports
    },
    "strict": true,  // ✅ Enable strict mode
    "noImplicitAny": true,  // ✅ Errors on any type
  }
}

// 4. Fix typing issues:
// Error: "Property does not exist"
// → Add missing property or make optional (?)
// Error: "Type is any"
// → Add explicit type: const x: string = ...
// Error: "Cannot find module"
// → Check import path is correct

// 5. Build to check all errors:
npm run build
// Not just relying on VS Code showing errors

// 6. Check for unused imports:
// Remove unused imports causing issues
import { unused } from './module'  ❌
// Should be removed
```

---

### Issue: RTL support broken

**Symptom:** Right-to-left layout not working

**Causes:**
1. Theme classes not RTL-aware
2. CSS not using logical properties
3. Theme provider doesn't handle RTL

**Solutions:**

```typescript
// 1. Use logical properties instead of left/right:
// ✅ CORRECT:
padding-inline-start: 16px;  // right on LTR, left on RTL
padding-inline-end: 16px;
margin-inline-start: auto;
text-align: start;  // left on LTR, right on RTL

// ❌ WRONG:
padding-left: 16px;
padding-right: 16px;
margin-left: auto;
text-align: left;

// 2. Check theme data:
// Theme should not include direction-specific values
// OR include both LTR and RTL values

// 3. Tailwind RTL support:
// tailwind.config.js should have:
module.exports = {
  corePlugins: {
    textDirection: true,  // ✅ Enable RTL
  },
}

// 4. Test RTL:
// Add dir="rtl" to HTML:
<html dir="rtl">
// Reload page
// Layout should flip
```

---

### Issue: Dark mode colors wrong

**Symptom:** Dark mode activated but wrong colors

**Causes:**
1. Dark mode CSS variables not defined
2. CSS using @media (prefers-color-scheme)
3. next-themes configuration issue
4. Different theme for dark mode

**Solutions:**

```typescript
// 1. Define dark mode variables:
// styles/theme-variables.css
:root {
  --theme-primary: 0 100% 50%;       // Light mode
  --theme-background: 0 0% 100%;
  --theme-text: 0 0% 0%;
}

@media (prefers-color-scheme: dark) {
  :root {
    --theme-primary: 0 100% 60%;     // Dark mode (adjusted)
    --theme-background: 0 0% 10%;
    --theme-text: 0 0% 100%;
  }
}

// 2. Check next-themes setup:
// app/layout.tsx should have:
<ThemeProvider attribute="class" defaultTheme="system">
  {children}
</ThemeProvider>

// 3. Test dark mode toggle:
// VS Code: Cmd+Shift+P → "Enable/Disable Dark Mode"
// Browser: DevTools → Rendering → Emulate CSS media feature prefers-color-scheme

// 4. Check if theme has dark variant:
// Some themes might need different colors for dark mode
// Verify in theme JSON: "dark_mode": { "primary": "..." }
```

---

## 📋 Debug Checklist

When something isn't working, go through this checklist:

```
General:
- [ ] Backend API running: curl http://localhost:8080/api/v1/public/themes/warm-comfort
- [ ] Browser console: Any errors or warnings?
- [ ] Network tab: API requests successful?
- [ ] localStorage: 'theme-storage' key exists?

Store:
- [ ] useThemeStore can be imported?
- [ ] Store initializes without error?
- [ ] loadTheme() is callable?
- [ ] currentTheme updates in store?

CSS:
- [ ] CSS variables exist in <html>?
- [ ] CSS variable values correct (HSL format)?
- [ ] requestAnimationFrame being used?
- [ ] All DOM updates batched?

Components:
- [ ] No hardcoded colors remaining?
- [ ] Using CSS variables instead?
- [ ] ThemeProvider wraps everything?
- [ ] Components render without error?

Performance:
- [ ] Load time measured < 1000ms?
- [ ] CSS injection < 100ms?
- [ ] Cache working?
- [ ] Memory usage reasonable?

Tests:
- [ ] All tests pass?
- [ ] Coverage > 80%?
- [ ] No console errors in tests?
- [ ] Mocks set up correctly?
```

---

## 🆘 When All Else Fails

1. **Clear everything:**
   ```bash
   rm -rf node_modules .next __tests__/.cache
   npm install
   npm run dev
   ```

2. **Check git diff:**
   ```bash
   git status  # See what you changed
   git diff    # See exact changes
   ```

3. **Revert to last working commit:**
   ```bash
   git checkout HEAD -- .  # Discard all changes
   git clean -fd           # Remove new files
   ```

4. **Ask for help:**
   - Check IMPLEMENTATION_CHECKLIST.md for what should be done
   - Review ARCHITECTURE.md for design decisions
   - Look at API_INTEGRATION.md for API details
   - Check code examples in EXAMPLES/ folder

---

## 📞 Quick Reference

| Error | Check | Fix |
|-------|-------|-----|
| 404 Theme | Backend running? | Start backend, verify slug |
| CSS not applying | Variables defined? | Check :root in DevTools |
| useThemeStore undefined | File created? | Create lib/store/theme-store.ts |
| Tests fail | Mocks set up? | Create __mocks__/theme-data.ts |
| Dark mode wrong | Media query? | Add @media (prefers-color-scheme: dark) |
| RTL broken | Logical properties? | Use padding-inline instead of padding-left |
| Slow performance | Caching enabled? | Verify cache in lib/utils/theme-cache.ts |
| TypeScript errors | Types defined? | Add proper interface definitions |

---

*Troubleshooting Guide for Phase 3*
*Last Updated: 2026-01-07*
