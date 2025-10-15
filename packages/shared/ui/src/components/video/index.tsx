import { useElementSize } from "@compo/hooks"
import { AlertTriangle, PlaySquare } from "lucide-react"
import * as React from "react"
import ReactPlayer, { type ReactPlayerProps } from "react-player"
import { G, Option, cx } from "@compo/utils"

/**
 * VideoFallback
 */
const VideoFallback = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & {
    ratio: string
  }
>(({ className, ratio, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cx("flex max-h-full max-w-full items-center justify-center bg-muted", ratio, className)}
    aria-hidden
    {...props}
  >
    {children ?? (
      <span className='relative' aria-hidden>
        <PlaySquare size={64} strokeWidth={0.5} />
        <AlertTriangle size={24} strokeWidth={1.4} className='absolute right-0 top-0 bg-muted' />
      </span>
    )}
  </div>
))

/**
 * Video
 */

export type VideoProps = Omit<ReactPlayerCleanProps, "url" | "src"> & {
  children?: React.ReactNode
  src?: Option<string>
  type?: string
  ratio?: string
  autoplay?: boolean
  className?: string
  classNames?: {
    wrapper?: string
    video?: string
    fallback?: string
  }
}
const Video = React.forwardRef<React.ElementRef<typeof ReactPlayer>, VideoProps>(
  (
    {
      children,
      classNames,
      className,
      src,
      controls = true,
      type = "video/mp4",
      ratio = "aspect-video",
      autoplay = false,
      ...props
    }: VideoProps,
    ref
  ) => {
    const [loadingError, setLoadingError] = React.useState(false)
    React.useEffect(() => setLoadingError(false), [src])
    const containerRef = React.useRef<HTMLDivElement>(null)
    const size = useElementSize(containerRef)
    // const [play, onPlay] = React.useState(autoplay)
    return (
      <div className={cx(classNames?.wrapper, ratio)} ref={containerRef}>
        {loadingError ? (
          <VideoFallback className={classNames?.fallback} ratio={ratio}>
            {children}
          </VideoFallback>
        ) : G.isNotNullable(src) ? (
          <ReactPlayer
            ref={ref}
            {...props}
            url={src}
            width={size[0]}
            height={size[1]}
            type={type}
            // playing={play}
            // onPlay={() => onPlay(true)}
            // onPause={() => onPlay(false)}
            controls={controls}
            className={cx(classNames?.video, "object-cover", className)}
            onError={() => setLoadingError(true)}
          />
        ) : (
          <VideoFallback className={classNames?.fallback} ratio={ratio}>
            {children}
          </VideoFallback>
        )}
      </div>
    )
  }
)
export { Video }

/**
 * ReactPlayerCleanProps
 * use to overide [otherProps: string]: any in ReactPlayerProps
 */
type ReactPlayerCleanProps = Pick<
  ReactPlayerProps,
  | "url"
  | "playing"
  | "loop"
  | "controls"
  | "config"
  | "volume"
  | "muted"
  | "playbackRate"
  | "width"
  | "height"
  | "style"
  | "progressInterval"
  | "playsinline"
  | "playIcon"
  | "previewTabIndex"
  | "pip"
  | "stopOnUnmount"
  | "light"
  | "fallback"
  | "wrapper"
  | "onReady"
  | "onStart"
  | "onPlay"
  | "onPause"
  | "onBuffer"
  | "onBufferEnd"
  | "onEnded"
  | "onClickPreview"
  | "onEnablePIP"
  | "onDisablePIP"
  | "onError"
  | "onDuration"
  | "onSeek"
  | "onProgress"
>
