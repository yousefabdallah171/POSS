import { useEffect, useState, useCallback } from 'react'
import type { Asset } from '../types/asset'

export interface UseAssetUrlOptions {
  formats?: ('webp' | 'avif' | 'jpeg' | 'png')[]
  quality?: number
  width?: number
  height?: number
  fit?: 'contain' | 'cover' | 'fill' | 'scale-down'
  apiBaseUrl?: string
  onLoad?: (asset: Asset) => void
  onError?: (error: Error) => void
}

export interface AssetUrlResult {
  assetUrl: string | null
  asset: Asset | null
  isLoading: boolean
  error: Error | null
  retry: () => Promise<void>
}

/**
 * Hook to get CDN URL for an asset with format and quality negotiation
 */
export function useAssetUrl(
  assetId: number,
  options: UseAssetUrlOptions = {}
): AssetUrlResult {
  const {
    formats = ['webp', 'avif', 'jpeg'],
    quality = 85,
    width,
    height,
    fit = 'cover',
    apiBaseUrl = process.env.REACT_APP_API_BASE_URL || '/api',
    onLoad,
    onError,
  } = options

  const [asset, setAsset] = useState<Asset | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [assetUrl, setAssetUrl] = useState<string | null>(null)

  const generateImageUrl = useCallback(
    (baseUrl: string): string => {
      const url = new URL(baseUrl, window.location.origin)
      const params = new URLSearchParams()

      // Add transformation parameters
      if (width) params.set('w', width.toString())
      if (height) params.set('h', height.toString())
      if (fit) params.set('fit', fit)
      params.set('q', quality.toString())

      // Format preference
      if (formats.length > 0) {
        params.set('format', formats[0])
      }

      // Add cache busting
      params.set('t', Date.now().toString())

      url.search = params.toString()
      return url.toString()
    },
    [width, height, fit, quality, formats]
  )

  const fetchAsset = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`${apiBaseUrl}/v1/admin/assets/${assetId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch asset: ${response.statusText}`)
      }

      const data = await response.json()
      setAsset(data)

      // Generate optimized URL with parameters
      const optimizedUrl = generateImageUrl(data.cdn_url)
      setAssetUrl(optimizedUrl)

      if (onLoad) {
        onLoad(data)
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      if (onError) {
        onError(error)
      }
    } finally {
      setIsLoading(false)
    }
  }, [assetId, apiBaseUrl, generateImageUrl, onLoad, onError])

  const retry = useCallback(async () => {
    await fetchAsset()
  }, [fetchAsset])

  // Fetch asset on mount and when ID changes
  useEffect(() => {
    if (assetId > 0) {
      fetchAsset()
    }
  }, [assetId, fetchAsset])

  return {
    assetUrl,
    asset,
    isLoading,
    error,
    retry,
  }
}

export default useAssetUrl
