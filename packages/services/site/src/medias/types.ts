/**
 * medias
 */
export type MediaFile = {
  id: string
  height: number
  width: number
  size: number
  extension: string
  url: string
  thumbnailUrl: string
  previewUrl: string
  translations: MediaFileTranslations
  copyright: string
  copyrightLink: string
}
export type MediaFileTranslations = {
  name: string
  alt: string
  caption: string
}
