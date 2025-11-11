import { cn } from "@compo/utils"
import * as React from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { CarouselContext } from "./context"
import { useEmblaCarousel, type EmblaOptions } from "./hooks"
export { default as Autoplay } from "embla-carousel-autoplay"

/**
 * types
 */

/**
 * CarouselRoot
 */
export type CarouselProviderProps = {
  options?: EmblaOptions
  slideIndex: number
  onSlideChange: (index: number) => void
} & React.ComponentProps<"div">
export const CarouselProvider: React.FC<CarouselProviderProps> = (props) => {
  const { options, slideIndex, onSlideChange, className, children, ...divProps } = props
  const [carouselRef, embla] = useEmblaCarousel(slideIndex, onSlideChange, options)

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        embla.scrollPrev()
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        embla.scrollNext()
      }
    },
    [embla.scrollPrev, embla.scrollNext]
  )

  useHotkeys("ArrowRight", () => embla.scrollNext(), {
    preventDefault: true,
    enabled: true,
    enableOnFormTags: false,
    enableOnContentEditable: false,
  })

  useHotkeys("ArrowLeft", () => embla.scrollPrev(), {
    preventDefault: true,
    enabled: true,
    enableOnFormTags: false,
    enableOnContentEditable: false,
  })

  return (
    <CarouselContext.Provider value={embla}>
      <div
        ref={carouselRef}
        onKeyDownCapture={handleKeyDown}
        className={cn("relative size-full", className)}
        role='region'
        aria-roledescription='carousel'
        data-slot='carousel-root'
        {...divProps}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  )
}
