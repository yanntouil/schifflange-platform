import { Dashboard } from "@compo/dashboard"
import { Organisations, OrganisationsHeader, OrganisationsProvider, useSwrOrganisations } from "@compo/directory"
import { useTranslation } from "@compo/localize"
import React from "react"
import useBreadcrumbs from "./breadcrumbs"

/**
 * organizations page
 */
const Page: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const breadcrumbs = useBreadcrumbs()
  Dashboard.usePage(breadcrumbs, _("title"))
  const swr = useSwrOrganisations()
  return (
    <Dashboard.Container>
      <OrganisationsProvider swr={swr}>
        <OrganisationsHeader />
        <Organisations />
      </OrganisationsProvider>
    </Dashboard.Container>
  )
}

export default Page

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Organizations",
  },
  fr: {
    title: "Organisations",
  },
  de: {
    title: "Organisationen",
  },
}
