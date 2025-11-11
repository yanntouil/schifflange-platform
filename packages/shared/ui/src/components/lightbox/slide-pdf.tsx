import { useElementSize } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { cxm } from "@compo/utils"
import "core-js/actual/promise/with-resolvers"
import { LoaderCircle, TriangleAlert } from "lucide-react"
import React from "react"
import { useTransform, useTransformControls } from "react-dia"
import { Document, DocumentProps, Page, PageProps, pdfjs } from "react-pdf"
import { MiniMap } from "react-zoom-pan-pinch"
import { Lightbox } from "."
import { Icon } from "../.."
import { dictionary } from "./dictionary"
import { SlidePdf } from "./types"
/**
 * set worker path
 * In monorepo, we need to use CDN or let react-pdf handle it automatically
 */
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

/**
 * lightbox margin
 */
const containerPadding = 16

/**
 * Component
 */
export const PdfSlide: React.FC<{ slide: SlidePdf }> = ({ slide }) => {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [width, height] = useElementSize(containerRef)

  return (
    <div className='size-full max-h-full max-w-full' ref={containerRef}>
      <Lightbox.Transform.Root className='group/transform-content relative flex items-center justify-center'>
        <PdfSlideContent slide={slide} containerSize={{ width, height }} />
      </Lightbox.Transform.Root>
    </div>
  )
}

/**
 * PdfSlideContent
 * wrapper required to use transform context
 */
const PdfSlideContent: React.FC<{ slide: SlidePdf; containerSize: { width: number; height: number } }> = ({
  slide,
  containerSize,
}) => {
  const [isRenderSuccess, setIsRenderSuccess] = React.useState<boolean>(false)
  const [numberOfPages, setNumberOfPages] = React.useState<number>(0)
  const [currentPage, setCurrentPage] = React.useState<number>(1)

  const onLoadSuccess: DocumentProps["onLoadSuccess"] = ({ numPages }: { numPages: number }) => {
    setNumberOfPages(numPages)
    setCurrentPage(1)
  }
  const [pdfSize, setPdfSize] = React.useState({ width: 0, height: 0 })
  const onRenderSuccess: PageProps["onRenderSuccess"] = ({ originalHeight, originalWidth }) => {
    setPdfSize({ width: originalWidth, height: originalHeight })
    setIsRenderSuccess(true)
    centerView(1)
  }

  const pageSize = React.useMemo(() => {
    const availableWidth = containerSize.width - containerPadding * 2
    const availableHeight = containerSize.height - containerPadding * 2
    const widthScale = availableWidth / pdfSize.width
    const heightScale = availableHeight / pdfSize.height
    const scale = Math.min(widthScale, heightScale)
    const width = pdfSize.width * scale
    const height = pdfSize.height * scale
    return { width, height }
  }, [containerSize, pdfSize])

  const [error, setError] = React.useState<boolean>(false)

  const { centerView } = useTransformControls()
  const { scale, setScale } = useTransform()

  const onLoadError: DocumentProps["onLoadError"] = () => {
    setError(true)
  }

  if (error) return <PageError containerSize={containerSize} />
  return (
    <>
      <Lightbox.Transform.Content
        wrapperStyle={{
          width: containerSize.width,
          height: containerSize.height,
          // delay opacity to remove transition movement
          opacity: isRenderSuccess ? 1 : 0,
          transition: "opacity 0",
          transitionDelay: "200ms",
        }}
      >
        <Document
          file={slide.src}
          loading={<PageLoading containerSize={containerSize} />}
          onLoadSuccess={onLoadSuccess}
          onLoadError={onLoadError}
          className={"relative mx-auto my-auto size-max place-items-center p-4"}
          // TODO: this is a workaround to fix the page size
          // style={{ ...(isRenderSuccess ? pageSize : containerSize) }}
        >
          <Page
            pageNumber={currentPage}
            {...(isRenderSuccess ? pageSize : containerSize)}
            onRenderSuccess={onRenderSuccess}
            renderMode='canvas'
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
        </Document>
      </Lightbox.Transform.Content>
      {isRenderSuccess && (
        <FloatingMiniMap
          containerSize={containerSize}
          currentPage={currentPage}
          scale={scale}
          key={currentPage}
          slide={slide}
        />
      )}
      <Lightbox.Toolbar>
        <Lightbox.PagesNavigation
          total={numberOfPages}
          current={currentPage}
          setPage={setCurrentPage}
          resetScale={() => setScale(1)}
        />
        <Lightbox.Zoom steps={[0.9, 1, 2, 3, 4, 5, 6, 7, 8, 9]} />
      </Lightbox.Toolbar>
    </>
  )
}

/**
 * FloatingMiniMap
 */
const FloatingMiniMap: React.FC<{
  containerSize: { width: number; height: number }
  currentPage: number
  slide: SlidePdf
  scale: number
}> = ({ containerSize, currentPage, scale, slide }) => {
  const [isRenderSuccess, setIsRenderSuccess] = React.useState<boolean>(false)
  const [pdfSize, setPdfSize] = React.useState({ width: 0, height: 0 })
  const onRenderSuccess: PageProps["onRenderSuccess"] = ({ originalHeight, originalWidth }) => {
    setPdfSize({ width: originalWidth, height: originalHeight })
    setIsRenderSuccess(true)
  }

  const pageSize = React.useMemo(() => {
    const availableWidth = containerSize.width - containerPadding * 2
    const availableHeight = containerSize.height - containerPadding * 2
    const widthScale = availableWidth / pdfSize.width
    const heightScale = availableHeight / pdfSize.height
    const scale = Math.min(widthScale, heightScale)
    const width = pdfSize.width * scale
    const height = pdfSize.height * scale
    return { width, height }
  }, [containerSize, pdfSize])

  return (
    <div
      className={cxm(
        "opacity--95 pointer-events-none absolute right-3 top-20 z-20 -hidden rounded-md transition-opacity duration-300 group-hover/transform-content:block"
        // scale < 2 ? "opacity-0" : "opacity-100"
      )}
      aria-hidden
    >
      <MiniMap width={200} height={200 * (pageSize.width / pageSize.height)} borderColor='hsl(var(--primary))'>
        <Document
          file={slide.src}
          loading={<PageLoading containerSize={containerSize} />}
          className={"relative mx-auto my-auto size-max place-items-center p-4"}
          // TODO: this is a workaround to fix the page size
          // style={{ ...(isRenderSuccess ? pageSize : containerSize) }}
        >
          <Page
            pageNumber={currentPage}
            {...(isRenderSuccess ? pageSize : containerSize)}
            onRenderSuccess={onRenderSuccess}
            renderMode='canvas'
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
        </Document>
      </MiniMap>
    </div>
  )
}

/**
 * PageError
 * content display in case of error
 */
const PageError: React.FC<{ containerSize: { width: number; height: number } }> = ({ containerSize }) => {
  const { _ } = useTranslation(dictionary)
  return (
    <div style={{ ...containerSize }} className='flex items-center justify-center'>
      <TriangleAlert className='size-5' aria-hidden />
      <span>{_("pdf-failed")}</span>
    </div>
  )
}

/**
 * PageLoading
 * content display on loading
 */
const PageLoading: React.FC<{ containerSize: { width: number; height: number } }> = ({ containerSize }) => {
  const { _ } = useTranslation(dictionary)
  return (
    <div style={{ ...containerSize }} className='flex items-center justify-center'>
      <LoaderCircle className='size-5 animate-spin' aria-hidden />
      <span>{_("pdf-loading")}</span>
    </div>
  )
}

/**
 * Thumbnail
 */
export const PdfThumbnail: React.FC<{ data: SlidePdf; maxWidth?: number; maxHeight?: number }> = ({
  data,
  maxWidth = 120,
  maxHeight = 80,
}) => {
  const [pdfSize, setPdfSize] = React.useState({ width: 0, height: 0 })
  const onRenderSuccess: PageProps["onRenderSuccess"] = ({ originalHeight, originalWidth }) =>
    setPdfSize({ width: originalWidth, height: originalHeight })
  const pageSize = React.useMemo(() => {
    const widthScale = maxWidth / pdfSize.width
    const heightScale = maxHeight / pdfSize.height
    const scale = Math.min(widthScale, heightScale)
    const scaledWidth = pdfSize.width * scale
    const scaledHeight = pdfSize.height * scale
    return { width: scaledWidth, height: scaledHeight }
  }, [pdfSize, maxWidth, maxHeight])

  // error handler
  const [error, setError] = React.useState<boolean>(false)
  const onLoadError: DocumentProps["onLoadError"] = () => {
    setError(true)
  }

  return (
    <span className='size-max place-items-center'>
      {error ? (
        <ThumbnailError />
      ) : (
        <Document
          file={data.src}
          className={"grid h-full w-full items-center justify-center"}
          loading={<ThumbnailLoading />}
          onLoadError={onLoadError}
        >
          <Page
            pageNumber={1}
            {...pageSize}
            onRenderSuccess={onRenderSuccess}
            renderMode='canvas'
            height={Math.min(window.innerWidth, window.innerHeight) - 128}
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
        </Document>
      )}
    </span>
  )
}
const ThumbnailWrapper: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => {
  return (
    <div
      className={cxm(
        "flex aspect-square h-full flex-col items-center justify-center gap-0.5 bg-white p-1 text-[8px] leading-none text-muted-foreground",
        className
      )}
    >
      {children}
    </div>
  )
}
const ThumbnailError: React.FC = () => {
  return (
    <ThumbnailWrapper className='text-destructive'>
      <TriangleAlert className='size-5' aria-hidden />
      <span>Unable to load PDF</span>
    </ThumbnailWrapper>
  )
}
const ThumbnailLoading: React.FC = () => {
  return (
    <ThumbnailWrapper>
      <Icon.Loader variant='dots' className='size-5' aria-hidden />
    </ThumbnailWrapper>
  )
}

/**
 * Icon
 */
export const PdfIcon: React.FC<{ url: string }> = ({ url }) => {
  const [pdfSize, setPdfSize] = React.useState({ width: 0, height: 0 })
  const onRenderSuccess: PageProps["onRenderSuccess"] = ({ originalHeight, originalWidth }) =>
    setPdfSize({ width: originalWidth, height: originalHeight })
  const pageSize = React.useMemo(() => {
    const maxWidth = 30
    const maxHeight = 30
    const widthScale = maxWidth / pdfSize.width
    const heightScale = maxHeight / pdfSize.height
    const scale = Math.min(widthScale, heightScale)
    const scaledWidth = pdfSize.width * scale
    const scaledHeight = pdfSize.height * scale
    return { width: scaledWidth, height: scaledHeight }
  }, [pdfSize])

  // error handler
  const [error, setError] = React.useState<boolean>(false)
  const onLoadError: DocumentProps["onLoadError"] = () => {
    setError(true)
  }

  return (
    <div className='size-[34px] place-items-center overflow-hidden p-0.5'>
      {error ? (
        <IconError />
      ) : (
        <Document
          file={url}
          className={"grid size-full items-center justify-center"}
          loading={<IconLoading />}
          onLoadError={onLoadError}
        >
          <Page
            pageNumber={1}
            {...pageSize}
            onRenderSuccess={onRenderSuccess}
            renderMode='canvas'
            height={Math.min(window.innerWidth, window.innerHeight) - 128}
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
        </Document>
      )}
    </div>
  )
}
const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className='grid size-[30px] items-center justify-center'>
      <div className='flex aspect-[210/297] h-[30px] items-center justify-center rounded-[2px] bg-white text-[10px] leading-none text-muted-foreground shadow'>
        {children}
      </div>
    </div>
  )
}
const IconError: React.FC = () => {
  return (
    <IconWrapper>
      <TriangleAlert className='size-4' aria-hidden />
    </IconWrapper>
  )
}
const IconLoading: React.FC = () => {
  return (
    <IconWrapper>
      <LoaderCircle className='size-4 animate-spin' aria-hidden />
    </IconWrapper>
  )
}
