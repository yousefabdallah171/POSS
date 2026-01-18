# Phase 1 Testing Guide - Server-Side Rendering Implementation

## Quick Verification Checklist

### 1. Middleware is Working
- [ ] Subdomain routing works (`demo.localhost` → correct restaurant)
- [ ] Locale extraction works (`/en/` and `/ar/`)
- [ ] Restaurant slug available in page component via `headers()`

### 2. Server Component Data Fetching
- [ ] Page loads with data already in HTML (check page source)
- [ ] No client-side loading spinner
- [ ] All 3 API calls complete in parallel
- [ ] Data renders on first paint

### 3. Error Handling
- [ ] Invalid restaurant slug shows error page
- [ ] API errors handled gracefully
- [ ] 404 responses return proper error message

### 4. SEO Verification
- [ ] Open Graph tags in HTML source
  - [ ] `og:title` with restaurant name
  - [ ] `og:description` present
  - [ ] `og:image` with logo URL
- [ ] Meta description present
- [ ] Page title contains restaurant name
- [ ] Twitter Card tags present

### 5. Performance Metrics
- [ ] Page load time < 500ms (target)
- [ ] Time to First Paint (FCP) < 1s
- [ ] Largest Contentful Paint (LCP) < 2.5s
- [ ] Data in initial HTML

### 6. Browser Compatibility
- [ ] Works in Chrome/Edge
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works without JavaScript enabled

### 7. Multi-Tenant Security
- [ ] Restaurant 1 data only accessible via restaurant 1 subdomain
- [ ] Cannot spoof tenant via cookie manipulation
- [ ] Cannot access other restaurant's data
- [ ] Tenant ID from server headers (immutable)

---

## Test Procedures

### Test 1: Verify Middleware Extraction

**Check subdomain extraction:**
```bash
# Using curl to test with Host header
curl -H "Host: demo.localhost:3000" http://localhost:3000/en/

# Should load "demo" restaurant data
```

**Check locale extraction:**
```bash
# Test /en/ route
curl http://demo.localhost:3000/en/
# Should extract locale: 'en'

# Test /ar/ route
curl http://demo.localhost:3000/ar/
# Should extract locale: 'ar'
```

### Test 2: Verify Server Rendering

**Check HTML contains data:**
1. Open page in browser
2. Right-click → View Page Source
3. Search for restaurant name, products, theme colors
4. Should find full content (not just empty div)

**Check Network tab:**
1. Open Chrome DevTools (F12)
2. Go to Network tab
3. Reload page
4. Initial request should return complete HTML
5. 3 API calls should happen in parallel (similar start times)
6. No waterfall pattern

**Test without JavaScript:**
1. Chrome DevTools → Settings → Disable JavaScript
2. Reload page
3. Content should still render
4. Re-enable JavaScript after test

### Test 3: Verify Parallel API Calls

**Check timing:**
1. DevTools → Network tab
2. Filter by Fetch/XHR
3. Should see 3 API calls:
   - /public/restaurants/{slug}/homepage
   - /public/restaurants/{slug}/theme
   - /public/restaurants/{slug}/products
4. All should START at same time (not sequential)

### Test 4: Test SEO Metadata

**Check meta tags in HTML:**
1. View Page Source
2. Look in <head> for:
   - `<title>Restaurant Name - Order Food Online</title>`
   - `<meta name="description">`
   - `<meta property="og:title">`
   - `<meta property="og:description">`
   - `<meta property="og:image">`
   - `<meta name="twitter:card">`

**Test social preview:**
1. Go to https://www.opengraph.xyz/
2. Enter page URL
3. Verify title, description, image are correct

### Test 5: Performance

**Lighthouse audit:**
1. DevTools → Lighthouse
2. Generate report
3. Target: Performance > 70, SEO > 90

**3G simulation:**
1. DevTools → Network → Throttle to "Slow 3G"
2. Reload page
3. Should still load quickly (< 1s)

### Test 6: Security

**Tenant isolation:**
```bash
# Different subdomains should show different data
curl -H "Host: demo.localhost:3000" http://localhost:3000/en/
# vs
curl -H "Host: demo2.localhost:3000" http://localhost:3000/en/

# Data should be different
```

**Cookie cannot spoof tenant:**
1. Open browser console
2. Run: `document.cookie = "restaurant-slug=attacker; path=/;"`
3. Reload page
4. Still shows correct restaurant (from Host header, not cookie)

### Test 7: Multi-Locale

**English:**
```bash
curl http://demo.localhost:3000/en/
# Should render in English, LTR direction
```

**Arabic:**
```bash
curl http://demo.localhost:3000/ar/
# Should render in Arabic, RTL direction
```

---

## Performance Comparison

### Before SSR
- Page Load: ~1800ms
- FCP: 1800ms
- LCP: 2200ms
- Lighthouse Performance: ~50
- Data in HTML: ❌

### After SSR (Target)
- Page Load: ~400-500ms (3.5x faster)
- FCP: 400-500ms
- LCP: 500-700ms
- Lighthouse Performance: >80
- Data in HTML: ✅

---

## Success Criteria

- [x] Steps 1-5 complete (implementation)
- [ ] Middleware extracts tenant and locale
- [ ] Server fetches all data in parallel
- [ ] HTML contains full data
- [ ] Metadata tags present
- [ ] Page loads < 500ms
- [ ] Lighthouse Performance > 80
- [ ] Works without JavaScript
- [ ] Multi-tenant security verified
- [ ] All tests pass

---

## What's Next

Phase 2 will focus on:
- Advanced caching strategy
- Image optimization
- Core Web Vitals improvements
- SEO enhancements

See `IMPLEMENTATION_PLAN.md` for details.
