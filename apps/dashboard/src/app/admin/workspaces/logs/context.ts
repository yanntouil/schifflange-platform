import React from "react"
import { useSwrLogs } from "./swr"

/**
 * types
 */
export type LogsContextType = {
  //
} & ReturnType<typeof useSwrLogs>

/**
 * contexts
 */
export const LogsContext = React.createContext<LogsContextType | null>(null)

/**
 * hooks
 */
export const useLogs = () => {
  const context = React.useContext(LogsContext)
  if (!context) throw new Error("useLogs must be used within a LogsProvider")
  return context
}