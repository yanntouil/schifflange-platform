import { Selectable } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { useLocation } from "wouter"
import { useTemplatesService } from "./service.context"
import { SWRTemplates } from "./swr"

/**
 * useDisplayTemplate
 */
export const useDisplayTemplate = () => {
  const [, navigate] = useLocation()
  const { routeToTemplate } = useTemplatesService()
  const displayTemplate = React.useCallback(
    (template: Api.TemplateWithRelations) => {
      navigate(routeToTemplate(template.id))
    },
    [navigate, routeToTemplate]
  )
  return displayTemplate
}

/**
 * useCreateTemplate
 * This hook is used to create a template. It will navigate to the new template after creation.
 * this hook is not dependent of the TemplateContextProvider.
 */
export const useCreateTemplate = (append?: (template: Api.TemplateWithRelations) => void) => {
  const { _ } = useTranslation(dictionary)
  const [createTemplate, createTemplateProps] = Ui.useQuickDialog<void, Api.TemplateWithRelations>({
    mutate: async (template) => void append?.(template),
  })
  return [createTemplate, createTemplateProps] as const
}

/**
 * useEditTemplate
 */
export const useEditTemplate = (swr: SWRTemplates) => {
  const [editTemplate, editTemplateProps] = Ui.useQuickDialog<Api.TemplateWithRelations>({
    mutate: async (template) => swr.update(template),
  })
  return [editTemplate, editTemplateProps] as const
}

/**
 * useDuplicateTemplate
 */
export const useDuplicateTemplate = (swr: SWRTemplates) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useTemplatesService()
  const duplicateTemplate = async (template: Api.TemplateWithRelations) =>
    match(await service.id(template.id).duplicate())
      .with({ ok: false }, () => {
        Ui.toast.error(_("duplicate.error"))
        return true
      })
      .otherwise(({ data }) => {
        swr.append(data.template)
        Ui.toast.success(_("duplicate.success"))
      })
  return duplicateTemplate
}

/**
 * useConfirmDeleteTemplate
 */
export const useConfirmDeleteTemplate = (swr: SWRTemplates) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useTemplatesService()
  const [confirmDeleteTemplate, confirmDeleteTemplateProps] = Ui.useConfirm<Api.TemplateWithRelations>({
    onAsyncConfirm: async (template) =>
      match(await service.id(template.id).delete())
        .with({ ok: false }, () => true)
        .otherwise(() => {
          swr.rejectById(template.id)
          return false
        }),
    t: _.prefixed("confirm.delete"),
  })
  return [confirmDeleteTemplate, confirmDeleteTemplateProps] as const
}

/**
 * useConfirmDeleteSelection
 */
export const useConfirmDeleteSelection = (swr: SWRTemplates, selectable: Selectable<Api.TemplateWithRelations>) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useTemplatesService()
  const [confirmDeleteSelection, confirmDeleteSelectionProps] = Ui.useConfirm<void, string>({
    onAsyncConfirm: async (id) =>
      match(await service.id(id).delete())
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
 * ManageTemplate type
 */
export type ManageTemplate = ReturnType<typeof useManageTemplate>[0]

/**
 * useManageTemplate
 */
export const useManageTemplate = (swr: SWRTemplates, selectable: Selectable<Api.TemplateWithRelations>) => {
  const displayTemplate = useDisplayTemplate()
  const [createTemplate, createTemplateProps] = useCreateTemplate(swr.append)
  const [editTemplate, editTemplateProps] = useEditTemplate(swr)
  const duplicateTemplate = useDuplicateTemplate(swr)
  const [confirmDeleteTemplate, confirmDeleteTemplateProps] = useConfirmDeleteTemplate(swr)
  const [confirmDeleteSelection, confirmDeleteSelectionProps] = useConfirmDeleteSelection(swr, selectable)

  const manageTemplate = {
    displayTemplate,
    createTemplate,
    editTemplate,
    duplicateTemplate,
    confirmDeleteTemplate,
    confirmDeleteSelection,
  }

  const managetemplateProps = {
    createTemplateProps,
    editTemplateProps,
    confirmDeleteTemplateProps,
    confirmDeleteSelectionProps,
  }

  return [manageTemplate, managetemplateProps] as const
}

/**
 * translations
 */
const dictionary = {
  en: {
    duplicate: {
      error: "Error while duplicating template",
      success: "Template has been duplicated",
    },
    confirm: {
      create: {
        title: "Create template",
        description:
          "You are about to create a template, if you want to continue you will be redirected to the new template.",
        success: "New template created",
        error: "Error while creating template",
        progress: "Creating template",
      },
      delete: {
        title: "Delete template",
        success: "Template has been deleted",
        error: "Error while deleting template",
        progress: "Deleting template",
      },
      "delete-selection": {
        title: "Delete selected templates",
        success: "Templates have been deleted",
        error: "Error while deleting templates",
        progress: "Deleting {{counter}} / {{total}}",
      },
    },
  },
  fr: {
    duplicate: {
      error: "Erreur lors de la duplication du modèle",
      success: "Le modèle a été dupliqué",
    },
    confirm: {
      create: {
        title: "Créer un modèle",
        description:
          "Vous êtes sur le point de créer un modèle, si vous souhaitez continuer vous serez redirigé vers le nouveau modèle.",
        success: "Nouveau modèle créé",
        error: "Erreur lors de la création du modèle",
        progress: "Création du modèle en cours",
      },
      delete: {
        title: "Supprimer le modèle",
        success: "Le modèle a été supprimé",
        error: "Erreur lors de la suppression du modèle",
        progress: "Suppression du modèle en cours",
      },
      "delete-selection": {
        title: "Supprimer les modèles sélectionnés",
        success: "Les modèles ont été supprimés",
        error: "Erreur lors de la suppression",
        progress: "Suppression de {{counter}} / {{total}}",
      },
    },
  },
  de: {
    duplicate: {
      error: "Fehler beim Duplizieren der Vorlage",
      success: "Die Vorlage wurde dupliziert",
    },
    confirm: {
      create: {
        title: "Vorlage erstellen",
        description:
          "Sie sind dabei, eine Vorlage zu erstellen. Wenn Sie fortfahren möchten, werden Sie zur neuen Vorlage weitergeleitet.",
        success: "Neue Vorlage erstellt",
        error: "Fehler beim Erstellen der Vorlage",
        progress: "Vorlage wird erstellt",
      },
      delete: {
        title: "Vorlage löschen",
        success: "Die Vorlage wurde gelöscht",
        error: "Fehler beim Löschen der Vorlage",
        progress: "Vorlage wird gelöscht",
      },
      "delete-selection": {
        title: "Ausgewählte Vorlagen löschen",
        success: "Die Vorlagen wurden gelöscht",
        error: "Fehler beim Löschen",
        progress: "Löschen von {{counter}} / {{total}}",
      },
    },
  },
}
