import React from "react"
import type { RegisteredFile } from "../../types"

/**
 * type
 */
export type TransformProps = {
  isActive: boolean
  transformThreshold: number
  disableTransforms: boolean
  setDisableTransforms: (disabled: boolean) => void
}
export type SlideContextType = {
  transform: TransformProps
  isActive: boolean
  index: number
  total: number
  file: RegisteredFile
  makePreviewUrl: (path: string) => string
  makeUrl: (path: string) => string
}

/**
 * context
 */
export const SlideContext = React.createContext<SlideContextType | null>(null)

/**
 * hooks
 */
export const useSlide = () => {
  const context = React.useContext(SlideContext)

  if (!context) {
    throw new Error("useSlideContext must be used within a SlideContext")
  }

  return context
}
