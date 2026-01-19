import { ReactNode } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbProps {
  children: ReactNode
}

interface BreadcrumbItemProps {
  children: ReactNode
}

interface BreadcrumbLinkProps {
  href: string
  children: ReactNode
  className?: string
}

interface BreadcrumbPageProps {
  children: ReactNode
  className?: string
}

interface BreadcrumbSeparatorProps {
  className?: string
}

export function Breadcrumb({ children }: BreadcrumbProps) {
  return (
    <nav aria-label="breadcrumb" className="flex items-center text-sm text-gray-500 dark:text-gray-400">
      {children}
    </nav>
  )
}

export function BreadcrumbItem({ children }: BreadcrumbItemProps) {
  return <div className="flex items-center">{children}</div>
}

export function BreadcrumbLink({ href, children, className = '' }: BreadcrumbLinkProps) {
  return (
    <Link href={href} className={`hover:text-gray-700 dark:hover:text-gray-300 ${className}`}>
      {children}
    </Link>
  )
}

export function BreadcrumbPage({ children, className = '' }: BreadcrumbPageProps) {
  return <span className={`text-gray-900 dark:text-white ${className}`}>{children}</span>
}

export function BreadcrumbSeparator({ className = '' }: BreadcrumbSeparatorProps) {
  return (
    <div className={`mx-2 ${className}`}>
      <ChevronRight className="h-4 w-4" />
    </div>
  )
}
