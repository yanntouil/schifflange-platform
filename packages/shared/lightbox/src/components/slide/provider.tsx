import React from "react"
import { useLightboxContext } from "../lightbox.context"
import { SlideContext, SlideContextType } from "./context"

/**
 * provider
 */
export const SlideProvider: React.FC<Omit<SlideContextType, "transform"> & { children: React.ReactNode }> = ({
  children,
  ...props
}) => {
  const { options, disableTransforms, setDisableTransforms } = useLightboxContext()
  const transform = {
    isActive: props.isActive,
    transformThreshold: options.transformThreshold,
    disableTransforms,
    setDisableTransforms,
  }
  return <SlideContext.Provider value={{ ...props, transform }}>{children}</SlideContext.Provider>
}
