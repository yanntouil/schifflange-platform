import { type Api, useDashboardService } from "@services/dashboard"
import { createContext, useContext } from "react"

/**
 * types
 */
export type ProjectsService = Api.ProjectsService
export type ProjectsServiceContextType = {
  service: Api.ProjectsService
  serviceKey: string
  isAdmin: boolean
  routeToCategories: () => string
  routeToProjects: () => string
  routeToProject: (projectId: string) => string
  routeToStep: (projectId: string, stepId: string) => string
  makeUrl: (project: Api.ProjectWithRelations, code?: string) => string
  makeStepUrl: (step: Api.ProjectStepWithRelations, code?: string) => string
}

/**
 * contexts
 */
export const ProjectsServiceContext = createContext<ProjectsServiceContextType | null>(null)

/**
 * hooks
 */
export const useProjectsService = () => {
  const context = useContext(ProjectsServiceContext)
  if (!context) {
    throw new Error("useProjectsService must be used within a ProjectsServiceProvider")
  }
  const {
    service: { makePath, getImageUrl },
  } = useDashboardService()
  return { ...context, makePath, getImageUrl }
}
