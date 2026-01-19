// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Note: MSW server setup is handled in individual test files
// to avoid module resolution issues in Jest environment

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock requestAnimationFrame
global.requestAnimationFrame = (cb) => {
  return setTimeout(cb, 0)
}

global.cancelAnimationFrame = (id) => {
  clearTimeout(id)
}
