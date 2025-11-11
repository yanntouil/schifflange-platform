/**
 * Lightbox Context
 * Manages the global state for the lightbox
 */

import type { ComponentType } from "react"
import React from "react"
import type { LightboxOptions, MenuComponentProps, RegisteredFile, SlideRenderers, ThumbnailRenderers } from "../types"

/**
 * types
 */

export type LightboxContextValue = {
  // File registry
  registerFile: (file: RegisteredFile) => void
  unregisterFile: (id: string) => void

  // Preview control
  displayPreview: (id: string) => void
  hasPreview: (id: string) => boolean

  // State
  isOpen: boolean
  currentFile: RegisteredFile | null
  currentIndex: number
  totalFiles: number
  files: RegisteredFile[]
  disableTransforms: boolean
  setDisableTransforms: (disable: boolean) => void

  // Navigation
  goToNext: () => void
  goToPrev: () => void
  goToIndex: (index: number) => void
  close: () => void

  // Configuration
  makePreviewUrl: (path: string) => string
  makeUrl: (path: string) => string
  onDownload?: (file: RegisteredFile) => void
  slideRenderers: SlideRenderers
  thumbnailRenderers: ThumbnailRenderers
  menuComponent?: ComponentType<MenuComponentProps>
  options: Required<LightboxOptions>
}

/**
 * context
 */
export const LightboxContext = React.createContext<LightboxContextValue | null>(null)

/**
 * hooks
 */
export const useLightboxContext = () => {
  const context = React.useContext(LightboxContext)

  if (!context) {
    throw new Error("useLightboxContext must be used within a LightboxProvider")
  }
  return context
}
