import { useLanguage } from "@compo/translations"
import { Ui } from "@compo/ui"
import { cxm } from "@compo/utils"
import { type Api, placeholder as servicePlaceholder, useDashboardService } from "@services/dashboard"
import { ImageOff } from "lucide-react"
import React from "react"
import { isImage, isPdf } from "./utils"

/**
 * FileIcon
 */
export const FilePreview: React.FC<{ file: Api.MediaFileWithRelations; className?: string }> = ({
  file,
  className,
}) => {
  const {
    service: { makePath, getImageUrl },
  } = useDashboardService()
  const { extension, url } = file
  if (extension === "svg")
    return (
      <span className={cxm("flex size-8 items-center justify-center", className)}>
        <img src={makePath(url, true)} className='max-h-full max-w-full' />
      </span>
    )
  if (isPdf(extension)) return <Ui.PdfIcon aria-hidden url={makePath(url, true)} />
  if (isImage(extension))
    return (
      <Ui.Image
        src={getImageUrl(file, "preview") ?? ""}
        className={cxm("size-8 rounded object-cover object-center", className)}
      >
        <ImageOff className='text-muted-foreground/50 size-3' />
      </Ui.Image>
    )

  // display file icon
  const { background, foreground, icon } = Ui.getExtensionColors(extension) || {}
  return (
    <span
      className={cxm("relative flex size-8 items-center justify-center rounded pb-1", className)}
      style={{ backgroundColor: background, color: foreground }}
    >
      {Ui.isFileExtensionIcon(extension) && (
        <Ui.FileIcon extension={extension} style={{ color: icon }} className='size-4 stroke-[1]' />
      )}
      <div className='absolute right-0 bottom-0 left-0 flex items-center justify-center text-[7px]/[1.6] font-medium'>
        {extension}
      </div>
    </span>
  )
}

/**
 * FileThumbnail
 */
export const FileThumbnail2: React.FC<{ file: Api.MediaFileWithRelations; className?: string }> = ({
  file,
  className,
}) => {
  const { extension, url } = file
  const {
    service: { makePath, getImageUrl },
  } = useDashboardService()
  const { translate } = useLanguage()
  if (extension === "svg")
    return (
      <Ui.Image
        src={getImageUrl(file, "preview") ?? ""}
        classNames={{
          wrapper: cxm("flex aspect-square w-full p-4 pb-16 items-center justify-center", className),
          image: "size-auto max-h-full max-w-full",
          fallback: "size-full",
        }}
      />
    )
  if (isPdf(extension))
    return (
      <span className='relative block aspect-square w-full p-4 pb-16'>
        <Ui.PdfThumbnail
          data={{
            id: file.id,
            type: "pdf",
            src: makePath(url, true),
            downloadUrl: makePath(url, true),
            downloadFilename: translate(file, servicePlaceholder.mediaFile).name,
          }}
          maxWidth={300}
          maxHeight={300}
        />
      </span>
    )

  if (isImage(extension))
    return (
      <span className='relative block aspect-square w-full p-4 pb-16'>
        <Ui.Image
          src={getImageUrl(file, "preview") ?? ""}
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

  // display file icon
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
