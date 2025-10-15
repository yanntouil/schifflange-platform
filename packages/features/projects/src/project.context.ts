import React from "react"
import { ManageProject } from "./project.context.actions"
import { SWRSafeProject } from "./swr"

/**
 * types
 */
export type ProjectContextType = {
  contextId: string
  swr: SWRSafeProject
} & ManageProject

/**
 * contexts
 */
export const ProjectContext = React.createContext<ProjectContextType | null>(null)

/**
 * hooks
 */
export const useProject = () => {
  const context = React.useContext(ProjectContext)
  if (!context) throw new Error("useProject must be used within a ProjectProvider")
  return context
}
