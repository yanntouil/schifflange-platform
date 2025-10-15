import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { D } from "@compo/utils"
import React from "react"
import { useWorkspaces } from "./context"
import { useWorkspacesStore, workspacesStore } from "./store"
import { ToolbarFilter } from "./toolbar.filter"
import { ToolbarSort } from "./toolbar.sort"

const { setSearch, setView } = workspacesStore.actions

/**
 * Workspaces Toolbar
 */
export const WorkspacesToolbar: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const search = useWorkspacesStore(({ query }) => query.search)
  const view = useWorkspacesStore(D.prop("view"))
  const searchProps = { search, setSearch }
  const { create } = useWorkspaces()

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
    search: "Search in workspace names",
    "create-button": "Create",
  },
  fr: {
    search: "Rechercher dans les noms d'espaces de travail",
    "create-button": "Créer",
  },
  de: {
    search: "In Arbeitsbereich-Namen suchen",
    "create-button": "Erstellen",
  },
}
