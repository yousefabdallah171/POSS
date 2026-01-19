'use client'

export function PageHeaderSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div className="space-y-2">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 animate-pulse" />
      </div>
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse" />
    </div>
  )
}
