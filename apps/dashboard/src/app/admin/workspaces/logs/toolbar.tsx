import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { D, flow } from "@compo/utils"
import React from "react"
import { logsStore, useLogsStore } from "./store"
import { ToolbarFilter } from "./toolbar.filter"
import { ToolbarRange } from "./toolbar.range"

const { setSearch, setFilterBy, resetFilterBy } = logsStore.actions

/**
 * display toolbar for logs list
 */
export const Toolbar: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const search = useLogsStore(flow(D.prop("query"), D.prop("search")))
  const filterBy = useLogsStore(flow(D.prop("query"), D.prop("filterBy")))
  const searchProps = { search, setSearch }
  const rangeProps = { filterBy, setFilterBy }
  const filterProps = { filterBy, setFilterBy, resetFilterBy }
  return (
    <Dashboard.Toolbar.Root size="lg">
      <Dashboard.Toolbar.Search {...searchProps} placeholder={_("search")} />
      <Dashboard.Toolbar.Aside>
        <ToolbarRange {...rangeProps} />
        <ToolbarFilter {...filterProps} />
      </Dashboard.Toolbar.Aside>
    </Dashboard.Toolbar.Root>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    search: "Search in activities",
  },
  fr: {
    search: "Rechercher dans les activités",
  },
  de: {
    search: "In Aktivitäten suchen",
  },
}
