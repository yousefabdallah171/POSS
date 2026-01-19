'use client'

import { ComponentConfig, ComponentType } from '@/types/theme'
import { useThemeStore } from '@/hooks/useThemeStore'
import GenericEditor from './GenericEditor'
import { HeroEditor } from './HeroEditor'
import { ProductsEditor } from './ProductsEditor'
import { WhyChooseUsEditor } from './WhyChooseUsEditor'
import { ContactEditor } from './ContactEditor'
import { TestimonialsEditor } from './TestimonialsEditor'
import { CTAEditor } from './CTAEditor'

// Helper function to extract label from translation objects
function extractLabel(label: any): string {
  if (typeof label === 'string') return label
  if (label && typeof label === 'object') {
    // Handle translation objects like {en: "...", ar: "..."}
    return label.en || label.ar || Object.values(label)[0] || ''
  }
  return ''
}

interface ComponentEditorProps {
  component: ComponentConfig
  onClose?: () => void
}

/**
 * ComponentEditor
 *
 * Routes to the correct editor based on component type.
 * Each component type now has its own dedicated editor with proper input fields.
 * All changes are applied in real-time to the live preview.
 */
export function ComponentEditor({ component, onClose }: ComponentEditorProps) {
  const updateComponent = useThemeStore((state) => state.updateComponent)

  // Router - map component type to specific editor
  const getEditor = () => {
    switch (component.type) {
      case 'hero':
        return <HeroEditor component={component} />

      case 'products':
        return <ProductsEditor component={component} />

      case 'why_us':
        return <WhyChooseUsEditor component={component} />

      case 'contact':
        return <ContactEditor component={component} />

      case 'testimonials':
        return <TestimonialsEditor component={component} />

      case 'cta':
        return <CTAEditor component={component} />

      case 'custom':
        return <GenericEditor component={component} />

      default:
        return <GenericEditor component={component} />
    }
  }

  const handleUpdate = (updates: Partial<ComponentConfig>) => {
    updateComponent(component.id, updates)
  }

  return (
    <div className="space-y-4">
      {/* Component Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {extractLabel(component.title)}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
              {component.type.replace('_', ' ')} Component
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
              aria-label="Close editor"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Component Editor */}
      {getEditor()}
    </div>
  )
}

export default ComponentEditor
