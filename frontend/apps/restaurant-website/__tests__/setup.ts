/**
 * Test utilities and helpers for component testing
 */

import { ReactNode } from 'react'

/**
 * Wait for async operations with custom timeout
 */
export async function waitFor(
  callback: () => void,
  options: { timeout?: number; interval?: number } = {}
) {
  const { timeout = 1000, interval = 50 } = options
  const startTime = Date.now()

  while (Date.now() - startTime < timeout) {
    try {
      callback()
      return
    } catch {
      await new Promise(resolve => setTimeout(resolve, interval))
    }
  }

  throw new Error(`Timeout waiting for condition after ${timeout}ms`)
}

/**
 * Mock data generators for common entities
 */
export const mockData = {
  theme: (overrides = {}) => ({
    id: 'theme-1',
    name: 'Ocean Blue',
    description: 'A serene ocean-inspired theme',
    colors: {
      primary: '#0ea5e9',
      secondary: '#06b6d4',
      accent: '#f97316',
      background: '#ffffff',
      foreground: '#1f2937',
      muted: '#e5e7eb',
      'muted-foreground': '#6b7280',
      border: '#e5e7eb',
      input: '#f3f4f6',
      ring: '#0ea5e9',
    },
    typography: {
      fontFamily: 'sans-serif',
      fontSize: '16px',
      lineHeight: '1.5',
    },
    header: {
      background_color: '#ffffff',
      text_color: '#1f2937',
      navigation_items: [
        { label: 'Menu', href: '/menu' },
        { label: 'Cart', href: '/cart' },
        { label: 'Orders', href: '/orders' },
      ],
    },
    footer: {
      background_color: '#1f2937',
      text_color: '#ffffff',
      sections: [
        { title: 'About', content: 'About our restaurant' },
        { title: 'Contact', content: '+1 (555) 123-4567' },
      ],
      social_links: [
        { platform: 'facebook', url: 'https://facebook.com' },
        { platform: 'instagram', url: 'https://instagram.com' },
      ],
    },
    identity: {
      logo_url: '/logo.png',
      site_title: 'Restaurant',
      favicon_url: '/favicon.ico',
    },
    ...overrides,
  }),

  product: (overrides = {}) => ({
    id: 'prod-1',
    name: 'Grilled Salmon',
    price: 18.99,
    description: 'Fresh grilled salmon with seasonal vegetables',
    image_url: '/images/salmon.jpg',
    category_id: 'cat-1',
    category_name: 'Main Courses',
    available: true,
    ...overrides,
  }),

  order: (overrides = {}) => ({
    id: 'ORD-001',
    customer_name: 'John Doe',
    customer_phone: '+1 (555) 123-4567',
    customer_email: 'john@example.com',
    items: [
      {
        product_id: 'prod-1',
        product_name: 'Grilled Salmon',
        quantity: 2,
        unit_price: 18.99,
        total: 37.98,
      },
    ],
    subtotal: 37.98,
    tax: 3.04,
    delivery_fee: 5.00,
    total: 45.02,
    status: 'confirmed',
    created_at: new Date().toISOString(),
    ...overrides,
  }),

  cart: (overrides = {}) => ({
    items: [
      {
        product_id: 'prod-1',
        product_name: 'Grilled Salmon',
        quantity: 2,
        unit_price: 18.99,
        image_url: '/images/salmon.jpg',
      },
    ],
    subtotal: 37.98,
    tax: 3.04,
    delivery_fee: 5.00,
    total: 45.02,
    ...overrides,
  }),

  checkoutFormData: (overrides = {}) => ({
    customer_name: 'John Doe',
    customer_phone: '+1 (555) 123-4567',
    customer_email: 'john@example.com',
    delivery_address: '123 Main St, City, ST 12345',
    payment_method: 'card',
    notes: 'No onions please',
    ...overrides,
  }),
}

/**
 * Common test selectors and query helpers
 */
export const testIds = {
  header: 'header',
  footer: 'footer',
  navigation: 'navigation',
  themeSelector: 'theme-selector',
  cart: 'cart',
  cartIcon: 'cart-icon',
  cartCounter: 'cart-counter',
  productCard: 'product-card',
  addToCartButton: 'add-to-cart-button',
  checkoutForm: 'checkout-form',
  orderStatus: 'order-status',
  loading: 'loading',
  error: 'error',
}

/**
 * Wait for element to appear in DOM
 */
export async function waitForElement(
  query: () => HTMLElement,
  options: { timeout?: number } = {}
) {
  const { timeout = 1000 } = options
  const startTime = Date.now()

  while (Date.now() - startTime < timeout) {
    try {
      return query()
    } catch {
      await new Promise(resolve => setTimeout(resolve, 50))
    }
  }

  throw new Error(`Element not found after ${timeout}ms`)
}

/**
 * Create mock theme context value
 */
export function createMockThemeContext(overrides = {}) {
  return {
    currentTheme: mockData.theme(),
    isLoading: false,
    error: null,
    setTheme: jest.fn(),
    ...overrides,
  }
}

/**
 * Reset all mocks between tests
 */
export function resetAllMocks() {
  jest.clearAllMocks()
  localStorage.clear()
}
