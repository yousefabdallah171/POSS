// Complete Theme JSON Type Definitions
// For preset themes loaded from JSON files in /themes/ folder

import { 
  GlobalColors, 
  TypographySettings, 
  ComponentConfig, 
  HeaderConfig, 
  FooterConfig,
  WebsiteIdentity 
} from './theme'

/**
 * Bilingual text field - can be either a simple string or object with en/ar
 */
export type BilingualText = string | { en: string; ar: string }

/**
 * Theme metadata - information about the theme
 */
export interface ThemeMetadata {
  name: string
  slug: string
  version: string
  author: string
  description: string
  category: 'professional' | 'luxury' | 'casual' | 'modern' | 'playful'
  tags: string[]
  preview?: string
  created_at: string
  bilingual: boolean
}

/**
 * Theme customization options - what users can modify
 */
export interface CustomizationOptions {
  allowColorChange: boolean
  allowFontChange: boolean
  allowLayoutChange: boolean
  allowComponentReorder: boolean
  allowComponentDisable: boolean
}

/**
 * Extended header configuration with bilingual support
 */
export interface ThemeHeaderConfig extends Omit<HeaderConfig, 'logoText' | 'navigationItems'> {
  logoText?: BilingualText
  navigationItems: Array<{
    id: string
    label: BilingualText
    href: string
    order: number
  }>
  ctaButton?: {
    text: BilingualText
    href: string
    style: 'primary' | 'secondary' | 'light'
  }
}

/**
 * Extended footer configuration with bilingual support
 */
export interface ThemeFooterConfig extends Omit<FooterConfig, 'companyName' | 'companyDescription' | 'copyrightText' | 'footerSections'> {
  companyName?: BilingualText
  companyDescription?: BilingualText
  copyrightText?: BilingualText
  footerSections: Array<{
    id: string
    title: BilingualText
    links: Array<{
      label: BilingualText
      href: string
    }>
  }>
  socialLinks: Array<{
    platform: string
    url: string
    icon?: string
  }>
}

/**
 * Extended component configuration with bilingual support
 */
export interface ThemeComponentConfig extends Omit<ComponentConfig, 'title' | 'config'> {
  title: BilingualText
  config: {
    // Hero component specific
    layout?: 'full-screen' | 'container' | 'banner'
    style?: 'overlay' | 'background' | 'text'
    title?: BilingualText
    subtitle?: BilingualText
    description?: BilingualText
    backgroundImage?: string
    overlayOpacity?: number
    textAlignment?: 'left' | 'center' | 'right'
    textColor?: string
    height?: string
    ctaButtons?: Array<{
      text: BilingualText
      href: string
      style: 'primary' | 'secondary'
    }>
    
    // Featured items specific
    itemsPerRow?: number
    showPrices?: boolean
    showImages?: boolean
    
    // Why choose us specific
    items?: Array<{
      icon?: string
      title: BilingualText
      description: BilingualText
    }>
    
    // Any other config
    [key: string]: any
  }
}

/**
 * Complete Theme JSON structure
 * This is the full structure of theme.json files in /themes/ folder
 */
export interface ThemeJson {
  meta: ThemeMetadata
  identity: WebsiteIdentity
  colors: GlobalColors
  typography: TypographySettings
  header: ThemeHeaderConfig
  footer: ThemeFooterConfig
  components: ThemeComponentConfig[]
  customization: CustomizationOptions
}

/**
 * Theme JSON with parsed components
 * Used after extracting from database or JSON files
 */
export interface ParsedThemeJson extends ThemeJson {
  _rawConfig?: string // Keep original JSON string if needed
}

/**
 * Helper type to extract text in specific language
 */
export type ExtractLocale<T> = T extends BilingualText 
  ? string 
  : T extends object 
    ? { [K in keyof T]: ExtractLocale<T[K]> }
    : T

/**
 * Theme with extracted English text
 */
export type ThemeJsonEN = ExtractLocale<ThemeJson>

/**
 * Theme with extracted Arabic text
 */
export type ThemeJsonAR = ExtractLocale<ThemeJson>
