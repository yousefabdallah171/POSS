'use client'

export function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <div className="space-y-6 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Title */}
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse" />

      {/* Form Fields */}
      <div className="space-y-4">
        {[...Array(fields)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse" />
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="flex gap-3 pt-4">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse" />
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse" />
      </div>
    </div>
  )
}
