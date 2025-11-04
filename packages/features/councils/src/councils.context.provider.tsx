import { useKeepOnly, useSelectable } from "@compo/hooks"
import { Ui } from "@compo/ui"
import { type Api } from "@services/dashboard"
import React from "react"
import { CouncilsCreateDialog } from "./components/councils.create"
import { CouncilsDisplayDialog } from "./components/councils.display"
import { CouncilsEditDialog } from "./components/councils.edit"
import { CouncilsContext } from "./councils.context"
import { useManageCouncils } from "./councils.context.actions"
import { SWRCouncils } from "./swr.councils"

/**
 * CouncilsProvider
 */
type CouncilsProviderProps = {
  swr: SWRCouncils
  children: React.ReactNode
}

export const CouncilsProvider: React.FC<CouncilsProviderProps> = ({ swr, children }) => {
  const contextId = React.useId()

  // selectable
  const selectable = useSelectable<Api.Council>()

  useKeepOnly(swr.councils, selectable.keepOnly)

  const [manageCouncils, manageCouncilsProps] = useManageCouncils(swr, selectable)

  const contextProps = React.useMemo(
    () => ({
      // context service and data
      contextId,
      swr,
      ...selectable,
    }),
    [selectable, contextId, swr]
  )

  const value = React.useMemo(
    () => ({
      ...contextProps,
      ...manageCouncils,
      swr,
    }),
    [contextProps, manageCouncils, swr]
  )

  return (
    <CouncilsContext.Provider key={contextId} value={value}>
      {children}
      <ManageCouncils {...manageCouncilsProps} key={`${contextId}-manageCouncils`} />
    </CouncilsContext.Provider>
  )
}

/**
 * ManageCouncils
 */
export type ManageCouncilsProps = ReturnType<typeof useManageCouncils>[1]
const ManageCouncils: React.FC<ManageCouncilsProps> = ({
  displayCouncilProps,
  createCouncilProps,
  editCouncilProps,
  confirmDeleteCouncilProps,
  confirmDeleteSelectionProps,
}) => {
  return (
    <>
      <CouncilsDisplayDialog {...displayCouncilProps} />
      <CouncilsCreateDialog {...createCouncilProps} />
      <CouncilsEditDialog {...editCouncilProps} />
      <Ui.Confirm {...confirmDeleteCouncilProps} />
      <Ui.Confirm {...confirmDeleteSelectionProps} />
    </>
  )
}
