import { useEffect, useRef, useState, useCallback } from 'react'
import type { SystemMetrics, Alert } from '../types/monitoring'

export interface UseMonitoringOptions {
  restaurantId: number
  apiBaseUrl: string
  reconnectInterval?: number
  maxReconnectAttempts?: number
}

export interface UseMonitoringResult {
  metrics: SystemMetrics | null
  alerts: Alert[]
  isConnected: boolean
  error: string | null
  subscribe: () => void
  unsubscribe: () => void
  dismissAlert: (alertId: string) => void
  resolveAlert: (alertId: string) => void
}

/**
 * Hook for real-time monitoring using WebSocket
 */
export function useMonitoring(options: UseMonitoringOptions): UseMonitoringResult {
  const {
    restaurantId,
    apiBaseUrl,
    reconnectInterval = 5000,
    maxReconnectAttempts = 5,
  } = options

  const [metrics, setMetrics] = useState<SystemMetrics | null>(null)
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set())
  const [resolvedAlerts, setResolvedAlerts] = useState<Set<string>>(new Set())

  const wsRef = useRef<WebSocket | null>(null)
  const reconnectCountRef = useRef(0)
  const reconnectTimeoutRef = useRef<number>()
  const subscriberIdRef = useRef<number | null>(null)

  // Convert HTTP URL to WebSocket URL
  const getWebSocketUrl = useCallback(() => {
    const httpUrl = new URL(apiBaseUrl, window.location.origin)
    const protocol = httpUrl.protocol === 'https:' ? 'wss:' : 'ws:'
    return `${protocol}//${httpUrl.host}/ws/monitoring/${restaurantId}`
  }, [apiBaseUrl, restaurantId])

  // Connect to WebSocket
  const connect = useCallback(() => {
    try {
      const wsUrl = getWebSocketUrl()
      console.log('[Monitoring] Connecting to:', wsUrl)

      const ws = new WebSocket(wsUrl)

      ws.onopen = () => {
        console.log('[Monitoring] WebSocket connected')
        setIsConnected(true)
        setError(null)
        reconnectCountRef.current = 0

        // Subscribe to metrics updates
        ws.send(
          JSON.stringify({
            action: 'subscribe',
            restaurant_id: restaurantId,
          })
        )
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)

          if (data.type === 'metrics') {
            setMetrics(data.payload)
          } else if (data.type === 'alert') {
            const alert = data.payload
            setAlerts((prev) => {
              // Check if alert already exists
              const exists = prev.some((a) => a.id === alert.id)
              if (exists) {
                // Update existing alert
                return prev.map((a) => (a.id === alert.id ? alert : a))
              }
              // Add new alert
              return [alert, ...prev]
            })
          }
        } catch (err) {
          console.error('[Monitoring] Failed to parse message:', err)
        }
      }

      ws.onerror = (event) => {
        console.error('[Monitoring] WebSocket error:', event)
        setError('Connection error')
        setIsConnected(false)
      }

      ws.onclose = () => {
        console.log('[Monitoring] WebSocket closed')
        setIsConnected(false)
        wsRef.current = null

        // Attempt to reconnect
        if (reconnectCountRef.current < maxReconnectAttempts) {
          reconnectCountRef.current++
          reconnectTimeoutRef.current = window.setTimeout(() => {
            console.log('[Monitoring] Attempting to reconnect...')
            connect()
          }, reconnectInterval)
        } else {
          setError('Failed to connect after multiple attempts')
        }
      }

      wsRef.current = ws
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err)
      console.error('[Monitoring] Connection failed:', errMsg)
      setError(errMsg)
      setIsConnected(false)
    }
  }, [restaurantId, getWebSocketUrl, reconnectInterval, maxReconnectAttempts])

  // Subscribe to updates
  const subscribe = useCallback(() => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      connect()
    }
  }, [connect])

  // Unsubscribe from updates
  const unsubscribe = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.send(
        JSON.stringify({
          action: 'unsubscribe',
          restaurant_id: restaurantId,
        })
      )
      wsRef.current.close()
      wsRef.current = null
    }
  }, [restaurantId])

  // Dismiss alert
  const dismissAlert = useCallback((alertId: string) => {
    setDismissedAlerts((prev) => new Set([...prev, alertId]))
    setAlerts((prev) => prev.filter((a) => a.id !== alertId))
  }, [])

  // Resolve alert
  const resolveAlert = useCallback((alertId: string) => {
    setResolvedAlerts((prev) => new Set([...prev, alertId]))
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? { ...a, resolved: true, resolved_at: new Date().toISOString() }
          : a
      )
    )

    // Notify server of resolution
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          action: 'resolve_alert',
          alert_id: alertId,
        })
      )
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      unsubscribe()
    }
  }, [unsubscribe])

  // Filter out dismissed and resolved alerts
  const activeAlerts = alerts.filter(
    (a) => !dismissedAlerts.has(a.id) && !resolvedAlerts.has(a.id)
  )

  return {
    metrics,
    alerts: activeAlerts,
    isConnected,
    error,
    subscribe,
    unsubscribe,
    dismissAlert,
    resolveAlert,
  }
}

export default useMonitoring
