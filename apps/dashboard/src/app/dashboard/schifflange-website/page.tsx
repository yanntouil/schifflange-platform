import { useWorkspace } from "@/features/workspaces"
import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { ContextualLanguageProvider, FloatingLanguageSwitcher } from "@compo/translations"
import React from "react"
import useBreadcrumbs from "./breadcrumbs"
import { ArticlesCard } from "./dashboard.articles"
import { OverviewCard } from "./dashboard.overview"
import { PagesCard } from "./dashboard.pages"
import { RecentActivityCard } from "./dashboard.recent-activity"
import { SitemapCard } from "./dashboard.sitemap"
import { TopContentCard } from "./dashboard.top-content"

/**
 * Dashboard Home Page
 */
const Page: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { workspace } = useWorkspace()
  const breadcrumbs = useBreadcrumbs()
  Dashboard.usePage(breadcrumbs, workspace.name)
  return (
    <ContextualLanguageProvider persistedId={`${workspace.id}-languages`}>
      <FloatingLanguageSwitcher />
      <Dashboard.Container>
        <Dashboard.Header>
          <Dashboard.Title level={1}>{workspace.name}</Dashboard.Title>
          <Dashboard.Description>{_("description")}</Dashboard.Description>
        </Dashboard.Header>
        <div className="grid gap-4 @2xl/dashboard:grid-cols-2 @4xl/dashboard:grid-cols-4">
          <PagesCard className="@2xl/dashboard:col-span-2 @4xl/dashboard:col-span-2" />
          <ArticlesCard />
          <OverviewCard className="@2xl/dashboard:col-span-2 @4xl/dashboard:col-span-4" />
          <RecentActivityCard className="@3xl/dashboard:col-span-3 @4xl/dashboard:col-span-2" />
          <TopContentCard className="@3xl/dashboard:col-span-3 @4xl/dashboard:col-span-2" />
        </div>
        <SitemapCard />
      </Dashboard.Container>
    </ContextualLanguageProvider>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    description: "Manage workspace content",
  },
  fr: {
    description: "Gérez le contenu de votre espace",
  },
  de: {
    description: "Verwalten Sie Arbeitsbereich-Inhalte",
  },
}

export default Page
