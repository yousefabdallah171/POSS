# Complete Performance Optimization Guide

## Table of Contents
1. [What We've Built](#what-weve-built)
2. [Current Optimizations](#current-optimizations)
3. [Monitoring Setup](#monitoring-setup)
4. [Developer Guidelines](#developer-guidelines)
5. [Checklist for New Features](#checklist-for-new-features)
6. [Best Practices](#best-practices)

---

## What We've Built

Your POS dashboard is fully optimized with **6 major performance features**:

### 1. ✅ Skeleton Loaders (Loading States)
**What it does**: Shows animated placeholders while data loads
**Pages with it**: Products, Employees, Categories, Attendance, Leaves, Payroll, Roles

**Files**:
- `src/components/skeletons/PageHeaderSkeleton.tsx` - Page titles
- `src/components/skeletons/TableSkeleton.tsx` - Table data
- `src/components/skeletons/CardSkeleton.tsx` - Card layouts
- `src/components/skeletons/FormSkeleton.tsx` - Form loading
- `src/components/skeletons/ListSkeleton.tsx` - List items

**Why it matters**: Users perceive loading as faster when they see something happening

### 2. ✅ API Response Caching (Smart Cache)
**What it does**: Stores API responses for 30-60 seconds to avoid repeated calls

**File**: `src/lib/apiCache.ts`

**How it works**:
```typescript
import { apiCache } from '@/lib/apiCache'

// Check cache first
let categories = apiCache.get('categories')
if (!categories) {
  // Fetch from API if not cached
  const response = await api.get('/categories')
  // Store for 60 seconds
  apiCache.set('categories', response.data, 60000)
  categories = response.data
}
```

**Benefits**:
- Faster page transitions (cached data loads instantly)
- Reduced API calls
- Better user experience
- Less server load

### 3. ✅ Request Debouncing (Smart Input Handling)
**What it does**: Delays search/filter requests until user stops typing

**File**: `src/lib/debounce.ts`

**Two ways to use**:

**Option A - Direct debounce**:
```typescript
import { debounce } from '@/lib/debounce'

const handleSearch = debounce((query) => {
  api.get('/search', { params: { q: query } })
}, 500) // Wait 500ms after user stops typing

<input onChange={(e) => handleSearch(e.target.value)} />
```

**Option B - React hook**:
```typescript
import { useDebounce } from '@/lib/debounce'

export function SearchComponent() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 500)

  useEffect(() => {
    if (debouncedQuery) {
      api.get('/search', { params: { q: debouncedQuery } })
    }
  }, [debouncedQuery])

  return <input onChange={(e) => setQuery(e.target.value)} />
}
```

**Benefits**:
- Fewer API calls (e.g., 10 keystrokes = 1 API call instead of 10)
- Better server performance
- Smoother user experience
- Reduced bandwidth usage

### 4. ✅ Virtual Scrolling (Large Lists)
**What it does**: Only renders visible items in a list (not all 1000+ items)

**File**: `src/components/virtualization/VirtualList.tsx`

**How to use**:
```typescript
import { VirtualList } from '@/components/virtualization/VirtualList'

<VirtualList
  items={employees}           // Array of 1000+ items
  itemHeight={60}             // Height of each row (pixels)
  containerHeight={600}       // Visible area height
  renderItem={(item, idx) => (
    <EmployeeRow key={item.id} employee={item} index={idx} />
  )}
  overscan={5}               // Render 5 extra items for smoothness
/>
```

**Why it matters**:
- **Without virtual scrolling**: 1000 items = 1000 DOM nodes (browser struggles)
- **With virtual scrolling**: Only ~10 visible items rendered (buttery smooth)
- Massive performance improvement on large lists

**When to use**:
- Lists with 100+ items
- Tables with many rows
- User lists, product catalogs, transaction history

### 5. ✅ Image Optimization (Next.js Image Component)
**What it does**: Automatically optimizes images (compression, lazy loading, responsive)

**File**: `src/components/products/ProductList.tsx` and `ProductForm.tsx`

**Updated usage**:
```typescript
import Image from 'next/image'

// Before (slow):
<img
  src={product.main_image_url}
  alt="Product"
  className="h-10 w-10"
/>

// After (optimized):
<Image
  src={product.main_image_url}
  alt="Product"
  width={40}
  height={40}
  className="object-cover rounded"
/>
```

**Benefits**:
- Automatic image compression (WebP format)
- Lazy loading (loads only when visible)
- Responsive images (different sizes for mobile/desktop)
- Smaller bandwidth usage
- Faster page loads

### 6. ✅ Performance Monitoring (Real-time Metrics)
**What it does**: Tracks page speed and user interactions

**Files**:
- `src/lib/monitoring.ts` - Core monitoring utilities
- `src/components/providers/WebVitalsProvider.tsx` - Web Vitals tracking
- `src/components/providers/PerformanceMonitor.tsx` - Page load tracking
- `src/app/layout.tsx` - Vercel Analytics
- `src/app/[locale]/layout.tsx` - Providers initialization

**Packages**:
- `@vercel/analytics` - Real user monitoring
- `web-vitals` - Google Core Web Vitals

---

## Current Optimizations

### Pages Optimized:
✅ Products page
✅ Employees page
✅ Categories page
✅ Attendance page
✅ Leaves page
✅ Payroll page
✅ Roles page

### What Each Page Has:
- Skeleton loaders during data fetch
- API caching for repeated visits
- Debounced search/filter inputs
- Performance monitoring

---

## Monitoring Setup

### What Gets Monitored

**Core Web Vitals** (Open DevTools → Console):
```
✅ [LCP] 1250ms - Largest Contentful Paint (page load speed)
✅ [FID] 45ms - First Input Delay (click responsiveness)
✅ [CLS] 0.05 - Cumulative Layout Shift (layout stability)
✅ [FCP] 850ms - First Contentful Paint (first paint)
✅ [TTFB] 120ms - Time to First Byte (server speed)
✅ [Page Load] /en/dashboard/products - 1234ms
```

### Performance Targets
| Metric | Good | Needs Work | Poor |
|--------|------|-----------|------|
| LCP | < 2.5s | 2.5-4s | > 4s |
| FID | < 100ms | 100-300ms | > 300ms |
| CLS | < 0.1 | 0.1-0.25 | > 0.25 |

### How to Monitor

**In Development**:
1. Open DevTools (F12)
2. Go to Console tab
3. Load any page
4. Watch for metrics

**In Production**:
1. Deploy to Vercel (if using Vercel)
2. Visit Vercel dashboard → Analytics tab
3. See real user metrics automatically

---

## Developer Guidelines

### When Creating a New Feature/Module

Follow this checklist for performance:

#### A. Loading States (Required)
```typescript
// Always import skeleton loaders
import { PageHeaderSkeleton, TableSkeleton } from '@/components/skeletons'

// Show skeletons while loading
{loading && data.length === 0 ? (
  <>
    <PageHeaderSkeleton />
    <TableSkeleton rows={8} />
  </>
) : (
  // Your actual content here
)}
```

#### B. API Caching (For data that doesn't change often)
```typescript
import { apiCache } from '@/lib/apiCache'

// In your fetch function
const fetchData = async () => {
  setLoading(true)

  // Check cache first
  let cachedData = apiCache.get('my_data_key')
  if (cachedData) {
    setData(cachedData)
    setLoading(false)
    return
  }

  try {
    const response = await api.get('/my-endpoint')
    // Cache for 60 seconds
    apiCache.set('my_data_key', response.data, 60000)
    setData(response.data)
  } finally {
    setLoading(false)
  }
}
```

#### C. Debounced Search/Filters (For user input)
```typescript
import { useDebounce } from '@/lib/debounce'

export function MySearchComponent() {
  const [searchText, setSearchText] = useState('')
  const debouncedSearchText = useDebounce(searchText, 300)

  useEffect(() => {
    if (debouncedSearchText) {
      // This only runs 300ms after user stops typing
      fetchSearchResults(debouncedSearchText)
    }
  }, [debouncedSearchText])

  return (
    <input
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
      placeholder="Search..."
    />
  )
}
```

#### D. Images (Always use Next.js Image)
```typescript
import Image from 'next/image'

// ✅ Good
<Image
  src={imageUrl}
  alt="Description"
  width={100}
  height={100}
/>

// ❌ Avoid
<img src={imageUrl} alt="Description" />
```

#### E. Large Lists (Use Virtual Scrolling)
```typescript
import { VirtualList } from '@/components/virtualization/VirtualList'

// For lists with 100+ items
<VirtualList
  items={largeArray}
  itemHeight={60}
  containerHeight={600}
  renderItem={(item, idx) => <ItemRow item={item} />}
/>
```

---

## Checklist for New Features

### Before Merging Code

- [ ] **Loading State**: Does the page show skeletons while loading?
- [ ] **Skeleton Imports**: `import { PageHeaderSkeleton, ... } from '@/components/skeletons'`
- [ ] **Conditional Rendering**: `{loading && data.length === 0 ? <Skeleton/> : <Content/>}`
- [ ] **API Caching**: Is repetitive data cached? (Use `apiCache.set()`)
- [ ] **Search Debouncing**: Do search inputs use `useDebounce()`?
- [ ] **Images**: Are all `<img>` tags replaced with `<Image>`?
- [ ] **Large Lists**: Do lists 100+ use `VirtualList`?
- [ ] **Console Messages**: Check DevTools console for any errors
- [ ] **Performance**: Is LCP < 2.5s? FID < 100ms? CLS < 0.1?

### Example: Creating New HR Module

```typescript
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { PageHeaderSkeleton, TableSkeleton } from '@/components/skeletons'
import { useDebounce } from '@/lib/debounce'
import { apiCache } from '@/lib/apiCache'
import { VirtualList } from '@/components/virtualization/VirtualList'

export default function MyNewPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)

  // Fetch with caching
  useEffect(() => {
    const fetchData = async () => {
      // Check cache first
      const cached = apiCache.get('my_data')
      if (cached) {
        setData(cached)
        return
      }

      setLoading(true)
      try {
        const response = await api.get('/my-endpoint', {
          params: { search: debouncedSearch }
        })
        apiCache.set('my_data', response.data, 60000) // Cache 60s
        setData(response.data)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [debouncedSearch])

  return (
    <div className="space-y-6">
      {/* Show skeletons while loading */}
      {loading && data.length === 0 ? (
        <>
          <PageHeaderSkeleton />
          <TableSkeleton rows={8} />
        </>
      ) : (
        <>
          {/* Search with debouncing */}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
          />

          {/* Virtual list for large data */}
          <VirtualList
            items={data}
            itemHeight={60}
            containerHeight={600}
            renderItem={(item) => (
              <div className="flex gap-4">
                {/* Images with optimization */}
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  width={40}
                  height={40}
                />
                <div>{item.name}</div>
              </div>
            )}
          />
        </>
      )}
    </div>
  )
}
```

---

## Best Practices

### 1. **Always Show Loading States**
- Never show blank screens while loading
- Use skeleton loaders that match content shape
- Users perceive 3-second skeleton as faster than 3-second blank screen

### 2. **Cache Wisely**
- Cache data that doesn't change often (30-60 seconds)
- Don't cache user-specific data
- Always check cache before API call
- Invalidate cache on create/update/delete operations

### 3. **Debounce User Input**
- Search inputs: 300-500ms debounce
- Filter inputs: 300-500ms debounce
- Form inputs: No debounce needed
- Don't debounce click handlers

### 4. **Use Virtual Scrolling for Large Lists**
- 100+ items → Use VirtualList
- Table with many rows → Use VirtualList
- Dropdown with 50+ options → Use VirtualList
- Normal lists < 30 items → No need

### 5. **Optimize Images**
```typescript
// ✅ Always use Next.js Image
<Image
  src={url}
  alt="description"
  width={100}
  height={100}
  priority={isAboveTheFold}  // For first image
  placeholder="blur"         // Optional: blur while loading
/>

// ❌ Never use plain <img>
<img src={url} alt="description" />
```

### 6. **Monitor Performance**
- Check console for Web Vitals metrics
- LCP should be < 2.5s
- Page load should be < 3s
- No layout shifts while loading

### 7. **API Response Structure**
```typescript
// Good response
const response = await api.get('/data')
setData(response.data)
setLoading(false)
// Cache it for next time
apiCache.set('data_key', response.data, 60000)

// Bad - Missing cache
const response = await api.get('/data')
setData(response.data)
// Will fetch again next time!
```

### 8. **Avoid Performance Killers**
❌ **Don't**: Large inline functions in JSX
```typescript
// Bad - Function created on every render
{items.map((item) => <div onClick={() => { /* large code */ }}>
```

✅ **Do**: Extract to useCallback
```typescript
const handleClick = useCallback((id) => {
  // Code here
}, [])
{items.map((item) => <div onClick={() => handleClick(item.id)}>
```

---

## Performance Checklist for Every New Feature

### Code Quality
- [ ] No unused imports
- [ ] No console.logs left behind
- [ ] Proper error handling
- [ ] Loading states for all async operations

### Performance
- [ ] Skeleton loaders showing during load
- [ ] API responses cached (if appropriate)
- [ ] Search/filters debounced
- [ ] Large lists using VirtualList
- [ ] All images using `<Image>` component
- [ ] No unoptimized images

### User Experience
- [ ] No blank screens
- [ ] Smooth transitions between pages
- [ ] Quick search/filter response
- [ ] No layout shifts (CLS < 0.1)
- [ ] Page loads in < 2.5s (LCP)
- [ ] Clicks respond in < 100ms (FID)

### Monitoring
- [ ] Check DevTools Console for metrics
- [ ] Verify no ❌ red metrics
- [ ] Web Vitals all show ✅ green if possible

---

## Current Optimization Summary

### What's Already Done
✅ 6 skeleton components created
✅ API caching utility (30-60s TTL)
✅ Debounce utility (300-500ms)
✅ Virtual scrolling component (1000+ items)
✅ Image optimization (Next.js Image)
✅ Performance monitoring (Web Vitals)
✅ All major pages optimized

### What Developers Must Do on New Features
1. **Add skeleton loaders** (copy from existing pages)
2. **Cache API responses** (using `apiCache.set()`)
3. **Debounce search/filters** (using `useDebounce()`)
4. **Use VirtualList** for lists 100+
5. **Replace `<img>` with `<Image>`**
6. **Check console metrics** (LCP < 2.5s, FID < 100ms)

---

## Resources

### Files to Reference
- Skeleton components: `src/components/skeletons/`
- Caching: `src/lib/apiCache.ts`
- Debouncing: `src/lib/debounce.ts`
- Virtual scrolling: `src/components/virtualization/VirtualList.tsx`
- Monitoring: `src/lib/monitoring.ts`

### Optimized Pages (Study These)
- `src/app/[locale]/dashboard/products/page.tsx`
- `src/app/[locale]/dashboard/hr/employees/page.tsx`
- `src/app/[locale]/dashboard/categories/page.tsx`

### Import Statements (Copy-Paste Ready)
```typescript
// Skeletons
import { PageHeaderSkeleton, TableSkeleton } from '@/components/skeletons'

// Utilities
import { apiCache } from '@/lib/apiCache'
import { useDebounce, debounce } from '@/lib/debounce'
import { VirtualList } from '@/components/virtualization/VirtualList'
import Image from 'next/image'
```

---

## Questions?

Refer to optimized pages as examples. Follow the patterns shown in products, employees, and categories pages for consistent performance.

Good luck! 🚀
