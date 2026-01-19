/**
 * Jest Setup File
 *
 * Configure Jest globals and environment before running tests
 */

// Suppress console output during tests
const originalError = console.error
const originalLog = console.log
const originalWarn = console.warn

beforeAll(() => {
  console.error = jest.fn((...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Not implemented') || args[0].includes('Error'))
    ) {
      return
    }
    originalError.call(console, ...args)
  })

  console.log = jest.fn()
  console.warn = jest.fn()
})

afterAll(() => {
  console.error = originalError
  console.log = originalLog
  console.warn = originalWarn
})

// Set test timeout
jest.setTimeout(10000)

// Suppress specific warnings
const suppressedWarnings = ['Warning: useLayoutEffect does nothing on the server']

originalWarn.call = jest.fn((message) => {
  if (!suppressedWarnings.some(warning => message.includes(warning))) {
    originalWarn(message)
  }
})
