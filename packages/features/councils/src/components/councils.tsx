import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { type Api } from "@services/dashboard"
import React from "react"
import { useCouncils } from "../councils.context"
import { useFilteredCouncils } from "../hooks/use-filtered-councils"
import { CouncilsCards, CouncilsCardsSkeleton } from "./councils.cards"
// import { CouncilsFilters } from "./councils.filters"
import { CouncilsTable } from "./councils.table"

/**
 * Councils
 * This component is used to manage and navigate between the councils list
 */
export const Councils: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { swr, createCouncil, clear, selected, confirmDeleteSelection } = useCouncils()
  const { councils } = swr
  const { matchable, sortable, filterable, reset, filtered, prefixedKey } = useFilteredCouncils(councils)

  const [view, viewProps] = Dashboard.Toolbar.useView(`${prefixedKey}-councils-view`, "row")
  const total = councils.length
  const results = filtered.length

  const [pagination, paginate] = Ui.usePagination<Api.Council>(results, 1, 25)
  const paginatedCouncils = paginate(filtered) as Api.Council[]
  return (
    <>
      <Dashboard.Toolbar.Root size='lg'>
        <Dashboard.Toolbar.Search {...matchable} placeholder={_("search")} />
        <Dashboard.Toolbar.Aside>
          <Dashboard.Toolbar.SortFromHook {...sortable} t={_.prefixed("sort")} />
          {/* <CouncilsFilters {...filterable} /> */}
          <Dashboard.Toolbar.View view={view} setView={viewProps.setView} />
        </Dashboard.Toolbar.Aside>
      </Dashboard.Toolbar.Root>
      <Dashboard.Collection onPointerDownOutside={clear} view={view}>
        <Dashboard.Selection.Bar selected={selected} unselect={clear} delete={confirmDeleteSelection} />
        <Dashboard.Empty
          total={total}
          results={results}
          t={_.prefixed("empty")}
          create={createCouncil}
          reset={reset}
          isLoading={swr.isLoading}
        >
          {view === "card" ? (
            <CouncilsCards councils={paginatedCouncils} />
          ) : (
            <CouncilsTable councils={paginatedCouncils} />
          )}
        </Dashboard.Empty>

        {swr.isLoading && (view === "card" ? <CouncilsCardsSkeleton count={3} /> : <CouncilsTableSkeleton count={3} />)}

        {results > 0 && (
          <div className='mt-4 flex flex-col items-center justify-between gap-x-6 pt-4 @2xl/collection:flex-row'>
            <p className='text-muted-foreground inline-flex h-9 shrink-0 items-center text-xs/relaxed'>
              {_("total", { from: pagination.from, to: pagination.to, total })}
            </p>
            <Ui.Pagination.Quick {...pagination} className='@2xl/collection:justify-end' size='sm' />
          </div>
        )}
      </Dashboard.Collection>
    </>
  )
}

/**
 * CouncilsTableSkeleton - Loading skeleton
 */
const CouncilsTableSkeleton: React.FC<{ count: number }> = ({ count }) => {
  return (
    <div className='space-y-2'>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className='h-12 animate-pulse rounded bg-gray-100' />
      ))}
    </div>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    create: "Create council meeting",
    search: "Search in council meetings",
    total: "Results {{from}} to {{to}} of {{total}}",
    sort: {
      "date-asc": "Date (oldest first)",
      "date-desc": "Date (recent first)",
      "createdAt-asc": "Creation date (oldest first)",
      "createdAt-desc": "Creation date (recent first)",
      "updatedAt-asc": "Update date (oldest first)",
      "updatedAt-desc": "Update date (recent first)",
    },
    empty: {
      "no-item-title": "No council meetings yet",
      "no-item-content-create": "Start by creating your first council meeting {{create:by clicking here}}",
      "no-item-content": "There are no council meetings here for now.",
      "no-result-title": "No result found",
      "no-result-content": "We couldn't find any council meeting corresponding to your search.",
      "no-result-content-reset":
        "We couldn't find any council meeting corresponding to your search, try to {{reset:reset the search}}",
    },
  },
  fr: {
    create: "Créer une réunion du conseil communal",
    search: "Rechercher dans les réunions du conseil communal",
    total: "Résultats {{from}} à {{to}} sur {{total}}",
    sort: {
      "date-asc": "Date (ancienne en premier)",
      "date-desc": "Date (récente en premier)",
      "createdAt-asc": "Date de création (ancienne en premier)",
      "createdAt-desc": "Date de création (récent en premier)",
      "updatedAt-asc": "Date de mise à jour (ancienne en premier)",
      "updatedAt-desc": "Date de mise à jour (récente en premier)",
    },
    empty: {
      "no-item-title": "Aucune réunion du conseil communal pour le moment",
      "no-item-content-create":
        "Commencez par créer votre première réunion du conseil communal {{create:en cliquant ici}}",
      "no-item-content": "Il n'y a pas de réunion du conseil communal ici pour le moment.",
      "no-result-title": "Aucun résultat trouvé",
      "no-result-content": "Nous n'avons pas trouvé de réunion du conseil communal correspondant à votre recherche.",
      "no-result-content-reset":
        "Nous n'avons pas trouvé de réunion du conseil communal correspondant à votre recherche, essayez de {{reset:réinitialiser la recherche}}",
    },
  },
  de: {
    create: "Gemeinderatssitzung erstellen",
    search: "In Gemeinderatssitzungen suchen",
    total: "Ergebnisse {{from}} bis {{to}} von {{total}}",
    sort: {
      "date-asc": "Datum (älteste zuerst)",
      "date-desc": "Datum (neueste zuerst)",
      "createdAt-asc": "Erstellungsdatum (älteste zuerst)",
      "createdAt-desc": "Erstellungsdatum (neueste zuerst)",
      "updatedAt-asc": "Aktualisierungsdatum (älteste zuerst)",
      "updatedAt-desc": "Aktualisierungsdatum (neueste zuerst)",
    },
    empty: {
      "no-item-title": "Noch keine Gemeinderatssitzungen",
      "no-item-content-create": "Erstellen Sie Ihre erste Gemeinderatssitzung {{create:durch Klicken hier}}",
      "no-item-content": "Hier sind noch keine Gemeinderatssitzungen vorhanden.",
      "no-result-title": "Kein Ergebnis gefunden",
      "no-result-content": "Wir konnten keine Gemeinderatssitzung finden, die Ihrer Suche entspricht.",
      "no-result-content-reset":
        "Wir konnten keine Gemeinderatssitzung finden, die Ihrer Suche entspricht, versuchen Sie {{reset:die Suche zurückzusetzen}}",
    },
  },
}
