import globalConfig from "@/config/global"
import { Dashboard } from "@compo/dashboard"
import { useDropZone } from "@compo/hooks"
import { useTranslation } from "@compo/localize"
import { DropZone, Medias, MediasFolderProvider, MediasProvider, useMedias, useSWRMedias, useUpload } from "@compo/medias"
import React from "react"
import { Redirect, useLocation } from "wouter"
import routeTo from "."
import useBreadcrumbs from "./breadcrumbs"

/**
 * AdminMedias
 * manage medias
 */
export const Page: React.FC<{ folderId?: string | null }> = ({ folderId = null }) => {
  const [, navigate] = useLocation()
  // not in root and loding done and has some error
  const swr = useSWRMedias(folderId)
  if (swr.isError && folderId !== null) return <Redirect to={routeTo()} />

  return (
    <MediasFolderProvider controlled={{ folderId, setFolderId: (folderId) => navigate(routeTo(folderId)) }}>
      <MediasProvider swr={swr} multiple canSelectFolder canSelectFile>
        <AdminMediasContent />
      </MediasProvider>
    </MediasFolderProvider>
  )
}
export default Page

/**
 * AdminMediasContent
 */
const AdminMediasContent: React.FC = () => {
  const { _ } = useTranslation(dictionary)

  const { folder } = useMedias()

  const title = folder?.name ?? _("title")
  const breadcrumbs = useBreadcrumbs(folder || null)
  Dashboard.usePage(breadcrumbs, title)

  const { bindDropZone, dragOver } = useDropZone({
    onDropFiles: useUpload(),
    accept: globalConfig.acceptedFileExtensions,
    max: globalConfig.maxUploadFile,
  })

  return (
    <Dashboard.Container {...bindDropZone}>
      <Dashboard.Header>
        <Dashboard.Title level={1}>{title}</Dashboard.Title>
        <Dashboard.Description>{_("description")}</Dashboard.Description>
      </Dashboard.Header>
      <Medias />
      <DropZone dragOver={dragOver} />
    </Dashboard.Container>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    title: "Gestionnaire de médias",
    description: "Centralisez vos documents, images et fichiers dans une bibliothèque organisée",
  },
  en: {
    title: "Media manager",
    description: "Centralize your documents, images and files in an organized library",
  },
  de: {
    title: "Medien-Manager",
    description: "Zentralisieren Sie Ihre Dokumente, Bilder und Dateien in einer organisierten Bibliothek",
  },
}
