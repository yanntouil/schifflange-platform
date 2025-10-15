// Import from @compo/contents to avoid circular dependency
import {
  hasOwn,
  objectValues,
  type DistValueOf,
  type ExportedItem,
  type ItemSync,
  type ItemSyncOverride,
} from "@compo/contents"
import { D, G } from "@compo/utils"
import { items, type ItemCategories, type Items, type ItemTypes } from "."
export { hasOwn, objectValues } from "@compo/contents"

/**
 * Flattens { [Category]: { [Type]: I } } into I[]
 * - Useful to iterate over all registered SSR items at once.
 * - Generic and type-safe, works with any Items-like registry.
 */
export const flattenSSRItems = <C extends PropertyKey, T extends PropertyKey, I>(
  registry: Record<C, Record<T, I>>
): I[] => {
  const values = Object.values(registry) as Record<T, I>[]
  return values.flatMap((byType) => Object.values(byType) as I[])
}

/**
 * Flattens { [Category]: { [Type]: I } } into I[]
 * - Useful to iterate over all registered client items at once.
 * - Generic and type-safe, works with any Items-like registry.
 */
export const flattenClientItems = <R extends Record<PropertyKey, Record<PropertyKey, unknown>>>(
  registry: R
): Array<DistValueOf<DistValueOf<R>>> => objectValues(registry).flatMap((byType) => objectValues(byType))

/**
 * Extract the export (module shape) from an ItemSync
 */
export type ExtractItemType<T> = T extends ItemSync<infer E> ? E : never

/**
 * Extract the manifest (ExportedItem) from an ItemSync
 */
export type ManifestOf<IS> = IS extends ItemSync<infer E extends ExportedItem> ? E : never

/**
 * Merge a 2-level registry (Category -> Type -> ItemSync) with overrides.
 * - `export` is shallow-merged
 * - `Render`, `Thumbnail`, `createForm` are replaced if provided
 */
export const mergeItems = <R extends Items>(
  overrides: Partial<{
    [C in keyof R]: Partial<{
      [T in keyof R[C]]: ItemSyncOverride<ManifestOf<R[C][T]>>
    }>
  }>
) => {
  return D.mapWithKey(items, (category, types) => {
    const catOv = D.get(overrides, category)
    if (G.isNotNullable(catOv)) {
      return D.mapWithKey(types, (type, item) => {
        const ov = D.get(catOv, type)
        if (G.isNotNullable(ov)) {
          // @ts-ignore
          return { ...item, ...exportOv, export: { ...item.export, ...ov.export } }
        } else return item
      })
    } else return types
  }) as R
}

// Category guard
export const hasCategory = (category: PropertyKey): category is ItemCategories => hasOwn(items, category)

// Type guard (requires a known/validated category)
export const hasItem = <C extends ItemCategories>(
  category: C,
  type: PropertyKey
): type is Extract<ItemTypes<C>, PropertyKey> => hasOwn(items[category], type)

// Get a specific item (throws if missing)
export const getItem = <C extends ItemCategories, T extends ItemTypes<C>>(category: C, type: T): Items[C][T] => {
  if (!hasCategory(category) || !hasItem(category, type)) {
    throw new Error(`Item not found: ${String(category)} → ${String(type)}`)
  }
  return items[category][type]
}

// Get all items for a category (throws if missing)
export const getCategoryItems = <C extends ItemCategories>(category: C): Items[C] => {
  if (!hasCategory(category)) {
    throw new Error(`Category not found: ${String(category)}`)
  }
  return items[category]
}

// Safe accessors (return undefined instead of throwing)
export const safeGetItem = <C extends PropertyKey, T extends PropertyKey>(
  category: C,
  type: T
): C extends ItemCategories ? (T extends ItemTypes<C> ? Items[C][T] : undefined) : undefined => {
  // Runtime guards first:
  if (hasCategory(category) && hasItem(category, type)) {
    // TS narrows types correctly after both guards.
    return items[category][type] as any
  }
  return undefined as any
}
