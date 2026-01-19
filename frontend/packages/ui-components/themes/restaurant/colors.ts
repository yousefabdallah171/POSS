/**
 * Restaurant Theme Color Palette
 *
 * Warm, inviting colors for restaurant businesses
 * Uses traditional brown and warm orange tones
 */

export const restaurantColors = {
  // Primary colors - Saddle brown palette
  primary: '#8B4513', // Saddle brown
  primaryLight: '#A0522D', // Sienna
  primaryDark: '#6B3410', // Darker brown

  // Secondary colors - Warm accents
  secondary: '#D2691E', // Chocolate
  secondaryLight: '#E8855C', // Coral brown
  secondaryDark: '#8B4513', // Back to primary

  // Tertiary colors - Cream/Beige accents
  tertiary: '#F5DEB3', // Wheat
  tertiaryLight: '#FFE4B5', // Moccasin
  tertiaryDark: '#DAA520', // Goldenrod

  // Neutral colors
  background: '#FFFAF0', // Floral white
  surface: '#FFF8DC', // Cornsilk
  muted: '#D2B48C', // Tan
  mutedText: '#654321', // Dark brown text

  // Functional colors
  success: '#228B22', // Forest green
  warning: '#FF8C00', // Dark orange
  error: '#DC143C', // Crimson
  info: '#4169E1', // Royal blue

  // Grayscale
  foreground: '#1F1F1F',
  text: '#333333',
  textMuted: '#666666',
  border: '#CCCCCC',
  divider: '#E5E5E5',
  white: '#FFFFFF',
  black: '#000000',
}

export const restaurantColorScheme = {
  light: {
    background: restaurantColors.background,
    foreground: restaurantColors.foreground,
    primary: restaurantColors.primary,
    secondary: restaurantColors.secondary,
    accent: restaurantColors.tertiary,
  },
  dark: {
    background: restaurantColors.primaryDark,
    foreground: restaurantColors.background,
    primary: restaurantColors.primaryLight,
    secondary: restaurantColors.secondaryLight,
    accent: restaurantColors.tertiaryLight,
  },
}

export default restaurantColors
