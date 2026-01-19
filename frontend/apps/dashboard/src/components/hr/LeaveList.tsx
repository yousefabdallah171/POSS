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
import { Edit2, Trash2, Search, AlertCircle, CheckCircle, XCircle } from 'lucide-react'

interface Leave {
  id: number
  employee_id: number
  employee_name?: string
  start_date: string
  end_date: string
  leave_type: string
  status: string
  reason?: string
  [key: string]: any
}

interface LeaveListProps {
  leaves: Leave[]
  loading: boolean
  onEdit: (leave: Leave) => void
  onDelete: (id: number) => void
  onApprove?: (id: number, notes?: string) => void
  onReject?: (id: number, reason?: string) => void
  canApprove?: boolean
}

export function LeaveList({
  leaves,
  loading,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  canApprove = false,
}: LeaveListProps) {
  const pathname = usePathname()
  const locale = getLocaleFromPath(pathname)
  const isRTL = locale === 'ar'
  const [searchText, setSearchText] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: number | null }>({
    open: false,
    id: null,
  })

  const filteredLeaves = leaves.filter(
    (leave) =>
      leave.employee_name?.toLowerCase().includes(searchText.toLowerCase()) ||
      leave.leave_type.toLowerCase().includes(searchText.toLowerCase()) ||
      leave.status.toLowerCase().includes(searchText.toLowerCase())
  )

  const handleDeleteClick = (id: number) => {
    setDeleteConfirm({ open: true, id })
  }

  const handleConfirmDelete = async () => {
    if (deleteConfirm.id) {
      await onDelete(deleteConfirm.id)
      setDeleteConfirm({ open: false, id: null })
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return dateString
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
      case 'approved':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
      case 'rejected':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
      case 'cancelled':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
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

  if (leaves.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
        <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Leave Requests</h3>
        <p className="text-gray-600 dark:text-gray-400">Get started by creating a leave request</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="w-full md:w-80 relative">
        <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-3 h-4 w-4 text-gray-400`} />
        <Input
          placeholder="Search by name, type, or status..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className={isRTL ? 'pr-10' : 'pl-10'}
        />
      </div>

      {filteredLeaves.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          <AlertCircle className="h-10 w-10 text-gray-400 mb-3" />
          <p className="text-gray-600 dark:text-gray-400">No leave requests match your search</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-900">
                <TableHead>Employee</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeaves.map((leave) => (
                <TableRow key={leave.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <TableCell className="font-medium">{leave.employee_name || `Employee #${leave.employee_id}`}</TableCell>
                  <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="capitalize">{leave.leave_type?.replace(/_/g, ' ')}</span>
                  </TableCell>
                  <TableCell className="text-sm">{formatDate(leave.start_date)}</TableCell>
                  <TableCell className="text-sm">{formatDate(leave.end_date)}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(leave.status)}`}>
                      {leave.status === 'pending' && <AlertCircle className="h-3 w-3" />}
                      {leave.status === 'approved' && <CheckCircle className="h-3 w-3" />}
                      {leave.status === 'rejected' && <XCircle className="h-3 w-3" />}
                      <span className="capitalize">{leave.status}</span>
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {leave.status === 'pending' && canApprove && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 gap-1"
                            onClick={() => onApprove?.(leave.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 gap-1"
                            onClick={() => onReject?.(leave.id)}
                          >
                            <XCircle className="h-4 w-4" />
                            Reject
                          </Button>
                        </>
                      )}
                      {leave.status !== 'approved' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEdit(leave)}
                          className="gap-1"
                        >
                          <Edit2 className="h-4 w-4" />
                          Edit
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                        onClick={() => handleDeleteClick(leave.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirm.open} onOpenChange={(open) => setDeleteConfirm({ ...deleteConfirm, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Leave Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this leave request? This action cannot be undone.
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
