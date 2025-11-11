/**
 * Carousel
 * Main carousel component using Embla Carousel
 */

import React from "react"
import type { RegisteredFile } from "../../types"
import { CarouselContent } from "./content"
import { CarouselControls } from "./controls"
import { CarouselProvider } from "./provider"

interface CarouselProps {
  slides: RegisteredFile[]
  slideIndex: number
  onSlideChange: (index: number) => void
  loop: boolean
  makeUrl: (path: string) => string
  disableTransforms: boolean
  preloadAdjacent: boolean
}

/**
 * Carousel component with keyboard navigation and swipe support
 */
export const Carousel: React.FC<CarouselProps> = (props) => {
  const { slides, slideIndex, onSlideChange, loop, makeUrl, disableTransforms, preloadAdjacent } = props

  return (
    <CarouselProvider
      slideIndex={slideIndex}
      onSlideChange={onSlideChange}
      options={{ watchDrag: disableTransforms, duration: 25, loop }}
    >
      <CarouselContent
        slides={slides}
        makeUrl={makeUrl}
        disableTransforms={disableTransforms}
        preloadAdjacent={preloadAdjacent}
      />
      <CarouselControls />
    </CarouselProvider>
  )
}

Carousel.displayName = "Carousel"

/* 
todo: remove this later
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop,
    startIndex: currentIndex,
    duration: 25,
    watchDrag: disableTransforms,
  })

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't navigate if drag is disabled (image is zoomed)
      if (disableTransforms) return

      if (e.key === "ArrowLeft") {
        e.preventDefault()
        emblaApi?.scrollPrev()
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        emblaApi?.scrollNext()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [emblaApi, disableTransforms])

  // Sync external index changes with Embla
  React.useEffect(() => {
    if (emblaApi && emblaApi.selectedScrollSnap() !== currentIndex) {
      emblaApi.scrollTo(currentIndex, true)
    }
  }, [emblaApi, currentIndex])

  // Handle slide selection changes
  const handleSelect = React.useCallback(() => {
    if (!emblaApi) return
    const index = emblaApi.selectedScrollSnap()
    if (index !== currentIndex) {
      onSlideChange(index)
    }
  }, [emblaApi, currentIndex, onSlideChange])

  React.useEffect(() => {
    if (!emblaApi) return
    emblaApi.on("select", handleSelect)
    return () => {
      emblaApi.off("select", handleSelect)
    }
  }, [emblaApi, handleSelect])
*/
