/**
 * Types
 */

export type SlideImage = {
  id: string
  type: "image"
  src: string
  alt: string
  width?: number
  height?: number
  thumbnailUrl: string
  previewUrl: string
  downloadUrl: string
  downloadFilename: string
}

export type SlideVideo = {
  id: string
  type: "video"
  downloadUrl: string
  downloadFilename: string
  sources: {
    type: string | undefined
    src: string
  }[]
}

export type SlidePdf = {
  id: string
  type: "pdf"
  src: string
  downloadUrl: string
  downloadFilename: string
}

export type DataResource = { src: string; title: string }
export type SlideData = SlideVideo | SlideImage | SlidePdf
