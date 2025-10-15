export type FormFileType = File | SynteticFile
export type SynteticFile = {
  id: string
  name: string
  extension: string
  size: number
  url: string
  delete: boolean
}
export type NormalizedFile = {
  name: string
  extension: string
  size: number
  url: string
  delete: boolean
}
export type FormSimpleFileType = {
  file: File | null
  url: string | null
  delete: boolean
}
export type FormMediasTransform = {
  width: number
  height: number
  x: number
  y: number
  rotate: number
  cropper: {
    zoom: number
    crop: FormCrop
    aspect: FormAspect
  }
}
export type FormAspect = {
  w: number
  h: number
}
export type FormCrop = {
  x: number
  y: number
}
export type FormExtraField = {
  name: string
  value: string
}
export type FormSingleFile = {
  url: string
  size: number
  extension: string
}
export type FormSingleImage = FormSingleFile & {
  thumbnailUrl: string
  previewUrl: string
  originalUrl: string
}
