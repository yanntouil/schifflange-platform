import { ImageSlide } from "./components/renderers/image.slide"
import { ImageThumbnail } from "./components/renderers/image.thumbnail"
import { PDFSlide } from "./components/renderers/pdf.slide"
import { PDFThumbnail } from "./components/renderers/pdf.thumbnail"
import { VideoSlide } from "./components/renderers/video.slide"
import { VideoThumbnail } from "./components/renderers/video.thumbnail"
import type { LightboxOptions, SlideRenderers, ThumbnailRenderers } from "./types"

/**
 * Default Options
 */
export const DEFAULT_OPTIONS: Required<LightboxOptions> = {
  closeOnClickOutside: true,
  enableZoom: true,
  enableThumbnails: true,
  transformThreshold: 1,
  loop: true,
  showCounter: true,
  preloadAdjacent: true,
}

// ============================================================================
// Default Renderers
// ============================================================================

export const DEFAULT_SLIDE_RENDERERS: SlideRenderers = {
  image: ImageSlide,
  video: VideoSlide,
  pdf: PDFSlide,
}

export const DEFAULT_THUMBNAIL_RENDERERS: ThumbnailRenderers = {
  image: ImageThumbnail,
  video: VideoThumbnail,
  pdf: PDFThumbnail,
}
