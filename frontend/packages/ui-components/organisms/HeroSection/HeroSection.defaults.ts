/**
 * HeroSection Default Configuration
 */

import { HeroConfig } from './HeroSection.types'

export const defaultHeroConfig: Required<HeroConfig> = {
  height: 'medium',
  overlay_opacity: 0.5,
  text_alignment: 'center',
  cta_button_text: 'Learn More',
  cta_button_url: '#',
}

export const heroConfigDefaults = {
  title_en: 'Welcome to Our Website',
  title_ar: 'مرحبا بكم في موقعنا',
  subtitle_en: 'Discover amazing experiences',
  subtitle_ar: 'اكتشف تجارب رائعة',
  description_en: '',
  description_ar: '',
  background_image_url: '',
  config: defaultHeroConfig,
}
