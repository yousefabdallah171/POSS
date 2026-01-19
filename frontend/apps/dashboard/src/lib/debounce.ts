/**
 * Debounce Utility
 * Delays function execution until specified time has passed without new calls
 * Useful for search inputs, filter changes, and API calls
 */

/**
 * Create a debounced version of a function
 * @param func - Function to debounce
 * @param delayMs - Delay in milliseconds (default: 500ms)
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delayMs: number = 500
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null

  return function debounced(...args: Parameters<T>) {
    // Clear previous timeout
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    // Set new timeout
    timeoutId = setTimeout(() => {
      func(...args)
      timeoutId = null
    }, delayMs)
  }
}

/**
 * React Hook for debounced values
 * Usage:
 * const debouncedSearchText = useDebounce(searchText, 500)
 */
export function useDebounce<T>(value: T, delayMs: number = 500): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value)

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delayMs)

    return () => clearTimeout(handler)
  }, [value, delayMs])

  return debouncedValue
}

/**
 * Advanced debounce with options
 */
interface DebounceOptions {
  delayMs?: number
  leading?: boolean // Execute on leading edge
  trailing?: boolean // Execute on trailing edge
  maxWait?: number // Maximum time to wait before forcing execution
}

export function advancedDebounce<T extends (...args: any[]) => any>(
  func: T,
  options: DebounceOptions = {}
): (...args: Parameters<T>) => void {
  const {
    delayMs = 500,
    leading = false,
    trailing = true,
    maxWait,
  } = options

  let timeoutId: NodeJS.Timeout | null = null
  let maxTimeoutId: NodeJS.Timeout | null = null
  let lastCallTime: number | null = null
  let lastExecutionTime: number | null = null

  return function debounced(...args: Parameters<T>) {
    const now = Date.now()
    const isLeadingCall = leading && lastCallTime === null

    lastCallTime = now

    // Execute on leading edge
    if (isLeadingCall) {
      func(...args)
      lastExecutionTime = now
    }

    // Clear previous timeout
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    // Set trailing execution
    if (trailing) {
      timeoutId = setTimeout(() => {
        func(...args)
        lastExecutionTime = now
        timeoutId = null
      }, delayMs)
    }

    // Handle maxWait
    if (maxWait && maxTimeoutId === null && lastExecutionTime !== null) {
      const timeSinceLastExecution = now - lastExecutionTime
      if (timeSinceLastExecution < maxWait) {
        const remainingWait = maxWait - timeSinceLastExecution
        maxTimeoutId = setTimeout(() => {
          if (timeoutId) clearTimeout(timeoutId)
          func(...args)
          lastExecutionTime = now
          maxTimeoutId = null
        }, remainingWait)
      }
    }
  }
}

// Need to import React for the hook
import React from 'react'
