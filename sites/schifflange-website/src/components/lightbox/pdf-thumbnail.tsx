"use client"

import { cn } from "@/lib/utils"
import { LoaderCircle, TriangleAlert } from "lucide-react"
import React from "react"
import { Document, DocumentProps, Page, PageProps, pdfjs } from "react-pdf"
import { SlidePdf } from "./types"

/**
 * set worker path
 * In monorepo, we need to use CDN or let react-pdf handle it automatically
 */
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

/**
 * Thumbnail
 */
const PdfThumbnail: React.FC<{ data: SlidePdf; maxWidth?: number; maxHeight?: number }> = ({
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
      className={cn(
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
      <LoaderCircle className='size-5 animate-spin' aria-hidden />
    </ThumbnailWrapper>
  )
}

export default PdfThumbnail
