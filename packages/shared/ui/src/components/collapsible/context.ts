import { usePersistedState } from "@compo/hooks"
import * as React from "react"
import { z } from "@compo/utils"

/**
 * types
 */
export type CollapsibleContextType = {
  id: string
  open: boolean
  onOpenChange: (open: boolean) => void
  animate: boolean
}

/**
 * context
 */
export const CollapsibleContext = React.createContext<CollapsibleContextType | undefined>(undefined)

/**
 * hooks
 */
export const useCollapsible = () => {
  const context = React.useContext(CollapsibleContext)
  if (!context) {
    throw new Error("useCollapsible must be used within a CollapsibleProvider")
  }
  return context
}
export const useCollapsibleState = (key: string, defaultOpen: boolean = true) => {
  const [open, onOpenChange] = usePersistedState(
    defaultOpen,
    key,
    z.boolean(),
    typeof window !== "undefined" ? sessionStorage : undefined
  )
  const [animate, setAnimate] = React.useState(false)
  React.useEffect(() => {
    setAnimate(true)
    const timeout = setTimeout(() => setAnimate(false), 200)
    return () => clearTimeout(timeout)
  }, [open])
  return { open, onOpenChange, animate, setAnimate }
}
