import React from "react"
import { useControls } from "react-zoom-pan-pinch"
import { useSteps } from "./hooks"

/**
 * types
 */
export type TransformContextValue = {
  minScale: number
  maxScale: number
  minimapScale?: number
  displayControls: boolean
  isActive: boolean

  transformThreshold: number
  disableTransforms: boolean
  setDisableTransforms: (disabled: boolean) => void

  steps?: number[]
}

export type TransformControlsContextValue = Omit<TransformContextValue, "steps"> &
  ReturnType<typeof useSteps> & {
    centerView: ReturnType<typeof useControls>["centerView"]
  }

/**
 * contexts
 */
export const TransformContext = React.createContext<null | TransformContextValue>(null)

export const TransformControlsContext = React.createContext<null | TransformControlsContextValue>(null)

/**
 * hooks
 */
export const useTransformContext = () => {
  const context = React.useContext(TransformContext)
  if (!context) throw new Error("useTransformContext must be used within a TransformProvider")
  return context
}

export const useTransformControls = () => {
  const context = React.useContext(TransformControlsContext)
  if (!context) throw new Error("useTransformControlsContext must be used within a TransformControlsProvider")
  return context
}
