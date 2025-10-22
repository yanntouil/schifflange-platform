import React from "react"
import { ManageContact } from "./contact.context.actions"
import { SWRSafeContact } from "./swr.contact"

/**
 * types
 */
export type ContactContextType = {
  contextId: string
  swr: SWRSafeContact
} & ManageContact

/**
 * contexts
 */
export const ContactContext = React.createContext<ContactContextType | null>(null)

/**
 * hooks
 */
export const useContact = () => {
  const context = React.useContext(ContactContext)
  if (!context) throw new Error("useContact must be used within a ContactProvider")
  return context
}
