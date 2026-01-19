/**
 * Mock Restaurant Data for Theme Builder Preview
 * Provides realistic bilingual (EN/AR) content for live preview
 */

export const mockRestaurantData = {
  // Hero Section
  hero: {
    title: { en: "Welcome to Our Restaurant", ar: "مرحبا بك في مطعمنا" },
    subtitle: {
      en: "Discover authentic flavors and exceptional dining experience",
      ar: "اكتشف النكهات الأصلية وتجربة طعام استثنائية"
    },
    description: {
      en: "From our kitchen to your table, we serve fresh, delicious meals prepared with passion and care.",
      ar: "من مطبخنا إلى مائدتك، نقدم وجبات طازجة وشهية معدة بعاطفة واهتمام."
    },
    buttonText: { en: "Order Now", ar: "اطلب الآن" },
    ctaText: { en: "View Menu", ar: "عرض القائمة" },
    backgroundImage: "/mock/hero-bg.jpg"
  },

  // Menu Items
  menu: {
    items: [
      {
        id: "1",
        name: { en: "Margherita Pizza", ar: "بيتزا مارغريتا" },
        description: {
          en: "Fresh mozzarella, basil, and tomato sauce on crispy dough",
          ar: "جبن موتزاريلا طازج، ريحان، وصلصة طماطم على عجين مقرمش"
        },
        price: 12.99,
        image: "/mock/pizza-margherita.jpg",
        category: { en: "Pizzas", ar: "بيتزا" }
      },
      {
        id: "2",
        name: { en: "Caesar Salad", ar: "سلطة قيصر" },
        description: {
          en: "Crisp romaine lettuce with parmesan and house-made dressing",
          ar: "خس رومايني مقرمش مع جبن بارميزان وصلصة منزلية الصنع"
        },
        price: 9.99,
        image: "/mock/caesar-salad.jpg",
        category: { en: "Salads", ar: "سلطات" }
      },
      {
        id: "3",
        name: { en: "Grilled Salmon", ar: "سمك السلمون المشوي" },
        description: {
          en: "Fresh atlantic salmon with lemon butter and seasonal vegetables",
          ar: "سمك السلمون الأطلسي الطازج مع زبدة الليمون والخضروات الموسمية"
        },
        price: 18.99,
        image: "/mock/grilled-salmon.jpg",
        category: { en: "Main Courses", ar: "الأطباق الرئيسية" }
      },
      {
        id: "4",
        name: { en: "Ribeye Steak", ar: "لحم الريب آي" },
        description: {
          en: "Prime cut 12oz steak with garlic mashed potatoes",
          ar: "شريحة لحم مختارة بوزن 12 أونصة مع بطاطس مهروسة بالثوم"
        },
        price: 24.99,
        image: "/mock/ribeye-steak.jpg",
        category: { en: "Main Courses", ar: "الأطباق الرئيسية" }
      },
      {
        id: "5",
        name: { en: "Spaghetti Carbonara", ar: "سباغيتي كاربونارا" },
        description: {
          en: "Classic Italian pasta with bacon, egg, and parmesan",
          ar: "معكرونة إيطالية كلاسيكية مع لحم مقدد وبيض وجبن بارميزان"
        },
        price: 14.99,
        image: "/mock/carbonara.jpg",
        category: { en: "Pasta", ar: "معكرونة" }
      },
      {
        id: "6",
        name: { en: "Tiramisu", ar: "تيراميسو" },
        description: {
          en: "Italian dessert with espresso, mascarpone, and cocoa powder",
          ar: "حلوى إيطالية مع إسبريسو، ماسكاربوني، وكاكاو"
        },
        price: 7.99,
        image: "/mock/tiramisu.jpg",
        category: { en: "Desserts", ar: "الحلويات" }
      },
      {
        id: "7",
        name: { en: "Chocolate Lava Cake", ar: "كعكة الشوكولاتة الحارة" },
        description: {
          en: "Warm chocolate cake with molten center and vanilla ice cream",
          ar: "كعكة شوكولاتة دافئة مع مركز منصهر وآيس كريم الفانيليا"
        },
        price: 8.99,
        image: "/mock/chocolate-cake.jpg",
        category: { en: "Desserts", ar: "الحلويات" }
      },
      {
        id: "8",
        name: { en: "Iced Latte", ar: "لاتيه مثلج" },
        description: {
          en: "Cold espresso with steamed milk and ice",
          ar: "إسبريسو بارد مع حليب مبخر وثلج"
        },
        price: 5.99,
        image: "/mock/iced-latte.jpg",
        category: { en: "Beverages", ar: "المشروبات" }
      }
    ],
    categories: [
      { id: "1", name: { en: "Pizzas", ar: "بيتزا" }, description: { en: "Wood-fired pizzas", ar: "بيتزا بالفرن الحجري" } },
      { id: "2", name: { en: "Salads", ar: "سلطات" }, description: { en: "Fresh salads", ar: "سلطات طازجة" } },
      { id: "3", name: { en: "Main Courses", ar: "الأطباق الرئيسية" }, description: { en: "Main dishes", ar: "الأطباق الرئيسية" } },
      { id: "4", name: { en: "Pasta", ar: "معكرونة" }, description: { en: "Italian pasta", ar: "معكرونة إيطالية" } },
      { id: "5", name: { en: "Desserts", ar: "الحلويات" }, description: { en: "Sweet desserts", ar: "حلويات لذيذة" } }
    ]
  },

  // Testimonials
  testimonials: [
    {
      id: "1",
      name: { en: "Sarah Johnson", ar: "سارة جونسون" },
      text: {
        en: "Amazing food and wonderful service! The salmon was perfectly cooked and the atmosphere was so welcoming.",
        ar: "طعام رائع وخدمة رائعة! كان السلمون مطهوًا بشكل مثالي والأجواء كانت ترحابية جدًا."
      },
      rating: 5,
      image: "/mock/avatar-1.jpg"
    },
    {
      id: "2",
      name: { en: "Michael Chen", ar: "مايكل تشين" },
      text: {
        en: "Best pizza in town! I've been here 5 times and each visit is better than the last. Highly recommended!",
        ar: "أفضل بيتزا في المدينة! لقد زرت هنا 5 مرات وكل مرة أفضل من السابقة. أوصي بشدة!"
      },
      rating: 5,
      image: "/mock/avatar-2.jpg"
    },
    {
      id: "3",
      name: { en: "Emma Rodriguez", ar: "إيما رودريغيز" },
      text: {
        en: "Perfect date night spot. The tiramisu is to die for, and the wine selection is excellent.",
        ar: "مكان مثالي لليلة الموعد. التيراميسو لا يصدق، واختيار النبيذ ممتاز."
      },
      rating: 5,
      image: "/mock/avatar-3.jpg"
    },
    {
      id: "4",
      name: { en: "David Thompson", ar: "ديفيد طومسون" },
      text: {
        en: "Great restaurant with authentic Italian cuisine. The staff is very attentive and professional.",
        ar: "مطعم رائع مع مطبخ إيطالي أصلي. الموظفون منتبهون واحترافيون جداً."
      },
      rating: 4,
      image: "/mock/avatar-4.jpg"
    },
    {
      id: "5",
      name: { en: "Jessica Williams", ar: "جيسيكا ويليامز" },
      text: {
        en: "Fresh ingredients and creative dishes. I loved the Caesar salad and the ribeye steak was perfectly seasoned.",
        ar: "مكونات طازجة وأطباق إبداعية. أحببت سلطة قيصر وكانت لحم الريب آي معتدل التتبيل بشكل مثالي."
      },
      rating: 5,
      image: "/mock/avatar-5.jpg"
    }
  ],

  // Contact Section
  contact: {
    title: { en: "Contact Us", ar: "اتصل بنا" },
    phone: { en: "+1 (555) 123-4567", ar: "+1 (555) 123-4567" },
    email: { en: "info@restaurant.com", ar: "info@restaurant.com" },
    address: { en: "123 Main Street, Downtown, City 12345", ar: "123 شارع رئيسي، وسط المدينة، المدينة 12345" },
    hours: {
      weekday: { en: "11:00 AM - 10:00 PM", ar: "11:00 صباحًا - 10:00 مساءً" },
      weekend: { en: "12:00 PM - 11:00 PM", ar: "12:00 مساءً - 11:00 مساءً" }
    },
    mapUrl: "https://maps.google.com"
  },

  // Why Choose Us
  whyChooseUs: {
    title: { en: "Why Choose Us", ar: "لماذا اختيارنا" },
    features: [
      {
        id: "1",
        title: { en: "Fresh Ingredients", ar: "مكونات طازجة" },
        description: {
          en: "We source only the freshest ingredients daily from local suppliers",
          ar: "نحصل على أطازج المكونات يوميًا من الموردين المحليين"
        }
      },
      {
        id: "2",
        title: { en: "Expert Chefs", ar: "شيفات خبراء" },
        description: {
          en: "Our chefs have over 20 years of international cooking experience",
          ar: "لدى طهاتنا أكثر من 20 سنة من خبرة الطهي العالمية"
        }
      },
      {
        id: "3",
        title: { en: "Cozy Ambiance", ar: "أجواء مريحة" },
        description: {
          en: "Warm and welcoming atmosphere perfect for any occasion",
          ar: "أجواء دافئة وترحابية مثالية لأي مناسبة"
        }
      },
      {
        id: "4",
        title: { en: "Excellent Service", ar: "خدمة ممتازة" },
        description: {
          en: "Professional staff dedicated to making your dining experience exceptional",
          ar: "موظفون متخصصون مكرسون لجعل تجربة الطعام استثنائية"
        }
      }
    ]
  },

  // CTA Section
  cta: {
    title: { en: "Ready to Dine With Us?", ar: "هل أنت مستعد للتناول معنا؟" },
    description: {
      en: "Reserve your table today or place an order for delivery",
      ar: "احجز طاولتك اليوم أو اطلب التوصيل"
    },
    buttonText: { en: "Reserve Now", ar: "احجز الآن" },
    secondaryButtonText: { en: "Order Online", ar: "اطلب عبر الإنترنت" }
  },

  // Footer
  footer: {
    companyName: { en: "Delicious Restaurant", ar: "مطعم الطعام اللذيذ" },
    companyDescription: {
      en: "Premium dining experience with authentic international cuisine",
      ar: "تجربة طعام فاخرة مع مطبخ عالمي أصلي"
    },
    sections: [
      {
        id: "1",
        title: { en: "Menu", ar: "القائمة" },
        links: [
          { label: { en: "Pizzas", ar: "بيتزا" }, href: "#pizzas" },
          { label: { en: "Main Courses", ar: "الأطباق الرئيسية" }, href: "#main" },
          { label: { en: "Desserts", ar: "الحلويات" }, href: "#desserts" },
          { label: { en: "Beverages", ar: "المشروبات" }, href: "#drinks" }
        ]
      },
      {
        id: "2",
        title: { en: "Information", ar: "معلومات" },
        links: [
          { label: { en: "About Us", ar: "عن الموقع" }, href: "/about" },
          { label: { en: "Reservations", ar: "الحجوزات" }, href: "/reservations" },
          { label: { en: "Catering", ar: "الوجبات الخارجية" }, href: "/catering" },
          { label: { en: "Gift Cards", ar: "بطاقات الهدايا" }, href: "/gifts" }
        ]
      },
      {
        id: "3",
        title: { en: "Legal", ar: "قانوني" },
        links: [
          { label: { en: "Privacy Policy", ar: "سياسة الخصوصية" }, href: "/privacy" },
          { label: { en: "Terms of Service", ar: "شروط الخدمة" }, href: "/terms" },
          { label: { en: "Cookie Policy", ar: "سياسة ملفات تعريف الارتباط" }, href: "/cookies" }
        ]
      }
    ],
    socialLinks: [
      { platform: "facebook", url: "https://facebook.com", label: "Facebook" },
      { platform: "instagram", url: "https://instagram.com", label: "Instagram" },
      { platform: "twitter", url: "https://twitter.com", label: "Twitter" },
      { platform: "youtube", url: "https://youtube.com", label: "YouTube" }
    ]
  }
}

/**
 * Export helper function to get mock data for specific component type
 */
export function getMockDataForComponent(componentType: string, isArabic: boolean = false) {
  const data = mockRestaurantData
  const lang = isArabic ? "ar" : "en"

  switch (componentType?.toLowerCase()) {
    case "hero":
      return data.hero
    case "menu":
    case "products":
      return data.menu
    case "testimonials":
      return data.testimonials
    case "contact":
      return data.contact
    case "whychooseus":
      return data.whyChooseUs
    case "cta":
      return data.cta
    case "footer":
      return data.footer
    default:
      return data
  }
}
