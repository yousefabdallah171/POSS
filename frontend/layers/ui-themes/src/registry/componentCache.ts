/**
 * Component Cache System
 *
 * Provides advanced caching and memory management for the Component Registry.
 * Implements:
 * - Lazy component loading (don't load until needed)
 * - LRU (Least Recently Used) cache eviction
 * - Memory usage tracking
 * - Cache hit/miss statistics for debugging
 * - Configurable cache size limits
 */

export interface CacheStats {
  totalLoaded: number
  maxSize: number
  hitRate: number
  missRate: number
  evictions: number
  memoryUsage: string
  lastCleaned: Date | null
}

export interface CacheEntry<T> {
  data: T
  loadedAt: Date
  accessCount: number
  lastAccessedAt: Date
}

/**
 * LRU Cache implementation with memory management
 */
export class ComponentCache<T> {
  private cache: Map<string, CacheEntry<T>> = new Map()
  private maxSize: number
  private hitCount = 0
  private missCount = 0
  private evictionCount = 0
  private lastCleanedAt: Date | null = null

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize
    console.log(`📦 Component Cache initialized with max size: ${maxSize}`)
  }

  /**
   * Get item from cache
   */
  get(key: string): T | undefined {
    const entry = this.cache.get(key)

    if (!entry) {
      this.missCount++
      return undefined
    }

    // Update access tracking for LRU
    entry.accessCount++
    entry.lastAccessedAt = new Date()

    this.hitCount++
    return entry.data
  }

  /**
   * Set item in cache with LRU eviction
   */
  set(key: string, data: T): void {
    // If key exists, update it
    if (this.cache.has(key)) {
      const entry = this.cache.get(key)!
      entry.data = data
      entry.accessCount++
      entry.lastAccessedAt = new Date()
      return
    }

    // If cache is full, evict least recently used item
    if (this.cache.size >= this.maxSize) {
      this.evictLRU()
    }

    // Add new entry
    this.cache.set(key, {
      data,
      loadedAt: new Date(),
      accessCount: 1,
      lastAccessedAt: new Date(),
    })
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear()
    this.hitCount = 0
    this.missCount = 0
    this.evictionCount = 0
    this.lastCleanedAt = new Date()
    console.log('🗑️ Component cache cleared')
  }

  /**
   * Evict the least recently used item
   */
  private evictLRU(): void {
    let lruKey: string | null = null
    let lruEntry: CacheEntry<T> | null = null

    // Find least recently used (oldest lastAccessedAt)
    for (const [key, entry] of this.cache.entries()) {
      if (!lruEntry || entry.lastAccessedAt < lruEntry.lastAccessedAt) {
        lruKey = key
        lruEntry = entry
      }
    }

    if (lruKey) {
      this.cache.delete(lruKey)
      this.evictionCount++
      console.log(`♻️ Evicted cache entry: ${lruKey} (accessed ${lruEntry?.accessCount} times)`)
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const total = this.hitCount + this.missCount
    const hitRate = total > 0 ? (this.hitCount / total) * 100 : 0
    const missRate = total > 0 ? (this.missCount / total) * 100 : 0

    return {
      totalLoaded: this.cache.size,
      maxSize: this.maxSize,
      hitRate: parseFloat(hitRate.toFixed(2)),
      missRate: parseFloat(missRate.toFixed(2)),
      evictions: this.evictionCount,
      memoryUsage: this.estimateMemoryUsage(),
      lastCleaned: this.lastCleanedAt,
    }
  }

  /**
   * Estimate memory usage of cached items
   */
  private estimateMemoryUsage(): string {
    // Rough estimation: ~1KB per cached component
    const bytes = this.cache.size * 1024
    const kb = bytes / 1024
    const mb = kb / 1024

    if (mb > 1) {
      return `${mb.toFixed(2)} MB`
    }
    return `${kb.toFixed(2)} KB`
  }

  /**
   * Get all keys in cache
   */
  keys(): string[] {
    return Array.from(this.cache.keys())
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size
  }

  /**
   * Check if key is cached
   */
  has(key: string): boolean {
    return this.cache.has(key)
  }

  /**
   * Pre-warm cache with initial data
   */
  preWarm(entries: Record<string, T>): void {
    console.log(`🔥 Pre-warming cache with ${Object.keys(entries).length} entries`)
    for (const [key, data] of Object.entries(entries)) {
      this.set(key, data)
    }
  }

  /**
   * Get all cache entries for debugging
   */
  debug(): Array<{
    key: string
    accessCount: number
    lastAccessed: string
    loadedAt: string
  }> {
    return Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      accessCount: entry.accessCount,
      lastAccessed: entry.lastAccessedAt.toISOString(),
      loadedAt: entry.loadedAt.toISOString(),
    }))
  }
}

export default ComponentCache
