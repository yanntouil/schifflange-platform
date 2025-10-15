import { service } from "@/service"
import { A, O, match, slugify, type Option } from "@compo/utils"
import { type Api } from "@services/site"
import { saveAs } from "file-saver"
import { DataResource, SlideData, SlideImage, SlidePdf, SlideVideo } from "./types"

/**
 * helpers
 */
export const isLightboxExtension = (extension: string) =>
  isVideoExtension(extension) || isImageExtension(extension) || isPdfExtension(extension)
export const isImageExtension = (extension: string) => A.includes(imageExtensions, extension)
export const isSharpExtension = (extension: string) => A.includes(sharpExtensions, extension)
export const isVideoExtension = (extension: string) => A.includes(videoExtensions, extension)
export const isPdfExtension = (extension: string) => A.includes(pdfExtensions, extension)
export const videoTypeFromExtension = (extension: string) => {
  if (extension === "mp4") return "video/mp4"
  if (extension === "ogg") return "video/ogg"
  return "video/webm"
}

/**
 * constants
 */
export const imageExtensions = ["apng", "avif", "gif", "jpg", "jpeg", "jfif", "pjpeg", "pjp", "png", "svg", "webp"]
export const sharpExtensions = ["jpeg", "jpg", "png", "webp", "tiff", "tif", "gif", "heif", "heic", "raw"]
export const pdfExtensions = ["pdf"]
export const documentExtensions = ["pdf", "doc", "docx"]
export const videoExtensions = ["ogg", "mp4", "webm"]

/**
 * Get slide data save resource
 */

export const getSlideSaveResource = (data: SlideData): null | DataResource => {
  return match(data)
    .with({ type: "image" }, (data) => ({ src: data.src, title: data.alt ?? "" }))
    .with({ type: "pdf" }, (data) => ({ src: data.src, title: "pdf" }))
    .with({ type: "video" }, (data) => {
      const src = data.sources[0]?.src
      if (!src) return null

      return { src, title: "video" }
    })
    .otherwise(() => null)
}

/**
 * Save resource as file
 */

export const saveResource = (resource: { src: string; title: string }) => {
  saveAs(resource.src, slugify(resource.title))
}

/**
 * Convert srcSet to string
 */

export const srcSetToValue = (srcSet: { src: string; width: number; height: number }[]): string => {
  return srcSet.map((entry) => `${entry.src} ${entry.width}w`).join(", ")
}

/**
 * Resolve thumbnail src
 */

export const resolveThumbnailSrc = (data: SlideImage) => {
  if (data.thumbnailUrl) return data.thumbnailUrl
}

/**
 * Convert file to slide
 */
export const fileToSlide = (file: Api.MediaFile): Option<SlideData> => {
  if (isImageExtension(file.extension)) {
    const image: SlideImage = {
      id: file.id,
      type: "image",
      src: file.url,
      alt: file.translations?.alt || '',
      width: file.width,
      height: file.height,
      thumbnailUrl: service.getImageUrl(file, "thumbnail") ?? "",
      previewUrl: service.getImageUrl(file, "preview") ?? "",
      downloadUrl: service.makePath(file.url, true),
      downloadFilename: file.translations?.name || 'file',
    }
    return O.Some(image)
  }
  if (isVideoExtension(file.extension)) {
    const video: SlideVideo = {
      id: file.id,
      type: "video",
      downloadUrl: service.makePath(file.url, true),
      downloadFilename: file.translations?.name || 'file',
      alt: file.translations?.alt || '',
      sources: [{ type: undefined, src: service.makePath(file.url, true) }],
    }
    return O.Some(video)
  }
  if (isPdfExtension(file.extension)) {
    const pdf: SlidePdf = {
      id: file.id,
      type: "pdf",
      src: service.makePath(file.url, true),
      downloadUrl: service.makePath(file.url, true),
      downloadFilename: file.translations?.name || 'file',
      alt: file.translations?.alt || '',
    }
    return O.Some(pdf)
  }
  return O.None
}
