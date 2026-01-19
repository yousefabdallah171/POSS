/**
 * Retail Theme
 *
 * Modern, vibrant theme designed for e-commerce and retail businesses
 * Features bold blue and green tones with trendy typography
 * Optimized for product showcase and conversion
 */

import retailColors, { retailColorScheme } from './colors'
import retailTypography from './typography'
import retailDefaultComponents from './default-components'

export const retailTheme = {
  id: 'retail',
  name: 'Retail Theme',
  description: 'Modern theme for retail and e-commerce businesses',
  icon: '🛍️',
  industries: ['retail', 'ecommerce'],

  // Color palette
  colors: retailColors,
  colorScheme: retailColorScheme,

  // Typography settings
  typography: retailTypography,

  // Pre-configured components
  defaultComponents: retailDefaultComponents,

  // Theme metadata
  metadata: {
    author: 'POS SaaS Team',
    version: '1.0.0',
    created: '2025-01-01',
    updated: '2025-01-01',
  },
}

export {
  retailColors,
  retailColorScheme,
  retailTypography,
  retailDefaultComponents,
}

export default retailTheme
