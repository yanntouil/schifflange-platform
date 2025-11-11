/**
 * ZoomControls
 * Accessible zoom controls toolbar with slider
 */

import { useTranslation } from "@compo/localize"
import { cxm } from "@compo/utils"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { Maximize, Minus, Plus } from "lucide-react"
import React from "react"
import { buttonCx, disabledCx, focusVisibleCx } from "../variants"
import { useTransformContext, useTransformControls } from "./context"

/**
 * Zoom controls component with zoom slider and buttons
 * Similar to LightboxZoom from the old implementation
 */
export const TransformControls: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { displayControls, isActive } = useTransformContext()
  const {
    slider: { onKeyDown, ...sliderProps },
    next,
    previous,
    reset,
  } = useTransformControls()
  if (!isActive || !displayControls) return null

  return (
    <div
      className='flex items-center gap-2'
      role='toolbar'
      aria-label={_("zoom-controls")}
      data-slot='transform-controls'
    >
      {/* Zoom Out */}
      <button {...previous} className={buttonCx}>
        <Minus aria-hidden />
        <span className='sr-only'>{_("zoom-out")}</span>
      </button>

      {/* Slider */}
      <SliderPrimitive.Root
        {...sliderProps}
        className='relative mx-3 flex w-[5.2rem] shrink-0 touch-none select-none items-center'
        aria-label={`${_("zoom-level")}`}
      >
        <SliderPrimitive.Track
          className='relative h-1 w-full grow overflow-hidden rounded-full bg-secondary'
          onKeyDown={onKeyDown}
        >
          <SliderPrimitive.Range className='absolute h-full bg-primary-foreground' />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          className={cxm(
            "block size-3 rounded-full border-2 border-primary-foreground bg-foreground ring-offset-background transition-colors",
            focusVisibleCx,
            disabledCx
          )}
        />
      </SliderPrimitive.Root>

      {/* Reset */}
      <button {...reset} className={buttonCx}>
        <Maximize aria-hidden />
        <span className='sr-only'>{_("reset-zoom")}</span>
      </button>

      {/* Zoom In */}
      <button {...next} className={buttonCx}>
        <Plus aria-hidden />
        <span className='sr-only'>{_("zoom-in")}</span>
      </button>
    </div>
  )
}

/**
 * translation
 */
const dictionary = {
  en: {
    "zoom-controls": "Zoom controls",
    "zoom-out": "Zoom out",
    "zoom-in": "Zoom in",
    "zoom-level": "Zoom level",
    "reset-zoom": "Reset zoom",
  },
  fr: {
    "zoom-controls": "Contrôles de zoom",
    "zoom-out": "Zoom arrière",
    "zoom-in": "Zoom avant",
    "zoom-level": "Niveau de zoom",
    "reset-zoom": "Réinitialiser le zoom",
  },
  de: {
    "zoom-controls": "Zoom-Steuerung",
    "zoom-out": "Zoom aus",
    "zoom-in": "Zoom ein",
    "zoom-level": "Zoom-Niveau",
    "reset-zoom": "Zoom zurücksetzen",
  },
}
