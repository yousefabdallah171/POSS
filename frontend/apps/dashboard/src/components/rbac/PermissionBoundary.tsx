'use client'

import React, { ReactNode, useMemo } from 'react'
import { useUserPermissions } from '@/hooks/useRbac'
import { hasPermissionLevel, PERMISSION_LEVELS } from '@/lib/rbac'

interface PermissionBoundaryProps {
  moduleId: number
  permissionLevel?: string
  children: ReactNode
  fallback?: ReactNode
  hideIfDenied?: boolean
}

/**
 * PermissionBoundary Component
 * Conditionally renders content based on user permissions
 * Useful for hiding/showing buttons, sections, or entire components
 */
export const PermissionBoundary: React.FC<PermissionBoundaryProps> = ({
  moduleId,
  permissionLevel = PERMISSION_LEVELS.READ,
  children,
  fallback = null,
  hideIfDenied = false,
}) => {
  const { permissions, loading } = useUserPermissions()

  const hasPermission = useMemo(() => {
    if (loading) return false
    const userLevel = permissions[moduleId]
    return hasPermissionLevel(userLevel, permissionLevel)
  }, [permissions, moduleId, permissionLevel, loading])

  if (loading) {
    return null
  }

  if (!hasPermission) {
    return hideIfDenied ? null : <>{fallback}</>
  }

  return <>{children}</>
}

/**
 * Hook version of PermissionBoundary for more flexible usage
 */
export const useCanAccess = (
  moduleId: number,
  permissionLevel: string = PERMISSION_LEVELS.READ
): boolean => {
  const { permissions, loading } = useUserPermissions()

  return useMemo(() => {
    if (loading) return false
    const userLevel = permissions[moduleId]
    return hasPermissionLevel(userLevel, permissionLevel)
  }, [permissions, moduleId, permissionLevel, loading])
}

export default PermissionBoundary
