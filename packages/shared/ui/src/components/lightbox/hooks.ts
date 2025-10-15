import React from "react"
import { useSlider as useDiaSLider } from "react-dia"
import { A, G } from "@compo/utils"

/**
 * Still Tap
 */

type StillTapConfig = {
  // max ms between pointerDown and pointerUp to register as tap
  tapThreshold?: number
  // will fire only when the gesture displacement is greater than the threshold.
  distanceThreshold?: number
}

export const useStillTap = (cb: () => void, config: StillTapConfig = {}) => {
  const { tapThreshold = 320, distanceThreshold = 10 } = config

  const pointerDownRef = React.useRef<null | { ts: number; x: number; y: number }>(null)

  const bind = (
    events: {
      onDoubleClick?: (e: React.MouseEvent) => void
      onPointerDown?: (e: React.PointerEvent) => void
      onPointerUp?: (e: React.PointerEvent) => void
    } = {}
  ) => ({
    onDoubleClick: (e: React.MouseEvent) => {
      if (events.onDoubleClick) events.onDoubleClick(e)
      if (e.defaultPrevented) return

      pointerDownRef.current = null
    },
    onPointerDown: (e: React.PointerEvent) => {
      if (events.onPointerDown) events.onPointerDown(e)
      if (e.defaultPrevented) return

      pointerDownRef.current = { ts: Date.now(), x: e.clientX, y: e.clientY }
    },
    onPointerUp: (e: React.PointerEvent) => {
      if (events.onPointerUp) events.onPointerUp(e)
      if (e.defaultPrevented) return

      const ref = pointerDownRef.current
      if (pointerDownRef.current) {
        const { ts, x, y } = pointerDownRef.current

        // delta pointerDown |->| pointerUp
        const tDelta = Date.now() - ts

        // distance pointerDown |->| pointerUp
        const dDelta = Math.sqrt(Math.pow(x - e.clientX, 2) + Math.pow(y - e.clientY, 2))

        if (tDelta < tapThreshold && dDelta < distanceThreshold) {
          setTimeout(() => {
            if (pointerDownRef.current === ref) cb()
          }, 220)
        }
      }
    },
  })

  return bind
}

/**
 * useLightboxPreview
 */
export const useLightboxPreview = (id: string) => {
  const { setOpen, setActiveSlideId, slides } = useDiaSLider()
  const slide = React.useMemo(() => A.find(slides, (slide) => slide.id === id), [id, slides])
  const previewFile = () => {
    if (slide) {
      setOpen(true)
      setActiveSlideId(id)
    }
  }
  const canPreview = G.isNotNullable(slide)
  return { previewFile, canPreview }
}
export const useLightbox = () => {
  const { setOpen, setActiveSlideId, slides } = useDiaSLider()
  const previewFile = (id: string) => {
    const slide = A.find(slides, (slide) => slide.id === id)
    if (slide) {
      setOpen(true)
      setActiveSlideId(id)
    }
  }
  return { previewFile }
}

export { useSlides } from "react-dia"
