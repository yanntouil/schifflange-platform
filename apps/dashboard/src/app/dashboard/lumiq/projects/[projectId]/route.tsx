import { useWorkspace } from "@/features/workspaces"
import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { ProjectProvider, useSwrProject } from "@compo/projects"
import { G } from "@compo/utils"
import React from "react"
import { Redirect } from "wouter"
import parentTo from ".."
import useBreadcrumbs from "./breadcrumbs"
import Page from "./page"

export const LumiqProjectsIdRoute: React.FC<{ projectId: string }> = ({ projectId }) => {
  const { _ } = useTranslation(dictionary)
  const { project, isLoading, isError, ...swr } = useSwrProject(projectId)
  const { service } = useWorkspace()

  const breadcrumbs = useBreadcrumbs(projectId)
  Dashboard.usePage(breadcrumbs, _("title"))

  if (isLoading) return <></>
  if (isError || G.isNullable(project)) return <Redirect to={parentTo()} />

  return (
    <ProjectProvider swr={{ ...swr, project }} trackingService={service.trackings}>
      <Page project={project} {...swr} />
    </ProjectProvider>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Project Details",
  },
  fr: {
    title: "Détails du projet",
  },
  de: {
    title: "Projektdetails",
  },
}
