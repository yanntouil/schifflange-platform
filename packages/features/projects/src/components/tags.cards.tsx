import { Dashboard } from "@compo/dashboard"
import { A } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { TagsCard, TagsCardSkeleton } from "./tags.card"

/**
 * TagsCards
 */
export const TagsCards: React.FC<{ tags: Api.ProjectTag[] }> = ({ tags }) => {
  return (
    <section className={Dashboard.collectionCards()}>
      {A.map(tags, (tag) => (
        <TagsCard key={tag.id} tag={tag} />
      ))}
    </section>
  )
}

/**
 * TagsCardsSkeleton
 */
export const TagsCardsSkeleton: React.FC<{ count: number }> = ({ count }) => {
  return (
    <section className={Dashboard.collectionCards()}>
      {A.map(
        Array.from({ length: count }, (_, i) => i),
        (index) => (
          <TagsCardSkeleton key={index} />
        )
      )}
    </section>
  )
}
