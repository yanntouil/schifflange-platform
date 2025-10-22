import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { type Api } from "@services/dashboard"
import React from "react"
import { useFilteredOrganisations } from "../hooks/use-filtered-organisations"
import { useOrganisations } from "../organisations.context"
import { OrganisationsCards } from "./organisations.cards"
import { OrganisationsFilters } from "./organisations.filters"
import { OrganisationsTable } from "./organisations.table"

/**
 * Organisations
 */
export const Organisations: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { swr, createOrganisation, clear, selected, confirmDeleteSelection } = useOrganisations()

  const { organisations } = swr
  const { matchable, sortable, filterable, reset, filtered, prefixedKey, disableFilters } =
    useFilteredOrganisations(organisations)
  const [view, viewProps] = Dashboard.Toolbar.useView(`${prefixedKey}-organisations-view`, "row")

  const total = organisations.length
  const results = filtered.length

  const [pagination, paginate] = Ui.usePagination<Api.Organisation>(results, 1, 25)
  const paginatedOrganisations = paginate(filtered) as Api.Organisation[]

  return (
    <>
      <Dashboard.Toolbar.Root size='lg'>
        <Dashboard.Toolbar.Search {...matchable} placeholder={_("search")} />
        <Dashboard.Toolbar.Aside>
          <Dashboard.Toolbar.SortFromHook {...sortable} t={_.prefixed("sort")} />
          {disableFilters ? null : <OrganisationsFilters {...filterable} />}
          {/* {!hideCreate && (
            <Dashboard.Toolbar.Button onClick={() => createOrganisation()}>
              <Plus aria-hidden />
              <span>{_("create")}</span>
            </Dashboard.Toolbar.Button>
          )} */}
          <Dashboard.Toolbar.View view={view} setView={viewProps.setView} />
        </Dashboard.Toolbar.Aside>
      </Dashboard.Toolbar.Root>
      <Dashboard.Collection onPointerDownOutside={clear} view={view}>
        <Dashboard.Selection.Bar selected={selected} unselect={clear} delete={confirmDeleteSelection} />
        <Dashboard.Empty
          total={total}
          results={results}
          t={_.prefixed("empty")}
          create={createOrganisation}
          reset={reset}
          isLoading={swr.isLoading}
        >
          {view === "card" ? (
            <OrganisationsCards organisations={paginatedOrganisations} />
          ) : (
            <OrganisationsTable organisations={paginatedOrganisations} />
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
    create: "Create Organisation",
    sort: {
      "name-asc": "Name (a → z)",
      "name-desc": "Name (z → a)",
      "createdAt-asc": "Creation date (oldest first)",
      "createdAt-desc": "Creation date (recent first)",
      "updatedAt-asc": "Update date (oldest first)",
      "updatedAt-desc": "Update date (recent first)",
    },
    empty: {
      "no-item-title": "No organisations yet",
      "no-item-content-create": "Start by creating your first organisation {{create:by clicking here}}",
      "no-item-content": "There are no organisations here for now.",
      "no-result-title": "No result found",
      "no-result-content": "We couldn't find any organisation corresponding to your search.",
      "no-result-content-reset":
        "We couldn't find any organisation corresponding to your search, try to {{reset:reset the search}}",
    },
  },
  fr: {
    create: "Créer une organisation",
    sort: {
      "name-asc": "Nom (a → z)",
      "name-desc": "Nom (z → a)",
      "createdAt-asc": "Date de création (ancienne en premier)",
      "createdAt-desc": "Date de création (du plus récent au plus ancien)",
      "updatedAt-asc": "Date de mise à jour (du plus ancien au plus récent)",
      "updatedAt-desc": "Date de mise à jour (du plus récent au plus ancien)",
    },
    empty: {
      "no-item-title": "Aucune organisation trouvée",
      "no-item-content-create": "Commencez par créer votre première organisation {{create:en cliquant ici}}",
      "no-item-content": "Il n'y a pas d'organisation ici pour le moment.",
      "no-result-title": "Aucun résultat trouvé",
      "no-result-content": "Nous n'avons trouvé aucune organisation correspondant à votre recherche.",
      "no-result-content-reset":
        "Nous n'avons trouvé aucune organisation correspondant à votre recherche, essayez de {{reset:réinitialiser la recherche}}",
    },
  },
  de: {
    create: "Organisation erstellen",
    sort: {
      "name-asc": "Name (a → z)",
      "name-desc": "Name (z → a)",
      "createdAt-asc": "Erstellungsdatum (älteste zuerst)",
      "createdAt-desc": "Erstellungsdatum (neueste zuerst)",
      "updatedAt-asc": "Änderungsdatum (älteste zuerst)",
      "updatedAt-desc": "Änderungsdatum (neueste zuerst)",
    },
    empty: {
      "no-item-title": "Keine Organisationen gefunden",
      "no-item-content-create":
        "Beginnen Sie mit der Erstellung Ihrer ersten Organisation {{create:indem Sie hier klicken}}",
      "no-item-content": "Es gibt keine Organisationen hier für jetzt.",
      "no-result-title": "Kein Ergebnis gefunden",
      "no-result-content": "Wir konnten keine Organisation entsprechend Ihrer Suche finden.",
      "no-result-content-reset":
        "Wir konnten keine Organisation entsprechend Ihrer Suche finden, versuchen Sie es erneut {{reset:die Suche zurücksetzen}}",
    },
  },
}
