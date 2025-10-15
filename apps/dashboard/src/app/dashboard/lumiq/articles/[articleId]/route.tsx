import { useWorkspace } from "@/features/workspaces"
import { ArticleProvider, useSwrArticle } from "@compo/articles"
import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { G } from "@compo/utils"
import React from "react"
import { Redirect } from "wouter"
import parentTo from ".."
import useBreadcrumbs from "./breadcrumbs"
import Page from "./page"

export const LumiqArticlesIdRoute: React.FC<{ articleId: string }> = ({ articleId }) => {
  const { _ } = useTranslation(dictionary)
  const { article, isLoading, isError, ...swr } = useSwrArticle(articleId)
  const { service } = useWorkspace()

  const breadcrumbs = useBreadcrumbs(articleId)
  Dashboard.usePage(breadcrumbs, _("title"))

  if (isLoading) return <></>
  if (isError || G.isNullable(article)) return <Redirect to={parentTo()} />

  return (
    <ArticleProvider swr={{ ...swr, article }} trackingService={service.trackings}>
      <Page article={article} {...swr} />
    </ArticleProvider>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Article Details",
  },
  fr: {
    title: "Détails de l'article",
  },
  de: {
    title: "Artikeldetails",
  },
}
