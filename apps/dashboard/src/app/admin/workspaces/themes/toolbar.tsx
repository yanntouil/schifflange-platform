import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { D } from "@compo/utils"
import React from "react"
import { useThemes } from "./context"
import { setSearch, themesStore, useThemesStore } from "./store"

const { setView } = themesStore.actions

/**
 * themes toolbar
 */
export const ThemesToolbar: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { selectedIds, create, deleteSelection } = useThemes()
  const search = useThemesStore(({ query }) => query.search)
  const view = useThemesStore(D.prop("view"))
  const searchProps = { search, setSearch }

  return (
    <Dashboard.Toolbar.Root size="lg">
      <Dashboard.Toolbar.Search {...searchProps} placeholder={_("search-placeholder")} />
      <Dashboard.Toolbar.Aside>
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
    "search-placeholder": "Search themes...",
    "delete-selection": "Delete ({{count}})",
  },
  fr: {
    "search-placeholder": "Rechercher des thèmes...",
    "delete-selection": "Supprimer ({{count}})",
  },
  de: {
    "search-placeholder": "Themen suchen...",
    "delete-selection": "Löschen ({{count}})",
  },
}
