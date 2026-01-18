# Task 5.4: Client-Side Component Cache

**Status**: ✅ Complete
**Effort**: 2 hours
**Target**: In-memory cache with TTL

---

## Overview

This task implements a client-side cache manager for storing computed values, API responses, and component data. The cache uses time-to-live (TTL) expiration and least-recently-used (LRU) eviction to manage memory efficiently.

---

## Implementation Summary

### 1. **Cache Manager Class** (`src/lib/cache-manager.ts`)

Core cache implementation with TTL support:

```typescript
const cache = new CacheManager({
  maxSize: 50 * 1024 * 1024,  // 50MB limit
})

// Set value with 5 minute TTL
cache.set('key', value, 5 * 60 * 1000)

// Get value (returns undefined if expired)
const value = cache.get('key')

// Get or compute
const value = await cache.getOrCompute(
  'key',
  () => expensiveComputation(),
  5 * 60 * 1000
)
```

#### Features

- ✅ Automatic TTL expiration
- ✅ LRU eviction when cache full
- ✅ Memory size tracking
- ✅ Hit/miss statistics
- ✅ Event subscriptions
- ✅ Namespace support

#### API

```typescript
// Set value
set<T>(key: string, value: T, ttl?: number): T

// Get value
get<T>(key: string): T | undefined

// Get or compute
getOrCompute<T>(
  key: string,
  compute: () => Promise<T> | T,
  ttl?: number
): Promise<T>

// Check existence
has(key: string): boolean

// Delete entry
delete(key: string): boolean

// Clear all
clear(): void

// Statistics
getStats(): CacheStats
resetStats(): void

// Cache size info
getSize(): { current: number; max: number; percentage: number }

// Subscribe to changes
subscribe(key: string, listener: (value: any) => void): () => void
```

---

### 2. **Namespaced Cache** (`src/lib/cache-manager.ts`)

Organize cache by namespace:

```typescript
// Create namespaced cache
const apiCache = new NamespacedCache('api', globalCache)

// Keys are automatically namespaced
apiCache.set('users', data)  // Actually stores: "api:users"

// Clear only this namespace
apiCache.clear()  // Doesn't affect other namespaces
```

#### Predefined Namespaces

```typescript
import { caches } from '@/lib/cache-manager'

caches.api          // For API responses
caches.components   // For component data
caches.computed     // For computed values
caches.images       // For image data
caches.user         // For user-specific data
```

---

### 3. **useCachedValue Hook** (`src/hooks/useCache.ts`)

React hook for cached values with automatic reactivity:

```typescript
const { value, isLoading, error, recompute } = useCachedValue(
  'products-list',
  async () => {
    const res = await fetch('/api/products')
    return res.json()
  },
  {
    ttl: 5 * 60 * 1000,  // 5 minutes
    cache: caches.api,
    skip: false,
  }
)

if (isLoading) return <Skeleton />
if (error) return <Error>{error.message}</Error>

return (
  <>
    {value && <ProductList items={value} />}
    <button onClick={recompute}>Refresh</button>
  </>
)
```

#### Features

- ✅ Automatic computation
- ✅ Loading and error states
- ✅ Recompute on demand
- ✅ Cache subscription
- ✅ Conditional skip option

---

### 4. **useCache Hook** (`src/hooks/useCache.ts`)

Manual cache management:

```typescript
const { set, get, has, remove, clear } = useCache(caches.api)

// Set value
set('key', value, 5 * 60 * 1000)

// Get value
const value = get('key')

// Check if exists
if (has('key')) {
  // ...
}

// Remove
remove('key')

// Clear all
clear()
```

---

### 5. **useCacheStats Hook** (`src/hooks/useCache.ts`)

Monitor cache performance:

```typescript
const stats = useCacheStats(caches.api, 5000)

// Returns
{
  totalEntries: 45,
  totalSize: 2456000,
  hitRate: 85.5,
  missRate: 14.5,
  hits: 855,
  misses: 145,
}
```

---

### 6. **useCachedAPI Hook** (`src/hooks/useCache.ts`)

Convenience hook for caching API responses:

```typescript
const { data, isLoading, error, refetch } = useCachedAPI(
  '/api/users/123',
  {
    ttl: 10 * 60 * 1000,     // 10 minutes
    skipCache: false,
    staleTime: 5 * 60 * 1000, // Stale for 5 minutes
  }
)

if (isLoading) return <Skeleton />
if (error) return <Error>{error.message}</Error>

return (
  <>
    <UserProfile user={data} />
    <button onClick={refetch}>Refresh User</button>
  </>
)
```

---

## Cache Strategies

### 1. **Computed Values Cache**

Cache expensive computations:

```typescript
const { value } = useCachedValue(
  'filtered-products',
  async () => {
    const products = await fetchProducts()
    return products.filter(filterFn).sort(sortFn)
  },
  { ttl: 5 * 60 * 1000, cache: caches.computed }
)
```

**When to use:**
- Complex calculations
- Data filtering/sorting
- Format transformations
- Heavy parsing operations

---

### 2. **API Response Cache**

Cache API responses with TTL:

```typescript
const { value } = useCachedValue(
  'dashboard-data',
  () => fetch('/api/dashboard').then(r => r.json()),
  { ttl: 1 * 60 * 1000, cache: caches.api }
)
```

**When to use:**
- GET requests (read-only)
- List/collection endpoints
- User profile data
- Configuration endpoints

**When NOT to use:**
- POST/PUT/DELETE requests
- Real-time data
- User-specific dynamic data

---

### 3. **Component Data Cache**

Cache component-specific data:

```typescript
const { value } = useCachedValue(
  `component-preview-${componentId}`,
  () => renderComponent(componentId),
  { ttl: 30 * 60 * 1000, cache: caches.components }
)
```

**When to use:**
- Component previews
- Rendered HTML
- Theme compilations
- Component metadata

---

### 4. **Hybrid: Cache + Refresh**

Cache with background refresh:

```typescript
function useRefreshingCache<T>(
  key: string,
  compute: () => Promise<T>,
  ttl: number = 5 * 60 * 1000
) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { value, isLoading, recompute } = useCachedValue(
    key,
    compute,
    { ttl }
  )

  useEffect(() => {
    const timer = setInterval(async () => {
      setIsRefreshing(true)
      await recompute()
      setIsRefreshing(false)
    }, ttl)

    return () => clearInterval(timer)
  }, [key, ttl, recompute])

  return { value, isLoading, isRefreshing }
}
```

---

## Memory Management

### TTL (Time-To-Live)

Values automatically expire after TTL:

```typescript
// Expires after 5 minutes
cache.set('key', value, 5 * 60 * 1000)

// Check if expired (returns undefined if expired)
const value = cache.get('key')  // Returns undefined after 5 min
```

### LRU (Least Recently Used) Eviction

When cache exceeds max size, least recently used entries are removed:

```typescript
// Get cache size info
const { current, max, percentage } = cache.getSize()

console.log(`Using ${percentage.toFixed(2)}% of cache`)
// Output: Using 45.23% of cache (if max is 50MB)
```

### Manual Cleanup

```typescript
// Delete specific entry
cache.delete('old-data')

// Clear entire namespace
caches.api.clear()

// Clear entire cache
const globalCache = getGlobalCache()
globalCache.clear()
```

---

## Performance Metrics

### Cache Statistics

```typescript
const stats = cache.getStats()

console.log(`Hit rate: ${stats.hitRate.toFixed(2)}%`)
console.log(`Total entries: ${stats.totalEntries}`)
console.log(`Total size: ${(stats.totalSize / 1024).toFixed(2)}KB`)

// Output:
// Hit rate: 87.50%
// Total entries: 42
// Total size: 456.78KB
```

### Expected Improvements

| Metric | Before Cache | After Cache | Improvement |
|--------|-------------|-----------|------------|
| Repeated API calls | 200ms | 0ms | 100% |
| Heavy computation | 500ms | 0ms | 100% |
| Page nav (cached) | 2000ms | 500ms | 75% |
| Memory usage | N/A | ~10-50MB | Controlled |
| Cache hit rate | 0% | 80-90% | High |

---

## Real-World Examples

### Example 1: Caching Product List

```typescript
function ProductListPage() {
  const { value: products, isLoading, recompute } = useCachedValue(
    'products-all',
    async () => {
      const res = await fetch('/api/products')
      return res.json()
    },
    { ttl: 10 * 60 * 1000, cache: caches.api }
  )

  return (
    <>
      <button onClick={recompute}>Refresh</button>
      {isLoading ? <Skeleton /> : <ProductGrid items={products} />}
    </>
  )
}
```

### Example 2: Caching Filtered Results

```typescript
function FilteredProducts({ category, sortBy }) {
  const cacheKey = `products-${category}-${sortBy}`

  const { value: products } = useCachedValue(
    cacheKey,
    async () => {
      const all = await fetch('/api/products').then(r => r.json())
      return all
        .filter(p => p.category === category)
        .sort((a, b) => {
          if (sortBy === 'price') return a.price - b.price
          return a.name.localeCompare(b.name)
        })
    },
    { ttl: 30 * 60 * 1000, cache: caches.components }
  )

  return <ProductGrid items={products} />
}
```

### Example 3: User Profile with Refresh

```typescript
function UserProfile({ userId }) {
  const { value: user, isLoading, recompute } = useCachedValue(
    `user-${userId}`,
    () => fetch(`/api/users/${userId}`).then(r => r.json()),
    { ttl: 5 * 60 * 1000, cache: caches.user }
  )

  return (
    <div>
      {isLoading ? <Skeleton /> : <Profile user={user} />}
      <button onClick={recompute} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Refresh Profile'}
      </button>
    </div>
  )
}
```

### Example 4: Complex Computation Cache

```typescript
function DashboardStats({ filters }) {
  const cacheKey = `dashboard-stats-${JSON.stringify(filters)}`

  const { value: stats } = useCachedValue(
    cacheKey,
    async () => {
      // Expensive multi-step calculation
      const transactions = await fetchTransactions()
      const filtered = applyFilters(transactions, filters)
      const aggregated = aggregateData(filtered)
      const computed = computeMetrics(aggregated)
      return computed
    },
    { ttl: 15 * 60 * 1000, cache: caches.computed }
  )

  return <StatsDisplay stats={stats} />
}
```

---

## Best Practices

### ✅ DO

- Use appropriate TTL for data freshness (5-30 min typical)
- Cache read-only operations (GET requests)
- Use namespaced caches for organization
- Monitor cache stats in development
- Clear cache on user logout
- Use stale fallback for API calls

### ❌ DON'T

- Cache POST/PUT/DELETE requests
- Use too short TTL (defeats purpose)
- Use too long TTL (stale data)
- Cache user-sensitive data permanently
- Ignore cache hit rates
- Cache without TTL

---

## Testing Cache

### In Browser Console

```javascript
// Get global cache
const cache = window.__cache__ // Exposed for debugging

// Check stats
cache.getStats()

// Get cache size
cache.getSize()

// Manually clear
cache.clear()

// Check specific key
cache.get('key')
cache.has('key')
```

### Unit Testing

```typescript
import { CacheManager } from '@/lib/cache-manager'

describe('CacheManager', () => {
  let cache: CacheManager

  beforeEach(() => {
    cache = new CacheManager({ maxSize: 10 * 1024 * 1024 })
  })

  it('should cache and retrieve values', () => {
    cache.set('key', 'value', 5000)
    expect(cache.get('key')).toBe('value')
  })

  it('should expire values after TTL', async () => {
    cache.set('key', 'value', 100)
    expect(cache.get('key')).toBe('value')

    await new Promise(r => setTimeout(r, 150))
    expect(cache.get('key')).toBeUndefined()
  })

  it('should track hit/miss stats', () => {
    cache.set('key', 'value', 5000)
    cache.get('key')  // Hit
    cache.get('key')  // Hit
    cache.get('missing')  // Miss

    const stats = cache.getStats()
    expect(stats.hits).toBe(2)
    expect(stats.misses).toBe(1)
  })
})
```

---

## Files Created

1. ✅ `src/lib/cache-manager.ts` - Core cache implementation
2. ✅ `src/hooks/useCache.ts` - React hooks for caching
3. ✅ `docs/TASK_5.4_CLIENT_CACHE.md` - This documentation

---

## Acceptance Criteria

- ✅ Cache working with TTL expiration
- ✅ LRU eviction when full
- ✅ React hooks functional
- ✅ Namespace support working
- ✅ Statistics tracking accurate
- ✅ Memory usage acceptable
- ✅ No memory leaks
- ✅ Build succeeds

---

## Next Steps

- **Task 5.5**: HTTP caching headers
- **Task 5.6**: Performance monitoring

---

## References

- [Cache API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Cache)
- [TTL in Caching](https://en.wikipedia.org/wiki/Time_to_live)
- [LRU Cache](https://en.wikipedia.org/wiki/Cache_replacement_policies#LRU)
- [React Hooks Guide](https://react.dev/reference/react)
