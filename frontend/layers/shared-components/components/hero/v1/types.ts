/**
 * Hero Section Component Props
 */
export interface HeroProps {
  title_en?: string
  title_ar?: string
  subtitle_en?: string
  subtitle_ar?: string
  description_en?: string
  description_ar?: string
  background_image_url?: string
  isArabic?: boolean
  config?: {
    cta_button_text?: string
    cta_button_url?: string
    height?: 'small' | 'medium' | 'large' | string
    overlay_opacity?: number
    text_alignment?: 'left' | 'center' | 'right'
  }
}

/**
 * Hero Section Component Configuration
 */
export interface HeroConfig {
  cta_button_text?: string
  cta_button_url?: string
  height?: string
  overlay_opacity?: number
  text_alignment?: string
}

/**
 * Hero Section Mock Data
 */
export interface HeroMockData {
  title_en: string
  title_ar: string
  subtitle_en: string
  subtitle_ar: string
  description_en: string
  description_ar: string
  background_image_url: string
}
