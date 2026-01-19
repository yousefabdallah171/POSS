/**
 * WhyUsSection Component Metadata
 */

import { z } from 'zod'
import {
  ComponentMetadata,
  ComponentType,
  ComponentCategory,
  IndustryType,
} from '../../registry/registry-types'

const WhyUsConfigSchema = z.object({
  title_en: z.string().optional(),
  title_ar: z.string().optional(),
  description_en: z.string().optional(),
  description_ar: z.string().optional(),
  layout: z.enum(['grid', 'flex']).default('grid'),
  columns: z.number().min(1).max(4).default(3),
})

export const WhyUsSectionMetadata: ComponentMetadata = {
  id: 'why-us-section',
  name: 'Why Us Section',
  type: ComponentType.WHY_US,
  version: '1.0.0',

  category: ComponentCategory.CONTENT,
  tags: ['why-us', 'features', 'benefits', 'advantages', 'value-prop'],
  industries: [
    IndustryType.GENERIC,
    IndustryType.RESTAURANT,
    IndustryType.RETAIL,
    IndustryType.SERVICES,
    IndustryType.CAFE,
  ],

  icon: '✨',
  description: 'Showcase key features or reasons why customers should choose you',
  thumbnail: './preview.png',

  isDraggable: true,
  isEditable: true,
  isReorderable: true,
  isSingleton: false,
  isRequired: false,

  editorComponent: 'WhyChooseUsEditor',
  defaultConfig: {
    title_en: 'Why Choose Us',
    title_ar: 'لماذا اختيارنا',
    description_en: 'Discover what makes us special',
    description_ar: 'اكتشف ما يجعلنا مميزين',
    layout: 'grid',
    columns: 3,
  },
  configSchema: {
    type: 'zod',
    schema: WhyUsConfigSchema,
  },

  estimatedSize: 'medium',
  lazyLoadable: true,

  documentation: `
# Why Us Section

Showcase your key features, benefits, or reasons why customers should choose your business.

## Features
- Grid or flex layout options
- Configurable number of feature items (1-4)
- Icon emoji support
- Feature title and description
- Hover effects on feature cards
- Bilingual support (English/Arabic)
- Responsive grid system
- RTL support

## Best Practices
- Keep feature descriptions concise (1-2 sentences)
- Use relevant icons or emojis
- Highlight key differentiators
- Limit to 3-5 key features for clarity
- Test layout on mobile devices
- Focus on customer benefits, not just features

## Settings
- **Title**: Section heading (supports EN/AR)
- **Description**: Section description (supports EN/AR)
- **Layout**: Grid or flex view
- **Columns**: Number of columns in grid (1-4)
  `,

  examples: [
    {
      name: 'Restaurant Features',
      description: 'Key features of a restaurant',
      config: {
        title_en: 'Why Choose Our Restaurant',
        title_ar: 'لماذا اختيار مطعمنا',
        description_en: 'We offer the best in every way',
        description_ar: 'نحن نقدم الأفضل في كل شيء',
        layout: 'grid',
        columns: 3,
      },
    },
  ],
}

export default WhyUsSectionMetadata
