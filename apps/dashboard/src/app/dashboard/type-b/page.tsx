import { useWorkspace } from "@/features/workspaces"
import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import React from "react"

/**
 * Type-B Home Page
 */
const Page: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { workspace } = useWorkspace()

  Dashboard.usePage([], _("title"))

  return (
    <div className="container mx-auto py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{workspace.name}</h1>
          <p className="text-muted-foreground mt-2">{_("description")}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border p-6">
            <h3 className="mb-2 font-semibold">{_("pages-title")}</h3>
            <p className="text-muted-foreground text-sm">{_("pages-description")}</p>
          </div>

          <div className="rounded-lg border p-6">
            <h3 className="mb-2 font-semibold">{_("media-title")}</h3>
            <p className="text-muted-foreground text-sm">{_("media-description")}</p>
          </div>

          <div className="rounded-lg border p-6">
            <h3 className="mb-2 font-semibold">{_("settings-title")}</h3>
            <p className="text-muted-foreground text-sm">{_("settings-description")}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Type B Workspace",
    description: "Manage your Type B workspace content",
    "pages-title": "Pages",
    "pages-description": "Create and manage your website pages",
    "media-title": "Media",
    "media-description": "Upload and organize your media files",
    "settings-title": "Settings",
    "settings-description": "Configure your workspace settings",
  },
  fr: {
    title: "Espace Type B",
    description: "Gérez le contenu de votre espace Type B",
    "pages-title": "Pages",
    "pages-description": "Créez et gérez les pages de votre site",
    "media-title": "Médias",
    "media-description": "Téléchargez et organisez vos fichiers médias",
    "settings-title": "Paramètres",
    "settings-description": "Configurez les paramètres de votre espace",
  },
  de: {
    title: "Arbeitsbereich Typ B",
    description: "Verwalten Sie die Inhalte Ihres Typ B-Arbeitsbereichs",
    "pages-title": "Seiten",
    "pages-description": "Erstellen und verwalten Sie Ihre Website-Seiten",
    "media-title": "Medien",
    "media-description": "Laden Sie Ihre Mediendateien hoch und organisieren Sie sie",
    "settings-title": "Einstellungen",
    "settings-description": "Konfigurieren Sie Ihre Arbeitsbereich-Einstellungen",
  },
}

export default Page
