import { useTranslation } from "@compo/localize"
import { cxm } from "@compo/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import React from "react"
import { buttonCx } from "../variants"
import { useCarousel } from "./context"

/**
 * Carousel control component
 */
const CarouselControls: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { scrollPrev, canScrollPrev, scrollNext, canScrollNext } = useCarousel()
  return (
    <>
      <button
        type='button'
        className={cxm(buttonCx, "size-10 rounded-full absolute left-5 top-1/2 z-20 -translate-y-1/2")}
        onClick={scrollPrev}
        disabled={!canScrollPrev}
      >
        <ChevronLeft aria-hidden className='!size-8 stroke-1' />
        <span className='sr-only'>{_("previous-slide")}</span>
      </button>
      <button
        type='button'
        className={cxm(buttonCx, "size-10 rounded-full absolute right-5 top-1/2 z-20 -translate-y-1/2")}
        onClick={scrollNext}
        disabled={!canScrollNext}
      >
        <ChevronRight aria-hidden className='!size-8 stroke-1' />
        <span className='sr-only'>{_("next-slide")}</span>
      </button>
    </>
  )
}
CarouselControls.displayName = "CarouselControls"
export { CarouselControls }

/**
 * translations
 */
const dictionary = {
  fr: {
    "previous-slide": "slide précédent",
    "next-slide": "slide suivant",
  },
  en: {
    "previous-slide": "previous slide",
    "next-slide": "next slide",
  },
  de: {
    "previous-slide": "vorheriger Slide",
    "next-slide": "nächster Slide",
  },
}
