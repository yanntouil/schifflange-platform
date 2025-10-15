import React from "react"
import { MediasFolderContext } from "./folder.context"

/**
 * MediasServiceProvider
 */
type MediasFolderProviderProps = {
  initialFolderId?: string | null
  controlled?: {
    folderId: string | null
    setFolderId: (folderId: string | null) => void
  } | null
  children: React.ReactNode
}
export const MediasFolderProvider: React.FC<MediasFolderProviderProps> = ({ initialFolderId = null, controlled = null, children }) => {
  const [uncontrolledFolderId, setUncontrolledFolderId] = React.useState<string | null>(initialFolderId)
  const [folderId, setFolderId] = controlled
    ? [controlled.folderId, controlled.setFolderId]
    : ([uncontrolledFolderId, setUncontrolledFolderId] as const)

  return <MediasFolderContext.Provider value={{ folderId, setFolderId }}>{children}</MediasFolderContext.Provider>
}
