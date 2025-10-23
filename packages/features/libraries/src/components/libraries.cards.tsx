import { Dashboard } from "@compo/dashboard"
import { A } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { LibrariesCard } from "./libraries.card"

/**
 * LibrariesCards
 */
export const LibrariesCards: React.FC<{ libraries: Api.Library[] }> = ({ libraries }) => {
  return (
    <section className={Dashboard.collectionCards()}>
      {A.map(libraries, (library) => (
        <LibrariesCard key={library.id} library={library} />
      ))}
    </section>
  )
}
