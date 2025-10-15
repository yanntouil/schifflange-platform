import React from "react"
import { LogsContext } from "./context"
import { useSwrLogs } from "./swr"

/**
 * provider
 */
export const LogsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // swr
  const { logs, metadata, swr } = useSwrLogs()

  const context = {
    logs,
    metadata,
    swr,
  }
  return <LogsContext.Provider value={context}>{children}</LogsContext.Provider>
}