import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { A, D, G } from "@compo/utils"
import { arrayMove } from "@dnd-kit/sortable"
import { type Api } from "@services/dashboard"
import React from "react"
import { match } from "ts-pattern"
import { ContentMutationsHelpers } from "./context"
import { duplicatePayload } from "./utils"

/**
 * usePreviewMode
 */
export const previewTypes = ["mobile", "tablet-landscape", "tablet-portrait", "desktop"] as const
export type PreviewType = (typeof previewTypes)[number]
export const usePreviewMode = () => {
  const [open, onOpenChange] = React.useState(false)
  const [type, setType] = React.useState<PreviewType>("desktop")
  return { open, onOpenChange, type, setType }
}

/**
 * useEditItem
 */
export const useEditItem = () => {
  const [editItem, editItemProps] = Ui.useQuickDialog<Api.ContentItem>()
  return [editItem, editItemProps] as const
}

/**
 * useCreateItem
 */
export const useCreateItem = () => {
  const [createItem, createItemProps] = Ui.useQuickDialog<number>()
  return [createItem, createItemProps] as const
}

/**
 * useDuplicateItem
 */
export const useDuplicateItem = (service: Api.ContentService, appendItem: ContentMutationsHelpers["appendItem"]) => {
  const { _ } = useTranslation(dictionary)
  const duplicateItem = async (item: Api.ContentItem) =>
    match(await service.items.create(duplicatePayload(item)))
      .with({ failed: true }, () => Ui.toast.error(_("duplicate-error")))
      .otherwise(({ data }) => {
        Ui.toast.success(_("duplicate-success"))
        appendItem(data.item, data.sortedIds)
      })

  return duplicateItem
}

/**
 * useReorderItems
 */
export const useReorderItems = (service: Api.ContentService, reorderItems: ContentMutationsHelpers["reorderItems"]) => {
  const { _ } = useTranslation(dictionary)
  const reorder = async (items: string[]) => {
    reorderItems(items)
    match(await service.items.reorder({ items }))
      .with({ failed: true }, () => Ui.toast.error(_("reorder-error")))
      .otherwise(({ data }) => {
        //
      })
  }
  return reorder
}

/**
 * useConfirmDeleteItem
 */
export const useConfirmDeleteItem = (
  service: Api.ContentService,
  rejectItem: ContentMutationsHelpers["rejectItem"]
) => {
  const { _ } = useTranslation(dictionary)
  const [confirmDelete, confirmDeleteProps] = Ui.useConfirm<Api.ContentItem>({
    onAsyncConfirm: async (item) =>
      match(await service.items.id(item.id).delete())
        .with({ failed: true }, () => true)
        .otherwise(({ data }) => {
          rejectItem(item, data.sortedIds)
          return false
        }),
    t: _.prefixed("confirm.delete"),
  })
  return [confirmDelete, confirmDeleteProps] as const
}

/**
 * useToggleItemState
 */
export const useToggleItemState = (service: Api.ContentService, updateItem: ContentMutationsHelpers["updateItem"]) => {
  const { _ } = useTranslation(dictionary)
  const toggleItemState = async (item: Api.ContentItem) => {
    match(await service.items.id(item.id).update({ state: item.state === "published" ? "draft" : "published" }))
      .with({ failed: true }, () => Ui.toast.error(_("toggle-state-error")))
      .otherwise(({ data }) => {
        updateItem(data.item)
        Ui.toast.success(_(`toggle-state-${item.state}-success`))
      })
  }
  return toggleItemState
}

/**
 * useMoveItemTo
 */
export const useMoveItemTo = (
  service: Api.ContentService,
  reorderItems: ContentMutationsHelpers["reorderItems"],
  content: Api.Content
) => {
  const { _ } = useTranslation(dictionary)
  const moveItemTo = async (item: Api.ContentItem, direction: "top" | "bottom") => {
    const list = A.map(content.items, D.prop("id"))
    const oldIndex = A.getIndexBy(list, (id) => id === item.id)
    if (G.isNullable(oldIndex)) return
    const items = arrayMove([...list], oldIndex, direction === "top" ? 0 : list.length - 1)
    reorderItems(items)
    match(await service.items.reorder({ items }))
      .with({ failed: true }, () => Ui.toast.error(_("reorder-error")))
      .otherwise(({ data }) => {
        //
      })
  }
  return moveItemTo
}

/**
 * useManageItems
 */
export const useManageItems = (
  service: Api.ContentService,
  content: Api.Content,
  mutations: ContentMutationsHelpers
) => {
  const preview = usePreviewMode()
  const [editItem, editItemProps] = useEditItem()
  const [createItem, createItemProps] = useCreateItem()
  const duplicateItem = useDuplicateItem(service, mutations.appendItem)
  const reorder = useReorderItems(service, mutations.reorderItems)
  const moveItemTo = useMoveItemTo(service, mutations.reorderItems, content)
  const toggleItemState = useToggleItemState(service, mutations.updateItem)
  const [confirmDelete, confirmDeleteProps] = useConfirmDeleteItem(service, mutations.rejectItem)
  // const props = React.useMemo(
  //   () => ({
  //     editItemProps,
  //     createItemProps,
  //     confirmDeleteProps,
  //   }),
  //   [editItemProps, createItemProps, confirmDeleteProps]
  // )
  const props = {
    editItemProps,
    createItemProps,
    confirmDeleteProps,
  }
  const actions = React.useMemo(
    () => ({
      preview,
      editItem,
      createItem,
      duplicateItem,
      reorder,
      moveItemTo,
      toggleItemState,
      confirmDelete,
    }),
    [preview, editItem, createItem, duplicateItem, reorder, moveItemTo, toggleItemState, confirmDelete]
  )
  return [actions, props] as const
}
export type ManageItems = ReturnType<typeof useManageItems>[0]

/**
 * translations
 */
const dictionary = {
  en: {
    "reorder-error": "An error occurred while reordering content blocks",
    "toggle-state-error": "Error updating content block",
    "toggle-state-published-success": "The content block has been published",
    "toggle-state-draft-success": "The content block has been set to draft",
    "duplicate-error": "An error occurred while duplicating the content block",
    "duplicate-success": "The content block has been duplicated",
    confirm: {
      delete: {
        title: "Delete content block",
        success: "The content block has been deleted",
        error: "An error occurred while deleting the content block",
        progress: "Deleting content block in progress",
      },
    },
  },
  de: {
    "reorder-error": "Ein Fehler ist beim Neuordnen der Inhalts-Blöcke aufgetreten",
    "toggle-state-error": "Fehler beim Aktualisieren des Inhalts-Blocks",
    "toggle-state-published-success": "Der Inhalts-Block wurde veröffentlicht",
    "toggle-state-draft-success": "Der Inhalts-Block wurde auf Entwurf gesetzt",
    "duplicate-error": "Ein Fehler ist beim Duplizieren des Inhalts-Blocks aufgetreten",
    "duplicate-success": "Der Inhalts-Block wurde dupliziert",
    confirm: {
      delete: {
        title: "Inhalts-Block löschen",
        success: "Der Inhalts-Block wurde gelöscht",
        error: "Ein Fehler ist beim Löschen des Inhalts-Blocks aufgetreten",
        progress: "Löschen des Inhalts-Blocks läuft",
      },
    },
  },
  fr: {
    "reorder-error": "Une erreur est survenue lors du réordonnement des blocs de contenu",
    "toggle-state-error": "Erreur lors de la mise à jour du bloc de contenu",
    "toggle-state-published-success": "Le bloc de contenu a été publié",
    "toggle-state-draft-success": "Le bloc de contenu a été mis en brouillon",
    "duplicate-error": "Une erreur est survenue lors de la duplication du bloc de contenu",
    "duplicate-success": "Le bloc de contenu a été dupliqué",
    confirm: {
      delete: {
        title: "Supprimer le bloc de contenu",
        success: "Le bloc de contenu a été supprimé",
        error: "Erreur lors de la suppression du bloc de contenu",
        progress: "Suppression du bloc de contenu en cours",
      },
    },
  },
}
