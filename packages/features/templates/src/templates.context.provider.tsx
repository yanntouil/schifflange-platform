import { useKeepOnly, useSelectable } from "@compo/hooks"
import { Ui } from "@compo/ui"
import { type Api } from "@services/dashboard"
import React from "react"
import { EditTemplateDialog } from "./components/dialogs"
import { CreateTemplateDialog } from "./components/dialogs/create"
import { SWRTemplates } from "./swr"
import { TemplatesContext } from "./templates.context"
import { useManageTemplate } from "./templates.context.actions"

/**
 * TemplatesProvider
 */
type TemplatesProviderProps = {
  swr: SWRTemplates
  canSelectTemplate?: boolean
  multiple?: boolean
  onSelect?: (selected: Api.TemplateWithRelations[]) => void
  children: React.ReactNode
}

export const TemplatesProvider: React.FC<TemplatesProviderProps> = ({
  swr,
  canSelectTemplate = false,
  onSelect,
  children,
}) => {
  const contextId = React.useId()

  // selectable
  const selectable = useSelectable<Api.TemplateWithRelations>({
    multiple: true,
    onSelect,
  })

  useKeepOnly(swr.templates, selectable.keepOnly)

  const [manageTemplate, manageTemplateProps] = useManageTemplate(swr, selectable)

  const contextProps = React.useMemo(
    () => ({
      // context service and data
      contextId,
      swr,
      // selectable
      canSelectTemplate,
      ...selectable,
    }),
    [canSelectTemplate, selectable, contextId, swr]
  )

  const value = React.useMemo(
    () => ({
      ...contextProps,
      ...manageTemplate,
      swr,
    }),
    [contextProps, manageTemplate, swr]
  )
  return (
    <TemplatesContext.Provider key={contextId} value={value}>
      {children}
      <ManageTemplate {...manageTemplateProps} key={`${contextId}-manageTemplate`} />
    </TemplatesContext.Provider>
  )
}

/**
 * ManageTemplate
 */
export type ManageTemplateProps = ReturnType<typeof useManageTemplate>[1]
const ManageTemplate: React.FC<ManageTemplateProps> = ({
  createTemplateProps,
  editTemplateProps,
  confirmDeleteTemplateProps,
  confirmDeleteSelectionProps,
}) => {
  return (
    <>
      <EditTemplateDialog {...editTemplateProps} />
      <CreateTemplateDialog {...createTemplateProps} />
      <Ui.Confirm {...confirmDeleteTemplateProps} />
      <Ui.Confirm {...confirmDeleteSelectionProps} />
    </>
  )
}
