import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { Plus } from "lucide-react"
import React from "react"
import { useLibraries } from "../libraries.context"

/**
 * LibrariesHeader
 * Placeholder for future header implementation
 */
export const LibrariesHeader: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { createLibrary } = useLibraries()
  return (
    <Dashboard.Header className='flex justify-between gap-8'>
      <div className='space-y-1.5'>
        <Dashboard.Title level={1}>{_("title")}</Dashboard.Title>
        <Dashboard.Description>{_("description")}</Dashboard.Description>
      </div>
      <Ui.Button variant='outline' icon size='lg' onClick={() => createLibrary()}>
        <Plus aria-hidden />
        <Ui.SrOnly>{_("create")}</Ui.SrOnly>
      </Ui.Button>
    </Dashboard.Header>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Libraries",
    description: "Manage and organize your document collections to share them on the website",
    create: "Create library",
  },
  fr: {
    title: "Bibliothèques",
    description: "Gérer et organiser vos collections de documents afin de les partager sur le site",
    create: "Créer une bibliothèque",
  },
  de: {
    title: "Bibliotheken",
    description: "Verwalten und organisieren Sie Ihre Dokumentensammlungen, um sie auf der Website zu teilen",
    create: "Bibliothek erstellen",
  },
}
