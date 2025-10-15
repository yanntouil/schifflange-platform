import { useWorkspace } from "@/features/workspaces"
import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { ProjectsProvider, Stats, useSwrProjects } from "@compo/projects"
import React from "react"
import useBreadcrumbs from "./breadcrumbs"

/**
 * Lumiq projects stats page
 */
const Page: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const breadcrumbs = useBreadcrumbs()
  Dashboard.usePage(breadcrumbs, _("title"))
  const swr = useSwrProjects()
  const { service } = useWorkspace()
  return (
    <Dashboard.Container>
      <Dashboard.Header>
        <Dashboard.Title>{_("title")}</Dashboard.Title>
        <Dashboard.Description>{_("description")}</Dashboard.Description>
      </Dashboard.Header>
      <ProjectsProvider swr={swr}>
        <Stats service={service.trackings} />
      </ProjectsProvider>
    </Dashboard.Container>
  )
}

export default Page

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Projects Statistics",
    description: "Analytics and performance metrics for all projects",
  },
  fr: {
    title: "Statistiques des projets",
    description: "Analyses et métriques de performance pour tous les projets",
  },
  de: {
    title: "Projektstatistiken",
    description: "Analytik und Leistungsmetriken für alle Projekte",
  },
}
