import { Selectable } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { type Api } from "@services/dashboard"
import { useArticlesService } from "./service.context"
import { SWRCategories } from "./swr.categories"

/**
 * useCreateCategory
 * This hook is used to create a category. It will navigate to the new category after creation.
 * this hook is not dependent of the ArticleContextProvider.
 */
export const useCreateCategory = (append?: (category: Api.ArticleCategory) => void) => {
  const [createCategory, createCategoryProps] = Ui.useQuickDialog<void, Api.ArticleCategory>({
    mutate: async (category) => void append?.(category),
  })
  return [createCategory, createCategoryProps] as const
}

/**
 * useEditCategory
 */
export const useEditCategory = (swr: SWRCategories) => {
  const [editCategory, editCategoryProps] = Ui.useQuickDialog<Api.ArticleCategory>({
    mutate: async (category) => swr.update(category),
  })
  return [editCategory, editCategoryProps] as const
}

/**
 * useConfirmDeleteCategory
 */
export const useConfirmDeleteCategory = (swr: SWRCategories) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useArticlesService()
  const [confirmDeleteCategory, confirmDeleteCategoryProps] = Ui.useConfirm<Api.ArticleCategory>({
    onAsyncConfirm: async (category) =>
      match(await service.categories.id(category.id).delete())
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
 * useConfirmDeleteSelectionCategory
 */
export const useConfirmDeleteSelectionCategory = (swr: SWRCategories, selectable: Selectable<Api.ArticleCategory>) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useArticlesService()
  const [confirmDeleteSelection, confirmDeleteSelectionProps] = Ui.useConfirm<void, string>({
    onAsyncConfirm: async (id) =>
      match(await service.categories.id(id).delete())
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
export type ManageCategory = {
  createCategory: ReturnType<typeof useCreateCategory>[0]
  editCategory: ReturnType<typeof useEditCategory>[0]
  confirmDeleteCategory: ReturnType<typeof useConfirmDeleteCategory>[0]
  confirmDeleteSelectionCategory: ReturnType<typeof useConfirmDeleteSelectionCategory>[0]
}

/**
 * useManageCategory
 */
export const useManageCategory = (swr: SWRCategories, selectable: Selectable<Api.ArticleCategory>) => {
  const [createCategory, createCategoryProps] = useCreateCategory(swr.append)
  const [editCategory, editCategoryProps] = useEditCategory(swr)
  const [confirmDeleteCategory, confirmDeleteCategoryProps] = useConfirmDeleteCategory(swr)
  const [confirmDeleteSelectionCategory, confirmDeleteSelectionCategoryProps] = useConfirmDeleteSelectionCategory(
    swr,
    selectable
  )

  const manageFn: ManageCategory = {
    createCategory,
    editCategory,
    confirmDeleteCategory,
    confirmDeleteSelectionCategory,
  }

  const manageProps = {
    createCategoryProps,
    editCategoryProps,
    confirmDeleteCategoryProps,
    confirmDeleteSelectionCategoryProps,
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
