import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { type Api } from "@services/dashboard"
import { FolderPlus } from "lucide-react"
import React from "react"
import { useCategories } from "../categories.context"
import { useFilteredCategories } from "../hooks"
import { CategoriesCards, CategoriesCardsSkeleton } from "./categories.cards"
import { CategoriesFilters } from "./categories.filters"
import { CategoriesTable } from "./categories.table"

/**
 * Categories
 * This component is used to manage and navigate between the categories list
 */
export const Categories: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { swr, createCategory, clear, selected, confirmDeleteSelectionCategory } = useCategories()
  const { categories } = swr
  const { matchable, sortable, filterable, reset, filtered, prefixedKey } = useFilteredCategories(categories)

  const [view, viewProps] = Dashboard.Toolbar.useView(`${prefixedKey}-categories-view`, "row")
  const total = categories.length
  const results = filtered.length

  const [pagination, paginate] = Ui.usePagination<Api.ArticleCategory>(results, 1, 25)
  const paginatedCategories = paginate(filtered) as Api.ArticleCategory[]
  return (
    <>
      <Dashboard.Toolbar.Root size='lg'>
        <Dashboard.Toolbar.Search {...matchable} placeholder={_("search")} />
        <Dashboard.Toolbar.Aside>
          <Dashboard.Toolbar.SortFromHook {...sortable} t={_.prefixed("sort")} />
          <CategoriesFilters {...filterable} />
          <Dashboard.Toolbar.Button onClick={() => createCategory()}>
            <FolderPlus aria-hidden />
            <span>{_("create")}</span>
          </Dashboard.Toolbar.Button>
          <Dashboard.Toolbar.View view={view} setView={viewProps.setView} />
        </Dashboard.Toolbar.Aside>
      </Dashboard.Toolbar.Root>

      <Dashboard.Collection onPointerDownOutside={clear} view={view}>
        <Dashboard.Selection.Bar selected={selected} unselect={clear} delete={confirmDeleteSelectionCategory} />
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

        {swr.isLoading &&
          (view === "card" ? <CategoriesCardsSkeleton count={3} /> : <CategoriesTableSkeleton count={3} />)}

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
 * CategoriesTableSkeleton - Loading skeleton
 */
const CategoriesTableSkeleton: React.FC<{ count: number }> = ({ count }) => {
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
    create: "Create category",
    search: "Search in categories",
    total: "Results {{from}} to {{to}} of {{total}}",
    sort: {
      "title-asc": "Name (a → z)",
      "title-desc": "Name (z → a)",
      "createdAt-asc": "Creation date (oldest first)",
      "createdAt-desc": "Creation date (recent first)",
      "updatedAt-asc": "Update date (oldest first)",
      "updatedAt-desc": "Update date (recent first)",
    },
    empty: {
      "no-item-title": "No categories yet",
      "no-item-content-create": "Start by creating your first category {{create:by clicking here}}",
      "no-item-content": "There are no categories here for now.",
      "no-result-title": "No result found",
      "no-result-content": "We couldn't find any category corresponding to your search.",
      "no-result-content-reset":
        "We couldn't find any category corresponding to your search, try to {{reset:reset the search}}",
    },
  },
  fr: {
    create: "Créer une catégorie",
    search: "Rechercher dans les catégories",
    total: "Résultats {{from}} à {{to}} sur {{total}}",
    sort: {
      "title-asc": "Nom (a → z)",
      "title-desc": "Nom (z → a)",
      "createdAt-asc": "Date de création (ancienne en premier)",
      "createdAt-desc": "Date de création (récent en premier)",
      "updatedAt-asc": "Date de mise à jour (ancienne en premier)",
      "updatedAt-desc": "Date de mise à jour (récente en premier)",
    },
    empty: {
      "no-item-title": "Aucune catégorie pour le moment",
      "no-item-content-create": "Commencez par créer votre première catégorie {{create:en cliquant ici}}",
      "no-item-content": "Il n'y a pas de catégorie ici pour le moment.",
      "no-result-title": "Aucun résultat trouvé",
      "no-result-content": "Nous n'avons pas trouvé de catégorie correspondant à votre recherche.",
      "no-result-content-reset":
        "Nous n'avons pas trouvé de catégorie correspondant à votre recherche, essayez de {{reset:réinitialiser la recherche}}",
    },
  },
  de: {
    create: "Kategorie erstellen",
    search: "In Kategorien suchen",
    total: "Ergebnisse {{from}} bis {{to}} von {{total}}",
    sort: {
      "title-asc": "Name (a → z)",
      "title-desc": "Name (z → a)",
      "createdAt-asc": "Erstellungsdatum (älteste zuerst)",
      "createdAt-desc": "Erstellungsdatum (neueste zuerst)",
      "updatedAt-asc": "Aktualisierungsdatum (älteste zuerst)",
      "updatedAt-desc": "Aktualisierungsdatum (neueste zuerst)",
    },
    empty: {
      "no-item-title": "Noch keine Kategorien",
      "no-item-content-create": "Erstellen Sie Ihre erste Kategorie {{create:durch Klicken hier}}",
      "no-item-content": "Hier sind noch keine Kategorien vorhanden.",
      "no-result-title": "Kein Ergebnis gefunden",
      "no-result-content": "Wir konnten keine Kategorie finden, die Ihrer Suche entspricht.",
      "no-result-content-reset":
        "Wir konnten keine Kategorie finden, die Ihrer Suche entspricht, versuchen Sie {{reset:die Suche zurückzusetzen}}",
    },
  },
}
