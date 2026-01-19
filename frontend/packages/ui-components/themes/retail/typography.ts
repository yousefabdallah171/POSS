/**
 * Retail Theme Typography
 *
 * Modern sans-serif fonts for retail/e-commerce
 * Poppins for headings (trendy, clean)
 * Segoe UI for body (readable, modern)
 */

export const retailTypography = {
  // Font families
  headingFont: '"Poppins", "-apple-system", "BlinkMacSystemFont", "Segoe UI", sans-serif',
  bodyFont: '"Segoe UI", "Roboto", "-apple-system", sans-serif',
  monoFont: '"Courier New", Courier, monospace',

  // Heading styles
  h1: {
    fontSize: '3.5rem',
    fontWeight: 800,
    lineHeight: 1.1,
    fontFamily: '"Poppins", sans-serif',
    letterSpacing: '-0.03em',
  },
  h2: {
    fontSize: '2.5rem',
    fontWeight: 700,
    lineHeight: 1.2,
    fontFamily: '"Poppins", sans-serif',
    letterSpacing: '-0.02em',
  },
  h3: {
    fontSize: '2rem',
    fontWeight: 700,
    lineHeight: 1.3,
    fontFamily: '"Poppins", sans-serif',
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.4,
    fontFamily: '"Poppins", sans-serif',
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
    fontWeight: 700,
    lineHeight: 1.5,
    fontFamily: '"Poppins", sans-serif',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: 600,
    lineHeight: 1.5,
    fontFamily: '"Segoe UI", sans-serif',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.04em',
  },
}

export default retailTypography
