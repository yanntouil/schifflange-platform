import { Selectable } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { Api } from "@services/dashboard"
import { useLocation } from "wouter"
import { useMenusService } from "./service.context"
import { SWRMenus } from "./swr"

/**
 * useDisplayMenu
 * Navigate to the menu details page
 */
export const useDisplayMenu = () => {
  const [, navigate] = useLocation()
  const { routesTo } = useMenusService()
  const displayMenu = (menu: Api.Menu & Api.WithMenuItems) => {
    navigate(routesTo.menus.byId(menu.id))
  }
  return displayMenu
}

/**
 * useCreateMenu
 * Create a new menu
 */
export const useCreateMenu = (swr: SWRMenus) => {
  const [createMenu, createMenuProps] = Ui.useQuickDialog<void, Api.Menu & Api.WithMenuItems>({
    mutate: async (menu) => void swr.mutateMenu(menu),
  })
  return [createMenu, createMenuProps] as const
}

/**
 * useEditMenu
 * Edit a menu
 */
export const useEditMenu = (swr: SWRMenus) => {
  const [editMenu, editMenuProps] = Ui.useQuickDialog<Api.Menu & Api.WithMenuItems>({
    mutate: async (menu) => void swr.mutateMenu(menu),
  })
  return [editMenu, editMenuProps] as const
}

/**
 * useConfirmDeleteMenu
 * Confirm the deletion of a menu
 */
export const useConfirmDeleteMenu = (swr: SWRMenus) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useMenusService()
  const [confirmDeleteMenu, confirmDeleteMenuProps] = Ui.useConfirm<Api.Menu & Api.WithMenuItems>({
    onAsyncConfirm: async (menu) =>
      match(await service.id(menu.id).delete())
        .with({ ok: false }, () => true)
        .otherwise(() => {
          swr.rejectMenu(menu)
          return false
        }),
    t: _.prefixed("confirm.delete"),
  })
  return [confirmDeleteMenu, confirmDeleteMenuProps] as const
}

/**
 * useConfirmDeleteSelection
 * Confirm the deletion of a selection of menus
 */
export const useConfirmDeleteSelection = (swr: SWRMenus, selectable: Selectable<Api.Menu & Api.WithMenuItems>) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useMenusService()
  const [confirmDeleteSelection, confirmDeleteSelectionProps] = Ui.useConfirm<void, string>({
    onAsyncConfirm: async (id) =>
      match(await service.id(id).delete())
        .with({ ok: false }, () => true)
        .otherwise(() => {
          swr.rejectMenuById(id)
          return false
        }),
    finally: () => void swr.mutate(),
    list: selectable.selectedIds,
    t: _.prefixed("confirm.delete-selection"),
  })
  return [confirmDeleteSelection, confirmDeleteSelectionProps] as const
}

/**
 * useManageMenu
 * Manage a menu
 */
export type ManageMenu = ReturnType<typeof useManageMenu>[0]
export const useManageMenu = (swr: SWRMenus, selectable: Selectable<Api.Menu & Api.WithMenuItems>) => {
  const displayMenu = useDisplayMenu()
  const [createMenu, createMenuProps] = useCreateMenu(swr)
  const [editMenu, editMenuProps] = useEditMenu(swr)
  const [confirmDeleteMenu, confirmDeleteMenuProps] = useConfirmDeleteMenu(swr)
  const [confirmDeleteSelection, confirmDeleteSelectionProps] = useConfirmDeleteSelection(swr, selectable)

  const manageMenu = {
    displayMenu,
    createMenu,
    editMenu,
    confirmDeleteMenu,
    confirmDeleteSelection,
  }

  const manageMenuProps = {
    createMenuProps,
    editMenuProps,
    confirmDeleteMenuProps,
    confirmDeleteSelectionProps,
  }

  return [manageMenu, manageMenuProps] as const
}

/**
 * translations
 */
const dictionary = {
  fr: {
    confirm: {
      delete: {
        title: "Supprimer le menu",
        success: "Le menu a été supprimé",
        error: "Erreur lors de la suppression du menu",
        progress: "Suppression du menu en cours",
      },
      "delete-selection": {
        title: "Supprimer les menus sélectionnés",
        success: "Les menus ont été supprimés",
        error: "Erreur lors de la suppression",
        progress: "Suppression de {{counter}} / {{total}}",
      },
    },
  },
  de: {
    confirm: {
      delete: {
        title: "Menü löschen",
        success: "Das Menü wurde gelöscht",
        error: "Fehler beim Löschen des Menüs",
        progress: "Menü wird gelöscht",
      },
      "delete-selection": {
        title: "Ausgewählte Menüs löschen",
        success: "Die Menüs wurden gelöscht",
        error: "Fehler beim Löschen",
        progress: "Löschen {{counter}} / {{total}}",
      },
    },
  },
  en: {
    confirm: {
      delete: {
        title: "Delete menu",
        success: "Menu has been deleted",
        error: "Error while deleting menu",
        progress: "Deleting menu",
      },
      "delete-selection": {
        title: "Delete selected menus",
        success: "Menus have been deleted",
        error: "Error while deleting menus",
        progress: "Deleting {{counter}} / {{total}}",
      },
    },
  },
}
