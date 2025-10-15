import React from "react"

/**
 * types
 */
export type QuickDialogContextType = {
  open: boolean
  onOpenChange: (state: boolean) => void
  close: () => void
}

/**
 * contexts
 */
export const QuickDialogContext = React.createContext<QuickDialogContextType | null>(null)

/**
 * hooks
 */
export const useQuickDialogContext = () => {
  const context = React.useContext(QuickDialogContext)
  if (!context) {
    throw new Error("useQuickDialog must be used within a QuickDialogProvider")
  }
  return context
}
