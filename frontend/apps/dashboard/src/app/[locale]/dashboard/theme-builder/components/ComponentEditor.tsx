'use client'

import { useState } from 'react'
import { X, Save, Trash2 } from 'lucide-react'
import { useThemeStore } from '@/hooks/useThemeStore'
import { ComponentConfig, ComponentType } from '@/types/theme'
import { ComponentEditorRouter } from '@/components/editors/ComponentEditorRouter'
import { EditorErrorBoundary } from '@/components/editors/EditorErrorBoundary'

const COMPONENT_TYPES: { type: ComponentType; label: string }[] = [
  { type: 'hero', label: 'Hero Section' },
  { type: 'products', label: 'Featured Products' },
  { type: 'why_us', label: 'Why Choose Us' },
  { type: 'contact', label: 'Contact Section' },
  { type: 'testimonials', label: 'Testimonials' },
  { type: 'cta', label: 'Call to Action' },
  { type: 'custom', label: 'Custom HTML' },
]

interface ComponentEditorProps {
  component: ComponentConfig
  isOpen: boolean
  onClose: () => void
}

export function ComponentEditor({ component, isOpen, onClose }: ComponentEditorProps) {
  const [editingComponent, setEditingComponent] = useState<ComponentConfig>(component)

  const updateComponent = useThemeStore((state) => state.updateComponent)
  const deleteComponent = useThemeStore((state) => state.deleteComponent)

  const handleComponentChange = (updated: ComponentConfig) => {
    setEditingComponent(updated)
  }

  const handleSave = () => {
    updateComponent(component.id, editingComponent)
    onClose()
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this component?')) {
      deleteComponent(component.id)
      onClose()
    }
  }

  const handleReset = () => {
    setEditingComponent(component)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Edit Component</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <EditorErrorBoundary
            componentType={editingComponent.type}
            onReset={handleReset}
          >
            <ComponentEditorRouter
              component={editingComponent}
              onChange={handleComponentChange}
              className="w-full"
            />
          </EditorErrorBoundary>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition"
            >
              <Save className="h-4 w-4" />
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
