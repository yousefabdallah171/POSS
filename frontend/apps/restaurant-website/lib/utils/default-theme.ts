import type { ThemeData } from '@/lib/store/theme-store'

/**
 * Default theme to use as fallback when API fails
 * Based on a neutral, light design that works with the app
 */
export function getDefaultTheme(): ThemeData {
  return {
    name: 'Default Light',
    slug: 'default-light',
    description: 'Default light theme - used as fallback when theme API fails',

    colors: {
      primary: '#3b82f6', // Blue
      secondary: '#10b981', // Green
      accent: '#f59e0b', // Amber
      background: '#ffffff', // White
      text: '#1f2937', // Dark gray
      border: '#e5e7eb', // Light gray
      shadow: '#000000', // Black
    },

    typography: {
      font_family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      base_font_size: 16,
      line_height: 1.5,
      border_radius: 8,
    },

    identity: {
      site_title: 'Restaurant',
      logo_url: '',
      favicon_url: '',
    },

    header: {
      style: 'classic',
      sticky_nav: true,
      show_search: true,
      show_language: true,
      logo_url: '',
      show_logo: true,
      navigation_items: [
        {
          id: 'nav-menu',
          label: 'Menu',
          href: '/menu',
          order: 1,
        },
        {
          id: 'nav-cart',
          label: 'Cart',
          href: '/cart',
          order: 2,
        },
        {
          id: 'nav-orders',
          label: 'Orders',
          href: '/orders',
          order: 3,
        },
      ],
      background_color: '#3b82f6',
      text_color: '#ffffff',
      height: 64,
      padding: 16,
      show_shadow: true,
      sticky_header: true,
      hide_nav_on_mobile: false,
      nav_position: 'right',
    },

    footer: {
      style: 'classic',
      columns: 3,
      show_social: true,
      company_name: 'Restaurant',
      company_description: 'Delicious food, great service',
      address: '',
      phone: '',
      email: '',
      copyright_text: `© ${new Date().getFullYear()} Restaurant. All rights reserved.`,
      social_links: {
        facebook: 'https://facebook.com',
        instagram: 'https://instagram.com',
      },
      footer_sections: [
        {
          id: 'quick-links',
          title: 'Quick Links',
          links: [
            { label: 'Menu', href: '/menu' },
            { label: 'Orders', href: '/orders' },
            { label: 'Contact', href: '/#contact' },
          ],
        },
        {
          id: 'hours',
          title: 'Hours',
          content: 'Mon-Thu: 10am-9pm\nFri-Sat: 10am-10pm\nSun: 11am-8pm',
        },
      ],
      legal_links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
      ],
      background_color: '#1f2937',
      text_color: '#ffffff',
      show_links: true,
    },

    components: [
      {
        id: 'hero-1',
        type: 'hero',
        enabled: true,
        order: 1,
        title: 'Welcome to Our Restaurant',
        subtitle: 'Discover delicious food and great service',
        button_text: 'View Menu',
      },
      {
        id: 'why-us-1',
        type: 'why-choose-us',
        enabled: true,
        order: 2,
        title: 'Why Choose Us',
      },
      {
        id: 'featured-1',
        type: 'featured-items',
        enabled: true,
        order: 3,
        title: 'Featured Dishes',
      },
      {
        id: 'cta-1',
        type: 'cta',
        enabled: true,
        order: 4,
        title: 'Order Now',
        subtitle: 'Experience our cuisine',
      },
    ],
  }
}

/**
 * Dark theme variant of default
 * Used for dark mode fallback
 */
export function getDefaultDarkTheme(): ThemeData {
  const lightTheme = getDefaultTheme()

  return {
    ...lightTheme,
    name: 'Default Dark',
    slug: 'default-dark',
    description: 'Default dark theme - used as fallback when theme API fails',

    colors: {
      primary: '#60a5fa', // Light blue
      secondary: '#34d399', // Light green
      accent: '#fbbf24', // Light amber
      background: '#111827', // Very dark gray
      text: '#f3f4f6', // Very light gray
      border: '#374151', // Dark gray
      shadow: '#000000', // Black
    },

    header: {
      ...lightTheme.header,
      background_color: '#1f2937',
      text_color: '#f3f4f6',
    },

    footer: {
      ...lightTheme.footer,
      background_color: '#111827',
      text_color: '#f3f4f6',
    },
  }
}

/**
 * Get default theme based on system preference
 */
export function getDefaultThemeForSystem(): ThemeData {
  if (typeof window === 'undefined') {
    return getDefaultTheme()
  }

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDark ? getDefaultDarkTheme() : getDefaultTheme()
}
