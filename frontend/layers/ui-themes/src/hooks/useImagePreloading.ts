import { useEffect, useCallback, useRef } from 'react'
import {
  preloadImage,
  prefetchImage,
  preloadImages,
  generateSrcSet,
  RESPONSIVE_BREAKPOINTS,
} from '../types/asset'

export interface UseImagePreloadingOptions {
  urls?: string[]
  breakpoints?: number[]
  priority?: boolean
  delay?: number
  onPreloadComplete?: (count: number) => void
  onPreloadError?: (error: Error) => void
}

/**
 * Hook for intelligent image preloading and prefetching
 * Manages preload queue and network conditions
 */
export function useImagePreloading(options: UseImagePreloadingOptions = {}) {
  const {
    urls = [],
    breakpoints = RESPONSIVE_BREAKPOINTS.all,
    priority = false,
    delay = 1000,
    onPreloadComplete,
    onPreloadError,
  } = options

  const preloadQueueRef = useRef<string[]>([])
  const isPreloadingRef = useRef(false)

  // Generate all variants of images for preloading
  const generateImageVariants = useCallback((baseUrl: string): string[] => {
    const variants: string[] = []

    // Add original URL
    variants.push(baseUrl)

    // Generate responsive variants
    const srcSet = generateSrcSet(baseUrl, breakpoints, 'webp')
    const srcSetEntries = srcSet.split(', ')

    srcSetEntries.forEach((entry) => {
      const [url] = entry.split(' ')
      if (url && !variants.includes(url)) {
        variants.push(url)
      }
    })

    // Generate AVIF variants
    const avifSrcSet = generateSrcSet(baseUrl, breakpoints, 'avif')
    const avifEntries = avifSrcSet.split(', ')

    avifEntries.forEach((entry) => {
      const [url] = entry.split(' ')
      if (url && !variants.includes(url)) {
        variants.push(url)
      }
    })

    return variants
  }, [breakpoints])

  // Process preload queue
  const processPreloadQueue = useCallback(async () => {
    if (isPreloadingRef.current || preloadQueueRef.current.length === 0) {
      return
    }

    isPreloadingRef.current = true

    try {
      const allVariants = preloadQueueRef.current.flatMap((url) =>
        generateImageVariants(url)
      )

      await preloadImages(allVariants)

      const count = allVariants.length
      if (onPreloadComplete) {
        onPreloadComplete(count)
      }

      preloadQueueRef.current = []
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      if (onPreloadError) {
        onPreloadError(err)
      }
    } finally {
      isPreloadingRef.current = false
    }
  }, [generateImageVariants, onPreloadComplete, onPreloadError])

  // Add URLs to preload queue
  const preload = useCallback((newUrls: string | string[]) => {
    const urlArray = Array.isArray(newUrls) ? newUrls : [newUrls]
    preloadQueueRef.current.push(...urlArray)

    if (priority) {
      processPreloadQueue()
    }
  }, [priority, processPreloadQueue])

  // Add URLs to prefetch queue (lower priority)
  const prefetch = useCallback((newUrls: string | string[]) => {
    const urlArray = Array.isArray(newUrls) ? newUrls : [newUrls]

    urlArray.forEach((url) => {
      prefetchImage(url)
    })
  }, [])

  // Clear preload queue
  const clearQueue = useCallback(() => {
    preloadQueueRef.current = []
  }, [])

  // Get current queue size
  const getQueueSize = useCallback(() => {
    return preloadQueueRef.current.length
  }, [])

  // Initialize with provided URLs
  useEffect(() => {
    if (urls.length === 0) return

    preloadQueueRef.current.push(...urls)

    const timeoutId = setTimeout(() => {
      processPreloadQueue()
    }, delay)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [urls, delay, processPreloadQueue])

  return {
    preload,
    prefetch,
    clearQueue,
    getQueueSize,
    isPreloading: isPreloadingRef.current,
  }
}

export default useImagePreloading
