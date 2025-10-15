import { useTranslation } from "@compo/localize"
import { isSlugArticle, isSlugPage } from "@compo/slugs"
import { Ui } from "@compo/ui"
import { F, G, match } from "@compo/utils"
import { Api } from "@services/dashboard"
import { useLocation } from "wouter"
import { CreateDialogProps } from "./components/menu/item-create"
import { useMenusService } from "./service.context"
import { SWRSafeMenu } from "./swr"

/**
 * useDisplayResource
 */
export const useDisplayResource = () => {
  const [, navigate] = useLocation()
  const { routesTo } = useMenusService()
  const displayResource = (item: Api.MenuItemWithRelations) => {
    if (G.isNotNullable(item.slug)) {
      if (isSlugPage(item.slug)) navigate(routesTo.pages.byId(item.slug.page.id))
      if (isSlugArticle(item.slug)) navigate(routesTo.articles.byId(item.slug.article.id))
    }
  }
  return displayResource
}

/**
 * useCreateMenuItem
 */
export const useCreateItem = (swr: SWRSafeMenu) => {
  const [createItem, createItemProps] = Ui.useQuickDialog<CreateDialogProps>()
  return [createItem, createItemProps] as const
}

/**
 * useCreateSubItem
 */
export const useCreateSubItem = (swr: SWRSafeMenu) => {
  const [createSubItem, createSubItemProps] = Ui.useQuickDialog<CreateDialogProps>()
  return [createSubItem, createSubItemProps] as const
}

/**
 * useEditMenuItem
 */
export const useEditItem = (swr: SWRSafeMenu) => {
  const [editItem, editItemProps] = Ui.useQuickDialog<Api.MenuItemWithRelations>()
  return [editItem, editItemProps] as const
}

/**
 * useEditSubItem
 */
export const useEditSubItem = (swr: SWRSafeMenu) => {
  const [editSubItem, editSubItemProps] = Ui.useQuickDialog<Api.MenuItemWithRelations>()
  return [editSubItem, editSubItemProps] as const
}

/**
 * useToggleMenuItemState
 */
export const useToggleMenuItemState = (swr: SWRSafeMenu) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useMenusService()
  const toggleItemState = async (item: Api.MenuItemWithRelations) => {
    match(
      await service
        .id(swr.menu.id)
        .items.id(item.id)
        .update({ state: item.state === "published" ? "draft" : "published" })
    )
      .with({ ok: true }, ({ data }) => {
        swr.updateItem(data.item)
        Ui.toast.success(data.item.state === "published" ? _(`published-success`) : _(`draft-success`))
      })
      .otherwise(() => Ui.toast.error(_(`update-error`)))
  }
  return toggleItemState
}

/**
 * useReorderMenuItems
 */
export const useReorderMenuItems = (swr: SWRSafeMenu) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useMenusService()
  const reorderMenuItems = async (items: string[], parentId?: string) => {
    swr.reorderItems(items)
    const result = parentId
      ? await service.id(swr.menu.id).items.id(parentId).reorder({ items })
      : await service.id(swr.menu.id).items.reorder({ items })
    match(result)
      .with({ ok: false }, () => Ui.toast.error(_(`reorder-error`)))
      .otherwise(() => F.ignore)
  }
  return reorderMenuItems
}

/**
 * useConfirmDeleteMenuItem
 */
export const useConfirmDeleteMenuItem = (swr: SWRSafeMenu) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useMenusService()
  const [confirmDeleteItem, confirmDeleteItemProps] = Ui.useConfirm<Api.MenuItemWithRelations>({
    onAsyncConfirm: async (item) =>
      match(await service.id(swr.menu.id).items.id(item.id).delete())
        .with({ ok: false }, () => true)
        .with({ ok: true }, ({ data }) => {
          swr.rejectItem(item, data.sortedIds)
          return false
        })
        .otherwise(() => false),
    t: _.prefixed("confirm.delete"),
  })
  return [confirmDeleteItem, confirmDeleteItemProps] as const
}

/**
 * useConfirmDeleteMenu
 */
export const useConfirmDeleteMenu = (swr: SWRSafeMenu) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useMenusService()
  const [, navigate] = useLocation()
  const { routesTo } = useMenusService()
  const [confirmDeleteMenu, confirmDeleteMenuProps] = Ui.useConfirm<void>({
    onAsyncConfirm: async () =>
      match(await service.id(swr.menu.id).delete())
        .with({ ok: false }, () => true)
        .with({ ok: true }, ({ data }) => {
          navigate(routesTo.menus.list())
          return false
        })
        .otherwise(() => false),
    t: _.prefixed("confirm.delete"),
  })
  return [confirmDeleteMenu, confirmDeleteMenuProps] as const
}

/**
 * ManageMenu type
 */
export type ManageMenu = ReturnType<typeof useManageMenu>[0]

/**
 * useManageMenu
 */
export const useManageMenu = (swr: SWRSafeMenu) => {
  const displayResource = useDisplayResource()
  const [createItem, createItemProps] = useCreateSubItem(swr)
  const [createSubItem, createSubItemProps] = useCreateSubItem(swr)
  const [editItem, editItemProps] = useEditItem(swr)
  const [editSubItem, editSubItemProps] = useEditSubItem(swr)
  const toggleItemState = useToggleMenuItemState(swr)
  const reorderMenuItems = useReorderMenuItems(swr)
  const [confirmDeleteItem, confirmDeleteItemProps] = useConfirmDeleteMenuItem(swr)
  const [confirmDeleteMenu, confirmDeleteMenuProps] = useConfirmDeleteMenu(swr)

  const manageItem = {
    displayResource,
    createItem,
    createSubItem,
    editItem,
    editSubItem,
    toggleItemState,
    reorderMenuItems,
    confirmDeleteItem,
    confirmDeleteMenu,
  }

  const manageItemProps = {
    createItemProps,
    createSubItemProps,
    editItemProps,
    editSubItemProps,
    confirmDeleteItemProps,
    confirmDeleteMenuProps,
  }

  return [manageItem, manageItemProps] as const
}

/**
 * translations
 */
const dictionary = {
  fr: {
    // Messages de changement d'état
    "published-success": "L'élément de menu a été publié",
    "draft-success": "L'élément de menu a été mis en brouillon",
    "update-error": "Erreur lors de la mise à jour de l'élément",

    // Messages de réorganisation
    "reorder-error": "Erreur lors de la réorganisation des éléments",

    confirm: {
      delete: {
        title: "Supprimer l'élément de menu",
        description: "Êtes-vous sûr de vouloir supprimer cet élément de menu ?",
        success: "L'élément de menu a été supprimé",
        error: "Erreur lors de la suppression de l'élément",
        progress: "Suppression de l'élément en cours",
      },
    },
  },
  de: {
    // Statusänderungsnachrichten
    "published-success": "Das Menüelement wurde veröffentlicht",
    "draft-success": "Das Menüelement wurde als Entwurf gespeichert",
    "update-error": "Fehler beim Aktualisieren des Menüelements",

    // Neuordnungsnachrichten
    "reorder-error": "Fehler beim Neuordnen der Menüelemente",

    confirm: {
      delete: {
        title: "Menüelement löschen",
        description: "Sind Sie sicher, dass Sie dieses Menüelement löschen möchten?",
        success: "Das Menüelement wurde gelöscht",
        error: "Fehler beim Löschen des Menüelements",
        progress: "Menüelement wird gelöscht",
      },
    },
  },
  en: {
    // Toggle state messages
    "published-success": "Menu item has been published",
    "draft-success": "Menu item has been saved as draft",
    "update-error": "Error while updating menu item",

    // Reorder messages
    "reorder-error": "Error while reordering menu items",

    confirm: {
      delete: {
        title: "Delete menu item",
        description: "Are you sure you want to delete this menu item?",
        success: "Menu item has been deleted",
        error: "Error while deleting menu item",
        progress: "Deleting menu item",
      },
    },
  },
}
