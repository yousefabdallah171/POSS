/**
 * Subdomain detection and parsing utilities
 * Handles restaurant subdomain routing and context extraction
 */

export interface SubdomainContext {
  subdomain: string | null;
  isRestaurantSite: boolean;
  isMainSite: boolean;
  slug: string | null;
  host: string;
}

/**
 * Parse subdomain from hostname
 * Examples:
 * - restaurant-name.localhost:3000 -> restaurant-name
 * - my-pizzeria.pos-saas.com -> my-pizzeria
 * - pos-saas.com -> null (main site)
 * - localhost:3000 -> null (main site)
 */
export function parseSubdomain(hostname: string): SubdomainContext {
  if (!hostname) {
    return {
      subdomain: null,
      isRestaurantSite: false,
      isMainSite: true,
      slug: null,
      host: hostname,
    };
  }

  // Remove port if present
  const host = hostname.split(":")[0].toLowerCase();

  // List of main domain patterns that should NOT be treated as subdomains
  const mainDomainPatterns = [
    "localhost",
    "127.0.0.1",
    "127.0.0.1", // IPv4 loopback
    "::1", // IPv6 loopback
  ];

  // Check for main domains
  const isMainDomain = mainDomainPatterns.includes(host);

  if (isMainDomain) {
    return {
      subdomain: null,
      isRestaurantSite: false,
      isMainSite: true,
      slug: null,
      host: hostname,
    };
  }

  // Split by dots
  const parts = host.split(".");

  // If only one part (like "localhost" or custom domain), it's the main site
  if (parts.length === 1) {
    return {
      subdomain: null,
      isRestaurantSite: false,
      isMainSite: true,
      slug: null,
      host: hostname,
    };
  }

  // If two or more parts, the first part is the subdomain
  // Examples:
  // "restaurant.localhost" -> subdomain = "restaurant"
  // "my-pizzeria.pos-saas.com" -> subdomain = "my-pizzeria"
  // "pos-saas.com" -> parts.length = 2, need to check if it's a known pattern

  const subdomain = parts[0];
  const isRestaurantSite = subdomain && subdomain !== "www" && !isMainDomain;

  return {
    subdomain: isRestaurantSite ? subdomain : null,
    isRestaurantSite,
    isMainSite: !isRestaurantSite,
    slug: isRestaurantSite ? subdomain : null,
    host: hostname,
  };
}

/**
 * Extract subdomain context from request headers
 * Handles both client-side and server-side usage
 */
export function getSubdomainContextFromHost(host: string): SubdomainContext {
  return parseSubdomain(host);
}

/**
 * Validate if a slug is a valid restaurant subdomain
 * Prevents routing conflicts with reserved paths
 */
export function isValidRestaurantSlug(slug: string): boolean {
  // Reserved slugs that should not be restaurant subdomains
  const reserved = [
    "admin",
    "api",
    "www",
    "mail",
    "ftp",
    "cdn",
    "auth",
    "app",
    "dashboard",
    "docs",
    "status",
  ];

  if (!slug) return false;
  if (reserved.includes(slug.toLowerCase())) return false;

  // Only alphanumeric and hyphens, min 2 chars, max 63 chars
  const slugRegex = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/i;
  return slugRegex.test(slug);
}

/**
 * Format restaurant name to valid slug
 */
export function toRestaurantSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // spaces to hyphens
    .replace(/[^\w-]/g, "") // remove non-alphanumeric except hyphens
    .replace(/--+/g, "-") // multiple hyphens to single
    .replace(/^-+|-+$/g, ""); // trim leading/trailing hyphens
}
