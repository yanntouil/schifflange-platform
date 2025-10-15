import React from "react"
import { TemplatesContext, TemplatesContextType } from "./templates.context"

/**
 * provider
 */
export const TemplatesProvider: React.FC<React.PropsWithChildren<TemplatesContextType>> = ({ templates, children }) => {
  const context = React.useMemo(() => ({ templates }), [templates])
  return <TemplatesContext.Provider value={context}>{children}</TemplatesContext.Provider>
}
