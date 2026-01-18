/**
 * SEO Structured Data (JSON-LD) generators
 * Helps search engines understand restaurant content
 */

/**
 * Generate Organization schema for the restaurant
 * Improves search engine understanding of business
 */
export function generateOrganizationSchema(
  restaurantName: string,
  restaurantSlug: string,
  logoUrl?: string,
  description?: string,
  email?: string,
  phone?: string,
  locale: 'en' | 'ar' = 'en'
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: restaurantName,
    url: `https://${restaurantSlug}.example.com`,
    logo: logoUrl || `https://${restaurantSlug}.example.com/logo.png`,
    description: description || `Order food online from ${restaurantName}`,
    email: email,
    telephone: phone,
    sameAs: [
      // Add social media URLs here
      // 'https://facebook.com/...',
      // 'https://instagram.com/...',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      telephone: phone,
      email: email,
    },
    language: locale === 'ar' ? 'ar' : 'en',
  };
}

/**
 * Generate LocalBusiness schema for restaurants
 * Helps with local search results and maps
 */
export function generateLocalBusinessSchema(
  restaurantName: string,
  restaurantSlug: string,
  logoUrl?: string,
  description?: string,
  address?: {
    streetAddress?: string;
    addressLocality?: string;
    postalCode?: string;
    addressCountry?: string;
  },
  coordinates?: {
    latitude: number;
    longitude: number;
  },
  rating?: {
    ratingValue: number;
    reviewCount: number;
  }
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `https://${restaurantSlug}.example.com`,
    name: restaurantName,
    image: logoUrl,
    description: description,
    url: `https://${restaurantSlug}.example.com`,
    telephone: '',
    email: '',
    address: {
      '@type': 'PostalAddress',
      streetAddress: address?.streetAddress || '',
      addressLocality: address?.addressLocality || '',
      postalCode: address?.postalCode || '',
      addressCountry: address?.addressCountry || 'US',
    },
    geo: coordinates ? {
      '@type': 'GeoCoordinates',
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    } : undefined,
    ...(rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: rating.ratingValue,
        reviewCount: rating.reviewCount,
      },
    }),
    priceRange: '$$', // Modify based on restaurant
  };
}

/**
 * Generate Product schema for menu items
 * Helps search engines index products individually
 */
export function generateProductSchema(
  productName: string,
  productDescription?: string,
  price?: number,
  image?: string,
  rating?: number
) {
  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: productName,
    description: productDescription,
    image: image,
    ...(price && {
      offers: {
        '@type': 'Offer',
        price: price.toString(),
        priceCurrency: 'USD',
      },
    }),
    ...(rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: rating,
      },
    }),
  };
}

/**
 * Generate Breadcrumb schema for navigation
 * Improves rich snippets in search results
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate AggregateOffer schema for restaurant with menu options
 * Shows price range in search results
 */
export function generateAggregateOfferSchema(
  minPrice: number,
  maxPrice: number,
  currencyCode: string = 'USD',
  offerCount: number = 0
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AggregateOffer',
    priceCurrency: currencyCode,
    lowPrice: minPrice.toString(),
    highPrice: maxPrice.toString(),
    offerCount: offerCount.toString(),
  };
}

/**
 * Generate OpeningHoursSpecification for restaurant hours
 * Helps search engines know when restaurant is open
 */
export function generateOpeningHoursSchema(
  openingHours?: Array<{
    dayOfWeek: string;
    opens: string; // HH:MM format
    closes: string; // HH:MM format
  }>
) {
  if (!openingHours) return undefined;

  return openingHours.map((hours) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: hours.dayOfWeek,
    opens: hours.opens,
    closes: hours.closes,
  }));
}

/**
 * Combine multiple schemas into a single JSON-LD script
 */
export function combineSchemas(
  schemas: Record<string, any>[]
): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@graph': schemas.map((schema) => ({
      ...schema,
      '@context': undefined, // Remove nested @context
    })),
  };
}

/**
 * Generate canonical URL to prevent duplicate content
 */
export function getCanonicalUrl(
  restaurantSlug: string,
  locale: 'en' | 'ar',
  path: string = ''
): string {
  const basePath = locale ? `/${locale}` : '';
  return `https://${restaurantSlug}.example.com${basePath}${path}`;
}

/**
 * Generate hreflang links for multi-language support
 * Tells Google about language variants
 */
export function generateHreflangLinks(
  restaurantSlug: string,
  currentLocale: 'en' | 'ar',
  path: string = ''
): Array<{ rel: string; hrefLang: string; href: string }> {
  const baseUrl = `https://${restaurantSlug}.example.com`;
  const enUrl = `${baseUrl}/en${path}`;
  const arUrl = `${baseUrl}/ar${path}`;

  return [
    {
      rel: 'alternate',
      hrefLang: 'en',
      href: enUrl,
    },
    {
      rel: 'alternate',
      hrefLang: 'ar',
      href: arUrl,
    },
    {
      rel: 'canonical',
      hrefLang: currentLocale,
      href: currentLocale === 'en' ? enUrl : arUrl,
    },
  ];
}
