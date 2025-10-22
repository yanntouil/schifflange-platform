import { Articles, ArticlesProvider, useArticles, useSwrArticles } from "@compo/articles"
import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { Plus } from "lucide-react"
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
      <ArticlesProvider swr={swr} canSelectArticle multiple>
        <Header />
        <Articles />
      </ArticlesProvider>
    </Dashboard.Container>
  )
}

export default Page

const Header: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { createArticle } = useArticles()
  return (
    <Dashboard.Header className="flex justify-between gap-8">
      <div className="space-y-1.5">
        <Dashboard.Title level={1}>{_("title")}</Dashboard.Title>
        <Dashboard.Description>{_("description")}</Dashboard.Description>
      </div>
      <Ui.Button variant="outline" icon size="lg" onClick={() => createArticle()}>
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
    title: "Articles Management",
    description: "Manage all website articles, content and SEO",
    create: "Create a new article",
  },
  fr: {
    title: "Gestion des articles",
    description: "Gérer tous les articles, contenus et SEO du site",
    create: "Créer un nouvel article",
  },
  de: {
    title: "Artikel-Verwaltung",
    description: "Verwalten Sie alle Website-Artikel, Inhalte und SEO",
    create: "Neuen Artikel erstellen",
  },
}
