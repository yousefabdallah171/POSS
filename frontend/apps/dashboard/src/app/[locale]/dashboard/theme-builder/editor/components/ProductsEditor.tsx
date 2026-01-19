'use client'

import { ComponentConfig } from '@/types/theme'
import { useThemeStore } from '@/hooks/useThemeStore'

interface ProductsEditorProps {
  component: ComponentConfig
}

export function ProductsEditor({ component }: ProductsEditorProps) {
  const updateComponent = useThemeStore((state) => state.updateComponent)

  const config = component.config || {}

  const handleFieldChange = (field: string, value: any) => {
    updateComponent(component.id, {
      config: {
        ...config,
        [field]: value,
      },
    })
  }

  return (
    <div className="space-y-4">
      {/* English Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Title (English)
        </label>
        <input
          type="text"
          value={config.title_en || ''}
          onChange={(e) => handleFieldChange('title_en', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="e.g. Our Products"
        />
      </div>

      {/* Arabic Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          العنوان (Arabic)
        </label>
        <input
          type="text"
          value={config.title_ar || ''}
          onChange={(e) => handleFieldChange('title_ar', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="مثل منتجاتنا"
          dir="rtl"
        />
      </div>

      {/* English Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description (English)
        </label>
        <textarea
          value={config.description_en || ''}
          onChange={(e) => handleFieldChange('description_en', e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Optional description"
        />
      </div>

      {/* Arabic Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          الوصف (Arabic)
        </label>
        <textarea
          value={config.description_ar || ''}
          onChange={(e) => handleFieldChange('description_ar', e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="وصف اختياري"
          dir="rtl"
        />
      </div>

      {/* Layout */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Layout
        </label>
        <select
          value={config.layout || 'grid'}
          onChange={(e) => handleFieldChange('layout', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="grid">Grid</option>
          <option value="list">List</option>
        </select>
      </div>

      {/* Columns */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Columns (for grid layout)
        </label>
        <select
          value={config.columns || 3}
          onChange={(e) => handleFieldChange('columns', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="1">1 Column</option>
          <option value="2">2 Columns</option>
          <option value="3">3 Columns</option>
          <option value="4">4 Columns</option>
        </select>
      </div>

      {/* Show Prices */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={config.show_prices !== false}
            onChange={(e) => handleFieldChange('show_prices', e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-primary-600"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Show Prices
          </span>
        </label>
      </div>

      {/* Show Images */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={config.show_images !== false}
            onChange={(e) => handleFieldChange('show_images', e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-primary-600"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Show Images
          </span>
        </label>
      </div>

      <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <p className="text-xs text-blue-700 dark:text-blue-400">
          <strong>Tip:</strong> Products are fetched from mock data by default. Changes are applied in real-time to the live preview.
        </p>
      </div>
    </div>
  )
}

export default ProductsEditor
