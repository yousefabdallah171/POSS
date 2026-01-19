'use client'

import { useState } from 'react'
import { Download, Copy, Check, X } from 'lucide-react'
import { ThemeData } from '@/types/theme'
import { toast } from 'sonner'

interface ExportDialogProps {
  theme: ThemeData
  isOpen: boolean
  onClose: () => void
}

export function ExportDialog({ theme, isOpen, onClose }: ExportDialogProps) {
  const [copied, setCopied] = useState(false)
  const [includeComponents, setIncludeComponents] = useState(true)

  const getExportData = () => {
    const exportData: any = {
      name: theme.name,
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      colors: theme.colors,
      typography: theme.typography,
      identity: theme.identity || theme.websiteIdentity,
      header: theme.header,
      footer: theme.footer,
      customCss: theme.customCss
    }

    if (includeComponents && theme.components) {
      exportData.components = theme.components
    }

    return exportData
  }

  const handleDownload = () => {
    const data = getExportData()
    const dataStr = JSON.stringify(data, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${theme.slug || theme.name.toLowerCase().replace(/\s+/g, '-')}-theme.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success('Theme exported successfully!')
  }

  const handleCopy = async () => {
    const data = getExportData()
    const dataStr = JSON.stringify(data, null, 2)
    try {
      await navigator.clipboard.writeText(dataStr)
      setCopied(true)
      toast.success('Theme copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Failed to copy to clipboard')
    }
  }

  if (!isOpen) return null

  const exportData = getExportData()
  const exportSize = JSON.stringify(exportData).length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Dialog */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Download className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Export Theme</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
          >
            <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Theme Info */}
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              {theme.name}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {exportSize} bytes • {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeComponents}
                onChange={(e) => setIncludeComponents(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-primary-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Include components</span>
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 ml-6">
              {includeComponents
                ? `${theme.components?.length || 0} components will be included`
                : 'Components will not be exported'}
            </p>
          </div>

          {/* Preview */}
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg max-h-40 overflow-y-auto">
            <p className="text-xs font-mono text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
              {JSON.stringify(
                {
                  name: exportData.name,
                  version: exportData.version,
                  colors: '...',
                  typography: '...',
                  components: includeComponents ? `[${theme.components?.length || 0} components]` : 'not included'
                },
                null,
                2
              )}
            </p>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </button>
            <button
              onClick={handleCopy}
              className={`px-4 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                copied
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-900 dark:text-white rounded-lg font-medium transition"
          >
            Close
          </button>
        </div>

        {/* Footer Info */}
        <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 rounded-b-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            💾 This file contains all your theme settings and can be imported later to recreate this theme.
          </p>
        </div>
      </div>
    </div>
  )
}
