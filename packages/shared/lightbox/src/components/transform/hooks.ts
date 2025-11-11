import React from "react"
import { ReactZoomPanPinchState, useControls, useTransformEffect } from "react-zoom-pan-pinch"
import { useTransformContext } from "./context"

// export const useTransformControls = () => {
//   const controls = useControls()
//   const [transformState, setTransformState] = React.useState<ReactZoomPanPinchState>(controls.instance.transformState)

//   useTransformEffect(({ state }) => {
//     setTransformState(state)
//   })

//   const { displayControls, steps } = useTransformContext()

//   return {
//     ...controls,
//     state: transformState,
//     displayControls,
//     steps,
//   }
// }

/**
 * Scale hooks
 * this hook is used to get the current scale and set the scale
 * ! scale changes very often and causes a lot of rendering issues.
 * ! use this hook only if you need to get the current scale or set the scale.
 */
export const useScale = () => {
  const { minScale, maxScale } = useTransformContext()
  const { setTransform, instance } = useControls()
  const [transformState, setTransformState] = React.useState<ReactZoomPanPinchState>(instance.transformState)

  /**
   * Subscribe to transform changes
   * @param state - The new transform state
   */
  useTransformEffect(({ state }) => {
    setTransformState(state)
  })

  // Helper: clamp + optional easing
  const setScale = React.useCallback(
    (next: number, animate = true) => {
      const clamped = Math.min(Math.max(next, minScale), maxScale)
      // keep position but only change scale (x=0,y=0 recenters; we want to preserve panning here)
      // If you want to keep current pan, use state.positionX/Y:
      setTransform(
        transformState.positionX,
        transformState.positionY,
        clamped,
        animate ? 160 : 0,
        animate ? "easeOut" : undefined
      )
    },
    [minScale, maxScale, setTransform, transformState.positionX, transformState.positionY]
  )
  return [transformState.scale, setScale] as const
}

/**
 * Steps hooks
 */
type StepsOptions = {
  steps?: number[] // optional fixed steps; if omitted, computed from min/max
  animationMs?: number
  easing?: "linear" | "easeOut" | "easeInOut"
}
export const useSteps = (opts: StepsOptions = {}) => {
  const { minScale, maxScale, minimapScale = 2, transformThreshold } = useTransformContext()
  const { setTransform, centerView } = useControls()
  const animationMs = opts.animationMs ?? 160
  const easing = opts.easing ?? "easeOut"

  // Keep latest transform in refs to avoid causing renders
  const posRef = React.useRef({ x: 0, y: 0 })
  const scaleRef = React.useRef(1)
  const snappedRef = React.useRef(1)

  // Steps (fixed list or derived from min/max)
  const steps = React.useMemo(() => {
    if (opts.steps?.length) return opts.steps
    const min = minScale ?? 0.5
    const max = maxScale ?? 4
    const N = 10
    const r = max - min
    return Array.from({ length: N + 1 }, (_, i) => Number((min + (r * i) / N).toFixed(3)))
  }, [opts.steps, minScale, maxScale])

  // Public “snapped step” value (state only changes when snapped changes)
  const [snapped, setSnapped] = React.useState(() => findClosestStep(scaleRef.current, steps))

  const [displayMinimap, setDisplayMinimap] = React.useState(false)

  // Subscribe to transform changes without re-rendering on every tick
  useTransformEffect(({ state }) => {
    scaleRef.current = state.scale
    posRef.current = { x: state.positionX, y: state.positionY }

    const nextDisplayMinimap = state.scale >= minimapScale
    if (nextDisplayMinimap !== displayMinimap) {
      setDisplayMinimap(nextDisplayMinimap)
    }

    const nextSnapped = findClosestStep(state.scale, steps)
    if (nextSnapped !== snappedRef.current) {
      snappedRef.current = nextSnapped
      setSnapped(nextSnapped)
    }
  })

  // Set scale while preserving current pan
  const setScale = React.useCallback(
    (next: number, animate = true) => {
      const min = steps[0]
      const max = steps[steps.length - 1]
      const clamped = Math.min(Math.max(next, min), max)
      const { x, y } = posRef.current
      // setTransform(x, y, clamped, animate ? animationMs : 0, animate ? "easeOut" : undefined)
      centerView(clamped, 1, animate ? "linear" : undefined)
    },
    [setTransform, steps, animationMs, easing]
  )

  // Slider change → set scale (snap)
  const onStepChange = React.useCallback(
    (values: number[]) => {
      const raw = Array.isArray(values) ? values[0] : (values as unknown as number)
      if (typeof raw !== "number") return
      setScale(findClosestStep(raw, steps), true)
    },
    [setScale, steps]
  )

  // Next / Prev / Reset using the current snapped index (from refs/state)
  const idx = React.useMemo(() => getStepIndex(snapped, steps), [snapped, steps])

  const nextStep = React.useCallback(() => {
    const next = steps[Math.min(idx + 1, steps.length - 1)]
    setScale(next, true)
  }, [idx, steps, setScale])
  const previousStep = React.useCallback(() => {
    const prev = steps[Math.max(idx - 1, 0)]
    setScale(prev, true)
    centerView()
  }, [idx, steps, setScale, centerView])

  const resetTarget = transformThreshold ?? steps[0] // default to 1st if no [1]
  const resetStep = React.useCallback(() => setScale(resetTarget, true), [setScale, resetTarget])

  const disabledNextStep = idx >= steps.length - 1
  const disabledPreviousStep = idx <= 0
  const disabledResetStep = snapped === resetTarget

  // Prevent arrow keys from leaking to a parent carousel, etc.
  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement | HTMLInputElement>) => {
    e.stopPropagation()
  }

  return {
    // current snapped step value
    step: snapped,
    // steps meta
    steps,
    // display minimap
    displayMinimap,
    // slider bindings (headless)
    slider: {
      min: steps[0],
      max: steps[steps.length - 1],
      step: steps[1] - steps[0],
      value: [snapped],
      onValueChange: onStepChange,
      onKeyDown,
    },
    // buttons bindings (headless)
    next: { onClick: nextStep, disabled: disabledNextStep, onKeyDown },
    previous: { onClick: previousStep, disabled: disabledPreviousStep, onKeyDown },
    reset: { onClick: resetStep, disabled: disabledResetStep, onKeyDown },
    // imperative API if needed
    setScale,
  }
}

/**
 * Auto center on zoom out after zooming out below a threshold
 */
type UseAutoCenterOnZoomOutOptions = {
  threshold?: number
  debounceMs?: number
}
export const useAutoCenterOnZoomOut = ({ threshold = 1, debounceMs = 120 }: UseAutoCenterOnZoomOutOptions = {}) => {
  const { centerView } = useControls()

  // Keep debounce timer and zoom state without causing renders
  const timerRef = React.useRef<number | null>(null)
  const wasZoomedRef = React.useRef(false)

  // Clear timer on unmount
  const clear = React.useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  useTransformEffect(({ state }) => {
    const current = state.scale

    // Track if we were zoomed in
    if (current > threshold) {
      wasZoomedRef.current = true
    }

    // Only recenter if we were zoomed in and are now returning to threshold
    const shouldRecenter = wasZoomedRef.current && current <= threshold

    if (!shouldRecenter) return

    // Reset tracking flag
    wasZoomedRef.current = false

    // Debounce centerView()
    clear()
    timerRef.current = window.setTimeout(() => {
      centerView()
      timerRef.current = null
    }, debounceMs)
  })

  // Optional public API to force-cancel pending center
  return { cancelPending: clear }
}

/**
 * Reset transform when slide becomes inactive
 */
export const useResetTransformOnInactive = (active: boolean) => {
  const { resetTransform } = useControls()
  const wasActive = React.useRef<boolean>(active)

  React.useEffect(() => {
    // Detect transition active -> inactive
    if (wasActive.current && !active) {
      resetTransform()
    }
    wasActive.current = active
  }, [active, resetTransform])
}

/**
 * disable on scale
 */
export const useDisableOnScale = (scale: number, disabled: boolean, setDisabled: (disabled: boolean) => void) => {
  useTransformEffect(({ state }) => {
    const nextDisabled = state.scale <= scale
    if (nextDisabled !== disabled) {
      setDisabled(nextDisabled)
    }
  })
}

/**
 * on scale change
 */
export const useOnScaleChange = (
  check: (scale: number) => boolean,
  equal: boolean,
  onChange: (value: boolean) => void
) => {
  useTransformEffect(({ state }) => {
    const hasChanged = check(state.scale)
    if (hasChanged !== equal) {
      onChange(hasChanged)
    }
  })
}

/**
 * Find the closest step value from a given value
 */
export const findClosestStep = (v: number, steps: number[]) =>
  steps.reduce((acc, s) => (Math.abs(s - v) < Math.abs(acc - v) ? s : acc), steps[0])

/**
 * Get the index of the closest step value from a given value
 */
export const getStepIndex = (v: number, steps: number[]) => {
  const snapped = findClosestStep(v, steps)
  return steps.findIndex((s) => s === snapped)
}
