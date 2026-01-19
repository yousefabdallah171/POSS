'use client'

import { useState } from 'react'
import { Upload, X, AlertCircle, CheckCircle } from 'lucide-react'
import { ThemeData } from '@/types/theme'
import { toast } from 'sonner'

interface ImportDialogProps {
  isOpen: boolean
  onClose: () => void
  onImport: (theme: Partial<ThemeData>) => Promise<void>
  isLoading?: boolean
}

export function ImportDialog({ isOpen, onClose, onImport, isLoading = false }: ImportDialogProps) {
  const [jsonInput, setJsonInput] = useState('')
  const [parsedTheme, setParsedTheme] = useState<Partial<ThemeData> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [importAs, setImportAs] = useState<'new' | 'overwrite'>('new')

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        setJsonInput(content)
        parseJSON(content)
      } catch (err) {
        setError('Failed to read file')
        toast.error('Failed to read file')
      }
    }
    reader.readAsText(file)
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setJsonInput(text)
      parseJSON(text)
    } catch (err) {
      setError('Failed to read clipboard')
      toast.error('Failed to read clipboard')
    }
  }

  const parseJSON = (json: string) => {
    try {
      const theme = JSON.parse(json)

      // Validate theme structure
      if (!theme.colors || !theme.typography) {
        setError('Invalid theme format. Missing required fields.')
        setParsedTheme(null)
        return
      }

      setParsedTheme(theme as Partial<ThemeData>)
      setError(null)
    } catch (err) {
      setError('Invalid JSON format')
      setParsedTheme(null)
    }
  }

  const handleImport = async () => {
    if (!parsedTheme) {
      setError('No valid theme to import')
      return
    }

    try {
      await onImport(parsedTheme)
      toast.success(
        `Theme "${parsedTheme.name || 'Imported'}" imported successfully!`
      )
      resetForm()
      onClose()
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to import theme'
      setError(errorMsg)
      toast.error(errorMsg)
    }
  }

  const resetForm = () => {
    setJsonInput('')
    setParsedTheme(null)
    setError(null)
    setImportAs('new')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Dialog */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Import Theme</h2>
          </div>
          <button
            onClick={() => {
              resetForm()
              onClose()
            }}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
          >
            <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Upload Options */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Import Options
            </label>
            <div className="flex gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={importAs === 'new'}
                  onChange={() => setImportAs('new')}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Create new theme</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={importAs === 'overwrite'}
                  onChange={() => setImportAs('overwrite')}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Overwrite current</span>
              </label>
            </div>
          </div>

          {/* Upload/Paste Area */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900 dark:text-white">
              Theme JSON
            </label>

            {/* File Input */}
            <div className="flex gap-2 mb-2">
              <label className="flex-1 px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300">
                <Upload className="h-4 w-4" />
                <span>Upload JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <button
                onClick={handlePaste}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-900 dark:text-white rounded-lg transition"
              >
                Paste
              </button>
            </div>

            {/* JSON Input */}
            <textarea
              value={jsonInput}
              onChange={(e) => {
                setJsonInput(e.target.value)
                if (e.target.value) {
                  parseJSON(e.target.value)
                }
              }}
              placeholder='Paste JSON here or upload a file...'
              className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg flex gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900 dark:text-red-400">{error}</p>
              </div>
            </div>
          )}

          {/* Preview */}
          {parsedTheme && !error && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
              <div className="flex items-start gap-2 mb-3">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-900 dark:text-green-300">
                    ✓ Valid theme ready to import
                  </p>
                </div>
              </div>

              {/* Theme Details */}
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Name:</strong> {parsedTheme.name || 'Unnamed'}
                </p>
                {parsedTheme.description && (
                  <p>
                    <strong>Description:</strong> {parsedTheme.description}
                  </p>
                )}
                {parsedTheme.components && (
                  <p>
                    <strong>Components:</strong> {parsedTheme.components.length}
                  </p>
                )}
                <p>
                  <strong>Colors:</strong> {Object.keys(parsedTheme.colors || {}).length}
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleImport}
              disabled={!parsedTheme || !!error || isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Import Theme
                </>
              )}
            </button>
            <button
              onClick={() => {
                resetForm()
                onClose()
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-900 dark:text-white rounded-lg font-medium transition"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 rounded-b-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            💾 You can import themes that were previously exported. Make sure the JSON file is valid before importing.
          </p>
        </div>
      </div>
    </div>
  )
}
