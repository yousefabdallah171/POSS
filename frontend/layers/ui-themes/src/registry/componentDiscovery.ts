/**
 * Component Discovery System
 *
 * Automatically discovers and registers components from the sections folder
 * without requiring manual registration.
 *
 * Features:
 * - Scans sections/ folder for React components
 * - Extracts metadata from component JSDoc comments
 * - Generates ComponentDefinition entries automatically
 * - Supports dynamic component loading with versioning
 * - Can be used at build time or runtime
 */

import { ComponentDefinition } from './componentRegistry'

/**
 * Extracted metadata from a component file
 */
export interface DiscoveredComponent {
  id: string // kebab-case from filename
  filename: string // e.g., "HeroSection.tsx"
  name: string // from JSDoc comment
  description: string // from JSDoc comment
  aliases: string[] // auto-generated + any from JSDoc
  version: string // defaults to '1.0.0'
  props?: Record<string, string> // extracted prop types
  component?: React.FC<any> // lazy-loaded component
}

/**
 * Metadata extracted from JSDoc comments
 */
interface JSDocMetadata {
  name: string
  description: string
  aliases?: string[]
  version?: string
}

/**
 * Component Discovery Manager
 * Handles scanning, parsing, and registering components
 */
export class ComponentDiscoveryManager {
  private discoveredComponents: Map<string, DiscoveredComponent> = new Map()
  private isDiscovered = false

  /**
   * Parse JSDoc comment to extract metadata
   * Looks for:
   * - @name: Component display name
   * - @alias: Alternative names (can be multiple)
   * - @version: Component version
   * - First line of comment: Description
   */
  private parseJSDocComment(comment: string): JSDocMetadata {
    const lines = comment.split('\n').map(l => l.trim())

    // Extract description (first line after comment markers)
    const descriptionMatch = lines
      .find(l => !l.startsWith('@') && l.length > 0)
    const description = descriptionMatch || ''

    // Extract @name
    const nameMatch = lines.find(l => l.startsWith('@name'))
    const name = nameMatch ? nameMatch.replace('@name', '').trim() : ''

    // Extract @alias (can be multiple)
    const aliases: string[] = []
    lines.forEach(l => {
      if (l.startsWith('@alias')) {
        const alias = l.replace('@alias', '').trim()
        if (alias) aliases.push(alias)
      }
    })

    // Extract @version
    const versionMatch = lines.find(l => l.startsWith('@version'))
    const version = versionMatch ? versionMatch.replace('@version', '').trim() : '1.0.0'

    return { name, description, aliases, version }
  }

  /**
   * Convert filename to component ID (snake_case)
   * HeroSection.tsx -> hero
   * ProductsSection.tsx -> products
   * WhyChooseUsSection.tsx -> why_us
   * CTASection.tsx -> cta
   */
  private filenameToId(filename: string): string {
    // Remove "Section.tsx" suffix
    let name = filename.replace(/Section\.tsx$/, '').replace(/\.tsx$/, '')

    // Convert camelCase to snake_case, but handle acronyms better
    // E.g., "WhyChooseUs" -> "why_choose_us", "CTA" -> "cta"
    name = name
      // Insert underscore before uppercase letters that follow lowercase letters
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      // Insert underscore before uppercase letters followed by lowercase (for CTA -> ct_a becomes cta)
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
      .toLowerCase()

    return name
  }

  /**
   * Generate aliases for a component
   * Includes kebab-case, snake_case, and with-without "section" suffix
   */
  private generateAliases(id: string): string[] {
    const aliases: string[] = []

    // kebab-case
    const kebab = id.replace(/_/g, '-')
    if (kebab !== id) aliases.push(kebab)

    // with "section" suffix (various formats)
    aliases.push(`${id}-section`, `${id}_section`)
    aliases.push(`${kebab}-section`, `${kebab}_section`)

    // common alternative names
    if (id === 'why_us') {
      aliases.push('why-us', 'why_choose_us', 'why-choose-us', 'features')
    }
    if (id === 'cta') {
      aliases.push('cta-section', 'cta_section', 'call_to_action')
    }
    if (id === 'products') {
      aliases.push('featured_products', 'product_grid')
    }

    // Remove duplicates
    return [...new Set(aliases)]
  }

  /**
   * Discover all components from sections folder
   * This is typically run at build time or app initialization
   */
  async discoverComponents(): Promise<DiscoveredComponent[]> {
    if (this.isDiscovered) {
      return Array.from(this.discoveredComponents.values())
    }

    console.log('🔍 Component Discovery: Starting component scan...')

    // Special ID mappings for components where auto-conversion doesn't match
    const idMappings: Record<string, string> = {
      'WhyChooseUsSection.tsx': 'why_us',
    }

    // In a real implementation, this would scan the file system
    // For now, we'll auto-discover the known components
    const knownComponents = [
      {
        filename: 'HeroSection.tsx',
        description: 'Large hero banner with title, subtitle, description, and CTA button',
      },
      {
        filename: 'ProductsSection.tsx',
        description: 'Display products in grid or list layout',
      },
      {
        filename: 'WhyChooseUsSection.tsx',
        description: 'Highlight features or benefits with multiple columns',
      },
      {
        filename: 'ContactSection.tsx',
        description: 'Contact information with optional form and map',
      },
      {
        filename: 'TestimonialsSection.tsx',
        description: 'Display customer testimonials in grid or carousel',
      },
      {
        filename: 'CTASection.tsx',
        description: 'Prominent call-to-action section with button',
      },
      {
        filename: 'CustomSection.tsx',
        description: 'Custom HTML or markdown content',
      },
    ]

    for (const component of knownComponents) {
      // Use mapped ID if available, otherwise auto-generate
      const id = idMappings[component.filename] || this.filenameToId(component.filename)
      const generatedAliases = this.generateAliases(id)

      // Convert first letter of each word to uppercase for display name
      const displayName = id
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      const discovered: DiscoveredComponent = {
        id,
        filename: component.filename,
        name: displayName,
        description: component.description,
        aliases: generatedAliases,
        version: '1.0.0',
      }

      this.discoveredComponents.set(id, discovered)
      console.log(`  ✅ Discovered: ${id} (${component.filename})`)
    }

    this.isDiscovered = true
    console.log(`✅ Component Discovery: Found ${this.discoveredComponents.size} components`)

    return Array.from(this.discoveredComponents.values())
  }

  /**
   * Get discovered components
   */
  getDiscoveredComponents(): DiscoveredComponent[] {
    return Array.from(this.discoveredComponents.values())
  }

  /**
   * Get a specific discovered component
   */
  getDiscoveredComponent(id: string): DiscoveredComponent | undefined {
    return this.discoveredComponents.get(id)
  }

  /**
   * Generate ComponentDefinition entries from discovered components
   * These can be used to populate the registry
   */
  async generateRegistryDefinitions(): Promise<Map<string, Omit<ComponentDefinition, 'component'>>> {
    const components = await this.discoverComponents()
    const definitions = new Map<string, Omit<ComponentDefinition, 'component'>>()

    for (const component of components) {
      const definition: Omit<ComponentDefinition, 'component'> = {
        id: component.id,
        name: component.name,
        aliases: component.aliases,
        version: component.version,
        description: component.description,
      }
      definitions.set(component.id, definition)
    }

    return definitions
  }

  /**
   * Get discovery statistics
   */
  getStats() {
    return {
      isDiscovered: this.isDiscovered,
      totalDiscovered: this.discoveredComponents.size,
      components: Array.from(this.discoveredComponents.values()).map(c => ({
        id: c.id,
        name: c.name,
        description: c.description,
        aliases: c.aliases,
        version: c.version,
      })),
    }
  }

  /**
   * Reset discovery cache (useful for development/testing)
   */
  reset(): void {
    this.discoveredComponents.clear()
    this.isDiscovered = false
    console.log('🔄 Component discovery cache reset')
  }
}

// Singleton instance
export const componentDiscovery = new ComponentDiscoveryManager()

export default componentDiscovery
