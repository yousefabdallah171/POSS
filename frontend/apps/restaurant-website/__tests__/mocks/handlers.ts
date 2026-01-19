/**
 * MSW (Mock Service Worker) request handlers for API mocking
 * These handlers intercept all API calls during testing
 */

import { http, HttpResponse } from 'msw'
import { mockData } from '../setup'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1'

/**
 * Public API handlers for restaurant website
 */
export const publicHandlers = [
  // GET /api/v1/public/themes - List all themes
  http.get(`${API_BASE}/public/themes`, () => {
    return HttpResponse.json({
      data: [
        mockData.theme({ id: 'theme-1', name: 'Ocean Blue' }),
        mockData.theme({ id: 'theme-2', name: 'Forest Green', colors: { primary: '#10b981' } }),
        mockData.theme({ id: 'theme-3', name: 'Sunset Orange', colors: { primary: '#f97316' } }),
      ],
      meta: {
        total: 3,
        page: 1,
        limit: 10,
      },
    })
  }),

  // GET /api/v1/public/themes/:slug - Get single theme
  http.get(`${API_BASE}/public/themes/:slug`, ({ params }) => {
    return HttpResponse.json({
      data: mockData.theme({ id: params.slug as string }),
    })
  }),

  // GET /api/v1/public/products - List products
  http.get(`${API_BASE}/public/products`, ({ request }) => {
    const url = new URL(request.url)
    const category = url.searchParams.get('category')
    const search = url.searchParams.get('search')

    let products = [
      mockData.product({ id: 'prod-1', name: 'Grilled Salmon', category_id: 'cat-1' }),
      mockData.product({ id: 'prod-2', name: 'Caesar Salad', category_id: 'cat-2', price: 9.99 }),
      mockData.product({ id: 'prod-3', name: 'Chocolate Cake', category_id: 'cat-3', price: 6.99 }),
    ]

    if (category) {
      products = products.filter(p => p.category_id === category)
    }

    if (search) {
      products = products.filter(p =>
        p.name.toLowerCase().includes((search as string).toLowerCase())
      )
    }

    return HttpResponse.json({
      data: products,
      meta: {
        total: products.length,
        page: 1,
        limit: 20,
      },
    })
  }),

  // GET /api/v1/public/products/:id - Get single product
  http.get(`${API_BASE}/public/products/:id`, ({ params }) => {
    return HttpResponse.json({
      data: mockData.product({ id: params.id as string }),
    })
  }),

  // GET /api/v1/public/categories - List categories
  http.get(`${API_BASE}/public/categories`, () => {
    return HttpResponse.json({
      data: [
        { id: 'cat-1', name: 'Main Courses' },
        { id: 'cat-2', name: 'Salads' },
        { id: 'cat-3', name: 'Desserts' },
        { id: 'cat-4', name: 'Beverages' },
      ],
    })
  }),

  // POST /api/v1/public/orders - Create order
  http.post(`${API_BASE}/public/orders`, async ({ request }) => {
    const body = await request.json()

    return HttpResponse.json(
      {
        data: mockData.order({
          id: `ORD-${Date.now()}`,
          customer_name: (body as any).customer_name || 'Guest',
          status: 'confirmed',
        }),
      },
      { status: 201 }
    )
  }),

  // GET /api/v1/public/orders/:id - Get order status
  http.get(`${API_BASE}/public/orders/:id`, ({ params }) => {
    return HttpResponse.json({
      data: mockData.order({ id: params.id as string }),
    })
  }),

  // GET /api/v1/public/orders - List orders for customer
  http.get(`${API_BASE}/public/orders`, ({ request }) => {
    const url = new URL(request.url)
    const email = url.searchParams.get('email')

    return HttpResponse.json({
      data: [
        mockData.order({ id: 'ORD-001', customer_email: email || 'john@example.com' }),
        mockData.order({ id: 'ORD-002', customer_email: email || 'john@example.com' }),
      ],
    })
  }),
]

/**
 * Admin API handlers (for future admin dashboard)
 */
export const adminHandlers = [
  // GET /api/v1/admin/themes - Admin list themes
  http.get(`${API_BASE}/admin/themes`, () => {
    return HttpResponse.json({
      data: [
        mockData.theme({ id: 'theme-1', name: 'Ocean Blue' }),
      ],
      meta: {
        total: 1,
        page: 1,
        limit: 20,
      },
    })
  }),

  // POST /api/v1/admin/themes - Create theme
  http.post(`${API_BASE}/admin/themes`, async ({ request }) => {
    const body = await request.json()

    return HttpResponse.json(
      {
        data: mockData.theme({
          id: `theme-${Date.now()}`,
          name: (body as any).name || 'New Theme',
        }),
      },
      { status: 201 }
    )
  }),

  // PUT /api/v1/admin/themes/:id - Update theme
  http.put(`${API_BASE}/admin/themes/:id`, async ({ params, request }) => {
    const body = await request.json()

    return HttpResponse.json({
      data: mockData.theme({
        id: params.id as string,
        name: (body as any).name || 'Updated Theme',
      }),
    })
  }),

  // DELETE /api/v1/admin/themes/:id - Delete theme
  http.delete(`${API_BASE}/admin/themes/:id`, () => {
    return HttpResponse.json({ data: { success: true } })
  }),
]

/**
 * Error simulation handlers (use these to test error scenarios)
 */
export const errorHandlers = {
  /**
   * Simulate API error for themes endpoint
   */
  themeError: http.get(`${API_BASE}/public/themes`, () => {
    return HttpResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }),

  /**
   * Simulate timeout for themes endpoint
   */
  themeTimeout: http.get(`${API_BASE}/public/themes`, async () => {
    await new Promise(resolve => setTimeout(resolve, 10000))
    return HttpResponse.json({ data: [] })
  }),

  /**
   * Simulate validation error for orders
   */
  orderValidationError: http.post(`${API_BASE}/public/orders`, () => {
    return HttpResponse.json(
      {
        error: 'Validation failed',
        details: {
          customer_name: 'Required',
          customer_phone: 'Invalid format',
        },
      },
      { status: 400 }
    )
  }),
}

/**
 * Combine all default handlers
 */
export const handlers = [...publicHandlers, ...adminHandlers]
