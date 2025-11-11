import React from "react"
import { EmblaCarousel } from "./hooks"

/**
 * types
 */
type CarouselContextProps = EmblaCarousel

/**
 * contexts
 */
export const CarouselContext = React.createContext<CarouselContextProps | null>(null)

/**
 * hooks
 */
export const useCarousel = () => {
  const context = React.useContext(CarouselContext)
  if (!context) throw new Error("useCarousel must be used within a <Carousel.Root />")
  return context
}
