/**
 * Custom hook for form validation using Zod schemas
 * Provides real-time validation with field-level error tracking
 */

import { useCallback, useState, useRef } from 'react'
import type { ValidationError, ValidationResult } from '@/lib/validation/theme-schemas'
import {
  validateThemeCreate,
  validateThemeUpdate,
  fieldValidators,
  type CreateThemeInput,
  type UpdateThemeInput,
} from '@/lib/validation/theme-schemas'

interface FormField {
  value: any
  isDirty?: boolean
  error?: string
}

interface FormState {
  [key: string]: FormField
}

interface UseFormValidationOptions {
  mode?: 'onChange' | 'onBlur' | 'onSubmit'
  revalidateMode?: 'onChange' | 'onBlur'
}

interface UseFormValidationReturn {
  // State
  values: Record<string, any>
  errors: Record<string, string | undefined>
  isDirty: boolean
  isValidating: boolean

  // Methods
  setValue: (field: string, value: any) => void
  setFieldError: (field: string, error?: string) => void
  setValues: (values: Record<string, any>) => void
  clearErrors: () => void
  clearField: (field: string) => void
  markFieldDirty: (field: string) => void
  markFieldTouched: (field: string) => void

  // Validation
  validateField: (field: string, value?: any) => boolean
  validateForm: (formData?: Record<string, any>) => Promise<boolean>
  validateTheme: (data: CreateThemeInput | UpdateThemeInput) => ValidationResult

  // Reset
  reset: (newValues?: Record<string, any>) => void
}

const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((curr, prop) => curr?.[prop], obj)
}

const setNestedValue = (obj: any, path: string, value: any): any => {
  const keys = path.split('.')
  const lastKey = keys.pop()!
  const target = keys.reduce((curr, key) => (curr[key] = curr[key] || {}), obj)
  target[lastKey] = value
  return obj
}

/**
 * Custom hook for form validation
 * Provides real-time validation with Zod schemas
 */
export function useFormValidation(
  initialValues: Record<string, any> = {},
  options: UseFormValidationOptions = { mode: 'onBlur' }
): UseFormValidationReturn {
  const [values, setFormValues] = useState<Record<string, any>>(initialValues)
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})
  const [isDirty, setIsDirtyFlag] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const dirtyFieldsRef = useRef<Set<string>>(new Set())
  const touchedFieldsRef = useRef<Set<string>>(new Set())

  // Update a single field value
  const setValue = useCallback(
    (field: string, value: any) => {
      setFormValues((prev) => ({
        ...prev,
        ...setNestedValue({ ...prev }, field, value),
      }))
      setIsDirtyFlag(true)
      dirtyFieldsRef.current.add(field)

      // Revalidate on change if mode is onChange
      if (options.mode === 'onChange' || options.revalidateMode === 'onChange') {
        validateField(field, value)
      }
    },
    [options.mode, options.revalidateMode]
  )

  // Set multiple field values
  const setValues = useCallback((newValues: Record<string, any>) => {
    setFormValues((prev) => ({ ...prev, ...newValues }))
    setIsDirtyFlag(true)
  }, [])

  // Mark field as dirty
  const markFieldDirty = useCallback((field: string) => {
    dirtyFieldsRef.current.add(field)
    setIsDirtyFlag(true)
  }, [])

  // Mark field as touched
  const markFieldTouched = useCallback((field: string) => {
    touchedFieldsRef.current.add(field)

    // Revalidate on blur if mode is onBlur
    if (options.revalidateMode === 'onBlur' || options.mode === 'onBlur') {
      validateField(field)
    }
  }, [options.mode, options.revalidateMode])

  // Set field-level error
  const setFieldError = useCallback((field: string, error?: string) => {
    setErrors((prev) => {
      if (error) {
        return { ...prev, [field]: error }
      } else {
        const { [field]: _, ...rest } = prev
        return rest
      }
    })
  }, [])

  // Clear all errors
  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])

  // Clear specific field
  const clearField = useCallback((field: string) => {
    setFormValues((prev) => {
      const updated = { ...prev }
      const keys = field.split('.')
      const lastKey = keys.pop()!
      const target = keys.reduce((curr, key) => curr[key], updated)
      if (target && lastKey in target) {
        delete target[lastKey]
      }
      return updated
    })
    setFieldError(field)
    dirtyFieldsRef.current.delete(field)
  }, [setFieldError])

  // Validate a single field
  const validateField = useCallback(
    (field: string, value?: any): boolean => {
      const fieldValue = value !== undefined ? value : getNestedValue(values, field)

      // Use specific field validators
      if (field.includes('colors.')) {
        const colorResult = fieldValidators.color(fieldValue)
        if (!colorResult.isValid) {
          setFieldError(field, colorResult.error || undefined)
          return false
        }
      } else if (field.includes('fontSize')) {
        const sizeResult = fieldValidators.fontSize(fieldValue)
        if (!sizeResult.isValid) {
          setFieldError(field, sizeResult.error || undefined)
          return false
        }
      } else if (field.includes('Url')) {
        const urlResult = fieldValidators.url(fieldValue)
        if (!urlResult.isValid) {
          setFieldError(field, urlResult.error || undefined)
          return false
        }
      } else if (field.includes('fontFamily')) {
        const fontResult = fieldValidators.font(fieldValue)
        if (!fontResult.isValid) {
          setFieldError(field, fontResult.error || undefined)
          return false
        }
      } else if (field.includes('name')) {
        const nameResult = fieldValidators.name(fieldValue)
        if (!nameResult.isValid) {
          setFieldError(field, nameResult.error || undefined)
          return false
        }
      }

      // Clear error if valid
      setFieldError(field)
      return true
    },
    [values, setFieldError]
  )

  // Validate entire form
  const validateForm = useCallback(
    async (formData?: Record<string, any>): Promise<boolean> => {
      setIsValidating(true)
      try {
        const dataToValidate = formData || values
        const result = validateTheme(dataToValidate)

        if (!result.isValid) {
          // Set errors for all invalid fields
          const newErrors: Record<string, string> = {}
          result.errors.forEach((error) => {
            newErrors[error.field] = error.message
          })
          setErrors(newErrors)
          return false
        }

        clearErrors()
        return true
      } finally {
        setIsValidating(false)
      }
    },
    [values, clearErrors]
  )

  // Validate theme data
  const validateTheme = useCallback(
    (data: CreateThemeInput | UpdateThemeInput): ValidationResult => {
      // Check if it's a create or update request
      if ('identity' in data && 'colors' in data && 'typography' in data) {
        return validateThemeCreate(data as CreateThemeInput)
      }
      return validateThemeUpdate(data as UpdateThemeInput)
    },
    []
  )

  // Reset form to initial or new values
  const reset = useCallback((newValues?: Record<string, any>) => {
    setFormValues(newValues || initialValues)
    clearErrors()
    setIsDirtyFlag(false)
    dirtyFieldsRef.current.clear()
    touchedFieldsRef.current.clear()
  }, [initialValues, clearErrors])

  return {
    // State
    values,
    errors,
    isDirty,
    isValidating,

    // Methods
    setValue,
    setFieldError,
    setValues,
    clearErrors,
    clearField,
    markFieldDirty,
    markFieldTouched,

    // Validation
    validateField,
    validateForm,
    validateTheme,

    // Reset
    reset,
  }
}

/**
 * Hook for color field validation with real-time feedback
 */
export function useColorFieldValidation(initialColor: string = '') {
  const [color, setColor] = useState(initialColor)
  const [error, setError] = useState<string | null>(null)
  const [isValid, setIsValid] = useState(true)

  const onChange = useCallback((newColor: string) => {
    setColor(newColor)
    const result = fieldValidators.color(newColor)
    setIsValid(result.isValid)
    setError(result.error || null)
  }, [])

  const reset = useCallback(() => {
    setColor(initialColor)
    setError(null)
    setIsValid(true)
  }, [initialColor])

  return {
    color,
    error,
    isValid,
    onChange,
    reset,
  }
}

/**
 * Hook for font field validation with real-time feedback
 */
export function useFontFieldValidation(initialFont: string = 'Inter') {
  const [font, setFont] = useState(initialFont)
  const [error, setError] = useState<string | null>(null)
  const [isValid, setIsValid] = useState(true)

  const onChange = useCallback((newFont: string) => {
    setFont(newFont)
    const result = fieldValidators.font(newFont)
    setIsValid(result.isValid)
    setError(result.error || null)
  }, [])

  const reset = useCallback(() => {
    setFont(initialFont)
    setError(null)
    setIsValid(true)
  }, [initialFont])

  return {
    font,
    error,
    isValid,
    onChange,
    reset,
  }
}

/**
 * Hook for URL field validation with real-time feedback
 */
export function useUrlFieldValidation(initialUrl: string = '') {
  const [url, setUrl] = useState(initialUrl)
  const [error, setError] = useState<string | null>(null)
  const [isValid, setIsValid] = useState(true)

  const onChange = useCallback((newUrl: string) => {
    setUrl(newUrl)
    if (!newUrl) {
      setError(null)
      setIsValid(true)
      return
    }
    const result = fieldValidators.url(newUrl)
    setIsValid(result.isValid)
    setError(result.error || null)
  }, [])

  const reset = useCallback(() => {
    setUrl(initialUrl)
    setError(null)
    setIsValid(true)
  }, [initialUrl])

  return {
    url,
    error,
    isValid,
    onChange,
    reset,
  }
}

/**
 * Hook for number field validation with real-time feedback
 */
export function useNumberFieldValidation(
  initialValue: number,
  min: number,
  max: number
) {
  const [value, setValue] = useState(initialValue)
  const [error, setError] = useState<string | null>(null)
  const [isValid, setIsValid] = useState(true)

  const onChange = useCallback(
    (newValue: number) => {
      setValue(newValue)
      if (newValue < min) {
        setError(`Value must be at least ${min}`)
        setIsValid(false)
      } else if (newValue > max) {
        setError(`Value must be at most ${max}`)
        setIsValid(false)
      } else {
        setError(null)
        setIsValid(true)
      }
    },
    [min, max]
  )

  const reset = useCallback(() => {
    setValue(initialValue)
    setError(null)
    setIsValid(true)
  }, [initialValue])

  return {
    value,
    error,
    isValid,
    onChange,
    reset,
  }
}

export default useFormValidation
