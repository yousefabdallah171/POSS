'use client';

import React, { useState, useEffect } from 'react';
import { Save, X, Loader } from 'lucide-react';
import { Button } from '@pos-saas/ui';
import { ThemeSection } from './component-sidebar';

interface SectionEditorProps {
  section: ThemeSection | null;
  isLoading?: boolean;
  isSaving?: boolean;
  onSave: (section: ThemeSection) => Promise<void>;
  onClose: () => void;
}

export function SectionEditor({
  section,
  isLoading = false,
  isSaving = false,
  onSave,
  onClose,
}: SectionEditorProps) {
  const [formData, setFormData] = useState<Partial<ThemeSection>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (section) {
      setFormData(section);
      setError(null);
    }
  }, [section]);

  if (!section) {
    return null;
  }

  const handleChange = (key: keyof ThemeSection, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleContentChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [key]: value,
      },
    }));
  };

  const handleSave = async () => {
    try {
      setError(null);
      await onSave(formData as ThemeSection);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save section');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Edit Section
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-8">
              <Loader className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
              <p className="text-gray-600 dark:text-gray-400">Loading section...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Section Type (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Section Type
                </label>
                <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white font-medium">
                  {formData.section_type?.replace(/_/g, ' ').toUpperCase()}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                  maxLength={255}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Section title"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formData.title?.length || 0} / 255 characters
                </p>
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={formData.subtitle || ''}
                  onChange={(e) => handleChange('subtitle', e.target.value)}
                  maxLength={500}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Section subtitle"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formData.subtitle?.length || 0} / 500 characters
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Detailed description"
                />
              </div>

              {/* Button Text (if applicable) */}
              {(section.section_type === 'hero' || section.section_type === 'cta') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={formData.content?.buttonText || ''}
                      onChange={(e) => handleContentChange('buttonText', e.target.value)}
                      maxLength={100}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., Order Now"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Button Link
                    </label>
                    <input
                      type="text"
                      value={formData.content?.buttonLink || ''}
                      onChange={(e) => handleContentChange('buttonLink', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., /menu"
                    />
                  </div>
                </>
              )}

              {/* Background Image (if applicable) */}
              {(section.section_type === 'hero' || section.section_type === 'info_cards') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Background Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.background_image || ''}
                    onChange={(e) => handleChange('background_image', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              )}

              {/* Visibility Toggle */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_visible !== false}
                    onChange={(e) => handleChange('is_visible', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Show this section on the home page
                  </span>
                </label>
              </div>

              {/* Info */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  💡 <strong>Tip:</strong> Changes are saved automatically. Use the preview to see how your changes look on the home page.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
