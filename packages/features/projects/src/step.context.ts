import React from "react"
import { ManageStep } from "./step.context.actions"
import { SWRSafeProjectStep } from "./swr"

/**
 * types
 */
export type StepContextType = {
  contextId: string
  swr: SWRSafeProjectStep
} & ManageStep

/**
 * contexts
 */
export const StepContext = React.createContext<StepContextType | null>(null)

/**
 * hooks
 */
export const useStep = () => {
  const context = React.useContext(StepContext)
  if (!context) throw new Error("useStep must be used within a StepProvider")
  return context
}
