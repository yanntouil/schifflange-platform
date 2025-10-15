import { useContainerSize } from "@compo/hooks"
import { Translation, useTranslation } from "@compo/localize"
import { CameraOff, SquareArrowOutUpRight } from "lucide-react"
import { encode } from "qss"
import React from "react"
import { cx, G, N } from "@compo/utils"
import { focusVariants, focusWithinVariants } from "../../variants"
import { AnimateHeight } from "../animate-height"
import { Image } from "../image"

/**
 * PreviewCard
 */
type Props = {
  url: string
  ratio?: [number, number]
  className?: string
  previewPath: string
}
export const PreviewCard: React.FC<Props> = ({ url, ratio = [16, 9], className, previewPath }) => {
  const { _ } = useTranslation(dictionary)

  const [isLoaded, setIsLoaded] = React.useState(false)
  const [hasError, setHasError] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const { width } = useContainerSize(containerRef as React.RefObject<HTMLDivElement>)

  const src = React.useMemo(() => {
    const previewWidth = N.clamp(width * 10, 640, 1920)
    const previewHeight = (previewWidth * ratio[1]) / ratio[0]
    const params = encode({
      url,
      screenshot: true,
      meta: false,
      embed: "screenshot.url",
      colorScheme: "dark",
      "viewport.isMobile": false,
      "viewport.deviceScaleFactor": 1,
      "viewport.width": previewWidth,
      "viewport.height": previewHeight,
    })
    return `${previewPath}/?${params}`
  }, [ratio, url, width, previewPath])
  React.useEffect(() => {
    if (G.isNotNullable(src)) {
      setIsLoaded(true)
      setHasError(false)
    }
  }, [src])
  return (
    <>
      <img
        src={src}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className='hidden'
        aria-hidden
      />
      <AnimateHeight className={cx(focusWithinVariants(), "shrink-0 rounded-[2px]", className)} ref={containerRef}>
        {G.isNotNullable(src) && isLoaded && !hasError && (
          <a
            href={url}
            target='_blank'
            rel='noopener noreferrer'
            className={cx(
              "group relative block shrink-0 overflow-hidden rounded-[2px] border border-input bg-card outline-none",
              focusVariants()
            )}
          >
            <span
              className='pointer-events-none absolute inset-0 flex size-full flex-col items-center justify-center rounded-[2px] bg-card-foreground/80 text-card opacity-0 transition-all duration-500 group-hover:opacity-100'
              aria-hidden
            >
              <SquareArrowOutUpRight aria-hidden className='size-8' />
              <span className='text-xs'>{_(`open-link`)}</span>
            </span>
            <Image
              src={src}
              alt={url}
              className='w-full object-cover object-top'
              style={{ aspectRatio: `${ratio[0]} / ${ratio[1]}` }}
            />
          </a>
        )}
      </AnimateHeight>
    </>
  )
}

/**
 * PreviewWithPlaceholderCard
 */
export const PreviewWithPlaceholderCard: React.FC<Props> = ({ url, className, previewPath }) => {
  const { _ } = useTranslation(dictionary)
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [hasError, setHasError] = React.useState(false)

  const src = React.useMemo(() => {
    const params = encode({
      url,
      screenshot: true,
      meta: false,
      embed: "screenshot.url",
      colorScheme: "dark",
      "viewport.isMobile": false,
      "viewport.deviceScaleFactor": 1,
      "viewport.width": 1920,
      "viewport.height": 1080,
    })
    return `${previewPath}/?${params}`
  }, [url, previewPath])

  React.useEffect(() => {
    if (G.isNotNullable(src)) {
      setIsLoaded(true)
      setHasError(false)
    }
  }, [src])
  return (
    <>
      <img
        src={src}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className='hidden'
        aria-hidden
      />
      {G.isNotNullable(src) && isLoaded && (
        <a
          href={url}
          target='_blank'
          rel='noopener noreferrer'
          className={cx(
            "group relative block overflow-hidden rounded-[2px] border border-input bg-card outline-none",
            focusVariants(),
            className
          )}
        >
          <span
            className='pointer-events-none absolute inset-0 flex size-full flex-col items-center justify-center rounded-[2px] bg-card-foreground/80 text-card opacity-0 transition-all duration-500 group-hover:opacity-100'
            aria-hidden
          >
            <SquareArrowOutUpRight aria-hidden className='size-8' />
            <span className='text-xs'>{_(`open-link`)}</span>
          </span>
          {!hasError ? (
            <Image src={src} alt={url} className='size-full object-cover object-top' />
          ) : (
            <span className='flex size-full flex-col items-center justify-center gap-2 bg-input'>
              <CameraOff aria-hidden className='size-8' />
              <span className='text-sm font-medium'>{_(`preview-unavailable`)}</span>
            </span>
          )}
        </a>
      )}
    </>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    "open-link": "Ouvrir le lien dans un nouvel onglet",
    "preview-unavailable": "Aucun aperçu disponible",
  },
  en: {
    "open-link": "Open link in a new tab",
    "preview-unavailable": "No preview available",
  },
  de: {
    "open-link": "Link in einem neuen Tab öffnen",
    "preview-unavailable": "Kein Vorschau verfügbar",
  },
} satisfies Translation
