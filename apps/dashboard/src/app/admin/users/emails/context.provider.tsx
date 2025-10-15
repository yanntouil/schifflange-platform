import React from "react"
import { EmailsContext } from "./context"
import { useSwrEmails } from "./swr"

/**
 * provider
 */
export const EmailsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // swr
  const { emails, metadata, swr } = useSwrEmails()

  const context = {
    emails,
    metadata,
    swr,
  }
  return <EmailsContext.Provider value={context}>{children}</EmailsContext.Provider>
}
