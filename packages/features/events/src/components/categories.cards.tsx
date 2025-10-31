import { Dashboard } from "@compo/dashboard"
import { A } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { CategoriesCard, CategoriesCardSkeleton } from "./categories.card"

/**
 * CategoriesCards
 */
export const CategoriesCards: React.FC<{ categories: Api.EventCategory[] }> = ({ categories }) => {
  return (
    <section className={Dashboard.collectionCards()}>
      {A.map(categories, (category) => (
        <CategoriesCard key={category.id} category={category} />
      ))}
    </section>
  )
}

/**
 * CategoriesCardsSkeleton
 */
export const CategoriesCardsSkeleton: React.FC<{ count: number }> = ({ count }) => {
  return (
    <section className={Dashboard.collectionCards()}>
      {A.map(
        Array.from({ length: count }, (_, i) => i),
        (index) => (
          <CategoriesCardSkeleton key={index} />
        )
      )}
    </section>
  )
}
