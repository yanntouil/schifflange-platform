import React from "react"
import { useSwrEmails } from "./swr"

/**
 * types
 */
export type EmailsContextType = {
  //
} & ReturnType<typeof useSwrEmails>

/**
 * contexts
 */
export const EmailsContext = React.createContext<EmailsContextType | null>(null)

/**
 * hooks
 */
export const useEmails = () => {
  const context = React.useContext(EmailsContext)
  if (!context) throw new Error("useEmails must be used within a EmailsProvider")
  return context
}
