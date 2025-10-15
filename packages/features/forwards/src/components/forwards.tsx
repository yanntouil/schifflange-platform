import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { type Api } from "@services/dashboard"
import React from "react"
import { useForwards } from "../forwards.context"
import { useFilteredForwards } from "../hooks/use-filtered"
import { ForwardsTable } from "./forwards.table"

/**
 * Forwards
 * This component is used to manage and navigate between the forwards list
 */
export const Forwards: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { swr, createForward, clear, selected, confirmDeleteSelection } = useForwards()
  const { forwards } = swr
  const { matchable, sortable, reset, filtered } = useFilteredForwards(forwards)

  const total = forwards.length
  const results = filtered.length

  const [pagination, paginate] = Ui.usePagination<Api.Forward>(results, 1, 25)
  const paginatedForwards = paginate(filtered) as Api.Forward[]

  return (
    <Dashboard.Error
      fallbackRender={(props) => (
        <Dashboard.Trace {...props} title={_("render-error-title")} description={_("render-error-description")} />
      )}
    >
      <Dashboard.Toolbar.Root size='lg'>
        <Dashboard.Toolbar.Search {...matchable} placeholder={_("search")} />
        <Dashboard.Toolbar.Aside>
          <Dashboard.Toolbar.SortFromHook {...sortable} t={_.prefixed("sort")} />
        </Dashboard.Toolbar.Aside>
      </Dashboard.Toolbar.Root>

      <Dashboard.Collection onPointerDownOutside={clear}>
        <Dashboard.Selection.Bar selected={selected} unselect={clear} delete={confirmDeleteSelection} />
        <Dashboard.Empty
          total={total}
          results={results}
          t={_.prefixed("empty")}
          create={createForward}
          reset={reset}
          isLoading={swr.isLoading}
        >
          <ForwardsTable forwards={paginatedForwards} />
        </Dashboard.Empty>

        {swr.isLoading && <ForwardsTableSkeleton count={3} />}

        {results > 0 && (
          <div className='mt-4 flex flex-col items-center justify-between gap-x-6 pt-4 @2xl/collection:flex-row'>
            <p className='text-muted-foreground inline-flex h-9 shrink-0 items-center text-xs/relaxed'>
              {_("total", { from: pagination.from, to: pagination.to, total })}
            </p>
            <Ui.Pagination.Quick {...pagination} className='@2xl/collection:justify-end' size='sm' />
          </div>
        )}
      </Dashboard.Collection>
    </Dashboard.Error>
  )
}

/**
 * ForwardsTableSkeleton - Loading skeleton
 */
const ForwardsTableSkeleton: React.FC<{ count: number }> = ({ count }) => {
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
    "render-error-title": "Error while rendering redirects",
    "render-error-description":
      "An error occurred while rendering the redirects. You can see the error message below, try to fix it or contact the support.",
    search: "Search in redirects",
    total: "Results {{from}} to {{to}} of {{total}}",
    sort: {
      "title-asc": "Name (a → z)",
      "title-desc": "Name (z → a)",
      "path-asc": "Source path (a → z)",
      "path-desc": "Source path (z → a)",
      "updatedAt-asc": "Update date (oldest first)",
      "updatedAt-desc": "Update date (recent first)",
    },
    empty: {
      "no-item-title": "No redirects yet",
      "no-item-content-create": "Start by creating your first redirect {{create:by clicking here}}",
      "no-item-content": "There are no redirects here for now.",
      "no-result-title": "No result found",
      "no-result-content": "We couldn't find any redirect corresponding to your search.",
      "no-result-content-reset":
        "We couldn't find any redirect corresponding to your search, try to {{reset:reset the search}}",
    },
  },
  fr: {
    "render-error-title": "Erreur lors du rendu des redirections",
    "render-error-description":
      "Une erreur est survenue lors du rendu des redirections. Vous pouvez voir le message d'erreur ci-dessous, essayer de le réparer ou contacter l'assistance.",
    search: "Rechercher dans les redirections",
    total: "Résultats {{from}} à {{to}} sur {{total}}",
    sort: {
      "title-asc": "Nom (a → z)",
      "title-desc": "Nom (z → a)",
      "path-asc": "Chemin source (a → z)",
      "path-desc": "Chemin source (z → a)",
      "updatedAt-asc": "Date de mise à jour (ancienne en premier)",
      "updatedAt-desc": "Date de mise à jour (récente en premier)",
    },
    empty: {
      "no-item-title": "Aucune redirection pour le moment",
      "no-item-content-create": "Commencez par créer votre première redirection {{create:en cliquant ici}}",
      "no-item-content": "Il n'y a pas de redirection ici pour le moment.",
      "no-result-title": "Aucun résultat trouvé",
      "no-result-content": "Nous n'avons pas trouvé de redirection correspondant à votre recherche.",
      "no-result-content-reset":
        "Nous n'avons pas trouvé de redirection correspondant à votre recherche, essayez de {{reset:réinitialiser la recherche}}",
    },
  },
  de: {
    "render-error-title": "Fehler beim Rendern der Weiterleitungen",
    "render-error-description":
      "Ein Fehler ist beim Rendern der Weiterleitungen aufgetreten. Sie können die Fehlermeldung unten sehen, versuchen Sie, sie zu beheben oder wenden Sie sich an den Support.",
    search: "In Weiterleitungen suchen",
    total: "Ergebnisse {{from}} bis {{to}} von {{total}}",
    sort: {
      "title-asc": "Name (a → z)",
      "title-desc": "Name (z → a)",
      "path-asc": "Quellpfad (a → z)",
      "path-desc": "Quellpfad (z → a)",
      "updatedAt-asc": "Aktualisierungsdatum (älteste zuerst)",
      "updatedAt-desc": "Aktualisierungsdatum (neueste zuerst)",
    },
    empty: {
      "no-item-title": "Noch keine Weiterleitungen",
      "no-item-content-create": "Beginnen Sie mit der Erstellung Ihrer ersten Weiterleitung {{create:hier klicken}}",
      "no-item-content": "Hier gibt es momentan keine Weiterleitungen.",
      "no-result-title": "Kein Ergebnis gefunden",
      "no-result-content": "Wir konnten keine Weiterleitung finden, die Ihrer Suche entspricht.",
      "no-result-content-reset":
        "Wir konnten keine Weiterleitung finden, die Ihrer Suche entspricht, versuchen Sie {{reset:die Suche zurückzusetzen}}",
    },
  },
}
