import { useContainerSize, useElementSize } from "@compo/hooks"
import { LightboxProvider, useLightbox } from "@compo/lightbox"
import { useTranslation } from "@compo/localize"
import { useLanguage } from "@compo/translations"
import { Ui, variants } from "@compo/ui"
import { cxm } from "@compo/utils"
import { type Api, placeholder as servicePlaceholder, useDashboardService } from "@services/dashboard"
import { EllipsisVertical, FileText, Info, PlaySquare, Popcorn } from "lucide-react"
import React from "react"
import ReactPlayer from "react-player"
import { useHostedVideo } from "../../hooks/use-hosted-video"
import { extractFile, getEmbedUrl, getVideoRatio } from "../../utils"
import { FileInfoDialog } from "../dialogs"

type VideoPreviewProps = {
  video: Api.Video
  files: Api.MediaFileWithRelations[]
}
export const VideoPreview: React.FC<VideoPreviewProps> = ({ video, files }) => {
  const { _ } = useTranslation(dictionary)
  const {
    service: { makePath },
  } = useDashboardService()

  // get the container size and apply the video ratio
  const ref = React.useRef<HTMLDivElement>(null)
  const size = useContainerSize(ref as React.RefObject<HTMLElement>)
  const height = React.useMemo(() => Math.round(size.width * getVideoRatio(video)), [size.width, video])

  // extract the cover file
  const cover = extractFile(video.cover, files)
  const coverUrl = cover ? makePath(cover.url, true) : undefined

  // Generate proper embed URL
  const embedUrl = React.useMemo(() => getEmbedUrl(video), [video])

  // populate the sources and tracks with the files
  const { hasVideo, sources, tracks } = useHostedVideo(video, files)

  return (
    <div>
      <div ref={ref} className='overflow-hidden rounded-lg border bg-muted'>
        {embedUrl ? (
          <ReactPlayer url={embedUrl} width='100%' height={height} light={coverUrl} controls title={video.title} />
        ) : hasVideo ? (
          <video
            controls
            poster={coverUrl}
            width='100%'
            height={height}
            className='bg-black'
            style={{ maxHeight: height }}
            title={video.title}
          >
            {sources.map((source, index) => (
              <source key={index} src={makePath(source.file.url, true)} type={source.type} />
            ))}
            {tracks.map((track, index) => (
              <track key={index} src={makePath(track.file.url, true)} kind={track.type} srcLang={track.srclang} />
            ))}
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
  console.log("PdfPreview")
  const ref = React.useRef<HTMLDivElement>(null)
  const size = useElementSize(ref)
  const {
    service: { makePath },
  } = useDashboardService()
  const { translate } = useLanguage()
  const translated = translate(file, servicePlaceholder.mediaFile)
  const [onOpenInfo, fileInfoProps] = Ui.useQuickDialog<Api.MediaFileWithRelations>()

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
    <div className={cxm("bg-primary/5 relative block w-full overflow-hidden rounded-lg border p-4", className)}>
      {/* Background blur effect */}
      <div className='absolute inset-0 grid size-full overflow-hidden opacity-25 blur-[2px]' aria-hidden>
        <div className='flex scale-[200%] items-center justify-center'>{pdf}</div>
      </div>
      {/* Fallback when no preview */}
      <div className='pointer-events-none absolute inset-0 size-full flex items-center justify-center' aria-hidden>
        <FileText className='text-muted-foreground/50 size-16' />
      </div>
      {/* Main PDF preview */}
      <div ref={ref} className='relative flex size-full max-h-full max-w-full items-center justify-center'>
        <div className='flex max-h-full max-w-full items-center justify-center'>{pdf}</div>
      </div>
      <LightboxProvider makePreviewUrl={(path) => makePath(path, true)} makeUrl={(path) => makePath(path, true)}>
        <PreviewPdfMenu file={file} />
      </LightboxProvider>
    </div>
  )
}
const PreviewPdfMenu: React.FC<{ file: Api.MediaFileWithRelations }> = ({ file }) => {
  const { _ } = useTranslation(dictionary)
  const { translate } = useLanguage()
  const translated = translate(file, servicePlaceholder.mediaFile)
  const {
    service: { makePath },
  } = useDashboardService()

  const { registerFile, displayPreview, hasPreview } = useLightbox()
  React.useEffect(() => {
    registerFile({
      id: file.id,
      type: "pdf",
      path: file.url,
      title: translated.name,
      downloadUrl: makePath(file.url, true),
      downloadFilename: translated.name,
    })
  }, [registerFile, file])

  const [info, infoProps] = Ui.useQuickDialog<Api.MediaFileWithRelations>()

  return (
    <>
      <Ui.DropdownMenu.Quick
        menu={
          <>
            <Ui.DropdownMenu.Item onClick={() => info(file)}>
              <Info aria-hidden />
              {_("info")}
            </Ui.DropdownMenu.Item>
            {hasPreview(file.id) && (
              <Ui.DropdownMenu.Item onClick={() => displayPreview(file.id)}>
                <PlaySquare aria-hidden />
                {_("preview")}
              </Ui.DropdownMenu.Item>
            )}
          </>
        }
        align='start'
        side='left'
      >
        <Ui.Button variant='overlay' size='xxs' icon className='absolute top-2 right-2 backdrop-blur'>
          <EllipsisVertical aria-hidden />
          <Ui.SrOnly>{_("more")}</Ui.SrOnly>
        </Ui.Button>
      </Ui.DropdownMenu.Quick>
      <FileInfoDialog {...infoProps} />
    </>
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
