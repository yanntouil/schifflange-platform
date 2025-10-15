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
 *   3) CONSTANTS (🚫 do not modify)
 *
 * HOW TO ADD A NEW ITEM
 * - Import your client module at the top of Zone 1.
 * - Register it in the `items` object under the correct Category and Type.
 * - Do NOT touch Zones 2 or 3.
 */

import { flattenClientItems, type ExtractItemType } from "./utils"

import contentsBreadcrumbs from "./contents/breadcrumbs"
import contentsNavigate from "./contents/navigate"
import contentsRichText from "./contents/rich-text"
import featuresActivities from "./features/activities"
import featuresCards from "./features/cards"
import featuresContacts from "./features/contacts"
import featuresFaq from "./features/faq"
import featuresProcess from "./features/process"
import featuresVideos from "./features/videos"
import headingsImage from "./headings/image"
import headingsImages from "./headings/images"
import headingsSimple from "./headings/simple"
import headingsVideo from "./headings/video"
import interactivesSubmitIdea from "./interactives/submit-idea"
import mediasDocuments from "./medias/documents"
import mediasImages from "./medias/images"
import projectsFooter from "./projects/footer"
import projectsLatest from "./projects/latest"
import projectsProcess from "./projects/process"
import projectsRelated from "./projects/related"
import projectsSearch from "./projects/search"

/* ============================================
 * 1) ✅ PUBLIC EXPORTS — Client item registry
 *    (This is the ONLY zone to edit)
 * --------------------------------------------
 * - Keys define the public index used across the app:
 *   - Category = first-level key (e.g., "headings")
 *   - Type     = second-level key (e.g., "image")
 * - IMPORTANT: Keys are part of the contract; changing them is a breaking change.
 * ============================================ */

export const items = {
  contents: {
    breadcrumbs: contentsBreadcrumbs,
    navigate: contentsNavigate,
    richText: contentsRichText,
  },
  features: {
    activities: featuresActivities,
    cards: featuresCards,
    contacts: featuresContacts,
    faq: featuresFaq,
    process: featuresProcess,
    videos: featuresVideos,
  },
  headings: {
    image: headingsImage,
    images: headingsImages,
    simple: headingsSimple,
    video: headingsVideo,
  },
  interactives: {
    submitIdea: interactivesSubmitIdea,
  },
  medias: {
    images: mediasImages,
    documents: mediasDocuments,
  },
  projects: {
    search: projectsSearch,
    process: projectsProcess,
    related: projectsRelated,
    latest: projectsLatest,
    footer: projectsFooter,
  },
}

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
export type ItemExport<C extends ItemCategories, T extends ItemTypes<C>> = ExtractItemType<Items[C][T]>

/* ============================================
 * 3) 🚫 CONSTANTS — Utilities for integrators
 *    (Do NOT edit)
 * --------------------------------------------
 * - `itemsFlat` is a flattened array of all items.
 * ============================================ */
export const itemsFlat = flattenClientItems(items)
export { getCategoryItems, getItem, hasCategory, hasItem, mergeItems, safeGetItem } from "./utils"
export { flattenClientItems, type ExtractItemType }
