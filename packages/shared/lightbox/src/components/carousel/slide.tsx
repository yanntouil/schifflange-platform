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
        className='flex-[0_0_100%] min-w-0 flex items-center justify-center'
        data-slot='carousel-slide'
        data-state={isActive ? "active" : "inactive"}
      >
        <Renderer file={file} makePreviewUrl={makePreviewUrl} makeUrl={makeUrl} isActive={isActive} />
      </div>
    </SlideProvider>
  )
}

CarouselSlide.displayName = "CarouselSlide"

export { CarouselSlide }
