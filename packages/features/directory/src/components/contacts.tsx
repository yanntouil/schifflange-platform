import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { type Api } from "@services/dashboard"
import React from "react"
import { useContacts } from "../contacts.context"
import { useFilteredContacts } from "../hooks/use-filtered-contacts"
import { ContactsCards } from "./contacts.cards"
import { ContactsTable } from "./contacts.table"

/**
 * Contacts
 */
export const Contacts: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { swr, createContact, clear, selected, confirmDeleteSelection } = useContacts()
  const { contacts } = swr
  const { matchable, sortable, filterable, reset, filtered, prefixedKey } = useFilteredContacts(contacts)
  const [view, viewProps] = Dashboard.Toolbar.useView(`${prefixedKey}-contacts-view`, "row")
  const total = contacts.length
  const results = filtered.length
  const [pagination, paginate] = Ui.usePagination<Api.Contact>(results, 1, 25)
  const paginatedContacts = paginate(filtered) as Api.Contact[]
  return (
    <>
      <Dashboard.Toolbar.Root size='lg'>
        <Dashboard.Toolbar.Search {...matchable} placeholder={_("search")} />
        <Dashboard.Toolbar.Aside>
          <Dashboard.Toolbar.SortFromHook {...sortable} t={_.prefixed("sort")} />
          <Dashboard.Toolbar.View view={view} setView={viewProps.setView} />
        </Dashboard.Toolbar.Aside>
      </Dashboard.Toolbar.Root>
      <Dashboard.Collection onPointerDownOutside={clear} view={view}>
        <Dashboard.Selection.Bar selected={selected} unselect={clear} delete={confirmDeleteSelection} />
        <Dashboard.Empty
          total={total}
          results={results}
          t={_.prefixed("empty")}
          create={createContact}
          reset={reset}
          isLoading={swr.isLoading}
        >
          {view === "card" ? (
            <ContactsCards contacts={paginatedContacts} />
          ) : (
            <ContactsTable contacts={paginatedContacts} />
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
    search: "Search contacts...",
    create: "Create Contact",
    total: "Showing {{from}} to {{to}} of {{total}} contacts",
    sort: {
      "firstName-asc": "First name (a → z)",
      "firstName-desc": "First name (z → a)",
      "lastName-asc": "Last name (a → z)",
      "lastName-desc": "Last name (z → a)",
      "createdAt-asc": "Creation date (oldest first)",
      "createdAt-desc": "Creation date (recent first)",
      "updatedAt-asc": "Update date (oldest first)",
      "updatedAt-desc": "Update date (recent first)",
    },
    empty: {
      "no-item-title": "No contacts yet",
      "no-item-content-create": "Start by creating your first contact {{create:by clicking here}}",
      "no-item-content": "There are no contacts here for now.",
      "no-result-title": "No result found",
      "no-result-content": "We couldn't find any contact corresponding to your search.",
      "no-result-content-reset":
        "We couldn't find any contact corresponding to your search, try to {{reset:reset the search}}",
    },
  },
  fr: {
    search: "Rechercher des contacts...",
    create: "Créer un contact",
    total: "Affichage de {{from}} à {{to}} sur {{total}} contacts",
    sort: {
      "firstName-asc": "Prénom (a → z)",
      "firstName-desc": "Prénom (z → a)",
      "lastName-asc": "Nom (a → z)",
      "lastName-desc": "Nom (z → a)",
      "createdAt-asc": "Date de création (ancienne en premier)",
      "createdAt-desc": "Date de création (récente en premier)",
      "updatedAt-asc": "Date de mise à jour (ancienne en premier)",
      "updatedAt-desc": "Date de mise à jour (récente en premier)",
    },
    empty: {
      "no-item-title": "Aucun contact pour le moment",
      "no-item-content-create": "Commencez par créer votre premier contact {{create:en cliquant ici}}",
      "no-item-content": "Il n'y a pas de contact ici pour le moment.",
      "no-result-title": "Aucun résultat trouvé",
      "no-result-content": "Nous n'avons trouvé aucun contact correspondant à votre recherche.",
      "no-result-content-reset":
        "Nous n'avons trouvé aucun contact correspondant à votre recherche, essayez de {{reset:réinitialiser la recherche}}",
    },
  },
  de: {
    search: "Kontakte durchsuchen...",
    create: "Kontakt erstellen",
    total: "Zeige {{from}} bis {{to}} von {{total}} Kontakten",
    sort: {
      "firstName-asc": "Vorname (a → z)",
      "firstName-desc": "Vorname (z → a)",
      "lastName-asc": "Nachname (a → z)",
      "lastName-desc": "Nachname (z → a)",
      "createdAt-asc": "Erstellungsdatum (älteste zuerst)",
      "createdAt-desc": "Erstellungsdatum (neueste zuerst)",
      "updatedAt-asc": "Änderungsdatum (älteste zuerst)",
      "updatedAt-desc": "Änderungsdatum (neueste zuerst)",
    },
    empty: {
      "no-item-title": "Noch keine Kontakte",
      "no-item-content-create":
        "Beginnen Sie mit der Erstellung Ihres ersten Kontakts {{create:indem Sie hier klicken}}",
      "no-item-content": "Es gibt keine Kontakte hier für jetzt.",
      "no-result-title": "Kein Ergebnis gefunden",
      "no-result-content": "Wir konnten keinen Kontakt entsprechend Ihrer Suche finden.",
      "no-result-content-reset":
        "Wir konnten keinen Kontakt entsprechend Ihrer Suche finden, versuchen Sie es erneut {{reset:die Suche zurücksetzen}}",
    },
  },
}
