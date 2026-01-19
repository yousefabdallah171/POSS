/**
 * Mock Data for Theme Builder Preview
 *
 * Provides realistic sample data for all component types
 * Used in theme builder to show what components look like with real content
 */

export const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Delicious Burger',
    description: 'Juicy beef burger with fresh toppings',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=300&fit=crop',
    category: 'Main Course',
  },
  {
    id: '2',
    name: 'Crispy Pizza',
    description: 'Authentic Italian pizza with mozzarella',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=300&h=300&fit=crop',
    category: 'Main Course',
  },
  {
    id: '3',
    name: 'Fresh Salad',
    description: 'Organic vegetables with house dressing',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=300&h=300&fit=crop',
    category: 'Appetizers',
  },
  {
    id: '4',
    name: 'Chocolate Dessert',
    description: 'Rich chocolate cake with cream',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=300&fit=crop',
    category: 'Desserts',
  },
  {
    id: '5',
    name: 'Fresh Juice',
    description: 'Freshly squeezed orange juice',
    price: 5.99,
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=300&h=300&fit=crop',
    category: 'Beverages',
  },
  {
    id: '6',
    name: 'Grilled Chicken',
    description: 'Tender grilled chicken with herbs',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=300&h=300&fit=crop',
    category: 'Main Course',
  },
]

export const MOCK_FEATURES = [
  {
    title_en: 'Fresh Ingredients',
    title_ar: 'مكونات طازة',
    description_en: 'We use only the freshest ingredients sourced locally',
    description_ar: 'نستخدم المكونات الطازة والطبيعية فقط',
    icon: '🥬',
  },
  {
    title_en: 'Expert Chefs',
    title_ar: 'طهاة محترفون',
    description_en: 'Our team of experienced chefs prepares every dish with care',
    description_ar: 'فريقنا من الطهاة المحترفين يحضر كل طبق بعناية',
    icon: '👨‍🍳',
  },
  {
    title_en: 'Quick Service',
    title_ar: 'خدمة سريعة',
    description_en: 'Fast and efficient service without compromising quality',
    description_ar: 'خدمة سريعة وفعالة دون المساس بالجودة',
    icon: '⚡',
  },
  {
    title_en: 'Hygienic',
    title_ar: 'نظافة عالية',
    description_en: 'Highest standards of cleanliness and food safety',
    description_ar: 'أعلى معايير النظافة والسلامة الغذائية',
    icon: '✨',
  },
]

export const MOCK_TESTIMONIALS = [
  {
    author: 'John Smith',
    content_en: 'Best restaurant in town! The food is amazing and the service is outstanding.',
    content_ar: 'أفضل مطعم في المدينة! الطعام رائع والخدمة ممتازة.',
    rating: 5,
  },
  {
    author: 'Sarah Johnson',
    content_en: 'Absolutely delicious! I bring my family here every weekend.',
    content_ar: 'طعم لذيذ جداً! أحضر عائلتي هنا كل نهاية أسبوع.',
    rating: 5,
  },
  {
    author: 'Mike Wilson',
    content_en: 'Great atmosphere and friendly staff. Highly recommended!',
    content_ar: 'أجواء رائعة وموظفون ودودون. موصى به بشدة!',
    rating: 5,
  },
]

export const MOCK_CONTACT_INFO = {
  phone: '(555) 123-4567',
  email: 'contact@restaurant.com',
  address_en: '123 Main Street, City, State 12345',
  address_ar: '123 شارع رئيسي، المدينة، الولاية 12345',
}

export const MOCK_HERO_DATA = {
  title_en: 'Welcome to Our Restaurant',
  title_ar: 'مرحبا بكم في مطعمنا',
  subtitle_en: 'Experience authentic flavors and exceptional service',
  subtitle_ar: 'اختبر النكهات الأصلية والخدمة الاستثنائية',
  description_en: 'Join us for an unforgettable dining experience',
  description_ar: 'انضم إلينا لتجربة طعام لا تنسى',
  background_image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=400&fit=crop',
}

export const MOCK_CTA_DATA = {
  title_en: 'Ready to enjoy our delicious food?',
  title_ar: 'هل أنت مستعد للاستمتاع بطعامنا اللذيذ؟',
  description_en: 'Order now and get 10% off your first meal',
  description_ar: 'اطلب الآن واحصل على خصم 10٪ على وجبتك الأولى',
}

/**
 * Get mock data for a component type
 */
export function getMockDataForComponent(
  type: string
): Record<string, any> {
  switch (type.toLowerCase()) {
    case 'products':
    case 'featured_products':
    case 'product_grid':
      return {
        title_en: 'Our Delicious Menu',
        title_ar: 'قائمة طعامنا اللذيذة',
        description_en: 'Choose from our selection of fresh, homemade dishes',
        description_ar: 'اختر من مختارنا من الأطباق الطازة محلية الصنع',
        layout: 'grid',
        columns: 3,
        show_prices: true,
        show_images: true,
        items: MOCK_PRODUCTS,
      }

    case 'why_us':
    case 'why_choose_us':
    case 'features':
      return {
        title_en: 'Why Choose Us',
        title_ar: 'لماذا اختياراتنا',
        description_en: 'We are committed to providing the best dining experience',
        description_ar: 'نحن ملتزمون بتوفير أفضل تجربة طعام',
        items: MOCK_FEATURES,
      }

    case 'testimonials':
    case 'reviews':
      return {
        title_en: 'What Our Customers Say',
        title_ar: 'ما يقوله عملاؤنا',
        layout: 'grid',
        items: MOCK_TESTIMONIALS,
      }

    case 'contact':
    case 'contact_us':
      return {
        title_en: 'Contact Us',
        title_ar: 'اتصل بنا',
        ...MOCK_CONTACT_INFO,
        show_form: true,
        show_map: true,
      }

    case 'cta':
    case 'call_to_action':
      return {
        ...MOCK_CTA_DATA,
        button_text_en: 'Order Now',
        button_text_ar: 'اطلب الآن',
        button_url: '/order',
      }

    case 'hero':
      return {
        ...MOCK_HERO_DATA,
        height: 'large',
        overlay_opacity: 0.4,
        text_alignment: 'center',
        cta_button_text: 'View Menu',
        cta_button_url: '/menu',
      }

    default:
      return {}
  }
}

/**
 * Flag to enable/disable mock data (used in preview mode)
 */
export const USE_MOCK_DATA = true
