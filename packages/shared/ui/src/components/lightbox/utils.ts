import { saveAs } from "file-saver"
import { match } from "ts-pattern"
import { A, toSafeFilename } from "@compo/utils"
import { DataResource, SlideData, SlideImage } from "./types"

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
  saveAs(resource.src, toSafeFilename(resource.title))
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
