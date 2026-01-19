/**
 * @pos-saas/ui-components - Theme Presets
 *
 * Industry-specific theme presets with pre-configured colors,
 * typography, and component defaults for different business types.
 *
 * Public API exports all available themes.
 */

// Restaurant Theme
export { restaurantTheme, restaurantColors, restaurantColorScheme, restaurantTypography, restaurantDefaultComponents } from './restaurant'

// Retail Theme
export { retailTheme, retailColors, retailColorScheme, retailTypography, retailDefaultComponents } from './retail'

// Cafe Theme
export { cafeTheme, cafeColors, cafeColorScheme, cafeTypography } from './cafe'

// Services Theme
export { servicesTheme, servicesColors, servicesColorScheme, servicesTypography } from './services'

// Portfolio Theme
export { portfolioTheme, portfolioColors, portfolioColorScheme, portfolioTypography } from './portfolio'

// All themes registry
import { restaurantTheme } from './restaurant'
import { retailTheme } from './retail'
import { cafeTheme } from './cafe'
import { servicesTheme } from './services'
import { portfolioTheme } from './portfolio'

export const allThemes = {
  restaurant: restaurantTheme,
  retail: retailTheme,
  cafe: cafeTheme,
  services: servicesTheme,
  portfolio: portfolioTheme,
}

export const themesList = [
  restaurantTheme,
  retailTheme,
  cafeTheme,
  servicesTheme,
  portfolioTheme,
]

export default allThemes
