import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Tags, TagsProvider, useSwrTags } from "@compo/projects"
import React from "react"
import useBreadcrumbs from "./breadcrumbs"

/**
 * Lumiq projects page
 */
const Page: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const breadcrumbs = useBreadcrumbs()
  Dashboard.usePage(breadcrumbs, _("title"))
  const swr = useSwrTags()
  return (
    <Dashboard.Container>
      <Dashboard.Header>
        <Dashboard.Title level={1}>{_("title")}</Dashboard.Title>
        <Dashboard.Description>{_("description")}</Dashboard.Description>
      </Dashboard.Header>
      <TagsProvider swr={swr}>
        <Tags />
      </TagsProvider>
    </Dashboard.Container>
  )
}

export default Page

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Projects Tags Management",
    description: "Manage all website projects tags",
  },
  fr: {
    title: "Gestion des tags de projets",
    description: "Gérer tous les tags de projets du site",
  },
  de: {
    title: "Verwaltung der Projekt-Tags",
    description: "Alle Website-Projekt-Tags verwalten",
  },
}
