'use client'

import { useState } from 'react'
import { ComponentConfig } from '@/types/theme'
import { useThemeStore } from '@/hooks/useThemeStore'

// Helper function to extract label from translation objects
function extractLabel(label: any): string {
  if (typeof label === 'string') return label
  if (label && typeof label === 'object') {
    // Handle translation objects like {en: "...", ar: "..."}
    return label.en || label.ar || Object.values(label)[0] || ''
  }
  return ''
}

interface GenericEditorProps {
  component: ComponentConfig
}

/**
 * GenericEditor
 *
 * Fallback editor for components without specific editors.
 * Provides a JSON/form-based interface for editing component configuration.
 *
 * Future improvements:
 * - Generate form from Zod schema metadata
 * - Provide typed inputs based on component metadata
 * - Show validation errors
 * - Preview changes in real-time
 */
export function GenericEditor({ component }: GenericEditorProps) {
  const updateComponent = useThemeStore((state) => state.updateComponent)
  const [configJson, setConfigJson] = useState(JSON.stringify(component.config || {}, null, 2))
  const [error, setError] = useState<string | null>(null)
  const [isSaved, setIsSaved] = useState(true)

  const handleConfigChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setConfigJson(e.target.value)
    setIsSaved(false)
    setError(null)
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateComponent(component.id, { title: e.target.value })
  }

  const handleSaveConfig = () => {
    try {
      const parsed = JSON.parse(configJson)
      updateComponent(component.id, { config: parsed })
      setIsSaved(true)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON')
    }
  }

  const handleToggleEnabled = (enabled: boolean) => {
    updateComponent(component.id, { enabled })
  }

  return (
    <div className="space-y-4">
      {/* Title Editor */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Component Title
        </label>
        <input
          type="text"
          value={extractLabel(component.title)}
          onChange={handleTitleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Component title"
        />
      </div>

      {/* Enable/Disable Toggle */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={component.enabled}
            onChange={(e) => handleToggleEnabled(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {component.enabled ? 'Enabled' : 'Disabled'}
          </span>
        </label>
      </div>

      {/* Configuration Editor */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Configuration (JSON)
          </label>
          <button
            onClick={handleSaveConfig}
            disabled={isSaved}
            className={`px-3 py-1 rounded text-sm font-medium transition ${
              isSaved
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700 text-white'
            }`}
          >
            {isSaved ? 'Saved' : 'Save'}
          </button>
        </div>

        <textarea
          value={configJson}
          onChange={handleConfigChange}
          className={`w-full h-64 px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-xs placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            error ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
          placeholder="{}"
          spellCheck="false"
        />

        {error && (
          <div className="mt-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-700 dark:text-red-400 font-mono">{error}</p>
          </div>
        )}

        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Edit the JSON configuration for this component. Changes will be saved when you click the Save button.
        </p>
      </div>

      {/* Info Section */}
      <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <p className="text-xs text-blue-700 dark:text-blue-400">
          <strong>Tip:</strong> Specific editors for each component type will be added soon. For now, you can edit the configuration manually.
        </p>
      </div>
    </div>
  )
}

export default GenericEditor
