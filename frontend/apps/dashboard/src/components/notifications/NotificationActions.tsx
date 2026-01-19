'use client'

import { useState, useRef, useEffect } from 'react'
import { MoreVertical } from 'lucide-react'

interface NotificationActionsProps {
  notificationId: number
  isRead: boolean
  onMarkAsRead: (id: number) => void
  onMarkAsUnread: (id: number) => void
  onDelete: (id: number) => void
  canDelete?: boolean
  translations: {
    markAsRead: string
    markAsUnread: string
    delete: string
  }
  isRTL?: boolean
}

export function NotificationActions({
  notificationId,
  isRead,
  onMarkAsRead,
  onMarkAsUnread,
  onDelete,
  canDelete = true,
  translations,
  isRTL = false,
}: NotificationActionsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleAction = (action: () => void) => {
    action()
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
        title="Actions"
      >
        <MoreVertical className="h-4 w-4 text-gray-600 dark:text-gray-400" />
      </button>

      {isOpen && (
        <div
          className={`absolute top-full z-50 mt-1 min-w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden ${
            isRTL ? 'right-0' : 'left-0'
          }`}
        >
          {/* Mark as Read/Unread */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleAction(() => {
                if (isRead) {
                  onMarkAsUnread(notificationId)
                } else {
                  onMarkAsRead(notificationId)
                }
              })
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors flex items-center gap-2"
          >
            <span>{isRead ? translations.markAsUnread : translations.markAsRead}</span>
          </button>

          {/* Delete */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              if (canDelete) {
                handleAction(() => onDelete(notificationId))
              }
            }}
            disabled={!canDelete}
            title={!canDelete ? "You don't have permission to delete notifications" : undefined}
            className={`w-full px-4 py-2 text-left text-sm transition-colors flex items-center gap-2 ${
              canDelete
                ? 'hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 cursor-pointer'
                : 'text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50'
            }`}
          >
            <span>{translations.delete}</span>
          </button>
        </div>
      )}
    </div>
  )
}
