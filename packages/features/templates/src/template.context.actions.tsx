import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { Api } from "@services/dashboard"
import React from "react"
import { useLocation } from "wouter"
import { useTemplatesService } from "./service.context"
import { SWRSafeTemplate } from "./swr"

/**
 * useEditTemplate
 */
export const useEditTemplate = (swr: SWRSafeTemplate) => {
  const [trigger, editTemplateProps] = Ui.useQuickDialog<Api.TemplateWithRelations>({
    mutate: async (template) => void swr.mutateTemplate(template),
  })
  const editTemplate = React.useCallback(() => trigger(swr.template), [trigger, swr.template])
  return [editTemplate, editTemplateProps] as const
}

/**
 * useDuplicateTemplate
 */
export const useDuplicateTemplate = (swr: SWRSafeTemplate) => {
  const { _ } = useTranslation(dictionary)
  const { service, routeToTemplate } = useTemplatesService()
  const [, navigate] = useLocation()

  const duplicateTemplate = async () =>
    match(await service.id(swr.template.id).duplicate())
      .with({ ok: false }, () => {
        Ui.toast.error(_("duplicate.error"))
        return true
      })
      .otherwise(({ data }) => {
        navigate(routeToTemplate(data.template.id))
        Ui.toast.success(_("duplicate.success"))
      })
  return duplicateTemplate
}

/**
 * useConfirmDeleteTemplate
 */
export const useConfirmDeleteTemplate = (swr: SWRSafeTemplate) => {
  const { _ } = useTranslation(dictionary)
  const [, navigate] = useLocation()
  const { service, routeToTemplates } = useTemplatesService()
  const [confirmDeleteTemplate, confirmDeleteTemplateProps] = Ui.useConfirm<void>({
    onAsyncConfirm: async () =>
      match(await service.id(swr.templateId).delete())
        .with({ ok: false }, () => true)
        .otherwise(() => {
          navigate(routeToTemplates())
          return false
        }),
    t: _.prefixed("confirm.delete"),
  })
  return [confirmDeleteTemplate, confirmDeleteTemplateProps] as const
}

/**
 * ManageTemplate type
 */
export type ManageTemplate = ReturnType<typeof useManageTemplate>[0]

/**
 * useManageTemplate
 */
export const useManageTemplate = (swr: SWRSafeTemplate) => {
  const [editTemplate, editTemplateProps] = useEditTemplate(swr)
  const duplicateTemplate = useDuplicateTemplate(swr)
  const [confirmDelete, confirmDeleteProps] = useConfirmDeleteTemplate(swr)

  const manageTemplate = {
    editTemplate,
    duplicateTemplate,
    confirmDelete,
  }

  const manageTemplateProps = {
    editTemplateProps,
    confirmDeleteProps,
  }

  return [manageTemplate, manageTemplateProps] as const
}

/**
 * translations
 */
const dictionary = {
  en: {
    confirm: {
      delete: {
        title: "Delete template",
        description:
          "This action cannot be undone. This will permanently delete the template and all its associated content.",
        success: "Template has been deleted",
        error: "Error while deleting template",
        progress: "Deleting template",
      },
    },
  },
  fr: {
    confirm: {
      delete: {
        title: "Supprimer le modèle",
        description:
          "Cette action est irréversible. Le modèle sera définitivement supprimé ainsi que tout son contenu.",
        success: "Le modèle a été supprimé",
        error: "Erreur lors de la suppression du modèle",
        progress: "Suppression du modèle en cours",
      },
    },
  },
  de: {
    confirm: {
      delete: {
        title: "Vorlage löschen",
        description:
          "Diese Aktion kann nicht rückgängig gemacht werden. Die Vorlage wird dauerhaft gelöscht, einschließlich aller Inhalte.",
        success: "Die Vorlage wurde gelöscht",
        error: "Fehler beim Löschen der Vorlage",
        progress: "Vorlage wird gelöscht",
      },
    },
  },
}
