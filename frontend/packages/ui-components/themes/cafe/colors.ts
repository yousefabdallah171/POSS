/**
 * Cafe Theme Color Palette
 *
 * Warm, cozy colors for cafe businesses
 * Uses warm browns, oranges, and cream tones
 */

export const cafeColors = {
  primary: '#6B4423', // Warm brown
  primaryLight: '#8B5A3C', // Light brown
  primaryDark: '#4A2E1C', // Dark brown
  secondary: '#D97E3A', // Warm orange
  secondaryLight: '#E8A85C', // Light orange
  secondaryDark: '#B85C1F', // Dark orange
  tertiary: '#F5DEB3', // Wheat
  tertiaryLight: '#FFE4B5', // Moccasin
  tertiaryDark: '#DAA520', // Goldenrod
  background: '#FFFAF0', // Floral white
  surface: '#FFF8DC', // Cornsilk
  muted: '#D2B48C', // Tan
  mutedText: '#654321', // Dark brown
  success: '#7CB342', // Light green
  warning: '#FF8A65', // Orange
  error: '#E53935', // Red
  info: '#42A5F5', // Blue
  foreground: '#2C1810',
  text: '#3E2723',
  textMuted: '#795548',
  border: '#BCAAA4',
  divider: '#D7CCC8',
  white: '#FFFFFF',
  black: '#000000',
}

export const cafeColorScheme = {
  light: {
    background: cafeColors.background,
    foreground: cafeColors.foreground,
    primary: cafeColors.primary,
    secondary: cafeColors.secondary,
    accent: cafeColors.tertiary,
  },
  dark: {
    background: cafeColors.primaryDark,
    foreground: cafeColors.background,
    primary: cafeColors.primaryLight,
    secondary: cafeColors.secondaryLight,
    accent: cafeColors.tertiaryLight,
  },
}

export default cafeColors
