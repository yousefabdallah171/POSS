/**
 * Cafe Theme Typography
 *
 * Friendly, approachable fonts for cafe businesses
 */

export const cafeTypography = {
  headingFont: '"Quicksand", "-apple-system", "BlinkMacSystemFont", sans-serif',
  bodyFont: '"Open Sans", "Segoe UI", sans-serif',
  monoFont: '"Courier New", Courier, monospace',

  h1: { fontSize: '3rem', fontWeight: 700, lineHeight: 1.2 },
  h2: { fontSize: '2.25rem', fontWeight: 700, lineHeight: 1.3 },
  h3: { fontSize: '1.875rem', fontWeight: 600, lineHeight: 1.4 },
  h4: { fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.5 },
  h5: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.5 },
  h6: { fontSize: '1rem', fontWeight: 600, lineHeight: 1.6 },

  body: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.6 },
  bodySmall: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.5 },
  bodyLarge: { fontSize: '1.125rem', fontWeight: 400, lineHeight: 1.7 },

  caption: { fontSize: '0.75rem', fontWeight: 500, lineHeight: 1.4 },
  button: { fontSize: '1rem', fontWeight: 600, lineHeight: 1.5, textTransform: 'uppercase' as const },
  label: { fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.5 },
}

export default cafeTypography
