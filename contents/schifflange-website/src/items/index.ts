/**
 * 📦 CMS Content Items — Client Side
 *
 * PURPOSE
 * - This file exposes all CMS items available on the client.
 * - Each item (module) typically includes: Form, Render, Thumbnail and an export/config.
 *
 * INDEXING MODEL (how items are organized)
 * - Items are indexed in two levels: Category -> Type.
 *   Example: items["headings"]["image"] points to a concrete client module.
 * - Category keys (e.g., "headings") group related item types.
 * - Type keys (e.g., "image") select the specific client item module within that category.
 *
 * DEV RULES
 * - This file is split into 3 zones:
 *   1) PUBLIC EXPORTS (✅ the ONLY zone developers should edit)
 *   2) TYPES (🚫 do not modify)
 *   3) HELPERS (🚫 do not modify)
 *
 * HOW TO ADD A NEW ITEM
 * - Import your client module at the top of Zone 1.
 * - Register it in the `items` object under the correct Category and Type.
 * - Do NOT touch Zones 2 or 3.
 */

import { client as globals } from "@contents/globals"

/* ============================================
 * 1) ✅ PUBLIC EXPORTS — Client item registry
 *    (This is the ONLY zone to edit)
 * --------------------------------------------
 * - Keys define the public index used across the app:
 *   - Category = first-level key (e.g., "headings")
 *   - Type     = second-level key (e.g., "image")
 * - IMPORTANT: Keys are part of the contract; changing them is a breaking change.
 * ============================================ */

export const items = globals.mergeItems({
  // headings: {
  //   image: headingsImage,
  // },
})

/* ============================================
 * 2) 🚫 TYPES — Derived types for strong typing
 *    (Do NOT edit)
 * --------------------------------------------
 * - These types infer the index shape from `items`.
 * - They enforce correct category/type lookups and power the helpers.
 * ============================================ */

export type Items = typeof items
export type ItemCategories = keyof Items
export type ItemTypes<C extends ItemCategories> = keyof Items[C]
export type ItemExport<C extends ItemCategories, T extends ItemTypes<C>> = globals.ExtractItemType<Items[C][T]>

/* ============================================
 * 3) 🚫 HELPERS — Utilities for integrators
 *    (Do NOT edit)
 * --------------------------------------------
 * - Helpers are type-safe and avoid `as any`.
 * - `hasCategory` and `hasItem` are proper runtime guards.
 * - `getItem` throws if not found; `safeGetItem` returns `undefined`.
 * ============================================ */

export const itemsFlat = globals.flattenClientItems(items)
export {
  flattenClientItems,
  getCategoryItems,
  getItem,
  hasCategory,
  hasItem,
  safeGetItem,
  type ExtractItemType,
} from "@contents/globals"
