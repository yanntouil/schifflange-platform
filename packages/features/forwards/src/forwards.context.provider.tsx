import { useKeepOnly, useSelectable } from "@compo/hooks"
import { Ui } from "@compo/ui"
import { type Api } from "@services/dashboard"
import React from "react"
import { ForwardsCreateDialog } from "./components/forwards.create"
import { ForwardsEditDialog } from "./components/forwards.edit"
import { useManageForward } from "./forward.context.actions"
import { ForwardsContext } from "./forwards.context"
import { SWRForwards } from "./swr"

/**
 * ForwardsProvider
 */
type ForwardsProviderProps = {
  swr: SWRForwards
  onSelect?: (selected: Api.Forward[]) => void
  children: React.ReactNode
}

export const ForwardsProvider: React.FC<ForwardsProviderProps> = ({ swr, onSelect, children }) => {
  const contextId = React.useId()

  // selectable
  const selectable = useSelectable<Api.Forward>()

  useKeepOnly(swr.forwards, selectable.keepOnly)

  const [manageForward, manageForwardProps] = useManageForward(swr, selectable)

  const contextProps = React.useMemo(
    () => ({
      // context service and data
      contextId,
      swr,
      // selectable
      ...selectable,
    }),
    [selectable, contextId, swr]
  )

  const value = React.useMemo(
    () => ({
      ...contextProps,
      ...manageForward,
      swr,
    }),
    [contextProps, manageForward, swr]
  )
  return (
    <ForwardsContext.Provider key={contextId} value={value}>
      {children}
      <ManageForward {...manageForwardProps} key={`${contextId}-manageForward`} />
    </ForwardsContext.Provider>
  )
}

/**
 * ManageForward
 */
export type ManageForwardProps = ReturnType<typeof useManageForward>[1]
const ManageForward: React.FC<ManageForwardProps> = ({
  createForwardProps,
  editForwardProps,
  confirmDeleteForwardProps,
  confirmDeleteSelectionProps,
}) => {
  return (
    <>
      <ForwardsEditDialog {...editForwardProps} />
      <ForwardsCreateDialog {...createForwardProps} />
      <Ui.Confirm {...confirmDeleteForwardProps} />
      <Ui.Confirm {...confirmDeleteSelectionProps} />
    </>
  )
}
