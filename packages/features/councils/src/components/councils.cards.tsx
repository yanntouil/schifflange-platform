import { Dashboard } from "@compo/dashboard"
import { type Api } from "@services/dashboard"
import React from "react"
import { CouncilsCard, CouncilsCardSkeleton } from "./councils.card"

/**
 * CouncilsCards
 */
export const CouncilsCards: React.FC<{ councils: Api.Council[] }> = ({ councils }) => {
  return (
    <section className={Dashboard.collectionCards()}>
      {councils.map((council) => (
        <CouncilsCard key={council.id} council={council} />
      ))}
    </section>
  )
}

/**
 * CouncilsCardsSkeleton
 */
export const CouncilsCardsSkeleton: React.FC<{ count: number }> = ({ count }) => {
  return (
    <section className={Dashboard.collectionCards()}>
      {Array.from({ length: count }, (_, i) => (
        <CouncilsCardSkeleton key={i} />
      ))}
    </section>
  )
}
