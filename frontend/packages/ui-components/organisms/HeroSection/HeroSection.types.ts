/**
 * HeroSection Type Definitions
 */

/**
 * Hero section configuration
 */
export interface HeroConfig {
  height?: string | 'small' | 'medium' | 'large' | 'full'
  overlay_opacity?: number
  text_alignment?: 'left' | 'center' | 'right'
  cta_button_text?: string
  cta_button_url?: string
}

/**
 * Hero section component props
 */
export interface HeroSectionProps {
  title_en?: string
  title_ar?: string
  subtitle_en?: string
  subtitle_ar?: string
  description_en?: string
  description_ar?: string
  background_image_url?: string
  config?: HeroConfig
  isArabic?: boolean
}
