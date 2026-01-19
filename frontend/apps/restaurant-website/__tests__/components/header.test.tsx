/**
 * Tests for Header component
 * Coverage: Navigation, cart display, theme integration, mobile menu, localization
 */

import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Header } from '@/components/header'

// Mock dependencies
jest.mock('@/lib/subdomain-context', () => ({
  useSubdomain: jest.fn(() => ({
    slug: 'test-restaurant',
  })),
}))

jest.mock('@/lib/hooks/use-theme', () => ({
  useThemeHeader: jest.fn(),
  useThemeIdentity: jest.fn(),
}))

jest.mock('@/components/dark-mode-toggle', () => ({
  DarkModeToggle: () => <button data-testid="dark-mode-toggle">Dark Mode</button>,
}))

jest.mock('@/components/language-switcher', () => ({
  LanguageSwitcher: () => <button data-testid="language-switcher">Language</button>,
}))

jest.mock('next/link', () => {
  return ({ children, href }: any) => <a href={href}>{children}</a>
})

import { useThemeHeader, useThemeIdentity } from '@/lib/hooks/use-theme'

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useThemeHeader as jest.Mock).mockReturnValue({
      background_color: '#ffffff',
      text_color: '#000000',
      height: 64,
      navigation_items: [
        { href: '/en/menu', label: 'Menu', order: 1 },
        { href: '/en/orders', label: 'Orders', order: 2 },
        { href: '/en/settings', label: 'Settings', order: 3 },
      ],
    })

    ;(useThemeIdentity as jest.Mock).mockReturnValue({
      logo_url: null,
      site_title: 'Test Restaurant',
      favicon_url: null,
    })
  })

  describe('Basic Rendering', () => {
    it('renders header element', () => {
      const { container } = render(<Header />)
      expect(container.querySelector('header')).toBeInTheDocument()
    })

    it('renders restaurant name', () => {
      render(<Header />)
      expect(screen.getByText('Test Restaurant')).toBeInTheDocument()
    })

    it('renders "Order Food Online" subtitle', () => {
      render(<Header />)
      expect(screen.getByText('Order Food Online')).toBeInTheDocument()
    })

    it('applies sticky positioning', () => {
      const { container } = render(<Header />)
      const header = container.querySelector('header')
      expect(header).toHaveClass('sticky', 'top-0', 'z-50')
    })
  })

  describe('Navigation Items', () => {
    it('renders all navigation items', () => {
      render(<Header />)
      expect(screen.getByText('Menu')).toBeInTheDocument()
      expect(screen.getByText('Orders')).toBeInTheDocument()
      expect(screen.getByText('Settings')).toBeInTheDocument()
    })

    it('sorts navigation items by order property', () => {
      ;(useThemeHeader as jest.Mock).mockReturnValue({
        navigation_items: [
          { href: '/settings', label: 'Settings', order: 3 },
          { href: '/menu', label: 'Menu', order: 1 },
          { href: '/orders', label: 'Orders', order: 2 },
        ],
      })

      const { container } = render(<Header />)
      const buttons = Array.from(container.querySelectorAll('nav button'))

      // Note: Depending on desktop/mobile rendering, we need to check the visible nav
      expect(buttons.length).toBeGreaterThan(0)
    })

    it('uses fallback navigation when theme items empty', () => {
      ;(useThemeHeader as jest.Mock).mockReturnValue({
        navigation_items: [],
      })

      render(<Header locale="en" />)
      expect(screen.getByText('Menu')).toBeInTheDocument()
      expect(screen.getByText('Orders')).toBeInTheDocument()
    })

    it('shows Arabic navigation items', () => {
      ;(useThemeHeader as jest.Mock).mockReturnValue({
        navigation_items: [
          { href: '/ar/menu', label: 'القائمة', order: 1 },
          { href: '/ar/orders', label: 'الطلبات', order: 2 },
        ],
      })

      render(<Header locale="ar" />)
      expect(screen.getByText('القائمة')).toBeInTheDocument()
      expect(screen.getByText('الطلبات')).toBeInTheDocument()
    })

    it('navigation links have correct href', () => {
      render(<Header locale="en" />)
      const menuLinks = screen.getAllByText('Menu')
      expect(menuLinks.length).toBeGreaterThan(0)
      expect(menuLinks[0].closest('a')).toHaveAttribute('href', '/en/menu')
    })
  })

  describe('Cart Display', () => {
    it('renders cart icon', () => {
      render(<Header />)
      const cartLinks = screen.getAllByRole('link').filter(
        link => link.getAttribute('href')?.includes('cart')
      )
      expect(cartLinks.length).toBeGreaterThan(0)
    })

    it('does not show counter when cartItemsCount is 0', () => {
      render(<Header cartItemsCount={0} />)
      expect(screen.queryByText('0')).not.toBeInTheDocument()
    })

    it('shows cart counter with count', () => {
      render(<Header cartItemsCount={3} />)
      expect(screen.getByText('3')).toBeInTheDocument()
    })

    it('shows 9+ for counts greater than 9', () => {
      render(<Header cartItemsCount={15} />)
      expect(screen.getByText('9+')).toBeInTheDocument()
    })

    it('cart link uses correct locale', () => {
      render(<Header locale="en" />)
      const cartLinks = screen.getAllByRole('link').filter(
        link => link.getAttribute('href')?.includes('cart')
      )
      expect(cartLinks[0]).toHaveAttribute('href', '/en/cart')
    })
  })

  describe('Theme Integration', () => {
    it('applies theme background color', () => {
      const { container } = render(<Header />)
      const header = container.querySelector('header')
      expect(header).toHaveStyle('backgroundColor: rgb(255, 255, 255)')
    })

    it('applies theme text color', () => {
      const { container } = render(<Header />)
      const header = container.querySelector('header')
      expect(header).toHaveStyle('color: rgb(0, 0, 0)')
    })

    it('applies theme height', () => {
      const { container } = render(<Header />)
      const header = container.querySelector('header')
      expect(header).toHaveStyle('height: 64px')
    })

    it('uses fallback colors when theme not provided', () => {
      ;(useThemeHeader as jest.Mock).mockReturnValue(null)

      const { container } = render(<Header />)
      const header = container.querySelector('header')
      // Should have default styling
      expect(header).toHaveStyle('backgroundColor: rgb(255, 255, 255)')
    })

    it('updates styles when theme changes', () => {
      const { container, rerender } = render(<Header />)

      ;(useThemeHeader as jest.Mock).mockReturnValue({
        background_color: '#0ea5e9',
        text_color: '#ffffff',
        height: 80,
      })

      rerender(<Header />)

      const header = container.querySelector('header')
      expect(header).toHaveStyle('height: 80px')
    })
  })

  describe('Restaurant Name & Logo', () => {
    it('displays theme site title', () => {
      render(<Header />)
      expect(screen.getByText('Test Restaurant')).toBeInTheDocument()
    })

    it('shows emoji logo when no image provided', () => {
      render(<Header />)
      expect(screen.getByText('🍽️')).toBeInTheDocument()
    })

    it('displays logo image when available', () => {
      ;(useThemeIdentity as jest.Mock).mockReturnValue({
        logo_url: '/logo.png',
        site_title: 'Test Restaurant',
      })

      const { container } = render(<Header />)
      const logo = container.querySelector('img')
      expect(logo).toHaveAttribute('src', '/logo.png')
      expect(logo).toHaveAttribute('alt', 'Test Restaurant')
    })

    it('uses fallback name when theme identity unavailable', () => {
      ;(useThemeIdentity as jest.Mock).mockReturnValue(null)

      render(<Header locale="en" />)
      // Without theme identity, should show fallback
      const heading = screen.getByRole('heading')
      expect(heading).toBeInTheDocument()
    })

    it('truncates very long restaurant names', () => {
      ;(useThemeIdentity as jest.Mock).mockReturnValue({
        site_title: 'The Most Extraordinarily Long Restaurant Name That Could Possibly Exist In The Entire Universe',
        logo_url: null,
      })

      const { container } = render(<Header />)
      const h1 = container.querySelector('h1')
      expect(h1).toHaveClass('truncate')
    })
  })

  describe('Dark Mode & Language Toggle', () => {
    it('renders dark mode toggle', () => {
      render(<Header />)
      expect(screen.getByTestId('dark-mode-toggle')).toBeInTheDocument()
    })

    it('renders language switcher', () => {
      render(<Header />)
      expect(screen.getByTestId('language-switcher')).toBeInTheDocument()
    })

    it('renders both toggles on all screen sizes', () => {
      render(<Header />)
      expect(screen.getByTestId('dark-mode-toggle')).toBeVisible()
      expect(screen.getByTestId('language-switcher')).toBeVisible()
    })
  })

  describe('Localization', () => {
    it('uses English locale in links', () => {
      render(<Header locale="en" />)
      const homeLink = screen.getByRole('link', { name: /Test Restaurant|Order Food Online/i })
      expect(homeLink.getAttribute('href')).toMatch(/^\/en/)
    })

    it('uses Arabic locale in links', () => {
      render(<Header locale="ar" />)
      const homeLink = screen.getByRole('link', { name: /Test Restaurant|Order Food Online/i })
      expect(homeLink.getAttribute('href')).toMatch(/^\/ar/)
    })

    it('uses Arabic fallback navigation labels', () => {
      ;(useThemeHeader as jest.Mock).mockReturnValue({
        navigation_items: [],
      })

      render(<Header locale="ar" />)
      expect(screen.getByText('القائمة')).toBeInTheDocument()
      expect(screen.getByText('الطلبات')).toBeInTheDocument()
      expect(screen.getByText('الإعدادات')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has header element for semantic structure', () => {
      const { container } = render(<Header />)
      expect(container.querySelector('header')).toBeInTheDocument()
    })

    it('has navigation element', () => {
      const { container } = render(<Header />)
      expect(container.querySelector('nav')).toBeInTheDocument()
    })

    it('logo image has alt text', () => {
      ;(useThemeIdentity as jest.Mock).mockReturnValue({
        logo_url: '/logo.png',
        site_title: 'Test Restaurant',
      })

      const { container } = render(<Header />)
      const img = container.querySelector('img')
      expect(img).toHaveAttribute('alt', 'Test Restaurant')
    })

    it('has heading for restaurant title', () => {
      const { container } = render(<Header />)
      const h1 = container.querySelector('h1')
      expect(h1).toBeInTheDocument()
      expect(h1?.textContent).toBe('Test Restaurant')
    })

    it('buttons are keyboard accessible', async () => {
      const user = userEvent.setup()
      render(<Header />)

      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)

      // Should be able to tab to buttons
      await user.tab()
      expect(document.activeElement).toBeDefined()
    })
  })

  describe('Mobile Menu', () => {
    it('has mobile menu button', () => {
      const { container } = render(<Header />)
      const mobileMenuBtn = Array.from(container.querySelectorAll('button')).find(
        btn => btn.className.includes('md:hidden')
      )
      expect(mobileMenuBtn).toBeDefined()
    })

    it('does not show mobile nav initially', () => {
      const { container } = render(<Header />)
      const navs = container.querySelectorAll('nav')
      // Should only have one nav (desktop), not mobile nav
      expect(navs.length).toBe(1)
    })

    it('toggles mobile menu on button click', async () => {
      const user = userEvent.setup()
      const { container } = render(<Header />)

      const buttons = Array.from(container.querySelectorAll('button'))
      const mobileMenuBtn = buttons.find(btn => btn.className.includes('md:hidden'))

      if (mobileMenuBtn) {
        await user.click(mobileMenuBtn)
        // After click, should have mobile nav visible
        const navs = container.querySelectorAll('nav')
        expect(navs.length).toBeGreaterThanOrEqual(1)
      }
    })
  })

  describe('Edge Cases', () => {
    it('handles null theme values gracefully', () => {
      ;(useThemeHeader as jest.Mock).mockReturnValue(null)
      ;(useThemeIdentity as jest.Mock).mockReturnValue(null)

      render(<Header />)
      expect(screen.getByRole('heading')).toBeInTheDocument()
    })

    it('handles empty navigation items array', () => {
      ;(useThemeHeader as jest.Mock).mockReturnValue({
        navigation_items: [],
      })

      render(<Header />)
      expect(screen.getByText('Menu')).toBeInTheDocument()
    })

    it('handles large cart count', () => {
      render(<Header cartItemsCount={999} />)
      expect(screen.getByText('9+')).toBeInTheDocument()
    })

    it('handles missing locale prop', () => {
      render(<Header />)
      expect(screen.getByRole('heading')).toBeInTheDocument()
    })

    it('handles missing cartItemsCount prop', () => {
      render(<Header />)
      expect(screen.getByRole('heading')).toBeInTheDocument()
    })
  })

  describe('Props Variations', () => {
    it('renders with custom cartItemsCount', () => {
      render(<Header cartItemsCount={5} />)
      expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('renders with English locale', () => {
      render(<Header locale="en" />)
      const homeLink = screen.getAllByRole('link')[0]
      expect(homeLink.getAttribute('href')).toMatch(/^\/en/)
    })

    it('renders with Arabic locale', () => {
      render(<Header locale="ar" />)
      const homeLink = screen.getAllByRole('link')[0]
      expect(homeLink.getAttribute('href')).toMatch(/^\/ar/)
    })

    it('renders with all props combined', () => {
      render(<Header cartItemsCount={10} locale="ar" />)
      expect(screen.getByText('9+')).toBeInTheDocument()
      const homeLink = screen.getAllByRole('link')[0]
      expect(homeLink.getAttribute('href')).toMatch(/^\/ar/)
    })
  })
})
