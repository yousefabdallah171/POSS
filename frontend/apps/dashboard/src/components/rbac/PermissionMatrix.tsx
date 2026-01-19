'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Trash2, Save, AlertCircle } from 'lucide-react'
import {
  MODULE_IDS,
  PERMISSION_LEVELS,
  getModuleName,
  getPermissionDescription,
  RolePermission,
} from '@/lib/rbac'
import { useRolePermissions } from '@/hooks/useRbac'

interface PermissionMatrixProps {
  roleId: number
  onPermissionChange?: (
    moduleId: number,
    permissionLevel: string
  ) => Promise<void>
  onPermissionRemove?: (moduleId: number) => Promise<void>
  readOnly?: boolean
}

/**
 * PermissionMatrix Component
 * Displays and manages permissions for a role across all modules
 */
export const PermissionMatrix: React.FC<PermissionMatrixProps> = ({
  roleId,
  onPermissionChange,
  onPermissionRemove,
  readOnly = false,
}) => {
  const { permissions, loading, error, assignPermission, revokePermission } =
    useRolePermissions(roleId)

  const [localChanges, setLocalChanges] = useState<Record<number, string>>({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // Get all modules
  const modules = Object.entries(MODULE_IDS).map(([name, id]) => ({
    id,
    name: getModuleName(id),
  }))

  // Get current permission for a module
  const getPermissionForModule = (moduleId: number): string => {
    const permission = permissions.find((p) => p.module_id === moduleId)
    return permission?.permission_level || PERMISSION_LEVELS.NONE
  }

  // Handle permission level change
  const handlePermissionChange = async (
    moduleId: number,
    newLevel: string
  ) => {
    setLocalChanges({ ...localChanges, [moduleId]: newLevel })

    if (onPermissionChange) {
      try {
        setSaving(true)
        setSaveError(null)
        await onPermissionChange(moduleId, newLevel)
      } catch (err) {
        setSaveError(
          err instanceof Error
            ? err.message
            : 'Failed to update permission'
        )
      } finally {
        setSaving(false)
      }
    } else {
      // Use default API if no custom handler
      try {
        setSaving(true)
        setSaveError(null)
        await assignPermission(moduleId, newLevel)
        setLocalChanges({ ...localChanges, [moduleId]: '' })
      } catch (err) {
        setSaveError(
          err instanceof Error
            ? err.message
            : 'Failed to update permission'
        )
      } finally {
        setSaving(false)
      }
    }
  }

  // Handle permission removal
  const handleRemovePermission = async (moduleId: number) => {
    if (onPermissionRemove) {
      try {
        setSaving(true)
        setSaveError(null)
        await onPermissionRemove(moduleId)
      } catch (err) {
        setSaveError(
          err instanceof Error ? err.message : 'Failed to remove permission'
        )
      } finally {
        setSaving(false)
      }
    } else {
      // Use default API if no custom handler
      try {
        setSaving(true)
        setSaveError(null)
        await revokePermission(moduleId)
        setLocalChanges({ ...localChanges, [moduleId]: '' })
      } catch (err) {
        setSaveError(
          err instanceof Error ? err.message : 'Failed to remove permission'
        )
      } finally {
        setSaving(false)
      }
    }
  }

  if (loading && permissions.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Loading permissions...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Error Alert */}
      {(error || saveError) && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900 dark:text-red-300">
              Error
            </h3>
            <p className="text-red-700 dark:text-red-400 text-sm mt-1">
              {error?.message || saveError}
            </p>
          </div>
        </div>
      )}

      {/* Permission Matrix Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Module
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Permission Level
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Description
              </th>
              {!readOnly && (
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {modules.map((module) => {
              const currentPermission =
                localChanges[module.id] || getPermissionForModule(module.id)
              return (
                <tr
                  key={module.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {module.name}
                  </td>
                  <td className="px-4 py-3">
                    {readOnly ? (
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {currentPermission}
                      </span>
                    ) : (
                      <select
                        value={currentPermission}
                        onChange={(e) =>
                          handlePermissionChange(module.id, e.target.value)
                        }
                        disabled={saving}
                        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 disabled:opacity-50"
                      >
                        {Object.values(PERMISSION_LEVELS).map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    {getPermissionDescription(currentPermission)}
                  </td>
                  {!readOnly && currentPermission !== PERMISSION_LEVELS.NONE && (
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleRemovePermission(module.id)}
                        disabled={saving}
                        className="inline-flex items-center gap-1 px-2 py-1 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded disabled:opacity-50"
                        title="Remove permission"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {modules.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            No modules available
          </p>
        </div>
      )}

      {/* Info Message */}
      {!readOnly && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            💡 Tip: Select permission levels to grant access. Higher levels
            include permissions from lower levels (e.g., DELETE includes WRITE).
          </p>
        </div>
      )}
    </div>
  )
}

export default PermissionMatrix
