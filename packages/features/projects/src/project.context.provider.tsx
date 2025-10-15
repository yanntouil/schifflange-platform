import { useTranslation } from "@compo/localize"
import { EditSlugDialog } from "@compo/slugs"
import { StatsDialog } from "@compo/trackings"
import { Ui } from "@compo/ui"
import { type Api } from "@services/dashboard"
import React from "react"
import { ProjectContext, useProject } from "./project.context"
import { useManageProject } from "./project.context.actions"
import { SWRSafeProject } from "./swr"

/**
 * ProjectsProvider
 */
type ProjectsProviderProps = {
  swr: SWRSafeProject
  trackingService: Api.TrackingService
  children: React.ReactNode
}

export const ProjectProvider: React.FC<ProjectsProviderProps> = ({ swr, trackingService, children }) => {
  const contextId = React.useId()
  const [manageProject, manageProjectProps] = useManageProject(swr, trackingService)
  const contextProps = React.useMemo(() => ({ contextId, swr }), [contextId, swr])
  const value = React.useMemo(() => ({ ...contextProps, ...manageProject, swr }), [contextProps, manageProject, swr])

  return (
    <ProjectContext.Provider key={contextId} value={value}>
      {children}
      <ManageProject {...manageProjectProps} key={`${contextId}-manageProject`} />
    </ProjectContext.Provider>
  )
}

/**
 * ManageProject
 */
type ManageProjectProps = ReturnType<typeof useManageProject>[1]
const ManageProject: React.FC<ManageProjectProps> = ({
  displayStatsProps,
  confirmDeleteProps,
  editSlugProps,
  trackingService,
  confirmDeleteStepProps,
}) => {
  const { _ } = useTranslation(dictionary)

  const { swr } = useProject()
  return (
    <>
      <StatsDialog
        {...displayStatsProps}
        trackingId={swr.project.tracking.id}
        service={trackingService}
        title={_("stats-title")}
        description={_("stats-description")}
        display='views'
        defaultStats='visit'
        defaultDisplayBy='months'
      />
      <EditSlugDialog {...editSlugProps} />
      <Ui.Confirm {...confirmDeleteProps} />
      <Ui.Confirm {...confirmDeleteStepProps} />
    </>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    "stats-title": "Statistiques du projet",
    "stats-description": "Choisissez le type de statistiques à afficher, la période et la manière de les visualiser",
  },
  en: {
    "stats-title": "Project stats",
    "stats-description": "Select the type of stats to display, range of time and how to display them",
  },
  de: {
    "stats-title": "Projektstatistiken",
    "stats-description": "Wählen Sie den Typ der Statistiken, den Zeitraum und die Art der Anzeige aus",
  },
}
