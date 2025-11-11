/**
 * LightboxDialog
 * Main dialog component using Radix UI Dialog
 */

import { cxm } from "@compo/utils"
import * as Dialog from "@radix-ui/react-dialog"
import { saveAs } from "file-saver"
import React from "react"
import screenfull from "screenfull"
import { Carousel } from "./carousel"
import { CarouselSlide } from "./carousel/slide"
import { DefaultMenu } from "./default-menu"
import { useLightboxContext } from "./lightbox.context"
import "./styles.css"
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

      saveAs(url, filename)
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
          onOpenAutoFocus={(e) => {
            // Focus on first interactive element (menu buttons)
            if (!options.trapFocus) {
              e.preventDefault()
            }
          }}
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
            className='relative size-full'
            style={
              {
                "--inner-padding": "1rem",
                "--thumbnail-height": options.enableThumbnails ? "5rem" : "0px",
                "--slide-padding-top": "var(--inner-padding)",
                "--slide-padding-bottom": "calc(var(--thumbnail-height) + var(--inner-padding))",
                "--slide-padding-left": "var(--inner-padding)",
                "--slide-padding-right": "var(--inner-padding)",
              } as React.CSSProperties
            }
          >
            {/* Carousel */}
            <Carousel.Root
              slideIndex={currentIndex}
              onSlideChange={goToIndex}
              options={{ watchDrag: disableTransforms, duration: 25, loop: options.loop }}
            >
              <Carousel.Content
                slides={files}
                makeUrl={makeUrl}
                disableTransforms={disableTransforms}
                preloadAdjacent={options.preloadAdjacent}
              >
                {files.map((file, index) => (
                  <CarouselSlide
                    key={file.id}
                    file={file}
                    currentIndex={currentIndex}
                    total={files.length}
                    index={index}
                  />
                ))}
              </Carousel.Content>
              <Carousel.Controls />
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
            </Carousel.Root>
            {/* Thumbnail strip */}
          </div>
          {options.enableThumbnails && (
            <Thumbnails files={files} currentIndex={currentIndex} onThumbnailClick={goToIndex} />
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
})

LightboxDialog.displayName = "LightboxDialog"
