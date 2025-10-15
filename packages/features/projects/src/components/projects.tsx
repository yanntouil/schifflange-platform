import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { type Api } from "@services/dashboard"
import React from "react"
import { useFilteredProjects } from "../hooks"
import { useProjects } from "../projects.context"
import { ProjectsCards, ProjectsCardsSkeleton } from "./projects.cards"
import { ProjectsFilters } from "./projects.filters"
import { ProjectsTable } from "./projects.table"

/**
 * Projects
 * This component is used to manage and navigate between the projects list
 */
export const Projects: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { swr, createProject, clear, selected, confirmDeleteSelection } = useProjects()
  const { projects } = swr
  const { matchable, sortable, filterable, reset, filtered, prefixedKey } = useFilteredProjects(projects)

  const [view, viewProps] = Dashboard.Toolbar.useView(`${prefixedKey}-projects-view`, "row")
  const total = projects.length
  const results = filtered.length

  const [pagination, paginate] = Ui.usePagination<Api.ProjectWithRelations>(results, 1, 25)
  const paginatedProjects = paginate(filtered) as Api.ProjectWithRelations[]
  return (
    <>
      <Dashboard.Toolbar.Root size='lg'>
        <Dashboard.Toolbar.Search {...matchable} placeholder={_("search")} />
        <Dashboard.Toolbar.Aside>
          <Dashboard.Toolbar.SortFromHook {...sortable} t={_.prefixed("sort")} />
          <ProjectsFilters {...filterable} />
          <Dashboard.Toolbar.View view={view} setView={viewProps.setView} />
        </Dashboard.Toolbar.Aside>
      </Dashboard.Toolbar.Root>

      <Dashboard.Collection onPointerDownOutside={clear} view={view}>
        <Dashboard.Selection.Bar selected={selected} unselect={clear} delete={confirmDeleteSelection} />
        <Dashboard.Empty
          total={total}
          results={results}
          t={_.prefixed("empty")}
          create={createProject}
          reset={reset}
          isLoading={swr.isLoading}
        >
          {view === "card" ? (
            <ProjectsCards projects={paginatedProjects} />
          ) : (
            <ProjectsTable projects={paginatedProjects} />
          )}
        </Dashboard.Empty>

        {swr.isLoading && (view === "card" ? <ProjectsCardsSkeleton count={3} /> : <ProjectsTableSkeleton count={3} />)}

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
 * ProjectsTableSkeleton - Loading skeleton
 */
const ProjectsTableSkeleton: React.FC<{ count: number }> = ({ count }) => {
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
    search: "Search in projects",
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
      "no-item-title": "No projects yet",
      "no-item-content-create": "Start by creating your first project {{create:by clicking here}}",
      "no-item-content": "There are no projects here for now.",
      "no-result-title": "No result found",
      "no-result-content": "We couldn't find any project corresponding to your search.",
      "no-result-content-reset":
        "We couldn't find any project corresponding to your search, try to {{reset:reset the search}}",
    },
  },
  fr: {
    search: "Rechercher dans les projets",
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
      "no-item-title": "Aucun projet pour le moment",
      "no-item-content-create": "Commencez par créer votre premier projet {{create:en cliquant ici}}",
      "no-item-content": "Il n'y a pas de projet ici pour le moment.",
      "no-result-title": "Aucun résultat trouvé",
      "no-result-content": "Nous n'avons pas trouvé de projet correspondant à votre recherche.",
      "no-result-content-reset":
        "Nous n'avons pas trouvé de projet correspondant à votre recherche, essayez de {{reset:réinitialiser la recherche}}",
    },
  },
  de: {
    search: "In Projekten suchen",
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
      "no-item-title": "Noch keine Projekte",
      "no-item-content-create": "Beginnen Sie mit der Erstellung Ihres ersten Projekts {{create:hier klicken}}",
      "no-item-content": "Es gibt hier momentan keine Projekte.",
      "no-result-title": "Kein Ergebnis gefunden",
      "no-result-content": "Wir konnten kein Projekt finden, das Ihrer Suche entspricht.",
      "no-result-content-reset":
        "Wir konnten kein Projekt finden, das Ihrer Suche entspricht, versuchen Sie {{reset:die Suche zurückzusetzen}}",
    },
  },
}
