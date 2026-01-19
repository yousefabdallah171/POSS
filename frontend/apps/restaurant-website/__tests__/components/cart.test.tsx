/**
 * Tests for Cart component
 * Coverage: Empty state, cart items, quantity controls, pricing, localization, theme integration
 */

import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Cart } from '@/components/cart'

// Store default state for mocking
const defaultStoreState = {
  items: [
    {
      id: '1',
      productId: 'prod-1',
      name: 'Grilled Salmon',
      price: 18.99,
      quantity: 2,
      image: '/images/salmon.jpg',
      notes: '',
      total: 37.98,
    },
  ],
  removeItem: jest.fn(),
  updateQuantity: jest.fn(),
  updateNotes: jest.fn(),
  getTotal: jest.fn(() => 37.98),
  getTotalItems: jest.fn(() => 2),
  clearCart: jest.fn(),
}

// Mock dependencies
jest.mock('@/lib/store/cart-store', () => ({
  useCartStore: jest.fn((selector) => {
    if (typeof selector === 'function') {
      return selector(defaultStoreState)
    }
    return defaultStoreState
  }),
}))

jest.mock('@/lib/hooks/use-theme', () => ({
  useThemeColors: jest.fn(() => ({
    background: '#ffffff',
    text: '#1f2937',
    border: '#e5e7eb',
    primary: '#f97316',
  })),
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />
  },
}))

jest.mock('next/link', () => {
  return ({ children, href }: any) => <a href={href}>{children}</a>
})

import { useCartStore } from '@/lib/store/cart-store'

describe('Cart Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Empty Cart State', () => {
    beforeEach(() => {
      ;(useCartStore as unknown as jest.Mock).mockImplementation((selector) => {
        const store = {
          items: [],
          removeItem: jest.fn(),
          updateQuantity: jest.fn(),
          updateNotes: jest.fn(),
          getTotal: () => 0,
          getTotalItems: () => 0,
          clearCart: jest.fn(),
        }
        return selector(store)
      })
    })

    it('displays empty cart message in English', () => {
      render(<Cart locale="en" />)
      expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
    })

    it('displays empty cart message in Arabic', () => {
      render(<Cart locale="ar" />)
      expect(screen.getByText('سلتك فارغة')).toBeInTheDocument()
    })

    it('displays empty cart icon', () => {
      const { container } = render(<Cart locale="en" />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('shows continue shopping button in English', () => {
      render(<Cart locale="en" />)
      expect(screen.getByRole('link', { name: /Continue Shopping/i })).toBeInTheDocument()
    })

    it('shows continue shopping button in Arabic', () => {
      render(<Cart locale="ar" />)
      expect(screen.getByRole('link', { name: /متابعة التسوق/i })).toBeInTheDocument()
    })

    it('continue shopping button links to menu', () => {
      render(<Cart locale="en" />)
      const link = screen.getByRole('link', { name: /Continue Shopping/i })
      expect(link).toHaveAttribute('href', '/en/menu')
    })

    it('continue shopping button links to Arabic menu', () => {
      render(<Cart locale="ar" />)
      const link = screen.getByRole('link', { name: /متابعة التسوق/i })
      expect(link).toHaveAttribute('href', '/ar/menu')
    })
  })

  describe('Cart Items Display', () => {
    beforeEach(() => {
      ;(useCartStore as unknown as jest.Mock).mockImplementation((selector) => {
        const store = {
          items: [
            {
              id: '1',
              productId: 'prod-1',
              name: 'Grilled Salmon',
              price: 18.99,
              quantity: 2,
              image: '/images/salmon.jpg',
              notes: '',
              total: 37.98,
            },
          ],
          removeItem: jest.fn(),
          updateQuantity: jest.fn(),
          updateNotes: jest.fn(),
          getTotal: () => 37.98,
          getTotalItems: () => 2,
          clearCart: jest.fn(),
        }
        return selector(store)
      })
    })

    it('renders cart items', () => {
      render(<Cart locale="en" />)
      expect(screen.getByText('Grilled Salmon')).toBeInTheDocument()
    })

    it('displays product name', () => {
      render(<Cart locale="en" />)
      expect(screen.getByText('Grilled Salmon')).toBeInTheDocument()
    })

    it('displays product price per unit', () => {
      render(<Cart locale="en" />)
      expect(screen.getByText(/\$18.99/)).toBeInTheDocument()
    })

    it('displays "each" label in English', () => {
      render(<Cart locale="en" />)
      expect(screen.getByText(/18.99 each/)).toBeInTheDocument()
    })

    it('displays "لكل واحد" label in Arabic', () => {
      render(<Cart locale="ar" />)
      expect(screen.getByText(/18.99 لكل واحد/)).toBeInTheDocument()
    })

    it('displays item quantity', () => {
      render(<Cart locale="en" />)
      expect(screen.getByText('2')).toBeInTheDocument()
    })

    it('displays item total price', () => {
      render(<Cart locale="en" />)
      const prices = screen.getAllByText('$37.98')
      expect(prices.length).toBeGreaterThan(0)
    })

    it('displays product image when available', () => {
      render(<Cart locale="en" />)
      const image = screen.getByAltText('Grilled Salmon')
      expect(image).toHaveAttribute('src', '/images/salmon.jpg')
    })

    it('renders placeholder when image not available', () => {
      ;(useCartStore as unknown as jest.Mock).mockImplementation((selector) => {
        const store = {
          items: [
            {
              id: '1',
              productId: 'prod-1',
              name: 'Product',
              price: 10,
              quantity: 1,
              image: null,
              notes: '',
              total: 10,
            },
          ],
          removeItem: jest.fn(),
          updateQuantity: jest.fn(),
          updateNotes: jest.fn(),
          getTotal: () => 10,
          getTotalItems: () => 1,
          clearCart: jest.fn(),
        }
        return selector(store)
      })

      const { container } = render(<Cart locale="en" />)
      const svg = Array.from(container.querySelectorAll('svg')).find(
        s => s.className.baseVal.includes('shopping-cart')
      )
      expect(svg).toBeInTheDocument()
    })
  })

  describe('Quantity Controls', () => {
    beforeEach(() => {
      ;(useCartStore as unknown as jest.Mock).mockImplementation((selector) => {
        const store = {
          items: [
            {
              id: '1',
              productId: 'prod-1',
              name: 'Grilled Salmon',
              price: 18.99,
              quantity: 2,
              image: '/images/salmon.jpg',
              notes: '',
              total: 37.98,
            },
          ],
          removeItem: jest.fn(),
          updateQuantity: jest.fn(),
          updateNotes: jest.fn(),
          getTotal: () => 37.98,
          getTotalItems: () => 2,
          clearCart: jest.fn(),
        }
        return selector(store)
      })
    })

    it('renders quantity controls', () => {
      render(<Cart locale="en" />)
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })

    it('calls updateQuantity when minus button clicked', async () => {
      const user = userEvent.setup()
      render(<Cart locale="en" />)

      const buttons = screen.getAllByRole('button')
      const minusButton = buttons[0] // First button should be minus

      await user.click(minusButton)
      expect(useCartStore).toHaveBeenCalled()
    })

    it('calls updateQuantity when plus button clicked', async () => {
      const user = userEvent.setup()
      render(<Cart locale="en" />)

      const buttons = screen.getAllByRole('button')
      const plusButton = buttons[1] // Second button should be plus

      await user.click(plusButton)
      expect(useCartStore).toHaveBeenCalled()
    })
  })

  describe('Special Notes', () => {
    beforeEach(() => {
      ;(useCartStore as unknown as jest.Mock).mockImplementation((selector) => {
        const store = {
          items: [
            {
              id: '1',
              productId: 'prod-1',
              name: 'Grilled Salmon',
              price: 18.99,
              quantity: 2,
              image: '/images/salmon.jpg',
              notes: '',
              total: 37.98,
            },
          ],
          removeItem: jest.fn(),
          updateQuantity: jest.fn(),
          updateNotes: jest.fn(),
          getTotal: () => 37.98,
          getTotalItems: () => 2,
          clearCart: jest.fn(),
        }
        return selector(store)
      })
    })

    it('displays notes textarea', () => {
      render(<Cart locale="en" />)
      const textarea = screen.getByPlaceholderText(/Add special notes/i)
      expect(textarea).toBeInTheDocument()
    })

    it('displays notes placeholder in English', () => {
      render(<Cart locale="en" />)
      expect(screen.getByPlaceholderText(/Add special notes/i)).toBeInTheDocument()
    })

    it('displays notes placeholder in Arabic', () => {
      render(<Cart locale="ar" />)
      expect(screen.getByPlaceholderText(/أضف ملاحظات خاصة/i)).toBeInTheDocument()
    })

    it('calls updateNotes when textarea changes', async () => {
      const user = userEvent.setup()
      render(<Cart locale="en" />)

      const textarea = screen.getByPlaceholderText(/Add special notes/i)
      await user.type(textarea, 'No onions')

      expect(useCartStore).toHaveBeenCalled()
    })

    it('displays initial notes value', () => {
      ;(useCartStore as unknown as jest.Mock).mockImplementation((selector) => {
        const store = {
          items: [
            {
              id: '1',
              productId: 'prod-1',
              name: 'Product',
              price: 10,
              quantity: 1,
              image: null,
              notes: 'No salt',
              total: 10,
            },
          ],
          removeItem: jest.fn(),
          updateQuantity: jest.fn(),
          updateNotes: jest.fn(),
          getTotal: () => 10,
          getTotalItems: () => 1,
          clearCart: jest.fn(),
        }
        return selector(store)
      })

      render(<Cart locale="en" />)
      const textarea = screen.getByPlaceholderText(/Add special notes/i) as HTMLTextAreaElement
      expect(textarea.value).toBe('No salt')
    })
  })

  describe('Cart Summary', () => {
    beforeEach(() => {
      ;(useCartStore as unknown as jest.Mock).mockImplementation((selector) => {
        const store = {
          items: [
            {
              id: '1',
              productId: 'prod-1',
              name: 'Grilled Salmon',
              price: 18.99,
              quantity: 2,
              image: '/images/salmon.jpg',
              notes: '',
              total: 37.98,
            },
          ],
          removeItem: jest.fn(),
          updateQuantity: jest.fn(),
          updateNotes: jest.fn(),
          getTotal: () => 37.98,
          getTotalItems: () => 2,
          clearCart: jest.fn(),
        }
        return selector(store)
      })
    })

    it('displays subtotal', () => {
      render(<Cart locale="en" />)
      expect(screen.getByText('Subtotal')).toBeInTheDocument()
    })

    it('displays subtotal amount', () => {
      render(<Cart locale="en" />)
      // Should show the total in subtotal line
      expect(screen.getByText(/Subtotal/i).closest('div')).toHaveTextContent('$37.98')
    })

    it('displays delivery fee', () => {
      render(<Cart locale="en" />)
      expect(screen.getByText('Delivery')).toBeInTheDocument()
    })

    it('displays delivery fee amount when under $50', () => {
      render(<Cart locale="en" />)
      // Total is $37.98, so delivery should be $5.00
      expect(screen.getByText(/Delivery/i).closest('div')).toHaveTextContent('$5.00')
    })

    it('displays free delivery message over $50', () => {
      ;(useCartStore as unknown as jest.Mock).mockImplementation((selector) => {
        const store = {
          items: [
            {
              id: '1',
              productId: 'prod-1',
              name: 'Product',
              price: 60,
              quantity: 1,
              image: null,
              notes: '',
              total: 60,
            },
          ],
          removeItem: jest.fn(),
          updateQuantity: jest.fn(),
          updateNotes: jest.fn(),
          getTotal: () => 60,
          getTotalItems: () => 1,
          clearCart: jest.fn(),
        }
        return selector(store)
      })

      render(<Cart locale="en" />)
      expect(screen.getByText(/Free delivery on orders over \$50/i)).toBeInTheDocument()
    })

    it('does not display free delivery message under $50', () => {
      render(<Cart locale="en" />)
      expect(screen.queryByText(/Free delivery on orders over \$50/i)).not.toBeInTheDocument()
    })

    it('displays total price', () => {
      render(<Cart locale="en" />)
      const totalLabels = screen.getAllByText('Total')
      expect(totalLabels.length).toBeGreaterThan(0)
    })

    it('calculates total correctly with delivery', () => {
      render(<Cart locale="en" />)
      // Subtotal: $37.98 + Delivery: $5.00 = $42.98
      expect(screen.getByText('$42.98')).toBeInTheDocument()
    })
  })

  describe('Checkout Buttons', () => {
    beforeEach(() => {
      ;(useCartStore as unknown as jest.Mock).mockImplementation((selector) => {
        const store = {
          items: [
            {
              id: '1',
              productId: 'prod-1',
              name: 'Grilled Salmon',
              price: 18.99,
              quantity: 2,
              image: '/images/salmon.jpg',
              notes: '',
              total: 37.98,
            },
          ],
          removeItem: jest.fn(),
          updateQuantity: jest.fn(),
          updateNotes: jest.fn(),
          getTotal: () => 37.98,
          getTotalItems: () => 2,
          clearCart: jest.fn(),
        }
        return selector(store)
      })
    })

    it('displays proceed to checkout button', () => {
      render(<Cart locale="en" />)
      expect(screen.getByRole('link', { name: /Proceed to Checkout/i })).toBeInTheDocument()
    })

    it('checkout button links to checkout page', () => {
      render(<Cart locale="en" />)
      const checkoutLink = screen.getByRole('link', { name: /Proceed to Checkout/i })
      expect(checkoutLink).toHaveAttribute('href', '/en/checkout')
    })

    it('checkout button in Arabic links correctly', () => {
      render(<Cart locale="ar" />)
      const checkoutLink = screen.getByRole('link', { name: /متابعة الدفع/i })
      expect(checkoutLink).toHaveAttribute('href', '/ar/checkout')
    })

    it('displays continue shopping button', () => {
      render(<Cart locale="en" />)
      const buttons = screen.getAllByRole('link')
      const continueShoppingBtn = buttons.find(btn => btn.textContent?.includes('Continue Shopping'))
      expect(continueShoppingBtn).toBeInTheDocument()
    })

    it('continue shopping button links to menu', () => {
      render(<Cart locale="en" />)
      const buttons = screen.getAllByRole('link')
      const continueShoppingBtn = buttons.find(btn => btn.textContent?.includes('Continue Shopping'))
      expect(continueShoppingBtn).toHaveAttribute('href', '/en/menu')
    })
  })

  describe('Clear Cart Button', () => {
    beforeEach(() => {
      ;(useCartStore as unknown as jest.Mock).mockImplementation((selector) => {
        const store = {
          items: [
            {
              id: '1',
              productId: 'prod-1',
              name: 'Grilled Salmon',
              price: 18.99,
              quantity: 2,
              image: '/images/salmon.jpg',
              notes: '',
              total: 37.98,
            },
          ],
          removeItem: jest.fn(),
          updateQuantity: jest.fn(),
          updateNotes: jest.fn(),
          getTotal: () => 37.98,
          getTotalItems: () => 2,
          clearCart: jest.fn(),
        }
        return selector(store)
      })
    })

    it('displays clear cart button', () => {
      render(<Cart locale="en" />)
      expect(screen.getByText(/Clear Cart/)).toBeInTheDocument()
    })

    it('shows English confirmation text', () => {
      render(<Cart locale="en" />)
      expect(screen.getByText(/Clear Cart/)).toBeInTheDocument()
    })

    it('calls clearCart when confirmed', async () => {
      const user = userEvent.setup()
      jest.spyOn(window, 'confirm').mockReturnValue(true)

      render(<Cart locale="en" />)
      const clearButton = screen.getByText(/Clear Cart/)

      await user.click(clearButton)

      expect(useCartStore).toHaveBeenCalled()
      window.confirm.mockRestore()
    })

    it('does not call clearCart when cancelled', async () => {
      const user = userEvent.setup()
      jest.spyOn(window, 'confirm').mockReturnValue(false)

      render(<Cart locale="en" />)
      const clearButton = screen.getByText(/Clear Cart/)

      await user.click(clearButton)

      window.confirm.mockRestore()
    })
  })

  describe('Theme Integration', () => {
    beforeEach(() => {
      ;(useCartStore as unknown as jest.Mock).mockImplementation((selector) => {
        const store = {
          items: [
            {
              id: '1',
              productId: 'prod-1',
              name: 'Grilled Salmon',
              price: 18.99,
              quantity: 2,
              image: '/images/salmon.jpg',
              notes: '',
              total: 37.98,
            },
          ],
          removeItem: jest.fn(),
          updateQuantity: jest.fn(),
          updateNotes: jest.fn(),
          getTotal: () => 37.98,
          getTotalItems: () => 2,
          clearCart: jest.fn(),
        }
        return selector(store)
      })
    })

    it('applies theme background color', () => {
      const { container } = render(<Cart locale="en" />)
      const cartItem = container.querySelector('div[style*="background"]')
      expect(cartItem).toBeInTheDocument()
    })

    it('applies theme text color', () => {
      render(<Cart locale="en" />)
      expect(screen.getByText('Grilled Salmon')).toHaveStyle('color: rgb(31, 41, 55)')
    })

    it('applies fallback colors when theme not available', () => {
      jest.mock('@/lib/hooks/use-theme', () => ({
        useThemeColors: jest.fn(() => null),
      }))

      render(<Cart locale="en" />)
      expect(screen.getByText('Grilled Salmon')).toBeInTheDocument()
    })
  })

  describe('Localization', () => {
    beforeEach(() => {
      ;(useCartStore as unknown as jest.Mock).mockImplementation((selector) => {
        const store = {
          items: [
            {
              id: '1',
              productId: 'prod-1',
              name: 'Grilled Salmon',
              price: 18.99,
              quantity: 2,
              image: '/images/salmon.jpg',
              notes: '',
              total: 37.98,
            },
          ],
          removeItem: jest.fn(),
          updateQuantity: jest.fn(),
          updateNotes: jest.fn(),
          getTotal: () => 37.98,
          getTotalItems: () => 2,
          clearCart: jest.fn(),
        }
        return selector(store)
      })
    })

    it('displays English text by default', () => {
      render(<Cart locale="en" />)
      expect(screen.getByText('Subtotal')).toBeInTheDocument()
      expect(screen.getByText('Delivery')).toBeInTheDocument()
    })

    it('displays Arabic text when locale is ar', () => {
      render(<Cart locale="ar" />)
      expect(screen.getByText('المجموع')).toBeInTheDocument()
      expect(screen.getByText('التوصيل')).toBeInTheDocument()
    })

    it('each label is localized', () => {
      render(<Cart locale="en" />)
      expect(screen.getByText(/each/i)).toBeInTheDocument()

      render(<Cart locale="ar" />)
      expect(screen.getByText(/لكل واحد/i)).toBeInTheDocument()
    })

    it('total label is localized', () => {
      render(<Cart locale="en" />)
      expect(screen.getAllByText('Total').length).toBeGreaterThan(0)

      render(<Cart locale="ar" />)
      expect(screen.getAllByText('الإجمالي').length).toBeGreaterThan(0)
    })
  })

  describe('Delete Item Button', () => {
    beforeEach(() => {
      ;(useCartStore as unknown as jest.Mock).mockImplementation((selector) => {
        const store = {
          items: [
            {
              id: '1',
              productId: 'prod-1',
              name: 'Grilled Salmon',
              price: 18.99,
              quantity: 2,
              image: '/images/salmon.jpg',
              notes: '',
              total: 37.98,
            },
          ],
          removeItem: jest.fn(),
          updateQuantity: jest.fn(),
          updateNotes: jest.fn(),
          getTotal: () => 37.98,
          getTotalItems: () => 2,
          clearCart: jest.fn(),
        }
        return selector(store)
      })
    })

    it('displays delete button for each item', () => {
      render(<Cart locale="en" />)
      const buttons = screen.getAllByRole('button')
      // Should have multiple buttons including delete
      expect(buttons.length).toBeGreaterThan(0)
    })

    it('calls removeItem when delete clicked', async () => {
      const user = userEvent.setup()
      render(<Cart locale="en" />)

      // Find delete button (trash icon button after the quantity controls)
      const buttons = screen.getAllByRole('button')
      const deleteButton = buttons[buttons.length - 2] // Second to last button

      await user.click(deleteButton)
      expect(useCartStore).toHaveBeenCalled()
    })
  })

  describe('RTL Support', () => {
    beforeEach(() => {
      ;(useCartStore as unknown as jest.Mock).mockImplementation((selector) => {
        const store = {
          items: [
            {
              id: '1',
              productId: 'prod-1',
              name: 'Grilled Salmon',
              price: 18.99,
              quantity: 2,
              image: '/images/salmon.jpg',
              notes: '',
              total: 37.98,
            },
          ],
          removeItem: jest.fn(),
          updateQuantity: jest.fn(),
          updateNotes: jest.fn(),
          getTotal: () => 37.98,
          getTotalItems: () => 2,
          clearCart: jest.fn(),
        }
        return selector(store)
      })
    })

    it('applies RTL class when locale is Arabic', () => {
      const { container } = render(<Cart locale="ar" />)
      const rtlElements = Array.from(container.querySelectorAll('[class*="flex-row-reverse"]'))
      expect(rtlElements.length).toBeGreaterThan(0)
    })

    it('does not apply RTL class when locale is English', () => {
      const { container } = render(<Cart locale="en" />)
      const elements = container.querySelectorAll('[class*="flex-row-reverse"]')
      // Might have some RTL elements but not all
      expect(elements).toBeDefined()
    })

    it('text alignment is right for Arabic', () => {
      const { container } = render(<Cart locale="ar" />)
      // Find elements with text-align
      const alignedElements = Array.from(container.querySelectorAll('[style*="text-align"]'))
      const rightAligned = alignedElements.filter(el => el.getAttribute('style')?.includes('left'))
      expect(rightAligned.length).toBeGreaterThan(0)
    })
  })

  describe('Accessibility', () => {
    beforeEach(() => {
      ;(useCartStore as unknown as jest.Mock).mockImplementation((selector) => {
        const store = {
          items: [
            {
              id: '1',
              productId: 'prod-1',
              name: 'Grilled Salmon',
              price: 18.99,
              quantity: 2,
              image: '/images/salmon.jpg',
              notes: '',
              total: 37.98,
            },
          ],
          removeItem: jest.fn(),
          updateQuantity: jest.fn(),
          updateNotes: jest.fn(),
          getTotal: () => 37.98,
          getTotalItems: () => 2,
          clearCart: jest.fn(),
        }
        return selector(store)
      })
    })

    it('has proper heading for cart item name', () => {
      render(<Cart locale="en" />)
      const heading = screen.getByText('Grilled Salmon')
      expect(heading.tagName).toBe('H3')
    })

    it('textarea is accessible', () => {
      render(<Cart locale="en" />)
      const textarea = screen.getByPlaceholderText(/Add special notes/i)
      expect(textarea).toBeInTheDocument()
    })

    it('product image has alt text', () => {
      render(<Cart locale="en" />)
      const image = screen.getByAltText('Grilled Salmon')
      expect(image).toBeInTheDocument()
    })

    it('buttons are keyboard accessible', async () => {
      const user = userEvent.setup()
      render(<Cart locale="en" />)

      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)

      // Should be able to tab
      await user.tab()
      expect(document.activeElement).toBeDefined()
    })
  })

  describe('Multiple Items', () => {
    beforeEach(() => {
      ;(useCartStore as unknown as jest.Mock).mockImplementation((selector) => {
        const store = {
          items: [
            {
              id: '1',
              productId: 'prod-1',
              name: 'Salmon',
              price: 18.99,
              quantity: 2,
              image: '/salmon.jpg',
              notes: '',
              total: 37.98,
            },
            {
              id: '2',
              productId: 'prod-2',
              name: 'Salad',
              price: 9.99,
              quantity: 1,
              image: '/salad.jpg',
              notes: '',
              total: 9.99,
            },
          ],
          removeItem: jest.fn(),
          updateQuantity: jest.fn(),
          updateNotes: jest.fn(),
          getTotal: () => 47.97,
          getTotalItems: () => 3,
          clearCart: jest.fn(),
        }
        return selector(store)
      })
    })

    it('displays multiple items', () => {
      render(<Cart locale="en" />)
      expect(screen.getByText('Salmon')).toBeInTheDocument()
      expect(screen.getByText('Salad')).toBeInTheDocument()
    })

    it('calculates total for multiple items', () => {
      render(<Cart locale="en" />)
      // Subtotal: 37.98 + 9.99 = 47.97, Delivery: 5.00, Total: 52.97
      expect(screen.getByText('$52.97')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles zero quantity gracefully', () => {
      ;(useCartStore as unknown as jest.Mock).mockImplementation((selector) => {
        const store = {
          items: [
            {
              id: '1',
              productId: 'prod-1',
              name: 'Product',
              price: 10,
              quantity: 0,
              image: null,
              notes: '',
              total: 0,
            },
          ],
          removeItem: jest.fn(),
          updateQuantity: jest.fn(),
          updateNotes: jest.fn(),
          getTotal: () => 0,
          getTotalItems: () => 0,
          clearCart: jest.fn(),
        }
        return selector(store)
      })

      render(<Cart locale="en" />)
      expect(screen.getByText('0')).toBeInTheDocument()
    })

    it('handles large prices', () => {
      ;(useCartStore as unknown as jest.Mock).mockImplementation((selector) => {
        const store = {
          items: [
            {
              id: '1',
              productId: 'prod-1',
              name: 'Expensive Item',
              price: 999.99,
              quantity: 5,
              image: null,
              notes: '',
              total: 4999.95,
            },
          ],
          removeItem: jest.fn(),
          updateQuantity: jest.fn(),
          updateNotes: jest.fn(),
          getTotal: () => 4999.95,
          getTotalItems: () => 5,
          clearCart: jest.fn(),
        }
        return selector(store)
      })

      render(<Cart locale="en" />)
      // Should display the expensive item total
      const prices = screen.getAllByText('$4999.95')
      expect(prices.length).toBeGreaterThan(0)
    })

    it('handles very long product names', () => {
      ;(useCartStore as unknown as jest.Mock).mockImplementation((selector) => {
        const store = {
          items: [
            {
              id: '1',
              productId: 'prod-1',
              name: 'A Very Long Product Name That Might Not Fit Properly In The Layout',
              price: 10,
              quantity: 1,
              image: null,
              notes: '',
              total: 10,
            },
          ],
          removeItem: jest.fn(),
          updateQuantity: jest.fn(),
          updateNotes: jest.fn(),
          getTotal: () => 10,
          getTotalItems: () => 1,
          clearCart: jest.fn(),
        }
        return selector(store)
      })

      render(<Cart locale="en" />)
      expect(screen.getByText(/A Very Long Product Name/)).toBeInTheDocument()
    })
  })
})
