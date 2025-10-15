import { useWorkspace } from "@/features/workspaces"
import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Templates, TemplatesProvider, useSwrTemplates } from "@compo/templates"
import React from "react"
import useBreadcrumbs from "./breadcrumbs"

/**
 * templates page
 */
const Page: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const breadcrumbs = useBreadcrumbs()
  Dashboard.usePage(breadcrumbs, _("title"))
  const swr = useSwrTemplates()
  const { service } = useWorkspace()
  return (
    <Dashboard.Container>
      <Dashboard.Header>
        <Dashboard.Title>{_("title")}</Dashboard.Title>
        <Dashboard.Description>{_("description")}</Dashboard.Description>
      </Dashboard.Header>
      <TemplatesProvider swr={swr}>
        <Templates />
      </TemplatesProvider>
    </Dashboard.Container>
  )
}

export default Page

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Templates",
    description: "Create and manage reusable content templates for your pages",
  },
  fr: {
    title: "Modèles",
    description: "Créez et gérez des modèles de contenu réutilisables pour vos pages",
  },
  de: {
    title: "Vorlagen",
    description: "Erstellen und verwalten Sie wiederverwendbare Inhaltsvorlagen für Ihre Seiten",
  },
}
