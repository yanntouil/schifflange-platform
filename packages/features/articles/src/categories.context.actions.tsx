import { Selectable } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { type Api } from "@services/dashboard"
import { useArticlesService } from "./service.context"
import { SWRCategories } from "./swr"

/**
 * useCreateCategory
 * This hook is used to create a category. It will navigate to the new category after creation.
 * this hook is not dependent of the ArticleContextProvider.
 */
export const useCreateCategory = (swr?: SWRCategories) => {
  const [createCategory, createCategoryProps] = Ui.useQuickDialog<void, Api.ArticleCategory>({
    mutate: async (category) => swr?.append(category),
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
  const [createCategory, createCategoryProps] = useCreateCategory(swr)
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
      create: {
        title: "Create category",
        description:
          "You are about to create a category, if you want to continue you will be redirected to the new category.",
        success: "New category created",
        error: "Error while creating category",
        progress: "Creating category",
      },
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
      create: {
        title: "Créer une catégorie",
        description:
          "Vous êtes sur le point de créer une catégorie, si vous souhaitez continuer vous serez redirigé vers la nouvelle catégorie.",
        success: "Nouvelle catégorie créée",
        error: "Erreur lors de la création de la catégorie",
        progress: "Création de la catégorie en cours",
      },
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
      create: {
        title: "Kategorie erstellen",
        description:
          "Sie sind dabei, eine Kategorie zu erstellen. Wenn Sie fortfahren möchten, werden Sie zur neuen Kategorie weitergeleitet.",
        success: "Neue Kategorie erstellt",
        error: "Fehler beim Erstellen der Kategorie",
        progress: "Kategorie wird erstellt",
      },
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
