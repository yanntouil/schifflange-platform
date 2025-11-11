/**
 * LightboxDialog
 * Main dialog component using Radix UI Dialog
 */

import { cxm } from "@compo/utils"
import * as Dialog from "@radix-ui/react-dialog"
import React from "react"
import screenfull from "screenfull"
import { Carousel } from "./carousel/component"
import { DefaultMenu } from "./default-menu"
import { useLightboxContext } from "./lightbox.context"
import { Thumbnails } from "./thumbnails"

/**
 * Lightbox dialog with carousel, thumbnails, and menu
 */
export const LightboxDialog = React.memo(() => {
  const {
    isOpen,
    files,
    currentFile,
    currentIndex,
    close,
    goToNext,
    goToPrev,
    goToIndex,
    options,
    menuComponent: MenuComponent = DefaultMenu,
    onDownload,
    makeUrl,
    disableTransforms,
  } = useLightboxContext()

  const contentRef = React.useRef<HTMLDivElement>(null)

  // Handle fullscreen
  const toggleFullscreen = async () => {
    if (!screenfull.isEnabled || !contentRef.current) {
      console.warn("Fullscreen not supported")
      return
    }

    try {
      await screenfull.toggle(contentRef.current)
    } catch (error) {
      console.error("Failed to toggle fullscreen:", error)
    }
  }

  const fullscreenIsEnabled = screenfull.isEnabled

  // Lock body scroll when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = ""
      }
    }
  }, [isOpen])

  // Handle ESC key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close()
      }
    }

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, close])

  // Handle download
  const handleDownload = () => {
    if (!currentFile) return

    if (onDownload) {
      onDownload(currentFile)
    } else {
      // Default download behavior
      const url = currentFile.downloadUrl || makeUrl(currentFile.path)
      const filename = currentFile.downloadFilename || currentFile.path.split("/").pop() || "download"

      const link = document.createElement("a")
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  if (!currentFile) return null

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && close()}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay
          className={cxm(
            "fixed inset-0 bg-black/20 backdrop-blur-sm"
            // "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          )}
          onClick={options.closeOnClickOutside ? close : undefined}
        />

        {/* Content */}
        <Dialog.Content
          ref={contentRef}
          className='fixed inset-x-0 bottom-0 h-[90%] bg-black backdrop-blur-sm rounded-t-[1.5rem] overflow-hidden'
          onPointerDownOutside={(e) => {
            if (!options.closeOnClickOutside) {
              e.preventDefault()
            }
          }}
          onInteractOutside={(e) => {
            if (!options.closeOnClickOutside) {
              e.preventDefault()
            }
          }}
        >
          {/* Carousel and controls container */}
          <div
            className='relative w-full h-full'
            style={
              {
                "--thumbnail-height": options.enableThumbnails ? "5rem" : "0px",
              } as React.CSSProperties
            }
          >
            {/* Carousel */}
            <Carousel
              slides={files}
              slideIndex={currentIndex}
              onSlideChange={goToIndex}
              loop={options.loop}
              makeUrl={makeUrl}
              disableTransforms={disableTransforms}
              preloadAdjacent={options.preloadAdjacent}
            />

            {/* Menu */}
            <MenuComponent
              file={currentFile}
              currentIndex={currentIndex}
              totalFiles={files.length}
              onClose={close}
              onNext={goToNext}
              onPrev={goToPrev}
              onDownload={handleDownload}
              toggleFullscreen={toggleFullscreen}
              fullscreenIsEnabled={fullscreenIsEnabled}
            />

            {/* Thumbnail strip */}
            {options.enableThumbnails && (
              <Thumbnails files={files} currentIndex={currentIndex} onThumbnailClick={goToIndex} />
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
})

LightboxDialog.displayName = "LightboxDialog"
