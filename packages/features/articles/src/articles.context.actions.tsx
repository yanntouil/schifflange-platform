import { Selectable } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { isSlugArticle } from "@compo/slugs"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { useLocation } from "wouter"
import { useArticlesService } from "./service.context"
import { SWRArticles } from "./swr.articles"

/**
 * useDisplay
 */
export const useDisplay = () => {
  const [, navigate] = useLocation()
  const { routesTo } = useArticlesService()
  const displayArticle = React.useCallback(
    (article: Api.ArticleWithRelations) => {
      navigate(routesTo.articles.byId(article.id))
    },
    [navigate, routesTo.articles.byId]
  )
  return displayArticle
}

/**
 * useCreateArticle
 * This hook is used to create a article. It will navigate to the new article after creation.
 * this hook is not dependent of the ArticleContextProvider.
 */
export const useCreateArticle = (append?: (article: Api.ArticleWithRelations) => void) => {
  const { _ } = useTranslation(dictionary)
  const [createArticle, createArticleProps] = Ui.useQuickDialog<void, Api.ArticleWithRelations>({
    mutate: async (article) => void append?.(article),
  })
  return [createArticle, createArticleProps] as const
}

/**
 * useToggleState
 * This hook is used to toggle the state between draft and published.
 */
export const useToggleState = (swr: SWRArticles) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useArticlesService()
  const toggleStateArticle = React.useCallback(
    async (article: Api.ArticleWithRelations) => {
      match(await service.id(article.id).update({ state: article.state === "draft" ? "published" : "draft" }))
        .with({ ok: true }, ({ data }) => swr.update(data.article))
        .otherwise(() => {
          // do nothing atm
        })
    },
    [service, swr]
  )
  return toggleStateArticle
}

/**
 * useEdit
 */
export const useEdit = (swr: SWRArticles) => {
  const [editArticle, editArticleProps] = Ui.useQuickDialog<Api.ArticleWithRelations>({
    mutate: async (article) => swr.update(article),
  })
  return [editArticle, editArticleProps] as const
}

/**
 * useEditSlug
 */
export const useEditSlug = (swr: SWRArticles) => {
  const [editSlug, editSlugProps] = Ui.useQuickDialog<Api.Slug, Api.Slug & Api.WithModel>({
    mutate: async (slug) => {
      if (isSlugArticle(slug)) {
        swr.update({ id: slug.article.id, slug })
      }
    },
  })
  return [editSlug, editSlugProps] as const
}

/**
 * useConfirmDelete
 */
export const useConfirmDelete = (swr: SWRArticles) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useArticlesService()
  const [confirmDeleteArticle, confirmDeleteArticleProps] = Ui.useConfirm<Api.ArticleWithRelations>({
    onAsyncConfirm: async (article) =>
      match(await service.id(article.id).delete())
        .with({ ok: false }, () => true)
        .otherwise(() => {
          swr.rejectById(article.id)
          return false
        }),
    t: _.prefixed("confirm.delete"),
  })
  return [confirmDeleteArticle, confirmDeleteArticleProps] as const
}

/**
 * useConfirmDeleteSelection
 */
export const useConfirmDeleteSelection = (swr: SWRArticles, selectable: Selectable<Api.ArticleWithRelations>) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useArticlesService()
  const [confirmDeleteSelection, confirmDeleteSelectionProps] = Ui.useConfirm<void, string>({
    onAsyncConfirm: async (id) =>
      match(await service.id(id).delete())
        .with({ ok: false }, () => true)
        .otherwise(() => {
          swr.rejectById(id)
          return false
        }),
    finally: () => void swr.mutate(),
    list: selectable.selectedIds,
    t: _.prefixed("confirm.delete-selection"),
  })
  return [confirmDeleteSelection, confirmDeleteSelectionProps] as const
}

/**
 * ManageArticle type
 */
export type ManageArticle = ReturnType<typeof useManageArticle>[0]

/**
 * useManageArticle
 */
export const useManageArticle = (swr: SWRArticles, selectable: Selectable<Api.ArticleWithRelations>) => {
  const displayArticle = useDisplay()
  const [createArticle, createArticleProps] = useCreateArticle(swr.append)
  const toggleStateArticle = useToggleState(swr)
  const [editArticle, editArticleProps] = useEdit(swr)
  const [editSlug, editSlugProps] = useEditSlug(swr)
  const [confirmDeleteArticle, confirmDeleteArticleProps] = useConfirmDelete(swr)
  const [confirmDeleteSelection, confirmDeleteSelectionProps] = useConfirmDeleteSelection(swr, selectable)

  const managePage = {
    displayArticle,
    createArticle,
    toggleStateArticle,
    editArticle,
    editSlug,
    confirmDeleteArticle,
    confirmDeleteSelection,
  }

  const managePageProps = {
    createArticleProps,
    editArticleProps,
    editSlugProps,
    confirmDeleteArticleProps,
    confirmDeleteSelectionProps,
  }

  return [managePage, managePageProps] as const
}

/**
 * translations
 */
const dictionary = {
  en: {
    confirm: {
      create: {
        title: "Create article",
        description:
          "You are about to create a article, if you want to continue you will be redirected to the new article.",
        success: "New article created",
        error: "Error while creating article",
        progress: "Creating article",
      },
      delete: {
        title: "Delete article",
        success: "Article has been deleted",
        error: "Error while deleting article",
        progress: "Deleting article",
      },
      "delete-selection": {
        title: "Delete selected articles",
        success: "Articles have been deleted",
        error: "Error while deleting articles",
        progress: "Deleting {{counter}} / {{total}}",
      },
    },
  },
  fr: {
    confirm: {
      create: {
        title: "Créer un article",
        description:
          "Vous êtes sur le point de créer un article, si vous souhaitez continuer vous serez redirigé vers le nouvel article.",
        success: "Nouvel article créé",
        error: "Erreur lors de la création de l'article",
        progress: "Création de l'article en cours",
      },
      delete: {
        title: "Supprimer l'article",
        success: "L'article a été supprimé",
        error: "Erreur lors de la suppression de l'article",
        progress: "Suppression de l'article en cours",
      },
      "delete-selection": {
        title: "Supprimer les articles sélectionnés",
        success: "Les articles ont été supprimés",
        error: "Erreur lors de la suppression",
        progress: "Suppression de {{counter}} / {{total}}",
      },
    },
  },
  de: {
    confirm: {
      create: {
        title: "Artikel erstellen",
        description:
          "Sie sind dabei, einen Artikel zu erstellen. Wenn Sie fortfahren möchten, werden Sie zum neuen Artikel weitergeleitet.",
        success: "Neuer Artikel erstellt",
        error: "Fehler beim Erstellen des Artikels",
        progress: "Artikel wird erstellt",
      },
      delete: {
        title: "Artikel löschen",
        success: "Artikel wurde gelöscht",
        error: "Fehler beim Löschen des Artikels",
        progress: "Artikel wird gelöscht",
      },
      "delete-selection": {
        title: "Ausgewählte Artikel löschen",
        success: "Artikel wurden gelöscht",
        error: "Fehler beim Löschen der Artikel",
        progress: "Löschen {{counter}} / {{total}}",
      },
    },
  },
}
