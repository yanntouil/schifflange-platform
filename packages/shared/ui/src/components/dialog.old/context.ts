import * as React from "react"
import { F } from "@compo/utils"

/**
 * types
 */
export type DialogContextType = {
  hasProvider: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
  isScroll: boolean
  setIsScroll: (isScroll: boolean) => void
  descriptionDisplayed: boolean
  setDescriptionDisplayed: (descriptionDisplayed: boolean) => void
  setHeaderHeight: (headerHeight: number) => void
  headerHeight: number
}

/**
 * context
 */
export const DialogContext = React.createContext<DialogContextType>({
  hasProvider: false,
  open: false,
  onOpenChange: F.ignore,
  isScroll: false,
  setIsScroll: F.ignore,
  descriptionDisplayed: true,
  setDescriptionDisplayed: F.ignore,
  setHeaderHeight: F.ignore,
  headerHeight: 0,
})

/**
 * hooks
 */
export const useDialogContext = () => React.useContext(DialogContext)
