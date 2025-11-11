/**
 * ImageSlideRenderer
 * Renders an image slide with progressive loading and zoom support
 */

import { useTranslation } from "@compo/localize"
import React from "react"
import type { ImageFile, SlideRendererProps } from "../../types"
import { useSlide } from "../slide"
import { Toolbar } from "../slide/toolbar"
import { Transform } from "../transform"

/**
 * Image slide renderer with blurred background and contain mode
 * Similar to PdfPreview - best of both worlds for format recognition
 */
export const ImageSlide = React.memo<SlideRendererProps<ImageFile>>(({ file, makePreviewUrl, makeUrl, isActive }) => {
  const { _ } = useTranslation(dictionary)
  const slide = useSlide()
  const [imageLoaded, setImageLoaded] = React.useState(false)
  const [hasError, setHasError] = React.useState(false)

  const previewUrl = file.previewPath ? makePreviewUrl(file.previewPath) : null
  const fullUrl = makeUrl(file.path)

  if (hasError) {
    return (
      <div className='flex items-center justify-center w-full h-full'>
        <div className='text-center text-white/70'>
          <p className='text-lg mb-2'>{_("image-failed")}</p>
          <p className='text-sm'>{file.title}</p>
        </div>
      </div>
    )
  }
  const style = {
    "--image-aspect-ratio": `${file.width}/${file.height}`,
    "--image-width": `${Math.round(file.width)}px`,
    "--image-height": `${Math.round(file.height)}px`,
  } as React.CSSProperties

  return (
    <div className='size-full' data-slot='image-slide' style={style}>
      {/* Background blurred preview (like PdfPreview) */}
      {previewUrl && (
        <div
          data-slot='image-slide-background'
          className='absolute inset-0 w-full h-full overflow-hidden opacity-10 blur-[2px]'
          aria-hidden
        >
          <div className='flex items-center justify-center w-full h-full scale-[200%]'>
            <img src={previewUrl} alt='' className='w-full h-full object-cover' />
          </div>
        </div>
      )}
      {/* Main image with zoom - object-contain to preserve aspect ratio */}
      <Transform.Root {...slide.transform}>
        <Transform.Content>
          <div className='relative'>
            <img
              src={fullUrl}
              alt={file.title}
              className="max-w-[var(--transform-bounds-width)] max-h-[var(--transform-bounds-height)] w-auto h-auto data-[state='loaded']:opacity-100 opacity-25 transition-opacity"
              data-state={imageLoaded ? "loaded" : "pending"}
              loading={isActive ? "eager" : "lazy"}
              width={file.width}
              height={file.height}
              onLoad={() => setImageLoaded(true)}
              onError={() => setHasError(true)}
            />

            {/* Loading skeleton */}
            {!imageLoaded && (
              <div
                className='absolute inset-0 m-auto bg-white/10 animate-pulse rounded'
                style={{
                  aspectRatio: `${file.width} / ${file.height}`,
                  maxWidth: "100%",
                  maxHeight: "100%",
                }}
              />
            )}
          </div>
        </Transform.Content>
        <Toolbar>
          <Transform.Controls />
        </Toolbar>
      </Transform.Root>
    </div>
  )
})

ImageSlide.displayName = "ImageSlideRenderer"

/**
 * translations
 */
const dictionary = {
  fr: {
    "image-failed": "Échec du chargement de l'image",
  },
  en: {
    "image-failed": "Failed to load image",
  },
  de: {
    "image-failed": "Fehler beim Laden der Bild",
  },
}
