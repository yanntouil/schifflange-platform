import { Selectable } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { A, match } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { useLocation } from "wouter"
import { useDirectoryService } from "./service.context"
import { SWRSafeOrganisation } from "./swr.organisation"

/**
 * useAddContact
 */
export const useAddContact = (swr: SWRSafeOrganisation) => {
  const [addContact, addContactProps] = Ui.useQuickDialog<void, Api.ContactOrganisation>({
    mutate: async (contactOrganisation) => {
      await swr.appendContactOrganisation(contactOrganisation)
    },
  })
  return [addContact, addContactProps] as const
}

/**
 * useDisplayContact
 */
export const useDisplayContact = () => {
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
 * useEditContact
 */
export const useEditContact = (swr: SWRSafeOrganisation) => {
  const [editContact, editContactProps] = Ui.useQuickDialog<Api.Contact>({
    mutate: async (contact) => {
      await swr.updateContact(contact)
    },
  })
  return [editContact, editContactProps] as const
}

/**
 * useEditContact
 */
export const useContactDetails = (swr: SWRSafeOrganisation) => {
  const [contactDetails, contactDetailsProps] = Ui.useQuickDialog<Api.ContactOrganisation>()
  return [contactDetails, contactDetailsProps] as const
}

/**
 * useEditContactOrganisation
 */
export const useEditContactOrganisation = (swr: SWRSafeOrganisation) => {
  const [editContact, editContactProps] = Ui.useQuickDialog<Api.ContactOrganisation>({
    mutate: async (contactOrganisation) => {
      await swr.updateContactOrganisation(contactOrganisation)
    },
  })
  return [editContact, editContactProps] as const
}

/**
 * useEdit
 */
export const useEdit = (swr: SWRSafeOrganisation) => {
  const [edit, editProps] = Ui.useQuickDialog<Api.Organisation>({
    mutate: async (organisation) => {
      await swr.mutateOrganisation(organisation)
    },
  })
  const editOrganisation = () => edit(swr.organisation)
  return [editOrganisation, editProps] as const
}

/**
 * useConfirmDeleteContact
 */
export const useConfirmDeleteContact = (swr: SWRSafeOrganisation) => {
  const { _ } = useTranslation(dictionary)
  const { service, routesTo } = useDirectoryService()
  const [, navigate] = useLocation()
  const [confirmDelete, confirmDeleteProps] = Ui.useConfirm<Api.ContactOrganisation>({
    onAsyncConfirm: async (contactOrganisation) =>
      match(await service.id(contactOrganisation.contact.id).delete())
        .with({ ok: false }, () => true)
        .otherwise(() => {
          swr.rejectContactById(contactOrganisation.id)
          return false
        }),
    t: _.prefixed("confirm.delete-contact"),
  })
  return [confirmDelete, confirmDeleteProps] as const
}

/**
 * useConfirmDeleteContactOrganisation
 */
export const useConfirmDeleteContactOrganisation = (swr: SWRSafeOrganisation) => {
  const { _ } = useTranslation(dictionary)
  const { service, routesTo } = useDirectoryService()
  const [, navigate] = useLocation()
  const [confirmDelete, confirmDeleteProps] = Ui.useConfirm<Api.ContactOrganisation>({
    onAsyncConfirm: async (contactOrganisation) =>
      match(
        await service.id(contactOrganisation.contact.id).organisations.id(contactOrganisation.organisationId).delete()
      )
        .with({ ok: false }, () => true)
        .otherwise(() => {
          swr.rejectContactOrganisationById(contactOrganisation.id)
          return false
        }),
    t: _.prefixed("confirm.delete-contact-organisation"),
  })
  return [confirmDelete, confirmDeleteProps] as const
}

/**
 * useConfirmDeleteSelection
 */
export const useConfirmDeleteSelection = (
  swr: SWRSafeOrganisation,
  selectable: Selectable<Api.ContactOrganisation>
) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useDirectoryService()
  const [confirmDeleteSelection, confirmDeleteSelectionProps] = Ui.useConfirm<void, string>({
    onAsyncConfirm: async (id) => {
      const contactOrganisation = A.find(swr.organisation.contactOrganisations, (co) => co.id === id)
      if (!contactOrganisation) return false
      return match(
        await service.id(contactOrganisation.contact.id).organisations.id(contactOrganisation.organisationId).delete()
      )
        .with({ ok: false }, () => true)
        .otherwise(() => {
          swr.rejectContactOrganisationById(id)
          return false
        })
    },
    finally: () => void swr.mutate(),
    list: selectable.selectedIds,
    t: _.prefixed("confirm.delete-selection"),
  })
  return [confirmDeleteSelection, confirmDeleteSelectionProps] as const
}

/**
 * useConfirmDelete
 */
export const useConfirmDelete = (swr: SWRSafeOrganisation) => {
  const { _ } = useTranslation(dictionary)
  const { service, routesTo } = useDirectoryService()
  const [, navigate] = useLocation()
  const [confirmDeleteFn, confirmDeleteProps] = Ui.useConfirm({
    onAsyncConfirm: async (organisation) =>
      match(await service.organisations.id(swr.organisation.id).delete())
        .with({ ok: false }, () => true)
        .otherwise(() => {
          navigate(routesTo.organizations.list())
          return false
        }),
    t: _.prefixed("confirm.delete"),
  })
  const confirmDelete = () => confirmDeleteFn(true)
  return [confirmDelete, confirmDeleteProps] as const
}

/**
 * ManageOrganisation type
 */
export type ManageOrganisation = ReturnType<typeof useManageOrganisation>[0]

/**
 * useManageOrganisation
 */
export const useManageOrganisation = (swr: SWRSafeOrganisation, selectable: Selectable<Api.ContactOrganisation>) => {
  const [addContact, addContactProps] = useAddContact(swr)
  const displayContact = useDisplayContact()
  const [editContact, editContactProps] = useEditContact(swr)
  const [contactDetails, contactDetailsProps] = useContactDetails(swr)
  const [editContactOrganisation, editContactOrganisationProps] = useEditContactOrganisation(swr)
  const [editOrganisation, editOrganisationProps] = useEdit(swr)
  const [confirmDelete, confirmDeleteProps] = useConfirmDelete(swr)
  const [confirmDeleteSelection, confirmDeleteSelectionProps] = useConfirmDeleteSelection(swr, selectable)
  const [confirmDeleteContactOrganisation, confirmDeleteContactOrganisationProps] =
    useConfirmDeleteContactOrganisation(swr)
  const [confirmDeleteContact, confirmDeleteContactProps] = useConfirmDeleteContactOrganisation(swr)

  const manageFn = {
    addContact,
    displayContact,
    editContact,
    contactDetails,
    editContactOrganisation,
    editOrganisation,
    confirmDelete,
    confirmDeleteSelection,
    confirmDeleteContactOrganisation,
    confirmDeleteContact,
  }
  const manageProps = {
    addContactProps,
    editContactProps,
    contactDetailsProps,
    editContactOrganisationProps,
    editOrganisationProps,
    confirmDeleteProps,
    confirmDeleteSelectionProps,
    confirmDeleteContactOrganisationProps,
    confirmDeleteContactProps,
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
        title: "Delete organisation",
        description:
          "Are you sure you want to delete this organisation? All child organisations and all contact information linked to this organisation will be permanently lost.",
        success: "Organisation has been deleted",
        error: "Error while deleting organisation",
        progress: "Deleting organisation",
      },
      "delete-contact": {
        title: "Delete contact",
        description:
          "Are you sure you want to delete this contact? This action is permanent and will remove the contact from all organisations.",
        success: "Contact has been deleted",
        error: "Error while deleting contact",
        progress: "Deleting contact",
      },
      "delete-contact-organisation": {
        title: "Remove contact from organisation",
        description:
          "Are you sure you want to remove this contact from this organisation? All linked data will be permanently lost.",
        success: "Contact has been removed from organisation",
        error: "Error while removing contact from organisation",
        progress: "Removing contact from organisation",
      },
      "delete-selection": {
        title: "Remove selected contacts from this organisation",
        description:
          "Selected contacts will be removed from the organisation. All linked data will be permanently lost.",
        success: "Contacts have been removed",
        error: "Error while removing contacts",
        progress: "Removing {{counter}} / {{total}}",
      },
    },
  },
  fr: {
    confirm: {
      delete: {
        title: "Supprimer l'organisation",
        description:
          "Êtes-vous sûr de vouloir supprimer cette organisation ? Toutes les organisations enfants et toutes les informations de contact liées à cette organisation seront définitivement perdues.",
        success: "L'organisation a été supprimée",
        error: "Erreur lors de la suppression de l'organisation",
        progress: "Suppression de l'organisation...",
      },
      "delete-contact": {
        title: "Supprimer le contact",
        description:
          "Êtes-vous sûr de vouloir supprimer ce contact ? Cette action est définitive et supprimera le contact de toutes les organisations.",
        success: "Le contact a été supprimé",
        error: "Erreur lors de la suppression du contact",
        progress: "Suppression du contact...",
      },
      "delete-contact-organisation": {
        title: "Retirer le contact de l'organisation",
        description:
          "Êtes-vous sûr de vouloir retirer ce contact de cette organisation ? Toutes les données liées seront définitivement perdues.",
        success: "Le contact a été retiré de l'organisation",
        error: "Erreur lors du retrait du contact de l'organisation",
        progress: "Retrait du contact de l'organisation...",
      },
      "delete-selection": {
        title: "Retirer les contacts sélectionnés de cette organisation",
        description:
          "Les contacts sélectionnés seront retirés de l'organisation. Toutes les données liées seront définitivement perdues.",
        success: "Les contacts ont été retirés",
        error: "Erreur lors du retrait",
        progress: "Retrait de {{counter}} / {{total}}",
      },
    },
  },
  de: {
    confirm: {
      delete: {
        title: "Organisation löschen",
        description:
          "Sind Sie sicher, dass Sie diese Organisation löschen möchten? Alle untergeordneten Organisationen und alle mit dieser Organisation verknüpften Kontaktinformationen gehen dauerhaft verloren.",
        success: "Organisation wurde gelöscht",
        error: "Fehler beim Löschen der Organisation",
        progress: "Organisation wird gelöscht...",
      },
      "delete-contact": {
        title: "Kontakt löschen",
        description:
          "Sind Sie sicher, dass Sie diesen Kontakt löschen möchten? Diese Aktion ist endgültig und entfernt den Kontakt aus allen Organisationen.",
        success: "Kontakt wurde gelöscht",
        error: "Fehler beim Löschen des Kontakts",
        progress: "Kontakt wird gelöscht...",
      },
      "delete-contact-organisation": {
        title: "Kontakt von Organisation entfernen",
        description:
          "Sind Sie sicher, dass Sie diesen Kontakt von dieser Organisation entfernen möchten? Alle verknüpften Daten gehen dauerhaft verloren.",
        success: "Kontakt wurde von der Organisation entfernt",
        error: "Fehler beim Entfernen des Kontakts von der Organisation",
        progress: "Kontakt wird von Organisation entfernt...",
      },
      "delete-selection": {
        title: "Ausgewählte Kontakte von dieser Organisation entfernen",
        description:
          "Die ausgewählten Kontakte werden von der Organisation entfernt. Alle verknüpften Daten gehen dauerhaft verloren.",
        success: "Kontakte wurden entfernt",
        error: "Fehler beim Entfernen",
        progress: "Entfernen von {{counter}} / {{total}}",
      },
    },
  },
}
