/**
 * Portfolio Theme Color Palette
 *
 * Creative, bold colors for portfolio and creative businesses
 * Uses vibrant colors and modern tones
 */

export const portfolioColors = {
  primary: '#7C3AED', // Vibrant purple
  primaryLight: '#A78BFA', // Light purple
  primaryDark: '#5B21B6', // Dark purple
  secondary: '#EC4899', // Hot pink
  secondaryLight: '#F472B6', // Light pink
  secondaryDark: '#BE185D', // Dark pink
  tertiary: '#F59E0B', // Amber
  tertiaryLight: '#FBBF24', // Light amber
  tertiaryDark: '#B45309', // Dark amber
  background: '#FFFFFF',
  surface: '#F9FAFB',
  muted: '#F3F4F6',
  mutedText: '#6B7280',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#7C3AED',
  foreground: '#111827',
  text: '#1F2937',
  textMuted: '#6B7280',
  border: '#E5E7EB',
  divider: '#F3F4F6',
  white: '#FFFFFF',
  black: '#000000',
}

export const portfolioColorScheme = {
  light: {
    background: portfolioColors.background,
    foreground: portfolioColors.foreground,
    primary: portfolioColors.primary,
    secondary: portfolioColors.secondary,
    accent: portfolioColors.tertiary,
  },
  dark: {
    background: portfolioColors.primaryDark,
    foreground: portfolioColors.background,
    primary: portfolioColors.primaryLight,
    secondary: portfolioColors.secondaryLight,
    accent: portfolioColors.tertiaryLight,
  },
}

export default portfolioColors
