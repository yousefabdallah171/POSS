'use client'

import { useState } from 'react'
import { useThemeStore } from '@/hooks/useThemeStore'
import { SectionRenderer } from '@pos-saas/ui-themes'
import { Smartphone, Monitor, Tablet, RefreshCw } from 'lucide-react'
import { mockRestaurantData } from '@/lib/mockData'

// Helper function to extract label from translation objects
function extractLabel(label: any): string {
  if (typeof label === 'string') return label
  if (label && typeof label === 'object') {
    // Handle translation objects like {en: "...", ar: "..."}
    return label.en || label.ar || Object.values(label)[0] || ''
  }
  return ''
}

// Helper function to enrich component with mock data
function enrichComponentWithMockData(component: any) {
  const enriched = { ...component }

  // Add mock data based on component type
  switch (component.type?.toLowerCase()) {
    case 'hero':
      enriched.mockData = mockRestaurantData.hero
      break
    case 'featured-items':
    case 'products':
      enriched.mockData = {
        items: mockRestaurantData.menu?.items || []
      }
      break
    case 'testimonials':
      enriched.mockData = {
        testimonials: mockRestaurantData.testimonials || []
      }
      break
    case 'contact':
      enriched.mockData = {
        contactInfo: mockRestaurantData.contact || {}
      }
      break
    case 'cta':
      enriched.mockData = mockRestaurantData.cta
      break
    case 'why-choose-us':
      enriched.mockData = {
        reasons: mockRestaurantData.whyChooseUs || []
      }
      break
    case 'info-cards':
      enriched.mockData = {
        cards: mockRestaurantData.infoCards || []
      }
      break
  }

  return enriched
}

export function EditorPreview() {
  const theme = useThemeStore((state) => state.currentTheme)
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [isArabic, setIsArabic] = useState(false)

  if (!theme) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-900 text-gray-500">
        No theme selected
      </div>
    )
  }

  // Provide safe defaults for colors and typography
  const colors = {
    primary: theme.colors?.primary || '#3b82f6',
    secondary: theme.colors?.secondary || '#1e40af',
    accent: theme.colors?.accent || '#0ea5e9',
    background: theme.colors?.background || '#ffffff',
    text: theme.colors?.text || '#1f2937',
    border: theme.colors?.border || '#e5e7eb',
    shadow: theme.colors?.shadow || '#1f2937',
  }

  const typography = {
    fontFamily: theme.typography?.fontFamily || 'Inter',
    baseFontSize: theme.typography?.baseFontSize || 14,
    borderRadius: theme.typography?.borderRadius || 8,
    lineHeight: theme.typography?.lineHeight || 1.5,
  }

  // Safe defaults for header
  const header = {
    logoUrl: theme.header?.logoUrl || '',
    logoText: theme.header?.logoText || 'Restaurant',
    logoHeight: theme.header?.logoHeight || 40,
    showLogo: theme.header?.showLogo !== false,
    navigationItems: theme.header?.navigationItems || [],
    navPosition: theme.header?.navPosition || ('right' as const),
    navAlignment: theme.header?.navAlignment || ('horizontal' as const),
    backgroundColor: theme.header?.backgroundColor || '#3b82f6',
    textColor: theme.header?.textColor || '#ffffff',
    height: theme.header?.height || 64,
    padding: theme.header?.padding || 16,
    stickyHeader: theme.header?.stickyHeader || false,
    showShadow: theme.header?.showShadow !== false,
    hideNavOnMobile: theme.header?.hideNavOnMobile || false,
  }

  // Safe defaults for footer
  const footer = {
    companyName: theme.footer?.companyName || 'Restaurant',
    companyDescription: theme.footer?.companyDescription || '',
    address: theme.footer?.address || '',
    phone: theme.footer?.phone || '',
    email: theme.footer?.email || '',
    copyrightText: theme.footer?.copyrightText || '',
    socialLinks: theme.footer?.socialLinks || [],
    footerSections: theme.footer?.footerSections || [],
    legalLinks: theme.footer?.legalLinks || [],
    backgroundColor: theme.footer?.backgroundColor || '#1f2937',
    textColor: theme.footer?.textColor || '#ffffff',
    linkColor: theme.footer?.linkColor || '#3b82f6',
    padding: theme.footer?.padding || 48,
    showLinks: theme.footer?.showLinks !== false,
    showLegal: theme.footer?.showLegal !== false,
    showBackToTop: theme.footer?.showBackToTop !== false,
    columns: theme.footer?.columns || 3,
    layout: theme.footer?.layout || ('expanded' as const),
  }

  const getCSSVariables = () => {
    return `
      :root {
        --color-primary: ${colors.primary};
        --color-secondary: ${colors.secondary};
        --color-accent: ${colors.accent};
        --color-background: ${colors.background};
        --color-text: ${colors.text};
        --color-border: ${colors.border};
        --color-shadow: ${colors.shadow};
        --font-family: ${typography.fontFamily};
        --font-size-base: ${typography.baseFontSize}px;
        --border-radius: ${typography.borderRadius}px;
        --line-height: ${typography.lineHeight};
      }
      ${theme.customCss || ''}
    `
  }

  return (
    <div className="h-full flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Live Preview</h3>

          {/* Language Toggle */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setIsArabic(false)}
              className={`px-2 py-1 rounded-md text-xs font-medium transition ${
                !isArabic
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setIsArabic(true)}
              className={`px-2 py-1 rounded-md text-xs font-medium transition ${
                isArabic
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              العربية
            </button>
          </div>

          {/* Device & Refresh Controls */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('desktop')}
              title="Desktop"
              className={`px-3 py-1 rounded-md text-sm transition flex items-center gap-1 ${
                viewMode === 'desktop'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Monitor className="h-4 w-4" />
              Desktop
            </button>
            <button
              onClick={() => setViewMode('tablet')}
              title="Tablet"
              className={`px-3 py-1 rounded-md text-sm transition flex items-center gap-1 ${
                viewMode === 'tablet'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Tablet className="h-4 w-4" />
              Tablet
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              title="Mobile"
              className={`px-3 py-1 rounded-md text-sm transition flex items-center gap-1 ${
                viewMode === 'mobile'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Smartphone className="h-4 w-4" />
              Mobile
            </button>
          </div>

          <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition" title="Refresh preview">
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-auto p-6 flex items-start justify-center">
        <div
          className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all ${
            viewMode === 'mobile' ? 'w-96 max-w-full' : viewMode === 'tablet' ? 'w-[768px] max-w-full' : 'w-full'
          }`}
        >
          {/* Preview Content */}
          <div
            dir={isArabic ? 'rtl' : 'ltr'}
            style={{
              backgroundColor: colors.background,
              color: colors.text,
              fontFamily: typography.fontFamily,
              fontSize: `${typography.baseFontSize}px`,
              lineHeight: typography.lineHeight,
            }}
            className="min-h-screen"
          >
            {/* CSS Variables */}
            <style>{getCSSVariables()}</style>

            {/* Header - Customizable */}
            <div
              style={{
                backgroundColor: header.backgroundColor,
                color: header.textColor,
                height: `${header.height}px`,
                padding: `0 ${header.padding || 16}px`,
                boxShadow: header.showShadow ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                position: header.stickyHeader ? 'sticky' : 'relative',
                top: 0,
                zIndex: 50,
              }}
            >
              <div className="h-full flex items-center justify-between">
                {/* Logo Section */}
                <div className="flex items-center gap-4">
                  {header.showLogo && (header.logoUrl || header.logoText) && (
                    <>
                      {header.logoUrl && (
                        <img
                          src={header.logoUrl}
                          alt={theme.identity?.siteTitle || 'Logo'}
                          style={{ height: `${header.logoHeight || 40}px` }}
                          className="object-contain"
                        />
                      )}
                      {header.logoText && (
                        <span className="font-bold text-lg">{header.logoText}</span>
                      )}
                    </>
                  )}
                </div>

                {/* Navigation */}
                {viewMode === 'desktop' && (
                  <nav
                    className="hidden md:flex gap-6 text-sm"
                    style={{
                      justifyContent:
                        header.navPosition === 'left'
                          ? 'flex-start'
                          : header.navPosition === 'center'
                            ? 'center'
                            : 'flex-end',
                      flex: 1,
                      marginLeft: header.navPosition === 'left' ? '2rem' : '0',
                    }}
                  >
                    {(header.navigationItems || []).map((item) => (
                      <a
                        key={item.id || extractLabel(item.label)}
                        href={item.href}
                        className="hover:opacity-80 transition"
                      >
                        {extractLabel(item.label)}
                      </a>
                    ))}
                  </nav>
                )}
              </div>
            </div>

            {/* Page Components */}
            {theme.components && Array.isArray(theme.components) && theme.components.length > 0 && (
              <div>
                {theme.components
                  .filter((c) => c.enabled)
                  .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
                  .map((component) => {
                    // Enrich component with mock data
                    const enrichedComponent = enrichComponentWithMockData(component)
                    return (
                      <div key={component.id} className="w-full">
                        <SectionRenderer
                          component={enrichedComponent}
                          isArabic={isArabic}
                        />
                      </div>
                    )
                  })}
              </div>
            )}

            {/* Footer - Customizable */}
            <div
              style={{
                backgroundColor: footer.backgroundColor,
                color: footer.textColor,
                padding: `${footer.padding || 48}px ${footer.padding || 48}px`,
              }}
              className="text-sm"
            >
              <div className="max-w-4xl mx-auto">
                {/* Company Info */}
                <div className="mb-8">
                  <h4 className="font-semibold mb-2 text-lg">{footer.companyName}</h4>
                  {footer.companyDescription && (
                    <p className="opacity-80 mb-4">{footer.companyDescription}</p>
                  )}
                  <div className="space-y-1 opacity-80 text-sm">
                    {footer.address && <p>{footer.address}</p>}
                    {footer.phone && <p>{footer.phone}</p>}
                    {footer.email && <p>{footer.email}</p>}
                  </div>
                </div>

                {/* Footer Sections Grid */}
                {footer.footerSections && footer.footerSections.length > 0 && (
                  <div className={`grid grid-cols-1 ${footer.columns === 2 ? 'md:grid-cols-2' : footer.columns === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-8 mb-8`}>
                    {footer.footerSections.map((section) => (
                      <div key={section.id || extractLabel(section.title)}>
                        <h4 className="font-semibold mb-3">{extractLabel(section.title)}</h4>
                        <ul className="space-y-2">
                          {section.links.map((link) => (
                            <li key={extractLabel(link.label)}>
                              <a
                                href={link.href}
                                style={{ color: footer.linkColor || footer.textColor }}
                                className="hover:opacity-80 transition"
                              >
                                {extractLabel(link.label)}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {/* Social Links */}
                {footer.showLinks && footer.socialLinks && footer.socialLinks.length > 0 && (
                  <div className="mb-8">
                    <h4 className="font-semibold mb-3">Follow Us</h4>
                    <div className="flex gap-4 flex-wrap">
                      {footer.socialLinks.map((link) => (
                        <a
                          key={link.id || link.platform}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: footer.linkColor || footer.textColor }}
                          className="hover:opacity-80 transition capitalize"
                        >
                          {link.platform}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Legal Links */}
                {footer.showLegal && footer.legalLinks && footer.legalLinks.length > 0 && (
                  <div className="mb-6">
                    <div className="flex gap-4 flex-wrap justify-center opacity-80 text-xs">
                      {footer.legalLinks.map((link, idx) => (
                        <div key={extractLabel(link.label)}>
                          {idx > 0 && <span className="mr-4">|</span>}
                          <a
                            href={link.href}
                            style={{ color: footer.linkColor || footer.textColor }}
                            className="hover:opacity-100 transition"
                          >
                            {extractLabel(link.label)}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Copyright */}
                <div
                  style={{
                    borderColor: footer.textColor + '30',
                  }}
                  className="border-t pt-6 text-center opacity-80"
                >
                  <p>{footer.copyrightText}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
