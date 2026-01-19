import { useMemo, useCallback } from 'react'
import { useThemeBuilderStore } from './themeBuilderStore'
import { GlobalColors, TypographySettings, HeaderConfig, FooterConfig } from '@/types/theme'

/**
 * Hook to access the current theme being edited
 */
export const useCurrentTheme = () => {
  return useThemeBuilderStore((state) => state.currentTheme)
}

/**
 * Hook to access all color settings
 */
export const useThemeColors = () => {
  return useThemeBuilderStore((state) => state.colors)
}

/**
 * Hook to update colors
 */
export const useUpdateColors = () => {
  return useThemeBuilderStore((state) => state.updateColors)
}

/**
 * Hook to access colors and update function
 */
export const useColorsWithUpdate = () => {
  const colors = useThemeBuilderStore((state) => state.colors)
  const updateColors = useThemeBuilderStore((state) => state.updateColors)

  return useMemo(
    () => ({ colors, updateColors }),
    [colors, updateColors]
  )
}

/**
 * Hook to access individual color value
 */
export const useColorValue = (colorKey: keyof GlobalColors) => {
  return useThemeBuilderStore((state) => state.getColorValue(colorKey))
}

/**
 * Hook to access typography settings
 */
export const useThemeTypography = () => {
  return useThemeBuilderStore((state) => state.typography)
}

/**
 * Hook to update typography settings
 */
export const useUpdateTypography = () => {
  return useThemeBuilderStore((state) => state.updateTypography)
}

/**
 * Hook to access typography and update function
 */
export const useTypographyWithUpdate = () => {
  const typography = useThemeBuilderStore((state) => state.typography)
  const updateTypography = useThemeBuilderStore((state) => state.updateTypography)

  return useMemo(
    () => ({ typography, updateTypography }),
    [typography, updateTypography]
  )
}

/**
 * Hook to access header configuration
 */
export const useThemeHeader = () => {
  return useThemeBuilderStore((state) => state.header)
}

/**
 * Hook to update header configuration
 */
export const useUpdateHeader = () => {
  return useThemeBuilderStore((state) => state.updateHeader)
}

/**
 * Hook to access header and update function
 */
export const useHeaderWithUpdate = () => {
  const header = useThemeBuilderStore((state) => state.header)
  const updateHeader = useThemeBuilderStore((state) => state.updateHeader)

  return useMemo(
    () => ({ header, updateHeader }),
    [header, updateHeader]
  )
}

/**
 * Hook to access footer configuration
 */
export const useThemeFooter = () => {
  return useThemeBuilderStore((state) => state.footer)
}

/**
 * Hook to update footer configuration
 */
export const useUpdateFooter = () => {
  return useThemeBuilderStore((state) => state.updateFooter)
}

/**
 * Hook to access footer and update function
 */
export const useFooterWithUpdate = () => {
  const footer = useThemeBuilderStore((state) => state.footer)
  const updateFooter = useThemeBuilderStore((state) => state.updateFooter)

  return useMemo(
    () => ({ footer, updateFooter }),
    [footer, updateFooter]
  )
}

/**
 * Hook to access website identity
 */
export const useThemeIdentity = () => {
  return useThemeBuilderStore((state) => state.identity)
}

/**
 * Hook to update website identity
 */
export const useUpdateIdentity = () => {
  return useThemeBuilderStore((state) => state.updateIdentity)
}

/**
 * Hook to access identity and update function
 */
export const useIdentityWithUpdate = () => {
  const identity = useThemeBuilderStore((state) => state.identity)
  const updateIdentity = useThemeBuilderStore((state) => state.updateIdentity)

  return useMemo(
    () => ({ identity, updateIdentity }),
    [identity, updateIdentity]
  )
}

/**
 * Hook to access components array
 */
export const useThemeComponents = () => {
  return useThemeBuilderStore((state) => state.components)
}

/**
 * Hook to update components
 */
export const useUpdateComponents = () => {
  return useThemeBuilderStore((state) => state.updateComponents)
}

/**
 * Hook to get component by ID
 */
export const useGetComponentById = (componentId: string) => {
  const getComponentById = useThemeBuilderStore((state) => state.getComponentById)

  return useCallback(() => getComponentById(componentId), [componentId, getComponentById])
}

/**
 * Hook to access custom CSS
 */
export const useCustomCss = () => {
  return useThemeBuilderStore((state) => state.customCss)
}

/**
 * Hook to update custom CSS
 */
export const useUpdateCustomCss = () => {
  return useThemeBuilderStore((state) => state.updateCustomCss)
}

/**
 * Hook to access dirty state (unsaved changes)
 */
export const useIsDirty = () => {
  return useThemeBuilderStore((state) => state.isDirty)
}

/**
 * Hook to mark theme as dirty/clean
 */
export const useDirtyActions = () => {
  const markDirty = useThemeBuilderStore((state) => state.markDirty)
  const markClean = useThemeBuilderStore((state) => state.markClean)

  return useMemo(
    () => ({ markDirty, markClean }),
    [markDirty, markClean]
  )
}

/**
 * Hook to access loading state
 */
export const useThemeLoading = () => {
  return useThemeBuilderStore((state) => state.isLoading)
}

/**
 * Hook to access saving state
 */
export const useThemeSaving = () => {
  return useThemeBuilderStore((state) => state.isSaving)
}

/**
 * Hook to access error state
 */
export const useThemeError = () => {
  return useThemeBuilderStore((state) => state.error)
}

/**
 * Hook to access success message
 */
export const useThemeSuccess = () => {
  return useThemeBuilderStore((state) => state.successMessage)
}

/**
 * Hook to access all status states
 */
export const useThemeStatus = () => {
  const isLoading = useThemeBuilderStore((state) => state.isLoading)
  const isSaving = useThemeBuilderStore((state) => state.isSaving)
  const error = useThemeBuilderStore((state) => state.error)
  const successMessage = useThemeBuilderStore((state) => state.successMessage)

  return useMemo(
    () => ({ isLoading, isSaving, error, successMessage }),
    [isLoading, isSaving, error, successMessage]
  )
}

/**
 * Hook to access all status actions
 */
export const useThemeStatusActions = () => {
  const setLoading = useThemeBuilderStore((state) => state.setLoading)
  const setSaving = useThemeBuilderStore((state) => state.setSaving)
  const setError = useThemeBuilderStore((state) => state.setError)
  const setSuccess = useThemeBuilderStore((state) => state.setSuccess)

  return useMemo(
    () => ({ setLoading, setSaving, setError, setSuccess }),
    [setLoading, setSaving, setError, setSuccess]
  )
}

/**
 * Hook for theme management actions
 */
export const useThemeManagement = () => {
  const loadTheme = useThemeBuilderStore((state) => state.loadTheme)
  const resetTheme = useThemeBuilderStore((state) => state.resetTheme)

  return useMemo(
    () => ({ loadTheme, resetTheme }),
    [loadTheme, resetTheme]
  )
}

/**
 * Hook for validation methods
 */
export const useThemeValidation = () => {
  const validateColors = useThemeBuilderStore((state) => state.validateColors)
  const validateTypography = useThemeBuilderStore((state) => state.validateTypography)
  const validateIdentity = useThemeBuilderStore((state) => state.validateIdentity)
  const validateHeader = useThemeBuilderStore((state) => state.validateHeader)
  const validateFooter = useThemeBuilderStore((state) => state.validateFooter)
  const validateTheme = useThemeBuilderStore((state) => state.validateTheme)

  return useMemo(
    () => ({
      validateColors,
      validateTypography,
      validateIdentity,
      validateHeader,
      validateFooter,
      validateTheme,
    }),
    [validateColors, validateTypography, validateIdentity, validateHeader, validateFooter, validateTheme]
  )
}

/**
 * Hook to get all form data
 */
export const useThemeFormData = () => {
  const getFormData = useThemeBuilderStore((state) => state.getFormData)

  return useCallback(() => getFormData(), [getFormData])
}

/**
 * Hook to check if there are errors
 */
export const useHasThemeErrors = () => {
  const hasErrors = useThemeBuilderStore((state) => state.hasErrors)

  return useCallback(() => hasErrors(), [hasErrors])
}

/**
 * Comprehensive hook for complete theme builder access
 * Use when you need full control over the theme state
 */
export const useThemeBuilder = () => {
  return useThemeBuilderStore()
}

/**
 * Hook for bulk updates - useful for form submissions
 */
export const useBulkThemeUpdate = () => {
  const store = useThemeBuilderStore()

  return useCallback(
    (updates: {
      colors?: Partial<GlobalColors>
      typography?: Partial<TypographySettings>
      header?: Partial<HeaderConfig>
      footer?: Partial<FooterConfig>
      customCss?: string
      identity?: Partial<typeof store.identity>
    }) => {
      if (updates.colors) store.updateColors(updates.colors)
      if (updates.typography) store.updateTypography(updates.typography)
      if (updates.header) store.updateHeader(updates.header)
      if (updates.footer) store.updateFooter(updates.footer)
      if (updates.customCss !== undefined) store.updateCustomCss(updates.customCss)
      if (updates.identity) store.updateIdentity(updates.identity)
    },
    [store]
  )
}
