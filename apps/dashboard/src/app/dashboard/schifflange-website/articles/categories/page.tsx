import { Categories, CategoriesProvider, useSwrCategories } from "@compo/articles"
import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import React from "react"
import useBreadcrumbs from "./breadcrumbs"

/**
 * articles page
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
    title: "Categories Management",
    description: "Manage all website categories",
  },
  fr: {
    title: "Gestion des catégories",
    description: "Gérer toutes les catégories du site",
  },
  de: {
    title: "Kategorien-Verwaltung",
    description: "Verwalten Sie alle Website-Kategorien",
  },
}
