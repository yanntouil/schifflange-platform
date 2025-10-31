import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { type Api } from "@services/dashboard"
import React from "react"
import { useFiltered } from "../hooks"
import { usePages } from "../pages.context"
import { PagesCards } from "./pages.cards"
import { PagesFilters } from "./pages.filters"
import { PagesTable } from "./pages.table"

/**
 * Pages
 * This component is used to manage and navigate between the pages list
 */
export const Pages: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { swr, createPage, clear, selected, confirmDeleteSelection } = usePages()
  const { pages } = swr
  const { matchable, sortable, filterable, reset, filtered, prefixedKey } = useFiltered(pages)

  const [view, viewProps] = Dashboard.Toolbar.useView(`${prefixedKey}-pages-view`, "row")
  const total = pages.length
  const results = filtered.length

  const [pagination, paginate] = Ui.usePagination<Api.PageWithRelations>(results, 1, 25)
  const paginatedPages = paginate(filtered) as Api.PageWithRelations[]

  return (
    <>
      <Dashboard.Toolbar.Root size='lg'>
        <Dashboard.Toolbar.Search {...matchable} placeholder={_("search")} />
        <Dashboard.Toolbar.Aside>
          <Dashboard.Toolbar.SortFromHook {...sortable} t={_.prefixed("sort")} />
          <PagesFilters {...filterable} />
          <Dashboard.Toolbar.View view={view} setView={viewProps.setView} />
        </Dashboard.Toolbar.Aside>
      </Dashboard.Toolbar.Root>

      <Dashboard.Collection onPointerDownOutside={clear} view={view}>
        <Dashboard.Selection.Bar selected={selected} unselect={clear} delete={confirmDeleteSelection} />
        <Dashboard.Empty
          total={total}
          results={results}
          t={_.prefixed("empty")}
          create={createPage}
          reset={reset}
          isLoading={swr.isLoading}
        >
          {view === "card" ? <PagesCards pages={paginatedPages} /> : <PagesTable pages={paginatedPages} />}
        </Dashboard.Empty>

        {swr.isLoading && <PagesTableSkeleton count={3} />}

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
 * PagesTableSkeleton - Loading skeleton
 */
const PagesTableSkeleton: React.FC<{ count: number }> = ({ count }) => {
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
    search: "Search in pages",
    total: "Results {{from}} to {{to}} of {{total}}",
    sort: {
      "title-asc": "Name (a → z)",
      "title-desc": "Name (z → a)",
      "slug-asc": "Slug (a → z)",
      "slug-desc": "Slug (z → a)",
      "createdAt-asc": "Creation date (oldest first)",
      "createdAt-desc": "Creation date (recent first)",
      "updatedAt-asc": "Update date (oldest first)",
      "updatedAt-desc": "Update date (recent first)",
    },
    empty: {
      "no-item-title": "No pages yet",
      "no-item-content-create": "Start by creating your first page {{create:by clicking here}}",
      "no-item-content": "There are no pages here for now.",
      "no-result-title": "No result found",
      "no-result-content": "We couldn't find any page corresponding to your search.",
      "no-result-content-reset":
        "We couldn't find any page corresponding to your search, try to {{reset:reset the search}}",
    },
  },
  fr: {
    search: "Rechercher dans les pages",
    total: "Résultats {{from}} à {{to}} sur {{total}}",
    sort: {
      "title-asc": "Nom (a → z)",
      "title-desc": "Nom (z → a)",
      "slug-asc": "Slug (a → z)",
      "slug-desc": "Slug (z → a)",
      "createdAt-asc": "Date de création (ancienne en premier)",
      "createdAt-desc": "Date de création (récent en premier)",
      "updatedAt-asc": "Date de mise à jour (ancienne en premier)",
      "updatedAt-desc": "Date de mise à jour (récente en premier)",
    },
    empty: {
      "no-item-title": "Aucune page pour le moment",
      "no-item-content-create": "Commencez par créer votre première page {{create:en cliquant ici}}",
      "no-item-content": "Il n'y a pas de page ici pour le moment.",
      "no-result-title": "Aucun résultat trouvé",
      "no-result-content": "Nous n'avons pas trouvé de page correspondant à votre recherche.",
      "no-result-content-reset":
        "Nous n'avons pas trouvé de page correspondant à votre recherche, essayez de {{reset:réinitialiser la recherche}}",
    },
  },
  de: {
    search: "In Seiten suchen",
    total: "Ergebnisse {{from}} bis {{to}} von {{total}}",
    sort: {
      "title-asc": "Name (a → z)",
      "title-desc": "Name (z → a)",
      "slug-asc": "Slug (a → z)",
      "slug-desc": "Slug (z → a)",
      "createdAt-asc": "Erstellungsdatum (älteste zuerst)",
      "createdAt-desc": "Erstellungsdatum (neueste zuerst)",
      "updatedAt-asc": "Änderungsdatum (älteste zuerst)",
      "updatedAt-desc": "Änderungsdatum (neueste zuerst)",
    },
    empty: {
      "no-item-title": "Noch keine Seiten",
      "no-item-content-create": "Beginnen Sie mit der Erstellung Ihrer ersten Seite {{create:durch Klick hier}}",
      "no-item-content": "Es gibt hier derzeit keine Seiten.",
      "no-result-title": "Kein Ergebnis gefunden",
      "no-result-content": "Wir konnten keine Seite finden, die Ihrer Suche entspricht.",
      "no-result-content-reset":
        "Wir konnten keine Seite finden, die Ihrer Suche entspricht, versuchen Sie {{reset:die Suche zurückzusetzen}}",
    },
  },
}
