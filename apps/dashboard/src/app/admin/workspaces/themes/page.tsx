import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import React from "react"
import useBreadcrumbs from "./breadcrumbs"
import { ThemesProvider } from "./context.provider"
import { Themes } from "./themes"

/**
 * Themes Page
 */
const Page: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const breadcrumbs = useBreadcrumbs()
  Dashboard.usePage(breadcrumbs, _("title"))

  return (
    <ThemesProvider>
      <Themes />
    </ThemesProvider>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Themes",
  },
  fr: {
    title: "Thèmes",
  },
  de: {
    title: "Themen",
  },
}

export default Page
