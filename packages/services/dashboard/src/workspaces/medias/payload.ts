import { Transform } from "./types"

/**
 * Folder payloads
 */
export type CreateFolder = {
  name: string
  parentId?: string | null
  lock?: boolean
}

export type UpdateFolder = {
  name?: string
  parentId?: string | null
  lock?: boolean
}

/**
 * File payloads
 */
export type CreateFile = {
  file: File
  folderId?: string | null
}

export type UpdateFile = {
  file?: File
  folderId?: string | null
  copyright?: string
  copyrightLink?: string
  translations?: Record<string, {
    name?: string
    caption?: string
    alt?: string
  }>
}

export type CropFile = {
  transform: Transform
}