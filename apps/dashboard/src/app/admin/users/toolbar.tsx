import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { D } from "@compo/utils"
import React from "react"
import { usersStore, useUsersStore } from "./store"
import { ToolbarFilter } from "./toolbar.filter"
import { ToolbarSort } from "./toolbar.sort"

const { setSearch, setView } = usersStore.actions

/**
 * Admin users toolbar
 */
export const Toolbar: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const search = useUsersStore(({ query }) => query.search)
  const view = useUsersStore(D.prop("view"))
  const searchProps = { search, setSearch }
  return (
    <Dashboard.Toolbar.Root size="lg">
      <Dashboard.Toolbar.Search {...searchProps} placeholder={_("search")} />
      <Dashboard.Toolbar.Aside>
        <ToolbarFilter />
        <ToolbarSort />
        <Dashboard.Toolbar.View view={view} setView={setView} />
      </Dashboard.Toolbar.Aside>
    </Dashboard.Toolbar.Root>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    search: "Search in emails, firstnames or lastnames",
  },
  fr: {
    search: "Rechercher dans les emails, les prénoms ou les noms",
  },
  de: {
    search: "Suchen in E-Mails, Vor- oder Nachnamen",
  },
}
