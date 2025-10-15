import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Pages, PagesProvider, useSwrPages } from "@compo/pages"
import React from "react"
import useBreadcrumbs from "./breadcrumbs"

/**
 * Lumiq pages page
 */
const Page: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const breadcrumbs = useBreadcrumbs()
  Dashboard.usePage(breadcrumbs, _("title"))
  const swr = useSwrPages()
  return (
    <Dashboard.Container>
      <Dashboard.Header>
        <Dashboard.Title level={1}>{_("title")}</Dashboard.Title>
        <Dashboard.Description>{_("description")}</Dashboard.Description>
      </Dashboard.Header>
      <PagesProvider swr={swr} canSelectPage multiple>
        <Pages />
      </PagesProvider>
    </Dashboard.Container>
  )
}

export default Page

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Pages Management",
    description: "Manage all website pages, content and SEO",
  },
  fr: {
    title: "Gestion des pages",
    description: "Gérer toutes les pages, contenus et SEO du site",
  },
  de: {
    title: "Seiten-Verwaltung",
    description: "Verwalten Sie alle Website-Seiten, Inhalte und SEO",
  },
}
