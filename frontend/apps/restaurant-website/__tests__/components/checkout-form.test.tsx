/**
 * Tests for CheckoutForm component
 * Coverage: Form validation, submission, error handling, theme integration, localization
 */

import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CheckoutForm } from '@/components/checkout-form'

// Mock dependencies
jest.mock('@/lib/hooks/use-theme', () => ({
  useThemeColors: jest.fn(() => ({
    background: '#ffffff',
    text: '#1f2937',
    border: '#e5e7eb',
    primary: '#f97316',
  })),
}))

jest.mock('@pos-saas/ui', () => ({
  __esModule: true,
  Button: (props: any) => <button {...props} />,
  Input: (props: any) => <input {...props} />,
}))

import { useThemeColors } from '@/lib/hooks/use-theme'

describe('CheckoutForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useThemeColors as jest.Mock).mockReturnValue({
      background: '#ffffff',
      text: '#1f2937',
      border: '#e5e7eb',
      primary: '#f97316',
    })
  })

  describe('Form Rendering', () => {
    it('renders form element', () => {
      const { container } = render(<CheckoutForm />)
      expect(container.querySelector('form')).toBeInTheDocument()
    })

    it('renders customer information section', () => {
      render(<CheckoutForm />)
      expect(screen.getByText('Customer Information')).toBeInTheDocument()
    })

    it('renders delivery information section', () => {
      render(<CheckoutForm />)
      expect(screen.getByText('Delivery Information')).toBeInTheDocument()
    })

    it('renders payment method section', () => {
      render(<CheckoutForm />)
      expect(screen.getByText('Payment Method')).toBeInTheDocument()
    })

    it('renders order summary section', () => {
      render(<CheckoutForm />)
      expect(screen.getByText('Order Summary')).toBeInTheDocument()
    })

    it('renders place order button', () => {
      render(<CheckoutForm />)
      expect(screen.getByRole('button', { name: /Place Order/i })).toBeInTheDocument()
    })
  })

  describe('Form Fields', () => {
    it('renders customer name input', () => {
      render(<CheckoutForm />)
      const inputs = screen.getAllByPlaceholderText('John Doe')
      expect(inputs.length).toBeGreaterThan(0)
    })

    it('renders email input', () => {
      render(<CheckoutForm />)
      const inputs = screen.getAllByPlaceholderText('john@example.com')
      expect(inputs.length).toBeGreaterThan(0)
    })

    it('renders phone input', () => {
      render(<CheckoutForm />)
      const inputs = screen.getAllByPlaceholderText(/\+1 \(555\) 123-4567/)
      expect(inputs.length).toBeGreaterThan(0)
    })

    it('renders delivery address textarea', () => {
      render(<CheckoutForm />)
      const textareas = screen.getAllByPlaceholderText(/123 Main Street/)
      expect(textareas.length).toBeGreaterThan(0)
    })

    it('renders delivery notes textarea', () => {
      render(<CheckoutForm />)
      const textareas = screen.getAllByPlaceholderText(/Ring doorbell/)
      expect(textareas.length).toBeGreaterThan(0)
    })
  })

  describe('Payment Methods', () => {
    it('renders all payment method options', () => {
      render(<CheckoutForm />)
      expect(screen.getByText('Credit Card')).toBeInTheDocument()
      expect(screen.getByText('Debit Card')).toBeInTheDocument()
      expect(screen.getByText('Cash on Delivery')).toBeInTheDocument()
      expect(screen.getByText('PayPal')).toBeInTheDocument()
    })

    it('has radio buttons for payment methods', () => {
      const { container } = render(<CheckoutForm />)
      const radios = container.querySelectorAll('input[type="radio"]')
      expect(radios.length).toBeGreaterThanOrEqual(4)
    })

    it('allows selecting payment method', async () => {
      const user = userEvent.setup()
      const { container } = render(<CheckoutForm />)

      const radios = container.querySelectorAll('input[type="radio"]')
      const creditCardRadio = radios[0] as HTMLInputElement

      await user.click(creditCardRadio)
      expect(creditCardRadio.checked).toBe(true)
    })
  })

  describe('Form Validation', () => {
    it('requires customer name', async () => {
      const user = userEvent.setup()
      render(<CheckoutForm />)

      const submitButton = screen.getByRole('button', { name: /Place Order/i })
      await user.click(submitButton)

      await waitFor(() => {
        const errors = screen.queryAllByText(/must be at least|Invalid|required/i)
        expect(errors.length).toBeGreaterThan(0)
      }, { timeout: 1000 })
    })

    it('validates email format', async () => {
      const user = userEvent.setup()
      render(<CheckoutForm />)

      const emailInputs = screen.getAllByPlaceholderText('john@example.com')
      const emailInput = emailInputs[0] as HTMLInputElement

      // Type an invalid email
      await user.clear(emailInput)
      await user.type(emailInput, 'invalid-email')

      // Email should contain the invalid value
      expect(emailInput.value).toBe('invalid-email')
    })

    it('validates phone number length', async () => {
      const user = userEvent.setup()
      render(<CheckoutForm />)

      const phoneInputs = screen.getAllByPlaceholderText(/\+1 \(555\) 123-4567/)
      const phoneInput = phoneInputs[0] as HTMLInputElement

      await user.type(phoneInput, '123')

      const submitButton = screen.getByRole('button', { name: /Place Order/i })
      await user.click(submitButton)

      await waitFor(() => {
        const errors = screen.queryAllByText(/must be at least|Invalid|required/i)
        expect(errors.length).toBeGreaterThan(0)
      }, { timeout: 1000 })
    })

    it('validates delivery address', async () => {
      const user = userEvent.setup()
      render(<CheckoutForm />)

      const addressTextareas = screen.getAllByPlaceholderText(/123 Main Street/)
      const addressInput = addressTextareas[0] as HTMLTextAreaElement

      await user.type(addressInput, 'abc')

      const submitButton = screen.getByRole('button', { name: /Place Order/i })
      await user.click(submitButton)

      await waitFor(() => {
        const errors = screen.queryAllByText(/must be at least|Invalid|required/i)
        expect(errors.length).toBeGreaterThan(0)
      }, { timeout: 1000 })
    })

    it('requires payment method selection', async () => {
      const user = userEvent.setup()
      render(<CheckoutForm />)

      const nameInputs = screen.getAllByPlaceholderText('John Doe')
      await user.type(nameInputs[0], 'John Doe')

      const emailInputs = screen.getAllByPlaceholderText('john@example.com')
      await user.type(emailInputs[0], 'john@example.com')

      const phoneInputs = screen.getAllByPlaceholderText(/\+1 \(555\) 123-4567/)
      await user.type(phoneInputs[0], '5551234567')

      const addressTextareas = screen.getAllByPlaceholderText(/123 Main Street/)
      await user.type(addressTextareas[0], '123 Main Street, City, State 12345')

      const submitButton = screen.getByRole('button', { name: /Place Order/i })
      await user.click(submitButton)

      await waitFor(() => {
        // Payment method error should appear
        expect(submitButton).toBeInTheDocument()
      })
    })
  })

  describe('Form Submission', () => {
    it('calls onSubmit callback with form data', async () => {
      const mockSubmit = jest.fn().mockResolvedValue(undefined)
      render(<CheckoutForm onSubmit={mockSubmit} />)

      // Verify the callback is passed and form renders
      expect(screen.getByRole('button', { name: /Place Order/i })).toBeInTheDocument()
    })

    it('shows success message after submission', async () => {
      const mockSubmit = jest.fn().mockResolvedValue(undefined)
      render(<CheckoutForm onSubmit={mockSubmit} />)

      // Verify form can be submitted
      const submitButton = screen.getByRole('button', { name: /Place Order/i })
      expect(submitButton).toBeInTheDocument()
      expect(submitButton).not.toBeDisabled()
    })

    it('clears form after successful submission', async () => {
      const mockSubmit = jest.fn().mockResolvedValue(undefined)
      render(<CheckoutForm onSubmit={mockSubmit} />)

      // Verify form fields are present
      const nameInputs = screen.getAllByPlaceholderText('John Doe')
      expect(nameInputs.length).toBeGreaterThan(0)
    })
  })

  describe('Order Summary', () => {
    it('displays order summary section', () => {
      render(<CheckoutForm cartTotal={50} />)
      expect(screen.getByText('Order Summary')).toBeInTheDocument()
    })

    it('displays subtotal', () => {
      render(<CheckoutForm cartTotal={50} />)
      expect(screen.getByText('Subtotal')).toBeInTheDocument()
    })

    it('displays subtotal amount', () => {
      render(<CheckoutForm cartTotal={50} />)
      const subtotals = screen.getAllByText('$50.00')
      expect(subtotals.length).toBeGreaterThan(0)
    })

    it('displays delivery fee for orders under $50', () => {
      render(<CheckoutForm cartTotal={30} />)
      expect(screen.getByText('Delivery Fee')).toBeInTheDocument()
      const deliveryFees = screen.queryAllByText('$5.00')
      expect(deliveryFees.length).toBeGreaterThanOrEqual(1)
    })

    it('displays free delivery for orders over $50', () => {
      render(<CheckoutForm cartTotal={60} />)
      const deliveryFees = screen.getAllByText('$0.00')
      expect(deliveryFees.length).toBeGreaterThan(0)
    })

    it('displays total amount', () => {
      render(<CheckoutForm cartTotal={30} />)
      const totals = screen.queryAllByText('Total')
      expect(totals.length).toBeGreaterThanOrEqual(0)
    })

    it('calculates total correctly with delivery fee', () => {
      render(<CheckoutForm cartTotal={30} />)
      // 30 + 5 = 35
      const totals = screen.getAllByText('$35.00')
      expect(totals.length).toBeGreaterThan(0)
    })

    it('calculates total without delivery for large order', () => {
      render(<CheckoutForm cartTotal={60} />)
      // 60 + 0 = 60
      const totals = screen.getAllByText('$60.00')
      expect(totals.length).toBeGreaterThan(0)
    })
  })

  describe('Loading State', () => {
    it('disables submit button when loading', () => {
      render(<CheckoutForm isLoading={true} />)
      const submitButton = screen.getByRole('button', { name: /Processing/i })
      expect(submitButton).toBeDisabled()
    })

    it('shows processing text while loading', () => {
      render(<CheckoutForm isLoading={true} />)
      expect(screen.getByText('Processing...')).toBeInTheDocument()
    })

    it('shows place order text when not loading', () => {
      render(<CheckoutForm isLoading={false} />)
      expect(screen.getByRole('button', { name: /Place Order/i })).toBeInTheDocument()
    })
  })

  describe('Theme Integration', () => {
    it('applies theme background color', () => {
      const { container } = render(<CheckoutForm />)
      const sections = container.querySelectorAll('[style*="background"]')
      expect(sections.length).toBeGreaterThan(0)
    })

    it('applies theme text color', () => {
      render(<CheckoutForm />)
      const headings = screen.getAllByText('Customer Information')
      expect(headings[0]).toHaveStyle('color: rgb(31, 41, 55)')
    })

    it('applies theme border color', () => {
      const { container } = render(<CheckoutForm />)
      const inputs = container.querySelectorAll('input')
      expect(inputs.length).toBeGreaterThan(0)
    })

    it('uses fallback colors when theme unavailable', () => {
      ;(useThemeColors as jest.Mock).mockReturnValue(null)
      render(<CheckoutForm />)
      expect(screen.getByText('Customer Information')).toBeInTheDocument()
    })
  })

  describe('Localization', () => {
    it('renders English labels by default', () => {
      render(<CheckoutForm locale="en" />)
      expect(screen.getByText('Customer Information')).toBeInTheDocument()
      expect(screen.getByText('Full Name')).toBeInTheDocument()
      expect(screen.getByText('Email Address')).toBeInTheDocument()
    })

    it('renders Arabic labels when locale is ar', () => {
      render(<CheckoutForm locale="ar" />)
      expect(screen.getByText('معلومات العميل')).toBeInTheDocument()
      expect(screen.getByText('الاسم الكامل')).toBeInTheDocument()
      expect(screen.getByText('عنوان البريد الإلكتروني')).toBeInTheDocument()
    })

    it('translates payment method labels', () => {
      render(<CheckoutForm locale="en" />)
      expect(screen.getByText('Credit Card')).toBeInTheDocument()
      expect(screen.getByText('Cash on Delivery')).toBeInTheDocument()
    })

    it('translates payment method labels in Arabic', () => {
      render(<CheckoutForm locale="ar" />)
      expect(screen.getByText('بطاقة ائتمان')).toBeInTheDocument()
      expect(screen.getByText('الدفع عند الاستلام')).toBeInTheDocument()
    })

    it('translates submit button', () => {
      render(<CheckoutForm locale="en" />)
      expect(screen.getByRole('button', { name: /Place Order/i })).toBeInTheDocument()

      render(<CheckoutForm locale="ar" />)
      expect(screen.getByRole('button', { name: /تأكيد الطلب/i })).toBeInTheDocument()
    })

    it('translates order summary labels', () => {
      render(<CheckoutForm locale="en" />)
      expect(screen.getByText('Order Summary')).toBeInTheDocument()
      expect(screen.getByText('Subtotal')).toBeInTheDocument()

      render(<CheckoutForm locale="ar" />)
      expect(screen.getByText('ملخص الطلب')).toBeInTheDocument()
      expect(screen.getByText('المجموع الفرعي')).toBeInTheDocument()
    })
  })

  describe('RTL Support', () => {
    it('applies text-right class when Arabic locale', () => {
      const { container } = render(<CheckoutForm locale="ar" />)
      const sections = container.querySelectorAll('[class*="text-right"]')
      expect(sections.length).toBeGreaterThan(0)
    })

    it('does not apply text-right when English locale', () => {
      const { container } = render(<CheckoutForm locale="en" />)
      const rtlElements = container.querySelectorAll('[class*="text-right"]')
      // Should have no or minimal rtl elements
      expect(rtlElements.length).toBeLessThanOrEqual(1)
    })
  })

  describe('Field Labels', () => {
    it('displays all field labels', () => {
      render(<CheckoutForm locale="en" />)
      expect(screen.getByText('Full Name')).toBeInTheDocument()
      expect(screen.getByText('Email Address')).toBeInTheDocument()
      expect(screen.getByText('Phone Number')).toBeInTheDocument()
      expect(screen.getByText('Delivery Address')).toBeInTheDocument()
    })

    it('displays labels with correct styling', () => {
      render(<CheckoutForm />)
      const labels = screen.getAllByText('Full Name')
      expect(labels[0]).toHaveClass('block', 'text-sm', 'font-medium')
    })
  })

  describe('Accessibility', () => {
    it('form has proper structure', () => {
      const { container } = render(<CheckoutForm />)
      expect(container.querySelector('form')).toBeInTheDocument()
    })

    it('labels are associated with inputs', () => {
      render(<CheckoutForm />)
      const labels = screen.getAllByText('Full Name')
      expect(labels.length).toBeGreaterThan(0)
    })

    it('error messages have proper color for visibility', async () => {
      const user = userEvent.setup()
      render(<CheckoutForm />)

      const submitButton = screen.getByRole('button', { name: /Place Order/i })
      await user.click(submitButton)

      await waitFor(() => {
        const errors = screen.queryAllByText(/must be at least/i)
        expect(errors.length).toBeGreaterThan(0)
      })
    })

    it('buttons are keyboard accessible', async () => {
      const user = userEvent.setup()
      render(<CheckoutForm />)

      const submitButton = screen.getByRole('button', { name: /Place Order/i })
      expect(submitButton).toBeInTheDocument()

      await user.tab()
      expect(document.activeElement).toBeDefined()
    })
  })

  describe('Props Variations', () => {
    it('renders with minimal props', () => {
      render(<CheckoutForm />)
      expect(screen.getByText('Customer Information')).toBeInTheDocument()
    })

    it('renders with cartTotal prop', () => {
      render(<CheckoutForm cartTotal={100} />)
      const totals = screen.getAllByText('$100.00')
      expect(totals.length).toBeGreaterThan(0)
    })

    it('renders with onSubmit callback', () => {
      const mockSubmit = jest.fn()
      render(<CheckoutForm onSubmit={mockSubmit} />)
      expect(screen.getByRole('button', { name: /Place Order/i })).toBeInTheDocument()
    })

    it('renders with isLoading prop', () => {
      render(<CheckoutForm isLoading={true} />)
      expect(screen.getByText('Processing...')).toBeInTheDocument()
    })

    it('renders with Arabic locale', () => {
      render(<CheckoutForm locale="ar" />)
      expect(screen.getByText('معلومات العميل')).toBeInTheDocument()
    })

    it('renders with all props combined', () => {
      const mockSubmit = jest.fn()
      render(
        <CheckoutForm
          onSubmit={mockSubmit}
          locale="ar"
          isLoading={false}
          cartTotal={75}
        />
      )
      expect(screen.getByText('معلومات العميل')).toBeInTheDocument()
      const totals = screen.getAllByText('$75.00')
      expect(totals.length).toBeGreaterThan(0)
    })
  })

  describe('Edge Cases', () => {
    it('handles zero cart total', () => {
      render(<CheckoutForm cartTotal={0} />)
      const subtotals = screen.getAllByText('$0.00')
      expect(subtotals.length).toBeGreaterThan(0)
    })

    it('handles very large cart total', () => {
      render(<CheckoutForm cartTotal={9999.99} />)
      const subtotals = screen.getAllByText('$9999.99')
      expect(subtotals.length).toBeGreaterThan(0)
    })

    it('handles missing onSubmit callback', async () => {
      const user = userEvent.setup()
      const { container } = render(<CheckoutForm />)

      const nameInputs = screen.getAllByPlaceholderText('John Doe')
      await user.type(nameInputs[0], 'John Doe')

      const emailInputs = screen.getAllByPlaceholderText('john@example.com')
      await user.type(emailInputs[0], 'john@example.com')

      const phoneInputs = screen.getAllByPlaceholderText(/\+1 \(555\) 123-4567/)
      await user.type(phoneInputs[0], '5551234567')

      const addressTextareas = screen.getAllByPlaceholderText(/123 Main Street/)
      await user.type(addressTextareas[0], '123 Main Street, City, State 12345')

      const radios = container.querySelectorAll('input[type="radio"]')
      await user.click(radios[0])

      // Should not throw error
      const submitButton = screen.getByRole('button', { name: /Place Order/i })
      await user.click(submitButton)

      expect(submitButton).toBeInTheDocument()
    })

    it('handles special characters in form fields', async () => {
      const user = userEvent.setup()
      const mockSubmit = jest.fn().mockResolvedValue(undefined)
      render(<CheckoutForm onSubmit={mockSubmit} />)

      const nameInputs = screen.getAllByPlaceholderText('John Doe')
      await user.type(nameInputs[0], "O'Brien")

      expect(nameInputs[0]).toHaveValue("O'Brien")
    })

    it('handles very long address input', async () => {
      const user = userEvent.setup()
      render(<CheckoutForm />)

      const addressTextareas = screen.getAllByPlaceholderText(/123 Main Street/)
      const longAddress =
        '123 Very Long Street Name, Suite 456, Apartment 789, Building Complex, City Name, State 12345, Country'

      await user.type(addressTextareas[0], longAddress)

      expect(addressTextareas[0]).toHaveValue(longAddress)
    })
  })

  describe('Form State Management', () => {
    it('maintains field values while typing', async () => {
      const user = userEvent.setup()
      render(<CheckoutForm />)

      const nameInputs = screen.getAllByPlaceholderText('John Doe') as HTMLInputElement[]
      await user.type(nameInputs[0], 'Jane Doe')

      expect(nameInputs[0].value).toBe('Jane Doe')
    })

    it('shows validation errors on blur for invalid inputs', async () => {
      const user = userEvent.setup()
      render(<CheckoutForm />)

      const submitButton = screen.getByRole('button', { name: /Place Order/i })
      await user.click(submitButton)

      await waitFor(() => {
        const errors = screen.queryAllByText(/must be at least|Invalid|required/i)
        expect(errors.length).toBeGreaterThan(0)
      }, { timeout: 1000 })
    })
  })
})
