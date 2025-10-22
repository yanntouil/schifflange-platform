import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { type Api } from "@services/dashboard"
import { Plus, SquareUser } from "lucide-react"
import React from "react"
import { useFilteredContactOrganisations } from "../hooks/use-filtered-contact-organisations"
import { useOrganisation } from "../organisation.context"
import { OrganisationContactsCards } from "./organisation.contacts.cards"
import { OrganisationContactsTable } from "./organisation.contacts.table"

/**
 * OrganisationContacts
 */
export const OrganisationContacts: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { addContact, swr } = useOrganisation()
  const { organisation } = swr
  const { contactOrganisations } = swr.organisation
  const { matchable, sortable, reset, filtered, prefixedKey } = useFilteredContactOrganisations(contactOrganisations)
  const [view, viewProps] = Dashboard.Toolbar.useView(`${prefixedKey}-view`, "row")
  const total = contactOrganisations.length
  const results = filtered.length
  const [pagination, paginate] = Ui.usePagination<Api.ContactOrganisation>(results, 1, 12)
  const paginatedContactOrganisations = paginate(filtered) as Api.ContactOrganisation[]

  return (
    <Ui.CollapsibleCard.Root id={`${organisation.id}-contacts`} defaultOpen={false}>
      <Ui.CollapsibleCard.Header>
        <div>
          <Ui.CollapsibleCard.Title level={2}>
            {_("title")}
            <span className='text-muted-foreground text-xs inline-flex items-center gap-1'>
              {total}
              <SquareUser className='size-3.5' aria-hidden />
            </span>
          </Ui.CollapsibleCard.Title>
          <Ui.Card.Description>{_("description")}</Ui.Card.Description>
        </div>
        <Ui.CollapsibleCard.Aside>
          <Ui.Button variant='ghost' size='xs' onClick={() => addContact()}>
            <Plus aria-hidden />
            {_("create")}
          </Ui.Button>
        </Ui.CollapsibleCard.Aside>
      </Ui.CollapsibleCard.Header>
      <Ui.CollapsibleCard.Content className='@container'>
        <div className='p-6 pt-2 flex flex-col gap-6'>
          <Dashboard.Toolbar.Root size='lg'>
            <Dashboard.Toolbar.Search {...matchable} placeholder={_("search")} />
            <Dashboard.Toolbar.Aside>
              <Dashboard.Toolbar.SortFromHook {...sortable} t={_.prefixed("sort")} />
              <Dashboard.Toolbar.View view={view} setView={viewProps.setView} />
            </Dashboard.Toolbar.Aside>
          </Dashboard.Toolbar.Root>
          <Dashboard.Collection view={view}>
            <Dashboard.Empty total={total} results={results} t={_.prefixed("empty")} create={addContact} reset={reset}>
              {view === "card" ? (
                <OrganisationContactsCards contactOrganisations={paginatedContactOrganisations} />
              ) : (
                <OrganisationContactsTable contactOrganisations={paginatedContactOrganisations} />
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
        </div>
      </Ui.CollapsibleCard.Content>
    </Ui.CollapsibleCard.Root>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Contacts",
    description: "Manage the contacts associated with this organisation.",
    search: "Search contacts...",
    create: "Add contact",
    sort: {
      "role-asc": "Role (a → z)",
      "role-desc": "Role (z → a)",
      "firstName-asc": "First name (a → z)",
      "firstName-desc": "First name (z → a)",
      "lastName-asc": "Last name (a → z)",
      "lastName-desc": "Last name (z → a)",
      "startDate-asc": "Start date (oldest first)",
      "startDate-desc": "Start date (recent first)",
      "order-asc": "Display order (ascending)",
      "order-desc": "Display order (descending)",
    },
    empty: {
      "no-item-title": "No contacts yet",
      "no-item-content-create": "Start by adding your first contact {{create:by clicking here}}",
      "no-item-content": "There are no contacts associated with this organisation yet.",
      "no-result-title": "No result found",
      "no-result-content": "We couldn't find any contact corresponding to your search.",
      "no-result-content-reset":
        "We couldn't find any contact corresponding to your search, try to {{reset:reset the search}}",
    },
  },
  fr: {
    title: "Contacts",
    description: "Gérer les contacts associés à cette organisation.",
    search: "Rechercher des contacts...",
    create: "Ajouter un contact",
    sort: {
      "role-asc": "Rôle (a → z)",
      "role-desc": "Rôle (z → a)",
      "firstName-asc": "Prénom (a → z)",
      "firstName-desc": "Prénom (z → a)",
      "lastName-asc": "Nom (a → z)",
      "lastName-desc": "Nom (z → a)",
      "startDate-asc": "Date d'entrée (ancienne en premier)",
      "startDate-desc": "Date d'entrée (récente en premier)",
      "order-asc": "Ordre d'affichage (croissant)",
      "order-desc": "Ordre d'affichage (décroissant)",
    },
    empty: {
      "no-item-title": "Aucun contact pour le moment",
      "no-item-content-create": "Commencez par ajouter votre premier contact {{create:en cliquant ici}}",
      "no-item-content": "Il n'y a pas encore de contact associé à cette organisation.",
      "no-result-title": "Aucun résultat trouvé",
      "no-result-content": "Nous n'avons trouvé aucun contact correspondant à votre recherche.",
      "no-result-content-reset":
        "Nous n'avons trouvé aucun contact correspondant à votre recherche, essayez de {{reset:réinitialiser la recherche}}",
    },
  },
  de: {
    title: "Kontakte",
    description: "Verwalten Sie die mit dieser Organisation verbundenen Kontakte.",
    search: "Kontakte durchsuchen...",
    create: "Kontakt hinzufügen",
    sort: {
      "role-asc": "Rolle (a → z)",
      "role-desc": "Rolle (z → a)",
      "firstName-asc": "Vorname (a → z)",
      "firstName-desc": "Vorname (z → a)",
      "lastName-asc": "Nachname (a → z)",
      "lastName-desc": "Nachname (z → a)",
      "startDate-asc": "Eintrittsdatum (älteste zuerst)",
      "startDate-desc": "Eintrittsdatum (neueste zuerst)",
      "order-asc": "Anzeigereihenfolge (aufsteigend)",
      "order-desc": "Anzeigereihenfolge (absteigend)",
    },
    empty: {
      "no-item-title": "Noch keine Kontakte",
      "no-item-content-create":
        "Beginnen Sie mit dem Hinzufügen Ihres ersten Kontakts {{create:indem Sie hier klicken}}",
      "no-item-content": "Es gibt noch keine Kontakte, die dieser Organisation zugeordnet sind.",
      "no-result-title": "Kein Ergebnis gefunden",
      "no-result-content": "Wir konnten keinen Kontakt entsprechend Ihrer Suche finden.",
      "no-result-content-reset":
        "Wir konnten keinen Kontakt entsprechend Ihrer Suche finden, versuchen Sie es erneut {{reset:die Suche zurücksetzen}}",
    },
  },
}
