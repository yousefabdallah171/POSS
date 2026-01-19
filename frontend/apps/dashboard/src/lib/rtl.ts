import { Locale } from '@/i18n/config'

const RTL_LOCALES = ['ar']

export function isRTL(locale: Locale | string): boolean {
  return RTL_LOCALES.includes(locale as any)
}

export function getDirection(locale: Locale | string): 'rtl' | 'ltr' {
  return isRTL(locale) ? 'rtl' : 'ltr'
}

export function getDirectionClass(locale: Locale | string): string {
  return isRTL(locale) ? 'rtl' : 'ltr'
}

export function getTextAlignment(locale: Locale | string): 'right' | 'left' {
  return isRTL(locale) ? 'right' : 'left'
}

export function getFlexDirection(locale: Locale | string, baseDirection: 'row' | 'col' = 'row'): string {
  if (isRTL(locale)) {
    return baseDirection === 'row' ? 'flex-row-reverse' : 'flex-col'
  }
  return baseDirection === 'row' ? 'flex-row' : 'flex-col'
}

export function getMarginClass(locale: Locale | string, direction: 'left' | 'right', size: string): string {
  if (isRTL(locale)) {
    return direction === 'left' ? `mr-${size}` : `ml-${size}`
  }
  return direction === 'left' ? `ml-${size}` : `mr-${size}`
}

export function getPaddingClass(locale: Locale | string, direction: 'left' | 'right', size: string): string {
  if (isRTL(locale)) {
    return direction === 'left' ? `pr-${size}` : `pl-${size}`
  }
  return direction === 'left' ? `pl-${size}` : `pr-${size}`
}

export function getTransformClass(locale: Locale | string, baseClass: string): string {
  if (isRTL(locale)) {
    // Rotate icons for RTL
    if (baseClass.includes('chevron') || baseClass.includes('arrow')) {
      return `${baseClass} scale-x-[-1]`
    }
  }
  return baseClass
}

export function applyRTLStyles(locale: Locale | string) {
  if (typeof window !== 'undefined') {
    const direction = getDirection(locale)
    const html = document.documentElement

    html.dir = direction
    html.lang = locale.toString()

    if (direction === 'rtl') {
      html.style.direction = 'rtl'
      html.style.textAlign = 'right'
    } else {
      html.style.direction = 'ltr'
      html.style.textAlign = 'left'
    }
  }
}

export function getPlacement(locale: Locale | string, placement: 'left' | 'right'): 'left' | 'right' {
  if (isRTL(locale)) {
    return placement === 'left' ? 'right' : 'left'
  }
  return placement
}

export function formatNumberWithLocale(locale: Locale | string, number: number): string {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-US').format(number)
}

export function formatCurrencyWithLocale(
  locale: Locale | string,
  amount: number,
  currency: string = 'USD'
): string {
  const localeString = locale === 'ar' ? 'ar-SA' : 'en-US'
  return new Intl.NumberFormat(localeString, {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

export function formatDateWithLocale(locale: Locale | string, date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const localeString = locale === 'ar' ? 'ar-SA' : 'en-US'
  return new Intl.DateTimeFormat(localeString, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj)
}
