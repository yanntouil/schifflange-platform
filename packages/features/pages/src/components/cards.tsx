import { Dashboard } from "@compo/dashboard"
import { A } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { Card } from "./card"

/**
 * Cards
 */
export const Cards: React.FC<{ pages: Api.PageWithRelations[] }> = ({ pages }) => {
  return (
    <section className={Dashboard.collectionCards()}>
      {A.map(pages, (page) => (
        <Card key={page.id} page={page} />
      ))}
    </section>
  )
}
