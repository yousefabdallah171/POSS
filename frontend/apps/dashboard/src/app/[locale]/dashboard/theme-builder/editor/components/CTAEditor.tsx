'use client'

import { ComponentConfig } from '@/types/theme'
import { useThemeStore } from '@/hooks/useThemeStore'

interface CTAEditorProps {
  component: ComponentConfig
}

export function CTAEditor({ component }: CTAEditorProps) {
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
          placeholder="e.g. Ready to Get Started?"
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
          placeholder="مثل هل أنت مستعد للبدء؟"
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
          placeholder="Enter CTA description in English"
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
          placeholder="أدخل وصف CTA باللغة العربية"
          dir="rtl"
        />
      </div>

      {/* Button Text (English) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Button Text (English)
        </label>
        <input
          type="text"
          value={config.button_text_en || ''}
          onChange={(e) => handleFieldChange('button_text_en', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="e.g. Order Now"
        />
      </div>

      {/* Button Text (Arabic) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          نص الزر (Arabic)
        </label>
        <input
          type="text"
          value={config.button_text_ar || ''}
          onChange={(e) => handleFieldChange('button_text_ar', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="مثل اطلب الآن"
          dir="rtl"
        />
      </div>

      {/* Button URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Button URL
        </label>
        <input
          type="text"
          value={config.button_url || ''}
          onChange={(e) => handleFieldChange('button_url', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="e.g. /menu"
        />
      </div>

      {/* Background Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Background Color
        </label>
        <div className="flex gap-2">
          <input
            type="color"
            value={config.background_color || '#3b82f6'}
            onChange={(e) => handleFieldChange('background_color', e.target.value)}
            className="h-10 w-20 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
          />
          <input
            type="text"
            value={config.background_color || '#3b82f6'}
            onChange={(e) => handleFieldChange('background_color', e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
            placeholder="e.g. #3b82f6"
          />
        </div>
      </div>

      <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <p className="text-xs text-blue-700 dark:text-blue-400">
          Changes are applied in real-time to the live preview.
        </p>
      </div>
    </div>
  )
}

export default CTAEditor
