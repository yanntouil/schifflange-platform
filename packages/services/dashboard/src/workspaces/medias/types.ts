import { medias } from "."
import { Aspect, Coord, Size, Translatable, User } from "../../types"

/**
 * MediaFolder types
 */
export type MediaFolder = {
  id: string
  name: string
  lock: boolean
  parentId: string | null
  createdById: string | null
  createdAt: string
  updatedById: string | null
  updatedAt: string
}
export type WithMediaFolder = {
  folders: MediaFolderWithRelations[]
}
export type WithMediaFiles = {
  files: MediaFileWithRelations[]
}
export type WithMediaCreator = {
  createdBy: User | null
}
export type WithMediaUpdater = {
  updatedBy: User | null
}
export type MediaFolderWithRelations = MediaFolder & WithMediaCreator & WithMediaUpdater
export type MediaFolderWithContent = MediaFolderWithRelations & WithMediaFiles & WithMediaFolder

/**
 * MediaFile types
 */
export type MediaFile = {
  id: string
  size: number
  width: number | null
  height: number | null
  extension: string
  originalName: string
  exif: Record<string, any>
  copyright: string
  copyrightLink: string
  url: string
  thumbnailUrl: string
  previewUrl: string
  originalUrl: string
  transform: Transform | {}
  folderId: string | null
  createdById: string | null
  createdAt: string
  updatedById: string | null
  updatedAt: string
} & Translatable<MediaFileTranslation>
export type MediaFileTranslation = {
  id: string
  languageId: string
  name: string
  caption: string
  alt: string
}

export type MediaFileWithRelations = MediaFile & WithMediaCreator & WithMediaUpdater
export type MediaWithRelations = MediaFolderWithRelations | MediaFileWithRelations

export type Transform = Size &
  Coord & {
    rotate: number
    cropper: Cropper
  }

export type Cropper = {
  zoom: number
  crop: Coord
  aspect: Aspect
}
export type MediaService = ReturnType<typeof medias>
