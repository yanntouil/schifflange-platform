import { TranslateFn } from "@compo/translations"
import { Ui } from "@compo/ui"
import { A, D, G, MakePathTo, match, O, pipe, S, type ById, type Option } from "@compo/utils"
import { placeholder as servicePlaceholder, type Api } from "@services/dashboard"
import { FilesType } from "./types"

/**
 * getFlatOptions
 * @param currentId
 * @param allIds
 * @param byIds
 * @param deep
 * @param disabled
 * @param disabledId
 * @returns FlatOption[]
 */
export const getFlatOptions = (
  currentId: string | null,
  allIds: Api.MediaFolder[],
  byIds: ById<Api.MediaFolder>,
  deep: number,
  disabled: boolean,
  disabledId: string[]
): FlatOption[] => {
  return pipe(
    allIds,
    A.filter(({ parentId }) => parentId === currentId),
    A.sort((a, b) => a.name.localeCompare(b.name)),
    A.reduce([] as FlatOption[], (options, { id, name, parentId }) => {
      const isDisabled = disabled || A.includes(disabledId, id)
      if (parentId !== currentId || isDisabled) return options
      const option = {
        value: id,
        label: name,
        deep,
        disabled: isDisabled,
      }
      return [...options, option, ...getFlatOptions(id, allIds, byIds, deep + 1, isDisabled, disabledId)]
    })
  )
}
export type FlatOption = { value: string; label: string; deep: number; disabled: boolean }

/**
 * getFoldersPath
 * @param id
 * @param byIds
 * @returns Api.MediaFolder[]
 */
export const getFoldersPath = (id: string | null, byIds: ById<Api.MediaFolder>): Api.MediaFolder[] => {
  if (G.isNull(id)) return []
  const current = D.get(byIds, id)
  if (G.isNullable(current)) return []
  if (G.isNullable(current.parentId)) return [current]
  return [current, ...getFoldersPath(current.parentId, byIds)]
}

/**
 * makeFullName
 */
export const makeFullName = (item: Api.MediaFile) => {
  return item.originalName + (item.extension ? "." + item.extension : "")
}

/**
 * guards
 * @description Check if the item is a media file or a media folder
 * @param item
 * @returns boolean
 */
export const isMediaFile = <
  FI extends Api.MediaFile | Api.MediaFileWithRelations,
  FO extends Api.MediaFolder | Api.MediaFolderWithRelations | Api.MediaFolderWithContent,
>(
  item: FI | FO
): item is FI => {
  return G.isString((item as Api.MediaFile).extension)
}

/**
 * isMediaFolder
 * @description Check if the item is a media folder
 * @param item
 * @returns boolean
 */
export const isMediaFolder = <
  FI extends Api.MediaFile | Api.MediaFileWithRelations,
  FO extends Api.MediaFolder | Api.MediaFolderWithRelations | Api.MediaFolderWithContent,
>(
  item: FI | FO
): item is FO => {
  return !G.isString((item as Api.MediaFile).extension)
}

/**
 * typeToExtension
 * @description Convert the type to the extension
 * @param type
 * @returns string[]
 */
export const typeToExtension = (type?: FilesType) => {
  return match(type ? S.toLowerCase(type) : "")
    .with("image", () => ["jpg", "jpeg", "png", "gif", "webp", "svg"])
    .with("video", () => ["mp4", "webm", "ogg"])
    .with("audio", () => ["mp3", "wav", "ogg"])
    .with("document", () => ["doc", "docx", "xls", "xlsx", "ppt", "pptx"])
    .with("pdf", () => ["pdf"])
    .with("archive", () => ["zip", "rar", "tar", "gz", "7z"])
    .otherwise(() => [])
}

/**
 * extensionToType
 * @description Convert the extension to the type
 * @param extension
 * @returns FilesType | undefined
 */
export const extensionToType = (extension?: string): FilesType | undefined => {
  if (!extension) return undefined
  const ext = S.toLowerCase(extension)

  return match(ext)
    .with("jpg", "jpeg", "png", "gif", "webp", "svg", () => "image" as FilesType)
    .with("mp4", "webm", "ogg", () => "video" as FilesType)
    .with("mp3", "wav", () => "audio" as FilesType)
    .with("pdf", () => "pdf" as FilesType)
    .with("doc", "docx", "xls", "xlsx", "ppt", "pptx", () => "document" as FilesType)
    .with("zip", "rar", "tar", "gz", "7z", () => "archive" as FilesType)
    .otherwise(() => undefined)
}

/**
 * getThumbnail
 * @description Get the thumbnail of the file
 * @param file
 * @returns string | undefined
 */
export const getThumbnail = (file: Option<Api.MediaFile>) => {
  if (G.isNullable(file)) return undefined
  return file.thumbnailUrl || file.previewUrl || file.url
}

/**
 * getPreview
 * @description Get the preview of the file
 * @param file
 * @returns string | undefined
 */
export const getPreview = (file: Option<Api.MediaFile>) => {
  if (G.isNullable(file)) return undefined
  return file.previewUrl || file.url
}

/**
 * prepareSlide
 * @description Prepare the slide data
 * @param file
 * @returns SlideData | false
 */
export const prepareSlide = (
  file: Api.MediaFile,
  translate: TranslateFn,
  makePath: MakePathTo
): Ui.SlideData | false => {
  const { id, extension, url, previewUrl, thumbnailUrl } = file
  const { alt, name } = translate(file, servicePlaceholder.mediaFile)
  const src = makePath(url, true)
  const slideProps = {
    id,
    alt,
    downloadUrl: src,
    downloadFilename: name,
  }

  if (Ui.isImageExtension(extension))
    return {
      ...slideProps,
      type: "image",
      src,
      previewUrl: makePath(getPreview(file)) || src,
      thumbnailUrl: makePath(getThumbnail(file)) || src,
      width: file.width ?? undefined,
      height: file.height ?? undefined,
    }
  if (Ui.isVideoExtension(extension))
    return {
      ...slideProps,
      type: "video",
      sources: [{ src, type: Ui.videoTypeFromExtension(extension) }],
    }
  if (Ui.isPdfExtension(extension))
    return {
      ...slideProps,
      type: "pdf",
      src,
    }
  return false
}

/**
 * extractFile
 * @description Extract the file from the list of files
 * @param id
 * @param files
 * @returns Api.MediaFileWithRelations | undefined
 */
export const extractFile = (
  id: Option<string>,
  files: Api.MediaFileWithRelations[]
): Api.MediaFileWithRelations | undefined => {
  if (G.isNullable(id)) return undefined
  return A.find(files, ({ id: fileId }) => id === fileId) ?? undefined
}

/**
 * extractFile
 * @description Extract the file from the list of files
 * @param id
 * @param files
 * @returns Api.MediaFileWithRelations | undefined
 */
export const extractFiles = (ids: string[], files: Api.MediaFileWithRelations[]): Api.MediaFileWithRelations[] => {
  return A.filterMap(ids, (id) => {
    const file = A.find(files, ({ id: fileId }) => id === fileId)
    if (G.isNullable(file)) return O.None
    return O.Some(file)
  })
}
