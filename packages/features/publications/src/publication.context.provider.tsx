import { Ui } from "@compo/ui"
import React from "react"
import { PublicationDialog } from "./components"
import { PublicationContext, PublicationContextType } from "./publication.context"

type Props = {
  children: React.ReactNode
} & Omit<PublicationContextType, "contextId" | "edit">

export const PublicationProvider: React.FC<Props> = ({ children, ...props }) => {
  const contextId = React.useId()
  const [edit, editProps] = Ui.useQuickDialog<void>()
  const value = React.useMemo(() => ({ contextId, ...props, edit }), [contextId, props, edit])
  return (
    <PublicationContext.Provider value={value}>
      {children}
      <PublicationDialog {...editProps} />
    </PublicationContext.Provider>
  )
}
