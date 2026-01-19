/**
 * MSW Server setup for Node.js test environment
 * This initializes the mock server for all tests
 */

import { setupServer } from 'msw/node'
import { handlers } from './handlers'

/**
 * Create MSW server with default handlers
 * This server will intercept all API calls during tests
 */
export const server = setupServer(...handlers)

/**
 * Start server before all tests and clean up after
 * This is automatically invoked by jest.setup.js
 */
if (typeof beforeAll !== 'undefined') {
  beforeAll(() => {
    server.listen({
      onUnhandledRequest: 'warn',
    })
  })

  afterEach(() => {
    server.resetHandlers()
  })

  afterAll(() => {
    server.close()
  })
}
