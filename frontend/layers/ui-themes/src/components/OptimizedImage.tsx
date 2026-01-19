import React, { useEffect, useRef, useState, useMemo } from 'react'
import { useAssetUrl } from '../hooks/useAssetUrl'

export interface OptimizedImageProps {
  assetId: number
  alt: string
  width?: number
  height?: number
  className?: string
  style?: React.CSSProperties
  lazy?: boolean
  placeholder?: 'blur' | 'empty' | 'color'
  placeholderColor?: string
  priority?: boolean
  onLoad?: (img: HTMLImageElement) => void
  onError?: (error: Error) => void
  sizes?: string
  quality?: number
  formats?: ('webp' | 'avif' | 'jpeg' | 'png')[]
  fit?: 'contain' | 'cover' | 'fill' | 'scale-down'
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  assetId,
  alt,
  width,
  height,
  className = '',
  style = {},
  lazy = true,
  placeholder = 'blur',
  placeholderColor = '#f0f0f0',
  priority = false,
  onLoad,
  onError,
  sizes = '100vw',
  quality = 85,
  formats = ['webp', 'avif', 'jpeg'],
  fit = 'cover',
}) => {
  const [isLoaded, setIsLoaded] = useState(!lazy)
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Get CDN URLs for different formats
  const { assetUrl, isLoading } = useAssetUrl(assetId, { formats, quality })

  // Track lazy loading state
  const [isInView, setIsInView] = useState(!lazy)

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || priority || !containerRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        rootMargin: '50px',
      }
    )

    observer.observe(containerRef.current)

    return () => {
      observer.disconnect()
    }
  }, [lazy, priority])

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true)
    if (imgRef.current && onLoad) {
      onLoad(imgRef.current)
    }
  }

  // Handle image error
  const handleError = () => {
    setHasError(true)
    if (onError) {
      onError(new Error(`Failed to load image: ${alt}`))
    }
  }

  // Generate srcset for responsive images
  const srcSet = useMemo(() => {
    if (!assetUrl) return ''

    const baseUrl = assetUrl.split('?')[0]
    const widths = [320, 640, 960, 1280, 1920]
    const queryParams = new URLSearchParams(assetUrl.split('?')[1] || '')

    return widths
      .map((w) => {
        const params = new URLSearchParams(queryParams)
        params.set('w', w.toString())
        return `${baseUrl}?${params.toString()} ${w}w`
      })
      .join(', ')
  }, [assetUrl])

  // Aspect ratio padding for placeholder
  const aspectRatio = width && height ? (height / width) * 100 : 0

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    ...style,
  }

  const placeholderStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: placeholderColor,
    opacity: isLoaded ? 0 : 1,
    transition: 'opacity 0.3s ease-in-out',
    zIndex: 0,
  }

  const blurPlaceholderStyle: React.CSSProperties = {
    ...placeholderStyle,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width || 100} ${height || 100}'%3E%3Cfilter id='b'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' fill='${placeholderColor.replace('#', '%23')}'/%3E%3C/filter%3E%3C/svg%3E")`,
    backgroundSize: 'cover',
  }

  const imageStyle: React.CSSProperties = {
    display: isLoaded ? 'block' : 'none',
    width: '100%',
    height: '100%',
    objectFit: fit as any,
    objectPosition: 'center',
    zIndex: 1,
    position: 'relative',
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={containerStyle}
      data-asset-id={assetId}
      data-loaded={isLoaded}
      data-error={hasError}
    >
      {/* Placeholder */}
      {!isLoaded && placeholder === 'blur' && <div style={blurPlaceholderStyle} />}
      {!isLoaded && placeholder === 'color' && <div style={placeholderStyle} />}

      {/* Aspect ratio preserver */}
      {aspectRatio > 0 && !width && !height && (
        <div
          style={{
            width: '100%',
            paddingBottom: `${aspectRatio}%`,
          }}
        />
      )}

      {/* Image */}
      {(isInView || !lazy) && assetUrl && !hasError && (
        <picture>
          {formats.includes('avif') && (
            <source
              type="image/avif"
              srcSet={srcSet.replace(/webp/g, 'avif')}
              sizes={sizes}
            />
          )}
          {formats.includes('webp') && (
            <source
              type="image/webp"
              srcSet={srcSet.replace(/jpeg/g, 'webp')}
              sizes={sizes}
            />
          )}
          <img
            ref={imgRef}
            src={assetUrl}
            srcSet={srcSet}
            sizes={sizes}
            alt={alt}
            width={width}
            height={height}
            style={imageStyle}
            onLoad={handleLoad}
            onError={handleError}
            loading={lazy && !priority ? 'lazy' : 'eager'}
            decoding="async"
          />
        </picture>
      )}

      {/* Error state */}
      {hasError && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f0f0f0',
            color: '#999',
            fontSize: '14px',
            textAlign: 'center',
            padding: '16px',
            zIndex: 1,
          }}
        >
          <span>Failed to load image</span>
        </div>
      )}

      {/* Loading indicator (optional) */}
      {!isLoaded && isLoading && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 2,
          }}
        >
          <div
            style={{
              width: '24px',
              height: '24px',
              border: '2px solid #f0f0f0',
              borderTop: '2px solid #999',
              borderRadius: '50%',
              animation: 'spin 0.6s linear infinite',
            }}
          />
          <style>
            {`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      )}
    </div>
  )
}

export default OptimizedImage
