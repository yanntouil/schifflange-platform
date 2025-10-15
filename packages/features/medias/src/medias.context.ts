import { Selectable } from "@compo/hooks"
import { type Option } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { ManageFile, ManageFolder, ManageSelection } from "./medias.context.actions"
import { SWRMedias } from "./swr"

/**
 * types
 */
export type MediasContextType = Selectable<Api.MediaWithRelations> & {
  contextId: string
  swr: SWRMedias
  folder: Option<Api.MediaFolderWithRelations>
  // authorization
  canSelectFolder?: boolean
  canSelectFile?: boolean
  // folder actions
} & ManageFolder &
  ManageFile &
  ManageSelection

/**
 * contexts
 */
export const MediasContext = React.createContext<MediasContextType | null>(null)

/**
 * hooks
 */
export const useMedias = () => {
  const context = React.useContext(MediasContext)
  if (!context) throw new Error("useMedias must be used within a MediasProvider")
  return context
}
