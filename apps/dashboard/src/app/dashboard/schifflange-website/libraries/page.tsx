import { Dashboard } from "@compo/dashboard"
import { Libraries, LibrariesHeader, LibrariesProvider, useSwrLibraries } from "@compo/libraries"
import { useTranslation } from "@compo/localize"
import React from "react"
import useBreadcrumbs from "./breadcrumbs"

/**
 * libraries page
 */
const Page: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const breadcrumbs = useBreadcrumbs()
  Dashboard.usePage(breadcrumbs, _("title"))
  const swr = useSwrLibraries()
  return (
    <Dashboard.Container>
      <LibrariesProvider swr={swr}>
        <LibrariesHeader />
        <Libraries />
      </LibrariesProvider>
    </Dashboard.Container>
  )
}

export default Page

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Libraries",
  },
  fr: {
    title: "Bibliothèques",
  },
  de: {
    title: "Organisationen",
  },
}
