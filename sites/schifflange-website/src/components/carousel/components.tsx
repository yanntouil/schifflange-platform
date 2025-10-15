'use client'

import { useTranslation } from '@/lib/localize'
import { cn } from '@compo/utils'
import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import React from 'react'
import { CarouselContext, useCarousel } from './context'
export { default as Autoplay } from 'embla-carousel-autoplay'
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures'

/**
 * types
 */
export type CarouselApi = UseEmblaCarouselType[1]
export type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
export type CarouselOptions = UseCarouselParameters[0]
export type CarouselPlugin = NonNullable<UseCarouselParameters[1]>[number]

/**
 * CarouselRoot
 */
export type CarouselRootProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin[]
  orientation?: 'horizontal' | 'vertical'
  setApi?: (api: CarouselApi) => void
  slideIndex?: number
  onSlideIndexChange?: (index: number) => void
}

const CarouselRoot = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselRootProps
>(({ orientation = 'horizontal', opts, setApi, plugins, className, children, ...props }, ref) => {
  const [carouselRef, api] = useEmblaCarousel(
    {
      dragFree: true,
      ...opts,

      axis: orientation === 'horizontal' ? 'x' : 'y',
    },
    [...Array.from(plugins || []), WheelGesturesPlugin()]
  )
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)

  const [slideIndex, setSlideIndex] = React.useState(0)
  const [slideCount, setSlideCount] = React.useState(0)

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) return
    setSlideIndex(api.selectedScrollSnap())
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

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        scrollPrev()
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        scrollNext()
      }
    },
    [scrollPrev, scrollNext]
  )

  const [interact, setInteract] = React.useState(false)

  React.useEffect(() => {
    if (!api || !setApi) return
    setApi(api)
  }, [api, setApi])

  React.useEffect(() => {
    if (!api) return

    // assign dragging listeners
    const onScrollStart = () => setInteract(true)
    const onScrollEnd = () => setInteract(false)
    api.on('scroll', onScrollStart)
    api.on('settle', onScrollEnd)

    // assign select listeners
    onSelect(api)
    api.on('reInit', onSelect)
    api.on('select', onSelect)
    return () => {
      // remove dragging listener
      api?.off('scroll', onScrollStart)
      api?.off('settle', onScrollEnd)

      // remove select listeners
      api?.off('select', onSelect)
    }
  }, [api, onSelect])

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api: api,
        opts,
        orientation: orientation || (opts?.axis === 'y' ? 'vertical' : 'horizontal'),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
        interact,
        slideIndex,
        slideCount,
      }}
    >
      <>
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn('relative', className)}
          role='region'
          aria-roledescription='carousel'
          {...props}
        >
          {children}
        </div>
      </>
    </CarouselContext.Provider>
  )
})
CarouselRoot.displayName = 'CarouselRoot'

/**
 * CarouselContent
 */
export type CarouselContentProps = React.HTMLAttributes<HTMLDivElement> & {
  overflow?: 'visible' | 'hidden'
  containerClassName?: string
}
const CarouselContent = React.forwardRef<HTMLDivElement, CarouselContentProps>(
  ({ className, overflow = 'hidden', containerClassName, ...props }, ref) => {
    const { carouselRef, orientation } = useCarousel()

    return (
      <div
        ref={carouselRef}
        className={cn(
          'select-none min-w-0',
          overflow !== 'visible' && 'overflow-hidden',
          containerClassName
        )}
      >
        <div
          ref={ref}
          className={cn(
            'flex',
            orientation === 'horizontal' ? '/ml-4' : '-mt-4 flex-col',
            className
          )}
          {...props}
        />
      </div>
    )
  }
)
CarouselContent.displayName = 'CarouselContent'

/**
 * CarouselItem
 */
export type CarouselItemProps = React.HTMLAttributes<HTMLDivElement>
const CarouselItem = React.forwardRef<HTMLDivElement, CarouselItemProps>(
  ({ className, ...props }, ref) => {
    const { orientation } = useCarousel()

    return (
      <div
        ref={ref}
        role='group'
        aria-roledescription='slide'
        data-state='visible'
        className={cn(
          'min-w-0 shrink-0 grow-0 basis-full',
          orientation === 'horizontal' ? '-pl-4' : 'pt-4',
          className
        )}
        {...props}
      />
    )
  }
)
CarouselItem.displayName = 'CarouselItem'

/**
 * CarouselCurrent
 */
export type CarouselCurrentProps = React.ComponentProps<'span'>
const CarouselCurrent = React.forwardRef<HTMLSpanElement, CarouselCurrentProps>(
  ({ className, ...props }, ref) => {
    const { slideIndex } = useCarousel()
    return (
      <span ref={ref} className={cn(className)} {...props}>
        {slideIndex + 1}
      </span>
    )
  }
)
CarouselCurrent.displayName = 'CarouselCurrent'

/**
 * CarouselCount
 */
export type CarouselCountProps = React.ComponentProps<'span'>
const CarouselCount = React.forwardRef<HTMLSpanElement, CarouselCountProps>(
  ({ className, ...props }, ref) => {
    const { slideCount } = useCarousel()
    return (
      <span ref={ref} className={cn(className)} {...props}>
        {slideCount}
      </span>
    )
  }
)
CarouselCount.displayName = 'CarouselCount'

/**
 * CarouselPrevious
 */
export type CarouselPreviousProps = React.ComponentProps<'button'> & {
  floating?: boolean
}
const CarouselPrevious = React.forwardRef<HTMLButtonElement, CarouselPreviousProps>(
  ({ className, floating = false, ...props }, ref) => {
    const { _ } = useTranslation(dictionary)
    const { orientation, scrollPrev, canScrollPrev } = useCarousel()
    return (
      <button
        ref={ref}
        className={cn(
          floating &&
            (orientation === 'horizontal'
              ? 'absolute -left-12 top-1/2 -translate-y-1/2'
              : 'absolute -top-12 left-1/2 -translate-x-1/2 rotate-90'),
          className
        )}
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        {...props}
      >
        <ArrowLeft aria-hidden />
        <span className='sr-only'>{_('previous-slide')}</span>
      </button>
    )
  }
)
CarouselPrevious.displayName = 'CarouselPrevious'

/**
 * CarouselNext
 */
export type CarouselNextProps = React.ComponentProps<'button'> & {
  floating?: boolean
}
const CarouselNext = React.forwardRef<HTMLButtonElement, CarouselNextProps>(
  ({ className, floating = false, ...props }, ref) => {
    const { _ } = useTranslation(dictionary)
    const { orientation, scrollNext, canScrollNext } = useCarousel()

    return (
      <button
        ref={ref}
        className={cn(
          floating &&
            (orientation === 'horizontal'
              ? 'absolute -right-12 top-1/2 -translate-y-1/2'
              : 'absolute -bottom-12 left-1/2 -translate-x-1/2 rotate-90'),
          className
        )}
        disabled={!canScrollNext}
        onClick={scrollNext}
        {...props}
      >
        <ArrowRight aria-hidden />
        <span className='sr-only'>{_('next-slide')}</span>
      </button>
    )
  }
)
CarouselNext.displayName = 'CarouselNext'

export {
  CarouselContent as Content,
  CarouselCount as Count,
  CarouselCurrent as Current,
  CarouselItem as Item,
  CarouselNext as Next,
  CarouselPrevious as Previous,
  CarouselRoot as Root,
}

/**
 * translations
 */
const dictionary = {
  fr: {
    'previous-slide': 'slide précédent',
    'next-slide': 'slide suivant',
  },
  en: {
    'previous-slide': 'previous slide',
    'next-slide': 'next slide',
  },
  de: {
    'previous-slide': 'vorheriger Slide',
    'next-slide': 'nächster Slide',
  },
}
