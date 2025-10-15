import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { D, flow } from "@compo/utils"
import React from "react"
import { useWorkspacesStore, workspacesStore } from "./store"

const { setSortBy } = workspacesStore.actions

/**
 * Admin workspaces toolbar sort
 */
export const ToolbarSort: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const sortBy = useWorkspacesStore(flow(D.prop("query"), D.prop("sortBy")))
  return (
    <Dashboard.Toolbar.Sort
      sort={{
        status: ["asc", "alphabet"],
        name: ["asc", "alphabet"],
        type: ["asc", "alphabet"],
        createdAt: ["desc", "number"],
        updatedAt: ["desc", "number"],
      }}
      sortBy={sortBy}
      setSortBy={setSortBy}
      t={_.prefixed("sort")}
    />
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    sort: {
      "status-asc": "Status (ascending)",
      "status-desc": "Status (descending)",
      "name-asc": "Name (a → z)",
      "name-desc": "Name (z → a)",
      "type-asc": "Type (a → z)",
      "type-desc": "Type (z → a)",
      "createdAt-asc": "Created date (oldest first)",
      "createdAt-desc": "Created date (recent first)",
      "updatedAt-asc": "Updated date (oldest first)",
      "updatedAt-desc": "Updated date (recent first)",
    },
  },
  fr: {
    sort: {
      "status-asc": "Statut (ascendant)",
      "status-desc": "Statut (descendant)",
      "name-asc": "Nom (a → z)",
      "name-desc": "Nom (z → a)",
      "type-asc": "Type (a → z)",
      "type-desc": "Type (z → a)",
      "createdAt-asc": "Date de création (du plus ancien au plus récent)",
      "createdAt-desc": "Date de création (du plus récent au plus ancien)",
      "updatedAt-asc": "Date de mise à jour (du plus ancien au plus récent)",
      "updatedAt-desc": "Date de mise à jour (du plus récent au plus ancien)",
    },
  },
  de: {
    sort: {
      "status-asc": "Status (aufsteigend)",
      "status-desc": "Status (absteigend)",
      "name-asc": "Name (a → z)",
      "name-desc": "Name (z → a)",
      "type-asc": "Typ (a → z)",
      "type-desc": "Typ (z → a)",
      "createdAt-asc": "Erstellungsdatum (älteste zuerst)",
      "createdAt-desc": "Erstellungsdatum (neueste zuerst)",
      "updatedAt-asc": "Änderungsdatum (älteste zuerst)",
      "updatedAt-desc": "Änderungsdatum (neueste zuerst)",
    },
  },
}
