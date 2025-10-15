import { type Api } from "@services/dashboard"
import React from "react"
import { ManageItems } from "./context.actions"
import { ExportedItem, ItemSync } from "./types.sync"

/**
 * types
 */
export type ContentContextType = {
  makePreviewItemUrl: (item: Api.ContentItem, locale: string) => string
  contextId: string
  persistedId: string
  service: Api.ContentService
  swr: ContentMutationsHelpers
  content: Api.Content
  disabledTemplates: boolean
  // list of available items in provider
  items: ContentItems
} & ManageItems

/**
 * MutationsHelpers
 */
export type ContentMutationsHelpers = {
  updateItem: (item: Api.ContentItem) => void
  appendItem: (item: Api.ContentItem, sortedIds?: string[]) => void
  rejectItem: (item: Api.ContentItem, sortedIds?: string[]) => void
  reorderItems: (sortedIds: string[]) => void
}

// Type pour la structure des items organisés par catégorie
export type ContentItems = {
  [category: string]: {
    [itemType: string]: ItemSync<ExportedItem>
  }
}

/**
 * contexts
 */
export const ContentContext = React.createContext<ContentContextType | null>(null)

/**
 * hooks
 */
export const useContent = () => {
  const context = React.useContext(ContentContext)
  if (!context) throw new Error("useContent must be used within a ContentProvider")
  return context
}
