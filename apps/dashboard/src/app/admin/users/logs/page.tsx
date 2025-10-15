import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import React from "react"
import useBreadcrumbs from "./breadcrumbs"
import { LogsProvider } from "./context.provider"
import { Logs } from "./logs"

/**
 * Admin users logs page
 */
const Page: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const breadcrumbs = useBreadcrumbs()
  Dashboard.usePage(breadcrumbs, _("title"))
  return (
    <LogsProvider>
      <Logs />
    </LogsProvider>
  )
}

export default Page

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Activities",
  },
  fr: {
    title: "Activités",
  },
  de: {
    title: "Aktivitäten",
  },
}
