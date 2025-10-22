import { useKeepOnly, useSelectable } from "@compo/hooks"
import { Ui } from "@compo/ui"
import { type Api } from "@services/dashboard"
import React from "react"
import { ContactsCreateDialog, ContactsEditDialog } from "./components"
import { ContactsContext } from "./contacts.context"
import { useManageContact } from "./contacts.context.actions"
import { SWRContacts } from "./swr.contacts"

/**
 * ContactsProvider
 */
type ContactsProviderProps = {
  swr: SWRContacts
  children: React.ReactNode
}

export const ContactsProvider: React.FC<ContactsProviderProps> = ({ swr, children }) => {
  const contextId = React.useId()

  // selectable
  const selectable = useSelectable<Api.Contact>()

  useKeepOnly(swr.contacts, selectable.keepOnly)

  const [manageContact, manageContactProps] = useManageContact(swr, selectable)

  const contextProps = React.useMemo(
    () => ({
      // context service and data
      contextId,
      swr,
      ...selectable,
    }),
    [selectable, contextId, swr]
  )

  const value = React.useMemo(
    () => ({
      ...contextProps,
      ...manageContact,
      swr,
    }),
    [contextProps, manageContact, swr]
  )

  return (
    <ContactsContext.Provider key={contextId} value={value}>
      {children}
      <ManageContacts {...manageContactProps} key={`${contextId}-manageContact`} />
    </ContactsContext.Provider>
  )
}

/**
 * ManageContact
 */
export type ManageContactsProps = ReturnType<typeof useManageContact>[1]
const ManageContacts: React.FC<ManageContactsProps> = ({
  createContactProps,
  editContactProps,
  confirmDeleteContactProps,
  confirmDeleteSelectionProps,
}) => {
  return (
    <>
      <ContactsCreateDialog {...createContactProps} />
      <ContactsEditDialog {...editContactProps} />
      <Ui.Confirm {...confirmDeleteContactProps} />
      <Ui.Confirm {...confirmDeleteSelectionProps} />
    </>
  )
}
