/**
 * 🧭 Client Item Contracts — Read Me Once, Use Forever
 *
 * This file defines the public **contracts** for client-side CMS items.
 * Integrators implement these types to plug new items (blocks) into the CMS.
 *
 * Guiding ideas:
 * - Keep runtime simple; push complexity into types.
 * - Be explicit about what the CMS expects (shape, data, handlers).
 * - Strong typing for safety; minimal code for DX.
 */

import { Translation, type LocalizeLanguage } from "@compo/localize"
import { type Api, type Payload } from "@services/dashboard"
import React from "react"

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
 * ItemSync<T>
 * -----------
 * Bundle that wires a **client-side item** into the CMS.
 *
 * - `export`: The item's static manifest (see `ExportedItem`).
 * - `createForm`: Factory returning the **authoring form** for this item.
 * - `Render`: The **runtime renderer** (client) for this item.
 * - `Thumbnail`: Small **preview** component used in pickers/galleries.
 *
 * Generic parameter:
 * - `T` extends `ExportedItem` and carries the **specific `props` and `translations` shape**
 *   for the item. Everything else narrows from it via `InferItem<T>`.
 */
export type ItemSync<T extends ExportedItem> = {
  export: T
  createForm: CreateItemForm<T>
  Thumbnail: ThumbnailItemComponent<T>
}
export type ItemSyncOverride<T extends ExportedItem> = {
  export?: ExportedItemOverride<T>
  createForm?: CreateItemForm<T>
  Thumbnail?: ThumbnailItemComponent<T>
}
export type ExportedItemOverride<T extends ExportedItem> = Partial<T>

/**
 * RenderSyncComponent<T>
 * ----------------------
 * Client-side renderer signature.
 *
 * Input:
 * - `item`: A strongly typed instance combining:
 *   - the item's `type` and `props` (from `T`),
 *   - the CMS base fields for `Api.ContentItem` (minus fields we override),
 *   - the translatable part typed from `T["translations"]`.
 *
 * Output:
 * - A React Function Component expected to render the final visual element.
 */
export type RenderSyncComponent<T extends ExportedItem> = React.FC<{ item: InferItem<T> }>

/**
 * CreateItemForm<T>
 * -----------------
 * Factory that builds the **authoring form** component for the item.
 *
 * Input:
 * - `exportedItem`: The static manifest (often used to obtain dictionary,
 *                   default props, or templates).
 *
 * Output:
 * - A React component that edits an existing item (or creates a new one) and
 *   eventually calls `onSubmit` with a **canonical payload** understood by the API.
 */
export type CreateItemForm<T extends ExportedItem> = (exportedItem: T) => FormItemComponent<T>

/**
 * FormItemComponent<T>
 * --------------------
 * Authoring form signature.
 *
 * Props:
 * - `item`: The **current item state**, fully typed via `InferItem<T>`.
 * - `close`: Close the form (e.g., dismiss a dialog/sheet).
 * - `onSubmit`: Persist changes. The payload shape is enforced by the API contract
 *               (`Payload.Contents.UpdateItem`) to keep back–front alignment strict.
 */
export type FormItemComponent<T extends ExportedItem> = React.FC<{
  item: InferItem<T>
  close: () => void
  onSubmit: (payload: Payload.Contents.UpdateItem) => Promise<void>
}>

/**
 * ThumbnailItemComponent<T>
 * -------------------------
 * Compact visual used in pickers/galleries to represent the item.
 * No props by design — it should be a **pure visual token** for selection UIs.
 */
export type ThumbnailItemComponent<T extends ExportedItem> = React.FC

/**
 * InferItem<E>
 * ------------
 * The **master assembler** that rebuilds the concrete item shape from the manifest `E`.
 *
 * It produces:
 * - `type`: from `E["type"]` (stable identifier).
 * - `props`: from `E["props"]` (precise item-specific props).
 * - All **base fields** from `Api.ContentItem`, except we exclude those we override here:
 *   - `"type" | "props" | "translations"` are omitted to avoid conflicts/duplication.
 * - `Api.Translatable<...>`: translatable fields keyed by the **runtime translation object**.
 *   We intersect the inferred translation value shape with `{ languageId: string }` so that
 *   the item instance carries the **current language context** alongside its translated fields.
 *
 * Why this looks scary (but is safe):
 * - `ExportedItem` keeps the manifest generic to avoid polluting all items with each other's props.
 * - `InferItem` rehydrates the **precise** item shape where it matters (render & form).
 * - The API types (`Api.ContentItem`, `Api.Translatable`) anchor us to the backend contract.
 */
export type InferItem<E extends ExportedItem> = {
  type: E["type"]
  props: E["props"]
  translations: { languageId: string; props: E["translations"]["fr"] }[]
} & Omit<Api.ContentItem, "type" | "props" | "translations">

/* -----------------------------------------------------------------------------
 * Example (for integrators)
 * -----------------------------------------------------------------------------
 *
 * // 1) Define your manifest (ExportedItem)
 * const exported = {
 *   type: "headings.image",
 *   props: { src: "", alt: "", width: 0, height: 0 },
 *   translations: {
 *     fr: { caption: "" },
 *     de: { caption: "" },
 *   },
 *   dictionary: {
 *     caption: "Caption",
 *   },
 * } satisfies ExportedItem;
 *
 * // 2) Infer the concrete item shape used by Render/Form
 * type Item = InferItem<typeof exported>;
 *
 * // 3) Implement Render
 * const Render: RenderSyncComponent<typeof exported> = ({ item }) => {
 *   // item.props.src, item.props.alt, item.languageId, etc.
 *   return <img src={String(item.props.src)} alt={String(item.props.alt)} />;
 * };
 *
 * // 4) Implement Form factory
 * const createForm: CreateItemForm<typeof exported> = (exp) => ({ item, close, onSubmit }) => {
 *   // use `exp.dictionary` for labels; call `onSubmit(payload)` when saving
 *   return <form>{/* ... * /}</form>;
 * };
 *
 * // 5) Implement Thumbnail
 * const Thumbnail: ThumbnailItemComponent<typeof exported> = () => <div>🖼️</div>;
 *
 * // 6) Wire into the registry
 * export const item: ItemSync<typeof exported> = {
 *   export: exported,
 *   createForm,
 *   Render,
 *   Thumbnail,
 * };
 */
