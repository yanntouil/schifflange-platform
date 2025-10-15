import { useKeepOnly, useSelectable } from "@compo/hooks"
import { Ui } from "@compo/ui"
import { Api } from "@services/dashboard"
import React from "react"
import { MenusCreateDialog } from "./components/menus.create"
import { MenusEditDialog } from "./components/menus.edit"
import { MenusContext } from "./menus.context"
import { useManageMenu } from "./menus.context.actions"
import { SWRMenus } from "./swr"

type MenusProviderProps = {
  swr: SWRMenus
  onSelect?: (selected: (Api.Menu & Api.WithMenuItems)[]) => void
  children: React.ReactNode
}

export const MenusProvider: React.FC<MenusProviderProps> = ({ swr, onSelect, children }) => {
  const contextId = React.useId()

  const selectable = useSelectable<Api.Menu & Api.WithMenuItems>()

  useKeepOnly(swr.menus, selectable.keepOnly)

  const [manageMenu, manageMenuProps] = useManageMenu(swr, selectable)

  const contextProps = React.useMemo(
    () => ({
      contextId,
      swr,
      ...selectable,
    }),
    [selectable, contextId, swr]
  )

  const value = React.useMemo(
    () => ({
      ...contextProps,
      ...manageMenu,
      swr,
    }),
    [contextProps, manageMenu, swr]
  )

  return (
    <MenusContext.Provider key={contextId} value={value}>
      {children}
      <ManageMenu {...manageMenuProps} key={`${contextId}-manageMenu`} />
    </MenusContext.Provider>
  )
}

type ManageMenuProps = ReturnType<typeof useManageMenu>[1]
const ManageMenu: React.FC<ManageMenuProps> = ({
  createMenuProps,
  editMenuProps,
  confirmDeleteMenuProps,
  confirmDeleteSelectionProps,
}) => {
  return (
    <>
      <MenusEditDialog {...editMenuProps} />
      <MenusCreateDialog {...createMenuProps} />
      <Ui.Confirm {...confirmDeleteMenuProps} />
      <Ui.Confirm {...confirmDeleteSelectionProps} />
    </>
  )
}
