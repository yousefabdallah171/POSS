'use client'

import React from 'react'
import type { CTASectionProps } from '../types'
import { getMockDataForComponent } from '../mockData'

/**
 * CTASection: Call-to-action section
 *
 * Prominent section for driving conversions with:
 * - Attention-grabbing design
 * - Single CTA button
 * - Customizable background
 * - RTL support
 */
export const CTASection: React.FC<CTASectionProps> = ({
  title_en = 'Ready to Get Started?',
  title_ar = 'هل أنت مستعد للبدء؟',
  description_en = '',
  description_ar = '',
  config = {},
  isArabic = false,
}) => {
  const title = isArabic ? title_ar : title_en
  const description = isArabic ? description_ar : description_en

  // Use provided values or fallback to mock data
  const mockData = getMockDataForComponent('cta')
  const displayTitle = title || (isArabic ? mockData.title_ar : mockData.title_en) || ''
  const displayDescription = description || (isArabic ? mockData.description_ar : mockData.description_en) || ''

  const buttonText = config.button_text_en || config.button_text_ar
    ? (isArabic ? config.button_text_ar : config.button_text_en)
    : (mockData.button_text_ar && isArabic ? mockData.button_text_ar : (mockData.button_text_en || (isArabic ? 'اطلب الآن' : 'Order Now')))
  const buttonUrl = config.button_url || mockData.button_url || '#'
  const backgroundColor = config.background_color || '#3b82f6'

  return (
    <section
      className="w-full py-20 px-4 text-white"
      style={{
        backgroundColor,
        direction: isArabic ? 'rtl' : 'ltr',
      }}
    >
      <div className="max-w-4xl mx-auto text-center">
        {displayTitle && <h2 className="text-4xl font-bold mb-4">{displayTitle}</h2>}

        {displayDescription && <p className="text-lg mb-8 opacity-90">{displayDescription}</p>}

        {buttonText && (
          <a
            href={buttonUrl}
            className="btn-accent inline-block text-lg font-semibold"
          >
            {buttonText}
          </a>
        )}
      </div>
    </section>
  )
}

export default CTASection
