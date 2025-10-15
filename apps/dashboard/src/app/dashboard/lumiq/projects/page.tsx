import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Projects, ProjectsProvider, useSwrProjects } from "@compo/projects"
import React from "react"
import useBreadcrumbs from "./breadcrumbs"

/**
 * Lumiq projects page
 */
const Page: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const breadcrumbs = useBreadcrumbs()
  Dashboard.usePage(breadcrumbs, _("title"))
  const swr = useSwrProjects()
  return (
    <Dashboard.Container>
      <Dashboard.Header>
        <Dashboard.Title level={1}>{_("title")}</Dashboard.Title>
        <Dashboard.Description>{_("description")}</Dashboard.Description>
      </Dashboard.Header>
      <ProjectsProvider swr={swr}>
        <Projects />
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
    title: "Projects Management",
    description: "Manage all website projects, content and SEO",
  },
  fr: {
    title: "Gestion des projets",
    description: "Gérer tous les projets, contenus et SEO du site",
  },
  de: {
    title: "Projektverwaltung",
    description: "Alle Website-Projekte, Inhalte und SEO verwalten",
  },
}
