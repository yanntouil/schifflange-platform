/**
 * VideoSlideRenderer
 * Renders a video slide with HTML5 video player
 */

import React from "react"
import type { SlideRendererProps, VideoFile } from "../../types"

/**
 * Video slide renderer with thumbnail preview and HTML5 player
 */
export const VideoSlide = React.memo<SlideRendererProps<VideoFile>>(({ file, makePreviewUrl, makeUrl, isActive }) => {
  const [hasError, setHasError] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)

  const videoUrl = makeUrl(file.path)
  const thumbnailUrl = file.thumbnailPath ? makePreviewUrl(file.thumbnailPath) : undefined

  if (hasError) {
    return (
      <div className='flex items-center justify-center w-full h-full'>
        <div className='text-center text-white/70'>
          <p className='text-lg mb-2'>Failed to load video</p>
          <p className='text-sm'>{file.title}</p>
        </div>
      </div>
    )
  }

  return (
    <div className='flex items-center justify-center w-full h-full'>
      {isLoading && (
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='w-16 h-16 border-4 border-white/20 border-t-white/80 rounded-full animate-spin' />
        </div>
      )}

      <video
        src={videoUrl}
        controls
        controlsList='nodownload'
        poster={thumbnailUrl}
        className='max-w-full max-h-full'
        preload={isActive ? "metadata" : "none"}
        onLoadedData={() => setIsLoading(false)}
        onError={() => {
          setHasError(true)
          setIsLoading(false)
        }}
      >
        <source src={videoUrl} type={file.videoType} />
        Your browser does not support the video tag.
      </video>
    </div>
  )
})

VideoSlide.displayName = "VideoSlide"
