# 🔍 Restaurant Website Sub-Pages Debug & Fix Guide

## Problem Statement
Sub-pages (menu, checkout, cart, orders) are not loading with the proper restaurant context. Symptoms include:
- Sub-pages show loading spinner indefinitely
- Sub-pages show blank/empty content
- Products not loading on menu page
- Navigation between pages broken

## Root Cause Analysis

### Issue 1: Restaurant Slug Not Propagating to Sub-Pages
**Affected Pages**: `/menu`, `/cart`, `/checkout`, `/orders/*`

**Root Cause**:
- Homepage gets `restaurant-slug` from middleware cookie
- Sub-pages don't extract the slug before rendering
- Without slug, API calls fail silently

**Evidence**:
- Homepage (works): Extracts slug in useEffect and renders `<DynamicHomePage>`
- Menu page (broken): Doesn't use restaurant slug context

### Issue 2: API Calls Without Restaurant Slug
**File**: `/lib/hooks/use-api-queries.ts`

**Current Code**:
```typescript
export function useProducts(restaurantSlug?: string) {
  return useQuery({
    queryKey: ["products"],  // Missing restaurantSlug in key!
    queryFn: async () => {
      return await apiClient.get("/products", {  // Missing restaurantSlug!
        params: { restaurant: restaurantSlug },
      });
    },
  });
}
```

**Problem**:
- Function accepts optional `restaurantSlug`
- But menu page doesn't pass it
- API key doesn't include slug, so queries cache incorrectly
- Products endpoint becomes: `/products` instead of `/public/restaurants/{slug}/products`

### Issue 3: Missing generateStaticParams
**Files**: `/app/layout.tsx`, `/app/[locale]/layout.tsx`

**Problem**:
- Next.js doesn't know which locales to generate routes for
- Dynamic routes without staticParams may not render correctly in some environments

---

## 🔧 FIXES TO IMPLEMENT

### FIX 1: Update Menu Page to Get Restaurant Slug

**File**: `/app/[locale]/menu/page.tsx`

**Add at top of component**:
```typescript
'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function MenuPage() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const [restaurantSlug, setRestaurantSlug] = useState<string>('');
  const isRTL = locale === 'ar';
  const t = createTranslator(locale);

  // Extract restaurant slug from cookie (same as homepage)
  useEffect(() => {
    const slug = document.cookie
      .split('; ')
      .find((row) => row.startsWith('restaurant-slug='))
      ?.split('=')[1];

    if (slug) {
      setRestaurantSlug(slug);
    }
  }, []);

  // IMPORTANT: Only fetch API data once we have the slug
  const { data: categoriesResponse, isLoading: categoriesLoading } = useCategories(restaurantSlug);
  const { data: allProductsResponse, isLoading: productsLoading } = useProducts(restaurantSlug);
  const { data: searchResults, isLoading: searchLoading } = useSearchProducts(searchQuery, restaurantSlug);

  // Show loading until slug is retrieved
  if (!restaurantSlug) {
    return (
      <LayoutWrapper>
        <div className="flex items-center justify-center min-h-screen">
          <Loader className="h-12 w-12 animate-spin text-gray-400" />
        </div>
      </LayoutWrapper>
    );
  }

  const categories = categoriesResponse || [];
  const allProducts = allProductsResponse || [];
  const isLoading = categoriesLoading || productsLoading;

  // ... rest of component
}
```

### FIX 2: Fix API Query Hooks

**File**: `/lib/hooks/use-api-queries.ts`

**Update useProducts hook**:
```typescript
export function useProducts(restaurantSlug: string) {
  return useQuery({
    queryKey: ["products", restaurantSlug],  // IMPORTANT: Include slug in key
    queryFn: async () => {
      if (!restaurantSlug) return [];  // Don't fetch without slug

      const response = await apiClient.get<any>(
        `/public/restaurants/${restaurantSlug}/products?lang=en`
      );
      return response.data?.products || [];
    },
    enabled: !!restaurantSlug,  // Only enable if slug exists
    staleTime: 5 * 60 * 1000,
  });
}
```

**Update useCategories hook**:
```typescript
export function useCategories(restaurantSlug: string) {
  return useQuery({
    queryKey: ["categories", restaurantSlug],  // Include slug
    queryFn: async () => {
      if (!restaurantSlug) return [];

      const response = await apiClient.get<any>(
        `/public/restaurants/${restaurantSlug}/categories?lang=en`
      );
      return response.data?.categories || [];
    },
    enabled: !!restaurantSlug,  // Only enable if slug exists
    staleTime: 5 * 60 * 1000,
  });
}
```

**Update useSearchProducts hook**:
```typescript
export function useSearchProducts(query: string, restaurantSlug: string) {
  return useQuery({
    queryKey: ["search", restaurantSlug, query],  // Include both
    queryFn: async () => {
      if (!restaurantSlug || !query) return [];

      const response = await apiClient.get<any>(
        `/public/restaurants/${restaurantSlug}/search?q=${encodeURIComponent(query)}&lang=en`
      );
      return response.data?.products || [];
    },
    enabled: !!restaurantSlug && query.length > 0,  // Both required
    staleTime: 1 * 60 * 1000,
  });
}
```

### FIX 3: Apply Same Pattern to Other Sub-Pages

**File**: `/app/[locale]/cart/page.tsx`
```typescript
// Add same slug extraction logic
const [restaurantSlug, setRestaurantSlug] = useState<string>('');
useEffect(() => {
  const slug = document.cookie
    .split('; ')
    .find((row) => row.startsWith('restaurant-slug='))
    ?.split('=')[1];
  if (slug) setRestaurantSlug(slug);
}, []);
```

**File**: `/app/[locale]/checkout/page.tsx`
```typescript
// Same pattern...
```

**File**: `/app/[locale]/orders/page.tsx` and `/app/[locale]/orders/[id]/page.tsx`
```typescript
// Same pattern...
```

### FIX 4: Add generateStaticParams (Optional but Recommended)

**File**: `/app/layout.tsx`

**Add before export**:
```typescript
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ar' }];
}
```

**File**: `/app/[locale]/layout.tsx`

**Add before export**:
```typescript
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ar' }];
}
```

### FIX 5: Update Root Layout for Proper HTML Lang Attribute

**File**: `/app/layout.tsx`

**Current**:
```typescript
return (
  <html lang="en">  // Hardcoded!
    <body>
      ...
    </body>
  </html>
);
```

**Improved** (optional - locale layout already handles this):
Keep as-is since `[locale]/layout.tsx` sets the lang/dir on the div wrapper.

---

## 📋 IMPLEMENTATION CHECKLIST

### Step 1: Assess Current State
- [ ] Check which sub-pages are broken
- [ ] Open DevTools Console and look for API errors
- [ ] Check Network tab → see if API calls are being made
- [ ] Run: `document.cookie` in console → look for `restaurant-slug=`

### Step 2: Apply Fixes
- [ ] Update `/lib/hooks/use-api-queries.ts` (FIX 2)
- [ ] Update `/app/[locale]/menu/page.tsx` (FIX 1)
- [ ] Update `/app/[locale]/cart/page.tsx` (FIX 3)
- [ ] Update `/app/[locale]/checkout/page.tsx` (FIX 3)
- [ ] Update `/app/[locale]/orders/page.tsx` (FIX 3)
- [ ] Update `/app/[locale]/orders/[id]/page.tsx` (FIX 3)
- [ ] Update `/app/layout.tsx` (FIX 4 - optional)
- [ ] Update `/app/[locale]/layout.tsx` (FIX 4 - optional)

### Step 3: Test
- [ ] Rebuild: `npm run build` from dashboard root
- [ ] Start dev server: `npm run dev`
- [ ] Navigate to http://localhost:3000/en
- [ ] Homepage loads and shows products ✅
- [ ] Click "Menu" or navigate to /menu
- [ ] Menu page loads
- [ ] Products display (not loading spinner)
- [ ] Can add items to cart
- [ ] Navigate to /cart → shows items
- [ ] Navigate to /checkout → form displays
- [ ] Test Arabic locale (/ar/menu, /ar/cart, etc.)

### Step 4: Verify
- [ ] No console errors
- [ ] No network errors
- [ ] All pages load within 2 seconds
- [ ] Products load from API (not mock data)
- [ ] Cart persists across page navigation
- [ ] Locale switching works (if implemented)

---

## 🧪 TESTING COMMANDS

### Test in Browser Console:

```javascript
// Check if restaurant slug is set
console.log(document.cookie);  // Look for "restaurant-slug=..."

// Check if API is being called
// Open DevTools → Network tab, then navigate to /menu
// Look for requests to: /public/restaurants/YOUR_SLUG/products

// Test the API directly
fetch('http://localhost:8080/api/v1/public/restaurants/my-restaurant/products?lang=en')
  .then(r => r.json())
  .then(d => console.log('Products:', d));
```

### Test from Terminal:

```bash
# Check API is working
curl "http://localhost:8080/api/v1/public/restaurants/my-restaurant/products?lang=en" \
  -H "Accept: application/json"

# Check categories
curl "http://localhost:8080/api/v1/public/restaurants/my-restaurant/categories?lang=en" \
  -H "Accept: application/json"
```

---

## ⚠️ COMMON PITFALLS

### Pitfall 1: Hardcoded API Paths
❌ Don't do:
```typescript
const response = await apiClient.get("/products");
```

✅ Do:
```typescript
const response = await apiClient.get(`/public/restaurants/${restaurantSlug}/products`);
```

### Pitfall 2: Not Waiting for Slug
❌ Don't do:
```typescript
// Immediately call API without checking slug
const { data } = useProducts();
```

✅ Do:
```typescript
// Wait for slug first
const [slug, setSlug] = useState('');
useEffect(() => { /* get slug */ }, []);

// Only fetch if slug exists
const { data } = useProducts(slug);
```

### Pitfall 3: Not Including Slug in Query Key
❌ Don't do:
```typescript
queryKey: ["products"]  // Cache doesn't know about slug!
```

✅ Do:
```typescript
queryKey: ["products", restaurantSlug]  // Cache per slug
```

### Pitfall 4: Incorrect API Path Format
❌ Don't do:
```typescript
`/api/v1/restaurants/${slug}/products`  // Missing /public/
```

✅ Do:
```typescript
`/public/restaurants/${slug}/products`  // Has /public/
```

---

## 📊 EXPECTED BEHAVIOR AFTER FIXES

| Page | Before | After |
|------|--------|-------|
| `/en` (Home) | ✅ Works | ✅ Works |
| `/en/menu` | ❌ Spinner | ✅ Shows menu with products |
| `/en/cart` | ❌ Empty | ✅ Shows cart items |
| `/en/checkout` | ❌ Spinner | ✅ Shows checkout form |
| `/ar` (Arabic Home) | ✅ Works | ✅ Works |
| `/ar/menu` | ❌ Spinner | ✅ Arabic menu |
| All pages | ❌ No locale context | ✅ Proper locale/RTL |

---

## 🆘 IF STILL BROKEN

### Debug Step 1: Verify Cookie is Set
```javascript
// In browser console on /en or /en/menu
console.log('Cookies:', document.cookie);
console.log('Slug:',
  document.cookie
    .split('; ')
    .find(row => row.startsWith('restaurant-slug='))
    ?.split('=')[1]
);
```

Should show: `restaurant-slug=my-restaurant-slug`

### Debug Step 2: Check API Response
```javascript
// In browser console
fetch('http://localhost:8080/api/v1/public/restaurants/my-restaurant/products?lang=en')
  .then(r => r.json())
  .then(data => console.log('API Response:', data))
  .catch(err => console.error('API Error:', err));
```

Should show: `{ products: [...], categories: [...] }`

### Debug Step 3: Check React Query Cache
```javascript
// Requires DevTools browser extension
// Open: DevTools → React Query Dev Tools
// Look for queries: "products", "categories"
// Check if they have data or are in error state
```

### Debug Step 4: Check Console for Errors
- Open DevTools → Console tab
- Navigate to /menu
- Look for red error messages
- Screenshot and note exact error text

---

## ✅ SUCCESS INDICATORS

You've fixed the sub-pages when:

- ✅ All sub-pages load without spinners
- ✅ Products display on /menu
- ✅ Cart shows on /cart
- ✅ Checkout form shows on /checkout
- ✅ No red errors in console
- ✅ Network tab shows API calls to correct endpoints
- ✅ API responses have products/categories data
- ✅ Can navigate between pages without page reload
- ✅ Arabic pages work the same way
- ✅ Restaurant slug in cookies matches actual restaurant

---

**After implementing these fixes, all sub-pages should work correctly with proper restaurant context and API integration!** 🎉
