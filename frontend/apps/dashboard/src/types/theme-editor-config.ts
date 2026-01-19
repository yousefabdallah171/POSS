/**
 * Global Theme Editor Configuration
 *
 * This file defines the reusable structure and patterns for all theme editors.
 * It enables consistent UI patterns, validation, and data handling across all editor components.
 *
 * Usage Pattern:
 * 1. Define editor sections using EditorSection interface
 * 2. Create fields with appropriate input types
 * 3. Leverage validation and field renderers
 * 4. Integrate with preview components for real-time updates
 */

/**
 * Supported input field types for the theme editor
 */
export type EditorFieldType =
  | 'text'
  | 'number'
  | 'color'
  | 'checkbox'
  | 'select'
  | 'textarea'
  | 'image-upload'
  | 'array'

/**
 * Editor field configuration for a single form input
 */
export interface EditorField {
  /** Unique identifier for the field */
  id: string

  /** Display label for the field */
  label: string

  /** Optional field description/help text */
  description?: string

  /** Type of input field */
  type: EditorFieldType

  /** Path to the value in the data object (e.g., "header.logoUrl") */
  path: string

  /** Default value if not set */
  defaultValue?: any

  /** Whether the field is required */
  required?: boolean

  /** Placeholder text for input fields */
  placeholder?: string

  /** Min/max for number fields */
  min?: number
  max?: number

  /** Step for number fields */
  step?: number

  /** Options for select fields */
  options?: Array<{ label: string; value: any }>

  /** Custom validation function */
  validate?: (value: any) => string | null

  /** CSS class for field styling */
  className?: string
}

/**
 * Editor section groups related fields together
 */
export interface EditorSection {
  /** Unique identifier for the section */
  id: string

  /** Display title for the section */
  title: string

  /** Optional section description */
  description?: string

  /** Fields in this section */
  fields: EditorField[]

  /** Icon for the section (Lucide icon name) */
  icon?: string

  /** Whether the section is collapsible */
  collapsible?: boolean

  /** Whether the section starts collapsed */
  defaultCollapsed?: boolean
}

/**
 * Complete editor tab definition
 */
export interface EditorTab {
  /** Unique identifier for the tab */
  id: string

  /** Display label for the tab */
  label: string

  /** Lucide icon name for the tab */
  icon?: string

  /** Sections in this tab */
  sections: EditorSection[]

  /** Optional tab description */
  description?: string
}

/**
 * Live preview configuration
 */
export interface PreviewConfig {
  /** Whether the preview is enabled */
  enabled: boolean

  /** Preview panel width (css value) */
  width?: string

  /** Preview device type */
  deviceType?: 'desktop' | 'tablet' | 'mobile'

  /** Preview URL or component selector */
  previewUrl?: string

  /** Component to render for preview */
  previewComponent?: React.ComponentType<any>

  /** Props to pass to preview component */
  previewProps?: Record<string, any>
}

/**
 * Editor state for managing form and UI state
 */
export interface EditorState {
  /** Current theme data being edited */
  currentData: Record<string, any>

  /** Original theme data (for detecting changes) */
  originalData: Record<string, any>

  /** Whether the data has been modified */
  isDirty: boolean

  /** Whether currently saving */
  isSaving: boolean

  /** Validation errors by field ID */
  errors: Record<string, string>

  /** Loading state */
  isLoading: boolean

  /** Active tab ID */
  activeTab?: string
}

/**
 * Editor action types for state management
 */
export type EditorAction =
  | { type: 'SET_FIELD'; path: string; value: any }
  | { type: 'SET_DATA'; data: Record<string, any> }
  | { type: 'MARK_DIRTY'; dirty: boolean }
  | { type: 'SET_ERROR'; fieldId: string; error: string | null }
  | { type: 'SET_SAVING'; saving: boolean }
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'SET_ACTIVE_TAB'; tabId: string }
  | { type: 'RESET' }

/**
 * Utility function to get nested value from object
 */
export function getNestedValue(obj: Record<string, any>, path: string): any {
  return path.split('.').reduce((acc, part) => acc?.[part], obj)
}

/**
 * Utility function to set nested value in object
 */
export function setNestedValue(
  obj: Record<string, any>,
  path: string,
  value: any
): Record<string, any> {
  const keys = path.split('.')
  const lastKey = keys.pop()

  if (!lastKey) return obj

  const target = keys.reduce((acc, key) => {
    if (!(key in acc)) acc[key] = {}
    return acc[key]
  }, obj)

  target[lastKey] = value
  return obj
}

/**
 * Editor layout configuration
 */
export interface EditorLayout {
  /** Layout type */
  type: 'split' | 'full' | 'tabbed'

  /** Show live preview */
  showPreview: boolean

  /** Preview position when split */
  previewPosition?: 'right' | 'bottom'

  /** Enable autosave */
  autoSave?: boolean

  /** Autosave interval in ms */
  autoSaveInterval?: number
}

/**
 * Theme editor configuration (complete)
 */
export interface ThemeEditorConfig {
  /** Editor ID */
  id: string

  /** Editor title */
  title: string

  /** Editor description */
  description?: string

  /** All tabs in the editor */
  tabs: EditorTab[]

  /** Preview configuration */
  preview?: PreviewConfig

  /** Layout configuration */
  layout: EditorLayout

  /** Success message after save */
  successMessage?: string

  /** Error message template */
  errorMessage?: string
}

/**
 * Predefined editor configurations for common theme sections
 */
export const EDITOR_CONFIGS = {
  HEADER: {
    logo: {
      id: 'logo',
      label: 'Logo',
      type: 'image-upload' as EditorFieldType,
      path: 'header.logoUrl',
      description: 'Upload your website logo',
    } as EditorField,
    logoText: {
      id: 'logoText',
      label: 'Logo Text',
      type: 'text' as EditorFieldType,
      path: 'header.logoText',
      placeholder: 'Your site name',
      description: 'Text to display next to or instead of logo',
    } as EditorField,
    showLogo: {
      id: 'showLogo',
      label: 'Show Logo',
      type: 'checkbox' as EditorFieldType,
      path: 'header.showLogo',
      defaultValue: true,
    } as EditorField,
    logoHeight: {
      id: 'logoHeight',
      label: 'Logo Height (px)',
      type: 'number' as EditorFieldType,
      path: 'header.logoHeight',
      min: 20,
      max: 150,
      step: 5,
      defaultValue: 40,
    } as EditorField,
    backgroundColor: {
      id: 'backgroundColor',
      label: 'Background Color',
      type: 'color' as EditorFieldType,
      path: 'header.backgroundColor',
      defaultValue: '#ffffff',
    } as EditorField,
    textColor: {
      id: 'textColor',
      label: 'Text Color',
      type: 'color' as EditorFieldType,
      path: 'header.textColor',
      defaultValue: '#1f2937',
    } as EditorField,
    height: {
      id: 'height',
      label: 'Height (px)',
      type: 'number' as EditorFieldType,
      path: 'header.height',
      min: 40,
      max: 200,
      step: 5,
      defaultValue: 64,
    } as EditorField,
    padding: {
      id: 'padding',
      label: 'Padding (px)',
      type: 'number' as EditorFieldType,
      path: 'header.padding',
      min: 0,
      max: 50,
      step: 2,
      defaultValue: 16,
    } as EditorField,
    showShadow: {
      id: 'showShadow',
      label: 'Show Shadow',
      type: 'checkbox' as EditorFieldType,
      path: 'header.showShadow',
      defaultValue: true,
    } as EditorField,
    stickyHeader: {
      id: 'stickyHeader',
      label: 'Sticky Header',
      type: 'checkbox' as EditorFieldType,
      path: 'header.stickyHeader',
      defaultValue: true,
      description: 'Keep header visible when scrolling',
    } as EditorField,
    hideNavOnMobile: {
      id: 'hideNavOnMobile',
      label: 'Hide Navigation on Mobile',
      type: 'checkbox' as EditorFieldType,
      path: 'header.hideNavOnMobile',
      defaultValue: true,
    } as EditorField,
    navPosition: {
      id: 'navPosition',
      label: 'Navigation Position',
      type: 'select' as EditorFieldType,
      path: 'header.navPosition',
      defaultValue: 'right',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    } as EditorField,
  },

  FOOTER: {
    companyName: {
      id: 'companyName',
      label: 'Company Name',
      type: 'text' as EditorFieldType,
      path: 'footer.companyName',
      placeholder: 'Your company name',
    } as EditorField,
    companyDescription: {
      id: 'companyDescription',
      label: 'Company Description',
      type: 'textarea' as EditorFieldType,
      path: 'footer.companyDescription',
      placeholder: 'Brief description of your company',
    } as EditorField,
    address: {
      id: 'address',
      label: 'Address',
      type: 'textarea' as EditorFieldType,
      path: 'footer.address',
      placeholder: 'Your business address',
    } as EditorField,
    phone: {
      id: 'phone',
      label: 'Phone Number',
      type: 'text' as EditorFieldType,
      path: 'footer.phone',
      placeholder: '+1 (555) 000-0000',
    } as EditorField,
    email: {
      id: 'email',
      label: 'Email Address',
      type: 'text' as EditorFieldType,
      path: 'footer.email',
      placeholder: 'contact@example.com',
    } as EditorField,
    copyrightText: {
      id: 'copyrightText',
      label: 'Copyright Text',
      type: 'text' as EditorFieldType,
      path: 'footer.copyrightText',
      defaultValue: `© ${new Date().getFullYear()} All rights reserved.`,
    } as EditorField,
    backgroundColor: {
      id: 'backgroundColor',
      label: 'Background Color',
      type: 'color' as EditorFieldType,
      path: 'footer.backgroundColor',
      defaultValue: '#1f2937',
    } as EditorField,
    textColor: {
      id: 'textColor',
      label: 'Text Color',
      type: 'color' as EditorFieldType,
      path: 'footer.textColor',
      defaultValue: '#ffffff',
    } as EditorField,
    showLinks: {
      id: 'showLinks',
      label: 'Show Footer Links',
      type: 'checkbox' as EditorFieldType,
      path: 'footer.showLinks',
      defaultValue: true,
    } as EditorField,
  },
}

/**
 * Validation utilities
 */
export const VALIDATORS = {
  email: (value: string): string | null => {
    if (!value) return null
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value) ? null : 'Invalid email address'
  },

  url: (value: string): string | null => {
    if (!value) return null
    try {
      new URL(value)
      return null
    } catch {
      return 'Invalid URL'
    }
  },

  color: (value: string): string | null => {
    if (!value) return null
    const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
    return colorRegex.test(value) ? null : 'Invalid hex color'
  },

  minLength: (min: number) => (value: string): string | null => {
    return value?.length >= min ? null : `Minimum ${min} characters required`
  },

  maxLength: (max: number) => (value: string): string | null => {
    return value?.length <= max ? null : `Maximum ${max} characters allowed`
  },
}
