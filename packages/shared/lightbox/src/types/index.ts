/**
 * Lightbox Types
 * Type definitions for the lightbox library
 */

import type { ComponentType } from "react"

/** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
 * Base File Interface
 */

/**
 * Base interface for all file types
 */
export interface FileBase {
  /** Unique identifier for the file */
  id: string
  /** Path to the file (relative or absolute) */
  path: string
  /** Title for accessibility and display */
  title: string
  /** Custom download URL if different from path */
  downloadUrl?: string
  /** Custom filename for download */
  downloadFilename?: string
}

/** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
 * Specific File Types
 */

/**
 * Image file with dimensions
 */
export interface ImageFile extends FileBase {
  type: "image"
  /** Image width in pixels */
  width: number
  /** Image height in pixels */
  height: number
  /** Optional preview/thumbnail path for progressive loading */
  previewPath?: string
}

/**
 * Video file with MIME type
 */
export interface VideoFile extends FileBase {
  type: "video"
  /** MIME type (e.g., 'video/mp4', 'video/webm') */
  videoType: string
  /** Optional thumbnail path */
  thumbnailPath?: string
}

/**
 * PDF document file
 */
export interface PDFFile extends FileBase {
  type: "pdf"
  /** Optional thumbnail path */
  thumbnailPath?: string
}

/** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
 * Union Types
 */

/**
 * Union of all registered file types
 * Extend this union to add new file types
 */
export type RegisteredFile = ImageFile | VideoFile | PDFFile

/**
 * Extract all file type strings
 */
export type FileType = RegisteredFile["type"]

/** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
 * Renderer Props
 */

/**
 * Props for slide renderers
 * Generic type ensures type safety based on file type
 */
export type SlideRendererProps<T extends RegisteredFile> = {
  /** The file to render */
  file: T
  /** Function to generate preview URLs */
  makePreviewUrl: (path: string) => string
  /** Function to generate full URLs */
  makeUrl: (path: string) => string
  /** Whether this slide is currently active */
  isActive: boolean
}

/**
 * Props for thumbnail renderers
 * Generic type ensures type safety based on file type
 */
export type ThumbnailRendererProps<T extends RegisteredFile> = {
  /** The file to render */
  file: T
  /** Function to generate preview URLs */
  makePreviewUrl: (path: string) => string
  /** Function to generate full URLs */
  makeUrl: (path: string) => string
  /** Whether this thumbnail is currently active */
  isActive: boolean
  /** Click handler for thumbnail */
  onClick: () => void
}

/** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
 * Renderer Maps
 */

/**
 * Map of slide renderers for each file type
 * Keys are automatically inferred from RegisteredFile types
 */
export type SlideRenderers = {
  [K in RegisteredFile["type"]]: ComponentType<SlideRendererProps<Extract<RegisteredFile, { type: K }>>>
}

/**
 * Map of thumbnail renderers for each file type
 * Keys are automatically inferred from RegisteredFile types
 */
export type ThumbnailRenderers = {
  [K in RegisteredFile["type"]]: ComponentType<ThumbnailRendererProps<Extract<RegisteredFile, { type: K }>>>
}

/** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
 * Menu Component
 */

/**
 * Props for the menu component
 */
export type MenuComponentProps = {
  /** Current file being displayed */
  file: RegisteredFile
  /** Current slide index (0-based) */
  currentIndex: number
  /** Total number of files */
  totalFiles: number
  /** Close the lightbox */
  onClose: () => void
  /** Navigate to next slide */
  onNext: () => void
  /** Navigate to previous slide */
  onPrev: () => void
  /** Download current file */
  onDownload: () => void
  /** Toggle fullscreen mode */
  toggleFullscreen?: () => void
  /** Whether fullscreen is supported */
  fullscreenIsEnabled?: boolean
}

/** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
 * Options
 */

/**
 * Lightbox configuration options
 */
export type LightboxOptions = {
  /** Threshold for disabling transforms (default: 1.1) */
  transformThreshold?: number
  /** Allow closing lightbox by clicking outside (default: true) */
  closeOnClickOutside?: boolean
  /** Enable zoom functionality for images (default: true) */
  enableZoom?: boolean
  /** Show thumbnail strip (default: true) */
  enableThumbnails?: boolean
  /** Enable carousel loop (default: true) */
  loop?: boolean
  /** Show slide counter (e.g., "3 / 12") (default: true) */
  showCounter?: boolean
  /** Preload adjacent slides for better UX (default: true) */
  preloadAdjacent?: boolean
  /** trap focus inside the carousel (default: true) */
  trapFocus?: boolean
}
