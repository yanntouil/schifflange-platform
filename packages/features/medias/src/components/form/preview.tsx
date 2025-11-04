import { generateVideoUrl } from "@compo/form"
import { useContainerSize, useElementSize } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { useLanguage } from "@compo/translations"
import { Ui, variants } from "@compo/ui"
import { SrOnly } from "@compo/ui/src/components"
import { A, G, O, cxm, isUrlValid } from "@compo/utils"
import { type Api, placeholder as servicePlaceholder, useDashboardService } from "@services/dashboard"
import { FileText, PlaySquare, Popcorn } from "lucide-react"
import React from "react"
import ReactPlayer from "react-player"
import { extractFile } from "../../utils"

type VideoPreviewProps = {
  video: Api.Video
  files: Api.MediaFileWithRelations[]
}
export const VideoPreview: React.FC<VideoPreviewProps> = ({ video, files }) => {
  const { _ } = useTranslation(dictionary)
  const {
    service: { makePath },
  } = useDashboardService()
  const ref = React.useRef<HTMLDivElement>(null)
  const size = useContainerSize(ref as React.RefObject<HTMLElement>)

  const height = React.useMemo(() => {
    return Math.round(size.width * 0.5625)
  }, [size.width])

  // extract the cover file
  const cover = extractFile(video.cover, files)
  const coverUrl = cover ? makePath(cover.url, true) : undefined

  // Generate proper embed URL
  const embedUrl = React.useMemo(() => {
    if (video.type !== "embed") return ""

    // If we have service and id, generate the embed URL
    if (video.embed.service && video.embed.id) {
      const baseUrl = generateVideoUrl({ service: video.embed.service, id: video.embed.id })
      // For Dailymotion, we need to convert to embed URL
      if (video.embed.service === "dailymotion") {
        return baseUrl.replace("/video/", "/embed/video/")
      }
      return baseUrl
    }

    return video.embed.url
  }, [video.type, video.embed])

  // populate the sources and tracks with the files
  const sources = A.filterMap(video.hosted.sources, (source) => {
    const file = extractFile(source.file, files)
    if (G.isNullable(file)) return O.None
    return O.Some({ ...source, file: file })
  })
  const tracks = A.filterMap(video.hosted.tracks, (track) => {
    const file = extractFile(track.file, files)
    if (G.isNullable(file)) return O.None
    return O.Some({ ...track, file: file })
  })

  return (
    <div>
      <SrOnly>{_("preview-label")}</SrOnly>
      <div ref={ref} className='overflow-hidden rounded-lg border bg-muted'>
        {video.type === "embed" && embedUrl && isUrlValid(embedUrl) ? (
          <ReactPlayer url={embedUrl} width='100%' height={height} light={coverUrl} controls />
        ) : video.type === "hosted" && sources.length > 0 ? (
          <video
            controls
            poster={coverUrl}
            width='100%'
            height={height}
            className='bg-black'
            style={{ maxHeight: height }}
          >
            {sources.map((source, index) => {
              const src = source.file ? makePath(source.file.url, true) : source.url
              if (!src) return null
              return <source key={index} src={src} type={source.type} />
            })}
            {tracks.map((track, index) => {
              const src = track.file ? makePath(track.file.url, true) : track.url
              if (!src) return null
              return <track key={index} src={src} kind={track.type} srcLang={track.srclang} />
            })}
          </video>
        ) : (
          <div className={cxm(variants.buttonField({ className: "w-full" }))} style={{ height }}>
            <span className='relative' aria-hidden>
              <PlaySquare size={64} strokeWidth={0.5} />
              <span className='bg-muted absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full'>
                <Popcorn size={20} strokeWidth={1.4} />
              </span>
            </span>
            <p className='text-muted-foreground mt-4 text-sm'>{_("preview-empty")}</p>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * PdfPreview
 */
export const PdfPreview: React.FC<{ file: Api.MediaFileWithRelations; className?: string }> = ({ file, className }) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const size = useElementSize(ref)
  const {
    service: { makePath },
  } = useDashboardService()
  const { translate } = useLanguage()
  const translated = translate(file, servicePlaceholder.mediaFile)

  const pdf = (
    <Ui.PdfThumbnail
      data={{
        id: file.id,
        type: "pdf",
        src: makePath(file.url, true),
        downloadUrl: makePath(file.url, true),
        downloadFilename: translated.name,
      }}
      maxWidth={Math.min(size[0] || 200, 300)}
      maxHeight={Math.min(size[1] || 267, 400)}
    />
  )

  return (
    <div className={cxm("bg-primary/5 relative block w-full overflow-hidden p-4", className)}>
      {/* Background blur effect */}
      <div className='absolute inset-0 grid size-full overflow-hidden opacity-25 blur-[2px]' aria-hidden>
        <div className='flex scale-[200%] items-center justify-center'>{pdf}</div>
      </div>
      {/* Main PDF preview */}
      <div ref={ref} className='relative flex size-full max-h-full max-w-full items-center justify-center'>
        <div className='flex max-h-full max-w-full items-center justify-center'>{pdf}</div>
      </div>
      {/* Fallback when no preview */}
      <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
        <FileText className='text-muted-foreground/50 size-16' aria-hidden />
      </div>
    </div>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    preview: "Aperçu",
  },
  en: {
    preview: "Preview",
  },
  de: {
    preview: "Vorschau",
  },
}
