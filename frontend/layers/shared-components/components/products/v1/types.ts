/**
 * Products Section Component Props
 */
export interface ProductsProps {
  title_en?: string
  title_ar?: string
  description_en?: string
  description_ar?: string
  isArabic?: boolean
  config?: {
    layout?: 'grid' | 'list'
    columns?: number
    show_prices?: boolean
    show_images?: boolean
    items?: ProductItem[]
  }
}

/**
 * Product Item
 */
export interface ProductItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
}

/**
 * Products Configuration
 */
export interface ProductsConfig {
  layout?: 'grid' | 'list'
  columns?: number
  show_prices?: boolean
  show_images?: boolean
  items?: ProductItem[]
}
