/**
 * Why Us Section Component Props
 */
export interface WhyUsProps {
  title_en?: string
  title_ar?: string
  description_en?: string
  description_ar?: string
  isArabic?: boolean
  config?: {
    layout?: 'grid' | 'flex'
    columns?: number
    items?: WhyUsItem[]
  }
}

/**
 * Why Us Item
 */
export interface WhyUsItem {
  title_en: string
  title_ar: string
  description_en: string
  description_ar: string
  icon?: string
}

/**
 * Why Us Configuration
 */
export interface WhyUsConfig {
  layout?: 'grid' | 'flex'
  columns?: number
  items?: WhyUsItem[]
}
