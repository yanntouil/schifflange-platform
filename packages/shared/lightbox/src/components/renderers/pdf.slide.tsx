/**
 * PDFSlideRenderer
 * Renders a PDF document slide with zoom and pagination
 */

import { useElementSize } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { Size } from "@compo/utils"
import React from "react"
import { Document, Page, PageProps, pdfjs } from "react-pdf"
import type { PDFFile, SlideRendererProps } from "../../types"
import { Pagination, PdfMinimap, Toolbar } from "../slide"
import { useSlide } from "../slide/context"
import { Transform, useTransformControls } from "../transform"

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`
export const PDFSlide = React.memo<SlideRendererProps<PDFFile>>((props) => {
  const { transform } = useSlide()
  // stable container size
  const containerRef = React.useRef<HTMLDivElement>(null)
  const elementSize = useElementSize(containerRef)
  const [containerSize, setContainerSize] = React.useState<Size>({ width: 0, height: 0 })
  React.useEffect(() => {
    const margin = 10
    if (!elementSize) return
    const { width, height } = {
      width: Math.round(elementSize[0]),
      height: Math.round(elementSize[1]),
    }
    setContainerSize((prev) => {
      const widthDiff = Math.abs(width - prev.width)
      const heightDiff = Math.abs(height - prev.height)
      if (widthDiff > margin || heightDiff > margin) {
        return { width, height }
      }
      return prev
    })
  }, [setContainerSize, elementSize])

  return (
    <div className='size-full max-h-full max-w-full' ref={containerRef}>
      <Transform.Root {...transform} className='group/transform-content relative flex items-center justify-center'>
        <Slide {...props} containerSize={containerSize} />
      </Transform.Root>
    </div>
  )
})

/**
 * PDF slide renderer with react-pdf
 */
const containerPadding = 16
const Slide = React.memo<SlideRendererProps<PDFFile> & { containerSize: Size }>(({ file, makeUrl, containerSize }) => {
  const pdfUrl = makeUrl(file.path)

  const { isActive } = useSlide()
  const [allReadyRendered, setAllReadyRendered] = React.useState(false)

  React.useEffect(() => {
    if (allReadyRendered) return
    if (isActive) {
      setAllReadyRendered(true)
    }
  }, [isActive, allReadyRendered])

  // management of document loading
  const [isDocumentLoading, setIsDocumentLoading] = React.useState(true)
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setIsDocumentLoading(false)
    setNumPages(numPages)
  }

  // management of document errors
  const [hasError, setHasError] = React.useState(false)
  const onLoadError = () => {
    setHasError(true)
  }

  const [isPageLoading, setIsPageLoading] = React.useState(true)
  const { centerView } = useTransformControls()
  const onPageLoadSuccess: PageProps["onRenderSuccess"] = ({ originalHeight, originalWidth }) => {
    centerView(1, 0.001, "linear")
    setIsPageLoading(false)
    setPageSize({ width: originalWidth, height: originalHeight })
  }
  const [pageSize, setPageSize] = React.useState(containerSize)

  // Calculate the width that makes the PDF fit in the container
  const computedPageSize = React.useMemo(() => {
    const availableWidth = containerSize.width - containerPadding * 2
    const availableHeight = containerSize.height - containerPadding * 2
    const widthScale = availableWidth / pageSize.width
    const heightScale = availableHeight / pageSize.height
    const scale = Math.min(widthScale, heightScale)
    const width = pageSize.width * scale
    const height = pageSize.height * scale
    return { width, height }
  }, [containerSize, pageSize])

  // pagination
  const [numPages, setNumPages] = React.useState<number>(0)
  const [pageNumber, setPageNumber] = React.useState(1)

  // reset page loading when page number changes (looks like it's not needed)
  const pageRef = React.useRef<number>(1)
  // React.useEffect(() => {
  //   if (pageNumber !== pageRef.current) {
  //     pageRef.current = pageNumber
  //     setIsPageLoading(true)
  //   }
  // }, [pageNumber])

  // reset page number when slide is not active
  React.useEffect(() => {
    if (!isActive) {
      setPageNumber(1)
    }
  }, [isActive])

  const onPageChange = React.useCallback(
    (page: number) => {
      setPageNumber(page)
      centerView(1, 0)
    },
    [setPageNumber]
  )

  if (hasError) return <PdfFailed file={file} />

  return (
    <>
      <Transform.Content
        wrapperStyle={{
          width: containerSize.width,
          height: containerSize.height,
          // delay opacity to remove transition movement
          opacity: isPageLoading ? 0 : 1,
          transition: "opacity 0",
          transitionDelay: "400ms",
        }}
      >
        {allReadyRendered && (
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onLoadError}
            className='relative mx-auto my-auto size-max place-items-center bg-transparent'
            loading={
              <div className='flex items-center justify-center'>
                <div className='size-16 border-4 border-white/20 border-t-white/80 rounded-full animate-spin' />
              </div>
            }
          >
            <Page
              key={pageNumber}
              pageNumber={pageNumber}
              width={computedPageSize.width}
              height={computedPageSize.height}
              onRenderSuccess={onPageLoadSuccess}
              renderMode='canvas'
              renderAnnotationLayer={false}
              renderTextLayer={false}
              loading={
                <div className='flex items-center justify-center'>
                  <div className='w-16 h-16 border-4 border-white/20 border-t-white/80 rounded-full animate-spin' />
                </div>
              }
            />
          </Document>
        )}
      </Transform.Content>
      {!isDocumentLoading && (
        <>
          <PdfMinimap key={pageNumber} containerSize={containerSize} currentPage={pageNumber} pdfUrl={pdfUrl} />
          <Toolbar>
            <Transform.Controls />
            <Pagination total={numPages} page={pageNumber} onPageChange={onPageChange} />
          </Toolbar>
        </>
      )}
    </>
  )
})

PDFSlide.displayName = "PDFSlide"

/**
 * PdfFailed
 * Display a message when the PDF fails to load
 */
const PdfFailed = React.memo<{ file: PDFFile }>(({ file }) => {
  const { _ } = useTranslation(dictionary)
  return (
    <div className='flex items-center justify-center w-full h-full'>
      <div className='text-center text-white/70'>
        <p className='text-lg mb-2'>{_("pdf-failed")}</p>
        <p className='text-sm'>{file.title}</p>
      </div>
    </div>
  )
})

/**
 * translations
 */
const dictionary = {
  fr: {
    "pdf-failed": "Échec du chargement du PDF",
  },
  en: {
    "pdf-failed": "Failed to load PDF",
  },
  de: {
    "pdf-failed": "PDF konnte nicht geladen werden",
  },
}
