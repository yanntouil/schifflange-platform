import React from "react"

export const useKeyboardEvents = (handler: (e: KeyboardEvent, down: boolean) => void, deps: React.DependencyList) => {
  React.useEffect(() => {
    const handleKeyboardEvent = (e: KeyboardEvent) => {
      handler(e, e.type === "keydown")
    }

    window.addEventListener("keydown", handleKeyboardEvent)

    return () => {
      window.removeEventListener("keydown", handleKeyboardEvent)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

/**
 * useShiftPressed
 * @returns true if shift is pressed
 */
export const useShiftPressed = (): boolean => {
  const [isPressed, setIsPressed] = React.useState(false)

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Shift") setIsPressed(true)
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") setIsPressed(false)
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  return isPressed
}
