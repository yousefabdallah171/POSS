/**
 * Contact Section Component Props
 */
export interface ContactProps {
  title_en?: string
  title_ar?: string
  phone?: string
  email?: string
  address_en?: string
  address_ar?: string
  isArabic?: boolean
  config?: {
    show_form?: boolean
    show_map?: boolean
  }
}

/**
 * Contact Configuration
 */
export interface ContactConfig {
  show_form?: boolean
  show_map?: boolean
}
