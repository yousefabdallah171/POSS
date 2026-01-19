import React, { ComponentType, useMemo } from 'react'
import { useMockData } from './useMockData'

/**
 * Props passed to wrapped component from withMockData HOC
 */
export interface WithMockDataProps {
  mockData: Record<string, any> | null
  hasMockData: boolean
}

/**
 * Higher-order component to provide mock data to a component
 *
 * @param WrappedComponent - The component to wrap
 * @param componentId - The ID of the component to get mock data for
 * @param fallback - Optional fallback data if mock data is not available
 * @returns The wrapped component with mock data props
 *
 * @example
 * ```tsx
 * const HeroWithMockData = withMockData(HeroSection, 'hero')
 *
 * function App() {
 *   return <HeroWithMockData />
 * }
 * ```
 */
export function withMockData<P extends WithMockDataProps>(
  WrappedComponent: ComponentType<P>,
  componentId: string,
  fallback?: Record<string, any>
) {
  const displayName = `withMockData(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`

  const Component = (props: Omit<P, keyof WithMockDataProps>) => {
    const mockData = useMockData(componentId, fallback)

    const mockDataProps = useMemo<WithMockDataProps>(
      () => ({
        mockData,
        hasMockData: mockData !== null,
      }),
      [mockData]
    )

    return <WrappedComponent {...(props as P)} {...mockDataProps} />
  }

  Component.displayName = displayName

  return Component
}

export default withMockData
