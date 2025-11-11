# @compo/lightbox

A complete and extensible lightbox/carousel solution for React applications.

## Features

- ✅ **Type-safe**: Full TypeScript support with strict typing
- ✅ **Accessible**: Built with Radix UI primitives for accessibility
- ✅ **Smooth navigation**: Embla Carousel for fluid swipe and keyboard navigation
- ✅ **Zoom support**: Image zoom/pan with react-zoom-pan-pinch
- ✅ **Multi-format**: Built-in support for images, videos, and PDFs
- ✅ **Extensible**: Easy to add custom renderers and menu components
- ✅ **Performance**: Lazy loading, preloading, and optimized rendering
- ✅ **Mobile-friendly**: Touch gestures and responsive design

## Installation

The package is already installed in this monorepo. Dependencies include:

- `@radix-ui/react-dialog`
- `embla-carousel-react`
- `react-zoom-pan-pinch`
- `react-pdf`

## Basic Usage

```tsx
import { LightboxProvider, useLightbox } from "@compo/lightbox"

function App() {
  return (
    <LightboxProvider
      // Required: URL generation function
      makeUrl={(path) => `/api/files/${path}`}
      // Optional: separate preview URLs (defaults to makeUrl)
      makePreviewUrl={(path) => `/api/preview/${path}`}
      options={{
        closeOnClickOutside: true,
        enableZoom: true,
        enableThumbnails: true,
        loop: true,
        showCounter: true,
        preloadAdjacent: true,
      }}
    >
      <Gallery />
    </LightboxProvider>
  )
}

function Gallery() {
  const { registerFile, displayPreview } = useLightbox()

  useEffect(() => {
    // Register files
    registerFile({
      id: "1",
      type: "image",
      path: "photos/beach.jpg",
      previewPath: "photos/beach-thumb.jpg",
      title: "Beach sunset",
      width: 1920,
      height: 1080,
    })

    registerFile({
      id: "2",
      type: "video",
      path: "videos/intro.mp4",
      videoType: "video/mp4",
      title: "Introduction video",
      thumbnailPath: "videos/intro-thumb.jpg",
    })

    registerFile({
      id: "3",
      type: "pdf",
      path: "documents/report.pdf",
      title: "Annual report",
      thumbnailPath: "documents/report-thumb.jpg",
    })
  }, [registerFile])

  return (
    <div>
      <button onClick={() => displayPreview("1")}>View Photo</button>
      <button onClick={() => displayPreview("2")}>View Video</button>
      <button onClick={() => displayPreview("3")}>View PDF</button>
    </div>
  )
}
```

## API Reference

### LightboxProvider Props

```tsx
interface LightboxProviderProps {
  children: ReactNode

  // URL makers
  makeUrl: (path: string) => string              // Required
  makePreviewUrl?: (path: string) => string      // Optional (defaults to makeUrl)

  // Optional callbacks
  onDownload?: (file: RegisteredFile) => void

  // Optional custom renderers
  slideRenderers?: Partial<SlideRenderers>
  thumbnailRenderers?: Partial<ThumbnailRenderers>

  // Optional custom menu
  menuComponent?: ComponentType<MenuComponentProps>

  // Optional configuration
  options?: LightboxOptions
}
```

### useLightbox Hook

```tsx
const {
  // File management
  registerFile,
  unregisterFile,

  // Preview control
  displayPreview,
  hasPreview,

  // State
  isOpen,
  currentFile,
  currentIndex,
  totalFiles,
  files,

  // Navigation
  goToNext,
  goToPrev,
  goToIndex,
  close,
} = useLightbox()
```

### File Types

```tsx
// Image file
interface ImageFile {
  id: string
  type: "image"
  path: string
  title: string
  width: number
  height: number
  previewPath?: string
  downloadUrl?: string
  downloadFilename?: string
}

// Video file
interface VideoFile {
  id: string
  type: "video"
  path: string
  title: string
  videoType: string // MIME type: 'video/mp4', 'video/webm', etc.
  thumbnailPath?: string
  downloadUrl?: string
  downloadFilename?: string
}

// PDF file
interface PDFFile {
  id: string
  type: "pdf"
  path: string
  title: string
  thumbnailPath?: string
  downloadUrl?: string
  downloadFilename?: string
}
```

### Options

```tsx
interface LightboxOptions {
  closeOnClickOutside?: boolean // Default: true
  enableZoom?: boolean // Default: true (images only)
  enableThumbnails?: boolean // Default: true
  loop?: boolean // Default: true
  showCounter?: boolean // Default: true
  preloadAdjacent?: boolean // Default: true
}
```

## Advanced Usage

### Simplified Usage (without separate previews)

If you don't need separate preview URLs, you can omit `makePreviewUrl`:

```tsx
<LightboxProvider makeUrl={(path) => `/files/${path}`}>
  <Gallery />
</LightboxProvider>
```

In this case, the same URL will be used for both previews and full files.

### Custom Download Handler

```tsx
<LightboxProvider
  makeUrl={(path) => `/files/${path}`}
  onDownload={(file) => {
    // Custom download logic
    if (file.downloadUrl) {
      window.open(file.downloadUrl, "_blank")
    } else {
      // Fallback to default download
      const link = document.createElement("a")
      link.href = makeUrl(file.path)
      link.download = file.downloadFilename || "download"
      link.click()
    }
  }}
>
  {children}
</LightboxProvider>
```

### Custom Renderers

You can create custom renderers for specific file types:

```tsx
import { ImageSlideRenderer } from "@compo/lightbox"
import type { SlideRendererProps, ImageFile } from "@compo/lightbox"

const CustomImageRenderer: React.FC<SlideRendererProps<ImageFile>> = ({ file, makeUrl, isActive }) => {
  return (
    <div className='custom-image-wrapper'>
      <img src={makeUrl(file.path)} alt={file.title} />
      <div className='custom-watermark'>© 2025</div>
    </div>
  )
}

// Use custom renderer
;<LightboxProvider
  slideRenderers={{
    image: CustomImageRenderer,
    // video and pdf will use default renderers
  }}
  {...otherProps}
>
  {children}
</LightboxProvider>
```

### Custom Menu Component

```tsx
import type { MenuComponentProps } from "@compo/lightbox"

const CustomMenu: React.FC<MenuComponentProps> = ({
  file,
  currentIndex,
  totalFiles,
  onClose,
  onNext,
  onPrev,
  onDownload,
}) => {
  return (
    <div className='custom-menu'>
      <button onClick={onPrev}>Prev</button>
      <span>
        {currentIndex + 1} / {totalFiles}
      </span>
      <button onClick={onNext}>Next</button>
      <button onClick={onDownload}>Download</button>
      <button onClick={onClose}>Close</button>
    </div>
  )
}

;<LightboxProvider menuComponent={CustomMenu} {...otherProps}>
  {children}
</LightboxProvider>
```

## Helper Functions

The library provides utility functions to convert common API file formats to lightbox-compatible types:

### Converting API Files

```tsx
import {
  mediaFileToLightbox,
  singleImageToLightbox,
  singleFileToLightbox
} from "@compo/lightbox"

// Example with MediaFile from API
const mediaFile = {
  id: "123",
  url: "/files/photo.jpg",
  extension: "jpg",
  width: 1920,
  height: 1080,
  thumbnailUrl: "/files/photo-thumb.jpg",
  previewUrl: "/files/photo-preview.jpg"
}

const lightboxFile = mediaFileToLightbox(mediaFile, "My Photo Title")
registerFile(lightboxFile)

// Example with SingleImage
const singleImage = {
  url: "/images/banner.jpg",
  thumbnailUrl: "/images/banner-thumb.jpg",
  previewUrl: "/images/banner-preview.jpg",
  originalUrl: "/images/banner-original.jpg"
}

const lightboxImage = singleImageToLightbox("img-1", singleImage, "Banner Image", {
  width: 2560,
  height: 1440
})

// Example with SingleFile (video or PDF)
const videoFile = {
  url: "/videos/intro.mp4",
  extension: "mp4"
}

const lightboxVideo = singleFileToLightbox("vid-1", videoFile, "Intro Video", {
  thumbnailUrl: "/videos/intro-thumb.jpg"
})
```

### Batch Conversion

```tsx
import { mediaFilesToLightbox } from "@compo/lightbox"
import { useLanguage } from "@compo/translations"
import { placeholder as servicePlaceholder } from "@services/dashboard"

function Gallery() {
  const { translate } = useLanguage()

  const apiFiles = [
    { id: "1", url: "/files/photo1.jpg", extension: "jpg", ... },
    { id: "2", url: "/files/video.mp4", extension: "mp4", ... },
    { id: "3", url: "/files/doc.pdf", extension: "pdf", ... }
  ]

  // Convert with translations
  const lightboxFiles = mediaFilesToLightbox(
    apiFiles,
    (file) => translate(file, servicePlaceholder.mediaFile).name
  )

  lightboxFiles.forEach(registerFile)
}
```

### Real-World Example with Translations

```tsx
import { useLightbox, mediaFileToLightbox } from "@compo/lightbox"
import { useLanguage } from "@compo/translations"
import { useDashboardService, placeholder as servicePlaceholder } from "@services/dashboard"

function MediaGallery() {
  const { registerFile, displayPreview } = useLightbox()
  const { translate } = useLanguage()
  const service = useDashboardService()

  const { data: mediaFiles } = service.workspaces.medias.files.list()

  useEffect(() => {
    if (!mediaFiles) return

    mediaFiles.forEach(file => {
      const lightboxFile = mediaFileToLightbox(
        file,
        translate(file, servicePlaceholder.mediaFile).name
      )

      if (lightboxFile) {
        registerFile(lightboxFile)
      }
    })
  }, [mediaFiles, translate, registerFile])

  return (
    <div className="grid grid-cols-4 gap-4">
      {mediaFiles?.map(file => (
        <button
          key={file.id}
          onClick={() => displayPreview(file.id)}
          className="aspect-square overflow-hidden rounded"
        >
          <img
            src={file.thumbnailUrl}
            alt={translate(file, servicePlaceholder.mediaFile).name}
          />
        </button>
      ))}
    </div>
  )
}
```

### Type Detection Helpers

```tsx
import {
  isImageExtension,
  isVideoExtension,
  isPDFExtension,
  getVideoMimeType
} from "@compo/lightbox"

isImageExtension("jpg") // true
isVideoExtension("mp4") // true
isPDFExtension("pdf")   // true

getVideoMimeType("mp4") // "video/mp4"
```

## Keyboard Shortcuts

- `Arrow Left` / `Arrow Right`: Navigate between slides
- `Escape`: Close lightbox
- `Mouse wheel`: Zoom in/out (images only)
- `Double click`: Toggle zoom (images only)

## Mobile Gestures

- Swipe left/right: Navigate between slides
- Pinch to zoom: Zoom in/out (images only)
- Drag: Pan zoomed image (images only)

## Performance Tips

1. **Use preview images**: Provide `previewPath` for images to enable progressive loading
2. **Enable preloading**: Set `preloadAdjacent: true` to preload next/previous slides
3. **Optimize thumbnails**: Keep thumbnail images small (≤ 100x100px)
4. **Lazy loading**: Files are only loaded when the lightbox opens

## Architecture

```
src/
├── types/              # TypeScript type definitions
├── context/            # React context for state management
├── hooks/              # React hooks (useLightbox, useLightboxContext)
├── components/
│   ├── renderers/      # File type renderers (Image, Video, PDF)
│   ├── LightboxProvider.tsx
│   ├── LightboxDialog.tsx
│   ├── Carousel.tsx
│   ├── ThumbnailStrip.tsx
│   ├── ZoomWrapper.tsx
│   └── DefaultMenu.tsx
└── index.ts            # Public exports
```

## License

Internal package for the Schifflange Platform monorepo.
