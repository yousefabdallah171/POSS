/**
 * Portfolio Theme
 *
 * Creative, bold theme designed for portfolio and creative businesses
 */

import portfolioColors, { portfolioColorScheme } from './colors'
import portfolioTypography from './typography'

export const portfolioTheme = {
  id: 'portfolio',
  name: 'Portfolio Theme',
  description: 'Creative, bold theme for portfolio businesses',
  icon: '🎨',
  industries: ['portfolio'],
  colors: portfolioColors,
  colorScheme: portfolioColorScheme,
  typography: portfolioTypography,
  defaultComponents: [],
  metadata: { author: 'POS SaaS Team', version: '1.0.0', created: '2025-01-01' },
}

export { portfolioColors, portfolioColorScheme, portfolioTypography }
export default portfolioTheme
