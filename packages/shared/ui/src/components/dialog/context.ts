import React from "react"

/**
 * types
 */
export type DialogContextType = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * context
 */
export const DialogContext = React.createContext<DialogContextType>({
  open: false,
  onOpenChange: () => {},
})

/**
 * hooks
 */
export const useDialogContext = () => {
  const context = React.useContext(DialogContext)
  if (!context) {
    throw new Error("useDialogContext must be used within a DialogProvider")
  }
  return context
}
