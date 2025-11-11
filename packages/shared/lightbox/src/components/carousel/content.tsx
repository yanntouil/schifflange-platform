import React from "react"
import type { RegisteredFile } from "../../types"
import { useCarousel } from "./context"
import { usePreloadAdjacentSlides } from "./hooks"
import { CarouselSlide } from "./slide"

/**
 * CarouselContent
 */
type CarouselContentProps = {
  slides: RegisteredFile[]
  makeUrl: (path: string) => string
  disableTransforms: boolean
  preloadAdjacent: boolean
}
const CarouselContent: React.FC<CarouselContentProps> = ({ slides, makeUrl, disableTransforms, preloadAdjacent }) => {
  const { slideIndex } = useCarousel()
  usePreloadAdjacentSlides(slideIndex, slides, makeUrl, preloadAdjacent)

  return (
    <div className='flex h-full' data-slot='carousel-content'>
      {slides.map((file, index) => (
        <CarouselSlide key={file.id} file={file} currentIndex={slideIndex} total={slides.length} index={index} />
      ))}
    </div>
  )
}

CarouselContent.displayName = "CarouselContent"

export { CarouselContent }
