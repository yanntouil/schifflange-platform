import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Sitemap } from "@compo/slugs"
import React from "react"
import useBreadcrumbs from "./breadcrumbs"

/**
 * AdminSitemap
 * manage sitemap
 */
export const Page: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const breadcrumbs = useBreadcrumbs()
  Dashboard.usePage(breadcrumbs, _("title"))

  return (
    <Dashboard.Container>
      <Dashboard.Header>
        <Dashboard.Title level={1}>{_("title")}</Dashboard.Title>
        <Dashboard.Description>{_("description")}</Dashboard.Description>
      </Dashboard.Header>
      <Sitemap />
    </Dashboard.Container>
  )
}
export default Page

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Site Map Overview",
    description:
      "Explore your website's complete structure in a hierarchical view. Navigate through pages, articles, and categories to quickly access and review your content organization",
  },
  fr: {
    title: "Vue d'ensemble du plan du site",
    description:
      "Explorez la structure complète de votre site web dans une vue hiérarchique. Naviguez à travers les pages, articles et catégories pour accéder rapidement et examiner l'organisation de votre contenu",
  },
  de: {
    title: "Sitemap-Übersicht",
    description:
      "Erkunden Sie die vollständige Struktur Ihrer Website in einer hierarchischen Ansicht. Navigieren Sie durch Seiten, Artikel und Kategorien, um schnell auf Ihre Inhaltsorganisation zuzugreifen und sie zu überprüfen",
  },
}
