import { Selectable } from "@compo/hooks"
import { type Api } from "@services/dashboard"
import React from "react"
import { SWRTags } from "./swr"
import { ManageTag } from "./tags.context.actions"

/**
 * types
 */
export type TagsContextType = Selectable<Api.ProjectTag> & {
  contextId: string
  swr: SWRTags
} & ManageTag

/**
 * contexts
 */
export const TagsContext = React.createContext<TagsContextType | null>(null)

/**
 * hooks
 */
export const useTags = () => {
  const context = React.useContext(TagsContext)
  if (!context) throw new Error("useTags must be used within a TagsProvider")
  return context
}
