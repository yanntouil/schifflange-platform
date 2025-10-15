import { useTranslation } from "@compo/localize"
import { CaretLeftIcon, CaretRightIcon } from "@radix-ui/react-icons"
import { Portal } from "@radix-ui/react-portal"
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
import React from "react"
import { Dia as BaseDia, DiaCarousel, DiaTransform, WithData, useSlide, useSlider, useTransform } from "react-dia"
import scrollIntoViewIfNeeded from "scroll-into-view-if-needed"
import { A, cx, cxm, match } from "@compo/utils"
import { disabledVariants, focusVariants } from "../../variants"
import { AutoSlider } from "../auto-slider"
import { Button } from "../button"
import { SrOnly } from "../sr-only"
import { dictionary } from "./dictionary"
import { ImageSlide, ImageThumbnail } from "./slide-image"
import { PdfSlide, PdfThumbnail } from "./slide-pdf"
import { VideoSlide } from "./slide-video"
import { SlideData } from "./types"
import { getSlideSaveResource, saveResource } from "./utils"

/**
 * LightboxViewer
 */

type DiaContentProps = React.ComponentProps<typeof Lightbox.Content> & {
  menubar?: (data: SlideData) => React.ReactNode
}

const LightboxViewer = React.forwardRef<HTMLDivElement, DiaContentProps>((props, ref) => {
  const { _ } = useTranslation(dictionary)
  const { menubar, ...contentProps } = props
  const slider = useSlider()
  const [hideUI, setHideUI] = React.useState(false)

  // const bindStillTap = useStillTap(() => setHideUI((hide) => !hide))

  return (
    <Portal>
      <Lightbox.Overlay className='fixed inset-0 size-full bg-black/40' />

      <Lightbox.Content
        {...contentProps}
        ref={ref}
        data-state-ui={hideUI ? "hidden" : "visible"}
        className='dark group/dia-content animate-appear fixed inset-0 isolate flex w-full flex-col overflow-hidden bg-background text-foreground transition-all duration-300 data-[state-ui=visible]:top-12 data-[state-ui=visible]:rounded-t-3xl'
      >
        <div className='absolute left-0 right-0 top-0 z-20 flex w-full justify-between bg-gradient-to-b from-background/80 via-background/50 to-background/0 p-4 transition-opacity group-data-[state-ui=hidden]/dia-content:opacity-0'>
          <div className='ml-auto flex gap-1'>
            <LightboxMenubar menubar={menubar} />

            <Button icon variant='ghost' onClick={() => slider.setFullscreen(!slider.fullscreen)}>
              <Fullscreen aria-hidden />
              <SrOnly>{_("enter-fullscreen")}</SrOnly>
            </Button>

            <Lightbox.Close asChild>
              <Button icon variant='ghost'>
                <XIcon aria-hidden />
                <SrOnly>{_("close")}</SrOnly>
              </Button>
            </Lightbox.Close>
          </div>
        </div>

        <Lightbox.Previous asChild>
          <Button icon variant='ghost' className='absolute left-5 top-1/2 z-20 -translate-y-1/2 bg-card/50'>
            <CaretLeftIcon aria-hidden />
            <SrOnly>{_("previous")}</SrOnly>
          </Button>
        </Lightbox.Previous>

        <Lightbox.Next asChild>
          <Button icon variant='ghost' className='absolute right-5 top-1/2 z-20 -translate-y-1/2 bg-card/50'>
            <CaretRightIcon aria-hidden />
            <SrOnly>{_("next")}</SrOnly>
          </Button>
        </Lightbox.Next>

        <DiaCarousel.Root
          lazy
          className='flex-1 overflow-hidden transition-colors group-data-[state-ui=visible]/dia-content:rounded-b-3xl group-data-[state-ui=visible]/dia-content:bg-zinc-950'
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
                    .with({ type: "pdf" }, (data) => <PdfSlide slide={data} />)
                    .exhaustive()}
                </DiaCarousel.Slide>
              )}
            </Lightbox.Slides>
          </DiaCarousel.Slides>
        </DiaCarousel.Root>
        <div
          className='pointer-events-none absolute bottom-0 left-0 right-0 h-[7rem] bg-gradient-to-t from-black/70 to-transparent transition-opacity group-data-[state-ui=hidden]/dia-content:opacity-0'
          aria-hidden
        />
        <div
          className='pointer-events-none absolute left-0 right-0 top-0 h-[6rem] bg-gradient-to-b from-black/30 to-transparent transition-opacity group-data-[state-ui=hidden]/dia-content:opacity-0'
          aria-hidden
        />
        <div className='h-0 overflow-hidden opacity-0 transition-all duration-300 group-data-[state-ui=visible]/dia-content:h-20 group-data-[state-ui=visible]/dia-content:opacity-100'>
          <LightboxThumbnails />
        </div>
      </Lightbox.Content>
    </Portal>
  )
})

/**
 * LightboxToolbar
 */
const LightboxToolbar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { active } = useSlide()
  if (!active) return null
  return (
    <Lightbox.ContentPortal>
      <div className='dia-controls dark pointer-events-auto absolute bottom-24 left-1/2 z-20 flex h-min w-max -translate-x-1/2 select-none flex-col gap-1 rounded-md bg-zinc-800 p-1.5 text-white shadow-2xl'>
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

  return (
    <div className='flex items-center gap-2'>
      <Button icon variant='ghost' size='xs' onClick={onZoomOut} disabled={disabledZoomOut}>
        <Minus className='mx-auto my-auto size-4' aria-hidden />
        <SrOnly>{_("zoom-out")}</SrOnly>
      </Button>
      <SliderPrimitive.Root
        max={steps.length - 1}
        min={0}
        value={[step]}
        onValueChange={onValueChange}
        className='relative mx-3 flex w-[5.2rem] shrink-0 touch-none select-none items-center'
      >
        <SliderPrimitive.Track className='relative h-1 w-full grow overflow-hidden rounded-full bg-secondary'>
          <SliderPrimitive.Range className='absolute h-full bg-primary-foreground' />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          className={cxm(
            "block size-3 rounded-full border-2 border-primary-foreground bg-foreground ring-offset-background transition-colors",
            focusVariants(),
            disabledVariants()
          )}
        />
      </SliderPrimitive.Root>
      <Button icon variant='ghost' size='xs' onClick={onResetZoom} disabled={disabledResetZoom}>
        <Maximize className='mx-auto my-auto size-4' aria-hidden />
        <SrOnly>{_("reset-zoom")}</SrOnly>
      </Button>

      <Button icon variant='ghost' size='xs' onClick={onZoomIn} disabled={disabledZoomIn}>
        <Plus className='mx-auto my-auto size-4' aria-hidden />
        <SrOnly>{_("zoom-in")}</SrOnly>
      </Button>
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
      <Button icon variant='ghost' size='xs' onClick={onPrevious}>
        <ChevronLeft aria-hidden />
        <SrOnly>{_("previous-page")}</SrOnly>
      </Button>
      <p className='text-center text-sm'>{_("pages", { current: current, total })}</p>
      <Button icon variant='ghost' size='xs' onClick={onNext}>
        <ChevronRight aria-hidden />
        <SrOnly>{_("next-page")}</SrOnly>
      </Button>
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
    <div className='flex h-20 w-full select-none flex-col bg-card'>
      <AutoSlider.Viewport className='!my-0 mx-auto flex h-full w-fit max-w-full justify-start whitespace-nowrap rounded-xl px-4 !pt-2.5 pb-4'>
        <div className='isolate mx-auto flex h-full w-fit gap-1'>
          <Lightbox.Slides>
            {(data) => (
              <Lightbox.Trigger
                id={data.id}
                data-slider-thumbnail={data.id}
                data-state={slider.activeSlideId === data.id ? "active" : ""}
                className={cx(
                  "relative flex aspect-video h-full items-center justify-center rounded-md border border-muted outline-none",
                  "pointer-events-auto z-10 shrink-0 overflow-hidden bg-muted-foreground/15 transition-all empty:hidden",
                  "mx-0 ring-accent data-[state='active']:z-20 data-[state='active']:mx-2 data-[state='active']:scale-110 data-[state='active']:border-white data-[state='active']:ring-1"
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
      </AutoSlider.Viewport>
    </div>
  )
}

/**
 * LightboxMenubar
 */
const LightboxMenubar: React.FC<{ menubar?: (data: SlideData) => React.ReactNode }> = ({ menubar }) => {
  const slider = useSlider<SlideData>()
  if (!slider.activeSlide) return null
  const resource = getSlideSaveResource(slider.activeSlide)
  return (
    <>
      {menubar ? menubar(slider.activeSlide) : null}
      {resource && (
        <>
          <Button icon variant='ghost' onClick={() => saveResource(resource)}>
            <Download />
          </Button>
        </>
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
const LightboxPortal = Portal
const LightboxContentPortal = Lightbox.ContentPortal
const LightboxTransform = DiaTransform

export {
  LightboxActiveSlide as ActiveSlide,
  LightboxClose as Close,
  LightboxContent as Content,
  LightboxContentPortal as ContentPortal,
  LightboxNext as Next,
  LightboxOverlay as Overlay,
  LightboxPagesNavigation as PagesNavigation,
  LightboxPortal as Portal,
  LightboxPrevious as Previous,
  LightboxRoot as Root,
  LightboxSlide as Slide,
  LightboxToolbar as Toolbar,
  LightboxTransform as Transform,
  LightboxViewer as Viewer,
  LightboxZoom as Zoom,
}
