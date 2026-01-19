/**
 * Manifest Validator
 * Validates component manifests to ensure they meet requirements
 */

import { ComponentManifestData } from '../registry/types'

export interface ValidationError {
  field: string
  message: string
}

export class ManifestValidator {
  /**
   * Validate a manifest object
   * Throws error if invalid, returns true if valid
   */
  static validate(manifest: any): manifest is ComponentManifestData {
    const errors = this.getValidationErrors(manifest)

    if (errors.length > 0) {
      const errorMessages = errors.map(e => `${e.field}: ${e.message}`).join('\n')
      throw new Error(`Manifest validation failed:\n${errorMessages}`)
    }

    return true
  }

  /**
   * Get validation errors without throwing
   */
  static getValidationErrors(manifest: any): ValidationError[] {
    const errors: ValidationError[] = []

    // Check id
    if (!manifest || !manifest.id || typeof manifest.id !== 'string') {
      errors.push({
        field: 'id',
        message: 'Must be a non-empty string',
      })
    }

    // Check name
    if (!manifest.name || typeof manifest.name !== 'string') {
      errors.push({
        field: 'name',
        message: 'Must be a non-empty string',
      })
    }

    // Check version
    if (!manifest.version || typeof manifest.version !== 'string') {
      errors.push({
        field: 'version',
        message: 'Must be a non-empty string (e.g., 1.0.0)',
      })
    }

    // Check version format
    if (manifest.version && !this.isValidSemanticVersion(manifest.version)) {
      errors.push({
        field: 'version',
        message: 'Must be valid semantic version (MAJOR.MINOR.PATCH)',
      })
    }

    // Check category
    if (!manifest.category || typeof manifest.category !== 'string') {
      errors.push({
        field: 'category',
        message: 'Must be a non-empty string (e.g., banner, content, footer)',
      })
    }

    // Check description
    if (!manifest.description || typeof manifest.description !== 'string') {
      errors.push({
        field: 'description',
        message: 'Must be a non-empty string',
      })
    }

    // Check bilingual
    if (typeof manifest.bilingual !== 'boolean') {
      errors.push({
        field: 'bilingual',
        message: 'Must be a boolean (true/false)',
      })
    }

    // Check responsive
    if (typeof manifest.responsive !== 'boolean') {
      errors.push({
        field: 'responsive',
        message: 'Must be a boolean (true/false)',
      })
    }

    // Check deprecated
    if (typeof manifest.deprecated !== 'boolean') {
      errors.push({
        field: 'deprecated',
        message: 'Must be a boolean (true/false)',
      })
    }

    // Check author
    if (!manifest.author || typeof manifest.author !== 'string') {
      errors.push({
        field: 'author',
        message: 'Must be a non-empty string',
      })
    }

    // Check compatibility array
    if (!Array.isArray(manifest.compatibility)) {
      errors.push({
        field: 'compatibility',
        message: 'Must be an array of version strings',
      })
    }

    // Check performance
    if (!manifest.performance || typeof manifest.performance !== 'object') {
      errors.push({
        field: 'performance',
        message: 'Must be an object with weight and renderTime properties',
      })
    } else {
      if (!manifest.performance.weight || typeof manifest.performance.weight !== 'string') {
        errors.push({
          field: 'performance.weight',
          message: 'Must be a non-empty string (e.g., 15KB)',
        })
      }
      if (!manifest.performance.renderTime || typeof manifest.performance.renderTime !== 'string') {
        errors.push({
          field: 'performance.renderTime',
          message: 'Must be a non-empty string (e.g., 50ms)',
        })
      }
    }

    // Check props
    if (!manifest.props || typeof manifest.props !== 'object') {
      errors.push({
        field: 'props',
        message: 'Must be an object with property descriptions',
      })
    }

    // Check mockData
    if (!manifest.mockData || typeof manifest.mockData !== 'object') {
      errors.push({
        field: 'mockData',
        message: 'Must be an object with mock data keys',
      })
    }

    // Check themes
    if (!manifest.themes || typeof manifest.themes !== 'object') {
      errors.push({
        field: 'themes',
        message: 'Must be an object with usedIn and versions properties',
      })
    } else {
      if (typeof manifest.themes.usedIn !== 'number') {
        errors.push({
          field: 'themes.usedIn',
          message: 'Must be a number',
        })
      }
      if (!Array.isArray(manifest.themes.versions)) {
        errors.push({
          field: 'themes.versions',
          message: 'Must be an array of version strings',
        })
      }
    }

    return errors
  }

  /**
   * Check if version string is valid semantic version
   */
  private static isValidSemanticVersion(version: string): boolean {
    const semverRegex = /^\d+\.\d+\.\d+$/
    return semverRegex.test(version)
  }

  /**
   * Get a template manifest object
   */
  static getTemplate(): ComponentManifestData {
    return {
      id: 'component-id',
      name: 'Component Display Name',
      description: 'What this component does',
      category: 'content',
      version: '1.0.0',
      compatibility: ['1.0.0'],
      deprecated: false,
      author: 'Design Team',
      bilingual: true,
      responsive: true,
      performance: {
        weight: '15KB',
        renderTime: '50ms',
      },
      props: {},
      mockData: {},
      themes: {
        usedIn: 0,
        versions: ['1.0.0'],
      },
    }
  }

  /**
   * Create a manifest from a partial object
   */
  static create(
    id: string,
    name: string,
    config: Partial<ComponentManifestData>
  ): ComponentManifestData {
    const manifest: ComponentManifestData = {
      id,
      name,
      description: config.description || 'Component description',
      category: config.category || 'content',
      version: config.version || '1.0.0',
      compatibility: config.compatibility || ['1.0.0'],
      deprecated: config.deprecated ?? false,
      author: config.author || 'Design Team',
      bilingual: config.bilingual ?? true,
      responsive: config.responsive ?? true,
      performance: config.performance || {
        weight: '15KB',
        renderTime: '50ms',
      },
      props: config.props || {},
      mockData: config.mockData || {},
      themes: config.themes || {
        usedIn: 0,
        versions: ['1.0.0'],
      },
    }

    // Validate before returning
    this.validate(manifest)
    return manifest
  }
}
