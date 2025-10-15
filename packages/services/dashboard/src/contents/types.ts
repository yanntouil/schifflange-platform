import { contents } from "."
import { MediaFile, Slug, Translatable, User, WithModel } from "../types"

export type Content = {
  id: string
  workspaceId: string
  createdAt: string
  updatedAt: string
  items: ContentItem[]
}

export type ContentItem = {
  id: string
  contentId: string
  state: ContentItemState
  order: number
  files: MediaFile[]
  slugs: (Slug & WithModel)[]
  type: string
  props: Record<string, any> | null
  createdAt: string
  createdBy: User | null
  updatedAt: string
  updatedBy: User | null
} & Translatable<ContentItemTranslation>

export type ContentItemTranslation = {
  id: string
  languageId: string
  contentItemId: string
  language: string
  props: Record<string, any> | null
  createdAt: string
  updatedAt: string
}

export type ContentItemState = "draft" | "published"

export type WithContent = {
  content: Content
}

export type ContentService = ReturnType<typeof contents>
/*
// packages/site-a/client.ts
import * as cards from "./cards/client"
export const items = {
  cards,
}
// packages/site-a/client.ts
import * as cards from "./cards/ssr"
export const items = {
  cards,
}
*/
