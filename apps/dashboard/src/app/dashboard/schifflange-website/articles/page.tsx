import { Articles, ArticlesProvider, useSwrArticles } from "@compo/articles"
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
  const swr = useSwrArticles()
  return (
    <Dashboard.Container>
      <Dashboard.Header>
        <Dashboard.Title level={1}>{_("title")}</Dashboard.Title>
        <Dashboard.Description>{_("description")}</Dashboard.Description>
      </Dashboard.Header>
      <ArticlesProvider swr={swr} canSelectArticle multiple>
        <Articles />
      </ArticlesProvider>
    </Dashboard.Container>
  )
}

export default Page

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Articles Management",
    description: "Manage all website articles, content and SEO",
  },
  fr: {
    title: "Gestion des articles",
    description: "Gérer tous les articles, contenus et SEO du site",
  },
  de: {
    title: "Artikel-Verwaltung",
    description: "Verwalten Sie alle Website-Artikel, Inhalte und SEO",
  },
}
