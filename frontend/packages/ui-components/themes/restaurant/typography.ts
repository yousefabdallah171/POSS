/**
 * Restaurant Theme Typography
 *
 * Elegant serif fonts for restaurant branding
 * Georgia for headings (classic, elegant)
 * Segoe UI for body (readable, modern)
 */

export const restaurantTypography = {
  // Font families
  headingFont: '"Georgia", "Times New Roman", serif',
  bodyFont: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  monoFont: '"Courier New", Courier, monospace',

  // Heading styles
  h1: {
    fontSize: '3rem',
    fontWeight: 700,
    lineHeight: 1.2,
    fontFamily: '"Georgia", "Times New Roman", serif',
    letterSpacing: '-0.02em',
  },
  h2: {
    fontSize: '2.25rem',
    fontWeight: 700,
    lineHeight: 1.3,
    fontFamily: '"Georgia", "Times New Roman", serif',
    letterSpacing: '-0.01em',
  },
  h3: {
    fontSize: '1.875rem',
    fontWeight: 600,
    lineHeight: 1.4,
    fontFamily: '"Georgia", "Times New Roman", serif',
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.5,
    fontFamily: '"Georgia", "Times New Roman", serif',
  },
  h5: {
    fontSize: '1.25rem',
    fontWeight: 600,
    lineHeight: 1.5,
    fontFamily: '"Segoe UI", sans-serif',
  },
  h6: {
    fontSize: '1rem',
    fontWeight: 600,
    lineHeight: 1.6,
    fontFamily: '"Segoe UI", sans-serif',
  },

  // Body styles
  body: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.6,
    fontFamily: '"Segoe UI", sans-serif',
  },
  bodySmall: {
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.5,
    fontFamily: '"Segoe UI", sans-serif',
  },
  bodyLarge: {
    fontSize: '1.125rem',
    fontWeight: 400,
    lineHeight: 1.7,
    fontFamily: '"Segoe UI", sans-serif',
  },

  // Special styles
  caption: {
    fontSize: '0.75rem',
    fontWeight: 500,
    lineHeight: 1.4,
    fontFamily: '"Segoe UI", sans-serif',
  },
  button: {
    fontSize: '1rem',
    fontWeight: 600,
    lineHeight: 1.5,
    fontFamily: '"Segoe UI", sans-serif',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: 600,
    lineHeight: 1.5,
    fontFamily: '"Segoe UI", sans-serif',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.03em',
  },
}

export default restaurantTypography
