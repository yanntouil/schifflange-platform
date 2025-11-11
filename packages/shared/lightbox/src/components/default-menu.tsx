/**
 * DefaultMenu
 * Default menu component for the lightbox
 */

import { useTranslation } from "@compo/localize"
import { Description, Title } from "@radix-ui/react-dialog"
import { Download, Fullscreen, Minimize, X } from "lucide-react"
import React from "react"
import screenfull from "screenfull"
import type { MenuComponentProps } from "../types"
import { buttonCx } from "./variants"

/**
 * Default menu with navigation controls and download button
 */
export const DefaultMenu = React.memo<MenuComponentProps>(
  ({ file, currentIndex, totalFiles, onClose, onNext, onPrev, onDownload, toggleFullscreen, fullscreenIsEnabled }) => {
    const { _ } = useTranslation(dictionary)
    const [isFullscreen, setIsFullscreen] = React.useState(false)

    // Track fullscreen state changes
    React.useEffect(() => {
      if (!screenfull.isEnabled) return

      const handleChange = () => {
        setIsFullscreen(screenfull.isFullscreen)
      }

      screenfull.on("change", handleChange)
      return () => {
        screenfull.off("change", handleChange)
      }
    }, [])

    const stopPropagation = (e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()
    return (
      <div className='absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent py-2 px-6'>
        <div className='flex items-center justify-between gap-4'>
          <div>
            <Title className='sr-only'>{_("title")}</Title>
            <Description
              // enable to select text
              onPointerDownCapture={stopPropagation}
              onMouseDownCapture={stopPropagation}
              className='text-white font-medium truncate tracking-wide flex-1 line-clamp-1 text-base/none'
            >
              {file.title}
            </Description>
          </div>

          <div
            className='flex items-center'
            onPointerDownCapture={stopPropagation}
            onMouseDownCapture={stopPropagation}
          >
            <button type='button' onClick={onDownload} className={buttonCx}>
              <Download aria-hidden className='size-4' />
              <span className='sr-only'>{_("download")}</span>
            </button>
            {fullscreenIsEnabled && toggleFullscreen && (
              <button type='button' onClick={toggleFullscreen} className={buttonCx}>
                {isFullscreen ? (
                  <Minimize aria-hidden className='size-4' />
                ) : (
                  <Fullscreen aria-hidden className='size-4' />
                )}
                <span className='sr-only'>{isFullscreen ? _("exit-fullscreen") : _("enter-fullscreen")}</span>
              </button>
            )}
            <button type='button' onClick={onClose} className={buttonCx}>
              <X aria-hidden className='size-4' />
              <span className='sr-only'>{_("close")}</span>
            </button>
          </div>
        </div>
      </div>
    )
  }
)

DefaultMenu.displayName = "DefaultMenu"

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Lightbox",
    download: "Download",
    "enter-fullscreen": "Enter fullscreen",
    "exit-fullscreen": "Exit fullscreen",
    close: "Close",
  },
  fr: {
    title: "Visionneuse",
    download: "Télécharger",
    "enter-fullscreen": "Entrer en plein écran",
    "exit-fullscreen": "Quitter le plein écran",
    close: "Fermer",
  },
  de: {
    title: "Lightbox",
    download: "Herunterladen",
    "enter-fullscreen": "Vollbild",
    "exit-fullscreen": "Vollbild beenden",
    close: "Schließen",
  },
}
