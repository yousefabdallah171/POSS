import { useCallback, useEffect, useRef, useState } from 'react'

export interface UserFeatures {
  id: number
  engagementScore: number
  recencyScore: number
  diversityScore: number
  loyaltyScore: number
  conversionLikelihood: number
  churnRisk: number
  preferredHours: number[]
  modelVersion: string
  computedAt: string
}

export interface Recommendation {
  id: number
  componentId: number
  componentName?: string
  recommendationType: string
  relevanceScore: number
  reason: string
  position: number
  exposureCount: number
  clickCount: number
  conversionValue?: number
  isActive: boolean
}

export interface RecommendationMetrics {
  totalRecommendations: number
  totalClicks: number
  clickThroughRate: number
  totalConversions: number
  conversionRate: number
  totalConversionValue: number
  averageRelevanceScore: number
  topRecommendedComponents: number[]
}

export interface UsePersonalizationReturn {
  recommendations: Recommendation[]
  userFeatures: UserFeatures | null
  metrics: RecommendationMetrics | null
  loading: boolean
  error: Error | null
  refresh: () => Promise<void>
  recordClick: (recommendationId: number) => Promise<void>
}

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api/v1'

// SDK instance for client-side tracking
class PersonalizationSDK {
  private baseURL: string
  private restaurantId: number
  private userId: number
  private sessionId: string
  private pendingEvents: any[] = []
  private flushInterval: NodeJS.Timeout | null = null

  constructor(baseURL: string, restaurantId: number, userId: number) {
    this.baseURL = baseURL
    this.restaurantId = restaurantId
    this.userId = userId
    this.sessionId = this.generateSessionId()
    this.startEventBatching()
  }

  private generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private startEventBatching(): void {
    this.flushInterval = setInterval(() => {
      this.flushEvents()
    }, 5000)
  }

  private flushEvents(): void {
    if (this.pendingEvents.length === 0) return

    const events = [...this.pendingEvents]
    this.pendingEvents = []

    // Send events asynchronously
    fetch(`${this.baseURL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Restaurant-ID': this.restaurantId.toString(),
      },
      body: JSON.stringify({
        events,
        session_id: this.sessionId,
      }),
    }).catch((err) => {
      console.error('Failed to send personalization events:', err)
      // Re-queue events on failure
      this.pendingEvents.push(...events)
    })
  }

  trackRecommendationClick(
    recommendationId: number,
    userId: number,
    restaurantId: number
  ): void {
    this.pendingEvents.push({
      event_type: 'recommendation_click',
      event_name: 'Recommendation Clicked',
      recommendation_id: recommendationId,
      user_id: userId,
      restaurant_id: restaurantId,
      timestamp: new Date().toISOString(),
    })

    if (this.pendingEvents.length >= 50) {
      this.flushEvents()
    }
  }

  trackComponentView(componentId: number): void {
    this.pendingEvents.push({
      event_type: 'component_view',
      event_name: 'Component Viewed',
      component_id: componentId,
      user_id: this.userId,
      restaurant_id: this.restaurantId,
      timestamp: new Date().toISOString(),
    })
  }

  destroy(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval)
    }
    this.flushEvents()
  }
}

/**
 * usePersonalization hook for personalized recommendations
 *
 * @param userId - The user ID
 * @param restaurantId - The restaurant ID
 * @param count - Number of recommendations to fetch
 * @returns {UsePersonalizationReturn} Personalization state and functions
 *
 * @example
 * const { recommendations, loading, error } = usePersonalization(123, 456, 10)
 */
export function usePersonalization(
  userId: number,
  restaurantId: number,
  count: number = 10
): UsePersonalizationReturn {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [userFeatures, setUserFeatures] = useState<UserFeatures | null>(null)
  const [metrics, setMetrics] = useState<RecommendationMetrics | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const sdkRef = useRef<PersonalizationSDK | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Initialize SDK
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sdkRef.current = new PersonalizationSDK(API_BASE_URL, restaurantId, userId)
      ;(window as any).__personalizationSDK = sdkRef.current
    }

    return () => {
      if (sdkRef.current) {
        sdkRef.current.destroy()
      }
    }
  }, [restaurantId, userId])

  // Fetch recommendations
  const fetchRecommendations = useCallback(async () => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    abortControllerRef.current = new AbortController()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/personalization/users/${userId}/recommendations?count=${count}`,
        {
          headers: {
            'X-Restaurant-ID': restaurantId.toString(),
          },
          signal: abortControllerRef.current.signal,
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setRecommendations(data.recommendations || [])
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err)
      }
    } finally {
      setLoading(false)
    }
  }, [userId, restaurantId, count])

  // Fetch user features
  const fetchUserFeatures = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/personalization/users/${userId}/features`,
        {
          headers: {
            'X-Restaurant-ID': restaurantId.toString(),
          },
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setUserFeatures(data)
    } catch (err) {
      console.error('Failed to fetch user features:', err)
    }
  }, [userId, restaurantId])

  // Fetch metrics
  const fetchMetrics = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/personalization/recommendations/metrics?period=24h`,
        {
          headers: {
            'X-Restaurant-ID': restaurantId.toString(),
          },
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setMetrics(data)
    } catch (err) {
      console.error('Failed to fetch metrics:', err)
    }
  }, [restaurantId])

  // Initial load
  useEffect(() => {
    fetchRecommendations()
    fetchUserFeatures()
    fetchMetrics()
  }, [fetchRecommendations, fetchUserFeatures, fetchMetrics])

  // Refresh function
  const refresh = useCallback(async () => {
    await Promise.all([fetchRecommendations(), fetchUserFeatures(), fetchMetrics()])
  }, [fetchRecommendations, fetchUserFeatures, fetchMetrics])

  // Record recommendation click
  const recordClick = useCallback(
    async (recommendationId: number) => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/admin/personalization/recommendations/${recommendationId}/click`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Restaurant-ID': restaurantId.toString(),
            },
            body: JSON.stringify({ user_id: userId }),
          }
        )

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        // Refresh metrics after click
        await fetchMetrics()
      } catch (err) {
        console.error('Failed to record recommendation click:', err)
      }
    },
    [userId, restaurantId, fetchMetrics]
  )

  // Set up periodic refresh every 30 minutes
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      refresh()
    }, 30 * 60 * 1000)

    return () => clearInterval(refreshInterval)
  }, [refresh])

  return {
    recommendations,
    userFeatures,
    metrics,
    loading,
    error,
    refresh,
    recordClick,
  }
}
