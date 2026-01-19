/**
 * Restaurant Theme - Default Components Configuration
 *
 * Pre-configured sections optimized for restaurant businesses
 * Includes typical sections needed for restaurant landing pages
 */

export const restaurantDefaultComponents = [
  {
    id: 'hero-section',
    config: {
      title_en: 'Welcome to Our Restaurant',
      title_ar: 'مرحبا بكم في مطعمنا',
      subtitle_en: 'Experience authentic flavors and exceptional service',
      subtitle_ar: 'جرب النكهات الأصيلة والخدمة الاستثنائية',
      description_en: 'Join us for an unforgettable culinary journey',
      description_ar: 'انضم إلينا لرحلة طهوية لا تنسى',
      height: 'large',
      overlay_opacity: 0.4,
      text_alignment: 'center',
      cta_button_text: 'View Menu',
      cta_button_url: '#menu',
    },
  },
  {
    id: 'why-choose-us-section',
    config: {
      title_en: 'Why Choose Our Restaurant',
      title_ar: 'لماذا تختار مطعمنا',
      description_en: 'What makes us special',
      description_ar: 'ما يجعلنا مميزين',
      layout: 'grid',
      columns: 3,
      items: [
        {
          title_en: 'Fresh Ingredients',
          title_ar: 'مكونات طازة',
          description_en: 'We source the finest ingredients daily',
          description_ar: 'نحصل على أجود المكونات يوميا',
          icon: 'leaf',
        },
        {
          title_en: 'Expert Chefs',
          title_ar: 'طهاة خبراء',
          description_en: 'Award-winning culinary team',
          description_ar: 'فريق طهاة حائز على جوائز',
          icon: 'chef',
        },
        {
          title_en: 'Warm Ambiance',
          title_ar: 'أجواء دافئة',
          description_en: 'Perfect setting for any occasion',
          description_ar: 'الإعداد المثالي لأي مناسبة',
          icon: 'star',
        },
      ],
    },
  },
  {
    id: 'testimonials-section',
    config: {
      title_en: 'Guest Favorites',
      title_ar: 'المفضلة لدى الضيوف',
      layout: 'grid',
      items: [
        {
          author: 'Sarah Johnson',
          content_en: 'The best dining experience in town! Highly recommend.',
          content_ar: 'أفضل تجربة طعام في المدينة! أنصح بها بشدة.',
          rating: 5,
        },
        {
          author: 'Ahmed Hassan',
          content_en: 'Exceptional food and wonderful service.',
          content_ar: 'طعام استثنائي وخدمة رائعة.',
          rating: 5,
        },
        {
          author: 'Emily Davis',
          content_en: 'Will definitely come back again soon!',
          content_ar: 'سأعود بالتأكيد قريبا جدا!',
          rating: 5,
        },
      ],
    },
  },
  {
    id: 'contact-section',
    config: {
      title_en: 'Contact & Reservations',
      title_ar: 'التواصل والحجوزات',
      phone: '+1 (555) 123-4567',
      email: 'reservations@restaurant.com',
      address_en: '123 Main Street, Your City, ST 12345',
      address_ar: '123 شارع رئيسي، مدينتك، 12345',
      show_form: true,
      show_map: true,
      show_phone: true,
      show_email: true,
      show_address: true,
    },
  },
  {
    id: 'cta-section',
    config: {
      title_en: 'Ready for a Great Meal?',
      title_ar: 'هل أنت مستعد لوجبة رائعة؟',
      description_en: 'Make your reservation today and experience culinary excellence',
      description_ar: 'احجز اليوم واختبر التميز الطهوي',
      button_text_en: 'Make a Reservation',
      button_text_ar: 'احجز الآن',
      button_url: '#reservations',
      background_color: '#8B4513',
    },
  },
]

export default restaurantDefaultComponents
