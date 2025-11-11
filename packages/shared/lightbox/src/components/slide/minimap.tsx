import { cxm } from "@compo/utils"
import React, { memo } from "react"
import { Document, Page, PageProps } from "react-pdf"
import { MiniMap } from "react-zoom-pan-pinch"
import { useTransformControls } from "../transform"

/**
 * Display a minimap for the current page of a PDF
 */
type MiniMapProps = {
  containerSize: { width: number; height: number }
  currentPage: number
  pdfUrl: string
}
export const PdfMinimap = memo<MiniMapProps>(({ containerSize, currentPage, pdfUrl }) => {
  const [isRenderSuccess, setIsRenderSuccess] = React.useState<boolean>(false)
  const [pdfSize, setPdfSize] = React.useState({ width: 0, height: 0 })
  const onRenderSuccess: PageProps["onRenderSuccess"] = ({ originalHeight, originalWidth }) => {
    setPdfSize({ width: originalWidth, height: originalHeight })
    setIsRenderSuccess(true)
  }

  const pageSize = React.useMemo(() => {
    const availableWidth = containerSize.width - 16 * 2
    const availableHeight = containerSize.height - 16 * 2
    const widthScale = availableWidth / pdfSize.width
    const heightScale = availableHeight / pdfSize.height
    const scale = Math.min(widthScale, heightScale)
    const width = pdfSize.width * scale
    const height = pdfSize.height * scale
    return { width, height }
  }, [containerSize, pdfSize])

  const { displayMinimap } = useTransformControls()
  return (
    <div
      className={cxm(
        "pointer-events-none absolute right-3 top-20 z-20 -hidden rounded-md transition-opacity duration-300 group-hover/transform-content:block",
        displayMinimap ? "opacity-100" : "opacity-0"
      )}
      aria-hidden
    >
      <MiniMap width={200} height={200 * (pageSize.width / pageSize.height)} borderColor='hsl(var(--primary))'>
        <Document
          file={pdfUrl}
          loading={
            <div className='flex items-center justify-center'>
              <div className='w-16 h-16 border-4 border-white/20 border-t-white/80 rounded-full animate-spin' />
            </div>
          }
          className={"relative mx-auto my-auto size-max place-items-center p-4"}
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
})
