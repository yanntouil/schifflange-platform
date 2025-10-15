import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Menus, MenusProvider, useSWRMenus } from "@compo/menus"
import React from "react"
import useBreadcrumbs from "./breadcrumbs"

/**
 * menus page
 */
const Page: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const breadcrumbs = useBreadcrumbs()
  Dashboard.usePage(breadcrumbs, _("title"))
  const swr = useSWRMenus()
  return (
    <Dashboard.Container>
      <Dashboard.Header>
        <Dashboard.Title level={1}>{_("title")}</Dashboard.Title>
        <Dashboard.Description>{_("description")}</Dashboard.Description>
      </Dashboard.Header>
      <MenusProvider swr={swr}>
        <Menus />
      </MenusProvider>
    </Dashboard.Container>
  )
}

export default Page

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Navigation Menus",
    description:
      "Build and customize your site's navigation structure with drag-and-drop menu items, multi-level hierarchies, and dynamic links to pages, articles, or custom URLs",
  },
  fr: {
    title: "Menus de navigation",
    description:
      "Construisez et personnalisez la structure de navigation de votre site avec des éléments glisser-déposer, des hiérarchies multi-niveaux et des liens dynamiques vers des pages, articles ou URLs personnalisées",
  },
  de: {
    title: "Navigationsmenüs",
    description:
      "Erstellen und anpassen Sie die Navigationsstruktur Ihrer Website mit Drag-and-Drop-Menüelementen, mehrstufigen Hierarchien und dynamischen Links zu Seiten, Artikeln oder benutzerdefinierten URLs",
  },
}
