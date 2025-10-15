import React from "react"

export interface UseFocusWithinOptions {
  onFocus?: (event: FocusEvent) => void
  onBlur?: (event: FocusEvent) => void
}

const containsRelatedTarget = (event: FocusEvent) => {
  if (event.currentTarget instanceof HTMLElement && event.relatedTarget instanceof HTMLElement) {
    return event.currentTarget.contains(event.relatedTarget)
  }

  return false
}

export const useFocusWithin = <T extends HTMLElement = any>({ onBlur, onFocus }: UseFocusWithinOptions = {}) => {
  const ref = React.useRef<T>(null)
  const [focused, setFocused] = React.useState(false)
  const focusedRef = React.useRef(false)

  const _setFocused = (value: boolean) => {
    setFocused(value)
    focusedRef.current = value
  }

  const handleFocusIn = React.useCallback(
    (event: FocusEvent) => {
      if (!focusedRef.current) {
        _setFocused(true)
        onFocus?.(event)
      }
    },
    [onFocus]
  )

  const handleFocusOut = React.useCallback(
    (event: FocusEvent) => {
      if (focusedRef.current && !containsRelatedTarget(event)) {
        _setFocused(false)
        onBlur?.(event)
      }
    },
    [onBlur]
  )

  React.useEffect(() => {
    if (ref.current) {
      const current = ref.current
      current.addEventListener("focusin", handleFocusIn)
      current.addEventListener("focusout", handleFocusOut)

      return () => {
        current.removeEventListener("focusin", handleFocusIn)
        current.removeEventListener("focusout", handleFocusOut)
      }
    }
  }, [handleFocusIn, handleFocusOut])

  return { ref: ref as React.MutableRefObject<T>, focused }
}
