/**
 * VideoThumbnail
 * Renders a clickable video thumbnail with play icon overlay
 * Captures first frame of video if no thumbnail provided
 */

import { Play } from "lucide-react"
import React from "react"
import type { ThumbnailRendererProps, VideoFile } from "../../types"

/**
 * Video thumbnail renderer with automatic first frame capture
 */
export const VideoThumbnail = React.memo<ThumbnailRendererProps<VideoFile>>(
  ({ file, makeUrl, makePreviewUrl, isActive, onClick }) => {
    const videoRef = React.useRef<HTMLVideoElement>(null)
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const [capturedFrame, setCapturedFrame] = React.useState<string | null>(null)
    const [isLoading, setIsLoading] = React.useState(true)
    const [hasError, setHasError] = React.useState(false)

    const thumbnailUrl = file.thumbnailPath ? makePreviewUrl(file.thumbnailPath) : null
    const videoUrl = makeUrl(file.path)

    React.useEffect(() => {
      // If we have a thumbnail, no need to capture video frame
      if (thumbnailUrl) {
        setIsLoading(false)
        return
      }

      const video = videoRef.current
      const canvas = canvasRef.current
      if (!video || !canvas) return

      const captureFrame = () => {
        try {
          if (video.videoWidth === 0 || video.videoHeight === 0) {
            setHasError(true)
            setIsLoading(false)
            return
          }

          // Set canvas size to match video
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight

          // Draw current frame to canvas
          const ctx = canvas.getContext("2d")
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
            // Convert canvas to data URL
            const frame = canvas.toDataURL("image/jpeg", 0.8)
            setCapturedFrame(frame)
            setIsLoading(false)
          }
        } catch (error) {
          setHasError(true)
          setIsLoading(false)
        }
      }

      const handleCanPlay = () => {
        // Seek to a better frame
        const targetTime = Math.min(0.5, video.duration / 4)
        if (targetTime > 0) {
          video.currentTime = targetTime
        } else {
          // Short video, just capture first frame
          captureFrame()
        }
      }

      const handleSeeked = () => {
        captureFrame()
      }

      const handleError = () => {
        setHasError(true)
        setIsLoading(false)
      }

      video.addEventListener("canplay", handleCanPlay)
      video.addEventListener("seeked", handleSeeked)
      video.addEventListener("error", handleError)

      return () => {
        video.removeEventListener("canplay", handleCanPlay)
        video.removeEventListener("seeked", handleSeeked)
        video.removeEventListener("error", handleError)
      }
    }, [thumbnailUrl, videoUrl])

    const thumbnailSrc = thumbnailUrl || capturedFrame

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
        {/* Hidden video element for frame capture */}
        {!thumbnailUrl && (
          <>
            <video
              ref={videoRef}
              src={videoUrl}
              className='hidden'
              muted
              playsInline
              preload='auto'
              crossOrigin='anonymous'
            />
            <canvas ref={canvasRef} className='hidden' />
          </>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className='absolute inset-0 flex items-center justify-center w-full h-full z-10 bg-black/50'>
            <div className='w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin' />
          </div>
        )}

        {/* Thumbnail or fallback */}
        {thumbnailSrc ? (
          <img src={thumbnailSrc} alt={file.title} className='w-full h-full object-contain' loading='lazy' />
        ) : hasError ? (
          <div className='w-full h-full bg-black/50 flex items-center justify-center'>
            <span className='text-white/50 text-xs'>Video</span>
          </div>
        ) : null}

        {/* Play icon overlay */}
        <div
          className='absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none text-white [&>svg]:size-4 [&>svg]:stroke-[0.8]'
          aria-hidden
        >
          <Play />
        </div>
      </button>
    )
  }
)

VideoThumbnail.displayName = "VideoThumbnail"
