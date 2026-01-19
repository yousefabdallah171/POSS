'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { getLocaleFromPath } from '@/lib/translations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Edit2, Trash2, Search, AlertCircle, Shield } from 'lucide-react'

interface Role {
  id: number
  name: string
  code: string
  access_level: number
  description?: string
  can_manage_users?: boolean
  can_manage_roles?: boolean
  is_active?: boolean
}

interface RoleListProps {
  roles: Role[]
  loading: boolean
  onEdit: (role: Role) => void
  onDelete: (id: number) => void
}

export function RoleList({ roles, loading, onEdit, onDelete }: RoleListProps) {
  const pathname = usePathname()
  const locale = getLocaleFromPath(pathname)
  const isRTL = locale === 'ar'
  const [searchText, setSearchText] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: number | null; isSystem: boolean }>({
    open: false,
    id: null,
    isSystem: false,
  })

  const filteredRoles = roles.filter(
    (role) =>
      (role?.name || '').toLowerCase().includes(searchText.toLowerCase()) ||
      (role?.code || '').toLowerCase().includes(searchText.toLowerCase())
  )

  const isSystemRole = (code: string) => ['admin', 'manager', 'employee'].includes(code?.toLowerCase())

  const handleDeleteClick = (id: number, code: string) => {
    if (isSystemRole(code)) {
      return
    }
    setDeleteConfirm({ open: true, id, isSystem: false })
  }

  const handleConfirmDelete = async () => {
    if (deleteConfirm.id) {
      await onDelete(deleteConfirm.id)
      setDeleteConfirm({ open: false, id: null, isSystem: false })
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  if (roles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
        <Shield className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Roles</h3>
        <p className="text-gray-600 dark:text-gray-400">Get started by creating your first role</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="w-full md:w-80 relative">
        <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-3 h-4 w-4 text-gray-400`} />
        <Input
          placeholder="Search by name or code..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className={isRTL ? 'pr-10' : 'pl-10'}
        />
      </div>

      {filteredRoles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          <AlertCircle className="h-10 w-10 text-gray-400 mb-3" />
          <p className="text-gray-600 dark:text-gray-400">No roles match your search</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-900">
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Access Level</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoles.map((role) => {
                const isSystem = isSystemRole(role.code)
                return (
                  <TableRow key={role.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {isSystem && (
                          <Shield className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                        )}
                        <div>
                          <div className="font-medium">{role.name}</div>
                          {isSystem && (
                            <div className="text-xs text-yellow-600 dark:text-yellow-400">System Role</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 dark:text-gray-400">{role.code}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                        Level {role.access_level}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                      {role.description ? role.description.substring(0, 50) + (role.description.length > 50 ? '...' : '') : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEdit(role)}
                          className="gap-1"
                        >
                          <Edit2 className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className={isSystem ? 'opacity-50 cursor-not-allowed' : 'text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20'}
                          onClick={() => handleDeleteClick(role.id, role.code)}
                          disabled={isSystem}
                          title={isSystem ? 'Cannot delete system roles' : ''}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirm.open} onOpenChange={(open) => setDeleteConfirm({ ...deleteConfirm, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Role</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this role? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm({ ...deleteConfirm, open: false })}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
