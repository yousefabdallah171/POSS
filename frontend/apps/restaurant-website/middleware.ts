import { NextRequest, NextResponse } from "next/server";
import { parseSubdomain } from "./lib/subdomain";

const locales = ["en", "ar"];
const defaultLocale = "en";

/**
 * Get locale from URL path or default to user preference
 */
function getLocale(request: NextRequest): string {
  // Check if path contains locale
  const pathname = request.nextUrl.pathname;
  const localeInPath = locales.find((locale) => pathname.startsWith(`/${locale}`));
  if (localeInPath) {
    return localeInPath;
  }

  // Check for locale in cookie
  const localeCookie = request.cookies.get("NEXT_LOCALE")?.value;
  if (localeCookie && locales.includes(localeCookie)) {
    return localeCookie;
  }

  // Check Accept-Language header
  const acceptLanguage = request.headers.get("accept-language") || "";
  if (acceptLanguage) {
    // Parse language tags efficiently (e.g., "en-US,en;q=0.9,ar;q=0.8")
    const languages = acceptLanguage.split(",").map(lang => lang.split(";")[0].trim().split("-")[0]);
    for (const lang of languages) {
      if (locales.includes(lang)) {
        return lang;
      }
    }
  }

  return defaultLocale;
}

/**
 * Middleware to detect and handle restaurant subdomains + i18n
 * Routes restaurant subdomains to restaurant site
 * Routes main domain and www to main landing page
 * Handles language/locale routing
 */
export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;

  // Parse subdomain from hostname
  const subdomainContext = parseSubdomain(hostname);

  // Get the locale
  const locale = getLocale(request);

  // Create response headers with subdomain context
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-subdomain", subdomainContext.subdomain || "");
  requestHeaders.set("x-is-restaurant-site", String(subdomainContext.isRestaurantSite));
  requestHeaders.set("x-host", hostname);
  requestHeaders.set("x-locale", locale);

  // If it's a restaurant subdomain, add the slug to headers
  if (subdomainContext.isRestaurantSite && subdomainContext.slug) {
    requestHeaders.set("x-restaurant-slug", subdomainContext.slug);
  }

  // Create response with modified headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Batch cookie settings to optimize response serialization
  const cookieOptions = {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax" as const,
  };

  // Set cookies with subdomain context and locale for client-side access
  if (subdomainContext.isRestaurantSite && subdomainContext.slug) {
    response.cookies.set("restaurant-slug", subdomainContext.slug, cookieOptions);
  }

  response.cookies.set("is-restaurant-site", String(subdomainContext.isRestaurantSite), cookieOptions);
  response.cookies.set("NEXT_LOCALE", locale, cookieOptions);

  // Set HTML dir attribute for RTL support
  response.headers.set("x-locale-dir", locale === "ar" ? "rtl" : "ltr");

  return response;
}

/**
 * Configure which routes the middleware should run on
 * Run on all routes to detect subdomains
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
