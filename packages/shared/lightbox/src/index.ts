/**
 * Lightbox Library
 * A complete and extensible lightbox/carousel solution for React
 *
 * @example
 * ```tsx
 * import { LightboxProvider, useLightbox } from '@shared/lightbox'
 *
 * function App() {
 *   return (
 *     <LightboxProvider
 *       makeUrl={(path) => `/api/files/${path}`}
 *       // makePreviewUrl is optional (defaults to makeUrl)
 *     >
 *       <Gallery />
 *     </LightboxProvider>
 *   )
 * }
 *
 * function Gallery() {
 *   const { registerFile, displayPreview } = useLightbox()
 *
 *   useEffect(() => {
 *     registerFile({
 *       id: '1',
 *       type: 'image',
 *       path: 'photos/beach.jpg',
 *       title: 'Beach sunset',
 *       width: 1920,
 *       height: 1080
 *     })
 *   }, [])
 *
 *   return (
 *     <button onClick={() => displayPreview('1')}>
 *       View Photo
 *     </button>
 *   )
 * }
 * ```
 */

/**
 * Provider & Hook & Slide Components
 */

export { LightboxProvider } from "./components/lightbox.provider"
export type { LightboxProviderProps } from "./components/lightbox.provider"

export * from "./components/slide"
export * from "./components/transform"
export { useLightbox } from "./hooks/use-lightbox"
export type { UseLightboxReturn } from "./hooks/use-lightbox"

/**
 * Default Renderers (for customization)
 */

export { ImageSlide as ImageSlideRenderer } from "./components/renderers/image.slide"
export { PDFSlide } from "./components/renderers/pdf.slide"
export { VideoSlide } from "./components/renderers/video.slide"

export { ImageThumbnail } from "./components/renderers/image.thumbnail"
export { PDFThumbnail } from "./components/renderers/pdf.thumbnail"
export { VideoThumbnail } from "./components/renderers/video.thumbnail"

/**
 * Utility Helpers
 */

export {
  getVideoMimeType,
  isImageExtension,
  isPDFExtension,
  isVideoExtension,
  mediaFilesToLightbox,
  mediaFileToLightbox,
  singleFileToLightbox,
  singleImageToLightbox,
} from "./utils/file-helpers"

/**
 * Types
 */

export type {
  // File types
  FileBase,
  FileType,
  ImageFile,
  // Options
  LightboxOptions,
  // Component props
  MenuComponentProps,
  PDFFile,
  RegisteredFile,
  // Renderer types
  SlideRendererProps,
  SlideRenderers,
  ThumbnailRendererProps,
  ThumbnailRenderers,
  VideoFile,
} from "./types"
