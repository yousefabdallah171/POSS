/**
 * Retail Theme - Default Components Configuration
 *
 * Pre-configured sections optimized for retail/e-commerce businesses
 */

export const retailDefaultComponents = [
  {
    id: 'hero-section',
    config: {
      title_en: 'Discover Latest Collections',
      title_ar: 'اكتشف أحدث المجموعات',
      subtitle_en: 'Premium products for every occasion',
      subtitle_ar: 'منتجات فاخرة لكل مناسبة',
      description_en: 'Shop our curated selection of trending items',
      description_ar: 'تسوق من مختارتنا من العناصر الرائجة',
      height: 'large',
      overlay_opacity: 0.35,
      text_alignment: 'center',
      cta_button_text: 'Shop Now',
      cta_button_url: '#products',
    },
  },
  {
    id: 'products-section',
    config: {
      title_en: 'Featured Products',
      title_ar: 'المنتجات المميزة',
      description_en: 'Best sellers and new arrivals',
      description_ar: 'الأكثر مبيعاً والعناصر الجديدة',
      layout: 'grid',
      columns: 4,
      show_prices: true,
      show_images: true,
    },
  },
  {
    id: 'why-choose-us-section',
    config: {
      title_en: 'Why Shop With Us',
      title_ar: 'لماذا تتسوق معنا',
      description_en: 'Quality, selection, and service',
      description_ar: 'جودة واختيار وخدمة',
      layout: 'grid',
      columns: 4,
      items: [
        {
          title_en: 'Free Shipping',
          title_ar: 'شحن مجاني',
          description_en: 'On orders over $50',
          description_ar: 'على الطلبات فوق 50 دولار',
          icon: 'truck',
        },
        {
          title_en: 'Easy Returns',
          title_ar: 'إرجاع سهل',
          description_en: '30-day return policy',
          description_ar: 'سياسة إرجاع 30 يوم',
          icon: 'check',
        },
        {
          title_en: 'Secure Payment',
          title_ar: 'دفع آمن',
          description_en: 'Encrypted transactions',
          description_ar: 'معاملات مشفرة',
          icon: 'lock',
        },
        {
          title_en: '24/7 Support',
          title_ar: 'دعم 24/7',
          description_en: 'Always here to help',
          description_ar: 'هنا لمساعدتك دائماً',
          icon: 'phone',
        },
      ],
    },
  },
  {
    id: 'testimonials-section',
    config: {
      title_en: 'Customer Reviews',
      title_ar: 'تقييمات العملاء',
      layout: 'grid',
      items: [
        {
          author: 'Jessica M.',
          content_en: 'Amazing quality and fast shipping!',
          content_ar: 'جودة رائعة وشحن سريع!',
          rating: 5,
        },
        {
          author: 'David R.',
          content_en: 'Great selection and prices.',
          content_ar: 'مجموعة رائعة وأسعار جيدة.',
          rating: 5,
        },
        {
          author: 'Maria S.',
          content_en: 'Excellent customer service!',
          content_ar: 'خدمة عملاء ممتازة!',
          rating: 5,
        },
      ],
    },
  },
  {
    id: 'cta-section',
    config: {
      title_en: 'Exclusive Member Benefits',
      title_ar: 'مزايا العضو الحصرية',
      description_en: 'Join our loyalty program and get early access to new products',
      description_ar: 'انضم إلى برنامج الولاء واحصل على وصول مبكر للمنتجات الجديدة',
      button_text_en: 'Join Now',
      button_text_ar: 'انضم الآن',
      button_url: '#membership',
      background_color: '#0066CC',
    },
  },
]

export default retailDefaultComponents
