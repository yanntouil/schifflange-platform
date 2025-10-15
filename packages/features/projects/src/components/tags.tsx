import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { type Api } from "@services/dashboard"
import { FolderPlus } from "lucide-react"
import React from "react"
import { useFilteredTags } from "../hooks"
import { useTags } from "../tags.context"
import { TagsCards, TagsCardsSkeleton } from "./tags.cards"
import { TagsFilters } from "./tags.filters"
import { TagsTable } from "./tags.table"

/**
 * Categories
 * This component is used to manage and navigate between the categories list
 */
export const Tags: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { swr, createTag, clear, selected, confirmDeleteSelectionTag } = useTags()
  const { tags } = swr
  const { matchable, sortable, filterable, reset, filtered, prefixedKey } = useFilteredTags(tags)

  const [view, viewProps] = Dashboard.Toolbar.useView(`${prefixedKey}-tags-view`, "row")
  const total = tags.length
  const results = filtered.length

  const [pagination, paginate] = Ui.usePagination<Api.ProjectTag>(results, 1, 25)
  const paginatedTags = paginate(filtered) as Api.ProjectTag[]
  return (
    <>
      <Dashboard.Toolbar.Root size='lg'>
        <Dashboard.Toolbar.Search {...matchable} placeholder={_("search")} />
        <Dashboard.Toolbar.Aside>
          <Dashboard.Toolbar.SortFromHook {...sortable} t={_.prefixed("sort")} />
          <TagsFilters {...filterable} />
          <Dashboard.Toolbar.Button onClick={() => createTag()}>
            <FolderPlus aria-hidden />
            <span>{_("create")}</span>
          </Dashboard.Toolbar.Button>
          <Dashboard.Toolbar.View view={view} setView={viewProps.setView} />
        </Dashboard.Toolbar.Aside>
      </Dashboard.Toolbar.Root>

      <Dashboard.Collection onPointerDownOutside={clear} view={view}>
        <Dashboard.Selection.Bar selected={selected} unselect={clear} delete={confirmDeleteSelectionTag} />
        <Dashboard.Empty
          total={total}
          results={results}
          t={_.prefixed("empty")}
          create={createTag}
          reset={reset}
          isLoading={swr.isLoading}
        >
          {view === "card" ? <TagsCards tags={paginatedTags} /> : <TagsTable tags={paginatedTags} />}
        </Dashboard.Empty>

        {swr.isLoading && (view === "card" ? <TagsCardsSkeleton count={3} /> : <TagsTableSkeleton count={3} />)}

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
 * TagsTableSkeleton - Loading skeleton
 */
const TagsTableSkeleton: React.FC<{ count: number }> = ({ count }) => {
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
    create: "Create tag",
    search: "Search in tags",
    total: "Results {{from}} to {{to}} of {{total}}",
    sort: {
      "name-asc": "Name (a → z)",
      "name-desc": "Name (z → a)",
      "order-asc": "Display order (lowest first)",
      "order-desc": "Display order (highest first)",
      "createdAt-asc": "Creation date (oldest first)",
      "createdAt-desc": "Creation date (recent first)",
      "updatedAt-asc": "Update date (oldest first)",
      "updatedAt-desc": "Update date (recent first)",
    },
    empty: {
      "no-item-title": "No tags yet",
      "no-item-content-create": "Start by creating your first tag {{create:by clicking here}}",
      "no-item-content": "There are no tags here for now.",
      "no-result-title": "No result found",
      "no-result-content": "We couldn't find any tag corresponding to your search.",
      "no-result-content-reset":
        "We couldn't find any tag corresponding to your search, try to {{reset:reset the search}}",
    },
  },
  fr: {
    create: "Créer un tag",
    search: "Rechercher dans les tags",
    total: "Résultats {{from}} à {{to}} sur {{total}}",
    sort: {
      "name-asc": "Nom (a → z)",
      "name-desc": "Nom (z → a)",
      "order-asc": "Ordre d'affichage (le plus bas en premier)",
      "order-desc": "Ordre d'affichage (le plus haut en premier)",
      "createdAt-asc": "Date de création (ancienne en premier)",
      "createdAt-desc": "Date de création (récent en premier)",
      "updatedAt-asc": "Date de mise à jour (ancienne en premier)",
      "updatedAt-desc": "Date de mise à jour (récente en premier)",
    },
    empty: {
      "no-item-title": "Aucun tag pour le moment",
      "no-item-content-create": "Commencez par créer votre première tag {{create:en cliquant ici}}",
      "no-item-content": "Il n'y a pas de tag ici pour le moment.",
      "no-result-title": "Aucun résultat trouvé",
      "no-result-content": "Nous n'avons pas trouvé de tag correspondant à votre recherche.",
      "no-result-content-reset":
        "Nous n'avons pas trouvé de tag correspondant à votre recherche, essayez de {{reset:réinitialiser la recherche}}",
    },
  },
  de: {
    create: "Tag erstellen",
    search: "In Tags suchen",
    total: "Ergebnisse {{from}} bis {{to}} von {{total}}",
    sort: {
      "name-asc": "Name (a → z)",
      "name-desc": "Name (z → a)",
      "order-asc": "Anzeigereihenfolge (am niedrigsten zuerst)",
      "order-desc": "Anzeigereihenfolge (am höchsten zuerst)",
      "createdAt-asc": "Erstellungsdatum (älteste zuerst)",
      "createdAt-desc": "Erstellungsdatum (neueste zuerst)",
      "updatedAt-asc": "Aktualisierungsdatum (älteste zuerst)",
      "updatedAt-desc": "Aktualisierungsdatum (neueste zuerst)",
    },
    empty: {
      "no-item-title": "Noch keine Tags",
      "no-item-content-create": "Beginnen Sie mit der Erstellung Ihrer ersten Tag {{create:hier klicken}}",
      "no-item-content": "Es gibt hier momentan keine Tags.",
      "no-result-title": "Kein Ergebnis gefunden",
      "no-result-content": "Wir konnten keinen Tag finden, die Ihrer Suche entspricht.",
      "no-result-content-reset":
        "Wir konnten keinen Tag finden, die Ihrer Suche entspricht, versuchen Sie {{reset:die Suche zurückzusetzen}}",
    },
  },
}
