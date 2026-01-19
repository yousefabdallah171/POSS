import { useEffect, useState, useCallback } from 'react'

export interface ABTestVariant {
  id: string
  name: string
  description?: string
  traffic_percent: number
  is_control: boolean
  properties?: Record<string, any>
}

export interface ABTestAssignment {
  experiment_id: string
  user_id: number
  variant_id: string
  assigned_at: string
}

export interface UseABTestOptions {
  experimentId: string
  userId?: number
  apiBaseUrl?: string
  restaurantId?: number
  onVariantAssigned?: (variantId: string) => void
  onError?: (error: Error) => void
}

export interface UseABTestResult {
  variantId: string | null
  isLoading: boolean
  error: Error | null
  recordConversion: (value?: number) => Promise<void>
  getVariantProperties: () => Record<string, any>
}

/**
 * Hook for A/B testing variant assignment and tracking
 */
export function useABTest(options: UseABTestOptions): UseABTestResult {
  const {
    experimentId,
    userId,
    apiBaseUrl = process.env.REACT_APP_API_BASE_URL || '/api',
    restaurantId,
    onVariantAssigned,
    onError,
  } = options

  const [variantId, setVariantId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [variantProperties, setVariantProperties] = useState<Record<string, any>>({})

  // Get current user ID if not provided
  const currentUserId = userId || (typeof window !== 'undefined' ? parseInt(localStorage.getItem('user_id') || '0', 10) : 0)

  // Fetch variant assignment
  const fetchAssignment = useCallback(async () => {
    if (!experimentId || currentUserId <= 0) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(
        `${apiBaseUrl}/v1/admin/ab-tests/${experimentId}/assign`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(restaurantId && { 'X-Restaurant-ID': restaurantId.toString() }),
          },
          body: JSON.stringify({
            user_id: currentUserId,
          }),
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to assign variant: ${response.statusText}`)
      }

      const data = await response.json()
      const assignedVariantId = data.variant_id
      const properties = data.properties || {}

      setVariantId(assignedVariantId)
      setVariantProperties(properties)

      if (onVariantAssigned) {
        onVariantAssigned(assignedVariantId)
      }

      // Log assignment for analytics
      logVariantAssignment(experimentId, assignedVariantId, currentUserId)
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      if (onError) {
        onError(error)
      }
    } finally {
      setIsLoading(false)
    }
  }, [experimentId, currentUserId, apiBaseUrl, restaurantId, onVariantAssigned, onError])

  // Record conversion
  const recordConversion = useCallback(
    async (value: number = 1) => {
      if (!variantId || !experimentId) {
        return
      }

      try {
        await fetch(
          `${apiBaseUrl}/v1/admin/ab-tests/${experimentId}/conversion`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(restaurantId && { 'X-Restaurant-ID': restaurantId.toString() }),
            },
            body: JSON.stringify({
              user_id: currentUserId,
              variant_id: variantId,
              value,
            }),
          }
        )

        // Log conversion for analytics
        logConversion(experimentId, variantId, value)
      } catch (err) {
        console.error('[ABTest] Failed to record conversion:', err)
      }
    },
    [experimentId, variantId, currentUserId, apiBaseUrl, restaurantId]
  )

  // Get variant properties
  const getVariantProperties = useCallback(() => {
    return variantProperties
  }, [variantProperties])

  // Fetch assignment on mount
  useEffect(() => {
    fetchAssignment()
  }, [fetchAssignment])

  return {
    variantId,
    isLoading,
    error,
    recordConversion,
    getVariantProperties,
  }
}

/**
 * Hook to conditionally render components based on A/B test variant
 */
export function useABTestVariant(experimentId: string, userId?: number) {
  const { variantId } = useABTest({ experimentId, userId })

  return {
    variantId,
    isVariant: (id: string) => variantId === id,
    isControl: (controlId: string) => variantId === controlId,
  }
}

/**
 * Log variant assignment for analytics
 */
function logVariantAssignment(experimentId: string, variantId: string, userId: number) {
  try {
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.trackEvent({
        event_type: 'experiment_assignment',
        event_name: 'variant_assigned',
        category: 'experiment',
        action: 'assign',
        label: experimentId,
        properties: {
          experiment_id: experimentId,
          variant_id: variantId,
          user_id: userId,
        },
      })
    }
  } catch (err) {
    console.error('[ABTest] Failed to log assignment:', err)
  }
}

/**
 * Log conversion for analytics
 */
function logConversion(experimentId: string, variantId: string, value: number) {
  try {
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.trackEvent({
        event_type: 'experiment_conversion',
        event_name: 'conversion_recorded',
        category: 'experiment',
        action: 'convert',
        label: experimentId,
        value: Math.round(value),
        properties: {
          experiment_id: experimentId,
          variant_id: variantId,
          conversion_value: value,
        },
      })
    }
  } catch (err) {
    console.error('[ABTest] Failed to log conversion:', err)
  }
}

export default useABTest
