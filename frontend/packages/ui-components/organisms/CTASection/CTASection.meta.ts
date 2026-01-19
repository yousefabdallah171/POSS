/**
 * CTASection Component Metadata
 */

import { z } from 'zod'
import {
  ComponentMetadata,
  ComponentType,
  ComponentCategory,
  IndustryType,
} from '../../registry/registry-types'

const CTAConfigSchema = z.object({
  title_en: z.string().optional(),
  title_ar: z.string().optional(),
  description_en: z.string().optional(),
  description_ar: z.string().optional(),
  button_text_en: z.string().optional(),
  button_text_ar: z.string().optional(),
  button_url: z.string().optional(),
  background_color: z.string().optional(),
})

export const CTASectionMetadata: ComponentMetadata = {
  id: 'cta-section',
  name: 'Call to Action',
  type: ComponentType.CTA,
  version: '1.0.0',

  category: ComponentCategory.MARKETING,
  tags: ['cta', 'call-to-action', 'conversion', 'button', 'action'],
  industries: [
    IndustryType.GENERIC,
    IndustryType.RESTAURANT,
    IndustryType.RETAIL,
    IndustryType.ECOMMERCE,
    IndustryType.SERVICES,
  ],

  icon: '🎯',
  description: 'Full-width conversion-focused section with customizable button and background',
  thumbnail: './preview.png',

  isDraggable: true,
  isEditable: true,
  isReorderable: true,
  isSingleton: false,
  isRequired: false,

  editorComponent: 'CTAEditor',
  defaultConfig: {
    title_en: 'Ready to Get Started?',
    title_ar: 'هل أنت مستعد للبدء؟',
    description_en: 'Take action now and enjoy our services',
    description_ar: 'اتخذ إجراء الآن واستمتع بخدماتنا',
    button_text_en: 'Get Started',
    button_text_ar: 'ابدأ الآن',
    button_url: '#',
    background_color: '#3b82f6',
  },
  configSchema: {
    type: 'zod',
    schema: CTAConfigSchema,
  },

  estimatedSize: 'small',
  lazyLoadable: true,

  documentation: `
# Call to Action Section

A conversion-focused full-width section designed to drive user actions with compelling copy and button.

## Features
- Customizable background color
- Bold headline and description
- Primary CTA button with custom URL
- Bilingual button text (English/Arabic)
- Responsive design
- RTL support
- White text for contrast

## Best Practices
- Use contrasting background color
- Keep copy short and action-oriented (3-5 words)
- Use action verbs (Order, Buy, Sign Up, Learn More)
- Make button prominent and clickable
- Test on all device sizes
- A/B test different colors for conversion

## Settings
- **Title**: Main headline (supports EN/AR)
- **Description**: Supporting copy (supports EN/AR)
- **Button Text**: Button label (supports EN/AR)
- **Button URL**: Where button links to
- **Background Color**: Section background color
  `,

  examples: [
    {
      name: 'Restaurant Order CTA',
      description: 'CTA for restaurant ordering',
      config: {
        title_en: 'Ready to Order?',
        title_ar: 'هل أنت مستعد للطلب؟',
        description_en: 'Order now and get 10% off your first meal',
        description_ar: 'اطلب الآن واحصل على خصم 10% على وجبتك الأولى',
        button_text_en: 'Order Now',
        button_text_ar: 'اطلب الآن',
        button_url: '/order',
        background_color: '#e74c3c',
      },
    },
  ],
}

export default CTASectionMetadata
