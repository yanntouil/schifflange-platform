import { Selectable } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { isSlugEvent } from "@compo/slugs"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { useLocation } from "wouter"
import { useEventsService } from "./service.context"
import { SWREvents } from "./swr.events"

/**
 * useDisplay
 */
export const useDisplay = () => {
  const [, navigate] = useLocation()
  const { routesTo } = useEventsService()
  const displayEvent = React.useCallback(
    (event: Api.EventWithRelations) => {
      navigate(routesTo.events.byId(event.id))
    },
    [navigate, routesTo.events]
  )
  return displayEvent
}

/**
 * useCreateEvent
 * This hook is used to create an event. It will navigate to the new event after creation.
 * this hook is not dependent of the EventContextProvider.
 */
export const useCreateEvent = (append?: (event: Api.EventWithRelations) => void) => {
  const [createEvent, createEventProps] = Ui.useQuickDialog<void, Api.EventWithRelations>({
    mutate: async (event) => void append?.(event),
  })
  return [createEvent, createEventProps] as const
}

/**
 * useToggleState
 * This hook is used to toggle the state between draft and published.
 */
export const useToggleState = (swr: SWREvents) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useEventsService()
  const toggleStateEvent = React.useCallback(
    async (event: Api.EventWithRelations) => {
      match(await service.id(event.id).update({ state: event.state === "draft" ? "published" : "draft" }))
        .with({ ok: true }, ({ data }) => swr.update(data.event))
        .otherwise(() => {
          // do nothing atm
        })
    },
    [service, swr]
  )
  return toggleStateEvent
}

/**
 * useEdit
 */
export const useEdit = (swr: SWREvents) => {
  const [editEvent, editEventProps] = Ui.useQuickDialog<Api.EventWithRelations>({
    mutate: async (event) => swr.update(event),
  })
  return [editEvent, editEventProps] as const
}

/**
 * useEditSlug
 */
export const useEditSlug = (swr: SWREvents) => {
  const [editSlug, editSlugProps] = Ui.useQuickDialog<Api.Slug, Api.Slug & Api.WithModel>({
    mutate: async (slug) => {
      if (isSlugEvent(slug)) {
        swr.update({ id: slug.event.id, slug })
      }
    },
  })
  return [editSlug, editSlugProps] as const
}

/**
 * useConfirmDelete
 */
export const useConfirmDelete = (swr: SWREvents) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useEventsService()
  const [confirmDeleteEvent, confirmDeleteEventProps] = Ui.useConfirm<Api.EventWithRelations>({
    onAsyncConfirm: async (event) =>
      match(await service.id(event.id).delete())
        .with({ ok: false }, () => true)
        .otherwise(() => {
          swr.rejectById(event.id)
          return false
        }),
    t: _.prefixed("confirm.delete"),
  })
  return [confirmDeleteEvent, confirmDeleteEventProps] as const
}

/**
 * useConfirmDeleteSelection
 */
export const useConfirmDeleteSelection = (swr: SWREvents, selectable: Selectable<Api.EventWithRelations>) => {
  const { _ } = useTranslation(dictionary)
  const { service } = useEventsService()
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
 * ManageEvent type
 */
export type ManageEvent = ReturnType<typeof useManageEvent>[0]

/**
 * useManageEvent
 */
export const useManageEvent = (swr: SWREvents, selectable: Selectable<Api.EventWithRelations>) => {
  const displayEvent = useDisplay()
  const [createEvent, createEventProps] = useCreateEvent(swr.append)
  const toggleStateEvent = useToggleState(swr)
  const [editEvent, editEventProps] = useEdit(swr)
  const [editSlug, editSlugProps] = useEditSlug(swr)
  const [confirmDeleteEvent, confirmDeleteEventProps] = useConfirmDelete(swr)
  const [confirmDeleteSelection, confirmDeleteSelectionProps] = useConfirmDeleteSelection(swr, selectable)

  const manageEvent = {
    displayEvent,
    createEvent,
    toggleStateEvent,
    editEvent,
    editSlug,
    confirmDeleteEvent,
    confirmDeleteSelection,
  }

  const manageEventProps = {
    createEventProps,
    editEventProps,
    editSlugProps,
    confirmDeleteEventProps,
    confirmDeleteSelectionProps,
  }

  return [manageEvent, manageEventProps] as const
}

/**
 * translations
 */
const dictionary = {
  en: {
    confirm: {
      create: {
        title: "Create event",
        description:
          "You are about to create an event, if you want to continue you will be redirected to the new event.",
        success: "New event created",
        error: "Error while creating event",
        progress: "Creating event",
      },
      delete: {
        title: "Delete event",
        success: "Event has been deleted",
        error: "Error while deleting event",
        progress: "Deleting event",
      },
      "delete-selection": {
        title: "Delete selected events",
        success: "Events have been deleted",
        error: "Error while deleting events",
        progress: "Deleting {{counter}} / {{total}}",
      },
    },
  },
  fr: {
    confirm: {
      create: {
        title: "Créer un événement",
        description:
          "Vous êtes sur le point de créer un événement, si vous souhaitez continuer vous serez redirigé vers le nouvel événement.",
        success: "Nouvel événement créé",
        error: "Erreur lors de la création de l'événement",
        progress: "Création de l'événement en cours",
      },
      delete: {
        title: "Supprimer l'événement",
        success: "L'événement a été supprimé",
        error: "Erreur lors de la suppression de l'événement",
        progress: "Suppression de l'événement en cours",
      },
      "delete-selection": {
        title: "Supprimer les événements sélectionnés",
        success: "Les événements ont été supprimés",
        error: "Erreur lors de la suppression",
        progress: "Suppression de {{counter}} / {{total}}",
      },
    },
  },
  de: {
    confirm: {
      create: {
        title: "Veranstaltung erstellen",
        description:
          "Sie sind dabei, eine Veranstaltung zu erstellen. Wenn Sie fortfahren möchten, werden Sie zur neuen Veranstaltung weitergeleitet.",
        success: "Neue Veranstaltung erstellt",
        error: "Fehler beim Erstellen der Veranstaltung",
        progress: "Veranstaltung wird erstellt",
      },
      delete: {
        title: "Veranstaltung löschen",
        success: "Veranstaltung wurde gelöscht",
        error: "Fehler beim Löschen der Veranstaltung",
        progress: "Veranstaltung wird gelöscht",
      },
      "delete-selection": {
        title: "Ausgewählte Veranstaltungen löschen",
        success: "Veranstaltungen wurden gelöscht",
        error: "Fehler beim Löschen der Veranstaltungen",
        progress: "Löschen {{counter}} / {{total}}",
      },
    },
  },
}
