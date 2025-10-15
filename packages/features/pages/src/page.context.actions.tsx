import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { useLocation } from "wouter"
import { usePagesService } from "./service.context"
import { SWRSafePage } from "./swr"

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
export const useEditSlug = (swr: SWRSafePage) => {
  const [editSlug, editSlugProps] = Ui.useQuickDialog<Api.Slug, Api.Slug & Api.WithModel>({
    mutate: async (slug) => void swr.mutatePage({ slug }),
  })
  return [editSlug, editSlugProps] as const
}

/**
 * useToggleState
 * This hook is used to toggle the state between draft and published.
 */
export const useToggleState = (swr: SWRSafePage) => {
  const { _ } = useTranslation(dictionary)
  const { service } = usePagesService()
  const toggleStatePage = React.useCallback(async () => {
    match(await service.id(swr.pageId).update({ state: swr.page.state === "draft" ? "published" : "draft" }))
      .with({ ok: true }, ({ data }) => swr.mutatePage(data.page))
      .otherwise(() => {
        // do nothing atm
      })
  }, [service, swr])
  return toggleStatePage
}

/**
 * useToggleLock
 * This hook is used to toggle the lock of a page.
 */
export const useToggleLock = (swr: SWRSafePage) => {
  const { _ } = useTranslation(dictionary)
  const { service } = usePagesService()
  const toggleLockPage = React.useCallback(async () => {
    match(await service.id(swr.pageId).update({ lock: !swr.page.lock }))
      .with({ ok: true }, ({ data }) => swr.mutatePage(data.page))
      .otherwise(() => {
        // do nothing atm
      })
  }, [service, swr])
  return toggleLockPage
}

/**
 * useConfirmDeletePage
 */
export const useConfirmDeletePage = (swr: SWRSafePage) => {
  const { _ } = useTranslation(dictionary)
  const [, navigate] = useLocation()
  const { service, routeToPages } = usePagesService()
  const [confirmDeletePage, confirmDeletePageProps] = Ui.useConfirm<void>({
    onAsyncConfirm: async () =>
      match(await service.id(swr.pageId).delete())
        .with({ ok: false }, () => true)
        .otherwise(() => {
          navigate(routeToPages())
          return false
        }),
    t: _.prefixed("confirm.delete"),
  })
  return [confirmDeletePage, confirmDeletePageProps] as const
}

/**
 * ManagePage type
 */
export type ManagePage = {
  displayStats: ReturnType<typeof useDisplayStats>[0]
  editSlug: ReturnType<typeof useEditSlug>[0]
  toggleState: ReturnType<typeof useToggleState>
  toggleLock: ReturnType<typeof useToggleLock>
  confirmDelete: ReturnType<typeof useConfirmDeletePage>[0]
}

/**
 * useManagePage
 */
export const useManagePage = (swr: SWRSafePage, trackingService: Api.TrackingService) => {
  const [displayStats, displayStatsProps] = useDisplayStats()
  const [editSlug, editSlugProps] = useEditSlug(swr)
  const toggleState = useToggleState(swr)
  const toggleLock = useToggleLock(swr)
  const [confirmDelete, confirmDeleteProps] = useConfirmDeletePage(swr)

  const managePage: ManagePage = {
    displayStats,
    editSlug,
    toggleState,
    toggleLock,
    confirmDelete,
  }

  const managePageProps = {
    trackingService,
    displayStatsProps,
    editSlugProps,
    confirmDeleteProps,
  }

  return [managePage, managePageProps] as const
}

/**
 * translations
 */
const dictionary = {
  en: {
    confirm: {
      delete: {
        title: "Delete page",
        description:
          "This action cannot be undone. This will permanently delete the page and all its associated content, SEO settings, and analytics data.",
        success: "Page has been deleted",
        error: "Error while deleting page",
        progress: "Deleting page",
      },
    },
  },
  fr: {
    confirm: {
      delete: {
        title: "Supprimer la page",
        description:
          "Cette action est irréversible. La page sera définitivement supprimée ainsi que tout son contenu, ses paramètres SEO et ses données analytiques.",
        success: "La page a été supprimée",
        error: "Erreur lors de la suppression de la page",
        progress: "Suppression de la page en cours",
      },
    },
  },
  de: {
    confirm: {
      delete: {
        title: "Seite löschen",
        description:
          "Diese Aktion kann nicht rückgängig gemacht werden. Die Seite wird dauerhaft gelöscht, einschließlich aller Inhalte, SEO-Einstellungen und Analysedaten.",
        success: "Die Seite wurde gelöscht",
        error: "Fehler beim Löschen der Seite",
        progress: "Seite wird gelöscht",
      },
    },
  },
}
