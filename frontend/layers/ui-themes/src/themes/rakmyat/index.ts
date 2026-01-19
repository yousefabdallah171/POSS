/**
 * Rakmyat Restaurant Theme
 * This is a data-driven theme configuration with no hardcoded content.
 * All content must come from the database via API.
 */

import { ThemeData } from '../../types'

export const RAKMYAT_THEME_BASE: Omit<ThemeData, 'id' | 'restaurantId' | 'tenantId' | 'createdAt' | 'updatedAt'> = {
  name: 'Rakmyat',
  slug: 'rakmyat',
  version: 1,
  isActive: false,
  isPublished: false,

  // Colors - Professional restaurant theme
  colors: {
    primary: '#8B4513', // Saddle brown for food theme
    secondary: '#D2691E', // Chocolate brown
    accent: '#FF8C00', // Dark orange for highlights
    background: '#FFFAF0', // Floral white
    text: '#2F1F0F', // Dark brown text
    border: '#DEB887', // Burlywood
    shadow: '#000000', // Black for shadows
  },

  // Typography settings
  typography: {
    fontFamily: 'Georgia, serif', // Elegant serif for restaurants
    baseFontSize: 16,
    borderRadius: 4,
    lineHeight: 1.6,
    fontWeights: [400, 700],
    fontSize: 16,
    fontStyle: 'normal',
  },

  // Website identity - will be populated from API
  identity: {
    siteTitle: '', // From API
  },

  // Header configuration - will be populated from API
  header: {
    logoUrl: '', // From API
    logoText: '', // From API
    logoHeight: 50,
    showLogo: true,
    navigationItems: [], // From API - no hardcoded items
    navPosition: 'center',
    navAlignment: 'horizontal',
    backgroundColor: '#8B4513', // Primary color
    textColor: '#FFFAF0', // Light text
    height: 80,
    padding: 20,
    stickyHeader: true,
    showShadow: true,
    hideNavOnMobile: false,
  },

  // Footer configuration - will be populated from API
  footer: {
    companyName: '', // From API
    companyDescription: '', // From API
    address: '', // From API
    phone: '', // From API
    email: '', // From API
    copyrightText: '', // From API
    socialLinks: [], // From API
    footerSections: [], // From API
    legalLinks: [], // From API
    backgroundColor: '#2F1F0F', // Dark brown
    textColor: '#FFFAF0', // Light text
    linkColor: '#FF8C00', // Accent color
    padding: 60,
    showLinks: true,
    showLegal: true,
    showBackToTop: true,
    columns: 3,
    layout: 'expanded',
  },

  // Page components - will be managed via drag-drop editor
  components: [],

  // Custom CSS - user can add custom styles
  customCss: '',
}

export default RAKMYAT_THEME_BASE
