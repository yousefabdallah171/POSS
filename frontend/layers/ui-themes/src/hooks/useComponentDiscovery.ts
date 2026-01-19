'use client'

import { useEffect, useState } from 'react'
import { componentDiscovery, type DiscoveredComponent } from '../registry/componentDiscovery'

/**
 * Hook for component discovery
 * Automatically discovers all components in the sections folder
 * Can be used to list available components or verify component availability
 */
export function useComponentDiscovery() {
  const [isDiscovering, setIsDiscovering] = useState(false)
  const [discoveredComponents, setDiscoveredComponents] = useState<DiscoveredComponent[]>([])
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const discover = async () => {
      try {
        setIsDiscovering(true)
        const components = await componentDiscovery.discoverComponents()
        setDiscoveredComponents(components)
        setIsDiscovering(false)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error during discovery'))
        setIsDiscovering(false)
      }
    }

    discover()
  }, [])

  /**
   * Check if a specific component is discovered
   */
  const hasComponent = (componentId: string): boolean => {
    return discoveredComponents.some(c => c.id === componentId || c.aliases.includes(componentId))
  }

  /**
   * Get a discovered component by ID or alias
   */
  const getComponent = (componentId: string): DiscoveredComponent | undefined => {
    return discoveredComponents.find(c => c.id === componentId) ||
      discoveredComponents.find(c => c.aliases.includes(componentId))
  }

  /**
   * Get all discovered components
   */
  const getComponents = (): DiscoveredComponent[] => {
    return discoveredComponents
  }

  /**
   * Get discovery statistics
   */
  const getStats = () => {
    return {
      isDiscovering,
      isComplete: !isDiscovering,
      totalDiscovered: discoveredComponents.length,
      components: discoveredComponents,
    }
  }

  return {
    isDiscovering,
    isComplete: !isDiscovering,
    error,
    discoveredComponents,
    hasComponent,
    getComponent,
    getComponents,
    getStats,
  }
}

export default useComponentDiscovery
