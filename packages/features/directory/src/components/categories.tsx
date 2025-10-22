import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { type Api } from "@services/dashboard"
import React from "react"
import { useCategories } from "../categories.context"
import { useFilteredCategories } from "../hooks/use-filtered-categories"
import { CategoriesCards } from "./categories.cards"
import { CategoriesFilters } from "./categories.filters"
import { CategoriesTable } from "./categories.table"

/**
 * Categories
 */
export const Categories: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { swr, createCategory, clear, selected, confirmDeleteSelection } = useCategories()
  const { categories } = swr
  const { matchable, sortable, filterable, reset, filtered, prefixedKey } = useFilteredCategories(categories)
  const [view, viewProps] = Dashboard.Toolbar.useView(`${prefixedKey}-categories-view`, "row")
  const total = categories.length
  const results = filtered.length
  const [pagination, paginate] = Ui.usePagination<Api.OrganisationCategory>(results, 1, 25)
  const paginatedCategories = paginate(filtered) as Api.OrganisationCategory[]
  return (
    <>
      <Dashboard.Toolbar.Root size='lg'>
        <Dashboard.Toolbar.Search {...matchable} placeholder={_("search")} />
        <Dashboard.Toolbar.Aside>
          <Dashboard.Toolbar.SortFromHook {...sortable} t={_.prefixed("sort")} />
          <CategoriesFilters {...filterable} />
          <Dashboard.Toolbar.View view={view} setView={viewProps.setView} />
        </Dashboard.Toolbar.Aside>
      </Dashboard.Toolbar.Root>
      <Dashboard.Collection onPointerDownOutside={clear} view={view}>
        <Dashboard.Selection.Bar selected={selected} unselect={clear} delete={confirmDeleteSelection} />
        <Dashboard.Empty
          total={total}
          results={results}
          t={_.prefixed("empty")}
          create={createCategory}
          reset={reset}
          isLoading={swr.isLoading}
        >
          {view === "card" ? (
            <CategoriesCards categories={paginatedCategories} />
          ) : (
            <CategoriesTable categories={paginatedCategories} />
          )}
        </Dashboard.Empty>
        {results > 0 && (
          <div className='mt-4 flex flex-col items-center justify-between gap-x-6 pt-4 @2xl/collection:flex-row'>
            <p className='text-muted-foreground inline-flex h-9 shrink-0 items-center text-xs/relaxed'>
              {_("total", { from: pagination.from, to: pagination.to, total: results })}
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
    search: "Search categories...",
    create: "Create Category",
    total: "Showing {{from}} to {{to}} of {{total}} categories",
    sort: {
      "title-asc": "Title (a → z)",
      "title-desc": "Title (z → a)",
      "order-asc": "Order (ascending)",
      "order-desc": "Order (descending)",
      "createdAt-asc": "Creation date (oldest first)",
      "createdAt-desc": "Creation date (recent first)",
      "updatedAt-asc": "Update date (oldest first)",
      "updatedAt-desc": "Update date (recent first)",
    },
    empty: {
      "no-data": "No categories yet",
      "no-data-description": "Get started by creating your first category.",
      "no-results": "No categories found",
      "no-results-description": "Try adjusting your search or filters.",
      reset: "Clear filters",
      create: "Create category",
    },
  },
  fr: {
    search: "Rechercher des catégories...",
    create: "Créer une catégorie",
    total: "Affichage de {{from}} à {{to}} sur {{total}} catégories",
    sort: {
      "title-asc": "Titre (a → z)",
      "title-desc": "Titre (z → a)",
      "order-asc": "Ordre (croissant)",
      "order-desc": "Ordre (décroissant)",
      "createdAt-asc": "Date de création (ancienne en premier)",
      "createdAt-desc": "Date de création (récente en premier)",
      "updatedAt-asc": "Date de mise à jour (ancienne en premier)",
      "updatedAt-desc": "Date de mise à jour (récente en premier)",
    },
    empty: {
      "no-data": "Aucune catégorie pour le moment",
      "no-data-description": "Commencez par créer votre première catégorie.",
      "no-results": "Aucune catégorie trouvée",
      "no-results-description": "Essayez d'ajuster votre recherche ou vos filtres.",
      reset: "Effacer les filtres",
      create: "Créer une catégorie",
    },
  },
  de: {
    search: "Kategorien durchsuchen...",
    create: "Kategorie erstellen",
    total: "Zeige {{from}} bis {{to}} von {{total}} Kategorien",
    sort: {
      "title-asc": "Titel (a → z)",
      "title-desc": "Titel (z → a)",
      "order-asc": "Reihenfolge (aufsteigend)",
      "order-desc": "Reihenfolge (absteigend)",
      "createdAt-asc": "Erstellungsdatum (älteste zuerst)",
      "createdAt-desc": "Erstellungsdatum (neueste zuerst)",
      "updatedAt-asc": "Änderungsdatum (älteste zuerst)",
      "updatedAt-desc": "Änderungsdatum (neueste zuerst)",
    },
    empty: {
      "no-data": "Noch keine Kategorien",
      "no-data-description": "Beginnen Sie mit der Erstellung Ihrer ersten Kategorie.",
      "no-results": "Keine Kategorien gefunden",
      "no-results-description": "Versuchen Sie, Ihre Suche oder Filter anzupassen.",
      reset: "Filter löschen",
      create: "Kategorie erstellen",
    },
  },
}
