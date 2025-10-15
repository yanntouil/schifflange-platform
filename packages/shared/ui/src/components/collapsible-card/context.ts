import * as React from "react"

/**
 * types
 */
export type CollapsibleCardContextType = {
  id: string
  open: boolean
  onOpenChange: (open: boolean) => void
  animate: boolean
  disabled: boolean
  hideOnDisabled: boolean
}

/**
 * context
 */
export const CollapsibleCardContext = React.createContext<CollapsibleCardContextType | undefined>(undefined)

/**
 * hooks
 */
export const useCollapsibleCard = () => {
  const context = React.useContext(CollapsibleCardContext)
  if (!context) {
    throw new Error("useCollapsibleCard must be used within a CollapsibleCardProvider")
  }
  return context
}
