import useEmblaCarousel from "embla-carousel-react"
import React from "react"
import { CarouselRootProps } from "./components"

/**
 * types
 */
type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
  interact: boolean
  slideIndex: number
  slideCount: number
} & CarouselRootProps

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
