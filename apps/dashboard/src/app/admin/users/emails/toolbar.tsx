import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { D, flow } from "@compo/utils"
import React from "react"
import { emailsStore, useEmailsStore } from "./store"
import { ToolbarFilter } from "./toolbar.filter"

const { setSearch, setFilterBy, resetFilterBy } = emailsStore.actions

/**
 * display toolbar for emails list
 */
export const Toolbar: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const search = useEmailsStore(flow(D.prop("query"), D.prop("search")))
  const filterBy = useEmailsStore(flow(D.prop("query"), D.prop("filterBy")))
  const searchProps = { search, setSearch }
  const filterProps = { filterBy, setFilterBy, resetFilterBy }
  return (
    <Dashboard.Toolbar.Root size="lg">
      <Dashboard.Toolbar.Search {...searchProps} placeholder={_("search")} />
      <Dashboard.Toolbar.Aside>
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
    search: "Search in emails",
  },
  fr: {
    search: "Rechercher dans les emails",
  },
  de: {
    search: "Suchen in den E-Mails",
  },
}
