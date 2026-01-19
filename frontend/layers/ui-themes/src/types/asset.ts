/**
 * Asset type definitions for frontend asset management and optimization
 */

export interface Asset {
  id: number
  restaurant_id: number
  component_id?: number
  theme_id?: number
  original_filename: string
  storage_key: string
  file_hash: string
  file_type: 'image' | 'video' | 'audio' | 'document' | 'file'
  mime_type: string
  original_size: number
  compressed_size: number
  width?: number
  height?: number
  cdn_url: string
  is_public: boolean
  is_deduplicated: boolean
  tags?: string[]
  metadata?: AssetMetadata
  created_at: string
  updated_at: string
}

export interface AssetMetadata {
  format?: string
  color_space?: string
  has_alpha?: boolean
  quality?: number
  compression_type?: string
  checksum?: string
}

export interface AssetUploadRequest {
  original_filename: string
  file_data: ArrayBuffer
  mime_type: string
  component_id?: number
  theme_id?: number
  is_public?: boolean
  tags?: string[]
}

export interface AssetListResponse {
  assets: Asset[]
  total: number
  limit: number
  offset: number
}

export interface AssetStatistics {
  total_assets: number
  total_size: number
  compressed_size: number
  duplicate_count: number
  compression_ratio: number
  by_type: Record<string, number>
  by_mime_type: Record<string, number>
  storage_savings: number
}

export interface ImageTransformOptions {
  width?: number
  height?: number
  fit?: 'contain' | 'cover' | 'fill' | 'scale-down'
  quality?: number
  format?: 'webp' | 'avif' | 'jpeg' | 'png'
  gravity?: 'auto' | 'face' | 'center'
  background?: string
}

export interface ResponsiveImageSize {
  width: number
  descriptor: string
}

export interface ResponsiveImageSrcSet {
  srcSet: string
  sizes: string
}

/**
 * Image optimization profiles for common use cases
 */
export const IMAGE_PROFILES = {
  thumbnail: {
    width: 150,
    height: 150,
    fit: 'cover' as const,
    quality: 80,
  },
  card: {
    width: 300,
    height: 200,
    fit: 'cover' as const,
    quality: 85,
  },
  hero: {
    width: 1920,
    height: 1080,
    fit: 'cover' as const,
    quality: 90,
  },
  fullwidth: {
    width: 1200,
    height: 600,
    fit: 'cover' as const,
    quality: 85,
  },
  small: {
    width: 256,
    height: 256,
    fit: 'contain' as const,
    quality: 80,
  },
  medium: {
    width: 512,
    height: 512,
    fit: 'contain' as const,
    quality: 85,
  },
  large: {
    width: 1024,
    height: 1024,
    fit: 'contain' as const,
    quality: 90,
  },
}

/**
 * Standard responsive breakpoints for srcset generation
 */
export const RESPONSIVE_BREAKPOINTS = {
  mobile: [320, 480, 640],
  tablet: [768, 1024],
  desktop: [1280, 1920, 2560],
  all: [320, 480, 640, 768, 1024, 1280, 1920, 2560],
}

/**
 * Format support detection
 */
export function getFormatSupport(): {
  webp: boolean
  avif: boolean
} {
  let webpSupport = false
  let avifSupport = false

  // WebP detection
  const canvas = document.createElement('canvas')
  if (canvas.getContext?.('2d')) {
    webpSupport = canvas.toDataURL('image/webp').startsWith('data:image/webp')
  }

  // AVIF detection (requires modern browser)
  try {
    const img = document.createElement('img')
    img.src =
      'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAG1hdmlmMGlzb21pc2F1YXhpZm10eQAA'
    avifSupport = img.src.length > 0
  } catch (e) {
    avifSupport = false
  }

  return { webp: webpSupport, avif: avifSupport }
}

/**
 * Get recommended formats based on browser support
 */
export function getRecommendedFormats(): ('webp' | 'avif' | 'jpeg')[] {
  const support = getFormatSupport()
  const formats: ('webp' | 'avif' | 'jpeg')[] = []

  if (support.avif) formats.push('avif')
  if (support.webp) formats.push('webp')
  formats.push('jpeg')

  return formats
}

/**
 * Calculate aspect ratio from dimensions
 */
export function getAspectRatio(width?: number, height?: number): number | null {
  if (!width || !height) return null
  return height / width
}

/**
 * Generate responsive sizes string
 */
export function generateSizes(breakpoints?: number[]): string {
  const bp = breakpoints || RESPONSIVE_BREAKPOINTS.all
  const sizeStrings = bp
    .sort((a, b) => a - b)
    .map((width, index) => {
      if (index === bp.length - 1) {
        return `${width}px`
      }
      return `(max-width: ${width}px) ${width}px`
    })

  return sizeStrings.join(', ')
}

/**
 * Generate srcset string for responsive images
 */
export function generateSrcSet(
  baseUrl: string,
  breakpoints?: number[],
  format?: string
): string {
  const bp = breakpoints || RESPONSIVE_BREAKPOINTS.all
  const params = new URLSearchParams(new URL(baseUrl, window.location.origin).search)

  return bp
    .sort((a, b) => a - b)
    .map((width) => {
      const url = new URL(baseUrl, window.location.origin)
      const searchParams = new URLSearchParams(params)
      searchParams.set('w', width.toString())
      if (format) {
        searchParams.set('format', format)
      }
      url.search = searchParams.toString()
      return `${url.toString()} ${width}w`
    })
    .join(', ')
}

/**
 * Preload image for faster rendering
 */
export function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = url
    link.onload = () => resolve()
    link.onerror = () => reject(new Error(`Failed to preload: ${url}`))
    document.head.appendChild(link)
  })
}

/**
 * Prefetch image (hint to browser to load in background)
 */
export function prefetchImage(url: string): void {
  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.as = 'image'
  link.href = url
  document.head.appendChild(link)
}

/**
 * Preload images in bulk
 */
export async function preloadImages(urls: string[]): Promise<void> {
  await Promise.all(urls.map((url) => preloadImage(url).catch(() => {})))
}

/**
 * Get image load time (for performance monitoring)
 */
export async function measureImageLoadTime(url: string): Promise<number> {
  const start = performance.now()

  return new Promise((resolve, reject) => {
    const img = document.createElement('img')
    img.onload = () => {
      const end = performance.now()
      resolve(end - start)
    }
    img.onerror = () => {
      reject(new Error(`Failed to load: ${url}`))
    }
    img.src = url
  })
}
