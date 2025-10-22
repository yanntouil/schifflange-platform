import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Pages, PagesProvider, usePages, useSwrPages } from "@compo/pages"
import { Ui } from "@compo/ui"
import { Plus } from "lucide-react"
import React from "react"
import useBreadcrumbs from "./breadcrumbs"

/**
 * pages page
 */
const Page: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const breadcrumbs = useBreadcrumbs()
  Dashboard.usePage(breadcrumbs, _("title"))
  const swr = useSwrPages()
  return (
    <Dashboard.Container>
      <PagesProvider swr={swr} canSelectPage multiple>
        <Header />
        <Pages />
      </PagesProvider>
    </Dashboard.Container>
  )
}

export default Page

const Header: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { createPage } = usePages()
  return (
    <Dashboard.Header className="flex justify-between gap-8">
      <div className="space-y-1.5">
        <Dashboard.Title level={1}>{_("title")}</Dashboard.Title>
        <Dashboard.Description>{_("description")}</Dashboard.Description>
      </div>
      <Ui.Button variant="outline" icon size="lg" onClick={() => createPage()}>
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
