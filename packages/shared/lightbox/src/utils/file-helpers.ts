/**
 * File Helpers
 * Utility functions to convert API types to Lightbox types
 */

import type { ImageFile, RegisteredFile } from "../types"

/** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
 * Type Guards
 */

/**
 * Common image extensions
 */
const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "ico"]

/**
 * Common video extensions
 */
const VIDEO_EXTENSIONS = ["mp4", "webm", "mov", "avi", "mkv", "flv", "wmv"]

/**
 * Check if extension is an image
 */
export function isImageExtension(extension: string): boolean {
  return IMAGE_EXTENSIONS.includes(extension.toLowerCase().replace(".", ""))
}

/**
 * Check if extension is a video
 */
export function isVideoExtension(extension: string): boolean {
  return VIDEO_EXTENSIONS.includes(extension.toLowerCase().replace(".", ""))
}

/**
 * Check if extension is a PDF
 */
export function isPDFExtension(extension: string): boolean {
  return extension.toLowerCase().replace(".", "") === "pdf"
}

/** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
 * MIME Type Helpers
 */

/**
 * Get video MIME type from extension
 */
export function getVideoMimeType(extension: string): string {
  const ext = extension.toLowerCase().replace(".", "")

  const mimeTypes: Record<string, string> = {
    mp4: "video/mp4",
    webm: "video/webm",
    mov: "video/quicktime",
    avi: "video/x-msvideo",
    mkv: "video/x-matroska",
    flv: "video/x-flv",
    wmv: "video/x-ms-wmv",
  }

  return mimeTypes[ext] || "video/mp4"
}

/** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
 * Conversion Helpers - SingleFile
 */

/**
 * Convert SingleFile to RegisteredFile
 * Works for files without width/height (videos, PDFs, etc.)
 */
export function singleFileToLightbox(
  id: string,
  file: { url: string; extension: string },
  title: string,
  options?: {
    thumbnailUrl?: string
  }
): RegisteredFile | null {
  const ext = file.extension

  // Image
  if (isImageExtension(ext)) {
    return {
      id,
      type: "image",
      path: file.url,
      title,
      width: 1920, // Default, won't be used for layout
      height: 1080, // Default, won't be used for layout
    }
  }

  // Video
  if (isVideoExtension(ext)) {
    return {
      id,
      type: "video",
      path: file.url,
      title,
      videoType: getVideoMimeType(ext),
      thumbnailPath: options?.thumbnailUrl,
    }
  }

  // PDF
  if (isPDFExtension(ext)) {
    return {
      id,
      type: "pdf",
      path: file.url,
      title,
      thumbnailPath: options?.thumbnailUrl,
    }
  }

  return null
}

/** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
 * Conversion Helpers - SingleImage
 */

/**
 * Convert SingleImage to ImageFile (lightbox)
 * SingleImage has thumbnailUrl, previewUrl, originalUrl
 */
export function singleImageToLightbox(
  id: string,
  image: {
    url: string
    thumbnailUrl: string
    previewUrl: string
    originalUrl: string
  },
  title: string,
  options?: {
    width?: number
    height?: number
  }
): ImageFile {
  return {
    id,
    type: "image",
    path: image.url,
    title,
    width: options?.width || 1920,
    height: options?.height || 1080,
    previewPath: image.previewUrl,
  }
}

/** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
 * Conversion Helpers - MediaFile
 */

/**
 * Convert MediaFile to RegisteredFile
 * MediaFile has width, height, thumbnailUrl, previewUrl, etc.
 */
export function mediaFileToLightbox(
  file: {
    id: string
    url: string
    extension: string
    width: number | null
    height: number | null
    thumbnailUrl: string
    previewUrl: string
  },
  title: string
): RegisteredFile | null {
  const ext = file.extension

  // Image
  if (isImageExtension(ext)) {
    return {
      id: file.id,
      type: "image",
      path: file.url,
      title,
      width: file.width || 1920,
      height: file.height || 1080,
      previewPath: file.previewUrl,
    }
  }

  // Video
  if (isVideoExtension(ext)) {
    return {
      id: file.id,
      type: "video",
      path: file.url,
      title,
      videoType: getVideoMimeType(ext),
    }
  }

  // PDF
  if (isPDFExtension(ext)) {
    return {
      id: file.id,
      type: "pdf",
      path: file.url,
      title,
      thumbnailPath: file.thumbnailUrl,
    }
  }

  return null
}

/** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
 * Batch Conversion
 */

/**
 * Convert multiple MediaFiles to RegisteredFile array
 */
export function mediaFilesToLightbox(
  files: Array<{
    id: string
    url: string
    extension: string
    width: number | null
    height: number | null
    thumbnailUrl: string
    previewUrl: string
  }>,
  getTitleFn: (file: any) => string
): RegisteredFile[] {
  return files
    .map((file) => mediaFileToLightbox(file, getTitleFn(file)))
    .filter((file): file is RegisteredFile => file !== null)
}
