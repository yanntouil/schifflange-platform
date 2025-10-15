import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import React from "react"
import useBreadcrumbs from "./breadcrumbs"

/**
 * Admin Dashboard Page
 */
const Page: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const breadcrumbs = useBreadcrumbs()
  Dashboard.usePage(breadcrumbs, _("title"))

  return <div>Admin Dashboard</div>
}

export default Page

/**
 * translations
 */
const dictionary = {
  en: { title: "Admin Dashboard" },
  fr: { title: "Tableau de bord Admin" },
  de: { title: "Admin-Dashboard" },
}
