/**
 * PDFThumbnail
 * Renders a clickable PDF thumbnail with document icon overlay
 */

import React from "react"
import type { DocumentProps, PageProps } from "react-pdf"
import { Document, Page, pdfjs } from "react-pdf"
import type { PDFFile, ThumbnailRendererProps } from "../../types"

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

/**
 * PDF thumbnail renderer with react-pdf preview
 */
export const PDFThumbnail = React.memo<ThumbnailRendererProps<PDFFile>>(({ file, makeUrl, isActive, onClick }) => {
  const pdfUrl = makeUrl(file.path)
  const [pdfSize, setPdfSize] = React.useState({ width: 0, height: 0 })
  const [error, setError] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)

  const maxWidth = 80
  const maxHeight = 80

  const onRenderSuccess: PageProps["onRenderSuccess"] = ({ originalHeight, originalWidth }) => {
    setPdfSize({ width: originalWidth, height: originalHeight })
    setIsLoading(false)
  }

  const onLoadError: DocumentProps["onLoadError"] = () => {
    setError(true)
    setIsLoading(false)
  }

  const pageSize =
    pdfSize.width > 0 && pdfSize.height > 0
      ? (() => {
          const widthScale = maxWidth / pdfSize.width
          const heightScale = maxHeight / pdfSize.height
          const scale = Math.min(widthScale, heightScale)
          return {
            width: pdfSize.width * scale,
            height: pdfSize.height * scale,
          }
        })()
      : { width: maxWidth, height: maxHeight }

  // PDF preview element (rendered once, displayed twice)
  const thumbnail = React.useMemo(
    () =>
      !error ? (
        <span className='size-max place-items-center'>
          <Document
            file={pdfUrl}
            className='grid h-full w-full items-center justify-center'
            loading={null}
            onLoadError={onLoadError}
          >
            <Page
              pageNumber={1}
              {...pageSize}
              onRenderSuccess={onRenderSuccess}
              renderMode='canvas'
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          </Document>
        </span>
      ) : null,
    [pdfUrl, error, pageSize.width, pageSize.height]
  )

  return (
    <button
      type='button'
      onClick={onClick}
      className={`
          relative shrink-0 size-[var(--thumbnail-width)] overflow-hidden rounded border-2 transition-all
          ${isActive ? "border-white ring-2 ring-white/50" : "border-white/30 hover:border-white/60"}
        `}
      aria-label={file.title}
      tabIndex={-1} // Prevent focus
    >
      {isLoading && (
        <div className='absolute inset-0 flex items-center justify-center w-full h-full z-10'>
          <div className='w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin' />
        </div>
      )}
      {thumbnail ? (
        <>
          {/* Background blur effect - like PdfPreview */}
          <div className='absolute inset-0 grid size-full overflow-hidden opacity-25 blur-[2px]' aria-hidden>
            <div className='flex scale-[200%] items-center justify-center'>{thumbnail}</div>
          </div>
          {/* Main PDF thumbnail */}
          <div className='relative flex size-full max-h-full max-w-full items-center justify-center'>
            <div className='flex max-h-full max-w-full items-center justify-center'>{thumbnail}</div>
          </div>
        </>
      ) : error ? (
        <div className='w-full h-full bg-black/50 flex items-center justify-center'>
          <span className='text-white/50 text-xs'>PDF</span>
        </div>
      ) : null}

      {/* PDF icon overlay */}
      <div className='absolute bottom-1 right-1 bg-red-600 text-white text-[9px]/none font-normal px-1 py-0.5 rounded'>
        PDF
      </div>
    </button>
  )
})

PDFThumbnail.displayName = "PDFThumbnail"
