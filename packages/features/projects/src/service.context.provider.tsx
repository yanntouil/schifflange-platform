import React from "react"
import { ProjectsServiceContext, ProjectsServiceContextType } from "./service.context"

/**
 * ProjectsServiceProvider
 */
type ProjectsServiceProviderProps = ProjectsServiceContextType & {
  children: React.ReactNode
}
export const ProjectsServiceProvider: React.FC<ProjectsServiceProviderProps> = ({ children, ...props }) => {
  return <ProjectsServiceContext.Provider value={props}>{children}</ProjectsServiceContext.Provider>
}
