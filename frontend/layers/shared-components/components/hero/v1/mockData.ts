/**
 * Hero Section - Isolated Mock Data
 *
 * Component-specific mock data for Hero Section
 * Used when no props are provided or for previewing the component
 */

export const mockData = {
  title_en: 'Welcome to Our Restaurant',
  title_ar: 'مرحبا بكم في مطعمنا',
  subtitle_en: 'Experience authentic flavors and exceptional service',
  subtitle_ar: 'اختبر النكهات الأصلية والخدمة الاستثنائية',
  description_en: 'Join us for an unforgettable dining experience with premium dishes crafted by our expert chefs',
  description_ar: 'انضم إلينا لتجربة طعام لا تنسى مع الأطباق الممتازة المعدة من قبل طهاتنا المحترفين',
  background_image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=400&fit=crop',
}

export const mockConfig = {
  cta_button_text: 'View Menu',
  cta_button_url: '/menu',
  height: 'large',
  overlay_opacity: 0.4,
  text_alignment: 'center',
}

/**
 * Default export with full mock state
 */
export default {
  ...mockData,
  config: mockConfig,
}
