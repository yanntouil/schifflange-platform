import { Dashboard } from "@compo/dashboard"
import { A } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { LibraryDocumentsCard } from "./library.documents.card"

/**
 * LibraryDocumentsCards
 */
export const LibraryDocumentsCards: React.FC<{ documents: Api.LibraryDocument[] }> = ({ documents }) => {
  return (
    <section className={Dashboard.collectionCards()}>
      {A.map(documents, (document) => (
        <LibraryDocumentsCard key={document.id} document={document} />
      ))}
    </section>
  )
}
