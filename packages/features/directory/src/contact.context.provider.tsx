import React from "react"
import { ContactContext } from "./contact.context"
import { useManageContact } from "./contact.context.actions"
import { SWRSafeContact } from "./swr.contact"

/**
 * ContactProvider
 */
type ContactProviderProps = {
  swr: SWRSafeContact
  children: React.ReactNode
}

export const ContactProvider: React.FC<ContactProviderProps> = ({ swr, children }) => {
  const contextId = React.useId()

  const [manageContact, manageContactProps] = useManageContact(swr)

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
      ...contextProps,
      ...manageContact,
      swr,
    }),
    [contextProps, manageContact, swr]
  )

  return (
    <ContactContext.Provider key={contextId} value={value}>
      {children}
      <ManageContact {...manageContactProps} key={`${contextId}-manageContact`} />
    </ContactContext.Provider>
  )
}

/**
 * ManageContact
 */
export type ManageContactProps = ReturnType<typeof useManageContact>[1]
const ManageContact: React.FC<ManageContactProps> = (
  {
    //
  }
) => {
  return <></>
}
