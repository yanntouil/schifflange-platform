import { Ui } from "@compo/ui"
import React from "react"
import { SeoDialog } from "./components"
import { SeoContext, SeoContextType } from "./seo.context"

type Props = {
  children: React.ReactNode
} & Omit<SeoContextType, "contextId" | "edit">

export const SeoProvider: React.FC<Props> = ({ children, ...props }) => {
  const contextId = React.useId()
  const [edit, editProps] = Ui.useQuickDialog<void>()
  const value = React.useMemo(() => ({ contextId, ...props, edit }), [contextId, props, edit])
  return (
    <SeoContext.Provider value={value}>
      {children}
      <SeoDialog {...editProps} />
    </SeoContext.Provider>
  )
}
