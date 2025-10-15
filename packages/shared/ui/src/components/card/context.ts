import { VariantProps } from "class-variance-authority"
import React from "react"
import { cardVariants } from "./variants"

/**
 * types
 */
export type CardContextType = {
  variant: VariantProps<typeof cardVariants>["variant"]
}

/**
 * context
 */
export const CardContext = React.createContext<CardContextType>({
  variant: "default",
})

/**
 * hook
 */
export const useCard = () => React.useContext(CardContext)
