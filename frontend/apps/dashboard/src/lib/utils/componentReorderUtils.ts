/**
 * Component Reorder Utilities
 * Handles component reordering with display order persistence
 */

import { ThemeComponent } from '@/types/theme'

/**
 * Update display order after reordering components
 */
export function updateComponentDisplayOrder(
  components: ThemeComponent[]
): ThemeComponent[] {
  return components.map((component, index) => ({
    ...component,
    displayOrder: index,
  }))
}

/**
 * Get reorder payload for API
 */
export function getReorderPayload(components: ThemeComponent[]) {
  return {
    components: components.map((comp) => ({
      id: comp.id,
      displayOrder: comp.displayOrder,
    })),
  }
}

/**
 * Reorder components by moving item from source to target index
 */
export function reorderComponentsByIndex(
  components: ThemeComponent[],
  sourceIndex: number,
  targetIndex: number
): ThemeComponent[] {
  if (sourceIndex === targetIndex) return components

  const newComponents = [...components]
  const [movedComponent] = newComponents.splice(sourceIndex, 1)
  newComponents.splice(targetIndex, 0, movedComponent)

  return updateComponentDisplayOrder(newComponents)
}

/**
 * Move component up in order
 */
export function moveComponentUp(components: ThemeComponent[], index: number): ThemeComponent[] {
  if (index === 0) return components
  return reorderComponentsByIndex(components, index, index - 1)
}

/**
 * Move component down in order
 */
export function moveComponentDown(components: ThemeComponent[], index: number): ThemeComponent[] {
  if (index === components.length - 1) return components
  return reorderComponentsByIndex(components, index, index + 1)
}

/**
 * Sort components by display order
 */
export function sortComponentsByOrder(components: ThemeComponent[]): ThemeComponent[] {
  return [...components].sort((a, b) => a.displayOrder - b.displayOrder)
}
