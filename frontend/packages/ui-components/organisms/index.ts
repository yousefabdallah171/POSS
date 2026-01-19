/**
 * @pos-saas/ui-components - Organisms
 *
 * Large, self-contained component sections that are draggable in the theme builder.
 * Each organism includes full metadata for auto-discovery, configuration schemas,
 * and editor components for runtime editing.
 *
 * Public API exports HeroSection. Other organisms are discovered via registry
 * auto-discovery from their .meta.ts files at build time.
 */

// Hero Section - Hero banner with CTA (IMPLEMENTED)
export { HeroSection, type HeroSectionProps, type HeroConfig, HeroSectionMetadata, defaultHeroConfig, heroConfigDefaults } from './HeroSection'
