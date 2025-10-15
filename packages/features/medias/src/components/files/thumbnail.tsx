import { useLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { cxm } from "@compo/utils"
import { useElementSize } from "@reactuses/core"
import { type Api, placeholder as servicePlaceholder, useDashboardService } from "@services/dashboard"
import React from "react"
import { isImage, isPdf } from "./utils"

/**
 * FileThumbnail
 */
export const FileThumbnail: React.FC<{ file: Api.MediaFileWithRelations; className?: string }> = ({
  file,
  className,
}) => {
  const { extension, url } = file
  if (extension === "svg") return <RenderSvg file={file} className={className} />
  if (isPdf(extension)) return <RenderPdf file={file} className={className} />
  if (isImage(extension)) return <RenderImage file={file} className={className} />
  return <RenderFile file={file} className={className} />
}

const RenderPdf: React.FC<{ file: Api.MediaFileWithRelations; className?: string }> = ({ file, className }) => {
  const { url } = file
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
        src: makePath(url, true),
        downloadUrl: makePath(url, true),
        downloadFilename: translated.name,
      }}
      maxWidth={size[0]}
      maxHeight={size[1]}
    />
  )
  return (
    <span className='bg-primary/5 relative block aspect-square w-full p-4 pb-[72px]'>
      <div className='absolute inset-0 grid size-full opacity-25 blur-[2px]' aria-hidden>
        <div className='scale-[200%]'>{pdf}</div>
      </div>
      <div ref={ref} className='relative size-full'>
        {pdf}
      </div>
    </span>
  )
}
const RenderSvg: React.FC<{ file: Api.MediaFileWithRelations; className?: string }> = ({ file, className }) => {
  const {
    service: { getImageUrl },
  } = useDashboardService()
  return (
    <Ui.Image
      src={getImageUrl(file, "thumbnail") ?? ""}
      classNames={{
        wrapper: cxm("flex aspect-square w-full p-4 pb-[72px] items-center justify-center bg-primary/5", className),
        image: "size-auto max-h-full max-w-full",
        fallback: "size-full",
      }}
    />
  )
}
const RenderImage: React.FC<{ file: Api.MediaFileWithRelations; className?: string }> = ({ file, className }) => {
  const {
    service: { getImageUrl },
  } = useDashboardService()
  return (
    <span className='relative block aspect-square w-full p-4 pb-[72px]'>
      <Ui.Image
        src={getImageUrl(file, "thumbnail") ?? ""}
        classNames={{
          wrapper: cxm("absolute inset-0 flex size-full items-center justify-center", className),
          image: "object-cover object-center opacity-25 size-full",
        }}
      />
      <Ui.Image
        src={getImageUrl(file, "preview") ?? ""}
        classNames={{
          wrapper: cxm("relative flex size-full items-center justify-center", className),
          image: "size-auto max-h-full max-w-full border-4 border-card shadow-sm bg-card",
          fallback: "size-full",
        }}
      />
    </span>
  )
}
const RenderFile: React.FC<{ file: Api.MediaFileWithRelations; className?: string }> = ({ file, className }) => {
  const { extension } = file
  const { background, foreground, icon } = Ui.getExtensionColors(extension) || {}
  return (
    <span
      className={cxm("relative flex aspect-square w-full items-center justify-center p-4 pb-[72px]", className)}
      style={{ backgroundColor: background, color: foreground }}
    >
      {Ui.isFileExtensionIcon(extension) && (
        <Ui.FileIcon extension={extension} style={{ color: icon }} className='size-12 stroke-[1]' />
      )}
    </span>
  )
}
