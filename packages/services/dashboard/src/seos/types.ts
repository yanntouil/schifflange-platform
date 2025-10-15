import { seo } from "."
import { MediaFile, Translatable } from "../types"

export type Seo = {
  id: string
  files: MediaFile[] // used in socials
  workspaceId: string
  createdAt: string
  updatedAt: string
} & Translatable<SeoTranslation>

export type SeoTranslation = {
  languageId: string
  title: string
  description: string
  keywords: string[]
  imageId: string | null
  image: MediaFile | null
  socials: SeoSocial[]
}

export type SeoSocial = {
  type: string
  title: string
  description: string
  imageId: string | null // ref in Seo.files
}

export type WithSeo = {
  seo: Seo
}

export type SeoService = ReturnType<typeof seo>
