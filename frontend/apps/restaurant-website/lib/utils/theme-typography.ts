'use client'

import type { ThemeTypography } from '@/lib/store/theme-store'

/**
 * Apply typography settings to DOM
 * Injects CSS variables for font family, size, line height, border radius
 */
export function applyTypographyVariables(typography: ThemeTypography): void {
  if (typeof document === 'undefined') return

  requestAnimationFrame(() => {
    const root = document.documentElement

    // Set font family
    if (typography.font_family) {
      root.style.setProperty('--theme-font-family', typography.font_family)
    }

    // Set base font size (in px)
    if (typography.base_font_size) {
      root.style.setProperty('--theme-font-size', `${typography.base_font_size}px`)
    }

    // Set line height
    if (typography.line_height) {
      root.style.setProperty('--theme-line-height', `${typography.line_height}`)
    }

    // Set border radius
    if (typography.border_radius) {
      root.style.setProperty('--theme-border-radius', `${typography.border_radius}px`)
    }

    // Apply font family globally
    if (typography.font_family) {
      document.documentElement.style.fontFamily = typography.font_family
    }

    // Apply base font size to body
    if (typography.base_font_size) {
      const bodyElements = document.querySelectorAll('body')
      bodyElements.forEach((el) => {
        el.style.fontSize = `${typography.base_font_size}px`
      })
    }
  })
}

/**
 * Get typography CSS for inline styles
 * Useful for styled-components or inline style attributes
 */
export function getTypographyStyles(typography: ThemeTypography): Record<string, string | number> {
  return {
    fontFamily: typography.font_family || 'inherit',
    fontSize: `${typography.base_font_size || 16}px`,
    lineHeight: `${typography.line_height || 1.5}`,
    borderRadius: `${typography.border_radius || 8}px`,
  }
}

/**
 * Get font family CSS custom property
 */
export function getFontFamily(typography: ThemeTypography): string {
  return `var(--theme-font-family, ${typography.font_family})`
}

/**
 * Get font size CSS custom property
 */
export function getFontSize(typography: ThemeTypography): string {
  return `var(--theme-font-size, ${typography.base_font_size}px)`
}

/**
 * Get line height CSS custom property
 */
export function getLineHeight(typography: ThemeTypography): string {
  return `var(--theme-line-height, ${typography.line_height})`
}

/**
 * Get border radius CSS custom property
 */
export function getBorderRadius(typography: ThemeTypography): string {
  return `var(--theme-border-radius, ${typography.border_radius}px)`
}

/**
 * Validate typography data
 */
export function isValidTypography(typography: any): typography is ThemeTypography {
  return (
    typography &&
    typeof typography === 'object' &&
    typeof typography.font_family === 'string' &&
    typeof typography.base_font_size === 'number' &&
    typeof typography.line_height === 'number' &&
    typeof typography.border_radius === 'number'
  )
}
