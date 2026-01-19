'use client'

import { useEffect } from 'react'
import { reportWebVitals } from '@/lib/monitoring'

/**
 * WebVitalsProvider Component
 * Initializes Web Vitals reporting on app start
 * Reports Core Web Vitals metrics to console and analytics
 */
export function WebVitalsProvider() {
  useEffect(() => {
    // Start reporting Web Vitals asynchronously
    reportWebVitals().catch((error) => {
      console.error('Web Vitals reporting error:', error)
    })
  }, [])

  return null
}
