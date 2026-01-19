/**
 * HeroSection Component Metadata
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
import { heroConfigDefaults } from './HeroSection.defaults'

/**
 * Zod schema for HeroSection configuration validation
 */
const HeroConfigSchema = z.object({
  title_en: z.string().optional(),
  title_ar: z.string().optional(),
  subtitle_en: z.string().optional(),
  subtitle_ar: z.string().optional(),
  description_en: z.string().optional(),
  description_ar: z.string().optional(),
  background_image_url: z.string().url().optional().or(z.literal('')),
  height: z.enum(['small', 'medium', 'large', 'full']).default('medium'),
  overlay_opacity: z.number().min(0).max(1).default(0.5),
  text_alignment: z.enum(['left', 'center', 'right']).default('center'),
  cta_button_text: z.string().optional(),
  cta_button_url: z.string().url().optional().or(z.literal('#')),
})

/**
 * HeroSection Metadata
 *
 * Defines how this component appears in the ComponentLibrary,
 * what settings it supports, and which themes/industries it's suitable for.
 */
export const HeroSectionMetadata: ComponentMetadata = {
  // Identification
  id: 'hero-section',
  name: 'Hero Section',
  type: ComponentType.HERO,
  version: '1.0.0',

  // Classification
  category: ComponentCategory.MARKETING,
  tags: ['hero', 'banner', 'landing', 'marketing', 'header-section', 'cta'],
  industries: [
    IndustryType.GENERIC,
    IndustryType.RESTAURANT,
    IndustryType.RETAIL,
    IndustryType.CAFE,
    IndustryType.SERVICES,
    IndustryType.PORTFOLIO,
  ],

  // UI Metadata
  icon: '🎯',
  description: 'Full-width hero banner with background image, overlay, headline, and CTA button',
  thumbnail: './preview.png',

  // Component Behavior
  isDraggable: true,
  isEditable: true,
  isReorderable: true,
  isSingleton: false,
  isRequired: false,

  // Configuration
  editorComponent: 'HeroEditor',
  defaultConfig: heroConfigDefaults,
  configSchema: {
    type: 'zod',
    schema: HeroConfigSchema,
  },

  // Performance
  estimatedSize: 'medium',
  lazyLoadable: true,

  // Documentation
  documentation: `
# Hero Section

A full-width hero banner perfect for landing pages and section headers.

## Features
- Background image with adjustable overlay
- Bilingual support (English/Arabic)
- Customizable CTA button
- Responsive design
- Multiple height options
- RTL support

## Best Practices
- Use high-quality images (1920x1080 or larger)
- Keep headlines short and impactful (5-8 words)
- Ensure text is readable against background
- Test on mobile devices

## Settings
- **Title**: Main headline (supports EN/AR)
- **Subtitle**: Secondary headline (supports EN/AR)
- **Description**: Body text (supports EN/AR)
- **Background Image**: URL to background image
- **Height**: Hero section height (small/medium/large/full)
- **Overlay Opacity**: Darkness of overlay (0-1)
- **Text Alignment**: How to align text (left/center/right)
- **CTA Button**: Call-to-action button text and URL
  `,

  examples: [
    {
      name: 'Restaurant Hero',
      description: 'Warm, inviting hero for restaurant landing',
      config: {
        title_en: 'Welcome to Our Restaurant',
        title_ar: 'مرحبا بكم في مطعمنا',
        subtitle_en: 'Experience authentic flavors',
        subtitle_ar: 'جرب النكهات الأصيلة',
        description_en: 'Come join us for an unforgettable dining experience',
        description_ar: 'انضم إلينا لتجربة طعام لا تنسى',
        background_image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
        height: 'large',
        overlay_opacity: 0.4,
        text_alignment: 'center',
        cta_button_text: 'View Menu',
        cta_button_url: '/menu',
      },
    },
    {
      name: 'Retail Landing',
      description: 'Modern retail store hero',
      config: {
        title_en: 'Summer Collection 2024',
        title_ar: 'مجموعة الصيف 2024',
        subtitle_en: 'Discover latest trends',
        subtitle_ar: 'اكتشف أحدث الاتجاهات',
        background_image_url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f',
        height: 'large',
        overlay_opacity: 0.3,
        text_alignment: 'right',
        cta_button_text: 'Shop Now',
        cta_button_url: '/shop',
      },
    },
  ],
}

export default HeroSectionMetadata
