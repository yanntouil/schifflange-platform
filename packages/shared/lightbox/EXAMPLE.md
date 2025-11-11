# Example Usage

## Complete Example with All Features

```tsx
import { useEffect } from 'react'
import { LightboxProvider, useLightbox } from '@shared/lightbox'
import type { RegisteredFile } from '@shared/lightbox'

// ============================================================================
// App Component with Provider
// ============================================================================

function App() {
  return (
    <LightboxProvider
      // Required: URL generation functions
      makePreviewUrl={(path) => `/api/preview/${path}`}
      makeUrl={(path) => `/api/files/${path}`}

      // Optional: Custom download handler
      onDownload={(file) => {
        console.log('Downloading file:', file.title)
        // Custom download logic here
      }}

      // Optional: Configuration
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

// ============================================================================
// Gallery Component
// ============================================================================

function Gallery() {
  const { registerFile, displayPreview, hasPreview, unregisterFile } = useLightbox()

  useEffect(() => {
    // Register multiple files
    const files: RegisteredFile[] = [
      // Image files
      {
        id: 'img-1',
        type: 'image',
        path: 'photos/sunset.jpg',
        previewPath: 'photos/sunset-thumb.jpg', // Optional preview for progressive loading
        title: 'Beautiful sunset over the ocean',
        width: 1920,
        height: 1080,
        downloadFilename: 'sunset-2025.jpg', // Optional custom download name
      },
      {
        id: 'img-2',
        type: 'image',
        path: 'photos/mountains.jpg',
        previewPath: 'photos/mountains-thumb.jpg',
        title: 'Mountain landscape',
        width: 2560,
        height: 1440,
      },

      // Video file
      {
        id: 'vid-1',
        type: 'video',
        path: 'videos/intro.mp4',
        videoType: 'video/mp4',
        title: 'Company introduction video',
        thumbnailPath: 'videos/intro-thumb.jpg', // Optional thumbnail
        downloadUrl: 'https://cdn.example.com/videos/intro.mp4', // Optional custom download URL
      },

      // PDF file
      {
        id: 'pdf-1',
        type: 'pdf',
        path: 'documents/report-2024.pdf',
        title: 'Annual Report 2024',
        thumbnailPath: 'documents/report-thumb.jpg',
      },
    ]

    // Register all files
    files.forEach(registerFile)

    // Cleanup on unmount
    return () => {
      files.forEach((file) => unregisterFile(file.id))
    }
  }, [registerFile, unregisterFile])

  return (
    <div className="grid grid-cols-3 gap-4 p-8">
      <button
        onClick={() => displayPreview('img-1')}
        className="p-4 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        View Sunset Photo
      </button>

      <button
        onClick={() => displayPreview('img-2')}
        className="p-4 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        View Mountain Photo
      </button>

      <button
        onClick={() => displayPreview('vid-1')}
        className="p-4 bg-green-500 text-white rounded hover:bg-green-600"
      >
        View Intro Video
      </button>

      <button
        onClick={() => displayPreview('pdf-1')}
        className="p-4 bg-red-500 text-white rounded hover:bg-red-600"
      >
        View Annual Report
      </button>

      {hasPreview('img-1') && (
        <div className="text-green-600">✓ Sunset photo is registered</div>
      )}
    </div>
  )
}

export default App
```

## Example with Custom Renderers

```tsx
import { LightboxProvider, ImageSlideRenderer } from '@shared/lightbox'
import type { SlideRendererProps, ImageFile } from '@shared/lightbox'

// Custom image renderer with watermark
const WatermarkedImageRenderer: React.FC<SlideRendererProps<ImageFile>> = ({
  file,
  makeUrl,
  isActive,
}) => {
  return (
    <div className="relative">
      <img
        src={makeUrl(file.path)}
        alt={file.title}
        className="max-w-full max-h-full object-contain"
      />
      <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded">
        © 2025 My Company
      </div>
    </div>
  )
}

function App() {
  return (
    <LightboxProvider
      makePreviewUrl={(path) => `/preview/${path}`}
      makeUrl={(path) => `/files/${path}`}
      slideRenderers={{
        image: WatermarkedImageRenderer,
        // video and pdf will use default renderers
      }}
    >
      <Gallery />
    </LightboxProvider>
  )
}
```

## Example with Custom Menu

```tsx
import type { MenuComponentProps } from '@shared/lightbox'

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
    <div className="absolute top-4 right-4 z-20 bg-white rounded-lg shadow-lg p-4">
      <h3 className="font-bold mb-2">{file.title}</h3>
      <div className="flex gap-2">
        <button onClick={onPrev} disabled={currentIndex === 0}>
          Previous
        </button>
        <span>
          {currentIndex + 1} / {totalFiles}
        </span>
        <button onClick={onNext} disabled={currentIndex === totalFiles - 1}>
          Next
        </button>
      </div>
      <div className="flex gap-2 mt-2">
        <button onClick={onDownload}>Download</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  )
}

function App() {
  return (
    <LightboxProvider
      makePreviewUrl={(path) => `/preview/${path}`}
      makeUrl={(path) => `/files/${path}`}
      menuComponent={CustomMenu}
    >
      <Gallery />
    </LightboxProvider>
  )
}
```

## Example with Dynamic File Registration

```tsx
function DynamicGallery() {
  const { registerFile, displayPreview } = useLightbox()
  const [images, setImages] = useState<string[]>([])

  const handleFileUpload = async (file: File) => {
    // Upload file to server
    const response = await uploadFile(file)

    // Register the file in lightbox
    registerFile({
      id: response.id,
      type: 'image',
      path: response.path,
      title: file.name,
      width: response.width,
      height: response.height,
    })

    // Add to gallery
    setImages((prev) => [...prev, response.id])
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFileUpload(file)
        }}
      />

      <div className="grid grid-cols-4 gap-4">
        {images.map((id) => (
          <button key={id} onClick={() => displayPreview(id)}>
            View Image
          </button>
        ))}
      </div>
    </div>
  )
}
```

## Example with Programmatic Navigation

```tsx
function ProgrammaticGallery() {
  const {
    registerFile,
    displayPreview,
    goToNext,
    goToPrev,
    goToIndex,
    close,
    currentIndex,
    totalFiles,
    isOpen,
  } = useLightbox()

  useEffect(() => {
    // Register files...
  }, [])

  return (
    <div>
      <button onClick={() => displayPreview('first-file')}>
        Open Lightbox
      </button>

      {isOpen && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-white rounded-lg shadow-lg p-4">
          <button onClick={goToPrev}>Previous</button>
          <span className="mx-4">
            {currentIndex + 1} / {totalFiles}
          </span>
          <button onClick={goToNext}>Next</button>
          <button onClick={() => goToIndex(0)}>First</button>
          <button onClick={() => goToIndex(totalFiles - 1)}>Last</button>
          <button onClick={close}>Close</button>
        </div>
      )}
    </div>
  )
}
```

## Integration with Existing Media Gallery

```tsx
interface Media {
  id: string
  type: 'image' | 'video' | 'pdf'
  url: string
  thumbnailUrl: string
  title: string
  metadata: any
}

function MediaGallery({ items }: { items: Media[] }) {
  const { registerFile, displayPreview } = useLightbox()

  useEffect(() => {
    // Convert and register media items
    items.forEach((item) => {
      if (item.type === 'image') {
        registerFile({
          id: item.id,
          type: 'image',
          path: item.url,
          previewPath: item.thumbnailUrl,
          title: item.title,
          width: item.metadata.width,
          height: item.metadata.height,
        })
      } else if (item.type === 'video') {
        registerFile({
          id: item.id,
          type: 'video',
          path: item.url,
          videoType: item.metadata.mimeType,
          title: item.title,
          thumbnailPath: item.thumbnailUrl,
        })
      } else if (item.type === 'pdf') {
        registerFile({
          id: item.id,
          type: 'pdf',
          path: item.url,
          title: item.title,
          thumbnailPath: item.thumbnailUrl,
        })
      }
    })
  }, [items, registerFile])

  return (
    <div className="grid grid-cols-4 gap-4">
      {items.map((item) => (
        <div key={item.id} onClick={() => displayPreview(item.id)}>
          <img src={item.thumbnailUrl} alt={item.title} />
          <p>{item.title}</p>
        </div>
      ))}
    </div>
  )
}
```
