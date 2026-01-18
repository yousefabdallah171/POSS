/**
 * Cache header utilities for optimized caching strategy
 * Implements ISR (Incremental Static Regeneration) and browser caching
 */

export interface CacheConfig {
  maxAge: number; // Maximum age in seconds
  sMaxAge?: number; // Shared cache (CDN) max age in seconds
  staleWhileRevalidate?: number; // Time to serve stale content while revalidating
  staleIfError?: number; // Time to serve stale content on error
}

/**
 * Generate Cache-Control header value
 * Helps browsers and CDNs cache responses appropriately
 */
export function generateCacheControl(config: CacheConfig): string {
  const parts: string[] = [];

  // Public: can be cached by any cache (browser, CDN, proxy)
  parts.push('public');

  // max-age: browser cache lifetime (seconds)
  if (config.maxAge !== undefined) {
    parts.push(`max-age=${config.maxAge}`);
  }

  // s-maxage: CDN/shared cache lifetime (seconds)
  if (config.sMaxAge !== undefined) {
    parts.push(`s-maxage=${config.sMaxAge}`);
  }

  // stale-while-revalidate: serve stale content for this duration while fetching fresh
  if (config.staleWhileRevalidate !== undefined) {
    parts.push(`stale-while-revalidate=${config.staleWhileRevalidate}`);
  }

  // stale-if-error: serve stale content for this duration if origin is down
  if (config.staleIfError !== undefined) {
    parts.push(`stale-if-error=${config.staleIfError}`);
  }

  return parts.join(', ');
}

/**
 * Cache configurations for different response types
 * Aligned with ISR revalidation times in page.tsx
 */
export const CACHE_CONFIGS = {
  // Restaurant homepage - changes frequently (admin updates)
  // ISR: 300s, browser: 60s
  homepage: {
    maxAge: 60, // Browser caches for 1 minute
    sMaxAge: 300, // CDN caches for 5 minutes
    staleWhileRevalidate: 3600, // Serve stale for 1 hour while revalidating
    staleIfError: 86400, // Serve stale for 24 hours if origin down
  } as CacheConfig,

  // Restaurant theme - rarely changes
  // ISR: 3600s, browser: 300s
  theme: {
    maxAge: 300, // Browser caches for 5 minutes
    sMaxAge: 3600, // CDN caches for 1 hour
    staleWhileRevalidate: 86400, // Serve stale for 24 hours while revalidating
    staleIfError: 604800, // Serve stale for 7 days if origin down
  } as CacheConfig,

  // Restaurant products - medium frequency updates
  // ISR: 600s, browser: 60s
  products: {
    maxAge: 60, // Browser caches for 1 minute
    sMaxAge: 600, // CDN caches for 10 minutes
    staleWhileRevalidate: 3600, // Serve stale for 1 hour while revalidating
    staleIfError: 86400, // Serve stale for 24 hours if origin down
  } as CacheConfig,

  // Static assets (CSS, JS, fonts)
  // Can be cached very aggressively since they have content hashes
  staticAssets: {
    maxAge: 31536000, // Cache for 1 year (browser)
    sMaxAge: 31536000, // Cache for 1 year (CDN)
  } as CacheConfig,

  // Images - cache aggressively but allow revalidation
  images: {
    maxAge: 2592000, // Cache for 30 days (browser)
    sMaxAge: 2592000, // Cache for 30 days (CDN)
    staleWhileRevalidate: 604800, // Serve stale for 7 days while revalidating
  } as CacheConfig,

  // API responses with server-side caching
  // Use ISR revalidation instead of browser caching
  api: {
    maxAge: 0, // Don't cache in browser (rely on ISR)
    sMaxAge: 300, // CDN can cache for short time
    staleWhileRevalidate: 86400, // Use stale while updating
  } as CacheConfig,

  // HTML pages - use ISR for revalidation
  page: {
    maxAge: 0, // Don't cache in browser (use ISR)
    sMaxAge: 3600, // CDN can cache
  } as CacheConfig,
};

/**
 * Response headers for Next.js middleware or route handlers
 * Use this to set cache headers on API responses
 */
export function getResponseHeaders(type: keyof typeof CACHE_CONFIGS) {
  const config = CACHE_CONFIGS[type];
  return {
    'Cache-Control': generateCacheControl(config),
    'Content-Type': type === 'images' ? 'image/*' : 'application/json',
  };
}

/**
 * Compression headers for better performance
 */
export const compressionHeaders = {
  'Accept-Encoding': 'gzip, deflate, br',
  'Content-Encoding': 'gzip',
};

/**
 * Security headers
 */
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};
