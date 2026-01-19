'use client'

import DashboardLayoutComponent from '@/components/layout/DashboardLayout'
import DashboardAuthProvider from '@/components/providers/DashboardAuthProvider'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardAuthProvider>
      <DashboardLayoutComponent>
        {children}
      </DashboardLayoutComponent>
    </DashboardAuthProvider>
  )
}
