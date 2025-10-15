import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { type Api } from "@services/dashboard"
import React from "react"
import { useArticles } from "../articles.context"
import { useFilteredArticles } from "../hooks"
import { ArticlesCards, ArticlesCardsSkeleton } from "./articles.cards"
import { ArticlesFilters } from "./articles.filters"
import { ArticlesTable } from "./articles.table"

/**
 * Articles
 * This component is used to manage and navigate between the articles list
 */
export const Articles: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { swr, createArticle, clear, selected, confirmDeleteSelection } = useArticles()
  const { articles } = swr
  const { matchable, sortable, filterable, reset, filtered, prefixedKey } = useFilteredArticles(articles)

  const [view, viewProps] = Dashboard.Toolbar.useView(`${prefixedKey}-articles-view`, "row")
  const total = articles.length
  const results = filtered.length

  const [pagination, paginate] = Ui.usePagination<Api.ArticleWithRelations>(results, 1, 25)
  const paginatedArticles = paginate(filtered) as Api.ArticleWithRelations[]
  return (
    <>
      <Dashboard.Toolbar.Root size='lg'>
        <Dashboard.Toolbar.Search {...matchable} placeholder={_("search")} />
        <Dashboard.Toolbar.Aside>
          <Dashboard.Toolbar.SortFromHook {...sortable} t={_.prefixed("sort")} />
          <ArticlesFilters {...filterable} />
          <Dashboard.Toolbar.View view={view} setView={viewProps.setView} />
        </Dashboard.Toolbar.Aside>
      </Dashboard.Toolbar.Root>

      <Dashboard.Collection onPointerDownOutside={clear} view={view}>
        <Dashboard.Selection.Bar selected={selected} unselect={clear} delete={confirmDeleteSelection} />
        <Dashboard.Empty
          total={total}
          results={results}
          t={_.prefixed("empty")}
          create={createArticle}
          reset={reset}
          isLoading={swr.isLoading}
        >
          {view === "card" ? (
            <ArticlesCards articles={paginatedArticles} />
          ) : (
            <ArticlesTable articles={paginatedArticles} />
          )}
        </Dashboard.Empty>

        {swr.isLoading && (view === "card" ? <ArticlesCardsSkeleton count={3} /> : <ArticlesTableSkeleton count={3} />)}

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
 * ArticlesTableSkeleton - Loading skeleton
 */
const ArticlesTableSkeleton: React.FC<{ count: number }> = ({ count }) => {
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
    search: "Search in articles",
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
      "no-item-title": "No articles yet",
      "no-item-content-create": "Start by creating your first article {{create:by clicking here}}",
      "no-item-content": "There are no articles here for now.",
      "no-result-title": "No result found",
      "no-result-content": "We couldn't find any article corresponding to your search.",
      "no-result-content-reset":
        "We couldn't find any article corresponding to your search, try to {{reset:reset the search}}",
    },
  },
  fr: {
    search: "Rechercher dans les articles",
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
      "no-item-title": "Aucun article pour le moment",
      "no-item-content-create": "Commencez par créer votre premier article {{create:en cliquant ici}}",
      "no-item-content": "Il n'y a pas d'article ici pour le moment.",
      "no-result-title": "Aucun résultat trouvé",
      "no-result-content": "Nous n'avons pas trouvé d'article correspondant à votre recherche.",
      "no-result-content-reset":
        "Nous n'avons pas trouvé d'article correspondant à votre recherche, essayez de {{reset:réinitialiser la recherche}}",
    },
  },
  de: {
    search: "In Artikeln suchen",
    total: "Ergebnisse {{from}} bis {{to}} von {{total}}",
    sort: {
      "title-asc": "Name (a → z)",
      "title-desc": "Name (z → a)",
      "slug-asc": "Slug (a → z)",
      "slug-desc": "Slug (z → a)",
      "createdAt-asc": "Erstellungsdatum (älteste zuerst)",
      "createdAt-desc": "Erstellungsdatum (neueste zuerst)",
      "updatedAt-asc": "Aktualisierungsdatum (älteste zuerst)",
      "updatedAt-desc": "Aktualisierungsdatum (neueste zuerst)",
    },
    empty: {
      "no-item-title": "Noch keine Artikel",
      "no-item-content-create": "Beginnen Sie mit der Erstellung Ihres ersten Artikels {{create:durch Klicken hier}}",
      "no-item-content": "Es gibt hier momentan keine Artikel.",
      "no-result-title": "Kein Ergebnis gefunden",
      "no-result-content": "Wir konnten keinen Artikel finden, der Ihrer Suche entspricht.",
      "no-result-content-reset":
        "Wir konnten keinen Artikel finden, der Ihrer Suche entspricht. Versuchen Sie, {{reset:die Suche zurückzusetzen}}",
    },
  },
}
