/**
 * useLightbox Hook
 * Public API for interacting with the lightbox
 */

import { useLightboxContext } from "../components/lightbox.context"
import type { RegisteredFile } from "../types"

/**
 * Return type for useLightbox hook
 */
export interface UseLightboxReturn {
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

  // Navigation
  goToNext: () => void
  goToPrev: () => void
  goToIndex: (index: number) => void
  close: () => void
}

/**
 * Hook to interact with the lightbox
 * Provides the public API for managing files and controlling the lightbox
 */
export function useLightbox(): UseLightboxReturn {
  const context = useLightboxContext()

  return {
    // File registry
    registerFile: context.registerFile,
    unregisterFile: context.unregisterFile,

    // Preview control
    displayPreview: context.displayPreview,
    hasPreview: context.hasPreview,

    // State
    isOpen: context.isOpen,
    currentFile: context.currentFile,
    currentIndex: context.currentIndex,
    totalFiles: context.totalFiles,
    files: context.files,

    // Navigation
    goToNext: context.goToNext,
    goToPrev: context.goToPrev,
    goToIndex: context.goToIndex,
    close: context.close,
  }
}
