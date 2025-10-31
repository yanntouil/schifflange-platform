import { libraries } from "."
import type { MediaFile, MediaFileWithRelations, Publication, Translatable, User } from "../../types"

// libraries
export type Library = {
  id: string
  workspaceId: string
  pin: boolean
  pinOrder: number
  parentLibraryId: string | null
  childLibraryCount: number
  documentCount: number
  createdAt: string
  createdById: string
  createdBy: User
  updatedAt: string
  updatedById: string
  updatedBy: User
} & Translatable<LibraryTranslation>

export type LibraryTranslation = {
  languageId: string
  title: string
  description: string
}

export type WithParentLibrary = {
  parentLibrary: Library | null
}

export type WithChildLibraries = {
  childLibraries: Library[]
}
export type WithDocuments = {
  documents: LibraryDocument[]
}

export type LibraryWithRelations = Library & WithParentLibrary & WithChildLibraries & WithDocuments

// library documents
export type LibraryDocument = {
  id: string
  libraryId: string
  reference: string
  workspaceId: string
  publicationId: string
  publication: Publication
  files: (MediaFileWithRelations & { code: string })[]
  trackingId: string
  createdAt: string
  createdById: string
  createdBy: User
  updatedAt: string
  updatedById: string
  updatedBy: User
} & Translatable<LibraryDocumentTranslation>

export type LibraryDocumentTranslation = {
  languageId: string
  title: string
  description: string
}

export type WithLibraryDocumentFiles = {
  files: MediaFile[]
}

export type LibraryDocumentWithRelations = LibraryDocument & WithLibraryDocumentFiles

export type LibrariesService = ReturnType<typeof libraries>
