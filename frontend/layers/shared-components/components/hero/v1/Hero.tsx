'use client'

import React from 'react'
import { ChevronRight } from 'lucide-react'
import type { HeroProps } from './types'
import { mockData } from './mockData'

/**
 * Hero: Main hero banner component for websites
 *
 * Displays a full-width hero section with:
 * - Background image support
 * - Title, subtitle, and description
 * - Call-to-action button
 * - Configurable overlay opacity and text alignment
 * - RTL support for Arabic
 */
export const Hero: React.FC<HeroProps> = ({
  title_en = '',
  title_ar = '',
  subtitle_en = '',
  subtitle_ar = '',
  description_en = '',
  description_ar = '',
  background_image_url,
  config = {},
  isArabic = false,
}) => {
  // Use provided values or fallback to mock data
  const title = isArabic ? (title_ar || mockData.title_ar) : (title_en || mockData.title_en)
  const subtitle = isArabic ? (subtitle_ar || mockData.subtitle_ar) : (subtitle_en || mockData.subtitle_en)
  const description = isArabic ? (description_ar || mockData.description_ar) : (description_en || mockData.description_en)
  const bgImage = background_image_url || mockData.background_image_url || ''

  const ctaText = config.cta_button_text || (isArabic ? 'اطلب الآن' : 'Learn More')
  const ctaUrl = config.cta_button_url || '#'
  const height = config.height === 'large' ? '600px' : config.height === 'medium' ? '500px' : config.height === 'small' ? '400px' : (config.height || '500px')
  const overlayOpacity = config.overlay_opacity !== undefined ? config.overlay_opacity : 0.3
  const textAlignment = config.text_alignment || 'center'

  return (
    <section
      className="relative w-full overflow-hidden flex items-center justify-center"
      style={{
        height,
        backgroundImage: bgImage ? `url(${bgImage})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        direction: isArabic ? 'rtl' : 'ltr',
      }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity }}
      />

      {/* Content */}
      <div
        className="relative z-10 max-w-4xl mx-auto px-6 w-full"
        style={{
          textAlign: textAlignment as any,
        }}
      >
        {title && (
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            {title}
          </h1>
        )}

        {subtitle && (
          <p className="text-xl md:text-2xl text-gray-200 mb-6">
            {subtitle}
          </p>
        )}

        {description && (
          <p className="text-lg text-gray-300 mb-8 max-w-2xl" style={{ marginLeft: textAlignment === 'center' ? 'auto' : '0', marginRight: textAlignment === 'center' ? 'auto' : '0' }}>
            {description}
          </p>
        )}

        {ctaText && (
          <a
            href={ctaUrl}
            className="btn-primary inline-flex items-center gap-2 text-lg"
          >
            {ctaText}
            <ChevronRight className="h-5 w-5" />
          </a>
        )}
      </div>
    </section>
  )
}

export default Hero

// Component Definition for Registry
import { ComponentDefinition } from '../../registry/types'
import { manifest } from './manifest.json'

export const definition: ComponentDefinition = {
  id: 'hero',
  name: 'Hero Section',
  version: '1.0.0',
  component: Hero,
  mockData,
  props: {
    title_en: 'string',
    title_ar: 'string',
    subtitle_en: 'string',
    subtitle_ar: 'string',
    description_en: 'string',
    description_ar: 'string',
    background_image_url: 'string',
    isArabic: 'boolean',
    config: 'object',
  },
  manifest: manifest as any,
}
