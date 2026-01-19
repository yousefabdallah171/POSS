import { useContext } from 'react'
import { MockDataContext, MockDataContextValue } from '../context/MockDataContext'

/**
 * Hook to access mock data for a specific component
 *
 * @param componentId - The ID of the component to get mock data for
 * @param fallback - Optional fallback data if mock data is not available
 * @returns The mock data for the component, or fallback if not found
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const mockData = useMockData('hero')
 *
 *   if (!mockData) return <div>No mock data available</div>
 *
 *   return <div>{mockData.title}</div>
 * }
 * ```
 */
export function useMockData(
  componentId: string,
  fallback?: Record<string, any>
): Record<string, any> | null {
  const context = useContext(MockDataContext)

  if (!context) {
    console.warn(
      'useMockData must be used within a MockDataProvider. Returning fallback data.'
    )
    return fallback || null
  }

  return context.getMockDataWithFallback(componentId, fallback)
}

/**
 * Hook to check if mock data is available for a component
 *
 * @param componentId - The ID of the component
 * @returns True if mock data is available, false otherwise
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const hasMockData = useHasMockData('hero')
 *
 *   return <div>{hasMockData ? 'Has mock data' : 'No mock data'}</div>
 * }
 * ```
 */
export function useHasMockData(componentId: string): boolean {
  const context = useContext(MockDataContext)

  if (!context) {
    console.warn('useHasMockData must be used within a MockDataProvider')
    return false
  }

  return context.hasMockData(componentId)
}

/**
 * Hook to get all available mock data
 *
 * @returns An object containing all available mock data
 *
 * @example
 * ```tsx
 * function MockDataBrowser() {
 *   const allMockData = useAllMockData()
 *
 *   return (
 *     <div>
 *       {Object.entries(allMockData).map(([id, data]) => (
 *         <div key={id}>{id}</div>
 *       ))}
 *     </div>
 *   )
 * }
 * ```
 */
export function useAllMockData(): Record<string, Record<string, any>> {
  const context = useContext(MockDataContext)

  if (!context) {
    console.warn('useAllMockData must be used within a MockDataProvider')
    return {}
  }

  return context.getAllMockData()
}

/**
 * Hook to check if development mode is enabled
 *
 * @returns True if development mode is enabled, false otherwise
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const isDev = useIsDevelopmentMode()
 *
 *   return <div>{isDev ? 'Development' : 'Production'}</div>
 * }
 * ```
 */
export function useIsDevelopmentMode(): boolean {
  const context = useContext(MockDataContext)

  if (!context) {
    console.warn('useIsDevelopmentMode must be used within a MockDataProvider')
    return false
  }

  return context.isDevelopmentMode
}

/**
 * Hook to get mock data context statistics
 *
 * @returns Statistics about available mock data
 *
 * @example
 * ```tsx
 * function MockDataStats() {
 *   const stats = useMockDataStats()
 *
 *   return (
 *     <div>
 *       Total Components: {stats.totalComponents}
 *       Components with Mock Data: {stats.componentsWithMockData}
 *     </div>
 *   )
 * }
 * ```
 */
export function useMockDataStats() {
  const context = useContext(MockDataContext)

  if (!context) {
    console.warn('useMockDataStats must be used within a MockDataProvider')
    return {
      totalComponents: 0,
      componentsWithMockData: 0,
      componentIds: [],
      developmentMode: false,
    }
  }

  return context.getStats()
}

/**
 * Hook to access the entire mock data context
 *
 * @returns The mock data context value
 *
 * @example
 * ```tsx
 * function AdvancedMockDataComponent() {
 *   const mockDataContext = useMockDataContext()
 *
 *   return (
 *     <div>
 *       Available: {mockDataContext.getStats().componentsWithMockData}
 *     </div>
 *   )
 * }
 * ```
 */
export function useMockDataContext(): MockDataContextValue {
  const context = useContext(MockDataContext)

  if (!context) {
    throw new Error('useMockDataContext must be used within a MockDataProvider')
  }

  return context
}

export default useMockData
