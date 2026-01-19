/**
 * Cafe Theme
 *
 * Warm, cozy theme designed for cafe businesses
 */

import cafeColors, { cafeColorScheme } from './colors'
import cafeTypography from './typography'

export const cafeTheme = {
  id: 'cafe',
  name: 'Cafe Theme',
  description: 'Warm, cozy theme for cafe businesses',
  icon: '☕',
  industries: ['cafe'],
  colors: cafeColors,
  colorScheme: cafeColorScheme,
  typography: cafeTypography,
  defaultComponents: [],
  metadata: { author: 'POS SaaS Team', version: '1.0.0', created: '2025-01-01' },
}

export { cafeColors, cafeColorScheme, cafeTypography }
export default cafeTheme
