/**
 * Types-only exports for Next.js
 * These allow Next to know what items exist without importing any render code
 */

// Get the flat items array type
import { type LocalizeLanguage, type Translation } from '@compo/localize'
import { type Api } from '@services/site'
import type { itemsFlat } from './items'

// export { proseVariants } from "./prose"

// Extract all available item types as a union of type strings
export type AvailableItemTypes = (typeof itemsFlat)[number]['export']['type']

// Helper type to get item export by type string
export type InferExportByType<T extends AvailableItemTypes> = Extract<
  (typeof itemsFlat)[number],
  { export: { type: T } }
>['export']

/**
 * ExportedItem
 * ------------
 * This is the **static contract** an item exposes to the CMS.
 * Think of it as the item's "manifest". It contains:
 *
 * - `type`: A stable, unique identifier for the item (e.g., "headings.image").
 * - `props`: The **runtime props shape** the item uses (typed at the leaf level as `unknown` here,
 *            because each item defines its own structure; we infer strongly later in `InferItem`).
 * - `translations`: Minimal, language-keyed shape for item copy **used at authoring/runtime**.
 *   - Keys are `LocalizeLanguage` (e.g., "fr", "de", ...).
 *   - Values are arbitrary nested dictionaries for this item.
 *   - This stays lightweight so items can decide their own schema.
 * - `dictionary`: The **complete translation dictionary** for this item, typically the "catalog"
 *                 of keys used in forms, renders, tooltips, etc. Type `Translation` guarantees
 *                 all required locales exist but also allows extra locales.
 * - `templates` (optional): A map of SVG React components (icons, decorative assets, etc.),
 *                           addressed by a template name.
 * - `proses` (optional): A map of prose snippets (Markdown/plain text) keyed by a semantic name.
 *
 * Notes:
 * - Keep `type` stable across versions; the registry relies on it.
 * - `props` is intentionally untyped here to avoid over-constraining the contract.
 *   The real, precise type is reconstructed with `InferItem` per concrete item.
 */
export type ExportedItem = {
  type: string
  props: Record<string, unknown>
  translations: Record<LocalizeLanguage, Record<string, unknown>>
  dictionary: Translation
  templates?: Record<string, React.FC<React.SVGProps<SVGSVGElement>>>
  proses?: Record<string, string>
}

/**
 * InferItemAsync<E>
 * -----------------
 * Server-side (async) item shape reconstructed from the item manifest `E`.
 *
 * Includes:
 * - `files`: media files attached to the item, each with its own translations.
 * - `type` / `props`: taken from the item manifest (`ExportedItem`).
 * - `translations`: the **per-item translation payload** for a single locale.
 *   We use the shape of one manifest locale (e.g. `["fr"]`) as the structural model.
 *   The actual runtime locale is carried separately via the `locale` prop.
 * - Base CMS fields from `Api.ContentItem`, excluding overlaps:
 *   `"files" | "category" | "type" | "props" | "translations"`.
 *
 * Why `["fr"]` in the type?
 * - We only need the **value shape** of one locale to type the object.
 *   The active locale is provided at render-time (`RenderAsyncProps.locale`).
 */
export type InferItemAsync<
  T extends AvailableItemTypes,
  P extends InferExportByType<T> = InferExportByType<T>,
> = {
  files: Api.MediaFile[]
  slugs: Api.Slug[]
  type: T
  props: P['props']
  translations: { props: P['translations']['fr'] }
} & Omit<Api.ContentItem, 'files' | 'category' | 'type' | 'props' | 'translations'>

/**
 * RenderAsyncProps<T>
 * -------------------
 * Props passed to a server-side (async) item renderer in the App Router.
 *
 * - `item`: Fully-typed item instance assembled for the server.
 * - `locale`: Active UI/content locale (e.g., "fr", "de", ...).
 * - `path`: Canonical pathname (useful for building URLs / breadcrumbs).
 * - `searchParams`: Deferred access to query string params. Keeping this as a
 *   `Promise<unknown>` allows the framework to **lazy-resolve** or stream data
 *   before parsing. Resolve and parse in the renderer if/when needed.
 */
export type RenderAsyncProps<T extends AvailableItemTypes> = {
  item: InferItemAsync<T>
  locale: LocalizeLanguage
  path: string
  searchParams: Record<string, unknown>
}

/**
 * TemplateAsyncProps<T>
 * -------------------
 * Props passed to a server-side (async) item template renderer in the App Router.
 *
 * - `item`: Fully-typed item instance assembled for the server.
 * - `locale`: Active UI/content locale (e.g., "fr", "de", ...).
 * - `path`: Canonical pathname (useful for building URLs / breadcrumbs).
 * - `searchParams`: Deferred access to query string params. Keeping this as a
 *   `Promise<unknown>` allows the framework to **lazy-resolve** or stream data
 *   before parsing. Resolve and parse in the renderer if/when needed.
 */
export type TemplateAsyncProps<T extends AvailableItemTypes, P extends Record<string, unknown>> = {
  props: P
  item: InferItemAsync<T>
  locale: LocalizeLanguage
  path: string
  searchParams: Record<string, unknown>
}

/**
 * LinkProps
 */
