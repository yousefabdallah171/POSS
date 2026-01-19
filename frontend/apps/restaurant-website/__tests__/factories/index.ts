/**
 * Test data factories for generating mock entities
 * These factories create realistic test data with customization support
 */

import { mockData } from '../setup'

/**
 * Product factory
 */
export const productFactory = {
  create: (overrides = {}) =>
    mockData.product({
      id: `prod-${Math.random().toString(36).substr(2, 9)}`,
      ...overrides,
    }),

  createMany: (count: number, overrides = {}) =>
    Array.from({ length: count }, (_, i) =>
      mockData.product({
        id: `prod-${i}`,
        ...overrides,
      })
    ),

  /**
   * Common product presets
   */
  mainCourse: (overrides = {}) =>
    productFactory.create({
      category_id: 'cat-1',
      category_name: 'Main Courses',
      price: 18.99,
      ...overrides,
    }),

  salad: (overrides = {}) =>
    productFactory.create({
      category_id: 'cat-2',
      category_name: 'Salads',
      price: 9.99,
      ...overrides,
    }),

  dessert: (overrides = {}) =>
    productFactory.create({
      category_id: 'cat-3',
      category_name: 'Desserts',
      price: 6.99,
      ...overrides,
    }),

  beverage: (overrides = {}) =>
    productFactory.create({
      category_id: 'cat-4',
      category_name: 'Beverages',
      price: 3.99,
      ...overrides,
    }),

  unavailable: (overrides = {}) =>
    productFactory.create({
      available: false,
      ...overrides,
    }),
}

/**
 * Theme factory
 */
export const themeFactory = {
  create: (overrides = {}) =>
    mockData.theme({
      id: `theme-${Math.random().toString(36).substr(2, 9)}`,
      ...overrides,
    }),

  createMany: (count: number, overrides = {}) =>
    Array.from({ length: count }, (_, i) =>
      mockData.theme({
        id: `theme-${i}`,
        name: `Theme ${i + 1}`,
        ...overrides,
      })
    ),

  /**
   * Common theme presets
   */
  oceanBlue: (overrides = {}) =>
    themeFactory.create({
      name: 'Ocean Blue',
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
      ...overrides,
    }),

  forestGreen: (overrides = {}) =>
    themeFactory.create({
      name: 'Forest Green',
      colors: {
        primary: '#10b981',
        secondary: '#059669',
        accent: '#f97316',
        background: '#ffffff',
        foreground: '#1f2937',
        muted: '#e5e7eb',
        'muted-foreground': '#6b7280',
        border: '#e5e7eb',
        input: '#f3f4f6',
        ring: '#10b981',
      },
      ...overrides,
    }),

  sunsetOrange: (overrides = {}) =>
    themeFactory.create({
      name: 'Sunset Orange',
      colors: {
        primary: '#f97316',
        secondary: '#ea580c',
        accent: '#0ea5e9',
        background: '#ffffff',
        foreground: '#1f2937',
        muted: '#e5e7eb',
        'muted-foreground': '#6b7280',
        border: '#e5e7eb',
        input: '#f3f4f6',
        ring: '#f97316',
      },
      ...overrides,
    }),

  darkMode: (overrides = {}) =>
    themeFactory.create({
      name: 'Dark Mode',
      colors: {
        primary: '#3b82f6',
        secondary: '#1e40af',
        accent: '#fbbf24',
        background: '#1f2937',
        foreground: '#f3f4f6',
        muted: '#4b5563',
        'muted-foreground': '#9ca3af',
        border: '#374151',
        input: '#111827',
        ring: '#3b82f6',
      },
      ...overrides,
    }),
}

/**
 * Order factory
 */
export const orderFactory = {
  create: (overrides = {}) =>
    mockData.order({
      id: `ORD-${Date.now()}`,
      ...overrides,
    }),

  createMany: (count: number, overrides = {}) =>
    Array.from({ length: count }, (_, i) =>
      mockData.order({
        id: `ORD-${i + 1}`,
        ...overrides,
      })
    ),

  confirmed: (overrides = {}) =>
    orderFactory.create({
      status: 'confirmed',
      ...overrides,
    }),

  preparing: (overrides = {}) =>
    orderFactory.create({
      status: 'preparing',
      ...overrides,
    }),

  ready: (overrides = {}) =>
    orderFactory.create({
      status: 'ready',
      ...overrides,
    }),

  delivered: (overrides = {}) =>
    orderFactory.create({
      status: 'delivered',
      ...overrides,
    }),

  cancelled: (overrides = {}) =>
    orderFactory.create({
      status: 'cancelled',
      ...overrides,
    }),
}

/**
 * Cart factory
 */
export const cartFactory = {
  create: (overrides = {}) =>
    mockData.cart({
      ...overrides,
    }),

  withItems: (items: any[] = [], overrides = {}) =>
    mockData.cart({
      items: items.length > 0 ? items : [
        {
          product_id: 'prod-1',
          product_name: 'Grilled Salmon',
          quantity: 1,
          unit_price: 18.99,
          image_url: '/images/salmon.jpg',
        },
      ],
      ...overrides,
    }),

  empty: (overrides = {}) =>
    mockData.cart({
      items: [],
      subtotal: 0,
      tax: 0,
      delivery_fee: 0,
      total: 0,
      ...overrides,
    }),
}

/**
 * Checkout form data factory
 */
export const checkoutFormFactory = {
  create: (overrides = {}) =>
    mockData.checkoutFormData({
      ...overrides,
    }),

  valid: (overrides = {}) =>
    checkoutFormFactory.create({
      customer_name: 'John Doe',
      customer_phone: '+1 (555) 123-4567',
      customer_email: 'john@example.com',
      delivery_address: '123 Main St, City, ST 12345',
      payment_method: 'card',
      ...overrides,
    }),

  invalid: (overrides = {}) =>
    checkoutFormFactory.create({
      customer_name: '',
      customer_phone: 'invalid',
      customer_email: 'not-an-email',
      delivery_address: '',
      ...overrides,
    }),

  paymentCard: (overrides = {}) =>
    checkoutFormFactory.create({
      payment_method: 'card',
      ...overrides,
    }),

  paymentCash: (overrides = {}) =>
    checkoutFormFactory.create({
      payment_method: 'cash',
      ...overrides,
    }),
}

/**
 * Export all factories for convenient access
 */
export const factories = {
  product: productFactory,
  theme: themeFactory,
  order: orderFactory,
  cart: cartFactory,
  checkoutForm: checkoutFormFactory,
}
