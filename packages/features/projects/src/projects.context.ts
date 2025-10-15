import { Selectable } from "@compo/hooks"
import { type Api } from "@services/dashboard"
import React from "react"
import { ManageProject } from "./projects.context.actions"
import { SWRProjects } from "./swr"

/**
 * types
 */
export type ProjectsContextType = Selectable<Api.ProjectWithRelations> & {
  contextId: string
  swr: SWRProjects
} & ManageProject

/**
 * contexts
 */
export const ProjectsContext = React.createContext<ProjectsContextType | null>(null)

/**
 * hooks
 */
export const useProjects = () => {
  const context = React.useContext(ProjectsContext)
  if (!context) throw new Error("useProjects must be used within a ProjectsProvider")
  return context
}
