'use client'

import { ComponentConfig } from '@/types/theme'
import { useThemeStore } from '@/hooks/useThemeStore'

interface ContactEditorProps {
  component: ComponentConfig
}

export function ContactEditor({ component }: ContactEditorProps) {
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
          placeholder="e.g. Contact Us"
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
          placeholder="مثل اتصل بنا"
          dir="rtl"
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          value={config.phone || ''}
          onChange={(e) => handleFieldChange('phone', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="e.g. (555) 123-4567"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email Address
        </label>
        <input
          type="email"
          value={config.email || ''}
          onChange={(e) => handleFieldChange('email', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="e.g. contact@restaurant.com"
        />
      </div>

      {/* Address (English) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Address (English)
        </label>
        <input
          type="text"
          value={config.address_en || ''}
          onChange={(e) => handleFieldChange('address_en', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="e.g. 123 Main Street, City"
        />
      </div>

      {/* Address (Arabic) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          العنوان (Arabic)
        </label>
        <input
          type="text"
          value={config.address_ar || ''}
          onChange={(e) => handleFieldChange('address_ar', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="مثل 123 الشارع الرئيسي، المدينة"
          dir="rtl"
        />
      </div>

      {/* Show Form */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={config.show_form !== false}
            onChange={(e) => handleFieldChange('show_form', e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-primary-600"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Show Contact Form
          </span>
        </label>
      </div>

      {/* Show Map */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={config.show_map !== false}
            onChange={(e) => handleFieldChange('show_map', e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-primary-600"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Show Map
          </span>
        </label>
      </div>

      <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <p className="text-xs text-blue-700 dark:text-blue-400">
          Changes are applied in real-time to the live preview.
        </p>
      </div>
    </div>
  )
}

export default ContactEditor
