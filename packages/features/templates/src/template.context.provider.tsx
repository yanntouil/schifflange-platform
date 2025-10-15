import { Ui } from "@compo/ui"
import React from "react"
import { EditTemplateDialog } from "./components"
import { SWRSafeTemplate } from "./swr"
import { TemplateContext } from "./template.context"
import { useManageTemplate } from "./template.context.actions"

/**
 * TemplateProvider
 */
type TemplateProviderProps = {
  swr: SWRSafeTemplate
  children: React.ReactNode
}

export const TemplateProvider: React.FC<TemplateProviderProps> = ({ swr, children }) => {
  const contextId = React.useId()
  const [manageTemplate, manageTemplateProps] = useManageTemplate(swr)
  const contextProps = React.useMemo(() => ({ contextId, swr }), [contextId, swr])
  const value = React.useMemo(() => ({ ...contextProps, ...manageTemplate, swr }), [contextProps, manageTemplate, swr])

  return (
    <TemplateContext.Provider key={contextId} value={value}>
      {children}
      <ManageTemplate {...manageTemplateProps} key={`${contextId}-manageTemplate`} />
    </TemplateContext.Provider>
  )
}

/**
 * ManageTemplate
 */
type ManageTemplateProps = ReturnType<typeof useManageTemplate>[1]
const ManageTemplate: React.FC<ManageTemplateProps> = ({ editTemplateProps, confirmDeleteProps }) => {
  return (
    <>
      <EditTemplateDialog {...editTemplateProps} />
      <Ui.Confirm {...confirmDeleteProps} />
    </>
  )
}
