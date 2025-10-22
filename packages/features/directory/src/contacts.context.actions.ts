import { Selectable } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { useLocation } from "wouter"
import { useDirectoryService } from "./service.context"
import { SWRContacts } from "./swr.contacts"

/**
 * useDisplay
 */
export const useDisplay = () => {
  const [, navigate] = useLocation()
  const { routesTo } = useDirectoryService()
  const displayContact = React.useCallback(
    (contact: Api.Contact) => {
      navigate(routesTo.contacts.byId(contact.id))
    },
    [navigate, routesTo.contacts]
  )
  return displayContact
}

/**
 * useCreateContact
 */
export const useCreateContact = (swr?: SWRContacts) => {
  const [createContact, createContactProps] = Ui.useQuickDialog<void, Api.Contact>({
    mutate: async (contact) => void swr?.append(contact),
  })
  return [createContact, createContactProps] as const
}

/**
 * useEdit
 */
export const useEdit = (swr: SWRContacts) => {
  const [editContact, editContactProps] = Ui.useQuickDialog<Api.Contact>({
    mutate: async (contact) => swr.update(contact),
  })
  return [editContact, editContactProps] as const
}

/**
 * useConfirmDelete
 */
export const useConfirmDelete = (swr: SWRContacts) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useDirectoryService()
  const [confirmDeleteContact, confirmDeleteContactProps] = Ui.useConfirm<Api.Contact>({
    onAsyncConfirm: async (contact) =>
      match(await service.id(contact.id).delete())
        .with({ ok: false }, () => true)
        .otherwise(() => {
          swr.rejectById(contact.id)
          return false
        }),
    t: _.prefixed("confirm.delete"),
  })
  return [confirmDeleteContact, confirmDeleteContactProps] as const
}

/**
 * useConfirmDeleteSelection
 */
export const useConfirmDeleteSelection = (swr: SWRContacts, selectable: Selectable<Api.Contact>) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useDirectoryService()
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
 * ManageContact type
 */
export type ManageContact = ReturnType<typeof useManageContact>[0]

/**
 * useManageContact
 */
export const useManageContact = (swr: SWRContacts, selectable: Selectable<Api.Contact>) => {
  const displayContact = useDisplay()
  const [createContact, createContactProps] = useCreateContact(swr)
  const [editContact, editContactProps] = useEdit(swr)
  const [confirmDeleteContact, confirmDeleteContactProps] = useConfirmDelete(swr)
  const [confirmDeleteSelection, confirmDeleteSelectionProps] = useConfirmDeleteSelection(swr, selectable)

  const manageFn = {
    displayContact,
    createContact,
    editContact,
    confirmDeleteContact,
    confirmDeleteSelection,
  }
  const manageProps = {
    createContactProps,
    editContactProps,
    confirmDeleteContactProps,
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
        title: "Delete contact",
        success: "Contact has been deleted",
        error: "Error while deleting contact",
        progress: "Deleting contact",
      },
      "delete-selection": {
        title: "Delete selected contacts",
        success: "Contacts have been deleted",
        error: "Error while deleting contacts",
        progress: "Deleting {{counter}} / {{total}}",
      },
    },
  },
  fr: {
    confirm: {
      delete: {
        title: "Supprimer le contact",
        success: "Le contact a été supprimé",
        error: "Erreur lors de la suppression du contact",
        progress: "Suppression du contact en cours",
      },
      "delete-selection": {
        title: "Supprimer les contacts sélectionnés",
        success: "Les contacts ont été supprimés",
        error: "Erreur lors de la suppression",
        progress: "Suppression de {{counter}} / {{total}}",
      },
    },
  },
  de: {
    confirm: {
      delete: {
        title: "Kontakt löschen",
        success: "Kontakt wurde gelöscht",
        error: "Fehler beim Löschen des Kontakts",
        progress: "Kontakt wird gelöscht",
      },
      "delete-selection": {
        title: "Ausgewählte Kontakte löschen",
        success: "Kontakte wurden gelöscht",
        error: "Fehler beim Löschen der Kontakte",
        progress: "Löschen {{counter}} / {{total}}",
      },
    },
  },
}
