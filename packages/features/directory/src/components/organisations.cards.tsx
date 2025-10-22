import { Dashboard } from "@compo/dashboard"
import { A } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { OrganisationsCard } from "./organisations.card"
/**
 * OrganisationsCards
 */
export const OrganisationsCards: React.FC<{ organisations: Api.Organisation[] }> = ({ organisations }) => {
  return (
    <section className={Dashboard.collectionCards()}>
      {A.map(organisations, (organisation) => (
        <OrganisationsCard key={organisation.id} organisation={organisation} />
      ))}
    </section>
  )
}
