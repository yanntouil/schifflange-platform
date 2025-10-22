import { Dashboard } from "@compo/dashboard"
import { Categories, CategoriesHeader, CategoriesProvider, useSwrCategories } from "@compo/directory"
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
  const swr = useSwrCategories()
  return (
    <Dashboard.Container>
      <CategoriesProvider swr={swr}>
        <CategoriesHeader />
        <Categories />
      </CategoriesProvider>
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
