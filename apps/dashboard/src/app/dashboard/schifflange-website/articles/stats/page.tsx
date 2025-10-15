import { useWorkspace } from "@/features/workspaces"
import { ArticlesProvider, Stats, useSwrArticles } from "@compo/articles"
import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import React from "react"
import useBreadcrumbs from "./breadcrumbs"

/**
 * articles stats page
 */
const Page: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const breadcrumbs = useBreadcrumbs()
  Dashboard.usePage(breadcrumbs, _("title"))
  const swr = useSwrArticles()
  const { service } = useWorkspace()
  return (
    <Dashboard.Container>
      <Dashboard.Header>
        <Dashboard.Title>{_("title")}</Dashboard.Title>
        <Dashboard.Description>{_("description")}</Dashboard.Description>
      </Dashboard.Header>
      <ArticlesProvider swr={swr}>
        <Stats service={service.trackings} />
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
    title: "Articles Statistics",
    description: "Analytics and performance metrics for all articles",
  },
  fr: {
    title: "Statistiques des articles",
    description: "Analyses et métriques de performance pour tous les articles",
  },
  de: {
    title: "Artikel-Statistiken",
    description: "Analysen und Leistungsmetriken für alle Artikel",
  },
}
