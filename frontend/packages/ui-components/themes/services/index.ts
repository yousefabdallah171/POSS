/**
 * Services Theme
 *
 * Professional theme designed for service businesses
 */

import servicesColors, { servicesColorScheme } from './colors'
import servicesTypography from './typography'

export const servicesTheme = {
  id: 'services',
  name: 'Services Theme',
  description: 'Professional theme for service businesses',
  icon: '🏢',
  industries: ['services'],
  colors: servicesColors,
  colorScheme: servicesColorScheme,
  typography: servicesTypography,
  defaultComponents: [],
  metadata: { author: 'POS SaaS Team', version: '1.0.0', created: '2025-01-01' },
}

export { servicesColors, servicesColorScheme, servicesTypography }
export default servicesTheme
