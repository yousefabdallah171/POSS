import { MetadataRoute } from 'next';

/**
 * Dynamic sitemap.xml generation for SEO
 * Generates URLs for all locales and major routes
 * Note: For dynamic restaurant URLs, you would need to fetch from API
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // Supported locales
  const locales = ['en', 'ar'];

  // Static pages available in all locales
  const staticPages = ['', 'menu', 'orders', 'checkout', 'settings'];

  // Base domain - replace with your actual domain
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

  // Generate sitemap entries
  const sitemap: MetadataRoute.Sitemap = [];

  // Add locale-specific homepage URLs
  locales.forEach((locale) => {
    // Homepage
    sitemap.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0, // Homepage highest priority
    });

    // Menu page
    sitemap.push({
      url: `${baseUrl}/${locale}/menu`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9, // Menu very important for restaurants
    });

    // Orders page (for logged-in users)
    sitemap.push({
      url: `${baseUrl}/${locale}/orders`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    });

    // Settings page
    sitemap.push({
      url: `${baseUrl}/${locale}/settings`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    });
  });

  return sitemap;
}

/**
 * Note: For more advanced sitemap generation with dynamic restaurants:
 *
 * 1. Fetch list of restaurants from API
 * 2. Generate URLs for each restaurant/locale combination
 * 3. Example:
 *
 * const restaurants = await fetch(`${apiUrl}/public/restaurants`).then(r => r.json());
 * restaurants.forEach(restaurant => {
 *   locales.forEach(locale => {
 *     sitemap.push({
 *       url: `${baseUrl}/${locale}?restaurant=${restaurant.slug}`,
 *       lastModified: new Date(restaurant.updated_at),
 *       changeFrequency: 'weekly',
 *       priority: 0.8,
 *     });
 *   });
 * });
 */
