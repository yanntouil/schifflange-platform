import { Dashboard } from "@compo/dashboard"
import {
  DirectoryServiceProvider,
  Organisations,
  OrganisationsProvider,
  useDirectoryService,
  useOrganisations,
  useSwrOrganisations,
} from "@compo/directory"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { Plus } from "lucide-react"
import React from "react"
import routeToAssociations from "."
import routeToAssociationId from "./[organizationId]"
import useBreadcrumbs from "./breadcrumbs"

/**
 * associations page
 */
const Page: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const breadcrumbs = useBreadcrumbs()
  Dashboard.usePage(breadcrumbs, _("title"))
  const swr = useSwrOrganisations({ filterBy: { types: ["association"] } })
  const service = useDirectoryService()
  return (
    <Dashboard.Container>
      <DirectoryServiceProvider
        {...service}
        organisationType="association"
        routesTo={{ ...service.routesTo, organizations: { list: routeToAssociations, byId: routeToAssociationId } }}
      >
        <OrganisationsProvider swr={swr}>
          <Header />
          <Organisations />
        </OrganisationsProvider>
      </DirectoryServiceProvider>
    </Dashboard.Container>
  )
}

export default Page

const Header: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { createOrganisation } = useOrganisations()
  return (
    <Dashboard.Header className="flex justify-between gap-8">
      <div className="space-y-1.5">
        <Dashboard.Title level={1}>{_("title")}</Dashboard.Title>
        <Dashboard.Description>{_("description")}</Dashboard.Description>
      </div>
      <Ui.Button variant="outline" icon size="lg" onClick={() => createOrganisation()}>
        <Plus aria-hidden />
        <Ui.SrOnly>{_("create-organisation")}</Ui.SrOnly>
      </Ui.Button>
    </Dashboard.Header>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Associations",
    description: "Manage all associations",
    "create-organisation": "Create association",
  },
  fr: {
    title: "Associations",
    description: "Gérer toutes les associations",
    "create-organisation": "Créer une association",
  },
  de: {
    title: "Vereine",
    description: "Alle Vereine verwalten",
    "create-organisation": "Verein erstellen",
  },
}
