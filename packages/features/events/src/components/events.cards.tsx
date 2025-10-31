import { Dashboard } from "@compo/dashboard"
import { A } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { EventsCard, EventsCardSkeleton } from "./events.card"

/**
 * EventsCards
 */
export const EventsCards: React.FC<{ events: Api.EventWithRelations[] }> = ({ events }) => {
  return (
    <section className={Dashboard.collectionCards()}>
      {A.map(events, (event) => (
        <EventsCard key={event.id} event={event} />
      ))}
    </section>
  )
}

/**
 * EventsCardsSkeleton
 */
export const EventsCardsSkeleton: React.FC<{ count: number }> = ({ count }) => {
  return (
    <section className={Dashboard.collectionCards()}>
      {A.map(
        Array.from({ length: count }, (_, i) => i),
        (index) => (
          <EventsCardSkeleton key={index} />
        )
      )}
    </section>
  )
}
