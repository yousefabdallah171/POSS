'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Bell, AlertTriangle, Settings } from 'lucide-react'
import { useNotifications, Notification } from '@/hooks/useNotifications'
import { usePathname } from 'next/navigation'
import { getLocaleFromPath, createTranslator } from '@/lib/translations'

const priorityColors = {
  low: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
  normal: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
  high: 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200',
  critical: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
}

export function NotificationCenter() {
  const { notifications, unreadCount, fetchNotifications, markAsRead, deleteNotification } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)
  const [displayCount, setDisplayCount] = useState(5)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const locale = getLocaleFromPath(pathname)
  const t = createTranslator(locale)
  const isRTL = locale === 'ar'

  // Auto-refresh on mount
  useEffect(() => {
    fetchNotifications({ limit: displayCount })
  }, [fetchNotifications, displayCount])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const diff = today.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return t('common.now')
    if (minutes < 60) return `${minutes}m`
    if (hours < 24) return `${hours}h`
    if (days < 7) return `${days}d`

    return date.toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      markAsRead(notification.id)
    }
    if (notification.action_url) {
      window.location.href = notification.action_url
    }
    setIsOpen(false)
  }

  const recentNotifications = (notifications || []).slice(0, 5)

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        title={t('notifications.title')}
      >
        <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Center Dropdown */}
      {isOpen && (
        <div
          className={`absolute ${
            isRTL ? 'left-0' : 'right-0'
          } mt-2 w-96 max-h-96 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col z-50`}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Bell className="h-4 w-4" />
              {t('notifications.title')}
            </h3>
            <Link
              href={`/${locale}/dashboard/notifications`}
              onClick={() => setIsOpen(false)}
              className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
            >
              {t('notifications.viewAll')}
            </Link>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {recentNotifications.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">{t('notifications.noNotifications')}</p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer ${
                      !notification.is_read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-xs px-1.5 py-0.5 rounded ${priorityColors[notification.priority]}`}>
                            {notification.priority}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(notification.created_at)}
                          </span>
                        </div>
                      </div>
                      {!notification.is_read && (
                        <div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0 mt-2"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 bg-gray-50 dark:bg-gray-900 flex items-center justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {unreadCount} {t('notifications.unreadNotifications')}
              </span>
              <Link
                href={`/${locale}/dashboard/notifications`}
                onClick={() => setIsOpen(false)}
                className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
              >
                {t('notifications.viewAllNotifications')}
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
