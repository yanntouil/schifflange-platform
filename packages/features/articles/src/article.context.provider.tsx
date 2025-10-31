import { useTranslation } from "@compo/localize"
import { EditSlugDialog } from "@compo/slugs"
import { StatsDialog } from "@compo/trackings"
import { Ui } from "@compo/ui"
import { Api } from "@services/dashboard"
import React from "react"
import { ArticleContext, useArticle } from "./article.context"
import { useManageArticle } from "./article.context.actions"
import { SWRSafeArticle } from "./swr.article"

/**
 * ArticlesProvider
 */
type ArticleProviderProps = {
  swr: SWRSafeArticle
  trackingService: Api.TrackingService
  children: React.ReactNode
}

export const ArticleProvider: React.FC<ArticleProviderProps> = ({ swr, trackingService, children }) => {
  const contextId = React.useId()
  const [manageArticle, manageArticleProps] = useManageArticle(swr, trackingService)
  const contextProps = React.useMemo(() => ({ contextId, swr }), [contextId, swr])
  const value = React.useMemo(() => ({ ...contextProps, ...manageArticle, swr }), [contextProps, manageArticle, swr])

  return (
    <ArticleContext.Provider key={contextId} value={value}>
      {children}
      <ManageArticle {...manageArticleProps} key={`${contextId}-manageArticle`} />
    </ArticleContext.Provider>
  )
}

/**
 * ManageArticle
 */
type ManageArticleProps = ReturnType<typeof useManageArticle>[1]
const ManageArticle: React.FC<ManageArticleProps> = ({
  displayStatsProps,
  confirmDeleteProps,
  editSlugProps,
  trackingService,
}) => {
  const { _ } = useTranslation(dictionary)

  const { swr } = useArticle()
  return (
    <>
      <StatsDialog
        {...displayStatsProps}
        trackingId={swr.article.tracking.id}
        service={trackingService}
        title={_("stats-title")}
        description={_("stats-description")}
        display='views'
        defaultStats='visit'
        defaultDisplayBy='months'
      />
      <EditSlugDialog {...editSlugProps} />
      <Ui.Confirm {...confirmDeleteProps} />
    </>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    "stats-title": "Statistiques de l'article",
    "stats-description": "Choisissez le type de statistiques à afficher, la période et la manière de les visualiser",
  },
  en: {
    "stats-title": "Article stats",
    "stats-description": "Select the type of stats to display, range of time and how to display them",
  },
  de: {
    "stats-title": "Artikel-Statistiken",
    "stats-description": "Wählen Sie den Typ der anzuzeigenden Statistiken, den Zeitraum und die Art der Darstellung",
  },
}
