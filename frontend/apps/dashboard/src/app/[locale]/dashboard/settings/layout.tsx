'use client'

import { ReactNode, use } from 'react'
import { SettingsSidebar } from '@/components/settings/SettingsSidebar'

interface SettingsLayoutProps {
  children: ReactNode
  params: Promise<{
    locale: string
  }>
}

export default function SettingsLayout({
  children,
  params,
}: SettingsLayoutProps) {
  const { locale } = use(params)
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
          {/* Sidebar */}
          <div className="md:col-span-1 border-r border-gray-200 dark:border-gray-800">
            <div className="p-4">
              <SettingsSidebar locale={locale} />
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-3 p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
