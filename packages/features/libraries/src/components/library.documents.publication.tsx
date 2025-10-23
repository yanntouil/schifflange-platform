import { PublicationProvider } from "@compo/publications"
import { type Api } from "@services/dashboard"
import React from "react"
import { useLibrary } from "../library.context"
import { useLibrariesService } from "../service.context"

/**
 * LibraryDocumentsPublication
 */
export const LibraryDocumentsPublication: React.FC<React.PropsWithChildren<{ document: Api.LibraryDocument }>> = ({
  document,
  children,
}) => {
  const { service, getImageUrl } = useLibrariesService()
  const { swr, publishedUsers } = useLibrary()
  const mutate = (publication: Api.Publication) => swr.updateDocument({ ...document, publication: publication })
  const publicationProps = {
    persistedId: `dashboard-library-document-publication-${document.id}`,
    service: service.id(document.libraryId).documents.id(document.id).publication,
    publication: document.publication,
    mutate,
    getImageUrl,
    publishedUsers,
    children,
  }
  return <PublicationProvider {...publicationProps} />
}
