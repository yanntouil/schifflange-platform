import React from "react"
import type { RegisteredFile } from "../../types"
import { useCarousel } from "./context"
import { usePreloadAdjacentSlides } from "./hooks"

/**
 * CarouselContent
 */
type CarouselContentProps = {
  slides: RegisteredFile[]
  makeUrl: (path: string) => string
  disableTransforms: boolean
  preloadAdjacent: boolean
  children: React.ReactNode
}
const CarouselContent: React.FC<CarouselContentProps> = ({
  slides,
  makeUrl,
  disableTransforms,
  preloadAdjacent,
  children,
}) => {
  const { slideIndex } = useCarousel()
  usePreloadAdjacentSlides(slideIndex, slides, makeUrl, preloadAdjacent)

  return (
    <div className='flex h-full' data-slot='carousel-content'>
      {children}
    </div>
  )
}

CarouselContent.displayName = "CarouselContent"

export { CarouselContent }
