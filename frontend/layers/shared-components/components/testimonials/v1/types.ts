/**
 * Testimonials Section Component Props
 */
export interface TestimonialsProps {
  title_en?: string
  title_ar?: string
  isArabic?: boolean
  config?: {
    layout?: 'carousel' | 'grid'
    items?: TestimonialItem[]
  }
}

/**
 * Testimonial Item
 */
export interface TestimonialItem {
  author: string
  content_en: string
  content_ar: string
  rating: number
}

/**
 * Testimonials Configuration
 */
export interface TestimonialsConfig {
  layout?: 'carousel' | 'grid'
  items?: TestimonialItem[]
}
