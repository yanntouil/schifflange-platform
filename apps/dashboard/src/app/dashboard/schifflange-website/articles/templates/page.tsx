import { useWorkspace } from "@/features/workspaces"
import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Templates, TemplatesProvider, useSwrTemplates, useTemplates } from "@compo/templates"
import { Ui } from "@compo/ui"
import { Plus } from "lucide-react"
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
      <TemplatesProvider swr={swr}>
        <Header />
        <Templates />
      </TemplatesProvider>
    </Dashboard.Container>
  )
}

const Header: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { createTemplate } = useTemplates()
  return (
    <Dashboard.Header className="flex justify-between gap-8">
      <div className="space-y-1.5">
        <Dashboard.Title level={1}>{_("title")}</Dashboard.Title>
        <Dashboard.Description>{_("description")}</Dashboard.Description>
      </div>
      <Ui.Button variant="outline" icon size="lg" onClick={() => createTemplate()}>
        <Plus aria-hidden />
        <Ui.SrOnly>{_("create")}</Ui.SrOnly>
      </Ui.Button>
    </Dashboard.Header>
  )
}

export default Page

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Templates",
    description: "Create and manage reusable content templates for your articles",
    create: "Create a new template",
  },
  fr: {
    title: "Modèles",
    description: "Créez et gérez des modèles de contenu réutilisables pour vos articles",
    create: "Créer un nouveau modèle",
  },
  de: {
    title: "Vorlagen",
    description: "Erstellen und verwalten Sie wiederverwendbare Inhaltsvorlagen für Ihre Artikel",
    create: "Neue Vorlage erstellen",
  },
}
