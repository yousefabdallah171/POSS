# Theme Builder Store Documentation

**Version**: 1.0  
**Created**: 2026-01-08  
**Status**: Production Ready

## Overview

The Theme Builder Store is a centralized Zustand state management system for building and editing themes in the dashboard. It provides persistent storage, validation, and convenient hooks for all theme-related functionality.

## Architecture

### Files

1. **themeBuilderStore.ts** - Core Zustand store with state and actions
2. **themeBuilderHooks.ts** - 30+ custom React hooks for accessing store
3. **themeBuilderUtils.ts** - Utility functions for validation and color conversion
4. **index.ts** - Centralized exports for clean imports

### Key Features

- ✅ Persistent storage with localStorage
- ✅ Full TypeScript support (strict mode)
- ✅ Server-side rendering safe (no-op storage)
- ✅ 30+ custom hooks for fine-grained updates
- ✅ Validation methods for all theme parts
- ✅ Color conversion utilities (hex/RGB/HSL)
- ✅ WCAG accessibility checking
- ✅ 70+ unit tests
- ✅ Zero dependencies (except Zustand)

## Installation & Setup

### Prerequisites

```bash
npm install zustand
```

### Import in Your App

```typescript
import { useThemeBuilderStore, useThemeColors, useUpdateColors } from '@/stores'
```

## State Structure

```typescript
interface ThemeBuilderState {
  // Current theme
  currentTheme: Partial<ThemeData> | null
  
  // Form data
  colors: GlobalColors
  typography: TypographySettings
  identity: WebsiteIdentity
  header: HeaderConfig
  footer: FooterConfig
  components: ComponentConfig[]
  customCss: string
  
  // Status flags
  isLoading: boolean
  isSaving: boolean
  isDirty: boolean
  error: string | null
  successMessage: string | null
  
  // Methods... (see below)
}
```

## Usage Guide

### 1. Load a Theme

```typescript
import { useThemeBuilder } from '@/stores'

export function ThemeEditor() {
  const { loadTheme } = useThemeBuilder()
  
  useEffect(() => {
    const theme = await fetchTheme()
    loadTheme(theme) // Load theme into store
  }, [])
}
```

### 2. Update Colors

```typescript
import { useColorsWithUpdate } from '@/stores'

export function ColorPanel() {
  const { colors, updateColors } = useColorsWithUpdate()
  
  const handleColorChange = (colorKey, newColor) => {
    updateColors({ [colorKey]: newColor })
  }
  
  return (
    <div>
      {Object.entries(colors).map(([key, value]) => (
        <ColorInput
          key={key}
          value={value}
          onChange={(newColor) => handleColorChange(key, newColor)}
        />
      ))}
    </div>
  )
}
```

### 3. Update Typography

```typescript
import { useTypographyWithUpdate } from '@/stores'

export function TypographyPanel() {
  const { typography, updateTypography } = useTypographyWithUpdate()
  
  return (
    <div>
      <input
        value={typography.fontFamily}
        onChange={(e) => updateTypography({ fontFamily: e.target.value })}
      />
      <input
        type="number"
        value={typography.baseFontSize}
        onChange={(e) => updateTypography({ baseFontSize: parseInt(e.target.value) })}
      />
    </div>
  )
}
```

### 4. Validate Theme

```typescript
import { useThemeValidation } from '@/stores'

export function SaveThemeButton() {
  const { validateTheme, validateColors, validateHeader } = useThemeValidation()
  
  const handleSave = async () => {
    if (!validateTheme()) {
      alert('Please fix validation errors')
      return
    }
    
    // Save theme...
  }
}
```

### 5. Check for Errors

```typescript
import { useThemeError, useThemeStatus } from '@/stores'

export function ErrorDisplay() {
  const error = useThemeError()
  const { isLoading, isSaving } = useThemeStatus()
  
  if (isLoading) return <Spinner />
  if (error) return <Alert severity="error">{error}</Alert>
  if (isSaving) return <div>Saving...</div>
  
  return null
}
```

### 6. Get Complete Form Data

```typescript
import { useThemeFormData } from '@/stores'

export function ThemeForm() {
  const getFormData = useThemeFormData()
  
  const handleSubmit = async () => {
    const data = getFormData()
    await api.updateTheme(data)
  }
}
```

### 7. Bulk Update

```typescript
import { useBulkThemeUpdate } from '@/stores'

export function ImportTheme() {
  const bulkUpdate = useBulkThemeUpdate()
  
  const handleImport = (importedTheme) => {
    bulkUpdate({
      colors: importedTheme.colors,
      typography: importedTheme.typography,
      header: importedTheme.header,
      footer: importedTheme.footer,
    })
  }
}
```

## Hooks Reference

### Theme Management

| Hook | Purpose | Returns |
|------|---------|---------|
| `useThemeBuilder()` | Access entire store | `ThemeBuilderState` |
| `useCurrentTheme()` | Get current theme being edited | `Partial<ThemeData>` |
| `useThemeManagement()` | Load/reset theme | `{ loadTheme, resetTheme }` |
| `useBulkThemeUpdate()` | Update multiple fields at once | `(updates) => void` |

### Colors

| Hook | Purpose | Returns |
|------|---------|---------|
| `useThemeColors()` | Get all colors | `GlobalColors` |
| `useUpdateColors()` | Update colors | `(colors) => void` |
| `useColorsWithUpdate()` | Get colors + update fn | `{ colors, updateColors }` |
| `useColorValue(key)` | Get single color | `string` |

### Typography

| Hook | Purpose | Returns |
|------|---------|---------|
| `useThemeTypography()` | Get typography | `TypographySettings` |
| `useUpdateTypography()` | Update typography | `(settings) => void` |
| `useTypographyWithUpdate()` | Get + update | `{ typography, updateTypography }` |

### Header

| Hook | Purpose | Returns |
|------|---------|---------|
| `useThemeHeader()` | Get header config | `HeaderConfig` |
| `useUpdateHeader()` | Update header | `(config) => void` |
| `useHeaderWithUpdate()` | Get + update | `{ header, updateHeader }` |

### Footer

| Hook | Purpose | Returns |
|------|---------|---------|
| `useThemeFooter()` | Get footer config | `FooterConfig` |
| `useUpdateFooter()` | Update footer | `(config) => void` |
| `useFooterWithUpdate()` | Get + update | `{ footer, updateFooter }` |

### Status

| Hook | Purpose | Returns |
|------|---------|---------|
| `useThemeStatus()` | Get all status flags | `{ isLoading, isSaving, error, successMessage }` |
| `useThemeStatusActions()` | Status setters | `{ setLoading, setSaving, setError, setSuccess }` |
| `useThemeLoading()` | Is loading? | `boolean` |
| `useThemeSaving()` | Is saving? | `boolean` |
| `useThemeError()` | Get error | `string \| null` |
| `useThemeSuccess()` | Get success message | `string \| null` |

### Dirty State

| Hook | Purpose | Returns |
|------|---------|---------|
| `useIsDirty()` | Has unsaved changes? | `boolean` |
| `useDirtyActions()` | Mark dirty/clean | `{ markDirty, markClean }` |

### Validation

| Hook | Purpose | Returns |
|------|---------|---------|
| `useThemeValidation()` | All validators | `{ validateColors, validateTypography, ... }` |

## Utility Functions

### Color Validation

```typescript
import { isValidHexColor, validateColorWithMessage } from '@/stores'

isValidHexColor('#FF0000') // true
validateColorWithMessage('#FF0000') // { valid: true }
validateColorWithMessage('invalid') // { valid: false, message: '...' }
```

### Color Conversion

```typescript
import { hexToRgb, rgbToHex, hexToHsl } from '@/stores'

hexToRgb('#FF0000') // { r: 255, g: 0, b: 0 }
rgbToHex(255, 0, 0) // '#FF0000'
hexToHsl('#FF0000') // '0 100% 50%'
```

### WCAG Accessibility

```typescript
import { getContrastRatio, meetsWCAGAA, meetsWCAGAAA } from '@/stores'

const ratio = getContrastRatio('#000000', '#FFFFFF')
console.log(ratio) // ~21 (very high)

meetsWCAGAA('#000000', '#FFFFFF') // true
meetsWCAGAAA('#000000', '#FFFFFF') // true
```

### Theme Validation

```typescript
import { validateCompleteTheme, validateColorPalette } from '@/stores'

const result = validateCompleteTheme(colors, typography, header, footer)
if (!result.valid) {
  console.error('Theme errors:', result.errors)
}

const colorResult = validateColorPalette(colors)
if (!colorResult.valid) {
  console.warn('Color issues:', colorResult.issues)
}
```

### Utility Functions

```typescript
import {
  generateSlug,
  sanitizeCss,
  cloneThemeData,
  getColorChanges,
  generatePaletteFromPrimary,
} from '@/stores'

generateSlug('My Cool Theme') // 'my-cool-theme'
sanitizeCss(userCss) // Removes dangerous content
cloneThemeData(theme) // Deep copy
getColorChanges(oldColors, newColors) // What changed?
generatePaletteFromPrimary('#007bff') // Auto-generate palette
```

## Best Practices

### 1. Use Specific Hooks

❌ **Bad** - Triggers re-render on any state change
```typescript
const store = useThemeBuilder()
const colors = store.colors
```

✅ **Good** - Only re-renders on color changes
```typescript
const colors = useThemeColors()
```

### 2. Use Composable Hooks

❌ **Bad** - Multiple hook calls
```typescript
const colors = useThemeColors()
const updateColors = useUpdateColors()
```

✅ **Good** - Single hook with both
```typescript
const { colors, updateColors } = useColorsWithUpdate()
```

### 3. Validate Before Saving

```typescript
const { validateTheme } = useThemeValidation()
const { setSaving, setError } = useThemeStatusActions()

const handleSave = async () => {
  if (!validateTheme()) {
    setError('Please fix validation errors')
    return
  }
  
  setSaving(true)
  try {
    await api.saveTheme(...)
  } catch (error) {
    setError(error.message)
  } finally {
    setSaving(false)
  }
}
```

### 4. Mark Clean After Save

```typescript
const { markClean } = useDirtyActions()

const handleSave = async () => {
  await api.saveTheme(...)
  markClean() // Clear dirty state
}
```

### 5. Handle Server-Side Rendering

```typescript
// The store is safe for SSR - uses no-op storage on server
// Just import and use normally in client components
'use client'

import { useThemeColors } from '@/stores'
```

## Testing

### Unit Tests Included

- 70+ test cases
- All state transitions tested
- All validation logic tested
- All selectors tested
- Mock data included

### Run Tests

```bash
npm run test -- themeBuilderStore.test.ts
```

## Performance Considerations

### 1. Memoization

Hooks use `useMemo` to prevent unnecessary re-renders:
```typescript
const { colors, updateColors } = useColorsWithUpdate()
// Only re-renders if colors OR updateColors changes
```

### 2. Partial State Selection

Subscribe to only what you need:
```typescript
// Only updates when colors change
const colors = useThemeColors()

// Not this - updates on any state change
const { colors } = useThemeBuilder()
```

### 3. Large Data Handling

The persist middleware excludes transient state:
```typescript
// Persisted: colors, typography, header, footer, etc.
// Not persisted: isLoading, isSaving, error, successMessage
```

## Debugging

### Enable Logging

```typescript
const store = useThemeBuilderStore((state) => {
  console.log('Current theme:', state.currentTheme)
  console.log('Is dirty:', state.isDirty)
  console.log('Error:', state.error)
  return state
})
```

### Check localStorage

```typescript
// In browser console
localStorage.getItem('theme-builder-storage')
```

### Clear Persisted State

```typescript
localStorage.removeItem('theme-builder-storage')
```

## FAQ

**Q: Does this work with SSR?**  
A: Yes! It uses a no-op storage on the server to prevent errors.

**Q: Can I persist to something other than localStorage?**  
A: Yes, modify the `persist` middleware to use your custom storage.

**Q: How do I export a theme?**  
A: Use `useThemeFormData()` to get complete theme data, then stringify to JSON.

**Q: How do I import a theme?**  
A: Parse JSON, validate with `validateCompleteTheme()`, then use `loadTheme()`.

**Q: What's the maximum theme size?**  
A: localStorage has 5-10MB limit (usually). Most themes are <100KB.

## Related Documentation

- [Theme Types](../types/theme.ts) - TypeScript type definitions
- [Color Picker Component](../app/[locale]/dashboard/theme-builder/components/ColorPicker.tsx)
- [Live Preview](../app/[locale]/dashboard/theme-builder/components/LivePreview.tsx)
