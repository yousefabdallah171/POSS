'use client'

import { ComponentConfig } from '@/types/theme'
import { useThemeStore } from '@/hooks/useThemeStore'

interface HeroEditorProps {
  component: ComponentConfig
}

export function HeroEditor({ component }: HeroEditorProps) {
  const updateComponent = useThemeStore((state) => state.updateComponent)

  const config = component.config || {}

  const handleFieldChange = (field: string, value: string | number | boolean) => {
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
          placeholder="Enter hero title in English"
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
          placeholder="أدخل عنوان البطل باللغة العربية"
          dir="rtl"
        />
      </div>

      {/* English Subtitle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Subtitle (English)
        </label>
        <input
          type="text"
          value={config.subtitle_en || ''}
          onChange={(e) => handleFieldChange('subtitle_en', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Enter subtitle in English"
        />
      </div>

      {/* Arabic Subtitle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          العنوان الفرعي (Arabic)
        </label>
        <input
          type="text"
          value={config.subtitle_ar || ''}
          onChange={(e) => handleFieldChange('subtitle_ar', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="أدخل العنوان الفرعي باللغة العربية"
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
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Enter description in English"
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
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="أدخل الوصف باللغة العربية"
          dir="rtl"
        />
      </div>

      {/* CTA Button Text (English) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Button Text (English)
        </label>
        <input
          type="text"
          value={config.cta_button_text || ''}
          onChange={(e) => handleFieldChange('cta_button_text', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="e.g. Learn More"
        />
      </div>

      {/* CTA Button URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Button URL
        </label>
        <input
          type="text"
          value={config.cta_button_url || ''}
          onChange={(e) => handleFieldChange('cta_button_url', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="e.g. /menu"
        />
      </div>

      {/* Height */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Height
        </label>
        <select
          value={config.height || 'medium'}
          onChange={(e) => handleFieldChange('height', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="small">Small (400px)</option>
          <option value="medium">Medium (500px)</option>
          <option value="large">Large (600px)</option>
        </select>
      </div>

      {/* Overlay Opacity */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Overlay Opacity: {(config.overlay_opacity || 0.3).toFixed(1)}
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={config.overlay_opacity || 0.3}
          onChange={(e) => handleFieldChange('overlay_opacity', parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <p className="text-xs text-blue-700 dark:text-blue-400">
          Changes are applied in real-time to the live preview.
        </p>
      </div>
    </div>
  )
}

export default HeroEditor
