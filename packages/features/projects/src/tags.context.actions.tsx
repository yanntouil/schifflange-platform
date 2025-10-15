import { Selectable } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { type Api } from "@services/dashboard"
import { useProjectsService } from "./service.context"
import { SWRTags } from "./swr"

/**
 * useCreateTag
 * This hook is used to create a tag. It will navigate to the new tag after creation.
 * this hook is not dependent of the ProjectContextProvider.
 */
export const useCreateTag = (swr: SWRTags) => {
  const [createTag, createTagProps] = Ui.useQuickDialog<void, Api.ProjectTag>({
    mutate: async (tag) => swr.append(tag),
  })
  return [createTag, createTagProps] as const
}

/**
 * useEditTag
 */
export const useEditTag = (swr: SWRTags) => {
  const [editTag, editTagProps] = Ui.useQuickDialog<Api.ProjectTag>({
    mutate: async (tag) => swr.update(tag),
  })
  return [editTag, editTagProps] as const
}

/**
 * useConfirmDeleteTag
 */
export const useConfirmDeleteTag = (swr: SWRTags) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useProjectsService()
  const [confirmDeleteTag, confirmDeleteTagProps] = Ui.useConfirm<Api.ProjectTag>({
    onAsyncConfirm: async (tag) =>
      match(await service.tags.id(tag.id).delete())
        .with({ ok: false }, () => true)
        .otherwise(() => {
          swr.rejectById(tag.id)
          return false
        }),
    t: _.prefixed("confirm.delete"),
  })
  return [confirmDeleteTag, confirmDeleteTagProps] as const
}

/**
 * useConfirmDeleteSelectionTag
 */
export const useConfirmDeleteSelectionTag = (swr: SWRTags, selectable: Selectable<Api.ProjectTag>) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useProjectsService()
  const [confirmDeleteSelection, confirmDeleteSelectionProps] = Ui.useConfirm<void, string>({
    onAsyncConfirm: async (id) =>
      match(await service.tags.id(id).delete())
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
 * ManageTag type
 */
export type ManageTag = {
  createTag: ReturnType<typeof useCreateTag>[0]
  editTag: ReturnType<typeof useEditTag>[0]
  confirmDeleteTag: ReturnType<typeof useConfirmDeleteTag>[0]
  confirmDeleteSelectionTag: ReturnType<typeof useConfirmDeleteSelectionTag>[0]
}

/**
 * useManageTag
 */
export const useManageTag = (swr: SWRTags, selectable: Selectable<Api.ProjectTag>) => {
  const [createTag, createTagProps] = useCreateTag(swr)
  const [editTag, editTagProps] = useEditTag(swr)
  const [confirmDeleteTag, confirmDeleteTagProps] = useConfirmDeleteTag(swr)
  const [confirmDeleteSelectionTag, confirmDeleteSelectionTagProps] = useConfirmDeleteSelectionTag(swr, selectable)

  const manageTag: ManageTag = {
    createTag,
    editTag,
    confirmDeleteTag,
    confirmDeleteSelectionTag,
  }

  const manageTagProps = {
    createTagProps,
    editTagProps,
    confirmDeleteTagProps,
    confirmDeleteSelectionTagProps,
  }

  return [manageTag, manageTagProps] as const
}

/**
 * translations
 */
const dictionary = {
  en: {
    confirm: {
      create: {
        title: "Create tag",
        description: "You are about to create a tag, if you want to continue you will be redirected to the new tag.",
        success: "New tag created",
        error: "Error while creating tag",
        progress: "Creating tag",
      },
      delete: {
        title: "Delete tag",
        success: "Tag has been deleted",
        error: "Error while deleting tag",
        progress: "Deleting tag",
      },
      "delete-selection": {
        title: "Delete selected tags",
        success: "Tags have been deleted",
        error: "Error while deleting tags",
        progress: "Deleting {{counter}} / {{total}}",
      },
    },
  },
  fr: {
    confirm: {
      create: {
        title: "Créer un tag",
        description:
          "Vous êtes sur le point de créer un tag, si vous souhaitez continuer vous serez redirigé vers le nouveau tag.",
        success: "Nouveau tag créé",
        error: "Erreur lors de la création du tag",
        progress: "Création du tag en cours",
      },
      delete: {
        title: "Supprimer le tag",
        success: "Le tag a été supprimé",
        error: "Erreur lors de la suppression du tag",
        progress: "Suppression du tag en cours",
      },
      "delete-selection": {
        title: "Supprimer les tags sélectionnés",
        success: "Les tags ont été supprimés",
        error: "Erreur lors de la suppression",
        progress: "Suppression de {{counter}} / {{total}}",
      },
    },
  },
  de: {
    confirm: {
      create: {
        title: "Tag erstellen",
        description:
          "Sie sind dabei, einen Tag zu erstellen. Wenn Sie fortfahren möchten, werden Sie zum neuen Tag weitergeleitet.",
        success: "Neuer Tag erstellt",
        error: "Fehler beim Erstellen des Tags",
        progress: "Tag wird erstellt",
      },
      delete: {
        title: "Kategorie löschen",
        success: "Tag wurde gelöscht",
        error: "Fehler beim Löschen des Tags",
        progress: "Tag wird gelöscht",
      },
      "delete-selection": {
        title: "Ausgewählte Tags löschen",
        success: "Tags wurden gelöscht",
        error: "Fehler beim Löschen der Tags",
        progress: "Lösche {{counter}} / {{total}}",
      },
    },
  },
}
