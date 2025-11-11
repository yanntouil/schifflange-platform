/**
 * ImageThumbnail
 * Renders a clickable image thumbnail
 */

import React from "react"
import type { ImageFile, ThumbnailRendererProps } from "../../types"

/**
 * Image thumbnail renderer
 */
export const ImageThumbnail = React.memo<ThumbnailRendererProps<ImageFile>>(
  ({ file, makePreviewUrl, makeUrl, isActive, onClick }) => {
    const thumbnailUrl = file.previewPath ? makePreviewUrl(file.previewPath) : makeUrl(file.path)

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
        <img
          src={thumbnailUrl}
          className='size-full object-cover absolute inset-0 opacity-25 blur-[2px] pointer-events-none scale-[150%] transform-origin-center'
          loading='lazy'
          aria-hidden
        />
        <img src={thumbnailUrl} alt={file.title} className='size-full object-contain relative' loading='lazy' />
      </button>
    )
  }
)

ImageThumbnail.displayName = "ImageThumbnail"
