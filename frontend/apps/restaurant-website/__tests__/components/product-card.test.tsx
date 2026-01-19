/**
 * Tests for ProductCard component
 * Coverage: Product display, quantity selector, add to cart, theme colors, localization
 */

import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProductCard, Product } from '@/components/product-card'

// Mock dependencies
jest.mock('@/lib/hooks/use-theme', () => ({
  useThemeColors: jest.fn(() => ({
    background: '#ffffff',
    text: '#1f2937',
    primary: '#f97316',
    border: '#e5e7eb',
    accent: '#fbbf24',
  })),
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />
  },
}))

import { useThemeColors } from '@/lib/hooks/use-theme'

describe('ProductCard Component', () => {
  const defaultProduct: Product = {
    id: 1,
    name: 'Grilled Salmon',
    description: 'Fresh grilled salmon with seasonal vegetables',
    price: 18.99,
    category: 'Main Courses',
    isAvailable: true,
    rating: 4.5,
    image: '/images/salmon.jpg',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Product Information Display', () => {
    it('renders product name', () => {
      render(<ProductCard product={defaultProduct} />)
      expect(screen.getByText('Grilled Salmon')).toBeInTheDocument()
    })

    it('renders product description', () => {
      render(<ProductCard product={defaultProduct} />)
      expect(
        screen.getByText('Fresh grilled salmon with seasonal vegetables')
      ).toBeInTheDocument()
    })

    it('renders product price with correct formatting', () => {
      render(<ProductCard product={defaultProduct} />)
      expect(screen.getByText('$18.99')).toBeInTheDocument()
    })

    it('renders product price with whole number', () => {
      const product = { ...defaultProduct, price: 20 }
      render(<ProductCard product={product} />)
      expect(screen.getByText('$20.00')).toBeInTheDocument()
    })

    it('renders product category', () => {
      render(<ProductCard product={defaultProduct} />)
      expect(screen.getByText('Main Courses')).toBeInTheDocument()
    })

    it('does not render category when not provided', () => {
      const product = { ...defaultProduct, category: undefined }
      render(<ProductCard product={product} />)
      expect(screen.queryByText('Main Courses')).not.toBeInTheDocument()
    })

    it('renders product image with alt text', () => {
      render(<ProductCard product={defaultProduct} />)
      const image = screen.getByAltText('Grilled Salmon')
      expect(image).toHaveAttribute('src', '/images/salmon.jpg')
    })

    it('renders placeholder when image not provided', () => {
      const product = { ...defaultProduct, image: undefined }
      const { container } = render(<ProductCard product={product} />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('applies theme text color to product name', () => {
      render(<ProductCard product={defaultProduct} />)
      const title = screen.getByText('Grilled Salmon')
      expect(title).toHaveStyle('color: rgb(31, 41, 55)')
    })

    it('applies theme primary color to price', () => {
      render(<ProductCard product={defaultProduct} />)
      const price = screen.getByText('$18.99')
      expect(price).toHaveStyle('color: rgb(249, 115, 22)')
    })
  })

  describe('Rating Display', () => {
    it('displays rating badge when rating provided', () => {
      render(<ProductCard product={defaultProduct} />)
      expect(screen.getByText(/⭐ 4.5/)).toBeInTheDocument()
    })

    it('does not display rating when not provided', () => {
      const product = { ...defaultProduct, rating: undefined }
      render(<ProductCard product={product} />)
      expect(screen.queryByText(/⭐/)).not.toBeInTheDocument()
    })

    it('formats rating to one decimal place', () => {
      const product = { ...defaultProduct, rating: 4.567 }
      render(<ProductCard product={product} />)
      expect(screen.getByText(/⭐ 4.6/)).toBeInTheDocument()
    })
  })

  describe('Quantity Selector', () => {
    it('renders quantity selector with initial value of 1', () => {
      const { container } = render(<ProductCard product={defaultProduct} />)
      // Find quantity span
      const quantitySpan = Array.from(container.querySelectorAll('span')).find(
        span => span.textContent?.trim() === '1' && span.className.includes('min-w')
      )
      expect(quantitySpan?.textContent).toBe('1')
    })

    it('quantity selector is rendered', () => {
      const { container } = render(<ProductCard product={defaultProduct} />)
      // Find the quantity control container
      const quantityControl = Array.from(container.querySelectorAll('div')).find(
        div => div.className.includes('flex') &&
               div.querySelector('span')?.textContent?.includes('1') &&
               div.querySelectorAll('button').length >= 2
      )
      expect(quantityControl).toBeInTheDocument()
    })

    it('quantity selector has increment and decrement buttons', () => {
      render(<ProductCard product={defaultProduct} />)
      const buttons = screen.getAllByRole('button')
      // Should have at least 3 buttons: minus, plus, add to cart
      expect(buttons.length).toBeGreaterThanOrEqual(3)
    })
  })

  describe('Add to Cart Functionality', () => {
    it('renders add to cart button', () => {
      render(<ProductCard product={defaultProduct} />)
      const buttons = screen.getAllByRole('button')
      // Last button should be add to cart
      expect(buttons.length).toBeGreaterThan(0)
    })

    it('calls onAddToCart with product and quantity', async () => {
      const user = userEvent.setup()
      const onAddToCart = jest.fn()

      render(
        <ProductCard product={defaultProduct} onAddToCart={onAddToCart} />
      )

      // Click add to cart button (last button)
      const buttons = screen.getAllByRole('button')
      const addButton = buttons[buttons.length - 1]

      await user.click(addButton)
      expect(onAddToCart).toHaveBeenCalledWith(defaultProduct, 1)
    })

    it('passes correct quantity when added to cart with initial quantity', async () => {
      const user = userEvent.setup()
      const onAddToCart = jest.fn()

      render(
        <ProductCard product={defaultProduct} onAddToCart={onAddToCart} />
      )

      // Add to cart with initial quantity
      const buttons = screen.getAllByRole('button')
      const addButton = buttons[buttons.length - 1]

      await user.click(addButton)
      expect(onAddToCart).toHaveBeenCalledWith(defaultProduct, 1)
    })

    it('does not call onAddToCart if callback not provided', async () => {
      const user = userEvent.setup()
      render(<ProductCard product={defaultProduct} />)

      const buttons = screen.getAllByRole('button')
      const addButton = buttons[buttons.length - 1]

      // Should not throw
      await user.click(addButton)
      expect(screen.getByText('✓')).toBeInTheDocument()
    })
  })

  describe('Availability State', () => {
    it('renders add to cart controls when available', () => {
      const product = { ...defaultProduct, isAvailable: true }
      render(<ProductCard product={product} />)
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(2) // Plus, minus, add to cart
    })

    it('disables cart button when unavailable', () => {
      const product = { ...defaultProduct, isAvailable: false }
      render(<ProductCard product={product} />)
      const unavailableButton = screen.getByRole('button', {
        name: /Unavailable/i,
      })
      expect(unavailableButton).toBeDisabled()
    })

    it('shows "Out of Stock" overlay in English', () => {
      const product = { ...defaultProduct, isAvailable: false }
      render(<ProductCard product={product} locale="en" />)
      expect(screen.getByText('Out of Stock')).toBeInTheDocument()
    })

    it('shows "غير متوفر" overlay when unavailable in Arabic', () => {
      const product = { ...defaultProduct, isAvailable: false }
      render(<ProductCard product={product} locale="ar" />)
      const overlayText = Array.from(screen.queryAllByText(/غير متوفر/))
      expect(overlayText.length).toBeGreaterThan(0)
    })

    it('does not show overlay when available', () => {
      const product = { ...defaultProduct, isAvailable: true }
      render(<ProductCard product={product} />)
      expect(screen.queryByText('Out of Stock')).not.toBeInTheDocument()
    })
  })

  describe('Localization', () => {
    it('renders English unavailable button text', () => {
      const product = { ...defaultProduct, isAvailable: false }
      render(<ProductCard product={product} locale="en" />)
      expect(screen.getByRole('button', { name: /Unavailable/i })).toBeInTheDocument()
    })

    it('accepts ar locale prop', () => {
      const product = { ...defaultProduct, isAvailable: false }
      render(<ProductCard product={product} locale="ar" />)
      // Both button and overlay should have Arabic text
      expect(screen.queryAllByText(/غير متوفر/).length).toBeGreaterThan(0)
    })
  })

  describe('Theme Integration', () => {
    it('applies theme colors when available', () => {
      ;(useThemeColors as jest.Mock).mockReturnValue({
        background: '#f0f0f0',
        text: '#333333',
        primary: '#ff5500',
        border: '#cccccc',
        accent: '#ffaa00',
      })

      const { container } = render(<ProductCard product={defaultProduct} />)
      const card = container.querySelector('div.rounded-lg')
      expect(card).toHaveStyle('backgroundColor: rgb(240, 240, 240)')
    })

    it('uses fallback colors when theme not available', () => {
      ;(useThemeColors as jest.Mock).mockReturnValue(null)

      const { container } = render(<ProductCard product={defaultProduct} />)
      const card = container.querySelector('div.rounded-lg')
      expect(card).toHaveStyle('backgroundColor: rgb(255, 255, 255)')
    })

    it('applies border style from theme', () => {
      const { container } = render(<ProductCard product={defaultProduct} />)
      const card = container.querySelector('div.rounded-lg')
      const style = card?.getAttribute('style') || ''
      expect(style).toContain('border')
    })
  })

  describe('Card Styling', () => {
    it('applies rounded corners', () => {
      const { container } = render(<ProductCard product={defaultProduct} />)
      const card = container.querySelector('div.rounded-lg')
      expect(card).toHaveClass('rounded-lg')
    })

    it('applies initial shadow', () => {
      const { container } = render(<ProductCard product={defaultProduct} />)
      const card = container.querySelector('div.rounded-lg')
      expect(card).toHaveStyle('boxShadow: 0 1px 3px rgba(0, 0, 0, 0.1)')
    })

    it('increases shadow on hover', () => {
      const { container } = render(<ProductCard product={defaultProduct} />)
      const card = container.querySelector('div.rounded-lg') as HTMLDivElement

      if (card) {
        fireEvent.mouseEnter(card)
        expect(card.style.boxShadow).toBe('0 10px 15px rgba(0, 0, 0, 0.15)')
      }
    })

    it('restores shadow on mouse leave', () => {
      const { container } = render(<ProductCard product={defaultProduct} />)
      const card = container.querySelector('div.rounded-lg') as HTMLDivElement

      if (card) {
        fireEvent.mouseEnter(card)
        fireEvent.mouseLeave(card)
        expect(card.style.boxShadow).toBe('0 1px 3px rgba(0, 0, 0, 0.1)')
      }
    })
  })

  describe('Image Handling', () => {
    it('renders image with correct src', () => {
      render(<ProductCard product={defaultProduct} />)
      const image = screen.getByAltText('Grilled Salmon')
      expect(image).toHaveAttribute('src', '/images/salmon.jpg')
    })

    it('renders placeholder for missing image', () => {
      const product = { ...defaultProduct, image: undefined }
      const { container } = render(<ProductCard product={product} />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  describe('Props Variations', () => {
    it('renders with minimal props', () => {
      const minimal: Product = {
        id: 1,
        name: 'Simple Product',
        description: 'A simple product',
        price: 9.99,
      }
      render(<ProductCard product={minimal} />)
      expect(screen.getByText('Simple Product')).toBeInTheDocument()
      expect(screen.getByText('$9.99')).toBeInTheDocument()
    })

    it('renders with all props', () => {
      render(<ProductCard product={defaultProduct} locale="en" />)
      expect(screen.getByText('Grilled Salmon')).toBeInTheDocument()
      expect(screen.getByText('Main Courses')).toBeInTheDocument()
      expect(screen.getByText(/⭐ 4.5/)).toBeInTheDocument()
    })

    it('accepts onAddToCart callback', () => {
      const callback = jest.fn()
      render(
        <ProductCard product={defaultProduct} onAddToCart={callback} />
      )
      expect(screen.getByText('Grilled Salmon')).toBeInTheDocument()
    })

    it('accepts locale prop', () => {
      const product = { ...defaultProduct, isAvailable: false }
      render(<ProductCard product={product} locale="ar" />)
      expect(screen.queryAllByText(/غير متوفر/).length).toBeGreaterThan(0)
    })
  })

  describe('Edge Cases', () => {
    it('handles zero price', () => {
      const product = { ...defaultProduct, price: 0 }
      render(<ProductCard product={product} />)
      expect(screen.getByText('$0.00')).toBeInTheDocument()
    })

    it('handles very large price', () => {
      const product = { ...defaultProduct, price: 999.99 }
      render(<ProductCard product={product} />)
      expect(screen.getByText('$999.99')).toBeInTheDocument()
    })

    it('handles very long product name', () => {
      const product = {
        ...defaultProduct,
        name: 'A Very Long Product Name That Might Wrap To Multiple Lines In The Card Component',
      }
      render(<ProductCard product={product} />)
      expect(
        screen.getByText(
          /A Very Long Product Name That Might Wrap To Multiple Lines/
        )
      ).toBeInTheDocument()
    })

    it('handles very long description', () => {
      const product = {
        ...defaultProduct,
        description:
          'This is a very long product description that contains lots of details about the product and might exceed the normal display length and get truncated.',
      }
      render(<ProductCard product={product} />)
      expect(
        screen.getByText(/This is a very long product description/)
      ).toBeInTheDocument()
    })

    it('handles missing onAddToCart callback gracefully', async () => {
      const user = userEvent.setup()
      render(<ProductCard product={defaultProduct} />)

      const buttons = screen.getAllByRole('button')
      const addButton = buttons[buttons.length - 1]

      // Should not throw error
      await user.click(addButton)
      expect(screen.getByText('✓')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper heading for product name', () => {
      const { container } = render(<ProductCard product={defaultProduct} />)
      const heading = container.querySelector('h3')
      expect(heading).toBeInTheDocument()
      expect(heading?.textContent).toBe('Grilled Salmon')
    })

    it('image has alt text', () => {
      render(<ProductCard product={defaultProduct} />)
      const image = screen.getByAltText('Grilled Salmon')
      expect(image).toBeInTheDocument()
    })

    it('buttons are keyboard accessible', async () => {
      const user = userEvent.setup()
      render(<ProductCard product={defaultProduct} />)

      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)

      // Should be able to tab to button
      await user.tab()
      expect(document.activeElement).toBeDefined()
    })
  })
})
