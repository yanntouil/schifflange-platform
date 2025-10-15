import { MatchableSize } from "@compo/utils"
import React from "react"

/**
 * types
 */
export type ToolbarContextType = {
  size: MatchableSize
}

/**
 * context
 * context for the toolbar
 */
export const ToolbarContext = React.createContext<ToolbarContextType>({
  size: "default",
})

/**
 * hook
 * use the toolbar context
 */
export const useToolbar = () => {
  return React.useContext(ToolbarContext)
}
