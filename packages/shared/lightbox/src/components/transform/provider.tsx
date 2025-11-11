import React from "react"
import { useControls } from "react-zoom-pan-pinch"
import { TransformControlsContext, useTransformContext } from "./context"
import { useAutoCenterOnZoomOut, useDisableOnScale, useResetTransformOnInactive, useSteps } from "./hooks"

/**
 * provider for the transform controls
 */
export const TransformControlsProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const ctx = useTransformContext()
  const { centerView } = useControls()
  const steps = useSteps({ steps: ctx.steps })
  const value = React.useMemo(() => ({ ...ctx, ...steps, centerView }), [ctx, steps, centerView])
  useAutoCenterOnZoomOut()
  useResetTransformOnInactive(ctx.isActive)
  useDisableOnScale(ctx.transformThreshold, ctx.disableTransforms, ctx.setDisableTransforms)
  return <TransformControlsContext.Provider value={value}>{children}</TransformControlsContext.Provider>
}
