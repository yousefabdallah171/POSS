/**
 * Component Registry Types
 * Core interfaces for the v2.0.0 component registry system
 */

import React from 'react'

/**
 * Component Manifest Data
 * Metadata about a component including version, props, and performance info
 */
export interface ComponentManifestData {
  id: string
  name: string
  description: string
  category: string
  version: string
  compatibility: string[]
  deprecated: boolean
  author: string
  bilingual: boolean
  responsive: boolean
  performance: {
    weight: string
    renderTime: string
  }
  props: Record<string, string>
  mockData: Record<string, string>
  themes: {
    usedIn: number
    versions: string[]
  }
}

/**
 * Component Definition
 * Complete definition of a registered component including implementation and metadata
 */
export interface ComponentDefinition {
  id: string
  name: string
  version: string
  component: React.ComponentType<any>
  mockData: any
  props: Record<string, string>
  manifest: ComponentManifestData
  hooks?: Record<string, any>
  utils?: Record<string, any>
}

/**
 * Component Stats
 * Statistics about all registered components
 */
export interface ComponentStats {
  totalComponents: number
  categories: Record<string, number>
  totalKB: number
  deprecatedCount: number
  bilingual: number
  responsive: number
}

/**
 * Cached Component
 * Component stored in memory cache with timestamp
 */
export interface CachedComponent extends ComponentDefinition {
  timestamp: number
}

/**
 * Component Props
 * Dynamic component rendering props
 */
export interface DynamicComponentProps {
  componentId: string
  version?: string
  config: Record<string, any>
  isArabic?: boolean
  mockData?: any
  className?: string
  style?: React.CSSProperties
}

/**
 * Component Loading State
 * Represents the state of component loading
 */
export interface ComponentLoadingState {
  isLoading: boolean
  error: Error | null
  component: ComponentDefinition | null
}

/**
 * Component Version Info
 * Information about component versions
 */
export interface ComponentVersionInfo {
  componentId: string
  latestVersion: string
  allVersions: string[]
  deprecated: boolean
  latestDeprecatedAt?: Date
}

/**
 * Component Registry Interface
 * Main interface for component registry operations
 */
export interface IComponentRegistry {
  /**
   * Get a specific component by ID and optional version
   */
  getComponent(id: string, version?: string): ComponentDefinition | null

  /**
   * Get all versions of a component
   */
  getComponentVersions(id: string): string[]

  /**
   * Register a new component
   */
  registerComponent(definition: ComponentDefinition): void

  /**
   * Get all registered components
   */
  getAllComponents(): ComponentDefinition[]

  /**
   * Get statistics about registered components
   */
  getComponentStats(): ComponentStats

  /**
   * Check if a component exists
   */
  hasComponent(id: string, version?: string): boolean

  /**
   * Get component by category
   */
  getComponentsByCategory(category: string): ComponentDefinition[]

  /**
   * Get bilingual components
   */
  getBilingualComponents(): ComponentDefinition[]

  /**
   * Get responsive components
   */
  getResponsiveComponents(): ComponentDefinition[]

  /**
   * Clear the component cache
   */
  clearCache(): void

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    cacheSize: number
    cachedComponents: number
    memoryUsage: string
  }
}

/**
 * Component Resolver Options
 * Options for component resolution
 */
export interface ComponentResolverOptions {
  fallbackVersion?: string
  strict?: boolean
  cache?: boolean
}

/**
 * Component Loader Options
 * Options for component loading
 */
export interface ComponentLoaderOptions {
  lazy?: boolean
  preload?: boolean
  timeout?: number
  fallback?: React.ReactNode
}

/**
 * Asset Reference
 * Reference to a component asset
 */
export interface AssetReference {
  id: string
  type: 'icon' | 'image' | 'font'
  category: string
  version: string
  url: string
  fallback?: string
  cacheControl: string
}

/**
 * Component Error
 * Component loading error details
 */
export class ComponentError extends Error {
  constructor(
    public componentId: string,
    public version: string | undefined,
    message: string
  ) {
    super(message)
    this.name = 'ComponentError'
  }
}

/**
 * Component Not Found Error
 */
export class ComponentNotFoundError extends ComponentError {
  constructor(componentId: string, version?: string) {
    const msg = version
      ? `Component "${componentId}@${version}" not found`
      : `Component "${componentId}" not found`
    super(componentId, version, msg)
    this.name = 'ComponentNotFoundError'
  }
}

/**
 * Component Registry Singleton
 * Manages all registered components
 */
export class ComponentRegistry implements IComponentRegistry {
  private static instance: ComponentRegistry
  private components: Map<string, ComponentDefinition> = new Map()
  private componentVersions: Map<string, string[]> = new Map()
  private cache: Map<string, CachedComponent> = new Map()
  private readonly cacheTTL = 5 * 60 * 1000 // 5 minutes

  /**
   * Get or create singleton instance
   */
  static getInstance(): ComponentRegistry {
    if (!ComponentRegistry.instance) {
      ComponentRegistry.instance = new ComponentRegistry()
    }
    return ComponentRegistry.instance
  }

  /**
   * Private constructor for singleton pattern
   */
  private constructor() {}

  /**
   * Load components from registry
   */
  loadComponents(): void {
    // This will be called during app initialization
    // Components are registered dynamically as they're loaded
  }

  /**
   * Get component by ID and version
   */
  getComponent(id: string, version?: string): ComponentDefinition | null {
    const key = version ? `${id}@${version}` : id

    // Check cache first
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached
    }

    // Remove stale cache entry
    if (cached) {
      this.cache.delete(key)
    }

    // Get from registry
    const component = this.components.get(key)

    // Cache if found
    if (component) {
      this.cache.set(key, {
        ...component,
        timestamp: Date.now(),
      })
    }

    return component || null
  }

  /**
   * Get all versions of a component
   */
  getComponentVersions(id: string): string[] {
    return this.componentVersions.get(id) || []
  }

  /**
   * Register a new component
   */
  registerComponent(definition: ComponentDefinition): void {
    const key = `${definition.id}@${definition.version}`
    this.components.set(key, definition)

    if (!this.componentVersions.has(definition.id)) {
      this.componentVersions.set(definition.id, [])
    }

    const versions = this.componentVersions.get(definition.id)!
    if (!versions.includes(definition.version)) {
      versions.push(definition.version)
      versions.sort((a, b) => b.localeCompare(a)) // Sort descending
    }
  }

  /**
   * Get all registered components
   */
  getAllComponents(): ComponentDefinition[] {
    return Array.from(this.components.values())
  }

  /**
   * Get component statistics
   */
  getComponentStats(): ComponentStats {
    const components = this.getAllComponents()
    const categories: Record<string, number> = {}
    let totalKB = 0
    let deprecatedCount = 0
    let bilingualCount = 0
    let responsiveCount = 0

    components.forEach(comp => {
      // Count by category
      categories[comp.manifest.category] =
        (categories[comp.manifest.category] || 0) + 1

      // Sum sizes
      const sizeMatch = comp.manifest.performance.weight.match(/(\d+)/)
      if (sizeMatch) {
        totalKB += parseInt(sizeMatch[1], 10)
      }

      // Count special properties
      if (comp.manifest.deprecated) deprecatedCount++
      if (comp.manifest.bilingual) bilingualCount++
      if (comp.manifest.responsive) responsiveCount++
    })

    return {
      totalComponents: components.length,
      categories,
      totalKB,
      deprecatedCount,
      bilingual: bilingualCount,
      responsive: responsiveCount,
    }
  }

  /**
   * Check if component exists
   */
  hasComponent(id: string, version?: string): boolean {
    const key = version ? `${id}@${version}` : id
    return this.components.has(key)
  }

  /**
   * Get components by category
   */
  getComponentsByCategory(category: string): ComponentDefinition[] {
    return this.getAllComponents().filter(
      comp => comp.manifest.category === category
    )
  }

  /**
   * Get bilingual components
   */
  getBilingualComponents(): ComponentDefinition[] {
    return this.getAllComponents().filter(comp => comp.manifest.bilingual)
  }

  /**
   * Get responsive components
   */
  getResponsiveComponents(): ComponentDefinition[] {
    return this.getAllComponents().filter(comp => comp.manifest.responsive)
  }

  /**
   * Clear component cache
   */
  clearCache(): void {
    this.cache.clear()
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    cacheSize: number
    cachedComponents: number
    memoryUsage: string
  } {
    const cacheSize = this.cache.size
    const estimatedMemory = cacheSize * 50 // Rough estimate: 50KB per cached component
    return {
      cacheSize,
      cachedComponents: cacheSize,
      memoryUsage: `${(estimatedMemory / 1024).toFixed(2)} MB`,
    }
  }
}

// Export singleton instance
export const componentRegistry = ComponentRegistry.getInstance()
