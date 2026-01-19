/**
 * Retail Theme Color Palette
 *
 * Vibrant, modern colors for retail/e-commerce businesses
 * Uses bold blue and green accent tones
 */

export const retailColors = {
  // Primary colors - Modern blue palette
  primary: '#0066CC', // Bright blue
  primaryLight: '#3385FF', // Light blue
  primaryDark: '#004499', // Dark blue

  // Secondary colors - Vibrant green
  secondary: '#00AA44', // Vibrant green
  secondaryLight: '#33CC77', // Light green
  secondaryDark: '#007722', // Dark green

  // Tertiary colors - Complementary accents
  tertiary: '#FF6B35', // Coral orange
  tertiaryLight: '#FFB366', // Light coral
  tertiaryDark: '#CC3300', // Dark coral

  // Neutral colors
  background: '#FFFFFF', // Pure white
  surface: '#F5F5F5', // Off-white
  muted: '#E0E0E0', // Light gray
  mutedText: '#555555', // Gray text

  // Functional colors
  success: '#00AA44', // Green
  warning: '#FFAA00', // Orange
  error: '#DD0000', // Red
  info: '#0066CC', // Blue

  // Grayscale
  foreground: '#1A1A1A',
  text: '#222222',
  textMuted: '#777777',
  border: '#DDDDDD',
  divider: '#EEEEEE',
  white: '#FFFFFF',
  black: '#000000',
}

export const retailColorScheme = {
  light: {
    background: retailColors.background,
    foreground: retailColors.foreground,
    primary: retailColors.primary,
    secondary: retailColors.secondary,
    accent: retailColors.tertiary,
  },
  dark: {
    background: retailColors.primaryDark,
    foreground: retailColors.background,
    primary: retailColors.primaryLight,
    secondary: retailColors.secondaryLight,
    accent: retailColors.tertiaryLight,
  },
}

export default retailColors
