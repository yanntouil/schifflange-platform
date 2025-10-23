import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { type Api } from "@services/dashboard"
import React from "react"
import { useFilteredLibraries } from "../hooks/use-filtered-libraries"
import { useLibraries } from "../libraries.context"
import { LibrariesCards } from "./libraries.cards"
import { LibrariesFilters } from "./libraries.filters"
import { LibrariesTable } from "./libraries.table"

/**
 * Libraries
 */
export const Libraries: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { swr, createLibrary, clear, selected, confirmDeleteSelection } = useLibraries()

  const { libraries } = swr
  const { matchable, sortable, filterable, reset, filtered, prefixedKey } = useFilteredLibraries(libraries)
  const [view, viewProps] = Dashboard.Toolbar.useView(`${prefixedKey}-libraries-view`, "row")

  const total = libraries.length
  const results = filtered.length

  const [pagination, paginate] = Ui.usePagination<Api.Library>(results, 1, 25)
  const paginatedLibraries = paginate(filtered) as Api.Library[]

  return (
    <>
      <Dashboard.Toolbar.Root size='lg'>
        <Dashboard.Toolbar.Search {...matchable} placeholder={_("search")} />
        <Dashboard.Toolbar.Aside>
          <Dashboard.Toolbar.SortFromHook {...sortable} t={_.prefixed("sort")} />
          <LibrariesFilters {...filterable} />
          <Dashboard.Toolbar.View view={view} setView={viewProps.setView} />
        </Dashboard.Toolbar.Aside>
      </Dashboard.Toolbar.Root>
      <Dashboard.Collection onPointerDownOutside={clear} view={view}>
        <Dashboard.Selection.Bar selected={selected} unselect={clear} delete={confirmDeleteSelection} />
        <Dashboard.Empty
          total={total}
          results={results}
          t={_.prefixed("empty")}
          create={createLibrary}
          reset={reset}
          isLoading={swr.isLoading}
        >
          {view === "card" ? (
            <LibrariesCards libraries={paginatedLibraries} />
          ) : (
            <LibrariesTable libraries={paginatedLibraries} />
          )}
        </Dashboard.Empty>
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
 * translations
 */
const dictionary = {
  en: {
    create: "Create Library",
    search: "Search libraries...",
    sort: {
      "title-asc": "Title (a → z)",
      "title-desc": "Title (z → a)",
      "createdAt-asc": "Creation date (oldest first)",
      "createdAt-desc": "Creation date (recent first)",
      "updatedAt-asc": "Update date (oldest first)",
      "updatedAt-desc": "Update date (recent first)",
    },
    empty: {
      "no-item-title": "No libraries yet",
      "no-item-content-create": "Start by creating your first library {{create:by clicking here}}",
      "no-item-content": "There are no libraries here for now.",
      "no-result-title": "No result found",
      "no-result-content": "We couldn't find any library corresponding to your search.",
      "no-result-content-reset":
        "We couldn't find any library corresponding to your search, try to {{reset:reset the search}}",
    },
    total: "Showing {{from}} to {{to}} of {{total}} libraries",
  },
  fr: {
    create: "Créer une bibliothèque",
    search: "Rechercher des bibliothèques...",
    sort: {
      "title-asc": "Titre (a → z)",
      "title-desc": "Titre (z → a)",
      "createdAt-asc": "Date de création (ancienne en premier)",
      "createdAt-desc": "Date de création (du plus récent au plus ancien)",
      "updatedAt-asc": "Date de mise à jour (du plus ancien au plus récent)",
      "updatedAt-desc": "Date de mise à jour (du plus récent au plus ancien)",
    },
    empty: {
      "no-item-title": "Aucune bibliothèque trouvée",
      "no-item-content-create": "Commencez par créer votre première bibliothèque {{create:en cliquant ici}}",
      "no-item-content": "Il n'y a pas de bibliothèque ici pour le moment.",
      "no-result-title": "Aucun résultat trouvé",
      "no-result-content": "Nous n'avons trouvé aucune bibliothèque correspondant à votre recherche.",
      "no-result-content-reset":
        "Nous n'avons trouvé aucune bibliothèque correspondant à votre recherche, essayez de {{reset:réinitialiser la recherche}}",
    },
    total: "Affichage de {{from}} à {{to}} sur {{total}} bibliothèques",
  },
  de: {
    create: "Bibliothek erstellen",
    search: "Bibliotheken durchsuchen...",
    sort: {
      "title-asc": "Titel (a → z)",
      "title-desc": "Titel (z → a)",
      "createdAt-asc": "Erstellungsdatum (älteste zuerst)",
      "createdAt-desc": "Erstellungsdatum (neueste zuerst)",
      "updatedAt-asc": "Änderungsdatum (älteste zuerst)",
      "updatedAt-desc": "Änderungsdatum (neueste zuerst)",
    },
    empty: {
      "no-item-title": "Keine Bibliotheken gefunden",
      "no-item-content-create":
        "Beginnen Sie mit der Erstellung Ihrer ersten Bibliothek {{create:indem Sie hier klicken}}",
      "no-item-content": "Es gibt keine Bibliotheken hier für jetzt.",
      "no-result-title": "Kein Ergebnis gefunden",
      "no-result-content": "Wir konnten keine Bibliothek entsprechend Ihrer Suche finden.",
      "no-result-content-reset":
        "Wir konnten keine Bibliothek entsprechend Ihrer Suche finden, versuchen Sie es erneut {{reset:die Suche zurücksetzen}}",
    },
    total: "Zeige {{from}} bis {{to}} von {{total}} Bibliotheken",
  },
}
