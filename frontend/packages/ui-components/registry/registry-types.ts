/**
 * Component Registry Type Definitions
 *
 * Defines all TypeScript interfaces and enums used for component
 * registration, discovery, and configuration throughout the system.
 */

import React from 'react'
import { z } from 'zod'

/**
 * Component type enumeration - covers all draggable section types
 */
export enum ComponentType {
  // Atoms
  BUTTON = 'button',
  INPUT = 'input',
  LABEL = 'label',
  BADGE = 'badge',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  SELECT = 'select',
  TEXTAREA = 'textarea',
  SWITCH = 'switch',
  AVATAR = 'avatar',

  // Molecules
  SEARCH_BAR = 'search-bar',
  FORM_GROUP = 'form-group',
  CARD = 'card',
  DROPDOWN_MENU = 'dropdown-menu',
  BREADCRUMB = 'breadcrumb',
  PAGINATION = 'pagination',
  ALERT = 'alert',

  // Organisms (Draggable Sections)
  HERO = 'hero',
  PRODUCTS = 'products',
  WHY_US = 'why-us',
  CONTACT = 'contact',
  TESTIMONIALS = 'testimonials',
  CTA = 'cta',
  GALLERY = 'gallery',
  PRICING = 'pricing',
  TEAM = 'team',
  FAQ = 'faq',
  BLOG = 'blog',
  CUSTOM = 'custom',

  // Templates
  HEADER = 'header',
  FOOTER = 'footer',
  SIDEBAR = 'sidebar',
  GRID_LAYOUT = 'grid-layout',
}

/**
 * Component category for organization and filtering
 */
export enum ComponentCategory {
  MARKETING = 'marketing',
  COMMERCE = 'commerce',
  CONTENT = 'content',
  FORMS = 'forms',
  NAVIGATION = 'navigation',
  LAYOUT = 'layout',
  SOCIAL = 'social',
  CUSTOM = 'custom',
}

/**
 * Industry type for theme preset filtering
 */
export enum IndustryType {
  GENERIC = 'generic',
  RESTAURANT = 'restaurant',
  RETAIL = 'retail',
  CAFE = 'cafe',
  SERVICES = 'services',
  PORTFOLIO = 'portfolio',
  BLOG = 'blog',
  ECOMMERCE = 'ecommerce',
}

/**
 * Configuration schema specification
 */
export interface ConfigSchema {
  type: 'zod' | 'json-schema'
  schema: z.ZodType<any, any, any> | Record<string, any>
}

/**
 * Component example for documentation
 */
export interface ComponentExample {
  name: string
  description: string
  config: Record<string, any>
  previewImage?: string
}

/**
 * Component metadata for auto-discovery and drag-drop registration
 *
 * Every draggable component must have a .meta.ts file exporting
 * a ComponentMetadata object following this interface.
 */
export interface ComponentMetadata {
  // Identification
  id: string
  name: string
  type: ComponentType
  version: string

  // Classification
  category: ComponentCategory
  tags: string[]
  industries: IndustryType[]

  // UI Metadata
  icon: string // Lucide icon name or emoji
  description: string
  thumbnail?: string
  previewUrl?: string

  // Component Behavior
  isDraggable: boolean
  isEditable: boolean
  isReorderable: boolean
  isSingleton: boolean
  isRequired: boolean

  // Configuration
  editorComponent: string
  defaultConfig: Record<string, any>
  configSchema: ConfigSchema

  // Dependencies
  requiredComponents?: string[]
  incompatibleWith?: string[]

  // Performance
  estimatedSize: 'small' | 'medium' | 'large'
  lazyLoadable: boolean

  // Documentation
  documentation?: string
  examples?: ComponentExample[]
}

/**
 * Component registry entry with loaded component and editor
 */
export interface ComponentRegistryEntry extends ComponentMetadata {
  componentPath: string
  component?: React.ComponentType<any>
  editor?: React.ComponentType<any>
}

/**
 * Global component registry
 */
export interface ComponentRegistry {
  version: string
  generatedAt: string
  components: Record<string, ComponentMetadata>
  categories: Record<ComponentCategory, string[]>
  industries: Record<IndustryType, string[]>
}
