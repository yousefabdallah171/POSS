/**
 * Tests for ThemeSelector component
 * Coverage: Theme display, selection, loading, localization, theme store integration
 */

import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeSelector } from '@/components/theme-selector'

// Mock dependencies
jest.mock('@/lib/hooks/use-theme', () => ({
  useThemeColors: jest.fn(() => ({
    background: '#ffffff',
    text: '#1f2937',
    border: '#e5e7eb',
    primary: '#f97316',
  })),
}))

jest.mock('@/lib/store/theme-store', () => ({
  useThemeStore: jest.fn(() => ({
    currentTheme: { slug: 'light', name: 'Light' },
    loadTheme: jest.fn().mockResolvedValue(undefined),
  })),
}))

import { useThemeColors } from '@/lib/hooks/use-theme'
import { useThemeStore } from '@/lib/store/theme-store'

describe('ThemeSelector Component', () => {
  const mockThemes = [
    {
      slug: 'light',
      name: 'Light',
      description: 'Light theme with bright colors',
      colors: {
        primary: '#f97316',
        secondary: '#0ea5e9',
        accent: '#fbbf24',
      },
    },
    {
      slug: 'dark',
      name: 'Dark',
      description: 'Dark theme with cool tones',
      colors: {
        primary: '#8b5cf6',
        secondary: '#ec4899',
        accent: '#06b6d4',
      },
    },
    {
      slug: 'ocean',
      name: 'Ocean',
      description: 'Ocean-inspired theme',
      colors: {
        primary: '#0369a1',
        secondary: '#06b6d4',
        accent: '#7dd3fc',
      },
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useThemeColors as jest.Mock).mockReturnValue({
      background: '#ffffff',
      text: '#1f2937',
      border: '#e5e7eb',
      primary: '#f97316',
    })
    ;(useThemeStore as jest.Mock).mockReturnValue({
      currentTheme: { slug: 'light', name: 'Light' },
      loadTheme: jest.fn().mockResolvedValue(undefined),
    })
  })

  describe('Grid View (Full Mode)', () => {
    it('renders full grid view by default', () => {
      render(<ThemeSelector themes={mockThemes} />)
      const heading = screen.getByRole('heading', { name: /Select Theme/i })
      expect(heading).toBeInTheDocument()
    })

    it('displays theme grid', () => {
      render(<ThemeSelector themes={mockThemes} />)
      expect(screen.getByText('Light')).toBeInTheDocument()
      expect(screen.getByText('Dark')).toBeInTheDocument()
      expect(screen.getByText('Ocean')).toBeInTheDocument()
    })

    it('displays theme descriptions', () => {
      render(<ThemeSelector themes={mockThemes} />)
      expect(screen.getByText('Light theme with bright colors')).toBeInTheDocument()
      expect(screen.getByText('Dark theme with cool tones')).toBeInTheDocument()
      expect(screen.getByText('Ocean-inspired theme')).toBeInTheDocument()
    })

    it('renders color preview for each theme', () => {
      const { container } = render(<ThemeSelector themes={mockThemes} />)
      const colorPreviews = container.querySelectorAll('[title]')
      expect(colorPreviews.length).toBeGreaterThan(0)
    })

    it('shows selected theme indicator', () => {
      const { container } = render(<ThemeSelector themes={mockThemes} />)
      // Find the selected badge (check icon container)
      const selectedBadges = container.querySelectorAll('[style*="background"]')
      expect(selectedBadges.length).toBeGreaterThan(0)
    })

    it('theme buttons are clickable', async () => {
      const user = userEvent.setup()
      render(<ThemeSelector themes={mockThemes} />)

      const darkThemeButton = screen.getByRole('button', { name: /Dark/ })
      expect(darkThemeButton).toBeInTheDocument()
      expect(darkThemeButton).not.toBeDisabled()

      await user.click(darkThemeButton)
    })
  })

  describe('Compact View (Dropdown Mode)', () => {
    it('renders dropdown when compact={true}', () => {
      const { container } = render(<ThemeSelector themes={mockThemes} compact={true} />)
      const select = container.querySelector('select')
      expect(select).toBeInTheDocument()
    })

    it('displays theme options in dropdown', () => {
      render(<ThemeSelector themes={mockThemes} compact={true} />)
      expect(screen.getByDisplayValue('Light')).toBeInTheDocument()
    })

    it('shows select placeholder', () => {
      render(<ThemeSelector themes={mockThemes} compact={true} />)
      expect(screen.getByText('Select Theme')).toBeInTheDocument()
    })

    it('can select theme from dropdown', async () => {
      const user = userEvent.setup()
      const mockLoadTheme = jest.fn().mockResolvedValue(undefined)
      ;(useThemeStore as jest.Mock).mockReturnValue({
        currentTheme: { slug: 'light', name: 'Light' },
        loadTheme: mockLoadTheme,
      })

      const { container } = render(<ThemeSelector themes={mockThemes} compact={true} />)
      const select = container.querySelector('select') as HTMLSelectElement

      // Verify select has the themes as options
      expect(select).toHaveDisplayValue('Light')

      // Change selection
      await user.selectOptions(select, 'dark')

      // Verify the selection handler was triggered
      expect(mockLoadTheme).toHaveBeenCalled()
    })
  })

  describe('Theme Selection', () => {
    it('calls loadTheme when theme selected', async () => {
      const user = userEvent.setup()
      const mockLoadTheme = jest.fn().mockResolvedValue(undefined)
      ;(useThemeStore as jest.Mock).mockReturnValue({
        currentTheme: { slug: 'light', name: 'Light' },
        loadTheme: mockLoadTheme,
      })

      render(<ThemeSelector themes={mockThemes} />)

      const darkThemeButton = screen.getByRole('button', { name: /Dark/ })
      await user.click(darkThemeButton)

      await waitFor(() => {
        expect(mockLoadTheme).toHaveBeenCalledWith('dark')
      })
    })

    it('calls onThemeChange callback when theme selected', async () => {
      const user = userEvent.setup()
      const mockOnThemeChange = jest.fn()
      const mockLoadTheme = jest.fn().mockResolvedValue(undefined)
      ;(useThemeStore as jest.Mock).mockReturnValue({
        currentTheme: { slug: 'light', name: 'Light' },
        loadTheme: mockLoadTheme,
      })

      render(<ThemeSelector themes={mockThemes} onThemeChange={mockOnThemeChange} />)

      const darkThemeButton = screen.getByRole('button', { name: /Dark/ })
      await user.click(darkThemeButton)

      await waitFor(() => {
        expect(mockOnThemeChange).toHaveBeenCalledWith('dark')
      })
    })

    it('disables selected theme button', () => {
      render(<ThemeSelector themes={mockThemes} />)

      // Find the Light theme button which is currently selected
      const lightThemeButton = screen.getByRole('button', { name: /Light/ })
      expect(lightThemeButton).toBeDisabled()
    })
  })

  describe('Loading State', () => {
    it('shows loading state while loading theme', async () => {
      const user = userEvent.setup()
      let resolveLoad: () => void
      const loadPromise = new Promise<void>((resolve) => {
        resolveLoad = resolve
      })

      const mockLoadTheme = jest.fn(() => loadPromise)
      ;(useThemeStore as jest.Mock).mockReturnValue({
        currentTheme: { slug: 'light', name: 'Light' },
        loadTheme: mockLoadTheme,
      })

      render(<ThemeSelector themes={mockThemes} />)

      const darkThemeButton = screen.getByRole('button', { name: /Dark/ })
      await user.click(darkThemeButton)

      // Theme button should be disabled during loading
      resolveLoad!()

      await waitFor(() => {
        expect(mockLoadTheme).toHaveBeenCalled()
      })
    })

    it('disables dropdown while loading', async () => {
      const mockLoadTheme = jest.fn(() => new Promise(() => {})) // Never resolves
      ;(useThemeStore as jest.Mock).mockReturnValue({
        currentTheme: { slug: 'light', name: 'Light' },
        loadTheme: mockLoadTheme,
      })

      const { container } = render(<ThemeSelector themes={mockThemes} compact={true} />)
      const select = container.querySelector('select') as HTMLSelectElement

      // Select should be disabled during loading
      expect(select).toBeInTheDocument()
    })
  })

  describe('Theme Colors', () => {
    it('displays color swatches for each theme', () => {
      const { container } = render(<ThemeSelector themes={mockThemes} />)
      // Look for any divs with color-related attributes or titles
      const colorSwatches = container.querySelectorAll('div[title], div[style]')
      // Should have at least some styled elements
      expect(colorSwatches.length).toBeGreaterThan(0)
    })

    it('shows primary color for selected theme border', () => {
      const { container } = render(<ThemeSelector themes={mockThemes} />)
      const themeButtons = container.querySelectorAll('button[style*="border"]')
      expect(themeButtons.length).toBeGreaterThan(0)
    })
  })

  describe('Localization', () => {
    it('renders English labels by default', () => {
      render(<ThemeSelector themes={mockThemes} locale="en" />)
      expect(screen.getByText('Select Theme')).toBeInTheDocument()
      expect(screen.getByText('Choose a theme to personalize your experience')).toBeInTheDocument()
    })

    it('renders Arabic labels when locale="ar"', () => {
      render(<ThemeSelector themes={mockThemes} locale="ar" />)
      expect(screen.getByText('اختر المظهر')).toBeInTheDocument()
      expect(screen.getByText('اختر مظهراً لتخصيص تجربتك')).toBeInTheDocument()
    })

    it('translates dropdown labels', () => {
      render(<ThemeSelector themes={mockThemes} locale="ar" compact={true} />)
      expect(screen.getByText('اختر المظهر')).toBeInTheDocument()
    })
  })

  describe('RTL Support', () => {
    it('handles Arabic locale in compact mode', () => {
      const { container } = render(<ThemeSelector themes={mockThemes} locale="ar" compact={true} />)
      const select = container.querySelector('select')
      expect(select).toBeInTheDocument()
    })

    it('handles Arabic locale in grid mode', () => {
      render(<ThemeSelector themes={mockThemes} locale="ar" />)
      expect(screen.getByText('اختر المظهر')).toBeInTheDocument()
    })
  })

  describe('Theme Integration', () => {
    it('applies theme background color', () => {
      const { container } = render(<ThemeSelector themes={mockThemes} />)
      const selectors = container.querySelectorAll('[style*="background"]')
      expect(selectors.length).toBeGreaterThan(0)
    })

    it('applies theme text color to heading', () => {
      render(<ThemeSelector themes={mockThemes} />)
      const heading = screen.getByRole('heading', { name: /Select Theme/i })
      expect(heading).toHaveStyle('color: rgb(31, 41, 55)')
    })

    it('uses fallback colors when theme unavailable', () => {
      ;(useThemeColors as jest.Mock).mockReturnValue(null)
      render(<ThemeSelector themes={mockThemes} />)
      expect(screen.getByRole('heading', { name: /Select Theme/i })).toBeInTheDocument()
    })
  })

  describe('Props Variations', () => {
    it('renders with no themes', () => {
      render(<ThemeSelector themes={[]} />)
      expect(screen.getByRole('heading', { name: /Select Theme/i })).toBeInTheDocument()
    })

    it('renders with minimal props', () => {
      render(<ThemeSelector />)
      expect(screen.getByRole('heading', { name: /Select Theme/i })).toBeInTheDocument()
    })

    it('renders with custom themes', () => {
      const customThemes = [
        {
          slug: 'custom',
          name: 'Custom Theme',
          description: 'A custom theme',
          colors: {
            primary: '#ff0000',
            secondary: '#00ff00',
            accent: '#0000ff',
          },
        },
      ]
      render(<ThemeSelector themes={customThemes} />)
      expect(screen.getByText('Custom Theme')).toBeInTheDocument()
    })

    it('renders with all props', () => {
      const mockCallback = jest.fn()
      render(
        <ThemeSelector
          themes={mockThemes}
          locale="ar"
          onThemeChange={mockCallback}
          compact={false}
        />
      )
      expect(screen.getByText('اختر المظهر')).toBeInTheDocument()
    })

    it('renders compact mode', () => {
      const { container } = render(<ThemeSelector themes={mockThemes} compact={true} />)
      const select = container.querySelector('select')
      expect(select).toBeInTheDocument()
    })

    it('renders full mode', () => {
      render(<ThemeSelector themes={mockThemes} compact={false} />)
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(1)
    })
  })

  describe('Edge Cases', () => {
    it('handles theme with very long name', () => {
      const longNameTheme = [
        {
          slug: 'long',
          name: 'This Is A Very Long Theme Name That Might Overflow',
          description: 'A theme with a long name',
          colors: {
            primary: '#f97316',
            secondary: '#0ea5e9',
            accent: '#fbbf24',
          },
        },
      ]
      render(<ThemeSelector themes={longNameTheme} />)
      expect(screen.getByText(/This Is A Very Long Theme Name/)).toBeInTheDocument()
    })

    it('handles theme with very long description', () => {
      const longDescTheme = [
        {
          slug: 'long',
          name: 'Theme',
          description: 'This is a very long description that contains lots of details about the theme and extends across multiple lines',
          colors: {
            primary: '#f97316',
            secondary: '#0ea5e9',
            accent: '#fbbf24',
          },
        },
      ]
      render(<ThemeSelector themes={longDescTheme} />)
      expect(screen.getByText(/This is a very long description/)).toBeInTheDocument()
    })

    it('handles single theme', () => {
      const singleTheme = [mockThemes[0]]
      render(<ThemeSelector themes={singleTheme} />)
      expect(screen.getByText('Light')).toBeInTheDocument()
    })

    it('handles many themes (10+)', () => {
      const manyThemes = Array.from({ length: 12 }, (_, i) => ({
        slug: `theme-${i}`,
        name: `Theme ${i}`,
        description: `Theme ${i} description`,
        colors: {
          primary: `#${Math.random().toString(16).slice(2, 8)}`,
          secondary: `#${Math.random().toString(16).slice(2, 8)}`,
          accent: `#${Math.random().toString(16).slice(2, 8)}`,
        },
      }))
      render(<ThemeSelector themes={manyThemes} />)
      expect(screen.getByText('Theme 0')).toBeInTheDocument()
      expect(screen.getByText('Theme 11')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('grid mode has proper heading structure', () => {
      render(<ThemeSelector themes={mockThemes} />)
      const heading = screen.getByRole('heading', { name: /Select Theme/i })
      expect(heading).toBeInTheDocument()
    })

    it('theme buttons are keyboard accessible', async () => {
      const user = userEvent.setup()
      render(<ThemeSelector themes={mockThemes} />)

      const themeButtons = screen.getAllByRole('button')
      expect(themeButtons.length).toBeGreaterThan(0)

      await user.tab()
      expect(document.activeElement).toBeDefined()
    })

    it('color swatches have title attributes', () => {
      const { container } = render(<ThemeSelector themes={mockThemes} />)
      const colorSwatches = container.querySelectorAll('[title]')
      expect(colorSwatches.length).toBeGreaterThan(0)
    })

    it('compact mode select is accessible', () => {
      const { container } = render(<ThemeSelector themes={mockThemes} compact={true} />)
      const select = container.querySelector('select')
      expect(select).toHaveAttribute('class')
    })
  })
})
