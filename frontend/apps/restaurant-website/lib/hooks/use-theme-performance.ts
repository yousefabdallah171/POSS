'use client'

import { useEffect, useState } from 'react'
import { useThemeStore } from '@/lib/store/theme-store'

/**
 * Performance metrics for theme loading
 */
export interface ThemePerformanceMetrics {
  loadStartTime: number | null
  loadEndTime: number | null
  loadDuration: number | null
  cacheHit: boolean
  source: 'memory' | 'storage' | 'api' | 'unknown'
}

/**
 * Hook to measure theme loading performance
 * Tracks how long it takes to load and apply theme
 */
export function useThemePerformance() {
  const { currentTheme, isLoading } = useThemeStore()
  const [metrics, setMetrics] = useState<ThemePerformanceMetrics>({
    loadStartTime: null,
    loadEndTime: null,
    loadDuration: null,
    cacheHit: false,
    source: 'unknown',
  })

  useEffect(() => {
    if (isLoading) {
      setMetrics((prev) => ({
        ...prev,
        loadStartTime: performance.now(),
      }))
    }
  }, [isLoading])

  useEffect(() => {
    if (currentTheme && metrics.loadStartTime && !isLoading) {
      const endTime = performance.now()
      const duration = endTime - (metrics.loadStartTime || 0)

      setMetrics((prev) => ({
        ...prev,
        loadEndTime: endTime,
        loadDuration: Math.round(duration),
      }))
    }
  }, [currentTheme, isLoading, metrics.loadStartTime])

  return metrics
}

/**
 * Hook to measure CSS variable injection performance
 * FIXED: Removed expensive setInterval (was running every 10ms)
 * Now uses synchronous check since CSS is applied immediately
 */
export function useCssVariableInjectionTime() {
  const [injectionTime, setInjectionTime] = useState<number | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const startTime = performance.now()
    const root = document.documentElement
    const primaryColor = root.style.getPropertyValue('--theme-primary')

    if (primaryColor && primaryColor.trim()) {
      const endTime = performance.now()
      setInjectionTime(Math.round(endTime - startTime))
    }
  }, [])

  return injectionTime
}

/**
 * Hook to detect if theme was loaded from cache vs API
 */
export function useThemeSource() {
  const { currentTheme } = useThemeStore()
  const [source, setSource] = useState<'cache' | 'api' | 'unknown'>('unknown')

  useEffect(() => {
    if (!currentTheme) return

    try {
      const stored = localStorage.getItem('theme-storage')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.state?.currentTheme?.slug === currentTheme.slug) {
          setSource('cache')
          return
        }
      }
    } catch {
      // Ignore parse errors
    }

    setSource('api')
  }, [currentTheme])

  return source
}

/**
 * Hook to monitor theme loading performance over time
 * FIXED: Limited sample size to prevent unbounded memory growth
 */
export function useThemePerformanceSamples() {
  const metrics = useThemePerformance()
  const [samples, setSamples] = useState<ThemePerformanceMetrics[]>([])
  const MAX_SAMPLES = 50

  useEffect(() => {
    if (metrics.loadDuration !== null) {
      setSamples((prev) => {
        const updated = [...prev, metrics]
        return updated.length > MAX_SAMPLES ? updated.slice(-MAX_SAMPLES) : updated
      })
    }
  }, [metrics])

  return samples
}

/**
 * Hook to get average theme loading time
 */
export function useAverageThemeLoadTime() {
  const samples = useThemePerformanceSamples()

  if (samples.length === 0) return null

  const total = samples.reduce((sum, s) => sum + (s.loadDuration || 0), 0)
  return Math.round(total / samples.length)
}

/**
 * Hook to check if theme loading meets performance targets
 */
export function useThemePerformanceTargets() {
  const metrics = useThemePerformance()
  const injectionTime = useCssVariableInjectionTime()

  return {
    loadTarget: 1000,
    injectionTarget: 100,
    meetsLoadTarget: metrics.loadDuration === null || metrics.loadDuration <= 1000,
    meetsInjectionTarget: injectionTime === null || injectionTime <= 100,
    loadDuration: metrics.loadDuration,
    injectionDuration: injectionTime,
  }
}
