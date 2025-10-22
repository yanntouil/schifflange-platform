import { Selectable } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { type Api } from "@services/dashboard"
import { useDirectoryService } from "./service.context"
import { SWRCategories } from "./swr.categories"

/**
 * useCreateCategory
 */
export const useCreateCategory = (swr?: SWRCategories) => {
  const [createCategory, createCategoryProps] = Ui.useQuickDialog<void, Api.OrganisationCategory>({
    mutate: async (category) => swr?.append(category),
  })
  return [createCategory, createCategoryProps] as const
}

/**
 * useEdit
 */
export const useEdit = (swr: SWRCategories) => {
  const [editCategory, editCategoryProps] = Ui.useQuickDialog<Api.OrganisationCategory>({
    mutate: async (category) => swr.update(category),
  })
  return [editCategory, editCategoryProps] as const
}

/**
 * useConfirmDelete
 */
export const useConfirmDelete = (swr: SWRCategories) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useDirectoryService()
  const [confirmDeleteCategory, confirmDeleteCategoryProps] = Ui.useConfirm<Api.OrganisationCategory>({
    onAsyncConfirm: async (category) =>
      match(await service.organisations.categories.id(category.id).delete(category.id))
        .with({ ok: false }, () => true)
        .otherwise(() => {
          swr.rejectById(category.id)
          return false
        }),
    t: _.prefixed("confirm.delete"),
  })
  return [confirmDeleteCategory, confirmDeleteCategoryProps] as const
}

/**
 * useConfirmDeleteSelection
 */
export const useConfirmDeleteSelection = (swr: SWRCategories, selectable: Selectable<Api.OrganisationCategory>) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useDirectoryService()
  const [confirmDeleteSelection, confirmDeleteSelectionProps] = Ui.useConfirm<void, string>({
    onAsyncConfirm: async (id) =>
      match(await service.organisations.categories.id(id).delete(id))
        .with({ ok: false }, () => true)
        .otherwise(() => {
          swr.rejectById(id)
          return false
        }),
    finally: () => void swr.mutate(),
    list: selectable.selectedIds,
    t: _.prefixed("confirm.delete-selection"),
  })
  return [confirmDeleteSelection, confirmDeleteSelectionProps] as const
}

/**
 * ManageCategory type
 */
export type ManageCategory = ReturnType<typeof useManageCategory>[0]

/**
 * useManageCategory
 */
export const useManageCategory = (swr: SWRCategories, selectable: Selectable<Api.OrganisationCategory>) => {
  const [createCategory, createCategoryProps] = useCreateCategory(swr)
  const [editCategory, editCategoryProps] = useEdit(swr)
  const [confirmDeleteCategory, confirmDeleteCategoryProps] = useConfirmDelete(swr)
  const [confirmDeleteSelection, confirmDeleteSelectionProps] = useConfirmDeleteSelection(swr, selectable)

  const manageFn = {
    createCategory,
    editCategory,
    confirmDeleteCategory,
    confirmDeleteSelection,
  }
  const manageProps = {
    createCategoryProps,
    editCategoryProps,
    confirmDeleteCategoryProps,
    confirmDeleteSelectionProps,
  }
  return [manageFn, manageProps] as const
}

/**
 * translations
 */
const dictionary = {
  en: {
    confirm: {
      delete: {
        title: "Delete category",
        success: "Category has been deleted",
        error: "Error while deleting category",
        progress: "Deleting category",
      },
      "delete-selection": {
        title: "Delete selected categories",
        success: "Categories have been deleted",
        error: "Error while deleting categories",
        progress: "Deleting {{counter}} / {{total}}",
      },
    },
  },
  fr: {
    confirm: {
      delete: {
        title: "Supprimer la catégorie",
        success: "La catégorie a été supprimée",
        error: "Erreur lors de la suppression de la catégorie",
        progress: "Suppression de la catégorie en cours",
      },
      "delete-selection": {
        title: "Supprimer les catégories sélectionnées",
        success: "Les catégories ont été supprimées",
        error: "Erreur lors de la suppression",
        progress: "Suppression de {{counter}} / {{total}}",
      },
    },
  },
  de: {
    confirm: {
      delete: {
        title: "Kategorie löschen",
        success: "Kategorie wurde gelöscht",
        error: "Fehler beim Löschen der Kategorie",
        progress: "Kategorie wird gelöscht",
      },
      "delete-selection": {
        title: "Ausgewählte Kategorien löschen",
        success: "Kategorien wurden gelöscht",
        error: "Fehler beim Löschen der Kategorien",
        progress: "Löschen {{counter}} / {{total}}",
      },
    },
  },
}
