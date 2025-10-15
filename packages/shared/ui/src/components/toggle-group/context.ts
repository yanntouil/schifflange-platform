import * as React from "react"
import { type VariantProps } from "@compo/utils"
import { toggleVariants } from "../toggle"

/**
 * contexts
 */
export const ToggleGroupContext = React.createContext<VariantProps<typeof toggleVariants>>({
  size: "default",
  variant: "default",
})

/**
 * hooks
 */
export const useToggleGroupContext = () => React.useContext(ToggleGroupContext)
