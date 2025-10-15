import { ExportedItem, ItemSync, ItemSyncOverride } from "./types.sync"

/**
 * objectValues
 * Typed Object.values that preserves the value type.
 */
export type DistValueOf<T> = T extends unknown ? T[keyof T] : never
export const objectValues = <T extends object>(o: T): Array<DistValueOf<T>> => Object.values(o) as Array<DistValueOf<T>>

/**
 * hasOwn
 * Narrow `key in object` with a safe `hasOwn` guard.
 */
export const hasOwn = <O extends object, K extends PropertyKey>(obj: O, key: K): key is Extract<K, keyof O> =>
  Object.prototype.hasOwnProperty.call(obj, key)

/**
 * Flattens { [Category]: { [Type]: I } } into I[]
 * - Useful to iterate over all registered client items at once.
 * - Generic and type-safe, works with any Items-like registry.
 */
export const flattenClientItems = <C extends PropertyKey, T extends PropertyKey, I>(
  registry: Record<C, Record<T, I>>
): I[] => objectValues(registry).flatMap((byType) => objectValues(byType))

/**
 * mergeContentItems
 * Helper to merge base content items with overrides
 * Useful for theme-specific customizations
 */
export const mergeContentItems = <R extends Record<string, Record<string, ItemSync<ExportedItem>>>>(
  base: R,
  overrides: Partial<{
    [C in keyof R]: Partial<{
      [T in keyof R[C]]: ItemSyncOverride<R[C][T]["export"]>
    }>
  }>
): R => {
  const result = { ...base }

  for (const categoryKey in overrides) {
    const category = categoryKey as keyof R
    const categoryOv = overrides[category]
    if (!categoryOv) continue
    if (!(category in result)) continue

    // clone category container
    result[category] = { ...result[category] }

    for (const typeKey in categoryOv) {
      const type = typeKey as keyof R[typeof category]
      const itemOv = categoryOv[type]
      if (!itemOv) continue

      const baseItem = result[category][type]
      if (!baseItem) continue

      const next: ItemSync<any> = {
        ...baseItem,
        // shallow-merge the manifest
        export: itemOv.export ? { ...baseItem.export, ...itemOv.export } : baseItem.export,
        // replace components if provided
        ...(itemOv.Thumbnail ? { Thumbnail: itemOv.Thumbnail } : null),
        ...(itemOv.createForm ? { createForm: itemOv.createForm } : null),
      }

      // preserve the exact ItemSync type for this slot
      result[category][type] = next as R[typeof category][typeof type]
    }
  }

  return result
}
