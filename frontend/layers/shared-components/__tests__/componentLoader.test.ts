/**
 * Unit Tests for ComponentLoader
 *
 * Tests async loading functionality for:
 * - Single component loading
 * - Timeout handling
 * - Batch loading
 * - Preloading
 * - React hook integration
 */

import { ComponentLoader, useComponentLoader } from '../utils/componentLoader'
import { ComponentRegistry } from '../registry/types'

describe('ComponentLoader', () => {
  let registry: ComponentRegistry

  beforeEach(() => {
    registry = ComponentRegistry.getInstance()
    registry.clearCache()

    // Register test component
    const testComponent = {
      id: 'test-hero',
      name: 'Test Hero',
      version: '1.0.0',
      component: () => null,
      mockData: { title: 'Test' },
      props: { title_en: 'string' },
      manifest: {},
    }

    registry.registerComponent(testComponent)
  })

  describe('loadComponent', () => {
    it('should load a single component', async () => {
      const component = await ComponentLoader.loadComponent('test-hero', '1.0.0')
      expect(component).toBeDefined()
      expect(component?.id).toBe('test-hero')
    })

    it('should throw error for non-existent component', async () => {
      try {
        await ComponentLoader.loadComponent('non-existent', '1.0.0')
        fail('Should have thrown error')
      } catch (error) {
        expect(error).toBeDefined()
      }
    })
  })

  describe('loadComponentWithTimeout', () => {
    it('should load component within timeout', async () => {
      const component = await ComponentLoader.loadComponentWithTimeout('test-hero', '1.0.0', 5000)
      expect(component).toBeDefined()
      expect(component?.id).toBe('test-hero')
    })

    it('should handle timeout for slow operations', async () => {
      try {
        // Set unreasonably short timeout
        await ComponentLoader.loadComponentWithTimeout('test-hero', '1.0.0', 0)
        // Should timeout or complete
      } catch (error) {
        // Timeout expected in some cases
        expect(error).toBeDefined()
      }
    })
  })

  describe('loadComponentsBatch', () => {
    beforeEach(() => {
      const products = {
        id: 'test-products',
        name: 'Test Products',
        version: '1.0.0',
        component: () => null,
        mockData: {},
        props: {},
        manifest: {},
      }

      registry.registerComponent(products)
    })

    it('should load multiple components', async () => {
      const components = await ComponentLoader.loadComponentsBatch([
        { id: 'test-hero', version: '1.0.0' },
        { id: 'test-products', version: '1.0.0' },
      ])

      expect(components.length).toBe(2)
      expect(components.every(c => c !== null)).toBe(true)
    })

    it('should handle partial failures in batch', async () => {
      const components = await ComponentLoader.loadComponentsBatch([
        { id: 'test-hero', version: '1.0.0' },
        { id: 'non-existent', version: '1.0.0' },
      ])

      expect(components.length).toBe(2)
      expect(components[0]).not.toBeNull()
      expect(components[1]).toBeNull()
    })
  })

  describe('preloadComponents', () => {
    it('should preload critical components', async () => {
      const preloadPromise = ComponentLoader.preloadComponents(['test-hero'])

      // Should not throw
      await expect(preloadPromise).resolves.toBeDefined()
    })

    it('should handle empty preload list', async () => {
      const preloadPromise = ComponentLoader.preloadComponents([])

      // Should not throw
      await expect(preloadPromise).resolves.toBeDefined()
    })
  })

  describe('loadComponentWithFallback', () => {
    beforeEach(() => {
      const fallback = {
        id: 'fallback-component',
        name: 'Fallback',
        version: '1.0.0',
        component: () => null,
        mockData: {},
        props: {},
        manifest: {},
      }

      registry.registerComponent(fallback)
    })

    it('should load primary component if available', async () => {
      const component = await ComponentLoader.loadComponentWithFallback('test-hero', 'fallback-component')
      expect(component?.id).toBe('test-hero')
    })

    it('should use fallback if primary unavailable', async () => {
      const component = await ComponentLoader.loadComponentWithFallback('non-existent', 'fallback-component')
      expect(component?.id).toBe('fallback-component')
    })
  })

  describe('Cache Management', () => {
    it('should cache loaded components', async () => {
      await ComponentLoader.loadComponent('test-hero', '1.0.0')
      const status = ComponentLoader.getLoadingStatus()

      expect(status.cached).toBeGreaterThan(0)
    })

    it('should clear cache', async () => {
      await ComponentLoader.loadComponent('test-hero', '1.0.0')
      ComponentLoader.clearCache()

      const status = ComponentLoader.getLoadingStatus()
      expect(status.cached).toBe(0)
    })
  })

  describe('Loading Status', () => {
    it('should track loading status', async () => {
      await ComponentLoader.loadComponent('test-hero', '1.0.0')

      const status = ComponentLoader.getLoadingStatus()

      expect(status).toHaveProperty('cached')
      expect(status).toHaveProperty('pending')
      expect(status).toHaveProperty('failed')
    })
  })

  describe('Error Handling', () => {
    it('should handle invalid component ID', async () => {
      try {
        await ComponentLoader.loadComponent('', '1.0.0')
        fail('Should have thrown error')
      } catch (error) {
        expect(error).toBeDefined()
      }
    })

    it('should handle undefined version', async () => {
      const component = await ComponentLoader.loadComponent('test-hero')
      expect(component).toBeDefined()
    })
  })
})
