import { VariantProps } from "@compo/utils"
import React from "react"
import { collectionVariants } from "./collection.variants"

/**
 * types
 */
type CollectionContextType = {
  view: VariantProps<typeof collectionVariants>["view"]
}

/**
 * contexts
 */
export const CollectionContext = React.createContext<CollectionContextType>({ view: "row" })

/**
 * hooks
 */
export const useCollection = () => {
  const context = React.useContext(CollectionContext)
  if (!context) {
    throw new Error("useCollection must be used within a CollectionProvider")
  }
  return context
}
