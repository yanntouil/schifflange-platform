import React from "react"

/**
 * useEffectOnce
 *
 * @param effect
 * @returns void
 */
export const useEffectOnce = (effect: () => void) => {
  const hasRun = React.useRef(false)
  React.useEffect(() => {
    if (!hasRun.current) {
      effect()
      hasRun.current = true
    }
  }, [effect])
}

export default useEffectOnce
