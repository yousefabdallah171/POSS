'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertCircle, Plus, Trash2, Loader2 } from 'lucide-react'
import { useUserRoles, useRoles } from '@/hooks/useRbac'
import { Role } from '@/lib/rbac'

interface UserRoleAssignmentProps {
  userId: number
  tenantId: number
  userName?: string
  onRolesChange?: () => void
}

/**
 * UserRoleAssignment Component
 * Manages role assignments for a specific user
 */
export const UserRoleAssignment: React.FC<UserRoleAssignmentProps> = ({
  userId,
  tenantId,
  userName,
  onRolesChange,
}) => {
  const { roles, loading: rolesLoading, error: rolesError, assignRole, removeRole } = useUserRoles(userId)
  const { roles: allRoles, fetchRoles } = useRoles()
  const [showDialog, setShowDialog] = useState(false)
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null)
  const [assigning, setAssigning] = useState(false)
  const [removing, setRemoving] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Load available roles when dialog opens
  const handleDialogOpen = async () => {
    try {
      setError(null)
      await fetchRoles(tenantId)
      setShowDialog(true)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load available roles'
      )
    }
  }

  // Handle role assignment
  const handleAssignRole = async () => {
    if (!selectedRoleId) return

    try {
      setAssigning(true)
      setError(null)
      await assignRole(selectedRoleId)
      setSelectedRoleId(null)
      setShowDialog(false)
      onRolesChange?.()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to assign role'
      )
    } finally {
      setAssigning(false)
    }
  }

  // Handle role removal
  const handleRemoveRole = async (roleId: number) => {
    if (!confirm('Are you sure you want to remove this role?')) return

    try {
      setRemoving(roleId)
      setError(null)
      await removeRole(roleId)
      onRolesChange?.()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to remove role'
      )
    } finally {
      setRemoving(null)
    }
  }

  // Get available roles (roles not already assigned)
  const availableRoles = allRoles.filter(
    (role) => !roles.some((userRole) => userRole.id === role.id)
  )

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          User Roles {userName && `- ${userName}`}
        </h3>
        <Button
          onClick={handleDialogOpen}
          size="sm"
          className="gap-2"
          disabled={rolesLoading}
        >
          <Plus className="h-4 w-4" />
          Assign Role
        </Button>
      </div>

      {/* Error Alert */}
      {(rolesError || error) && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900 dark:text-red-300">
              Error
            </h3>
            <p className="text-red-700 dark:text-red-400 text-sm mt-1">
              {rolesError?.message || error}
            </p>
          </div>
        </div>
      )}

      {/* Assigned Roles List */}
      {rolesLoading && roles.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
        </div>
      ) : roles.length > 0 ? (
        <div className="space-y-2">
          {roles.map((role) => (
            <div
              key={role.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {role.role_name}
                </p>
                {role.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {role.description}
                  </p>
                )}
              </div>
              {!role.is_system && (
                <button
                  onClick={() => handleRemoveRole(role.id)}
                  disabled={removing === role.id}
                  className="inline-flex items-center gap-1 px-2 py-1 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded disabled:opacity-50"
                  title="System roles cannot be removed"
                >
                  {removing === role.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            No roles assigned yet
          </p>
        </div>
      )}

      {/* Assignment Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Role to User</DialogTitle>
          </DialogHeader>

          {/* Error in Dialog */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Role Selection */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select a role
              </label>
              <select
                value={selectedRoleId || ''}
                onChange={(e) => setSelectedRoleId(Number(e.target.value))}
                disabled={assigning}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 disabled:opacity-50"
              >
                <option value="">Choose a role...</option>
                {availableRoles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.role_name}
                    {role.description && ` - ${role.description}`}
                  </option>
                ))}
              </select>
              {availableRoles.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  No more roles available to assign
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDialog(false)}
                disabled={assigning}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAssignRole}
                disabled={!selectedRoleId || assigning}
                className="flex-1"
              >
                {assigning ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Assigning...
                  </>
                ) : (
                  'Assign'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default UserRoleAssignment
