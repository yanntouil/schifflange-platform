/**
 * ThumbnailStrip
 * Horizontal scrollable thumbnail strip using Embla Carousel
 */

import useEmblaCarousel from "embla-carousel-react"
import React from "react"
import type { RegisteredFile } from "../types"
import { useLightboxContext } from "./lightbox.context"

type ThumbnailsProps = {
  /** List of files to display */
  files: RegisteredFile[]
  /** Current active index */
  currentIndex: number
  /** Callback when thumbnail is clicked */
  onThumbnailClick: (index: number) => void
}

/**
 * Thumbnail strip component with auto-scroll to keep active thumbnail visible
 */
export const Thumbnails: React.FC<ThumbnailsProps> = ({ files, currentIndex, onThumbnailClick }) => {
  const { makePreviewUrl, makeUrl, thumbnailRenderers } = useLightboxContext()

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    containScroll: "trimSnaps",
    dragFree: true,
  })

  // Auto-scroll to keep active thumbnail visible
  React.useEffect(() => {
    if (!emblaApi) return
    emblaApi.scrollTo(currentIndex, false)
  }, [emblaApi, currentIndex])

  if (files.length <= 1) {
    return null
  }

  const thumbnailHeight = "5rem" // Height including padding and container
  const style = {
    "--thumbnail-width": "4rem",
    "--thumbnail-height": thumbnailHeight,
  } as React.CSSProperties

  return (
    <div className='absolute bottom-0 inset-x-0 w-full px-2 pb-2' style={style} data-slot='thumbnails'>
      <div
        className='w-max max-w-3xl mx-auto py-2 rounded-lg overflow-hidden bg-zinc-900/95 backdrop-blur-sm'
        ref={emblaRef}
      >
        <div className='flex gap-2 px-2'>
          {files.map((file, index) => {
            const Renderer = thumbnailRenderers[file.type] as any
            const isActive = index === currentIndex

            if (!Renderer) {
              return (
                <div
                  key={file.id}
                  className='shrink-0 size-[var(--thumbnail-width)] bg-white/10 rounded flex items-center justify-center text-white/50 text-xs'
                >
                  ?
                </div>
              )
            }

            return (
              <Renderer
                key={file.id}
                file={file}
                makePreviewUrl={makePreviewUrl}
                makeUrl={makeUrl}
                isActive={isActive}
                onClick={() => onThumbnailClick(index)}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
