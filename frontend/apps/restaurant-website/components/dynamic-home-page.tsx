'use client';

import React, { useEffect, useState } from 'react';
import { Loader, AlertCircle } from 'lucide-react';
import { SectionRenderer, Header, Footer } from '@pos-saas/ui-themes';
import { FeaturedProductsSection } from './featured-products-section';
import { ErrorBoundary } from './error-boundary';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  border: string;
  shadow: string;
}

interface TypographySettings {
  fontFamily: string;
  baseFontSize: number;
  borderRadius: number;
  lineHeight: number;
}

interface WebsiteIdentity {
  siteTitle: string;
  logoUrl?: string;
  faviconUrl?: string;
  domain?: string;
}

interface HeaderConfig {
  logoUrl?: string;
  showLogo: boolean;
  navigationItems: Array<{ label: string; href: string }>;
  backgroundColor: string;
  textColor: string;
  height: number;
}

interface FooterConfig {
  companyName: string;
  address?: string;
  phone?: string;
  email?: string;
  copyrightText: string;
  socialLinks: Array<{ platform: string; url: string }>;
  backgroundColor: string;
  textColor: string;
  showLinks: boolean;
}

interface ThemeData {
  id: string;
  name: string;
  slug: string;
  colors: ThemeColors;
  typography: TypographySettings;
  identity: WebsiteIdentity;
  header: HeaderConfig;
  footer: FooterConfig;
  components: ThemeComponent[];
  createdAt: string;
  updatedAt: string;
}

interface ThemeComponent {
  id: string;
  type: string;
  title: string;
  enabled: boolean;
  displayOrder: number;
  config?: Record<string, any>;
}

interface HomepageData {
  theme: ThemeData;
  components: ThemeComponent[];
  restaurant?: {
    slug: string;
  };
}

interface DynamicHomePageProps {
  restaurantSlug: string;
  locale: 'en' | 'ar';
}

// Helper: Extract text from bilingual object or return as-is
function extractBilingualText(value: any, locale: 'en' | 'ar' = 'en'): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value[locale]) return value[locale];
  if (typeof value === 'object' && value.en) return value.en;
  if (typeof value === 'object' && value.ar) return value.ar;
  return String(value);
}

// Helper: Map component types from theme.json to registered types
function mapComponentType(type: string): string {
  const typeMapping: Record<string, string> = {
    'featured-items': 'products',
    'featured_items': 'products',
    'why-choose-us': 'why_us',
    'why_choose_us': 'why_us',
    'why-us': 'why_us',
    'testimonials': 'testimonials',
    'contact': 'contact',
    'cta': 'cta',
    'call-to-action': 'cta',
    'hero': 'hero',
    'products': 'products',
    'info-cards': 'info_cards',
    'info_cards': 'info_cards',
  };
  return typeMapping[type.toLowerCase()] || type;
}

export function DynamicHomePage({ restaurantSlug, locale }: DynamicHomePageProps) {
  const [homepageData, setHomepageData] = useState<HomepageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch homepage data from API
  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Use the correct public endpoint: /public/restaurants/{slug}/homepage
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
        const homepageUrl = `${apiUrl}/public/restaurants/${restaurantSlug}/homepage`;

        // Create an AbortController with 10 second timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(homepageUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();

          if (response.status === 404) {
            throw new Error('Restaurant not found. Please check the URL.');
          }
          throw new Error(`Failed to fetch restaurant data (${response.status})`);
        }

        const apiResponse = await response.json();

        // API returns: { success, data: { data: {...}, theme: {...}, components: [], restaurant: {...} } }
        const innerData = apiResponse.data?.data || apiResponse.data;

        if (!innerData) {
          throw new Error('No data in API response');
        }

        // Extract theme (in snake_case from API)
        const rawTheme = innerData.theme;
        if (!rawTheme) {
          throw new Error('No theme found in API response');
        }

        // Extract config from theme - it contains colors, typography, components, etc.
        const configData = rawTheme.config || {};

        // Extract and normalize components from config
        let componentsFromConfig = (configData.components || []) as any[];

        // Map component types and normalize bilingual text
        componentsFromConfig = componentsFromConfig.map((comp: any) => ({
          ...comp,
          type: mapComponentType(comp.type || 'hero'),
          title: extractBilingualText(comp.title, locale),
          // Also normalize config bilingual fields if present
          config: comp.config ? {
            ...comp.config,
            title: comp.config.title ? extractBilingualText(comp.config.title, locale) : undefined,
            title_en: comp.config.title_en || extractBilingualText(comp.config.title?.en, locale),
            title_ar: comp.config.title_ar || extractBilingualText(comp.config.title?.ar, 'ar'),
            subtitle: comp.config.subtitle ? extractBilingualText(comp.config.subtitle, locale) : undefined,
            description: comp.config.description ? extractBilingualText(comp.config.description, locale) : undefined,
          } : comp.config,
        }));

        // Convert snake_case API fields to camelCase expected by frontend
        const convertedTheme: ThemeData = {
          id: rawTheme.id?.toString() || '1',
          name: rawTheme.name || 'Default Theme',
          slug: rawTheme.slug || 'default',
          createdAt: rawTheme.created_at || new Date().toISOString(),
          updatedAt: rawTheme.updated_at || new Date().toISOString(),

          // Colors (from config if available, fallback to snake_case)
          colors: {
            primary: configData.colors?.primary || rawTheme.primary_color || '#3b82f6',
            secondary: configData.colors?.secondary || rawTheme.secondary_color || '#1e40af',
            accent: configData.colors?.accent || rawTheme.accent_color || '#0ea5e9',
            background: configData.colors?.background || rawTheme.background_color || '#ffffff',
            text: configData.colors?.text || rawTheme.text_color || '#1f2937',
            border: configData.colors?.border || rawTheme.border_color || '#e5e7eb',
            shadow: configData.colors?.shadow || rawTheme.shadow_color || '#1f2937',
          },

          // Typography (from config if available, fallback to snake_case)
          typography: {
            fontFamily: configData.typography?.fontSans || configData.typography?.fontFamily || rawTheme.font_family || 'Inter',
            baseFontSize: configData.typography?.baseSize || configData.typography?.baseFontSize || rawTheme.base_font_size || 14,
            borderRadius: configData.typography?.borderRadius || rawTheme.border_radius || 8,
            lineHeight: configData.typography?.lineHeight || rawTheme.line_height || 1.5,
          },

          // Identity (from config if available)
          identity: {
            siteTitle: configData.identity?.siteTitle || rawTheme.site_title || 'Restaurant',
            logoUrl: configData.identity?.logoUrl || rawTheme.logo_url || undefined,
            faviconUrl: configData.identity?.faviconUrl || rawTheme.favicon_url || undefined,
          },

          // Header (from config if available, with defaults) - also normalize bilingual text
          header: {
            logoUrl: configData.header?.logoUrl || rawTheme.logo_url || undefined,
            showLogo: configData.header?.showLogo !== false && !!rawTheme.logo_url,
            navigationItems: (configData.header?.navigationItems || [
              { label: 'Home', href: '/' },
              { label: 'Menu', href: '/menu' },
              { label: 'About', href: '/about' },
              { label: 'Contact', href: '/contact' },
            ]).map((item: any) => ({
              ...item,
              label: extractBilingualText(item.label, locale),
            })),
            backgroundColor: configData.header?.backgroundColor || configData.colors?.primary || rawTheme.primary_color || '#3b82f6',
            textColor: configData.header?.textColor || '#ffffff',
            height: configData.header?.height || configData.header?.navHeight || 64,
          },

          // Footer (from config if available, with defaults) - also normalize bilingual text
          footer: {
            // Company info from companyInfo object OR direct fields
            companyName: extractBilingualText(configData.footer?.companyInfo?.name || configData.footer?.companyName || configData.identity?.siteTitle || rawTheme.site_title || 'Restaurant', locale),
            companyDescription: extractBilingualText(configData.footer?.companyInfo?.description || configData.footer?.companyDescription || '', locale),
            address: extractBilingualText(configData.footer?.companyInfo?.address || configData.footer?.address || '', locale),
            phone: extractBilingualText(configData.footer?.companyInfo?.phone || configData.footer?.phone || '', locale),
            email: extractBilingualText(configData.footer?.companyInfo?.email || configData.footer?.email || '', locale),
            copyrightText: extractBilingualText(configData.footer?.copyrightText || `© ${new Date().getFullYear()} ${extractBilingualText(configData.identity?.siteTitle || rawTheme.site_title || 'Restaurant', locale)}. All rights reserved.`, locale),
            // Map sections from companyInfo.sections OR direct footerSections
            footerSections: (configData.footer?.sections || configData.footer?.footerSections || []).map((section: any) => ({
              id: section.id,
              title: extractBilingualText(section.title, locale),
              links: (section.links || []).map((link: any) => ({
                label: extractBilingualText(link.label, locale),
                href: link.href,
              })),
            })),
            socialLinks: (configData.footer?.socialLinks || []).map((link: any) => ({
              id: link.id,
              platform: link.platform,
              url: link.url,
            })),
            legalLinks: (configData.footer?.legalLinks || []).map((link: any) => ({
              label: extractBilingualText(link.label, locale),
              href: link.href,
            })),
            backgroundColor: configData.footer?.backgroundColor || '#1f2937',
            textColor: configData.footer?.textColor || '#ffffff',
            linkColor: configData.footer?.linkColor || '#3b82f6',
            padding: configData.footer?.padding || 48,
            columns: configData.footer?.columns || 3,
            layout: configData.footer?.layout || 'expanded',
            showLinks: configData.footer?.showLinks !== false,
            showLegal: configData.footer?.showLegal !== false,
            showBackToTop: configData.footer?.showBackToTop !== false,
          },

          // IMPORTANT: Extract components from config.components
          components: componentsFromConfig,
        };

        const homepageData: HomepageData = {
          theme: convertedTheme,
          components: componentsFromConfig,
          restaurant: innerData.restaurant ? {
            slug: innerData.restaurant.slug,
          } : undefined,
        };

        setHomepageData(homepageData);
      } catch (err) {
        let errorMessage = 'Failed to load restaurant';

        if (err instanceof Error) {
          if (err.name === 'AbortError') {
            errorMessage = 'Request timeout. API took too long to respond.';
          } else {
            errorMessage = err.message;
          }
        }

        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (restaurantSlug) {
      fetchHomepageData();
    }
  }, [restaurantSlug]);

  // CSS variables hook
  useEffect(() => {
    if (homepageData?.theme) {
      // Apply CSS variables for dynamic theming
      const root = document.documentElement;
      const colors = homepageData.theme.colors;
      const typography = homepageData.theme.typography;

      root.style.setProperty('--color-primary', colors.primary);
      root.style.setProperty('--color-secondary', colors.secondary);
      root.style.setProperty('--color-accent', colors.accent);
      root.style.setProperty('--color-background', colors.background);
      root.style.setProperty('--color-text', colors.text);
      root.style.setProperty('--color-border', colors.border);
      root.style.setProperty('--color-shadow', colors.shadow);
      root.style.setProperty('--font-family', typography.fontFamily);
      root.style.setProperty('--font-size-base', `${typography.baseFontSize}px`);
      root.style.setProperty('--border-radius', `${typography.borderRadius}px`);
      root.style.setProperty('--line-height', typography.lineHeight.toString());

      // Apply to body for global font
      document.body.style.fontFamily = typography.fontFamily;
    }
  }, [homepageData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading restaurant...</p>
        </div>
      </div>
    );
  }

  if (error || !homepageData?.theme) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="max-w-md w-full mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 dark:text-red-200 mb-1">Error Loading Restaurant</h3>
                <p className="text-sm text-red-800 dark:text-red-300">{error || 'Could not load restaurant'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const theme = homepageData.theme;
  const components = homepageData.components || theme.components || [];

  // Filter enabled components and sort by displayOrder
  const visibleComponents = components
    .filter(c => c.enabled)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const isRTL = locale === 'ar';

  return (
    <div className="bg-white dark:bg-gray-900" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Theme-based Header with unique styling per theme */}
      <Header
        config={theme.header}
        isArabic={isRTL}
        theme={theme}
      />

      {/* Main Content */}
      <main className="bg-white dark:bg-gray-900">
        {visibleComponents.length === 0 ? (
          <div className="min-h-screen flex items-center justify-center py-20">
            <div className="text-center max-w-2xl mx-auto px-4">
              <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                {theme.identity.siteTitle}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Welcome to our restaurant.
              </p>
            </div>
          </div>
        ) : (
          <>
            {visibleComponents.map(component => (
              <ErrorBoundary
                key={component.id}
                section={component.type}
                locale={locale}
              >
                <SectionRenderer
                  component={component as any}
                  isArabic={isRTL}
                />
              </ErrorBoundary>
            ))}

            {/* Featured Products Section with Real Data and Add to Cart */}
            <ErrorBoundary section="featured-products" locale={locale}>
              <FeaturedProductsSection
                restaurantSlug={restaurantSlug}
                locale={locale}
                limit={6}
              />
            </ErrorBoundary>
          </>
        )}
      </main>

      {/* Theme-based Footer with unique styling per theme */}
      <Footer
        config={theme.footer}
        isArabic={isRTL}
      />
    </div>
  );
}
