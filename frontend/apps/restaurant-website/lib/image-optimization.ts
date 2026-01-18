/**
 * Image optimization utilities for Next.js Image component
 * Provides configuration and helpers for responsive images
 */

export interface ImageConfig {
  sizes: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  priority?: boolean;
}

/**
 * Responsive image configurations for different use cases
 * Using mobile-first approach with breakpoints
 */
export const IMAGE_CONFIGS = {
  // Product images in grid (featured products, menu)
  productCard: {
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    quality: 80, // Slightly compressed for performance
    placeholder: 'empty' as const, // No blur to save bandwidth
  } as ImageConfig,

  // Header/Logo (small, usually doesn't fill container)
  logo: {
    sizes: '(max-width: 640px) 80px, 120px',
    quality: 85,
    priority: true, // Logo is above the fold
  } as ImageConfig,

  // Hero section images (large, visible)
  hero: {
    sizes: '100vw',
    quality: 85,
    priority: true, // Hero is above the fold
    placeholder: 'blur' as const, // Blur for better perceived performance
  } as ImageConfig,

  // Section images (medium size)
  section: {
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 60vw',
    quality: 82,
    placeholder: 'empty' as const,
  } as ImageConfig,

  // Thumbnail images (small previews)
  thumbnail: {
    sizes: '(max-width: 640px) 60px, 80px',
    quality: 75,
  } as ImageConfig,

  // Background images (fallback for CSS)
  background: {
    sizes: '100vw',
    quality: 70, // Lower quality acceptable for backgrounds
  } as ImageConfig,
};

/**
 * Get image configuration by type
 * Falls back to default if type not found
 */
export function getImageConfig(type: keyof typeof IMAGE_CONFIGS): ImageConfig {
  return IMAGE_CONFIGS[type] || IMAGE_CONFIGS.productCard;
}

/**
 * Optimize image URL for display
 * Removes query parameters that might conflict with Next.js Image
 */
export function optimizeImageUrl(url?: string): string {
  if (!url) return '';

  try {
    const urlObj = new URL(url);
    // Remove tracking parameters
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(param => {
      urlObj.searchParams.delete(param);
    });
    return urlObj.toString();
  } catch {
    // Return original URL if parsing fails
    return url;
  }
}

/**
 * Blur data URL for placeholder effect
 * This is a 1x1 pixel transparent SVG (very small)
 */
export const BLUR_PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1 1%22%3E%3C/svg%3E';

/**
 * Calculate responsive image dimensions
 * Helps prevent layout shift (CLS improvement)
 */
export function getResponsiveDimensions(
  originalWidth: number,
  originalHeight: number,
  containerWidth: number
) {
  const aspectRatio = originalWidth / originalHeight;
  return {
    width: containerWidth,
    height: Math.round(containerWidth / aspectRatio),
  };
}

/**
 * Image quality recommendations based on device
 * Lower quality for mobile to save bandwidth
 */
export const IMAGE_QUALITY_BY_DEVICE = {
  mobile: 75,
  tablet: 80,
  desktop: 85,
};

/**
 * Common image sizes for different screen widths
 * Helps Next.js choose optimal image size
 */
export const RESPONSIVE_IMAGE_SIZES = {
  // Small images (logos, thumbnails)
  small: '(max-width: 640px) 100px, 120px',

  // Medium images (cards, sections)
  medium: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',

  // Large images (heroes, backgrounds)
  large: '100vw',

  // Full width with max constraint
  fullWidth: '(max-width: 1536px) 100vw, 1536px',
};

/**
 * Image loading strategies for performance
 */
export const IMAGE_LOADING = {
  // Eager: Load immediately (above fold)
  eager: 'eager',

  // Lazy: Load when visible (below fold) - DEFAULT
  lazy: 'lazy',

  // Critical: Load with high priority (LCP candidate)
  critical: 'eager',
} as const;

/**
 * Common aspect ratios for images
 * Helps prevent layout shift (CLS)
 */
export const ASPECT_RATIOS = {
  square: 1,
  video: 16 / 9,
  portrait: 3 / 4,
  landscape: 4 / 3,
  golden: 1.618,
  productCard: 1, // Square for product images
};
