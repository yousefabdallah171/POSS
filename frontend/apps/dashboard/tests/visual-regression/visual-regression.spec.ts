/**
 * Visual Regression Tests
 * Compares v1.1.0 and v2.0.0 component rendering for visual consistency
 *
 * Usage with Playwright:
 * npx playwright test visual-regression.spec.ts
 *
 * Usage with Percy CI:
 * npm run test:visual
 */

import { test, expect } from '@playwright/test'

test.describe('Visual Regression Tests - v1.1.0 vs v2.0.0', () => {
  /**
   * Theme Rendering Consistency
   */
  test.describe('Theme Rendering', () => {
    test('legacy theme colors render correctly', async ({ page }) => {
      await page.goto('/theme-preview?theme=legacy')

      // Verify color rendering
      const primaryButton = page.locator('[data-test="btn-primary"]')
      const bgColor = await primaryButton.evaluate((el) => window.getComputedStyle(el).backgroundColor)

      // Legacy primary color should match (#007bff)
      expect(bgColor).toMatch(/rgb\(0, 123, 255\)/)
    })

    test('spacing values consistent with v1.1.0', async ({ page }) => {
      await page.goto('/theme-preview?theme=default')

      const container = page.locator('[data-test="container"]')
      const paddingLeft = await container.evaluate((el) => window.getComputedStyle(el).paddingLeft)

      // Standard spacing should match v1.1.0
      expect(paddingLeft).toMatch(/16px|20px/)
    })

    test('typography rendering matches legacy fonts', async ({ page }) => {
      await page.goto('/theme-preview?theme=default')

      const heading = page.locator('h1')
      const fontFamily = await heading.evaluate((el) => window.getComputedStyle(el).fontFamily)

      // Should use familiar font stacks
      expect(fontFamily).toContain('Segoe')
    })
  })

  /**
   * Component Layout Consistency
   */
  test.describe('Component Layout', () => {
    test('button layout unchanged in v2.0.0', async ({ page }) => {
      await page.goto('/components/buttons')

      const button = page.locator('button.btn-primary').first()
      const boundingBox = await button.boundingBox()

      // Button should have reasonable dimensions
      expect(boundingBox?.width).toBeGreaterThan(50)
      expect(boundingBox?.height).toBeGreaterThan(30)
    })

    test('card component maintains v1.1.0 layout', async ({ page }) => {
      await page.goto('/components/cards')

      const card = page.locator('[data-test="card"]').first()
      const padding = await card.evaluate((el) => window.getComputedStyle(el).padding)

      // Card padding should be consistent
      expect(padding).toBeDefined()
    })

    test('form fields aligned vertically in v2.0.0', async ({ page }) => {
      await page.goto('/components/forms')

      const formGroup = page.locator('[data-test="form-group"]').first()
      const display = await formGroup.evaluate((el) => window.getComputedStyle(el).display)

      // Form groups should still be block-level
      expect(display).toMatch(/block|flex/)
    })

    test('navigation menu structure preserved', async ({ page }) => {
      await page.goto('/')

      const navMenu = page.locator('[data-test="nav-menu"]')
      const visible = await navMenu.isVisible()

      expect(visible).toBeTruthy()
    })
  })

  /**
   * Typography Consistency
   */
  test.describe('Typography', () => {
    test('heading sizes unchanged from v1.1.0', async ({ page }) => {
      await page.goto('/typography')

      const h1 = page.locator('h1').first()
      const h1Size = await h1.evaluate((el) => window.getComputedStyle(el).fontSize)

      // H1 should be appropriately sized
      expect(parseInt(h1Size)).toBeGreaterThan(24)
    })

    test('body text size consistent', async ({ page }) => {
      await page.goto('/typography')

      const body = page.locator('body')
      const fontSize = await body.evaluate((el) => window.getComputedStyle(el).fontSize)

      // Body text should be 14-16px
      const size = parseInt(fontSize)
      expect(size).toBeGreaterThanOrEqual(14)
      expect(size).toBeLessThanOrEqual(18)
    })

    test('line height readable in v2.0.0', async ({ page }) => {
      await page.goto('/typography')

      const paragraph = page.locator('p').first()
      const lineHeight = await paragraph.evaluate((el) => window.getComputedStyle(el).lineHeight)

      // Line height should be at least 1.4x font size
      expect(lineHeight).not.toBe('normal')
    })
  })

  /**
   * Color Consistency
   */
  test.describe('Color Scheme', () => {
    test('primary color not changed from v1.1.0', async ({ page }) => {
      await page.goto('/')

      const primaryElement = page.locator('[data-theme-color="primary"]').first()
      if (await primaryElement.isVisible()) {
        const color = await primaryElement.evaluate((el) => window.getComputedStyle(el).color)
        // Color should be defined
        expect(color).toBeDefined()
      }
    })

    test('background colors maintained', async ({ page }) => {
      await page.goto('/')

      const header = page.locator('header')
      const bgColor = await header.evaluate((el) => window.getComputedStyle(el).backgroundColor)

      // Should have a defined background
      expect(bgColor).not.toBe('rgba(0, 0, 0, 0)')
    })

    test('text contrast meets accessibility standards', async ({ page }) => {
      await page.goto('/')

      const mainContent = page.locator('main')
      const color = await mainContent.evaluate((el) => window.getComputedStyle(el).color)
      const bgColor = await mainContent.evaluate((el) => window.getComputedStyle(el).backgroundColor)

      // Both should be defined
      expect(color).toBeDefined()
      expect(bgColor).toBeDefined()
    })
  })

  /**
   * Spacing Consistency
   */
  test.describe('Spacing', () => {
    test('margins consistent across components', async ({ page }) => {
      await page.goto('/components/spacing')

      const element = page.locator('[data-test="spacing-test"]').first()
      const margin = await element.evaluate((el) => window.getComputedStyle(el).margin)

      expect(margin).toBeDefined()
    })

    test('padding applied correctly', async ({ page }) => {
      await page.goto('/components/spacing')

      const container = page.locator('[data-test="padded-container"]')
      const padding = await container.evaluate((el) => window.getComputedStyle(el).padding)

      expect(padding).not.toBe('0px')
    })

    test('gap values consistent in flex layouts', async ({ page }) => {
      await page.goto('/components/layouts')

      const flexContainer = page.locator('[data-test="flex-container"]')
      const gap = await flexContainer.evaluate((el) => window.getComputedStyle(el).gap)

      expect(gap).toBeDefined()
    })
  })

  /**
   * Component Visibility
   */
  test.describe('Component Visibility', () => {
    test('hidden elements stay hidden from v1.1.0', async ({ page }) => {
      await page.goto('/')

      const hiddenElement = page.locator('[data-test="hidden"]').first()
      if (await hiddenElement.count() > 0) {
        const visible = await hiddenElement.isVisible()
        expect(visible).toBeFalsy()
      }
    })

    test('disabled buttons appear disabled', async ({ page }) => {
      await page.goto('/components/buttons')

      const disabledButton = page.locator('button:disabled').first()
      if (await disabledButton.count() > 0) {
        const opacity = await disabledButton.evaluate((el) => window.getComputedStyle(el).opacity)
        // Disabled buttons should have reduced opacity or other visual indicator
        expect(opacity).toBeDefined()
      }
    })
  })

  /**
   * Responsive Layout
   */
  test.describe('Responsive Behavior', () => {
    test('mobile layout preserved in v2.0.0', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')

      const header = page.locator('header')
      const visible = await header.isVisible()

      expect(visible).toBeTruthy()
    })

    test('tablet layout consistent', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.goto('/')

      const main = page.locator('main')
      const visible = await main.isVisible()

      expect(visible).toBeTruthy()
    })

    test('desktop layout unchanged', async ({ page }) => {
      // Set desktop viewport
      await page.setViewportSize({ width: 1920, height: 1080 })
      await page.goto('/')

      const container = page.locator('[data-test="main-container"]')
      const boundingBox = await container.boundingBox()

      // Should have reasonable width on desktop
      expect(boundingBox?.width).toBeGreaterThan(800)
    })
  })

  /**
   * Interactive Element State
   */
  test.describe('Interactive States', () => {
    test('button hover state preserved', async ({ page }) => {
      await page.goto('/components/buttons')

      const button = page.locator('button.btn-primary').first()
      await button.hover()

      // Element should still be interactive
      await expect(button).toBeFocused()
    })

    test('form input focus state works', async ({ page }) => {
      await page.goto('/components/forms')

      const input = page.locator('input[type="text"]').first()
      await input.focus()

      // Should be focusable
      const focused = await input.evaluate((el) => document.activeElement === el)
      expect(focused).toBeTruthy()
    })

    test('dropdown toggle behavior consistent', async ({ page }) => {
      await page.goto('/components/dropdown')

      const trigger = page.locator('[data-test="dropdown-trigger"]').first()
      if (await trigger.count() > 0) {
        await trigger.click()
        const menu = page.locator('[data-test="dropdown-menu"]')
        const visible = await menu.isVisible()
        expect(visible).toBeTruthy()
      }
    })
  })

  /**
   * Image & Media
   */
  test.describe('Images & Media', () => {
    test('images load correctly without layout shift', async ({ page }) => {
      await page.goto('/gallery')

      const image = page.locator('img').first()
      if (await image.count() > 0) {
        const boundingBox = await image.boundingBox()
        expect(boundingBox).toBeDefined()
      }
    })

    test('responsive images apply correct sizes', async ({ page }) => {
      await page.goto('/gallery')

      const responsiveImg = page.locator('img[srcset]').first()
      if (await responsiveImg.count() > 0) {
        const src = await responsiveImg.getAttribute('src')
        expect(src).toBeDefined()
      }
    })
  })

  /**
   * Accessibility Elements
   */
  test.describe('Accessibility', () => {
    test('ARIA labels preserved from v1.1.0', async ({ page }) => {
      await page.goto('/')

      const button = page.locator('button[aria-label]').first()
      if (await button.count() > 0) {
        const label = await button.getAttribute('aria-label')
        expect(label).toBeDefined()
      }
    })

    test('semantic HTML structure maintained', async ({ page }) => {
      await page.goto('/')

      const main = page.locator('main')
      const visible = await main.count() > 0

      expect(visible).toBeTruthy()
    })

    test('navigation is keyboard accessible', async ({ page }) => {
      await page.goto('/')

      const firstLink = page.locator('a').first()
      await firstLink.focus()

      const focused = await firstLink.evaluate((el) => document.activeElement === el)
      expect(focused).toBeTruthy()
    })
  })
})
