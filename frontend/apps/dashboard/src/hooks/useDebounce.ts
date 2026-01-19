/**
 * useDebounce Hook
 * Debounces a value with a configurable delay
 * Useful for optimizing performance on rapid state changes
 */

import { useEffect, useState } from 'react'

/**
 * Debounce a value with a specified delay
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds (default: 100ms)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number = 100): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Set up the timeout
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Clean up the timeout if the value changes before the delay expires
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Custom hook to track if a value is currently debouncing
 * Useful for showing loading indicators during debounce
 */
export function useDebouncedWithIndicator<T>(
  value: T,
  delay: number = 100
): { value: T; isDebouncing: boolean } {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  const [isDebouncing, setIsDebouncing] = useState(false)

  useEffect(() => {
    // Set debouncing flag
    setIsDebouncing(true)

    const handler = setTimeout(() => {
      setDebouncedValue(value)
      setIsDebouncing(false)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return { value: debouncedValue, isDebouncing }
}

/**
 * Callback debounce hook - debounces function calls instead of values
 * Useful for API calls or expensive operations
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 100
): T {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [timeoutId])

  return ((...args: any[]) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    const newTimeoutId = setTimeout(() => {
      callback(...args)
    }, delay)

    setTimeoutId(newTimeoutId)
  }) as T
}
