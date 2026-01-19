/**
 * Services Theme Color Palette
 *
 * Professional, trustworthy colors for service businesses
 * Uses clean blues and grays for a professional look
 */

export const servicesColors = {
  primary: '#1E40AF', // Professional blue
  primaryLight: '#3B82F6', // Light blue
  primaryDark: '#0F2A5D', // Dark blue
  secondary: '#64748B', // Slate gray
  secondaryLight: '#94A3B8', // Light slate
  secondaryDark: '#334155', // Dark slate
  tertiary: '#06B6D4', // Cyan
  tertiaryLight: '#22D3EE', // Light cyan
  tertiaryDark: '#0891B2', // Dark cyan
  background: '#FFFFFF',
  surface: '#F8FAFC',
  muted: '#E2E8F0',
  mutedText: '#475569',
  success: '#16A34A',
  warning: '#EA580C',
  error: '#DC2626',
  info: '#1E40AF',
  foreground: '#0F172A',
  text: '#1E293B',
  textMuted: '#64748B',
  border: '#CBD5E1',
  divider: '#E2E8F0',
  white: '#FFFFFF',
  black: '#000000',
}

export const servicesColorScheme = {
  light: {
    background: servicesColors.background,
    foreground: servicesColors.foreground,
    primary: servicesColors.primary,
    secondary: servicesColors.secondary,
    accent: servicesColors.tertiary,
  },
  dark: {
    background: servicesColors.primaryDark,
    foreground: servicesColors.background,
    primary: servicesColors.primaryLight,
    secondary: servicesColors.secondaryLight,
    accent: servicesColors.tertiaryLight,
  },
}

export default servicesColors
