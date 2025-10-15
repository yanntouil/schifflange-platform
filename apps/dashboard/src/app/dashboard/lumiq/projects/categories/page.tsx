import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Categories, CategoriesProvider, useSwrCategories } from "@compo/projects"
import React from "react"
import useBreadcrumbs from "./breadcrumbs"

/**
 * Lumiq projects page
 */
const Page: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const breadcrumbs = useBreadcrumbs()
  Dashboard.usePage(breadcrumbs, _("title"))
  const swr = useSwrCategories()
  return (
    <Dashboard.Container>
      <Dashboard.Header>
        <Dashboard.Title level={1}>{_("title")}</Dashboard.Title>
        <Dashboard.Description>{_("description")}</Dashboard.Description>
      </Dashboard.Header>
      <CategoriesProvider swr={swr}>
        <Categories />
      </CategoriesProvider>
    </Dashboard.Container>
  )
}

export default Page

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Projects Categories Management",
    description: "Manage all website projects categories",
  },
  fr: {
    title: "Gestion des catégories de projets",
    description: "Gérer toutes les catégories de projets du site",
  },
  de: {
    title: "Verwaltung der Projektkategorien",
    description: "Alle Website-Projektkategorien verwalten",
  },
}
