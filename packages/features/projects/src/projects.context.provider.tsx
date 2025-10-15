import { useKeepOnly, useSelectable } from "@compo/hooks"
import { EditSlugDialog } from "@compo/slugs"
import { Ui } from "@compo/ui"
import { type Api } from "@services/dashboard"
import React from "react"
import { ProjectsEditDialog } from "./components/projects.edit"
import { ProjectsContext } from "./projects.context"
import { useManageProject } from "./projects.context.actions"
import { SWRProjects } from "./swr"

/**
 * ProjectsProvider
 */
type ProjectsProviderProps = {
  swr: SWRProjects
  children: React.ReactNode
}

export const ProjectsProvider: React.FC<ProjectsProviderProps> = ({ swr, children }) => {
  const contextId = React.useId()

  // selectable
  const selectable = useSelectable<Api.ProjectWithRelations>({})

  useKeepOnly(swr.projects, selectable.keepOnly)

  const [manageProject, manageProjectProps] = useManageProject(swr, selectable)

  const contextProps = React.useMemo(
    () => ({
      // context service and data
      contextId,
      swr,
      // selectable
      ...selectable,
    }),
    [selectable, contextId, swr]
  )

  const value = React.useMemo(
    () => ({
      ...contextProps,
      ...manageProject,
      swr,
    }),
    [contextProps, manageProject, swr]
  )
  return (
    <ProjectsContext.Provider key={contextId} value={value}>
      {children}
      <ManageProject {...manageProjectProps} key={`${contextId}-manageProject`} />
    </ProjectsContext.Provider>
  )
}

/**
 * ManageProject
 */
export type ManageProjectProps = ReturnType<typeof useManageProject>[1]
const ManageProject: React.FC<ManageProjectProps> = ({
  createProjectProps,
  editProjectProps,
  editSlugProps,
  confirmDeleteProjectProps,
  confirmDeleteSelectionProps,
}) => {
  return (
    <>
      <ProjectsEditDialog {...editProjectProps} />
      <EditSlugDialog {...editSlugProps} />
      <Ui.Confirm {...createProjectProps} />
      <Ui.Confirm {...confirmDeleteProjectProps} />
      <Ui.Confirm {...confirmDeleteSelectionProps} />
    </>
  )
}
