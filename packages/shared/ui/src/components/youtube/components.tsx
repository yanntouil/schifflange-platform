import { Translation, useTranslation } from "@compo/localize"
import { Play, X } from "lucide-react"
import React from "react"
import { cxm } from "@compo/utils"
import { Button } from "../button"
import { Image } from "../image"
import { SrOnly } from "../sr-only"
/**
 * YoutubeThumbnail
 */
export const YoutubeThumbnail: React.FC<Props> = (props) => {
  return (
    <div className={cxm("group/youtube relative aspect-video w-full", props.className)}>
      <Image
        src={`https://img.youtube.com/vi/${props.videoId}/0.jpg`}
        alt={props.title}
        className='absolute inset-0 size-full object-cover'
      />
      <div className='absolute inset-0 flex size-full items-center justify-center bg-foreground/50 backdrop-blur-sm'>
        <Play className='size-5 text-background' aria-hidden='true' />
      </div>
    </div>
  )
}

/**
 * Youtube
 */
export const Youtube: React.FC<Props & { children?: React.ReactNode }> = ({ children, ...props }) => {
  const { _ } = useTranslation(dictionary)

  const options = { ...defaultOptions, ...props.options }
  const [playing, setPlaying] = React.useState(options.autoplay)
  const onStop: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation()
    setPlaying(false)
  }
  const onPlay: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation()
    setPlaying(true)
  }
  return (
    <div className='group/youtube relative aspect-video w-full'>
      {playing ? (
        <>
          <YoutubeIFrame {...props} options={{ ...options, autoplay: true }} />
          <Button
            variant='ghost'
            size='sm'
            className='absolute right-2 top-2 opacity-0 group-hover/youtube:opacity-100'
            icon
            onClick={onStop}
          >
            <X className='size-5' aria-hidden='true' />
            <SrOnly>{_("ui.youtube.stop-video", { title: props.title })}</SrOnly>
          </Button>
        </>
      ) : (
        <>
          <Image
            src={`https://img.youtube.com/vi/${props.videoId}/0.jpg`}
            alt={props.title}
            className='absolute inset-0 size-full object-cover'
          />
          <div className='absolute inset-0 flex size-full items-center justify-center bg-black/50 backdrop-blur-sm'>
            <Button variant='ghost' icon onClick={onPlay}>
              <Play className='size-5' aria-hidden='true' />
              <SrOnly>{_("ui.youtube.play-video", { title: props.title })}</SrOnly>
            </Button>
          </div>
          {children}
        </>
      )}
    </div>
  )
}

/**
 * YoutubeIFrame
 */
type Props = {
  videoId: string
  title: string
  className?: string
  options?: Partial<YoutubeOptions>
}
export const YoutubeIFrame: React.FC<Props> = (props) => {
  const { videoId, title, className } = props
  const options = { ...defaultOptions, ...props.options }
  const autoplay = options.autoplay
  const videoURL = `https://www.youtube-nocookie.com/embed/${videoId}${autoplay ? "?autoplay=1" : ""}`
  const iframeRef = React.useRef<HTMLIFrameElement>(null)
  const defaultHeight = 495
  const [videoHeight, setVideoHeight] = React.useState<number>(
    iframeRef.current ? iframeRef.current.offsetWidth * 0.5625 : defaultHeight
  )

  const handleChangeVideoWidth = React.useCallback(() => {
    const ratio = window.innerWidth > 990 ? 1.0 : window.innerWidth > 522 ? 1.2 : window.innerWidth > 400 ? 1.45 : 1.85
    const height = iframeRef.current ? iframeRef.current.offsetWidth * 0.5625 : defaultHeight
    return setVideoHeight(Math.floor(height * ratio))
  }, [])

  React.useEffect(() => {
    window.addEventListener("resize", handleChangeVideoWidth)
    const ratio = window.innerWidth > 990 ? 1.0 : window.innerWidth > 522 ? 1.2 : window.innerWidth > 400 ? 1.45 : 1.85
    const height = iframeRef.current ? iframeRef.current.offsetWidth * 0.5625 : defaultHeight
    setVideoHeight(Math.floor(height * ratio))
    return function cleanup() {
      window.removeEventListener("resize", handleChangeVideoWidth)
    }
  }, [videoHeight, handleChangeVideoWidth])

  const [error, setError] = React.useState(false)
  React.useEffect(() => {
    setError(false)
  }, [videoId])

  return (
    <iframe
      ref={iframeRef}
      title={title}
      className={cxm("w-full", className)}
      style={{ height: `${videoHeight}px` }}
      width='100%'
      height={`${videoHeight}px`}
      src={videoURL}
      onError={() => setError(true)}
      {...optionsToProps(options)}
    />
  )
}

/**
 * Default options for the youtube iframe
 */
const defaultOptions: YoutubeOptions = {
  autoplay: false,
  clipboardWrite: true,
  encryptedMedia: true,
  gyroscope: true,
  pictureInPicture: true,
  fullscreen: true,
}

/**
 * Convert the options object to the props for the iframe
 */
const optionsToProps = (options: YoutubeOptions) => {
  let allow = "accelerometer;"

  // Check each option and add to the allow string if true
  if (options.autoplay) allow += " autoplay;"
  if (options.clipboardWrite) allow += " clipboard-write;"
  if (options.encryptedMedia) allow += " encrypted-media;"
  if (options.gyroscope) allow += " gyroscope;"
  if (options.pictureInPicture) allow += " picture-in-picture;"

  // Determine the allowFullScreen attribute based on the fullscreen option
  const allowFullScreen = options.fullscreen

  return { allowFullScreen, allow }
}

/**
 * types
 */
type YoutubeOptions = {
  autoplay: boolean
  clipboardWrite: boolean
  encryptedMedia: boolean
  gyroscope: boolean
  pictureInPicture: boolean
  fullscreen: boolean
}

const dictionary = {
  fr: {
    ui: {
      youtube: {
        playVideo: "Lire la vidéo",
        stopVideo: "Arrêter la vidéo",
      },
    },
  },
  en: {
    ui: {
      youtube: {
        playVideo: "Play the video",
        stopVideo: "Stop the video",
      },
    },
  },
  de: {
    ui: {
      youtube: {
        playVideo: "Video abspielen",
        stopVideo: "Video stoppen",
      },
    },
  },
} satisfies Translation
