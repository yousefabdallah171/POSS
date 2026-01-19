/**
 * FormField component for displaying input fields with validation errors
 * Provides consistent styling and error display across the application
 */

import React from 'react'
import { AlertCircle, CheckCircle } from 'lucide-react'

interface FormFieldProps {
  label: string
  error?: string
  isValid?: boolean
  isDirty?: boolean
  children: React.ReactNode
  helperText?: string
  required?: boolean
}

/**
 * Wrapper component for form fields with error display
 */
export function FormField({
  label,
  error,
  isValid,
  isDirty,
  children,
  helperText,
  required = false,
}: FormFieldProps) {
  const hasError = Boolean(error)

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Input wrapper */}
      <div className="relative">
        {children}

        {/* Validation icons */}
        {isDirty && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {hasError ? (
              <AlertCircle className="w-5 h-5 text-red-500" />
            ) : isValid ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : null}
          </div>
        )}
      </div>

      {/* Error message */}
      {hasError && (
        <p className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}

      {/* Helper text */}
      {helperText && !hasError && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  )
}

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  isValid?: boolean
  isDirty?: boolean
}

/**
 * Input component with validation styling
 */
export function FormInput({
  error,
  isValid,
  isDirty,
  className = '',
  ...props
}: FormInputProps) {
  const borderClass = error
    ? 'border-red-500 dark:border-red-400'
    : isDirty && isValid
      ? 'border-green-500 dark:border-green-400'
      : 'border-gray-300 dark:border-gray-600'

  const focusClass =
    'focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:focus:border-primary-400'

  return (
    <input
      {...props}
      className={`
        w-full px-3 py-2 border rounded-md
        bg-white dark:bg-gray-700
        text-gray-900 dark:text-white
        placeholder-gray-500 dark:placeholder-gray-400
        transition duration-150
        ${borderClass} ${focusClass}
        ${error && isDirty ? 'pr-10' : ''}
        ${className}
      `}
    />
  )
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Array<{ value: string; label: string }>
  error?: string
  isValid?: boolean
  isDirty?: boolean
}

/**
 * Select component with validation styling
 */
export function FormSelect({
  options,
  error,
  isValid,
  isDirty,
  className = '',
  ...props
}: FormSelectProps) {
  const borderClass = error
    ? 'border-red-500 dark:border-red-400'
    : isDirty && isValid
      ? 'border-green-500 dark:border-green-400'
      : 'border-gray-300 dark:border-gray-600'

  const focusClass =
    'focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:focus:border-primary-400'

  return (
    <select
      {...props}
      className={`
        w-full px-3 py-2 border rounded-md
        bg-white dark:bg-gray-700
        text-gray-900 dark:text-white
        transition duration-150
        ${borderClass} ${focusClass}
        ${className}
      `}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
  isValid?: boolean
  isDirty?: boolean
}

/**
 * Textarea component with validation styling
 */
export function FormTextarea({
  error,
  isValid,
  isDirty,
  className = '',
  ...props
}: FormTextareaProps) {
  const borderClass = error
    ? 'border-red-500 dark:border-red-400'
    : isDirty && isValid
      ? 'border-green-500 dark:border-green-400'
      : 'border-gray-300 dark:border-gray-600'

  const focusClass =
    'focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:focus:border-primary-400'

  return (
    <textarea
      {...props}
      className={`
        w-full px-3 py-2 border rounded-md
        bg-white dark:bg-gray-700
        text-gray-900 dark:text-white
        placeholder-gray-500 dark:placeholder-gray-400
        transition duration-150
        resize-vertical
        ${borderClass} ${focusClass}
        ${className}
      `}
    />
  )
}

/**
 * Validation summary component - displays all form errors
 */
interface ValidationSummaryProps {
  errors: Record<string, string | undefined>
  title?: string
}

export function ValidationSummary({ errors, title = 'Please fix the following errors' }: ValidationSummaryProps) {
  const errorList = Object.entries(errors).filter(([, error]) => error)

  if (errorList.length === 0) {
    return null
  }

  return (
    <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 mb-4">
      <div className="flex items-start">
        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-3" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{title}</h3>
          <ul className="mt-2 space-y-1">
            {errorList.map(([field, error]) => (
              <li key={field} className="text-sm text-red-700 dark:text-red-300">
                <strong>{field}:</strong> {error}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

/**
 * Success message component
 */
interface SuccessMessageProps {
  message: string
  onDismiss?: () => void
}

export function SuccessMessage({ message, onDismiss }: SuccessMessageProps) {
  return (
    <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-4 mb-4">
      <div className="flex items-start">
        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 mr-3" />
        <div className="flex-1">
          <p className="text-sm font-medium text-green-800 dark:text-green-200">{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-green-400 hover:text-green-600 dark:hover:text-green-300"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}

export default FormField
