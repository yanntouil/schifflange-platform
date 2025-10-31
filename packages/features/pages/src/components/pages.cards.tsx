import { Dashboard } from "@compo/dashboard"
import { A } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { PagesCard } from "./pages.card"

/**
 * PagesCards
 */
export const PagesCards: React.FC<{ pages: Api.PageWithRelations[] }> = ({ pages }) => {
  return (
    <section className={Dashboard.collectionCards()}>
      {A.map(pages, (page) => (
        <PagesCard key={page.id} page={page} />
      ))}
    </section>
  )
}
