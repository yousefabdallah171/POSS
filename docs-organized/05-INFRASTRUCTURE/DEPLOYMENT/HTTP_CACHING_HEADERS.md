# Task 5.5: Configure HTTP Caching Headers

**Status**: ✅ Complete
**Effort**: 2 hours
**Target**: Optimized backend cache control headers

---

## Overview

This task configures HTTP caching headers on the backend to work in harmony with frontend caching strategies. The backend sets appropriate `Cache-Control` headers for different types of content, enabling browsers and CDNs to cache efficiently.

---

## Implementation Summary

### 1. **Cache Middleware** (`backend/internal/middleware/cache.go`)

Core middleware that sets cache headers based on content type:

```go
// Apply middleware in your router setup
router := middleware.CacheMiddleware(router)
```

#### Caching Strategies

| Content Type | Max-Age | Policy | Use Case |
|-------------|---------|--------|----------|
| Static Assets | 1 year | `public, max-age=31536000, immutable` | JS, CSS, images |
| HTML Pages | 1 hour | `public, max-age=3600, must-revalidate` | Home, routes |
| API Responses | 0 | `private, no-cache, no-store, must-revalidate` | Dynamic data |
| Manifests | 1 hour | `public, max-age=3600, must-revalidate` | Metadata |

#### Strategy Auto-Detection

The middleware automatically determines the strategy based on URL path:

```go
// Static assets (1 year cache)
/_next/static/           → "static"
/static/                 → "static"

// JavaScript (1 year cache)
/*.js, /*.mjs            → "javascript"

// CSS (1 year cache)
/*.css                   → "css"

// Fonts (1 year cache)
/*.woff2, /*.ttf         → "fonts"

// Images (1 year cache)
/*.png, /*.jpg, /*.webp  → "images"

// HTML (1 hour cache)
/*.html, /               → "html"

// API (no cache)
/api/*                   → "api"

// Manifests (1 hour cache)
/*.json (if manifest)    → "manifest"
```

---

### 2. **Cache Integration** (`backend/internal/middleware/cache_integration.go`)

Helper functions and middleware stack:

#### Middleware Stack

```go
// Apply complete caching stack
router = middleware.CachingMiddlewareStack(router)

// Applies in order:
// 1. Cache headers (Cache-Control)
// 2. Conditional requests (ETag, If-None-Match)
// 3. Security headers (X-Content-Type-Options, CSP)
// 4. Performance headers (Server-Timing, Link prefetch)
// 5. Compression support (gzip, brotli)
```

#### API-Specific Caching

```go
// Override cache for specific API endpoints
config := middleware.APICacheConfig("/api/v1/products")
// Returns: public, max-age=300 (5 minutes)

config := middleware.APICacheConfig("/api/v1/users/me")
// Returns: private, no-cache, no-store (no cache)
```

#### Pre-built Patterns

```go
CommonCachePatterns = {
  "immutable":      "public, max-age=31536000, immutable",
  "longterm":       "public, max-age=31536000, must-revalidate",
  "mediumterm":     "public, max-age=604800, must-revalidate",      // 1 week
  "shortterm":      "public, max-age=3600, must-revalidate",       // 1 hour
  "veryshort":      "public, max-age=300, must-revalidate",        // 5 min
  "nocache":        "private, no-cache, no-store, must-revalidate",
  "stalerevalidate": "public, max-age=300, stale-while-revalidate=86400",
}
```

---

## Integration Guide

### Step 1: Add Middleware to Main Router

```go
// main.go
package main

import (
  "net/http"
  "myapp/internal/middleware"
  "myapp/internal/handler"
)

func main() {
  // Create router
  router := http.NewServeMux()

  // Register routes
  router.HandleFunc("/api/v1/products", handler.GetProducts)
  router.HandleFunc("/static/", handler.ServeStatic)
  // ... more routes

  // Apply caching middleware stack
  handler := middleware.CachingMiddlewareStack(router)

  // Start server
  http.ListenAndServe(":8080", handler)
}
```

### Step 2: Custom Cache for Specific Routes

```go
// Create custom middleware for specific endpoints
func ProductCacheMiddleware(next http.Handler) http.Handler {
  return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    // 5-minute cache for product list
    w.Header().Set("Cache-Control", "public, max-age=300, must-revalidate")
    w.Header().Set("ETag", generateETag(r.URL.Path))
    next.ServeHTTP(w, r)
  })
}

// Apply to specific route
productHandler := ProductCacheMiddleware(handler.GetProducts)
router.HandleFunc("/api/v1/products", productHandler)
```

### Step 3: CDN Integration

Configure your CDN to respect cache headers:

```
CloudFront / Cloudflare / Akamai:
- Respect Cache-Control headers: ✅ Enabled
- Cache-Control: max-age setting: ✅ Enabled
- Query string forwarding: ✅ All
- Cookie-based caching: ✅ Enabled
```

---

## Cache-Control Header Explained

### Directive Reference

```
Cache-Control: public, max-age=3600, must-revalidate
               ^      ^               ^
               |      |               |
    Visibility |      Expiration      Revalidation
```

#### Visibility

- **`public`**: Resource can be cached by any cache (browser, CDN, proxy)
- **`private`**: Only browser can cache, not public caches

#### Expiration

- **`max-age=3600`**: Cache for 3600 seconds (1 hour)
- **`s-maxage=7200`**: CDN caches for 7200 seconds (overrides max-age for CDN)

#### Revalidation

- **`must-revalidate`**: After expiration, must validate with origin before using
- **`no-cache`**: Can cache but must validate before using
- **`no-store`**: Cannot cache at all
- **`immutable`**: Never changes, no revalidation needed

#### Advanced

- **`stale-while-revalidate=86400`**: Can use stale for 86400s while revalidating in background
- **`stale-if-error=604800`**: Use stale if origin is down for 604800s

---

## Common Patterns

### Pattern 1: Static Assets (JS, CSS)

```go
// Immutable versioned assets
w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
w.Header().Set("Expires", "Thu, 31 Dec 2099 23:59:59 GMT")

// When fingerprint/version changes, URL changes
// /static/app.abc123.js   (new version)
// /static/app.xyz789.js   (old version, not requested)
```

### Pattern 2: HTML Pages

```go
// Revalidate frequently
w.Header().Set("Cache-Control", "public, max-age=3600, must-revalidate")
w.Header().Set("ETag", `"version123"`)
w.Header().Set("Last-Modified", "Mon, 01 Jan 2024 00:00:00 GMT")
```

### Pattern 3: API Responses

```go
// Don't cache at HTTP level (service worker handles it)
w.Header().Set("Cache-Control", "private, no-cache, no-store, must-revalidate")
w.Header().Set("Pragma", "no-cache")
w.Header().Set("Expires", "-1")
```

### Pattern 4: Images (with long cache)

```go
// Long cache for images
w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")

// For better compression
w.Header().Set("Content-Type", "image/webp")
w.Header().Set("Vary", "Accept")
```

### Pattern 5: API with Caching

```go
// List endpoints (can be cached)
w.Header().Set("Cache-Control", "public, max-age=300, must-revalidate")

// User-specific endpoints (no cache)
w.Header().Set("Cache-Control", "private, no-cache, no-store, must-revalidate")

// With ETag for conditional requests
w.Header().Set("ETag", `"v1-${contentHash}"`)
```

---

## Conditional Requests (Advanced)

### ETag Support

Server sends ETag:
```
GET /api/products
Response:
  ETag: "v1-abc123"
  Cache-Control: max-age=300
```

Client checks with If-None-Match:
```
GET /api/products
If-None-Match: "v1-abc123"

Response:
  304 Not Modified (no body sent)
```

**Bandwidth saved**: ~2KB per request

### Last-Modified Support

Server sends Last-Modified:
```
GET /products
Response:
  Last-Modified: Mon, 01 Jan 2024 12:00:00 GMT
  Cache-Control: max-age=3600
```

Client checks with If-Modified-Since:
```
GET /products
If-Modified-Since: Mon, 01 Jan 2024 12:00:00 GMT

Response:
  304 Not Modified
```

---

## Monitoring & Testing

### Browser DevTools

1. **Network tab** → Click request
2. **Response Headers** section
3. Look for `Cache-Control` header

Example:
```
Cache-Control: public, max-age=3600, must-revalidate
ETag: "v1-xyz"
Last-Modified: Mon, 01 Jan 2024 00:00:00 GMT
```

### curl Testing

```bash
# Check response headers
curl -I https://api.example.com/products

# Check with conditional request
curl -i -H 'If-None-Match: "v1-abc123"' https://api.example.com/products
# Returns 304 if not modified

# Check cache behavior
curl -D - https://api.example.com/products 2>&1 | grep -i cache-control
```

### WebPageTest

1. Go to https://www.webpagetest.org/
2. Enter your URL
3. Check "Compress Transfer" and "Cache Analysis"
4. Review cache headers in report

---

## Cache Headers Checklist

### Static Assets

- [ ] `Cache-Control: public, max-age=31536000, immutable`
- [ ] `Expires: Thu, 31 Dec 2099 23:59:59 GMT`
- [ ] `Vary: Accept-Encoding`
- [ ] Content is versioned/fingerprinted

### HTML Pages

- [ ] `Cache-Control: public, max-age=3600, must-revalidate`
- [ ] `ETag: "version123"`
- [ ] `Last-Modified: <date>`
- [ ] `Vary: Accept-Encoding`

### API Responses

- [ ] `Cache-Control: private, no-cache, no-store, must-revalidate`
- [ ] `Pragma: no-cache`
- [ ] `Expires: -1`
- [ ] `ETag` (for 304 responses)

### Images

- [ ] `Cache-Control: public, max-age=31536000, immutable`
- [ ] `Content-Type: image/webp` (or appropriate format)
- [ ] `Vary: Accept` (for format negotiation)

### Fonts

- [ ] `Cache-Control: public, max-age=31536000, immutable`
- [ ] `Content-Type: font/woff2` (or appropriate)
- [ ] `Access-Control-Allow-Origin: *` (CORS)

---

## Performance Impact

### With Proper Cache Headers

**First Load**:
```
Browser downloads:
  - HTML: 50KB
  - JS: 200KB (not cached)
  - CSS: 30KB (not cached)
  - Images: 500KB (not cached)
  - Fonts: 50KB (not cached)
  Total: 830KB, ~3-4 seconds
```

**Second Load** (1 hour later):
```
Browser downloads:
  - HTML: 50KB (revalidated with 304)
  - JS: 0KB (cached)
  - CSS: 0KB (cached)
  - Images: 0KB (cached)
  - Fonts: 0KB (cached)
  Total: 0KB (only validation), ~200ms
```

**Improvement**: 99% reduction in data transfer, 95% faster page load

### With CDN + Cache Headers

**From CDN Edge** (first edge hit):
```
Latency: 0-50ms (vs 200-500ms from origin)
Bandwidth: Saved (CDN doesn't request origin)
Cost: 80%+ reduction in origin bandwidth
```

---

## Troubleshooting

### Issue: Assets Not Caching

**Check**:
1. Is `Cache-Control` header set?
   ```bash
   curl -I https://example.com/app.js | grep Cache-Control
   ```
2. Is `max-age` > 0?
3. Is path matching middleware pattern?

**Fix**:
```go
// Add to middleware or handler
w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
```

### Issue: Stale Content Served

**Check**:
1. Are you using versioned filenames?
   ```
   Good:  /app.abc123.js
   Bad:   /app.js
   ```
2. Is `max-age` too long?
3. Have you deployed new version?

**Fix**:
```go
// Shorter cache for non-versioned files
w.Header().Set("Cache-Control", "public, max-age=3600, must-revalidate")
```

### Issue: API Responses Being Cached

**Check**:
```bash
curl -I https://example.com/api/v1/products | grep Cache-Control
```

**Should be**:
```
Cache-Control: private, no-cache, no-store, must-revalidate
```

**Fix**:
```go
// Ensure API routes aren't cached
if strings.HasPrefix(r.URL.Path, "/api/") {
  w.Header().Set("Cache-Control", "private, no-cache, no-store, must-revalidate")
}
```

---

## Files Created

1. ✅ `backend/internal/middleware/cache.go` - Cache middleware
2. ✅ `backend/internal/middleware/cache_integration.go` - Integration helpers
3. ✅ `backend/docs/TASK_5.5_HTTP_CACHING_HEADERS.md` - This documentation

---

## Acceptance Criteria

- ✅ Cache middleware implemented
- ✅ Auto-detection of content type working
- ✅ Static assets: 1-year cache headers
- ✅ HTML pages: 1-hour cache headers
- ✅ API responses: no-cache headers
- ✅ ETag support enabled
- ✅ Security headers included
- ✅ Build succeeds

---

## Next Steps

- **Task 5.6**: Performance monitoring with Web Vitals
- **Task 5.7**: Load testing
- **Task 5.8**: Benchmarking

---

## References

- [MDN: Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)
- [RFC 7234: HTTP Caching](https://tools.ietf.org/html/rfc7234)
- [Google: HTTP Caching](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching)
- [Web Fundamentals: Cache Headers](https://web.dev/http-cache/)
