import { useElementSize } from "@reactuses/core"
import React from "react"
import type { RegisteredFile } from "../../types"
import { useLightboxContext } from "../lightbox.context"
import { SlideProvider } from "../slide/provider"

/**
 * Carousel slide component
 */
type CarouselSlideProps = {
  file: RegisteredFile
  currentIndex: number
  total: number
  index: number
}
const CarouselSlide: React.FC<CarouselSlideProps> = ({ file, currentIndex, total, index }) => {
  const { makePreviewUrl, makeUrl, slideRenderers } = useLightboxContext()
  const isActive = index === currentIndex
  const Renderer = slideRenderers[file.type] as any
  const containerRef = React.useRef<HTMLDivElement>(null)
  const size = useElementSize(containerRef)
  const cssVars = React.useMemo(() => {
    return {
      "--slide-container-width": size[0],
      "--slide-container-height": size[1],
    } as React.CSSProperties
  }, [size])

  if (!Renderer) {
    console.error(`No renderer found for file type: ${file.type}`)
    return (
      <div key={file.id} className='flex-[0_0_100%] min-w-0' data-slot='carousel-slide'>
        <div className='text-white/70'>Unsupported file type: {file.type}</div>
      </div>
    )
  }

  return (
    <SlideProvider
      key={file.id}
      isActive={isActive}
      index={index}
      total={total}
      file={file}
      makePreviewUrl={makePreviewUrl}
      makeUrl={makeUrl}
    >
      <div
        data-slot='carousel-slide'
        data-state={isActive ? "active" : "inactive"}
        className='flex-[0_0_100%] min-w-0 size-full group/carousel-slide relative'
        style={{
          paddingTop: "var(--slide-padding-top, 0px)",
          paddingBottom: "var(--slide-padding-bottom, 0px)",
          paddingLeft: "var(--slide-padding-left, 0px)",
          paddingRight: "var(--slide-padding-right, 0px)",
          ...cssVars,
        }}
      >
        <div
          className='size-full flex items-center justify-center'
          data-slot='carousel-slide-content'
          data-state={isActive ? "active" : "inactive"}
          ref={containerRef}
          style={cssVars}
        >
          <Renderer file={file} makePreviewUrl={makePreviewUrl} makeUrl={makeUrl} isActive={isActive} />
        </div>
      </div>
    </SlideProvider>
  )
}

CarouselSlide.displayName = "CarouselSlide"

export { CarouselSlide }
