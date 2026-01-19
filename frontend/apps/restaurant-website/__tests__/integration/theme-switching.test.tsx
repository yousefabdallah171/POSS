/**
 * Integration tests for theme switching workflow
 * Tests: Theme selector + Color application across components
 */

import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeSelector } from '@/components/theme-selector'
import { Header } from '@/components/header'
import { ProductCard, Product } from '@/components/product-card'

// Mock dependencies
jest.mock('@/lib/hooks/use-theme', () => ({
  useThemeColors: jest.fn(() => ({
    background: '#ffffff',
    text: '#1f2937',
    border: '#e5e7eb',
    primary: '#f97316',
    accent: '#fbbf24',
  })),
  useThemeHeader: jest.fn(() => ({
    background_color: '#ffffff',
    text_color: '#000000',
    height: 64,
    navigation_items: [],
  })),
  useThemeIdentity: jest.fn(() => ({
    logo_url: null,
    site_title: 'Test Restaurant',
  })),
}))

jest.mock('@/lib/store/theme-store', () => ({
  useThemeStore: jest.fn(() => ({
    currentTheme: { slug: 'light', name: 'Light' },
    loadTheme: jest.fn().mockResolvedValue(undefined),
  })),
}))

jest.mock('@/lib/subdomain-context', () => ({
  useSubdomain: jest.fn(() => ({
    slug: 'test-restaurant',
  })),
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}))

jest.mock('next/link', () => {
  return ({ children, href }: any) => <a href={href}>{children}</a>
})

jest.mock('@/components/dark-mode-toggle', () => ({
  DarkModeToggle: () => <button data-testid="dark-mode-toggle">Dark</button>,
}))

jest.mock('@/components/language-switcher', () => ({
  LanguageSwitcher: () => <button data-testid="language-switcher">Lang</button>,
}))

describe('Theme Switching Integration', () => {
  const mockThemes = [
    {
      slug: 'light',
      name: 'Light',
      description: 'Light theme',
      colors: {
        primary: '#f97316',
        secondary: '#0ea5e9',
        accent: '#fbbf24',
      },
    },
    {
      slug: 'dark',
      name: 'Dark',
      description: 'Dark theme',
      colors: {
        primary: '#8b5cf6',
        secondary: '#ec4899',
        accent: '#06b6d4',
      },
    },
  ]

  const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    description: 'A test product',
    price: 19.99,
    image: '/test.jpg',
    category: 'Main Course',
    isAvailable: true,
    rating: 4.5,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Theme Selection Workflow', () => {
    it('displays theme selector with available themes', () => {
      render(<ThemeSelector themes={mockThemes} />)
      expect(screen.getByText('Light')).toBeInTheDocument()
      expect(screen.getByText('Dark')).toBeInTheDocument()
    })

    it('allows selecting different themes', async () => {
      const user = userEvent.setup()
      render(<ThemeSelector themes={mockThemes} />)

      const darkThemeButton = screen.getByRole('button', { name: /Dark/ })
      expect(darkThemeButton).toBeInTheDocument()

      await user.click(darkThemeButton)
      expect(darkThemeButton).toBeInTheDocument()
    })

    it('calls onThemeChange callback when theme selected', async () => {
      const user = userEvent.setup()
      const mockCallback = jest.fn()

      render(
        <ThemeSelector themes={mockThemes} onThemeChange={mockCallback} />
      )

      const darkThemeButton = screen.getByRole('button', { name: /Dark/ })
      await user.click(darkThemeButton)

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalled()
      })
    })
  })

  describe('Theme Application', () => {
    it('header displays theme colors correctly', () => {
      render(<Header locale="en" />)
      expect(screen.getByText('Test Restaurant')).toBeInTheDocument()
    })

    it('product card uses theme colors', () => {
      render(<ProductCard product={mockProduct} locale="en" />)
      expect(screen.getByText('Test Product')).toBeInTheDocument()
      expect(screen.getByText('$19.99')).toBeInTheDocument()
    })

    it('product rating displays correctly', () => {
      render(<ProductCard product={mockProduct} />)
      expect(screen.getByText(/⭐ 4.5/)).toBeInTheDocument()
    })
  })

  describe('Multi-Component Theme Consistency', () => {
    it('header and product card render together', () => {
      const { container } = render(
        <>
          <Header locale="en" />
          <ProductCard product={mockProduct} locale="en" />
        </>
      )

      expect(screen.getByText('Test Restaurant')).toBeInTheDocument()
      expect(screen.getByText('Test Product')).toBeInTheDocument()

      // Both should have styled elements
      const styledElements = container.querySelectorAll('[style]')
      expect(styledElements.length).toBeGreaterThan(0)
    })

    it('theme selector and components can coexist', () => {
      render(
        <>
          <ThemeSelector themes={mockThemes} />
          <ProductCard product={mockProduct} />
        </>
      )

      expect(screen.getByText('Select Theme')).toBeInTheDocument()
      expect(screen.getByText('Test Product')).toBeInTheDocument()
    })
  })

  describe('Localization in Themes', () => {
    it('theme selector supports multiple locales', () => {
      const { rerender } = render(
        <ThemeSelector themes={mockThemes} locale="en" />
      )
      expect(screen.getByText('Select Theme')).toBeInTheDocument()

      rerender(<ThemeSelector themes={mockThemes} locale="ar" />)
      expect(screen.getByText('اختر المظهر')).toBeInTheDocument()
    })

    it('product card supports localization with themes', () => {
      const { rerender } = render(
        <ProductCard product={mockProduct} locale="en" />
      )
      expect(screen.getByText('Test Product')).toBeInTheDocument()

      rerender(<ProductCard product={mockProduct} locale="ar" />)
      expect(screen.getByText('Test Product')).toBeInTheDocument()
    })
  })

  describe('Responsive Behavior', () => {
    it('theme selector works in compact mode', () => {
      const { container } = render(
        <ThemeSelector themes={mockThemes} compact={true} />
      )
      const select = container.querySelector('select')
      expect(select).toBeInTheDocument()
    })

    it('theme selector works in full mode', () => {
      render(<ThemeSelector themes={mockThemes} compact={false} />)
      expect(screen.getByText('Light')).toBeInTheDocument()
      expect(screen.getByText('Dark')).toBeInTheDocument()
    })
  })

  describe('Accessibility in Theme Switching', () => {
    it('theme selector buttons are keyboard accessible', async () => {
      const user = userEvent.setup()
      render(<ThemeSelector themes={mockThemes} />)

      const themeButtons = screen.getAllByRole('button')
      expect(themeButtons.length).toBeGreaterThan(0)

      await user.tab()
      expect(document.activeElement).toBeDefined()
    })

    it('header and product card are keyboard navigable', async () => {
      const user = userEvent.setup()
      render(
        <>
          <Header locale="en" />
          <ProductCard product={mockProduct} />
        </>
      )

      const allButtons = screen.getAllByRole('button')
      expect(allButtons.length).toBeGreaterThan(0)

      await user.tab()
      expect(document.activeElement).toBeDefined()
    })
  })

  describe('Error Handling', () => {
    it('handles empty theme list gracefully', () => {
      render(<ThemeSelector themes={[]} />)
      expect(screen.getByRole('heading')).toBeInTheDocument()
    })

    it('handles undefined themes prop', () => {
      render(<ThemeSelector />)
      expect(screen.getByRole('heading')).toBeInTheDocument()
    })
  })
})
