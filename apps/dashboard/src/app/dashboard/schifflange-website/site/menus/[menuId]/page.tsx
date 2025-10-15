import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Menu, SWRSafeMenu } from "@compo/menus"
import { placeholder } from "@compo/utils"
import React from "react"
import useBreadcrumbs from "./breadcrumbs"

/**
 * menu details page
 */
const Page: React.FC<SWRSafeMenu> = ({ menu, ...swr }) => {
  const { _ } = useTranslation(dictionary)
  const breadcrumbs = useBreadcrumbs(menu)
  Dashboard.usePage(breadcrumbs, _("title", { name: placeholder(menu.name, _("placeholder")) }))

  return (
    <Dashboard.Container>
      <Menu />
    </Dashboard.Container>
  )
}

export default Page

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Menu {{name}}",
    placeholder: "Untitled menu",
  },
  fr: {
    title: "Détails du menu {{name}}",
    placeholder: "Menu sans titre",
  },
  de: {
    title: "Menü {{name}}",
    placeholder: "Unbenanntes Menü",
  },
}
