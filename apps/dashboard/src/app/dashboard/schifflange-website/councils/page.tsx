import { Councils, CouncilsProvider, useCouncils, useSwrCouncils } from "@compo/councils"
import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { Plus } from "lucide-react"
import React from "react"
import useBreadcrumbs from "./breadcrumbs"

/**
 * councils page
 */
const Page: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const breadcrumbs = useBreadcrumbs()
  Dashboard.usePage(breadcrumbs, _("title"))
  const swr = useSwrCouncils()
  return (
    <Dashboard.Container>
      <CouncilsProvider swr={swr}>
        <Header />
        <Councils />
      </CouncilsProvider>
    </Dashboard.Container>
  )
}

export default Page

const Header: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { createCouncil } = useCouncils()
  return (
    <Dashboard.Header className="flex justify-between gap-8">
      <div className="space-y-1.5">
        <Dashboard.Title level={1}>{_("title")}</Dashboard.Title>
        <Dashboard.Description>{_("description")}</Dashboard.Description>
      </div>
      <Ui.Button variant="outline" icon size="lg" onClick={() => createCouncil()}>
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
    title: "Council Meetings",
    description: "Manage all council meetings, agendas and related documents",
    create: "Create a new council meeting",
  },
  fr: {
    title: "Réunions du conseil communal",
    description: "Gérer toutes les réunions du conseil communal, ordres du jour et documents associés",
    create: "Créer une nouvelle réunion du conseil communal",
  },
  de: {
    title: "Gemeinderatssitzungen",
    description: "Verwalten Sie alle Gemeinderatssitzungen, Tagesordnungen und zugehörige Dokumente",
    create: "Neue Gemeinderatssitzung erstellen",
  },
}
