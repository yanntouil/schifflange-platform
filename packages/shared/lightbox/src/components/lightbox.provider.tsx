/**
 * LightboxProvider
 * Main provider component that manages lightbox state and configuration
 */

import React from "react"
import { DEFAULT_OPTIONS, DEFAULT_SLIDE_RENDERERS, DEFAULT_THUMBNAIL_RENDERERS } from "../constants"
import type { LightboxOptions, MenuComponentProps, RegisteredFile, SlideRenderers, ThumbnailRenderers } from "../types"
import { LightboxContext } from "./lightbox.context"
import { LightboxDialog } from "./lightbox.dialog"

// Import default renderers
import { Size } from "@compo/utils"

// ============================================================================
// Props
// ============================================================================

export interface LightboxProviderProps {
  /** React children */
  children: React.ReactNode

  // URL makers
  /** Function to generate full URLs (required) */
  makeUrl: (path: string) => string
  /** Function to generate preview URLs (optional, defaults to makeUrl) */
  makePreviewUrl?: (path: string) => string

  // Callbacks
  /** Custom download handler */
  onDownload?: (file: RegisteredFile) => void

  // Renderers (optional, with defaults)
  /** Custom slide renderers */
  slideRenderers?: Partial<SlideRenderers>
  /** Custom thumbnail renderers */
  thumbnailRenderers?: Partial<ThumbnailRenderers>

  // Menu component (optional)
  /** Custom menu component */
  menuComponent?: React.ComponentType<MenuComponentProps>

  // Options
  /** Lightbox configuration options */
  options?: LightboxOptions
}

// ============================================================================
// Provider Component
// ============================================================================

/**
 * Lightbox provider component
 * Wraps your app or a specific section to enable lightbox functionality
 */
export const LightboxProvider: React.FC<LightboxProviderProps> = ({
  children,
  makePreviewUrl: customMakePreviewUrl,
  makeUrl,
  onDownload,
  slideRenderers: customSlideRenderers,
  thumbnailRenderers: customThumbnailRenderers,
  menuComponent,
  options: userOptions,
}) => {
  // ========================================================================
  // State
  // ========================================================================

  const [fileRegistry] = React.useState(() => new Map<string, RegisteredFile>())
  const [files, setFiles] = React.useState<RegisteredFile[]>([])
  const [isOpen, setIsOpen] = React.useState(false)
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [disableTransforms, setDisableTransforms] = React.useState(false)
  const [containerSize, setContainerSize] = React.useState<Size>({ width: 0, height: 0 })

  /**
   * Computed Values
   */

  // Use makeUrl as default for makePreviewUrl if not provided
  const makePreviewUrl = customMakePreviewUrl || makeUrl

  const options = React.useMemo(() => ({ ...DEFAULT_OPTIONS, ...userOptions }), [userOptions])

  const slideRenderers = React.useMemo(
    () => ({ ...DEFAULT_SLIDE_RENDERERS, ...customSlideRenderers }),
    [customSlideRenderers]
  )

  const thumbnailRenderers = React.useMemo(
    () => ({ ...DEFAULT_THUMBNAIL_RENDERERS, ...customThumbnailRenderers }),
    [customThumbnailRenderers]
  )

  const currentFile = files[currentIndex] || null
  const totalFiles = files.length

  /**
   * File Registry Methods
   */

  const registerFile = React.useCallback(
    (file: RegisteredFile) => {
      fileRegistry.set(file.id, file)
      setFiles(Array.from(fileRegistry.values()))
    },
    [fileRegistry]
  )

  const unregisterFile = React.useCallback(
    (id: string) => {
      fileRegistry.delete(id)
      setFiles(Array.from(fileRegistry.values()))
    },
    [fileRegistry]
  )

  /**
   * Preview Control
   */

  const displayPreview = React.useCallback(
    (id: string) => {
      const file = fileRegistry.get(id)
      if (!file) {
        console.warn(`File with id "${id}" not found in registry`)
        return
      }

      const filesArray = Array.from(fileRegistry.values())
      const index = filesArray.findIndex((f) => f.id === id)

      if (index === -1) {
        console.warn(`File with id "${id}" not found in files array`)
        return
      }

      setCurrentIndex(index)
      setIsOpen(true)
    },
    [fileRegistry]
  )

  const hasPreview = React.useCallback((id: string) => fileRegistry.has(id), [fileRegistry])

  /**
   * Navigation
   */

  const goToNext = React.useCallback(() => {
    if (totalFiles === 0) return

    if (options.loop) {
      setCurrentIndex((prev) => (prev + 1) % totalFiles)
    } else {
      setCurrentIndex((prev) => Math.min(prev + 1, totalFiles - 1))
    }
  }, [totalFiles, options.loop])

  const goToPrev = React.useCallback(() => {
    if (totalFiles === 0) return

    if (options.loop) {
      setCurrentIndex((prev) => (prev - 1 + totalFiles) % totalFiles)
    } else {
      setCurrentIndex((prev) => Math.max(prev - 1, 0))
    }
  }, [totalFiles, options.loop])

  const goToIndex = React.useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  const close = React.useCallback(() => {
    setIsOpen(false)
  }, [])

  /**
   * Context Value
   */

  const contextValue = React.useMemo(
    () => ({
      // File registry
      registerFile,
      unregisterFile,

      // Preview control
      displayPreview,
      hasPreview,

      // State
      isOpen,
      currentFile,
      currentIndex,
      totalFiles,
      files,
      disableTransforms,
      setDisableTransforms,
      containerSize,
      setContainerSize,
      // Navigation
      goToNext,
      goToPrev,
      goToIndex,
      close,

      // Configuration
      makePreviewUrl,
      makeUrl,
      onDownload,
      slideRenderers,
      thumbnailRenderers,
      menuComponent,
      options,
    }),
    [
      registerFile,
      unregisterFile,
      displayPreview,
      hasPreview,
      isOpen,
      currentFile,
      currentIndex,
      totalFiles,
      files,
      disableTransforms,
      setDisableTransforms,
      containerSize,
      setContainerSize,
      goToNext,
      goToPrev,
      goToIndex,
      close,
      makePreviewUrl,
      makeUrl,
      onDownload,
      slideRenderers,
      thumbnailRenderers,
      menuComponent,
      options,
    ]
  )

  return (
    <LightboxContext.Provider value={contextValue}>
      {children}
      <LightboxDialog />
    </LightboxContext.Provider>
  )
}
