"use client"

import { Viewport } from "@/components/auto-slider"
import { useTranslation } from "@/lib/localize"
import { cn } from "@/lib/utils"
import { A, match } from "@compo/utils"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { CaretLeftIcon, CaretRightIcon } from "@radix-ui/react-icons"
import * as SliderPrimitive from "@radix-ui/react-slider"
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Fullscreen,
  Maximize,
  Minus,
  MonitorPlay,
  Plus,
  XIcon,
} from "lucide-react"
import dynamic from "next/dynamic"
import React from "react"
import {
  Dia as BaseDia,
  DiaCarousel,
  DiaTransform,
  WithData,
  browerAllowsFullscreen,
  useSlide,
  useSlider,
  useTransform,
} from "react-dia"
import scrollIntoViewIfNeeded from "scroll-into-view-if-needed"
import { dictionary } from "./dictionary"
import { ImageSlide, ImageThumbnail } from "./slide-image"
import { VideoSlide } from "./slide-video"
import { YoutubeSlide } from "./slide-youtube"
import { SlideData } from "./types"
import { getSlideSaveResource, saveResource } from "./utils"

const PdfSlide = dynamic(() => import("./pdf-slide"), {
  ssr: false,
})

const PdfThumbnail = dynamic(() => import("./pdf-thumbnail"), {
  ssr: false,
})

/**
 * LightboxViewer
 */

type DiaContentProps = React.ComponentProps<typeof Lightbox.Content> & {
  zIndex?: number
  menubar?: (data: SlideData) => React.ReactNode
}

const LightboxViewer = React.forwardRef<HTMLDivElement, DiaContentProps>((props, ref) => {
  const { _ } = useTranslation(dictionary)
  const { menubar, className, zIndex, ...contentProps } = props
  const slider = useSlider()
  const [hideUI] = React.useState(false)

  //const bindStillTap = useStillTap(() => setHideUI((hide) => !hide))

  return (
    <DialogPrimitive.Root open={slider.open} onOpenChange={slider.setOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className='fixed inset-0 size-full bg-foreground/40' style={{ zIndex }} />
        <DialogPrimitive.Content
          className='animate-appear dark fixed inset-0 top-12 isolate grid h-[calc(100vh-3rem)] w-full rounded-t-md bg-foreground text-background transition-all duration-300'
          style={{ zIndex }}
        >
          <DialogPrimitive.Title className='sr-only'>{_("lightbox-title")}</DialogPrimitive.Title>
          <Lightbox.Content
            {...contentProps}
            ref={ref}
            data-state-ui={hideUI ? "hidden" : "visible"}
            trapFocus={false}
            className={cn("group/dia-content relative flex w-full flex-col overflow-hidden", className)}
          >
            <div className='absolute left-0 right-0 top-0 z-20 flex w-full justify-between bg-gradient-to-b from-foreground/80 via-foreground/50 to-foreground/0 p-4 transition-opacity group-data-[state-ui=hidden]/dia-content:opacity-0'>
              <div className='ml-auto flex gap-1'>
                <LightboxMenubar menubar={menubar} />

                {browerAllowsFullscreen && (
                  <button
                    className='bg-foreground/50 size-8 rounded-md flex items-center justify-center'
                    onClick={() => slider.setFullscreen(!slider.fullscreen)}
                  >
                    <Fullscreen aria-hidden />
                    <span className='sr-only'>{_("enter-fullscreen")}</span>
                  </button>
                )}

                <Lightbox.Close asChild>
                  <button
                    className='bg-foreground/50 size-8 rounded-md flex items-center justify-center'
                    onClick={() => slider.setOpen(false)}
                  >
                    <XIcon aria-hidden />
                    <span className='sr-only'>{_("close")}</span>
                  </button>
                </Lightbox.Close>
              </div>
            </div>

            <Lightbox.Previous asChild>
              <button className='absolute left-5 top-1/2 z-20 -translate-y-1/2 bg-foreground/50 inline-flex items-center justify-center size-8 rounded-md'>
                <CaretLeftIcon aria-hidden className='!size-6' />
                <span className='sr-only'>{_("previous")}</span>
              </button>
            </Lightbox.Previous>

            <Lightbox.Next asChild>
              <button className='absolute right-5 top-1/2 z-20 -translate-y-1/2 bg-foreground/50 inline-flex items-center justify-center size-8 rounded-md'>
                <CaretRightIcon aria-hidden className='!size-6' />
                <span className='sr-only'>{_("next")}</span>
              </button>
            </Lightbox.Next>

            <DiaCarousel.Root
              lazy
              className='flex-1 overflow-hidden transition-colors group-data-[state-ui=visible]/dia-content:rounded-b-md group-data-[state-ui=visible]/dia-content:bg-foreground'
            >
              <DiaCarousel.Slides>
                <Lightbox.Slides>
                  {(data) => (
                    <DiaCarousel.Slide
                      data-state={slider.activeSlideId === data.id ? "active" : ""}
                      className='opacity-15 transition-opacity data-[state="active"]:opacity-100'
                    >
                      {match(data)
                        .with({ type: "image" }, (data) => <ImageSlide data={data} />)
                        .with({ type: "video" }, (data) => <VideoSlide data={data} />)
                        .with({ type: "youtube" }, (data) => <YoutubeSlide data={data} />)
                        .with({ type: "pdf" }, (data) => <PdfSlide slide={data} />)
                        .otherwise(() => null)}
                    </DiaCarousel.Slide>
                  )}
                </Lightbox.Slides>
              </DiaCarousel.Slides>
            </DiaCarousel.Root>
            <div
              className='pointer-events-none absolute bottom-0 left-0 right-0 h-[7rem] bg-gradient-to-t from-foreground/70 to-transparent transition-opacity group-data-[state-ui=hidden]/dia-content:opacity-0'
              aria-hidden
            />
            <div
              className='pointer-events-none absolute left-0 right-0 top-0 h-[6rem] bg-gradient-to-b from-foreground/30 to-transparent transition-opacity group-data-[state-ui=hidden]/dia-content:opacity-0'
              aria-hidden
            />
            <div className='h-0 overflow-hidden opacity-0 transition-all duration-300 group-data-[state-ui=visible]/dia-content:h-20 group-data-[state-ui=visible]/dia-content:opacity-100'>
              <LightboxThumbnails />
            </div>
          </Lightbox.Content>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
})

LightboxViewer.displayName = "LightboxViewer"

/**
 * LightboxToolbar
 */
const LightboxToolbar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { active } = useSlide()
  if (!active) return null
  return (
    <Lightbox.ContentPortal>
      <div className='dia-controls dark pointer-events-auto absolute bottom-24 left-1/2 z-20 flex h-min w-max -translate-x-1/2 select-none flex-col gap-1 rounded-md bg-foreground/80 p-1.5 text-background shadow-2xl'>
        {children}
      </div>
    </Lightbox.ContentPortal>
  )
}

/**
 * LightboxZoom
 */
const LightboxZoom: React.FC<{ steps: number[] }> = ({ steps }) => {
  const { _ } = useTranslation(dictionary)
  const { scale, setScale } = useTransform()
  const [step, setStep] = React.useState(() => scale) // relative to step index
  const firstStep = React.useMemo(() => {
    return A.head(steps) || 0
  }, [steps])

  // update step base on scale
  React.useEffect(() => {
    const index = steps.findIndex((step) => step >= scale)
    setStep(index)
    if (index !== step) setScale(steps[index] as number)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scale])

  // zoom in
  const onZoomIn = () => {
    const newStep = step + 1
    if (newStep > steps.length - 1) return
    setStep(newStep)
    setScale(steps[newStep] as number)
  }
  const disabledZoomIn = React.useMemo(() => {
    return step > steps.length - 1
  }, [step, steps])

  // zoom out
  const onZoomOut = () => {
    const newStep = step - 1
    if (newStep < 0) return
    setStep(newStep)
    setScale(steps[newStep] as number)
  }
  const disabledZoomOut = React.useMemo(() => {
    return step <= firstStep
  }, [step, firstStep])

  // reset zoom
  const onResetZoom = () => {
    setScale(steps[0] as number)
    setStep(0)
  }
  const disabledResetZoom = React.useMemo(() => {
    return step === firstStep
  }, [step, firstStep])

  // slider
  const onValueChange = ([value]: [number]) => {
    if (typeof value === "number") {
      setScale(steps[value] as number)
      setStep(value)
    }
  }
  const isTouchDevice = React.useMemo(
    () => typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0),
    []
  )
  if (isTouchDevice) return null

  return (
    <div className='flex items-center gap-2'>
      <button
        className='bg-foreground/50 size-8 rounded-md flex items-center justify-center'
        onClick={onZoomOut}
        disabled={disabledZoomOut}
      >
        <Minus className='mx-auto my-auto size-4' aria-hidden />
        <span className='sr-only'>{_("zoom-out")}</span>
      </button>
      <SliderPrimitive.Root
        max={steps.length - 1}
        min={0}
        value={[step]}
        onValueChange={onValueChange}
        className='relative mx-3 flex w-[5.2rem] shrink-0 touch-none select-none items-center'
      >
        <SliderPrimitive.Track className='relative h-1 w-full grow overflow-hidden rounded-md bg-foreground'>
          <SliderPrimitive.Range className='absolute h-full bg-highlight' />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          className={cn(
            "block size-3 rounded-full border-2 border-highlight bg-foreground ring-offset-foreground transition-colors"
          )}
        />
      </SliderPrimitive.Root>
      <button
        className='bg-foreground/50 size-8 rounded-md flex items-center justify-center'
        onClick={onResetZoom}
        disabled={disabledResetZoom}
      >
        <Maximize className='mx-auto my-auto size-4' aria-hidden />
        <span className='sr-only'>{_("reset-zoom")}</span>
      </button>

      <button
        className='bg-foreground/50 size-8 rounded-md flex items-center justify-center'
        onClick={onZoomIn}
        disabled={disabledZoomIn}
      >
        <Plus className='mx-auto my-auto size-4' aria-hidden />
        <span className='sr-only'>{_("zoom-in")}</span>
      </button>
    </div>
  )
}

/**
 * LightboxPagesNavigation
 */
const LightboxPagesNavigation: React.FC<{
  total: number
  current: number
  setPage: React.Dispatch<React.SetStateAction<number>>
  resetScale: () => void
}> = ({ total, current, setPage, resetScale }) => {
  const { _ } = useTranslation(dictionary)

  // previous
  const onPrevious = () => {
    if (current <= 1) setPage(total)
    else setPage(current - 1)
    resetScale()
  }

  // next
  const onNext = () => {
    if (current >= total) setPage(1)
    else setPage(current + 1)
    resetScale()
  }

  if (total <= 1) return null
  return (
    <div className='grid grid-cols-[auto_1fr_auto] items-center gap-2'>
      <button className='bg-foreground/50 size-8 rounded-md flex items-center justify-center' onClick={onPrevious}>
        <ChevronLeft aria-hidden />
        <span className='sr-only'>{_("previous-page")}</span>
      </button>
      <p className='text-center text-sm'>{_("pages", { current: current, total })}</p>
      <button className='bg-foreground/50 size-8 rounded-md flex items-center justify-center' onClick={onNext}>
        <ChevronRight aria-hidden />
        <span className='sr-only'>{_("next-page")}</span>
      </button>
    </div>
  )
}

/**
 * LightboxThumbnails
 */
const LightboxThumbnails: React.FC<unknown> = () => {
  const slider = useSlider()

  const [width, setWidth] = React.useState(0)

  React.useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  React.useEffect(() => {
    if (!slider.activeSlideId) return

    const thumbnail = document.querySelector(`button[data-slider-thumbnail="${slider.activeSlideId}"]`)

    if (thumbnail) {
      scrollIntoViewIfNeeded(thumbnail, {
        // behavior: "smooth",
        block: "center",
        inline: "center",
        scrollMode: "always",
      })
    }
  }, [slider.activeSlideId, width])

  return (
    <div className='flex h-20 w-full select-none flex-col bg-foreground'>
      <Viewport className='!my-0 mx-auto flex h-full w-fit max-w-full justify-start whitespace-nowrap rounded-md px-4 !pt-2.5 pb-4'>
        <div className='isolate mx-auto flex h-full w-fit gap-1'>
          <Lightbox.Slides>
            {(data) => (
              <Lightbox.Trigger
                id={data.id}
                data-slider-thumbnail={data.id}
                data-state={slider.activeSlideId === data.id ? "active" : ""}
                className={cn(
                  "relative flex aspect-video h-full items-center justify-center rounded-md border border-primary outline-none cursor-pointer bg-white/80",
                  "pointer-events-auto z-10 shrink-0 overflow-hidden bg-muted-foreground/15 transition-all empty:hidden",
                  "mx-0 ring-accent data-[state='active']:z-20 data-[state='active']:mx-2 data-[state='active']:scale-110 data-[state='active']:border-highlight data-[state='active']:ring-1"
                )}
              >
                {match(data)
                  .with({ type: "image" }, (data) => <ImageThumbnail data={data} />)
                  .with({ type: "pdf" }, (data) => <PdfThumbnail data={data} />)
                  .with({ type: "video" }, () => <MonitorPlay className='mx-auto my-auto size-6' />)
                  .otherwise(() => null)}
              </Lightbox.Trigger>
            )}
          </Lightbox.Slides>
        </div>
      </Viewport>
    </div>
  )
}

/**
 * LightboxMenubar
 */
const LightboxMenubar: React.FC<{ menubar?: (data: SlideData) => React.ReactNode }> = ({ menubar }) => {
  const { _ } = useTranslation(dictionary)
  const slider = useSlider<SlideData>()
  if (!slider.activeSlide) return null
  const resource = getSlideSaveResource(slider.activeSlide)
  return (
    <>
      {menubar ? menubar(slider.activeSlide) : null}
      {resource && (
        <button
          className='bg-foreground/50 size-8 rounded-md flex items-center justify-center'
          onClick={() => saveResource(resource)}
        >
          <Download aria-hidden />
          <span className='sr-only'>{_("download")}</span>
        </button>
      )}
    </>
  )
}

/**
 * Lightbox
 */
const Lightbox = BaseDia as WithData<SlideData>
const LightboxRoot = Lightbox.Root
const LightboxSlide = Lightbox.Slide
const LightboxContent = Lightbox.Content
const LightboxOverlay = Lightbox.Overlay
const LightboxActiveSlide = Lightbox.ActiveSlide
const LightboxClose = Lightbox.Close
const LightboxPrevious = Lightbox.Previous
const LightboxNext = Lightbox.Next
const LightboxContentPortal = Lightbox.ContentPortal
const LightboxTransform = DiaTransform
const LightboxTrigger = Lightbox.Trigger

export {
  LightboxActiveSlide as ActiveSlide,
  LightboxClose as Close,
  LightboxContent as Content,
  LightboxContentPortal as ContentPortal,
  LightboxNext as Next,
  LightboxOverlay as Overlay,
  LightboxPagesNavigation as PagesNavigation,
  LightboxPrevious as Previous,
  LightboxRoot as Root,
  LightboxSlide as Slide,
  LightboxToolbar as Toolbar,
  LightboxTransform as Transform,
  LightboxTrigger as Trigger,
  LightboxViewer as Viewer,
  LightboxZoom as Zoom,
}
