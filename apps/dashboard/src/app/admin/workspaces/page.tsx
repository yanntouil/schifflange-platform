import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import React from "react"
import useBreadcrumbs from "./breadcrumbs"
import { WorkspacesProvider } from "./context.provider"
import { Workspaces } from "./workspaces"

/**
 * Workspaces Page
 */
const Page: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const breadcrumbs = useBreadcrumbs()
  Dashboard.usePage(breadcrumbs, _("title"))

  return (
    <WorkspacesProvider>
      <Workspaces />
    </WorkspacesProvider>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Workspaces",
  },
  fr: {
    title: "Espaces de travail",
  },
  de: {
    title: "Arbeitsbereiche",
  },
}

export default Page
