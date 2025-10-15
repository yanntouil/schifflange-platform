import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { D, flow } from "@compo/utils"
import React from "react"
import { useWorkspaces } from "./context"
import { useWorkspacesStore, workspacesStore } from "./store"
import { WorkspacesToolbar } from "./toolbar"
import { WorkspacesCards } from "./workspaces.card"
import { WorkspacesTable } from "./workspaces.table"

const { setPage, setLimit } = workspacesStore.actions
const { resetFilterBy, setSearch } = workspacesStore.actions

/**
 * Workspaces
 */
export const Workspaces: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const view = useWorkspacesStore(D.prop("view"))
  const page = useWorkspacesStore(flow(D.prop("query"), D.prop("page")))
  const limit = useWorkspacesStore(flow(D.prop("query"), D.prop("limit")))
  const { create, workspaces, metadata, total, swr, selected, clear, deleteSelection } = useWorkspaces()

  return (
    <Dashboard.Container>
      <Dashboard.Header>
        <Dashboard.Title level={1}>{_("title")}</Dashboard.Title>
        <Dashboard.Description>{_("description")}</Dashboard.Description>
      </Dashboard.Header>
      <WorkspacesToolbar />
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
          {view === "row" ? <WorkspacesTable workspaces={workspaces} /> : <WorkspacesCards workspaces={workspaces} />}
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
    title: "Workspaces",
    description: "Manage all workspaces in the system",
    empty: {
      "no-item-title": "No workspace found",
      "no-item-content-create": "Create a workspace by {{create:clicking here}}",
      "no-result-title": "No result found",
      "no-result-content-reset": "We have not found any item corresponding to your search, try to {{reset:reset all filters}}",
    },
  },
  fr: {
    title: "Espaces de travail",
    description: "Gérer tous les espaces de travail du système",
    empty: {
      "no-item-title": "Aucun espace de travail trouvé",
      "no-item-content-create": "Créez un espace de travail pour commencer {{create:en cliquant ici}}",
      "no-result-title": "Aucun résultat trouvé",
      "no-result-content-reset":
        "Nous n'avons trouvé aucun élément correspondant à votre recherche, essayez de {{reset:réinitialiser tous les filtres}}",
    },
  },
  de: {
    title: "Arbeitsbereiche",
    description: "Verwalten Sie alle Arbeitsbereiche im System",
    empty: {
      "no-item-title": "Kein Arbeitsbereich gefunden",
      "no-item-content-create": "Erstellen Sie einen Arbeitsbereich, indem Sie {{create:hier klicken}}",
      "no-result-title": "Keine Ergebnisse gefunden",
      "no-result-content-reset":
        "Wir haben keine Elemente gefunden, die Ihrer Suche entsprechen. Versuchen Sie, {{reset:alle Filter zurückzusetzen}}",
    },
  },
}
