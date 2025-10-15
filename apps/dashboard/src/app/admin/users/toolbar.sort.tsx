import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { D, flow } from "@compo/utils"
import React from "react"
import { usersStore, useUsersStore } from "./store"

const { setSortBy } = usersStore.actions

/**
 * Admin users toolbar sort
 */
export const ToolbarSort: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const sortBy = useUsersStore(flow(D.prop("query"), D.prop("sortBy")))
  return (
    <Dashboard.Toolbar.Sort
      sort={{
        status: ["asc", "alphabet"],
        email: ["asc", "alphabet"],
        role: ["asc", "alphabet"],
        createdAt: ["desc", "number"],
        updatedAt: ["desc", "number"],
        firstname: ["asc", "alphabet"],
        lastname: ["asc", "alphabet"],
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
      "role-asc": "Role (ascending)",
      "role-desc": "Role (descending)",
      "email-asc": "Email (a → z)",
      "email-desc": "Email (z → a)",
      "firstname-asc": "First name (a → z)",
      "firstname-desc": "First name (z → a)",
      "lastname-asc": "Last name (a → z)",
      "lastname-desc": "Last name (z → a)",
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
      "role-asc": "Rôle (ascendant)",
      "role-desc": "Rôle (descendant)",
      "email-asc": "Email (a → z)",
      "email-desc": "Email (z → a)",
      "firstname-asc": "Prénom (a → z)",
      "firstname-desc": "Prénom (z → a)",
      "lastname-asc": "Nom (a → z)",
      "lastname-desc": "Nom (z → a)",
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
      "role-asc": "Rolle (aufsteigend)",
      "role-desc": "Rolle (absteigend)",
      "email-asc": "E-Mail (a → z)",
      "email-desc": "E-Mail (z → a)",
      "firstname-asc": "Vorname (a → z)",
      "firstname-desc": "Vorname (z → a)",
      "lastname-asc": "Nachname (a → z)",
      "lastname-desc": "Nachname (z → a)",
      "createdAt-asc": "Erstellungsdatum (älteste zuerst)",
      "createdAt-desc": "Erstellungsdatum (neueste zuerst)",
      "updatedAt-asc": "Änderungsdatum (älteste zuerst)",
      "updatedAt-desc": "Änderungsdatum (neueste zuerst)",
    },
  },
}
