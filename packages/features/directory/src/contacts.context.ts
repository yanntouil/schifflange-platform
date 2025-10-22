import { Selectable } from "@compo/hooks"
import { type Api } from "@services/dashboard"
import React from "react"
import { ManageContact } from "./contacts.context.actions"
import { SWRContacts } from "./swr.contacts"

/**
 * types
 */
export type ContactsContextType = Selectable<Api.Contact> & {
  contextId: string
  swr: SWRContacts
} & ManageContact

/**
 * contexts
 */
export const ContactsContext = React.createContext<ContactsContextType | null>(null)

/**
 * hooks
 */
export const useContacts = () => {
  const context = React.useContext(ContactsContext)
  if (!context) throw new Error("useContacts must be used within a ContactsProvider")
  return context
}
