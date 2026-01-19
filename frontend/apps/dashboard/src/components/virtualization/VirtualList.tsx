'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'

interface VirtualListProps<T> {
  items: T[]
  itemHeight: number
  containerHeight: number
  renderItem: (item: T, index: number) => React.ReactNode
  className?: string
  overscan?: number // Number of items to render outside visible area
}

/**
 * Virtual List Component
 * Efficiently renders large lists by only rendering visible items
 * Perfect for lists with 1000+ items
 *
 * Usage:
 * <VirtualList
 *   items={employees}
 *   itemHeight={60}
 *   containerHeight={600}
 *   renderItem={(item, idx) => <EmployeeRow key={item.id} employee={item} />}
 *   overscan={5}
 * />
 */
export function VirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  className = '',
  overscan = 5,
}: VirtualListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = useState(0)

  // Calculate visible range
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(
    items.length,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  )

  const visibleItems = items.slice(startIndex, endIndex)
  const offsetY = startIndex * itemHeight

  // Handle scroll
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    setScrollTop(target.scrollTop)
  }, [])

  const totalHeight = items.length * itemHeight

  return (
    <div
      ref={containerRef}
      className={`overflow-y-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      {/* Invisible spacer before visible items */}
      <div style={{ height: offsetY }} />

      {/* Visible items */}
      <div>
        {visibleItems.map((item, idx) => (
          <div key={startIndex + idx}>
            {renderItem(item, startIndex + idx)}
          </div>
        ))}
      </div>

      {/* Invisible spacer after visible items */}
      <div style={{ height: Math.max(0, totalHeight - (offsetY + visibleItems.length * itemHeight)) }} />
    </div>
  )
}

/**
 * Hook version for more flexibility
 */
export function useVirtualization(
  itemCount: number,
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) {
  const [scrollTop, setScrollTop] = useState(0)

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(
    itemCount,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  )

  const offsetY = startIndex * itemHeight
  const totalHeight = itemCount * itemHeight

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])

  return {
    startIndex,
    endIndex,
    offsetY,
    totalHeight,
    handleScroll,
    visibleRange: endIndex - startIndex,
  }
}
