/**
 * Client-Side Cache Manager
 *
 * In-memory cache with TTL (Time-To-Live) support for:
 * - Component data
 * - API responses
 * - Computed values
 * - Large object caches
 *
 * Features:
 * - Automatic expiration
 * - LRU eviction
 * - Memory limit enforcement
 * - Event listeners
 * - Serialization support
 */

export interface CacheEntry<T> {
  value: T
  timestamp: number
  ttl: number
  size: number
}

export interface CacheStats {
  totalEntries: number
  totalSize: number
  hitRate: number
  missRate: number
  hits: number
  misses: number
}

export type CacheKeyValidator = (key: string) => boolean
export type CacheSerializer = (value: any) => string
export type CacheDeserializer = (value: string) => any

/**
 * Cache Manager - In-memory cache with TTL support
 */
export class CacheManager {
  private cache: Map<string, CacheEntry<any>> = new Map()
  private timers: Map<string, NodeJS.Timeout> = new Map()
  private stats = {
    hits: 0,
    misses: 0,
  }
  private maxSize: number
  private currentSize: number = 0
  private keyValidator?: CacheKeyValidator
  private listeners: Map<string, Set<(value: any) => void>> = new Map()

  constructor(options?: {
    maxSize?: number // in bytes
    keyValidator?: CacheKeyValidator
  }) {
    this.maxSize = options?.maxSize || 50 * 1024 * 1024 // 50MB default
    this.keyValidator = options?.keyValidator
  }

  /**
   * Set cache entry with TTL
   */
  set<T>(key: string, value: T, ttl: number = 5 * 60 * 1000): T {
    this.validateKey(key)

    // Clear existing entry
    this.delete(key)

    // Calculate size (rough estimate)
    const size = JSON.stringify(value).length * 2 // UTF-16 encoding

    // Check if we need to evict entries
    if (this.currentSize + size > this.maxSize) {
      this.evictLRU(size)
    }

    const entry: CacheEntry<T> = {
      value,
      timestamp: Date.now(),
      ttl,
      size,
    }

    this.cache.set(key, entry)
    this.currentSize += size

    // Set expiration timer
    const timer = setTimeout(() => {
      this.delete(key)
    }, ttl)

    this.timers.set(key, timer)

    return value
  }

  /**
   * Get cache entry
   */
  get<T = any>(key: string): T | undefined {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined

    if (!entry) {
      this.stats.misses++
      return undefined
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.delete(key)
      this.stats.misses++
      return undefined
    }

    // Update timestamp for LRU
    entry.timestamp = Date.now()
    this.stats.hits++

    return entry.value
  }

  /**
   * Get or compute value
   */
  async getOrCompute<T>(
    key: string,
    compute: () => Promise<T> | T,
    ttl?: number
  ): Promise<T> {
    const cached = this.get<T>(key)

    if (cached !== undefined) {
      return cached
    }

    const value = await compute()
    this.set(key, value, ttl)

    return value
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.cache.get(key)

    if (!entry) {
      return false
    }

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.delete(key)
      return false
    }

    return true
  }

  /**
   * Delete cache entry
   */
  delete(key: string): boolean {
    const entry = this.cache.get(key)

    if (!entry) {
      return false
    }

    this.cache.delete(key)
    this.currentSize -= entry.size

    // Clear timer
    const timer = this.timers.get(key)
    if (timer) {
      clearTimeout(timer)
      this.timers.delete(key)
    }

    // Notify listeners
    const listeners = this.listeners.get(key)
    if (listeners) {
      listeners.forEach((listener) => listener(undefined))
      this.listeners.delete(key)
    }

    return true
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    // Clear all timers
    this.timers.forEach((timer) => clearTimeout(timer))
    this.timers.clear()

    // Clear all entries
    this.cache.clear()
    this.currentSize = 0

    // Notify all listeners
    this.listeners.forEach((listeners) => {
      listeners.forEach((listener) => listener(undefined))
    })
    this.listeners.clear()
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const total = this.stats.hits + this.stats.misses
    const hitRate = total === 0 ? 0 : (this.stats.hits / total) * 100

    return {
      totalEntries: this.cache.size,
      totalSize: this.currentSize,
      hitRate,
      missRate: 100 - hitRate,
      hits: this.stats.hits,
      misses: this.stats.misses,
    }
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.stats.hits = 0
    this.stats.misses = 0
  }

  /**
   * Get all keys
   */
  keys(): string[] {
    return Array.from(this.cache.keys())
  }

  /**
   * Get cache size info
   */
  getSize(): { current: number; max: number; percentage: number } {
    return {
      current: this.currentSize,
      max: this.maxSize,
      percentage: (this.currentSize / this.maxSize) * 100,
    }
  }

  /**
   * Subscribe to cache changes
   */
  subscribe(key: string, listener: (value: any) => void): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set())
    }

    this.listeners.get(key)!.add(listener)

    // Return unsubscribe function
    return () => {
      this.listeners.get(key)?.delete(listener)
    }
  }

  /**
   * Evict least recently used entry when cache is full
   */
  private evictLRU(requiredSize: number): void {
    let freed = 0

    // Get entries sorted by timestamp (least recent first)
    const sorted = Array.from(this.cache.entries())
      .sort(([, a], [, b]) => a.timestamp - b.timestamp)

    for (const [key, entry] of sorted) {
      if (freed >= requiredSize) break
      this.delete(key)
      freed += entry.size
    }
  }

  /**
   * Validate key format
   */
  private validateKey(key: string): void {
    if (!key || typeof key !== 'string') {
      throw new Error('Cache key must be a non-empty string')
    }

    if (this.keyValidator && !this.keyValidator(key)) {
      throw new Error(`Invalid cache key: ${key}`)
    }
  }
}

/**
 * Global cache instance
 */
let globalCache: CacheManager | null = null

export function getGlobalCache(): CacheManager {
  if (!globalCache) {
    globalCache = new CacheManager({
      maxSize: 50 * 1024 * 1024, // 50MB
    })
  }

  return globalCache
}

/**
 * Create a namespaced cache manager
 */
export class NamespacedCache {
  private cache: CacheManager
  private namespace: string

  constructor(namespace: string, cache?: CacheManager) {
    this.namespace = namespace
    this.cache = cache || getGlobalCache()
  }

  private getKey(key: string): string {
    return `${this.namespace}:${key}`
  }

  set<T>(key: string, value: T, ttl?: number): T {
    return this.cache.set(this.getKey(key), value, ttl)
  }

  get<T = any>(key: string): T | undefined {
    return this.cache.get(this.getKey(key))
  }

  async getOrCompute<T>(
    key: string,
    compute: () => Promise<T> | T,
    ttl?: number
  ): Promise<T> {
    return this.cache.getOrCompute(this.getKey(key), compute, ttl)
  }

  has(key: string): boolean {
    return this.cache.has(this.getKey(key))
  }

  delete(key: string): boolean {
    return this.cache.delete(this.getKey(key))
  }

  clear(): void {
    // Delete only entries in this namespace
    for (const key of this.cache.keys()) {
      if (key.startsWith(`${this.namespace}:`)) {
        this.cache.delete(key)
      }
    }
  }

  subscribe(key: string, listener: (value: any) => void): () => void {
    return this.cache.subscribe(this.getKey(key), listener)
  }

  getStats() {
    return this.cache.getStats()
  }
}

/**
 * Predefined cache managers for common use cases
 */
export const caches = {
  api: new NamespacedCache('api'),
  components: new NamespacedCache('components'),
  computed: new NamespacedCache('computed'),
  images: new NamespacedCache('images'),
  user: new NamespacedCache('user'),
}
