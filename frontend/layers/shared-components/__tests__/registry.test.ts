/**
 * Unit Tests for ComponentRegistry
 *
 * Tests the core registry functionality for:
 * - Component registration
 * - Component retrieval
 * - Statistics and filtering
 * - Caching behavior
 */

import { ComponentRegistry } from '../registry/types'

describe('ComponentRegistry', () => {
  let registry: ComponentRegistry

  beforeEach(() => {
    // Reset singleton for each test
    registry = ComponentRegistry.getInstance()
    registry.clearCache()
  })

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = ComponentRegistry.getInstance()
      const instance2 = ComponentRegistry.getInstance()
      expect(instance1).toBe(instance2)
    })
  })

  describe('Component Registration', () => {
    it('should register a component', () => {
      const mockComponent = {
        id: 'test-component',
        name: 'Test Component',
        version: '1.0.0',
        component: () => null,
        mockData: {},
        props: {},
        manifest: {},
      }

      registry.registerComponent(mockComponent)
      const retrieved = registry.getComponent('test-component', '1.0.0')

      expect(retrieved).toBeDefined()
      expect(retrieved?.id).toBe('test-component')
    })

    it('should register multiple components', () => {
      const components = [
        {
          id: 'hero',
          name: 'Hero',
          version: '1.0.0',
          component: () => null,
          mockData: {},
          props: {},
          manifest: {},
        },
        {
          id: 'products',
          name: 'Products',
          version: '1.0.0',
          component: () => null,
          mockData: {},
          props: {},
          manifest: {},
        },
      ]

      components.forEach(comp => registry.registerComponent(comp))

      expect(registry.hasComponent('hero', '1.0.0')).toBe(true)
      expect(registry.hasComponent('products', '1.0.0')).toBe(true)
    })
  })

  describe('Component Retrieval', () => {
    beforeEach(() => {
      const component = {
        id: 'test',
        name: 'Test',
        version: '1.0.0',
        component: () => null,
        mockData: { test: true },
        props: { prop1: 'string' },
        manifest: { id: 'test' },
      }
      registry.registerComponent(component)
    })

    it('should retrieve registered component', () => {
      const component = registry.getComponent('test', '1.0.0')
      expect(component).toBeDefined()
      expect(component?.name).toBe('Test')
    })

    it('should return null for non-existent component', () => {
      const component = registry.getComponent('non-existent', '1.0.0')
      expect(component).toBeNull()
    })

    it('should return all components', () => {
      const all = registry.getAllComponents()
      expect(all.length).toBeGreaterThan(0)
      expect(all.some(c => c.id === 'test')).toBe(true)
    })
  })

  describe('Component Existence Check', () => {
    it('should confirm component exists', () => {
      const component = {
        id: 'hero',
        name: 'Hero',
        version: '1.0.0',
        component: () => null,
        mockData: {},
        props: {},
        manifest: {},
      }
      registry.registerComponent(component)

      expect(registry.hasComponent('hero')).toBe(true)
      expect(registry.hasComponent('hero', '1.0.0')).toBe(true)
    })

    it('should return false for non-existent component', () => {
      expect(registry.hasComponent('non-existent')).toBe(false)
      expect(registry.hasComponent('non-existent', '1.0.0')).toBe(false)
    })
  })

  describe('Component Statistics', () => {
    it('should calculate component statistics', () => {
      const components = [
        {
          id: 'hero',
          name: 'Hero',
          version: '1.0.0',
          component: () => null,
          mockData: {},
          props: {},
          manifest: { bilingual: true, responsive: true },
        },
        {
          id: 'products',
          name: 'Products',
          version: '1.0.0',
          component: () => null,
          mockData: {},
          props: {},
          manifest: { bilingual: true, responsive: false },
        },
      ]

      components.forEach(comp => registry.registerComponent(comp))

      const stats = registry.getComponentStats()

      expect(stats.totalComponents).toBeGreaterThanOrEqual(2)
      expect(stats.totalVersions).toBeGreaterThanOrEqual(2)
    })
  })

  describe('Component Filtering', () => {
    beforeEach(() => {
      const components = [
        {
          id: 'hero',
          name: 'Hero',
          version: '1.0.0',
          component: () => null,
          mockData: {},
          props: {},
          manifest: { category: 'banner', bilingual: true, responsive: true },
        },
        {
          id: 'products',
          name: 'Products',
          version: '1.0.0',
          component: () => null,
          mockData: {},
          props: {},
          manifest: { category: 'content', bilingual: true, responsive: true },
        },
      ]

      components.forEach(comp => registry.registerComponent(comp))
    })

    it('should filter components by category', () => {
      const banners = registry.getComponentsByCategory('banner')
      expect(banners.some(c => c.id === 'hero')).toBe(true)
    })

    it('should get bilingual components', () => {
      const bilingual = registry.getBilingualComponents()
      expect(bilingual.length).toBeGreaterThan(0)
    })

    it('should get responsive components', () => {
      const responsive = registry.getResponsiveComponents()
      expect(responsive.length).toBeGreaterThan(0)
    })
  })

  describe('Component Versions', () => {
    it('should track component versions', () => {
      const component = {
        id: 'hero',
        name: 'Hero',
        version: '1.0.0',
        component: () => null,
        mockData: {},
        props: {},
        manifest: {},
      }

      registry.registerComponent(component)
      const versions = registry.getComponentVersions('hero')

      expect(versions).toContain('1.0.0')
    })

    it('should return empty array for non-existent component versions', () => {
      const versions = registry.getComponentVersions('non-existent')
      expect(versions).toEqual([])
    })
  })

  describe('Caching', () => {
    it('should cache retrieved components', () => {
      const component = {
        id: 'test',
        name: 'Test',
        version: '1.0.0',
        component: () => null,
        mockData: {},
        props: {},
        manifest: {},
      }

      registry.registerComponent(component)
      registry.getComponent('test', '1.0.0')

      const cacheStats = registry.getCacheStats()
      expect(cacheStats.size).toBeGreaterThan(0)
    })

    it('should clear cache', () => {
      const component = {
        id: 'test',
        name: 'Test',
        version: '1.0.0',
        component: () => null,
        mockData: {},
        props: {},
        manifest: {},
      }

      registry.registerComponent(component)
      registry.getComponent('test', '1.0.0')

      registry.clearCache()
      const cacheStats = registry.getCacheStats()

      expect(cacheStats.size).toBe(0)
    })
  })

  describe('Error Handling', () => {
    it('should handle component retrieval gracefully', () => {
      const component = registry.getComponent('non-existent', '1.0.0')
      expect(component).toBeNull()
    })

    it('should handle empty component list', () => {
      const all = registry.getAllComponents()
      expect(Array.isArray(all)).toBe(true)
    })
  })
})
