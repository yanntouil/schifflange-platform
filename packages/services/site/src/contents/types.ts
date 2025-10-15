import { MediaFile } from "../medias/types"
import { Slug, SlugResource } from "../slugs/types"

/**
 * content
 */
export type Content = {
  items: ContentItem[]
}
export type ContentItem = {
  id: string
  order: number
  type: string // base on type
  props: Record<string, unknown> // base on type
  translations: Record<string, unknown> // base on type
  slugs: (Slug & SlugResource)[]
  files: MediaFile[]
}
export type WithContent = {
  content: Content
}
