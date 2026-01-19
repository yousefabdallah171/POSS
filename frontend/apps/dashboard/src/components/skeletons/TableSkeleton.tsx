'use client'

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {/* Table Header Skeleton */}
      <div className="grid grid-cols-5 gap-4 px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
        ))}
      </div>

      {/* Table Rows Skeleton */}
      {[...Array(rows)].map((_, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-5 gap-4 px-4 py-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          {[...Array(5)].map((_, colIndex) => (
            <div
              key={colIndex}
              className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
              style={{ animationDelay: `${colIndex * 0.1}s` }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
