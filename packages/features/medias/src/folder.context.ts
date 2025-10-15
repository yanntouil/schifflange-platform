import React from "react"

/**
 * types
 */
export type MediasFolderContextType = {
  folderId: string | null
  setFolderId: (folderId: string | null) => void
}

/**
 * contexts
 */
export const MediasFolderContext = React.createContext<MediasFolderContextType | null>(null)

/**
 * hooks
 */
export const useMediasFolder = () => {
  const context = React.useContext(MediasFolderContext)
  if (!context) {
    throw new Error("useMediasFolder must be used within a MediasFolderProvider")
  }
  return context
}
