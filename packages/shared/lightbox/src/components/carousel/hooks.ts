import type { EmblaOptionsType } from "embla-carousel"
import useEmblaCarouselReact from "embla-carousel-react"
import React from "react"
import type { RegisteredFile } from "../../types"

/**
 * preload adjacent slides
 */
export const usePreloadAdjacentSlides = (
  slideIndex: number,
  slides: RegisteredFile[],
  makeUrl: (path: string) => string,
  preloadAdjacent: boolean
) => {
  React.useEffect(() => {
    if (!preloadAdjacent) return

    const preloadImage = (file: RegisteredFile) => {
      if (file.type === "image") {
        const img = new Image()
        img.src = makeUrl(file.path)
      }
    }

    const prevIndex = slideIndex - 1
    const nextIndex = slideIndex + 1

    if (prevIndex >= 0) preloadImage(slides[prevIndex])
    if (nextIndex < slides.length) preloadImage(slides[nextIndex])
  }, [slideIndex, slides, preloadAdjacent, makeUrl])
}

/**
 * make an embla carousel and blind state to the carousel
 */
export type EmblaOptions = Omit<EmblaOptionsType, "axis" | "plugins"> & {
  orientation?: "horizontal" | "vertical"
  plugins?: EmblaPluginType[]
}
const optionsDefault: EmblaOptions = {
  orientation: "horizontal",
  plugins: [],
}
export const useEmblaCarousel = (
  slideIndex: number,
  onSlideChange: (index: number) => void,
  options: EmblaOptions = optionsDefault
) => {
  const { orientation = optionsDefault.orientation, plugins = optionsDefault.plugins, ...restOptions } = options

  // prepare options for embla carousel
  const emblaOptions: EmblaOptionsType = {
    ...restOptions,
    axis: orientation === "horizontal" ? "x" : "y",
    startIndex: slideIndex,
  }

  // initialize embla carousel
  const [carouselRef, api] = useEmblaCarouselReact(emblaOptions, plugins)

  // state
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)
  const [slideCount, setSlideCount] = React.useState(0)

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) return
    onSlideChange(api.selectedScrollSnap())
    setSlideCount(api.scrollSnapList().length)
    setCanScrollPrev(api.canScrollPrev())
    setCanScrollNext(api.canScrollNext())
  }, [])

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev()
  }, [api])

  const scrollNext = React.useCallback(() => {
    api?.scrollNext()
  }, [api])

  const [interact, setInteract] = React.useState(false)

  React.useEffect(() => {
    if (!api) return

    // assign dragging listeners
    const onScrollStart = () => setInteract(true)
    const onScrollEnd = () => setInteract(false)
    api.on("scroll", onScrollStart)
    api.on("settle", onScrollEnd)

    // assign select listeners
    onSelect(api)
    api.on("reInit", onSelect)
    api.on("select", onSelect)
    return () => {
      // remove dragging listener
      api?.off("scroll", onScrollStart)
      api?.off("settle", onScrollEnd)

      // remove select listeners
      api?.off("select", onSelect)
    }
  }, [api, onSelect])

  return [
    carouselRef,
    {
      api,
      scrollPrev,
      canScrollPrev,
      scrollNext,
      canScrollNext,
      slideCount,
      interact,
      slideIndex,
      onSlideChange,
      options,
    },
  ] as const
}
export type EmblaCarousel = ReturnType<typeof useEmblaCarousel>[1]

/**
 * types
 */
type CarouselApi = ReturnType<typeof useEmblaCarouselReact>[1]
type EmblaPluginType = NonNullable<Parameters<typeof useEmblaCarouselReact>[1]>[number]
