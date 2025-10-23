import { useKeepOnly, useSelectable } from "@compo/hooks"
import { Ui } from "@compo/ui"
import { Api } from "@services/dashboard"
import React from "react"
import { OrganisationsEditDialog } from "./components"
import { ContactsEditDialog } from "./components/contacts.edit"
import { OrganisationContactsAddDialog } from "./components/organisation.contacts.add"
import { OrganisationContactsDetailsDialog } from "./components/organisation.contacts.details"
import { OrganisationContactsEditDialog } from "./components/organisation.contacts.edit"
import { OrganisationContext } from "./organisation.context"
import { useManageOrganisation } from "./organisation.context.actions"
import { OrganisationsProvider } from "./organisations.context.provider"
import { useDirectoryService } from "./service.context"
import { DirectoryServiceProvider } from "./service.context.provider"
import { SWRSafeOrganisation } from "./swr.organisation"

/**
 * OrganisationProvider
 */
type OrganisationProviderProps = {
  swr: SWRSafeOrganisation
  children: React.ReactNode
}

export const OrganisationProvider: React.FC<OrganisationProviderProps> = ({ swr, children }) => {
  const contextId = React.useId()

  const selectable = useSelectable<Api.ContactOrganisation>()
  useKeepOnly(swr.organisation.contactOrganisations, selectable.keepOnly)

  const [manageOrganisation, manageOrganisationProps] = useManageOrganisation(swr, selectable)

  const contextProps = React.useMemo(
    () => ({
      // context service and data
      contextId,
      swr,
    }),
    [contextId, swr]
  )

  const value = React.useMemo(
    () => ({
      ...selectable,
      ...contextProps,
      ...manageOrganisation,
    }),
    [contextProps, manageOrganisation]
  )
  const service = useDirectoryService()
  return (
    <OrganisationContext.Provider key={contextId} value={value}>
      <DirectoryServiceProvider
        {...service}
        organisationId={swr.organisation.id}
        organisationType={swr.organisation.type}
      >
        <OrganisationsProvider swr={swr.swrChildOrganisations}>{children}</OrganisationsProvider>
      </DirectoryServiceProvider>
      <ManageOrganisation {...manageOrganisationProps} key={`${contextId}-manageOrganisation`} />
    </OrganisationContext.Provider>
  )
}

/**
 * ManageOrganisation
 */
export type ManageOrganisationProps = ReturnType<typeof useManageOrganisation>[1]
const ManageOrganisation: React.FC<ManageOrganisationProps> = ({
  addContactProps,
  editContactProps,
  editContactOrganisationProps,
  contactDetailsProps,
  editOrganisationProps,
  confirmDeleteProps,
  confirmDeleteSelectionProps,
  confirmDeleteContactOrganisationProps,
  confirmDeleteContactProps,
}) => {
  return (
    <>
      <OrganisationContactsAddDialog {...addContactProps} />
      <ContactsEditDialog {...editContactProps} />
      <OrganisationContactsEditDialog {...editContactOrganisationProps} />
      <OrganisationContactsDetailsDialog {...contactDetailsProps} />
      <OrganisationsEditDialog {...editOrganisationProps} />
      <Ui.Confirm {...confirmDeleteProps} />
      <Ui.Confirm {...confirmDeleteSelectionProps} />
      <Ui.Confirm {...confirmDeleteContactOrganisationProps} />
      <Ui.Confirm {...confirmDeleteContactProps} />
    </>
  )
}
