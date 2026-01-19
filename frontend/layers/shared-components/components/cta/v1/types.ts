/**
 * CTA Section Component Props
 */
export interface CTAProps {
  title_en?: string
  title_ar?: string
  description_en?: string
  description_ar?: string
  isArabic?: boolean
  config?: {
    button_text_en?: string
    button_text_ar?: string
    button_url?: string
    background_color?: string
  }
}

/**
 * CTA Configuration
 */
export interface CTAConfig {
  button_text_en?: string
  button_text_ar?: string
  button_url?: string
  background_color?: string
}
