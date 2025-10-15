/**
 * 🧭 Next.js Item Contracts — Async (Server) side
 *
 * This file defines the **async/SSR contracts** used by items rendered in the
 * Next.js App Router (Server Components). It mirrors the client contracts but
 * adds server-only bits like `files`, `locale`, `path`, and `searchParams`.
 *
 * Design goals
 * - Keep the manifest (`ExportedItem`) as the single source of truth.
 * - Reconstruct the concrete item shape from the manifest via inference.
 * - Be explicit about what the renderer receives on the server.
 */

import { type LocalizeLanguage } from "@compo/localize"
import { type Api } from "@services/site"
import React from "react"
import { ExportedItem } from "./types.sync"

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
export type InferItemAsync<E extends ExportedItem> = {
  files: Api.MediaFile[]
  type: E["type"]
  props: E["props"]
  translations: E["translations"]["fr"]
} & Omit<Api.ContentItem, "files" | "category" | "type" | "props" | "translations">

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
export type RenderAsyncProps<T extends ExportedItem> = {
  item: InferItemAsync<T>
  locale: LocalizeLanguage
  path: string
  searchParams: Promise<unknown>
}

/**
 * RenderAsyncComponent<T>
 * -----------------------
 * Server renderer signature for Next.js. Designed for **Server Components**.
 *
 * The component can be `async` and return a `Promise<React.ReactNode>`,
 * which plays nicely with streaming and data fetching on the server.
 */
export type RenderAsyncComponent<T extends ExportedItem> = (
  props: RenderAsyncProps<T>
) => React.ReactNode | Promise<React.ReactNode>

/* -----------------------------------------------------------------------------
 * Example (for integrators)
 * -----------------------------------------------------------------------------
 *
 * import { type ItemAsync } from "./types.async";
 * import { type ExportedItem } from "./types.sync";
 *
 * const exported = {
 *   type: "headings.image",
 *   props: { src: "", alt: "", width: 0, height: 0 },
 *   translations: {
 *     fr: { caption: "" },
 *     de: { caption: "" },
 *   },
 *   dictionary: { caption: "Caption" },
 * } satisfies ExportedItem;
 *
 * const Render: RenderAsyncComponent<typeof exported> = async ({ item, locale, path, searchParams }) => {
 *   // await something if you need query values:
 *   const qs = await searchParams;
 *   // Render with item.props / item.files / item.translations (for the active locale)
 *   return <figure><img src={String(item.props.src)} alt={String(item.props.alt)} /></figure>;
 * };
 *
 * export const item: ItemAsync<typeof exported> = {
 *   export: exported,
 *   Render,
 * };
 */
