import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { useLocation } from "wouter"
import { useArticlesService } from "./service.context"
import { SWRSafeArticle } from "./swr.article"

/**
 * useDisplayStats
 */
export const useDisplayStats = () => {
  const [displayStats, displayStatsProps] = Ui.useQuickDialog<void>()
  return [displayStats, displayStatsProps] as const
}

/**
 * useEditSlug
 */
export const useEditSlug = (swr: SWRSafeArticle) => {
  const [editSlug, editSlugProps] = Ui.useQuickDialog<Api.Slug, Api.Slug & Api.WithModel>({
    mutate: async (slug) => void swr.mutateArticle({ slug }),
  })
  return [editSlug, editSlugProps] as const
}

/**
 * useUpdateCategory
 * This hook is used to update the category of an article.
 */
export const useUpdateCategory = (swr: SWRSafeArticle) => {
  const { service } = useArticlesService()
  const updateCategory = React.useCallback(
    async (categoryId: string | null) => {
      match(await service.id(swr.articleId).update({ categoryId }))
        .with({ ok: true }, ({ data }) => swr.mutateArticle(data.article))
        .otherwise(() => {
          // do nothing atm
        })
    },
    [service, swr]
  )
  return updateCategory
}

/**
 * useToggleState
 * This hook is used to toggle the state between draft and published.
 */
export const useToggleState = (swr: SWRSafeArticle) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useArticlesService()
  const toggleStateArticle = React.useCallback(async () => {
    match(await service.id(swr.articleId).update({ state: swr.article.state === "draft" ? "published" : "draft" }))
      .with({ ok: true }, ({ data }) => swr.mutateArticle(data.article))
      .otherwise(() => {
        // do nothing atm
      })
  }, [service, swr])
  return toggleStateArticle
}

/**
 * useConfirmDelete
 */
export const useConfirmDelete = (swr: SWRSafeArticle) => {
  const { _ } = useTranslation(dictionary)
  const [, navigate] = useLocation()
  const { service, routesTo } = useArticlesService()
  const [confirmDeleteArticle, confirmDeleteArticleProps] = Ui.useConfirm<void>({
    onAsyncConfirm: async () =>
      match(await service.id(swr.articleId).delete())
        .with({ ok: false }, () => true)
        .otherwise(() => {
          navigate(routesTo.articles.list())
          return false
        }),
    t: _.prefixed("confirm.delete"),
  })
  return [confirmDeleteArticle, confirmDeleteArticleProps] as const
}

/**
 * ManageArticle type
 */
export type ManageArticle = ReturnType<typeof useManageArticle>[0]

/**
 * useManageArticle
 */
export const useManageArticle = (swr: SWRSafeArticle, trackingService: Api.TrackingService) => {
  const [displayStats, displayStatsProps] = useDisplayStats()
  const [editSlug, editSlugProps] = useEditSlug(swr)
  const updateCategory = useUpdateCategory(swr)
  const toggleState = useToggleState(swr)
  const [confirmDelete, confirmDeleteProps] = useConfirmDelete(swr)

  const manageArticle = {
    displayStats,
    editSlug,
    updateCategory,
    toggleState,
    confirmDelete,
  }

  const manageArticleProps = {
    trackingService,
    displayStatsProps,
    editSlugProps,
    confirmDeleteProps,
  }

  return [manageArticle, manageArticleProps] as const
}

/**
 * translations
 */
const dictionary = {
  en: {
    confirm: {
      delete: {
        title: "Delete article",
        description:
          "This action cannot be undone. This will permanently delete the article and all its associated content, SEO settings, and analytics data.",
        success: "Article has been deleted",
        error: "Error while deleting article",
        progress: "Deleting article",
      },
    },
  },
  fr: {
    confirm: {
      delete: {
        title: "Supprimer l'article",
        description:
          "Cette action est irréversible. L'article sera définitivement supprimé ainsi que tout son contenu, ses paramètres SEO et ses données analytiques.",
        success: "L'article a été supprimé",
        error: "Erreur lors de la suppression de l'article",
        progress: "Suppression de l'article en cours",
      },
    },
  },
  de: {
    confirm: {
      delete: {
        title: "Artikel löschen",
        description:
          "Diese Aktion kann nicht rückgängig gemacht werden. Der Artikel wird dauerhaft gelöscht, einschließlich aller Inhalte, SEO-Einstellungen und Analytics-Daten.",
        success: "Artikel wurde gelöscht",
        error: "Fehler beim Löschen des Artikels",
        progress: "Artikel wird gelöscht",
      },
    },
  },
}
