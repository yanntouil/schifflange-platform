import { Dashboard } from "@compo/dashboard"
import { A } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { CategoriesCard } from "./categories.card"
/**
 * CategoriesCards
 */
export const CategoriesCards: React.FC<{ categories: Api.OrganisationCategory[] }> = ({ categories }) => {
  return (
    <section className={Dashboard.collectionCards()}>
      {A.map(categories, (category) => (
        <CategoriesCard key={category.id} category={category} />
      ))}
    </section>
  )
}
