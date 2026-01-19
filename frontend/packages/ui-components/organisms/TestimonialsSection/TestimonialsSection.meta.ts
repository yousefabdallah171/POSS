/**
 * TestimonialsSection Component Metadata
 */

import { z } from 'zod'
import {
  ComponentMetadata,
  ComponentType,
  ComponentCategory,
  IndustryType,
} from '../../registry/registry-types'

const TestimonialsConfigSchema = z.object({
  title_en: z.string().optional(),
  title_ar: z.string().optional(),
  layout: z.enum(['grid', 'carousel']).default('grid'),
})

export const TestimonialsSectionMetadata: ComponentMetadata = {
  id: 'testimonials-section',
  name: 'Testimonials Section',
  type: ComponentType.TESTIMONIALS,
  version: '1.0.0',

  category: ComponentCategory.CONTENT,
  tags: ['testimonials', 'reviews', 'feedback', 'social-proof'],
  industries: [
    IndustryType.GENERIC,
    IndustryType.RESTAURANT,
    IndustryType.RETAIL,
    IndustryType.SERVICES,
  ],

  icon: '⭐',
  description: 'Showcase customer testimonials and reviews with star ratings',
  thumbnail: './preview.png',

  isDraggable: true,
  isEditable: true,
  isReorderable: true,
  isSingleton: false,
  isRequired: false,

  editorComponent: 'TestimonialsEditor',
  defaultConfig: {
    title_en: 'What Our Customers Say',
    title_ar: 'ما يقوله عملاؤنا',
    layout: 'grid',
  },
  configSchema: {
    type: 'zod',
    schema: TestimonialsConfigSchema,
  },

  estimatedSize: 'medium',
  lazyLoadable: true,

  documentation: `
# Testimonials Section

Display customer testimonials and reviews with star ratings to build trust and social proof.

## Features
- Grid or carousel layout
- 5-star rating display
- Customer quotes and attribution
- Bilingual support (English/Arabic)
- Responsive design
- RTL support

## Best Practices
- Use real customer quotes
- Include customer names and titles
- Display 3-5 testimonials for best impact
- Use genuine star ratings
- Include profile images when possible

## Settings
- **Title**: Section heading (supports EN/AR)
- **Layout**: Grid or carousel view
  `,

  examples: [
    {
      name: 'Restaurant Reviews',
      description: 'Customer testimonials for a restaurant',
      config: {
        title_en: 'Customer Reviews',
        title_ar: 'تقييمات العملاء',
        layout: 'grid',
      },
    },
  ],
}

export default TestimonialsSectionMetadata
