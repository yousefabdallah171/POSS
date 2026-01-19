"use client";

/**
 * Skeleton Loading Components
 * Shows animated placeholders while theme data loads
 * Prevents flash of unstyled content (FOUC)
 */

export function HeaderSkeleton() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo skeleton */}
          <div className="flex items-center gap-2 animate-pulse">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            <div className="hidden sm:block">
              <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
              <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>

          {/* Navigation skeleton */}
          <div className="hidden md:flex items-center gap-4 animate-pulse">
            <div className="h-4 w-14 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-14 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>

          {/* Right actions skeleton */}
          <div className="flex items-center gap-2 animate-pulse">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-md" />
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-md" />
          </div>
        </div>
      </div>
    </header>
  );
}

export function FooterSkeleton() {
  return (
    <footer className="pt-16 pb-8 bg-gray-100 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 animate-pulse">
          {/* About section skeleton */}
          <div>
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>

          {/* Links skeleton x3 */}
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
              <div className="space-y-2">
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-700 mb-8" />

        {/* Copyright skeleton */}
        <div className="animate-pulse">
          <div className="h-4 w-64 mx-auto bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    </footer>
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <HeaderSkeleton />
      <main className="flex-1 w-full py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            {/* Title skeleton */}
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded" />

            {/* Content skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                  <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
                  <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                  <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <FooterSkeleton />
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm animate-pulse">
      <div className="h-48 bg-gray-200 dark:bg-gray-700" />
      <div className="p-4">
        <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2" />
        <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
        <div className="flex justify-between items-center">
          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  );
}
