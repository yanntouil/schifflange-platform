import { Ui } from "@compo/ui"
import { Api } from "@services/dashboard"
import React from "react"
import { CreateDialog as FooterCreateDialog } from "./components/menu/footer-create"
import { EditDialog as FooterEditDialog } from "./components/menu/footer-edit"
import { CreateDialog as HeaderCreateDialog } from "./components/menu/header-create"
import { EditDialog as HeaderEditDialog } from "./components/menu/header-edit"
import { CreateDialog } from "./components/menu/item-create"
import { EditDialog } from "./components/menu/item-edit"
import { MenuContext } from "./menu.context"
import { useManageMenu } from "./menu.context.actions"
import { SWRSafeMenu } from "./swr"

type MenuProviderProps = {
  swr: SWRSafeMenu
  children: React.ReactNode
}

export const MenuProvider: React.FC<MenuProviderProps> = ({ swr, children }) => {
  const contextId = React.useId()

  // Manage menu items
  const [manageItem, manageItemProps] = useManageMenu(swr)

  const contextProps = React.useMemo(
    () => ({
      contextId,
      swr,
    }),
    [contextId, swr]
  )

  const value = React.useMemo(
    () => ({
      ...contextProps,
      ...manageItem,
    }),
    [contextProps, manageItem]
  )

  return (
    <MenuContext.Provider key={contextId} value={value}>
      {children}
      <ManageMenu {...manageItemProps} location={swr.menu.location} key={`${contextId}-manageItem`} />
    </MenuContext.Provider>
  )
}

/**
 * ManageMenuItem dialogs
 */
export type ManageMenuProps = ReturnType<typeof useManageMenu>[1] & { location: Api.Menu["location"] }
const ManageMenu: React.FC<ManageMenuProps> = ({
  createItemProps,
  editItemProps,
  createSubItemProps,
  editSubItemProps,
  confirmDeleteItemProps,
  confirmDeleteMenuProps,
  location,
}) => {
  return (
    <>
      {location === "header" && (
        <>
          <HeaderCreateDialog {...createSubItemProps} />
          <HeaderEditDialog {...editSubItemProps} />
        </>
      )}
      {location === "footer" && (
        <>
          <FooterCreateDialog {...createSubItemProps} />
          <FooterEditDialog {...editSubItemProps} />
        </>
      )}

      <CreateDialog {...createItemProps} />
      <EditDialog {...editItemProps} />
      <Ui.Confirm {...confirmDeleteItemProps} />
      <Ui.Confirm {...confirmDeleteMenuProps} />
    </>
  )
}
