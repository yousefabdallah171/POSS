# Multi-Language, RTL & Responsive Design Documentation

## Overview

This documentation covers the complete implementation of multi-language support (English & Arabic), RTL (Right-to-Left) layout support, and responsive design for mobile, tablet, and desktop devices in the POS Dashboard application.

The system uses URL-based locale routing, Zustand state management for preferences, JSON-based translations, and Tailwind CSS for responsive styling.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [URL-Based Locale Routing](#url-based-locale-routing)
3. [Translation System](#translation-system)
4. [Global State Management](#global-state-management)
5. [RTL Support](#rtl-support)
6. [Responsive Design](#responsive-design)
7. [Theme & Color Customization](#theme--color-customization)
8. [File Structure & Paths](#file-structure--paths)
9. [Implementation Guide](#implementation-guide)
10. [Testing & Verification](#testing--verification)

---

## Architecture Overview

The multi-language system is built on three core pillars:

### 1. **URL-Based Locale Routing**
- Every dashboard route includes a locale prefix: `/[locale]/dashboard/...`
- Locales: `en` (English), `ar` (Arabic)
- Example URLs:
  - English: `http://localhost:3002/en/dashboard`
  - Arabic: `http://localhost:3002/ar/dashboard`

### 2. **Centralized Translation System**
- All text comes from JSON translation files, never hardcoded
- English translations: `en.json`
- Arabic translations: `ar.json`
- Components use `createTranslator()` to get locale-specific `t()` function

### 3. **Zustand-Based State Management**
- Global preferences stored in `usePreferencesStore`
- Preferences include: language, theme (light/dark/system), primary/secondary/accent colors
- Preferences persisted to localStorage via Zustand persist middleware
- Changes apply globally across entire dashboard

---

## URL-Based Locale Routing

### How It Works

1. **Route Structure**: `app/[locale]/dashboard/[...pages]`
   - Dynamic `[locale]` parameter captures language prefix from URL
   - All pages nested under `[locale]` automatically receive locale context
   - Next.js generates separate routes for each locale

2. **Locale Detection**
   - `getLocaleFromPath(pathname)` utility function extracts locale from URL path
   - Always safe fallback to 'en' if extraction fails
   - Function location: `src/lib/translations.ts`

```typescript
// Example usage
const pathname = usePathname() // "/en/dashboard/products"
const locale = getLocaleFromPath(pathname) // Returns "en"
```

3. **Language Switching Flow**
   - User clicks language switcher
   - `handleLanguageChange()` in LanguageSwitcher updates preferences store
   - Router redirects to new locale URL: `/ar/dashboard/...`
   - Page reloads with new locale
   - Components read new locale and load correct translations

### Key Files

- [app/[locale]/layout.tsx](../frontend/apps/dashboard/src/app/%5Blocale%5D/layout.tsx) - Root locale layout
- [lib/translations.ts](../frontend/apps/dashboard/src/lib/translations.ts) - Locale utilities

---

## Translation System

### JSON Translation Files

All text in the application comes from two JSON files. NO hardcoded text is allowed anywhere.

#### File Locations

- **English**: `frontend/apps/dashboard/src/i18n/messages/en.json`
- **Arabic**: `frontend/apps/dashboard/src/i18n/messages/ar.json`

#### Translation Keys Structure

```json
{
  "common": {
    "profile": "Profile",
    "settings": "Settings",
    "logout": "Logout"
  },
  "navigation": {
    "products": "Products",
    "employees": "Employees",
    "hr": "Human Resources"
  },
  "products": {
    "title": "Products Management",
    "addNew": "Add New Product",
    "placeholderName": "e.g., Grilled Chicken"
  }
}
```

### How to Add New Translations

1. **Add to English (en.json)**
   ```json
   {
     "myFeature": {
       "title": "My Feature Title",
       "description": "Feature description"
     }
   }
   ```

2. **Add to Arabic (ar.json)** - Must have exact same structure
   ```json
   {
     "myFeature": {
       "title": "عنوان ميزتي",
       "description": "وصف الميزة"
     }
   }
   ```

3. **Use in Component**
   ```typescript
   import { createTranslator } from '@/lib/translations'

   const t = createTranslator(locale)
   const title = t('myFeature.title')
   ```

### Using Translations in Components

#### Client Components (with hooks)

```typescript
'use client'

import { usePathname } from 'next/navigation'
import { getLocaleFromPath, createTranslator } from '@/lib/translations'

export default function MyComponent() {
  const pathname = usePathname()
  const locale = getLocaleFromPath(pathname)
  const t = createTranslator(locale)

  return <h1>{t('myFeature.title')}</h1>
}
```

#### Server Components (with params)

```typescript
export default function MyPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const t = createTranslator(locale)

  return <h1>{t('myFeature.title')}</h1>
}
```

### Translation Key Naming Conventions

- Use **dot notation** for nested keys: `products.addNew`
- Use **camelCase** for key names: `placeholderName` not `placeholder_name`
- Group related translations: `common`, `navigation`, `products`, `hr`, `settings`
- Use **descriptive names**: `productNamePlaceholder` better than `placeholder1`

---

## Global State Management

### Preferences Store (Zustand)

The application uses Zustand to manage global user preferences.

#### Store Location
`frontend/apps/dashboard/src/stores/preferencesStore.ts`

#### Store Structure

```typescript
interface Settings {
  language: 'en' | 'ar'
  theme: 'light' | 'dark' | 'system'
  primaryColor: string
  secondaryColor: string
  accentColor: string
}

const usePreferencesStore = create<PreferencesState>()(
  persist((set, get) => ({
    settings: defaultSettings,
    setSettings: (newSettings) => { ... }
  }), {
    name: 'pos-preferences' // localStorage key
  })
)
```

#### Using the Store

**In Components**
```typescript
import { usePreferencesStore } from '@/stores/preferencesStore'

export function MyComponent() {
  const { settings, setSettings } = usePreferencesStore()

  const handleThemeChange = (newTheme) => {
    setSettings({
      ...settings,
      theme: newTheme
    })
  }

  return <div>Current theme: {settings.theme}</div>
}
```

**Getting State Outside Components**
```typescript
const { settings, setSettings } = usePreferencesStore.getState()
```

### What Gets Persisted

- **Language**: User's preferred language
- **Theme**: Light, dark, or system-based
- **Colors**: Primary, secondary, and accent colors
- **localStorage Key**: `pos-preferences`

### Preference Flow

```
User changes setting in Settings page
    ↓
setSettings() called with updated settings object
    ↓
Store's applyTheme() and applyColors() execute
    ↓
Changes applied to DOM (CSS classes and variables)
    ↓
Zustand persist middleware saves to localStorage
    ↓
Preferences available on next page load
```

---

## RTL Support

### How RTL Works

RTL (Right-to-Left) support is implemented at the HTML level and CSS level:

1. **HTML `dir` Attribute**: Set based on current locale
   - `dir="ltr"` for English (`en`)
   - `dir="rtl"` for Arabic (`ar`)

2. **CSS Media Selector**: `html[dir='rtl']` selector targets RTL-specific styles
   - Margin/padding flipped automatically
   - Text alignment reversed
   - Flexbox direction reversed in RTL context

### Setting the Direction

#### In Layout Files

```typescript
// app/[locale]/layout.tsx
const dir = locale === 'ar' ? 'rtl' : 'ltr'

return (
  <html lang={locale} dir={dir} suppressHydrationWarning>
    <body>{children}</body>
  </html>
)
```

### RTL CSS Rules

#### CSS File Location
`frontend/apps/dashboard/src/styles/rtl.css`

#### Common RTL Rules

```css
/* Sidebar chevron arrow rotation */
html[dir='rtl'] .sidebar-chevron-right {
  transform: scaleX(-1);
}

html[dir='rtl'] .sidebar-chevron-down {
  transform: scaleX(-1);
}

/* Search icon positioning */
html[dir='rtl'] .search-input-container .search-icon {
  right: auto;
  left: 12px;
}

html[dir='rtl'] .search-input-container input {
  padding-right: 40px;
  padding-left: 12px;
}

/* Dropdown menu positioning */
html[dir='rtl'] .dropdown-menu {
  right: auto;
  left: 0;
}
```

### RTL Detection in Components

Always detect RTL status using locale:

```typescript
import { usePathname } from 'next/navigation'
import { getLocaleFromPath } from '@/lib/translations'

export function MyComponent() {
  const pathname = usePathname()
  const locale = getLocaleFromPath(pathname)
  const isRTL = locale === 'ar'

  return (
    <div className={isRTL ? 'text-right' : 'text-left'}>
      Content
    </div>
  )
}
```

### Dynamic Class Application

```typescript
// For elements that need conditional classes
<div className={`
  flex
  ${isRTL ? 'flex-row-reverse' : 'flex-row'}
  gap-4
`}>
  Items
</div>

// For positioning
<Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-3 h-4 w-4`} />

// For margin/padding
<div className={isRTL ? 'mr-4' : 'ml-4'}>Content</div>
```

### Files Implementing RTL

- [styles/rtl.css](../frontend/apps/dashboard/src/styles/rtl.css) - CSS rules
- [components/layout/DashboardLayout.tsx](../frontend/apps/dashboard/src/components/layout/DashboardLayout.tsx) - RTL dropdown positioning
- [components/layout/Sidebar.tsx](../frontend/apps/dashboard/src/components/layout/Sidebar.tsx) - RTL chevron rotation
- [components/layout/LanguageSwitcher.tsx](../frontend/apps/dashboard/src/components/layout/LanguageSwitcher.tsx) - RTL dropdown
- All list components - RTL search icon positioning

---

## Responsive Design

### Breakpoints Used

The application uses Tailwind CSS breakpoints:

| Breakpoint | Class Prefix | Screen Width | Device Type |
|-----------|--------------|--------------|------------|
| xs | (none) | < 640px | Mobile phones |
| sm | sm: | ≥ 640px | Small tablets |
| md | md: | ≥ 768px | Tablets |
| lg | lg: | ≥ 1024px | Desktops |
| xl | xl: | ≥ 1280px | Large desktops |

### Mobile-First Approach

Always start with mobile styles, then add tablet/desktop overrides:

```typescript
// ❌ Wrong - desktop-first
<div className="flex-row sm:flex-col">

// ✅ Correct - mobile-first
<div className="flex-col sm:flex-row">
```

### Responsive Patterns Used

#### 1. Page Headers (All dashboard pages)

```typescript
// Used in: products, employees, categories, attendance, leaves, payroll, roles pages

<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
  <div>
    <h1 className="text-2xl sm:text-3xl font-bold">Page Title</h1>
    <p className="text-gray-500">Description</p>
  </div>
  <button className="w-full sm:w-auto">Add New</button>
</div>
```

- **Mobile**: Single column, full-width button
- **Tablet+**: Row layout, auto-width button, centered items

#### 2. Form Grids

```typescript
// Used in: ProductForm, EmployeeForm, RoleForm

<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  <input placeholder="Field 1" />
  <input placeholder="Field 2" />
</div>
```

- **Mobile**: Single column
- **Tablet+**: Two columns

#### 3. Filter Sections

```typescript
// Used in: ProductList, all HR lists

<div className="flex flex-col sm:flex-row gap-4">
  <input placeholder="Search..." />
  <select>{/* options */}</select>
</div>
```

- **Mobile**: Stacked vertically, full-width
- **Tablet+**: Horizontal, auto-width

#### 4. Tables

```typescript
<div className="overflow-x-auto">
  <table className="w-full">
    {/* table content */}
  </table>
</div>
```

- **Mobile**: Horizontally scrollable
- **Tablet+**: Full width

#### 5. Color Picker

```typescript
// Used in: Settings page color customization

<div className="flex flex-col sm:flex-row gap-4">
  <div className="flex-1">
    <label>Color 1</label>
    <input type="color" />
  </div>
  <div className="flex-1">
    <label>Color 2</label>
    <input type="color" />
  </div>
</div>
```

- **Mobile**: Stacked
- **Tablet+**: Side by side

### Responsive Classes Reference

```typescript
// Display
display: 'block'              // sm:hidden, md:block
visible: true                 // sm:invisible

// Layout
flex-direction: 'column'      // sm:flex-row, md:flex-row-reverse
justify-content: 'center'     // sm:justify-between

// Spacing
width: 'w-full'               // sm:w-auto
padding: 'p-4'                // sm:p-6, md:p-8
margin: 'mx-2'                // sm:mx-4, md:mx-6
gap: 'gap-2'                  // sm:gap-4, md:gap-6

// Text
font-size: 'text-lg'          // sm:text-xl, md:text-2xl
text-align: 'text-center'     // sm:text-left
```

---

## Theme & Color Customization

### Theme System

The application uses `next-themes` library for theme management with custom color support.

#### How Theme Works

1. **Default Theme**: Set in layout
   ```typescript
   <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
   ```

2. **Theme Application**: CSS classes on `<html>` element
   - Light theme: no `dark` class
   - Dark theme: `dark` class added to `<html>`
   - System: Respects OS preference

3. **Theme Toggle**: Accessible via Settings page
   - Users can select: Light, Dark, or System
   - Choice persisted to preferences store
   - Applied globally across dashboard

### Custom Colors

#### Color Variables

Custom colors are stored as CSS variables:

```css
:root {
  --color-primary: #3b82f6;      /* Blue by default */
  --color-secondary: #10b981;    /* Green by default */
  --color-accent: #f59e0b;       /* Amber by default */
}

html.dark {
  --color-primary: #1d4ed8;      /* Darker blue in dark mode */
  --color-secondary: #059669;    /* Darker green in dark mode */
  --color-accent: #d97706;       /* Darker amber in dark mode */
}
```

#### Setting Colors Programmatically

```typescript
function applyColors(primaryColor: string, secondaryColor: string, accentColor: string) {
  const root = document.documentElement
  root.style.setProperty('--color-primary', primaryColor)
  root.style.setProperty('--color-secondary', secondaryColor)
  root.style.setProperty('--color-accent', accentColor)
}
```

#### Using Custom Colors in Components

```typescript
<button className="bg-[var(--color-primary)] text-white">
  Click me
</button>
```

### Settings Page Implementation

**Location**: `frontend/apps/dashboard/src/app/[locale]/dashboard/settings/page.tsx`

The settings page has three main customization sections:

1. **Language Selection**
   - Options: English, Arabic
   - Saves to preferences store and API
   - Triggers page redirect to new locale

2. **Theme Selection**
   - Options: Light, Dark, System
   - Saves to preferences store and API
   - Applies immediately to dashboard

3. **Color Customization**
   - Three color pickers: Primary, Secondary, Accent
   - Live preview of colors
   - Saves to preferences store and API
   - Updates CSS variables globally

---

## File Structure & Paths

### Directory Organization

```
frontend/apps/dashboard/src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx                    # Locale layout with dir attribute
│   │   └── dashboard/
│   │       ├── layout.tsx                # Dashboard layout with providers
│   │       ├── page.tsx                  # Dashboard home
│   │       ├── products/
│   │       │   ├── page.tsx              # Products list (responsive)
│   │       │   └── [id]/
│   │       │       └── page.tsx
│   │       ├── categories/
│   │       │   └── page.tsx              # Categories list
│   │       ├── hr/
│   │       │   ├── employees/
│   │       │   │   └── page.tsx          # Employees list
│   │       │   ├── attendance/
│   │       │   │   └── page.tsx          # Attendance list
│   │       │   ├── leaves/
│   │       │   │   └── page.tsx          # Leaves list
│   │       │   ├── payroll/
│   │       │   │   └── page.tsx          # Payroll list
│   │       │   └── roles/
│   │       │       └── page.tsx          # Roles list
│   │       └── settings/
│   │           └── page.tsx              # Settings with customization
│   └── layout.tsx                        # Root layout
│
├── components/
│   ├── layout/
│   │   ├── DashboardLayout.tsx           # Main layout with RTL support
│   │   ├── Sidebar.tsx                   # Navigation sidebar (RTL chevrons)
│   │   └── LanguageSwitcher.tsx          # Language switcher (RTL dropdown)
│   ├── providers/
│   │   ├── AuthProvider.tsx              # Preferences initialization
│   │   └── ThemeProvider.tsx             # next-themes provider
│   ├── forms/
│   │   ├── ProductForm.tsx               # Responsive form (grid-cols)
│   │   ├── EmployeeForm.tsx              # Responsive form
│   │   └── RoleForm.tsx                  # Responsive form
│   ├── lists/
│   │   ├── ProductList.tsx               # With responsive filters
│   │   ├── AttendanceList.tsx            # RTL search icon
│   │   ├── EmployeeList.tsx              # RTL search icon
│   │   ├── LeaveList.tsx                 # RTL search icon
│   │   ├── RoleList.tsx                  # RTL search icon
│   │   └── SalaryList.tsx                # RTL search icon
│   └── ui/
│       └── [other UI components]
│
├── i18n/
│   ├── messages/
│   │   ├── en.json                       # English translations
│   │   └── ar.json                       # Arabic translations
│   └── config.ts                         # Locale configuration
│
├── lib/
│   ├── translations.ts                   # Translation utilities
│   │   ├── createTranslator()            # Create locale-specific t() function
│   │   ├── getLocaleFromPath()           # Extract locale from URL
│   │   └── getDirectionFromLocale()      # Get RTL/LTR direction
│   └── [other utilities]
│
├── stores/
│   └── preferencesStore.ts               # Zustand store (Zustand persist)
│
└── styles/
    ├── rtl.css                           # RTL-specific CSS rules
    ├── globals.css                       # Global styles
    └── [other styles]
```

### Critical Files Summary

| File | Purpose | Key Exports |
|------|---------|-------------|
| `i18n/messages/en.json` | English translations | Translation objects |
| `i18n/messages/ar.json` | Arabic translations | Translation objects |
| `i18n/config.ts` | Locale definitions | `LOCALES`, `DEFAULT_LOCALE` |
| `lib/translations.ts` | Translation utilities | `createTranslator()`, `getLocaleFromPath()` |
| `app/[locale]/layout.tsx` | Locale layout | Sets `dir` attribute |
| `components/layout/DashboardLayout.tsx` | Main dashboard layout | Theme sync logic |
| `components/layout/Sidebar.tsx` | Navigation menu | RTL chevron classes |
| `components/providers/AuthProvider.tsx` | Preferences init | Loads saved preferences |
| `stores/preferencesStore.ts` | Global state | Zustand store with persist |
| `styles/rtl.css` | RTL CSS rules | CSS media selectors |
| `app/[locale]/dashboard/settings/page.tsx` | Settings page | Theme/language/color customization |

---

## Implementation Guide

### Adding a New Language

1. **Update locale config**
   ```typescript
   // i18n/config.ts
   export const LOCALES = ['en', 'ar', 'fr'] // Add 'fr' for French
   export const LOCALE_NAMES = {
     en: 'English',
     ar: 'عربي',
     fr: 'Français'
   }
   ```

2. **Create translation file**
   ```
   i18n/messages/fr.json
   ```
   Copy structure from `en.json` and translate all keys

3. **Update language switcher**
   - The LanguageSwitcher component automatically discovers new locales
   - No code changes needed if using `LOCALES` from config

4. **Test**
   - Navigate to `/fr/dashboard`
   - Verify all text loads in French
   - Check RTL if applicable

### Adding RTL Styles to a Component

1. **Import utilities**
   ```typescript
   import { usePathname } from 'next/navigation'
   import { getLocaleFromPath } from '@/lib/translations'
   ```

2. **Detect RTL**
   ```typescript
   const pathname = usePathname()
   const locale = getLocaleFromPath(pathname)
   const isRTL = locale === 'ar'
   ```

3. **Apply conditional classes**
   ```typescript
   <div className={isRTL ? 'ml-0 mr-4' : 'ml-4 mr-0'}>
     Content
   </div>
   ```

4. **Add CSS rules if needed**
   ```css
   /* rtl.css */
   html[dir='rtl'] .my-custom-component {
     /* RTL-specific styles */
   }
   ```

### Making a Component Responsive

1. **Mobile first**
   ```typescript
   <div className="flex-col sm:flex-row">
     {/* Mobile: stacked vertically, Tablet+: horizontal */}
   </div>
   ```

2. **Full width on mobile**
   ```typescript
   <button className="w-full sm:w-auto">
     Action
   </button>
   ```

3. **Adjust spacing**
   ```typescript
   <div className="p-2 sm:p-4 md:p-6">
     Content with responsive padding
   </div>
   ```

4. **Test responsiveness**
   - DevTools > Device toolbar (Ctrl+Shift+M)
   - Test at: 375px, 768px, 1024px widths

### Adding a New Translation Key

1. **Add to both JSON files**
   ```json
   // en.json
   {
     "myFeature": {
       "title": "My Feature"
     }
   }

   // ar.json
   {
     "myFeature": {
       "title": "ميزتي"
     }
   }
   ```

2. **Use in component**
   ```typescript
   const t = createTranslator(locale)
   return <h1>{t('myFeature.title')}</h1>
   ```

3. **Verify in both languages**
   - Visit `/en/dashboard` and verify English text
   - Visit `/ar/dashboard` and verify Arabic text

---

## Testing & Verification

### Checklist for Multi-Language Features

- [ ] **Language Switching**
  - [ ] Click language switcher, page redirects to new locale
  - [ ] All UI text changes to selected language
  - [ ] URL changes from `/en/` to `/ar/` or vice versa
  - [ ] Preference is saved and persists on page reload

- [ ] **RTL Support**
  - [ ] In Arabic, sidebar chevrons point left (rotated)
  - [ ] In Arabic, text is right-aligned
  - [ ] In Arabic, margins/padding are flipped
  - [ ] Dropdowns position correctly in RTL
  - [ ] No layout breaks in RTL mode

- [ ] **Theme & Colors**
  - [ ] Light/Dark theme toggle works
  - [ ] Color selection applies globally
  - [ ] Theme persists on page reload
  - [ ] Colors persist on page reload

- [ ] **Responsive Design**
  - [ ] **Mobile (375px)**:
    - [ ] Single column layout
    - [ ] Full-width buttons
    - [ ] Stacked form fields
    - [ ] Horizontal scroll for tables

  - [ ] **Tablet (768px)**:
    - [ ] Two-column layouts where applicable
    - [ ] Proper spacing
    - [ ] All content visible

  - [ ] **Desktop (1024px+)**:
    - [ ] Full layouts visible
    - [ ] No horizontal scrolling
    - [ ] Proper spacing and alignment

### Testing Commands

```bash
# Start development server
npm run dev

# Check for TypeScript errors
npm run type-check

# Build for production
npm run build

# Run tests (if configured)
npm run test
```

### Manual Testing Scenarios

1. **Multi-Language + RTL**
   - Open `/ar/dashboard/products`
   - Verify Arabic text, RTL layout, right-aligned sidebar
   - Switch to English, verify LTR layout

2. **Theme Persistence**
   - Go to Settings page
   - Change theme to Dark
   - Reload page (Ctrl+R)
   - Verify theme is still Dark

3. **Responsive on Mobile**
   - Open DevTools (F12)
   - Toggle Device Toolbar (Ctrl+Shift+M)
   - Select iPhone SE (375px) preset
   - Navigate through pages
   - Verify all content is readable
   - Verify no horizontal scrolling

4. **Global State Sync**
   - Open dashboard in two browser tabs
   - Change language in Tab 1
   - Switch to Tab 2 (without reload)
   - Verify Tab 2 still shows old language (expected)
   - Reload Tab 2
   - Verify Tab 2 now shows new language from localStorage

---

## Troubleshooting

### Issue: Text Still Hardcoded in Component

**Solution**:
1. Add to translation JSON files
2. Use `createTranslator()` to get `t()` function
3. Replace hardcoded text with `t('key.name')`

### Issue: RTL Styles Not Applied

**Solution**:
1. Verify `dir="rtl"` is set on `<html>` tag
2. Use `isRTL` variable to apply conditional classes
3. Add CSS rules to `rtl.css` if needed
4. Check CSS specificity and media queries

### Issue: Theme Not Persisting

**Solution**:
1. Verify preferences store is initialized in AuthProvider
2. Check localStorage (DevTools > Application > Local Storage)
3. Ensure `setSettings()` is called after API response
4. Verify `applyTheme()` is executed in store setter

### Issue: Mobile Layout Broken

**Solution**:
1. Use mobile-first approach: start with `flex-col`, add `sm:flex-row`
2. Make buttons `w-full` on mobile, `sm:w-auto` on tablet+
3. Test in DevTools device toolbar at 375px
4. Check Tailwind build includes responsive classes

### Issue: Translation Key Missing

**Solution**:
1. Add key to both `en.json` and `ar.json`
2. Ensure key structure matches (e.g., `products.title`)
3. Verify JSON syntax is valid (use linter)
4. Clear cache and rebuild if needed

---

## Best Practices

### ✅ DO

- ✅ All text comes from JSON translation files
- ✅ Use `createTranslator()` in every component with text
- ✅ Detect RTL using `isRTL = locale === 'ar'`
- ✅ Start with mobile styles, add tablet+ overrides
- ✅ Use `w-full sm:w-auto` pattern for responsive buttons
- ✅ Test in both English and Arabic
- ✅ Test on mobile, tablet, and desktop
- ✅ Store user preferences in Zustand with persist

### ❌ DON'T

- ❌ Hardcode text in components (ever)
- ❌ Use hardcoded Arabic fallbacks in `t()` function
- ❌ Assume LTR layout; always add RTL support
- ❌ Use desktop-first approach (`flex-row sm:flex-col`)
- ❌ Forget to update `ar.json` when adding new `en.json` keys
- ❌ Use inline `style` for RTL; use conditional classes instead
- ❌ Forget localStorage persistence for user preferences

---

## Summary

The POS Dashboard implements a production-ready multi-language system with:

1. **Complete URL-based locale routing** for English and Arabic
2. **Centralized JSON translations** ensuring no hardcoded text
3. **Full RTL support** with proper CSS rules and DOM attribute
4. **Responsive design** for mobile, tablet, and desktop
5. **Global state management** using Zustand with persistence
6. **Theme customization** with light/dark/system modes
7. **Color customization** with CSS variables
8. **Automatic preference persistence** via localStorage

All text, layouts, and preferences are managed consistently across the entire application, providing a seamless multi-language experience for users.

---

## Document Version & Maintenance

- **Created**: December 25, 2025
- **Last Updated**: December 25, 2025
- **Maintained By**: Development Team
- **Status**: Production Ready

For questions or updates to this documentation, refer to the code files listed above or contact the development team.