import { MakeRequestOptions } from "../../types"

/**
 * queries
 */
export type Libraries = MakeRequestOptions<
  "createdAt" | "updatedAt",
  {
    //
  }
>

export type LibraryDocuments = MakeRequestOptions<
  "createdAt" | "updatedAt" | "reference",
  {
    //
  }
>

/**
 * payloads
 */
export type CreateLibrary = {
  parentLibraryId?: string | null
  translations?: Record<string, { title?: string; description?: string }>
}

export type UpdateLibrary = CreateLibrary

export type CreateLibraryDocument = {
  reference: string
  files?: Array<{ fileId: string; code?: string | null }>
  translations?: Record<string, { title?: string; description?: string }>
}

export type UpdateLibraryDocument = {
  reference?: string
  files?: Array<{ fileId: string; code: string }>
  translations?: Record<string, { title?: string; description?: string }>
}
