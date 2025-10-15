import { useWorkspace } from "@/features/workspaces"
import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { PagesProvider, Stats, useSwrPages } from "@compo/pages"
import React from "react"
import useBreadcrumbs from "./breadcrumbs"

/**
 * pages stats page
 */
const Page: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const breadcrumbs = useBreadcrumbs()
  Dashboard.usePage(breadcrumbs, _("title"))
  const swr = useSwrPages()
  const { service } = useWorkspace()
  return (
    <Dashboard.Container>
      <Dashboard.Header>
        <Dashboard.Title>{_("title")}</Dashboard.Title>
        <Dashboard.Description>{_("description")}</Dashboard.Description>
      </Dashboard.Header>
      <PagesProvider swr={swr}>
        <Stats service={service.trackings} />
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
    title: "Pages Statistics",
    description: "Analytics and performance metrics for all pages",
  },
  fr: {
    title: "Statistiques des pages",
    description: "Analyses et métriques de performance pour toutes les pages",
  },
  de: {
    title: "Seiten-Statistiken",
    description: "Analysen und Leistungsmetriken für alle Seiten",
  },
}
