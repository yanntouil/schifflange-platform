import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { D, flow } from "@compo/utils"
import React from "react"
import { useLogs } from "./context"
import { LogsTable } from "./logs.table"
import { logsStore, useLogsStore } from "./store"
import { Toolbar } from "./toolbar"

const { setPage, setLimit } = logsStore.actions
const { resetFilterBy, setSearch } = logsStore.actions

/**
 * Admin workspaces logs component
 */
export const Logs: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const page = useLogsStore(flow(D.prop("query"), D.prop("page")))
  const limit = useLogsStore(flow(D.prop("query"), D.prop("limit")))
  const { logs, metadata, swr } = useLogs()

  return (
    <Dashboard.Container>
      <Dashboard.Header>
        <Dashboard.Title level={1}>{_("title")}</Dashboard.Title>
        <Dashboard.Description>{_("description")}</Dashboard.Description>
      </Dashboard.Header>
      <div className="flex flex-col gap-8">
        <Toolbar />
        <Dashboard.Collection>
          <Dashboard.Empty
            total={metadata.total + 1} // force to never display
            results={metadata.total}
            t={_.prefixed("empty")}
            reset={() => {
              resetFilterBy()
              setSearch("")
            }}
            isLoading={swr.isLoading}
          >
            <LogsTable logs={logs} />
          </Dashboard.Empty>
          <Dashboard.Pagination {...{ page, setPage, limit, setLimit, total: metadata.total }} />
        </Dashboard.Collection>
      </div>
    </Dashboard.Container>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Activities",
    description: "Display all workspace activities in the system",
    empty: {
      "no-result-title": "No result found",
      "no-result-content-reset": "We have not found any item corresponding to your search, try to {{reset:reset all filters}}",
    },
  },
  fr: {
    title: "Activités",
    description: "Affiche toutes les activités des espaces de travail dans le système",
    empty: {
      "no-result-title": "Aucun résultat trouvé",
      "no-result-content-reset":
        "Nous n'avons trouvé aucun élément correspondant à votre recherche, essayez de {{reset:réinitialiser tous les filtres}}",
    },
  },
  de: {
    title: "Aktivitäten",
    description: "Zeigt alle Arbeitsbereich-Aktivitäten im System",
    empty: {
      "no-result-title": "Kein Ergebnis gefunden",
      "no-result-content-reset":
        "Wir haben kein Element gefunden, das Ihrer Suche entspricht. Versuchen Sie, {{reset:alle Filter zurückzusetzen}}",
    },
  },
}
