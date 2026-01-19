/**
 * ProductsSection Component Metadata
 *
 * Metadata for auto-discovery and drag-drop registration.
 * This file is scanned at build time to populate the component registry.
 */

import { z } from 'zod'
import {
  ComponentMetadata,
  ComponentType,
  ComponentCategory,
  IndustryType,
} from '../../registry/registry-types'

/**
 * Zod schema for ProductsSection configuration validation
 */
const ProductsConfigSchema = z.object({
  title_en: z.string().optional(),
  title_ar: z.string().optional(),
  description_en: z.string().optional(),
  description_ar: z.string().optional(),
  layout: z.enum(['grid', 'list']).default('grid'),
  columns: z.number().min(1).max(4).default(3),
  show_prices: z.boolean().default(true),
  show_images: z.boolean().default(true),
})

/**
 * ProductsSection Metadata
 */
export const ProductsSectionMetadata: ComponentMetadata = {
  // Identification
  id: 'products-section',
  name: 'Products Section',
  type: ComponentType.PRODUCTS,
  version: '1.0.0',

  // Classification
  category: ComponentCategory.COMMERCE,
  tags: ['products', 'grid', 'ecommerce', 'items', 'menu'],
  industries: [
    IndustryType.GENERIC,
    IndustryType.RESTAURANT,
    IndustryType.RETAIL,
    IndustryType.CAFE,
    IndustryType.ECOMMERCE,
  ],

  // UI Metadata
  icon: '🛍️',
  description: 'Display products or menu items in a responsive grid or list layout',
  thumbnail: './preview.png',

  // Component Behavior
  isDraggable: true,
  isEditable: true,
  isReorderable: true,
  isSingleton: false,
  isRequired: false,

  // Configuration
  editorComponent: 'ProductsEditor',
  defaultConfig: {
    title_en: 'Our Products',
    title_ar: 'منتجاتنا',
    description_en: 'Browse our selection',
    description_ar: 'تصفح تشكيلتنا',
    layout: 'grid',
    columns: 3,
    show_prices: true,
    show_images: true,
  },
  configSchema: {
    type: 'zod',
    schema: ProductsConfigSchema,
  },

  // Performance
  estimatedSize: 'large',
  lazyLoadable: true,

  // Documentation
  documentation: `
# Products Section

Display your products, menu items, or services in a responsive grid or list layout.

## Features
- Grid or list layout options
- Configurable number of columns (1-4)
- Price and image display toggles
- Bilingual support (English/Arabic)
- Responsive design
- RTL support

## Best Practices
- Use consistent image sizes for better alignment
- Include compelling product descriptions
- Set appropriate pricing visibility
- Test layout on mobile devices

## Settings
- **Title**: Section heading (supports EN/AR)
- **Description**: Section description (supports EN/AR)
- **Layout**: Grid or list view
- **Columns**: Number of columns in grid (1-4)
- **Show Prices**: Toggle price display
- **Show Images**: Toggle image display
  `,

  examples: [
    {
      name: 'Restaurant Menu',
      description: 'Food menu with prices and images',
      config: {
        title_en: 'Our Menu',
        title_ar: 'قائمتنا',
        description_en: 'Delicious dishes prepared fresh',
        description_ar: 'أطباق لذيذة معدة طازة',
        layout: 'grid',
        columns: 3,
        show_prices: true,
        show_images: true,
      },
    },
    {
      name: 'Retail Products',
      description: 'E-commerce product catalog',
      config: {
        title_en: 'Latest Collection',
        title_ar: 'أحدث المجموعة',
        layout: 'grid',
        columns: 4,
        show_prices: true,
        show_images: true,
      },
    },
  ],
}

export default ProductsSectionMetadata
