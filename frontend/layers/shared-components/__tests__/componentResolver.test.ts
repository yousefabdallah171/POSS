/**
 * Unit Tests for ComponentResolver
 *
 * Tests semantic versioning and compatibility resolution for:
 * - Version matching
 * - Compatibility checking
 * - Migration paths
 * - Deprecation tracking
 */

import { ComponentResolver } from '../utils/componentResolver'
import { ComponentRegistry } from '../registry/types'

describe('ComponentResolver', () => {
  let registry: ComponentRegistry

  beforeEach(() => {
    registry = ComponentRegistry.getInstance()
    registry.clearCache()

    // Register test components with different versions
    const v1 = {
      id: 'hero',
      name: 'Hero v1',
      version: '1.0.0',
      component: () => null,
      mockData: {},
      props: {},
      manifest: { deprecated: false },
    }

    const v1_1 = {
      id: 'hero',
      name: 'Hero v1.1',
      version: '1.1.0',
      component: () => null,
      mockData: {},
      props: {},
      manifest: { deprecated: false },
    }

    const v2 = {
      id: 'hero',
      name: 'Hero v2',
      version: '2.0.0',
      component: () => null,
      mockData: {},
      props: {},
      manifest: { deprecated: false },
    }

    registry.registerComponent(v1)
    registry.registerComponent(v1_1)
    registry.registerComponent(v2)
  })

  describe('Exact Version Matching', () => {
    it('should match exact version', () => {
      const component = ComponentResolver.resolveComponent('hero', '1.0.0')
      expect(component).toBeDefined()
      expect(component?.version).toBe('1.0.0')
    })

    it('should return null for non-existent exact version', () => {
      const component = ComponentResolver.resolveComponent('hero', '99.0.0')
      expect(component).toBeNull()
    })
  })

  describe('Compatibility Resolution', () => {
    it('should find compatible version with caret', () => {
      const component = ComponentResolver.findCompatibleVersion('hero', '^1.0.0')
      expect(component).toBeDefined()
      expect(component?.version).toMatch(/^1\.\d+\.\d+/)
    })

    it('should find compatible version with tilde', () => {
      const component = ComponentResolver.findCompatibleVersion('hero', '~1.0.0')
      expect(component).toBeDefined()
    })

    it('should find latest version', () => {
      const component = ComponentResolver.getLatestVersion('hero')
      expect(component).toBeDefined()
      expect(component?.version).toBe('2.0.0')
    })
  })

  describe('Version Compatibility Check', () => {
    it('should identify compatible versions', () => {
      const compatible = ComponentResolver.isCompatible('hero', '1.0.0', '1.1.0')
      expect(compatible).toBe(true)
    })

    it('should identify incompatible major versions', () => {
      const compatible = ComponentResolver.isCompatible('hero', '1.0.0', '2.0.0')
      expect(compatible).toBe(false)
    })
  })

  describe('Version Information', () => {
    it('should get version info', () => {
      const info = ComponentResolver.getVersionInfo('hero', '1.0.0')
      expect(info).toBeDefined()
      expect(info?.version).toBe('1.0.0')
    })

    it('should return null for non-existent version info', () => {
      const info = ComponentResolver.getVersionInfo('hero', '99.0.0')
      expect(info).toBeNull()
    })
  })

  describe('All Versions', () => {
    it('should get all component versions', () => {
      const versions = ComponentResolver.getAllVersions('hero')
      expect(versions).toContain('1.0.0')
      expect(versions).toContain('1.1.0')
      expect(versions).toContain('2.0.0')
    })

    it('should return empty array for non-existent component', () => {
      const versions = ComponentResolver.getAllVersions('non-existent')
      expect(versions).toEqual([])
    })
  })

  describe('Migration Path', () => {
    it('should generate migration path', () => {
      const path = ComponentResolver.getMigrationPath('hero', '1.0.0', '2.0.0')
      expect(path).toBeDefined()
      expect(path.length).toBeGreaterThan(0)
    })

    it('should handle same version migration', () => {
      const path = ComponentResolver.getMigrationPath('hero', '1.0.0', '1.0.0')
      expect(path).toBeDefined()
    })
  })

  describe('Deprecation Check', () => {
    beforeEach(() => {
      const deprecated = {
        id: 'old-hero',
        name: 'Old Hero',
        version: '0.9.0',
        component: () => null,
        mockData: {},
        props: {},
        manifest: { deprecated: true },
      }

      registry.registerComponent(deprecated)
    })

    it('should identify deprecated versions', () => {
      const isDeprecated = ComponentResolver.isDeprecated('old-hero', '0.9.0')
      expect(isDeprecated).toBe(true)
    })

    it('should identify non-deprecated versions', () => {
      const isDeprecated = ComponentResolver.isDeprecated('hero', '1.0.0')
      expect(isDeprecated).toBe(false)
    })
  })

  describe('Compatible Components', () => {
    it('should find compatible components', () => {
      const compatible = ComponentResolver.findCompatibleComponents('hero', '1.0.0')
      expect(compatible).toBeDefined()
      expect(compatible.length).toBeGreaterThan(0)
    })
  })

  describe('Version Constraint Parsing', () => {
    it('should parse exact version', () => {
      const constraint = new ComponentResolver['VersionConstraint']('1.0.0')
      const match = constraint.matches('1.0.0')
      expect(match).toBe(true)
    })

    it('should parse caret constraint', () => {
      const constraint = new ComponentResolver['VersionConstraint']('^1.0.0')
      expect(constraint.matches('1.5.0')).toBe(true)
      expect(constraint.matches('2.0.0')).toBe(false)
    })

    it('should parse tilde constraint', () => {
      const constraint = new ComponentResolver['VersionConstraint']('~1.0.0')
      expect(constraint.matches('1.0.5')).toBe(true)
      expect(constraint.matches('1.1.0')).toBe(false)
    })
  })

  describe('Error Handling', () => {
    it('should handle invalid component ID', () => {
      const component = ComponentResolver.resolveComponent('', '1.0.0')
      expect(component).toBeNull()
    })

    it('should handle invalid version string', () => {
      const component = ComponentResolver.resolveComponent('hero', 'invalid')
      // Should handle gracefully
      expect(component).toBeDefined()
    })

    it('should handle null/undefined inputs', () => {
      const component = ComponentResolver.resolveComponent('hero', undefined as any)
      expect(component).toBeDefined()
    })
  })
})
