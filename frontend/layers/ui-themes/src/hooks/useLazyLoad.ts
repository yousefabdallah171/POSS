import { useEffect, useRef, useState, RefObject } from 'react'

export interface UseLazyLoadOptions {
  rootMargin?: string
  threshold?: number | number[]
  priority?: boolean
  onVisible?: () => void
  onHidden?: () => void
}

export interface LazyLoadResult {
  ref: RefObject<HTMLElement>
  isVisible: boolean
  hasBeenVisible: boolean
}

/**
 * Hook for lazy loading elements using Intersection Observer
 * Tracks when elements enter/leave viewport
 */
export function useLazyLoad(options: UseLazyLoadOptions = {}): LazyLoadResult {
  const {
    rootMargin = '50px',
    threshold = 0.01,
    priority = false,
    onVisible,
    onHidden,
  } = options

  const ref = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(priority)
  const [hasBeenVisible, setHasBeenVisible] = useState(priority)

  useEffect(() => {
    if (priority || !ref.current || !('IntersectionObserver' in window)) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting)

          if (entry.isIntersecting) {
            setHasBeenVisible(true)
            if (onVisible) {
              onVisible()
            }
          } else {
            if (onHidden) {
              onHidden()
            }
          }
        })
      },
      {
        rootMargin,
        threshold,
      }
    )

    const currentRef = ref.current
    observer.observe(currentRef)

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [priority, rootMargin, threshold, onVisible, onHidden])

  return {
    ref,
    isVisible,
    hasBeenVisible,
  }
}

export default useLazyLoad
