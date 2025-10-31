import { useKeepOnly, useSelectable } from "@compo/hooks"
import { EditSlugDialog } from "@compo/slugs"
import { Ui } from "@compo/ui"
import { type Api } from "@services/dashboard"
import React from "react"
import { EventsCreateDialog } from "./components/events.create"
import { EventsEditDialog } from "./components/events.edit"
import { EventsContext } from "./events.context"
import { useManageEvent } from "./events.context.actions"
import { SWREvents } from "./swr.events"

/**
 * EventsProvider
 */
type EventsProviderProps = {
  swr: SWREvents
  canSelectEvent?: boolean
  multiple?: boolean
  onSelect?: (selected: Api.EventWithRelations[]) => void
  children: React.ReactNode
}

export const EventsProvider: React.FC<EventsProviderProps> = ({
  swr,
  canSelectEvent = false,
  multiple = false,
  onSelect,
  children,
}) => {
  const contextId = React.useId()

  // selectable
  const selectable = useSelectable<Api.EventWithRelations>({
    multiple,
    onSelect,
  })

  useKeepOnly(swr.events, selectable.keepOnly)

  const [manageEvent, manageEventProps] = useManageEvent(swr, selectable)

  const contextProps = React.useMemo(
    () => ({
      // context service and data
      contextId,
      swr,
      // selectable
      canSelectEvent,
      ...selectable,
    }),
    [canSelectEvent, selectable, contextId, swr]
  )

  const value = React.useMemo(
    () => ({
      ...contextProps,
      ...manageEvent,
      swr,
    }),
    [contextProps, manageEvent, swr]
  )
  return (
    <EventsContext.Provider key={contextId} value={value}>
      {children}
      <ManageEvent {...manageEventProps} key={`${contextId}-manageEvent`} />
    </EventsContext.Provider>
  )
}

/**
 * ManageEvent
 */
export type ManageEventProps = ReturnType<typeof useManageEvent>[1]
const ManageEvent: React.FC<ManageEventProps> = ({
  createEventProps,
  editEventProps,
  editSlugProps,
  confirmDeleteEventProps,
  confirmDeleteSelectionProps,
}) => {
  return (
    <>
      <EventsCreateDialog {...createEventProps} />
      <EventsEditDialog {...editEventProps} />
      <EditSlugDialog {...editSlugProps} />
      <Ui.Confirm {...confirmDeleteEventProps} />
      <Ui.Confirm {...confirmDeleteSelectionProps} />
    </>
  )
}
