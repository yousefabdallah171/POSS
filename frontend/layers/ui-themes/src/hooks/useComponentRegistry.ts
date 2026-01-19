import { useEffect, useState } from 'react'
import { componentRegistry } from '../registry/componentRegistry'

/**
 * Hook to initialize and manage the Component Registry
 *
 * Usage:
 * const { isReady, error, stats } = useComponentRegistry()
 *
 * This hook:
 * - Initializes the registry on component mount
 * - Tracks initialization state
 * - Provides registry statistics for debugging
 * - Handles errors gracefully
 */
export function useComponentRegistry() {
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [stats, setStats] = useState(componentRegistry.getStats())

  useEffect(() => {
    let mounted = true

    const initialize = async () => {
      try {
        await componentRegistry.initialize()
        if (mounted) {
          setIsReady(true)
          setStats(componentRegistry.getStats())
          console.log('✅ Component Registry hook initialized')
        }
      } catch (err) {
        if (mounted) {
          const error = err instanceof Error ? err : new Error('Unknown error')
          setError(error)
          console.error('❌ Component Registry hook initialization failed:', error)
        }
      }
    }

    initialize()

    return () => {
      mounted = false
    }
  }, [])

  return {
    isReady,
    error,
    stats,
    getComponents: () => componentRegistry.getAllComponents(),
    hasComponent: (type: string) => componentRegistry.hasComponent(type),
  }
}

export default useComponentRegistry
