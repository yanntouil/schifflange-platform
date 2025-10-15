import { MediaFile } from "../medias/types"

/**
 * seo
 */
export type Seo = {
  id: string
  path: string
  files: MediaFile[]
  translations: SeoTranslations
}
export type SeoTranslations = {
  title: string
  description: string
  keywords: string[]
  socials: SeoSocial[]
  image: MediaFile | null
}
export type SeoSocial = {
  type: string
  title: string
  description: string
  image: MediaFile | null
}
export type WithSeo = {
  seo: Seo
}
