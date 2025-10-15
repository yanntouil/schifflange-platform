import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { D, flow } from "@compo/utils"
import React from "react"
import { useUsers } from "./context"
import { usersStore, useUsersStore } from "./store"
import { Toolbar } from "./toolbar"
import { UserCards } from "./users.card"
import { UsersTable } from "./users.table"

const { setPage, setLimit } = usersStore.actions
const { resetFilterBy, setSearch } = usersStore.actions

/**
 * Admin users component
 */
export const Users: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const view = useUsersStore(D.prop("view"))
  const page = useUsersStore(flow(D.prop("query"), D.prop("page")))
  const limit = useUsersStore(flow(D.prop("query"), D.prop("limit")))
  const { create, users, metadata, total, selected, clear, deleteSelection, swr } = useUsers()

  return (
    <Dashboard.Container>
      <Dashboard.Header>
        <Dashboard.Title level={1}>{_("title")}</Dashboard.Title>
        <Dashboard.Description>{_("description")}</Dashboard.Description>
      </Dashboard.Header>
      <Toolbar />
      <Dashboard.Collection view={view} onPointerDownOutside={clear}>
        <Dashboard.Selection.Bar selected={selected} unselect={clear} delete={deleteSelection} />
        <Dashboard.Empty
          total={total}
          results={metadata.total}
          t={_.prefixed("empty")}
          create={create}
          reset={() => {
            resetFilterBy()
            setSearch("")
          }}
          isLoading={swr.isLoading}
        >
          {view === "row" ? <UsersTable users={users} /> : <UserCards users={users} />}
        </Dashboard.Empty>
        <Dashboard.Pagination {...{ page, setPage, limit, setLimit, total: metadata.total }} />
      </Dashboard.Collection>
    </Dashboard.Container>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    title: "List of all users",
    description: "Manage all users in the system",
    empty: {
      "no-item-title": "No user found",
      "no-item-content-create": "Create a user by {{create:clicking here}}",
      "no-result-title": "No result found",
      "no-result-content-reset": "We have not found any item corresponding to your search, try to {{reset:reset all filters}}",
    },
  },
  fr: {
    title: "Liste de tous les utilisateurs",
    description: "Gérer les utilisateurs dans le système",
    empty: {
      "no-item-title": "Aucun utilisateur trouvé",
      "no-item-content-create": "Créez un utilisateur pour commencer {{create:en cliquant ici}}",
      "no-result-title": "Aucun résultat trouvé",
      "no-result-content-reset":
        "Nous n'avons trouvé aucun élément correspondant à votre recherche, essayez de {{reset:réinitialiser tous les filtres}}",
    },
  },
  de: {
    title: "Liste aller Benutzer",
    description: "Verwalten Sie alle Benutzer im System",
    empty: {
      "no-item-title": "Kein Benutzer gefunden",
      "no-item-content-create": "Erstellen Sie einen Benutzer, indem Sie {{create:hier klicken}}",
      "no-result-title": "Keine Ergebnisse gefunden",
      "no-result-content-reset":
        "Wir haben keine Elemente gefunden, die Ihrer Suche entsprechen. Versuchen Sie, {{reset:alle Filter zurückzusetzen}}",
    },
  },
}
