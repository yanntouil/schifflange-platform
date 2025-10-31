import { Dashboard } from "@compo/dashboard"
import { Categories, CategoriesProvider, useCategories, useSwrCategories } from "@compo/events"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { Plus } from "lucide-react"
import React from "react"
import useBreadcrumbs from "./breadcrumbs"

/**
 * events categories page
 */
const Page: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const breadcrumbs = useBreadcrumbs()
  Dashboard.usePage(breadcrumbs, _("title"))
  const swr = useSwrCategories()
  return (
    <Dashboard.Container>
      <CategoriesProvider swr={swr}>
        <Header />
        <Categories />
      </CategoriesProvider>
    </Dashboard.Container>
  )
}

export default Page

const Header: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { createCategory } = useCategories()
  return (
    <Dashboard.Header className="flex justify-between gap-8">
      <div className="space-y-1.5">
        <Dashboard.Title level={1}>{_("title")}</Dashboard.Title>
        <Dashboard.Description>{_("description")}</Dashboard.Description>
      </div>
      <Ui.Button variant="outline" icon size="lg" onClick={() => createCategory()}>
        <Plus aria-hidden />
        <Ui.SrOnly>{_("create")}</Ui.SrOnly>
      </Ui.Button>
    </Dashboard.Header>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Categories Management",
    description: "Manage all website event categories",
    create: "Create a new category",
  },
  fr: {
    title: "Gestion des catégories",
    description: "Gérer toutes les catégories d'événements du site",
    create: "Créer une nouvelle catégorie",
  },
  de: {
    title: "Kategorien-Verwaltung",
    description: "Verwalten Sie alle Website-Kategorien von Veranstaltungen",
    create: "Neue Kategorie erstellen",
  },
}
