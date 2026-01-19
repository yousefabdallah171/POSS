/**
 * Restaurant Theme
 *
 * A warm and inviting theme designed for restaurant businesses
 * Features classic brown tones and elegant serif typography
 * Optimized for food industry marketing
 */

import restaurantColors, { restaurantColorScheme } from './colors'
import restaurantTypography from './typography'
import restaurantDefaultComponents from './default-components'

export const restaurantTheme = {
  id: 'restaurant',
  name: 'Restaurant Theme',
  description: 'Warm, inviting theme for restaurant businesses',
  icon: '🍽️',
  industries: ['restaurant'],

  // Color palette
  colors: restaurantColors,
  colorScheme: restaurantColorScheme,

  // Typography settings
  typography: restaurantTypography,

  // Pre-configured components
  defaultComponents: restaurantDefaultComponents,

  // Theme metadata
  metadata: {
    author: 'POS SaaS Team',
    version: '1.0.0',
    created: '2025-01-01',
    updated: '2025-01-01',
  },
}

export {
  restaurantColors,
  restaurantColorScheme,
  restaurantTypography,
  restaurantDefaultComponents,
}

export default restaurantTheme
