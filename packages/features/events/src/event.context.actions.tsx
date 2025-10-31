import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { useLocation } from "wouter"
import { useEventsService } from "./service.context"
import { SWRSafeEvent } from "./swr.event"

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
export const useEditSlug = (swr: SWRSafeEvent) => {
  const [editSlug, editSlugProps] = Ui.useQuickDialog<Api.Slug, Api.Slug & Api.WithModel>({
    mutate: async (slug) => void swr.mutateEvent({ slug }),
  })
  return [editSlug, editSlugProps] as const
}

/**
 * useUpdateCategories
 * This hook is used to update the categories of an event.
 */
export const useUpdateCategories = (swr: SWRSafeEvent) => {
  const { service } = useEventsService()
  const updateCategories = React.useCallback(
    async (categoryIds: string[]) => {
      match(await service.id(swr.eventId).update({ categoryIds }))
        .with({ ok: true }, ({ data }) => swr.mutateEvent(data.event))
        .otherwise(() => {
          // do nothing atm
        })
    },
    [service, swr]
  )
  return updateCategories
}

/**
 * useToggleState
 * This hook is used to toggle the state between draft and published.
 */
export const useToggleState = (swr: SWRSafeEvent) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useEventsService()
  const toggleStateEvent = React.useCallback(async () => {
    match(await service.id(swr.eventId).update({ state: swr.event.state === "draft" ? "published" : "draft" }))
      .with({ ok: true }, ({ data }) => swr.mutateEvent(data.event))
      .otherwise(() => {
        // do nothing atm
      })
  }, [service, swr])
  return toggleStateEvent
}

/**
 * useConfirmDelete
 */
export const useConfirmDelete = (swr: SWRSafeEvent) => {
  const { _ } = useTranslation(dictionary)
  const [, navigate] = useLocation()
  const { service, routesTo } = useEventsService()
  const [confirmDeleteEvent, confirmDeleteEventProps] = Ui.useConfirm<void>({
    onAsyncConfirm: async () =>
      match(await service.id(swr.eventId).delete())
        .with({ ok: false }, () => true)
        .otherwise(() => {
          navigate(routesTo.events.list())
          return false
        }),
    t: _.prefixed("confirm.delete"),
  })
  return [confirmDeleteEvent, confirmDeleteEventProps] as const
}

/**
 * ManageEvent type
 */
export type ManageEvent = ReturnType<typeof useManageEvent>[0]

/**
 * useManageEvent
 */
export const useManageEvent = (swr: SWRSafeEvent, trackingService: Api.TrackingService) => {
  const [displayStats, displayStatsProps] = useDisplayStats()
  const [editSlug, editSlugProps] = useEditSlug(swr)
  const updateCategories = useUpdateCategories(swr)
  const toggleState = useToggleState(swr)
  const [confirmDelete, confirmDeleteProps] = useConfirmDelete(swr)

  const manageEvent = {
    displayStats,
    editSlug,
    updateCategories,
    toggleState,
    confirmDelete,
  }

  const manageEventProps = {
    trackingService,
    displayStatsProps,
    editSlugProps,
    confirmDeleteProps,
  }

  return [manageEvent, manageEventProps] as const
}

/**
 * translations
 */
const dictionary = {
  en: {
    confirm: {
      delete: {
        title: "Delete event",
        description:
          "This action cannot be undone. This will permanently delete the event and all its associated content, SEO settings, and analytics data.",
        success: "Event has been deleted",
        error: "Error while deleting event",
        progress: "Deleting event",
      },
    },
  },
  fr: {
    confirm: {
      delete: {
        title: "Supprimer l'événement",
        description:
          "Cette action est irréversible. L'événement sera définitivement supprimé ainsi que tout son contenu, ses paramètres SEO et ses données analytiques.",
        success: "L'événement a été supprimé",
        error: "Erreur lors de la suppression de l'événement",
        progress: "Suppression de l'événement en cours",
      },
    },
  },
  de: {
    confirm: {
      delete: {
        title: "Veranstaltung löschen",
        description:
          "Diese Aktion kann nicht rückgängig gemacht werden. Die Veranstaltung wird dauerhaft gelöscht, einschließlich aller Inhalte, SEO-Einstellungen und Analytics-Daten.",
        success: "Veranstaltung wurde gelöscht",
        error: "Fehler beim Löschen der Veranstaltung",
        progress: "Veranstaltung wird gelöscht",
      },
    },
  },
}
