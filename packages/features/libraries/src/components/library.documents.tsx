import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { Api } from "@services/dashboard"
import { Files, Plus } from "lucide-react"
import React from "react"
import { useFilteredDocuments } from "../hooks/use-filtered-documents"
import { useLibrary } from "../library.context"
import { LibraryDocumentsCards } from "./library.documents.cards"
import { LibraryDocumentsTable } from "./library.documents.table"

/**
 * LibraryDocuments
 * Component that displays documents using the LibraryDocuments component
 */
export const LibraryDocuments: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { createDocument } = useLibrary()
  const ctx = useLibrary()
  const { library } = ctx.swr
  const { documents } = library

  const baseLevel = 2

  const { matchable, sortable, reset, filtered, prefixedKey } = useFilteredDocuments(documents)
  const [view, viewProps] = Dashboard.Toolbar.useView(`${prefixedKey}-view`, "row")

  const total = documents.length
  const results = filtered.length

  const [pagination, paginate] = Ui.usePagination<Api.LibraryDocument>(results, 1, 12)
  const paginatedDocuments = paginate(filtered) as Api.LibraryDocument[]

  return (
    <Ui.CollapsibleCard.Root id={`${library.id}-documents`} defaultOpen={false}>
      <Ui.CollapsibleCard.Header>
        <div>
          <Ui.CollapsibleCard.Title level={baseLevel}>
            {_("title")}
            <span className='text-muted-foreground text-xs inline-flex items-center gap-1'>
              {total}
              <Files className='size-3.5' aria-hidden />
            </span>
          </Ui.CollapsibleCard.Title>
          <Ui.Card.Description>{_("description")}</Ui.Card.Description>
        </div>
        <Ui.CollapsibleCard.Aside>
          <Ui.Button variant='ghost' size='xs' onClick={() => createDocument()}>
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
            <Dashboard.Empty
              total={total}
              results={results}
              t={_.prefixed("empty")}
              create={createDocument}
              reset={reset}
            >
              {view === "card" ? (
                <LibraryDocumentsCards documents={paginatedDocuments} />
              ) : (
                <LibraryDocumentsTable documents={paginatedDocuments} />
              )}
            </Dashboard.Empty>
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
    title: "Documents",
    description: "Manage the documents associated with this library.",
    search: "Search documents...",
    create: "Add document",
    sort: {
      "title-asc": "Title (a → z)",
      "title-desc": "Title (z → a)",
      "createdAt-asc": "Created at (oldest first)",
      "createdAt-desc": "Created at (recent first)",
      "updatedAt-asc": "Updated at (oldest first)",
      "updatedAt-desc": "Updated at (recent first)",
    },
    empty: {
      "no-item-title": "No documents yet",
      "no-item-content-create": "Start by adding your first document {{create:by clicking here}}",
      "no-item-content": "There are no documents associated with this library yet.",
      "no-result-title": "No result found",
      "no-result-content": "We couldn't find any document corresponding to your search.",
      "no-result-content-reset":
        "We couldn't find any document corresponding to your search, try to {{reset:reset the search}}",
    },
  },
  fr: {
    title: "Documents",
    description: "Gérer les documents associés à cette bibliothèque.",
    search: "Rechercher des documents...",
    create: "Ajouter un document",
    sort: {
      "title-asc": "Titre (a → z)",
      "title-desc": "Titre (z → a)",
      "createdAt-asc": "Créé le (ancien en premier)",
      "createdAt-desc": "Créé le (récent en premier)",
      "updatedAt-asc": "Modifié le (ancien en premier)",
      "updatedAt-desc": "Modifié le (récent en premier)",
    },
    empty: {
      "no-item-title": "Aucun document pour le moment",
      "no-item-content-create": "Commencez par ajouter votre premier document {{create:en cliquant ici}}",
      "no-item-content": "Il n'y a pas encore de document associé à cette bibliothèque.",
      "no-result-title": "Aucun résultat trouvé",
      "no-result-content": "Nous n'avons trouvé aucun document correspondant à votre recherche.",
      "no-result-content-reset":
        "Nous n'avons trouvé aucun document correspondant à votre recherche, essayez de {{reset:réinitialiser la recherche}}",
    },
  },
  de: {
    title: "Dokumente",
    description: "Verwalten Sie die mit dieser Bibliothèque verbundenen Dokumente.",
    search: "Dokumente durchsuchen...",
    create: "Dokument hinzufügen",
    sort: {
      "title-asc": "Titel (a → z)",
      "title-desc": "Titel (z → a)",
      "createdAt-asc": "Erstellt am (älteste zuerst)",
      "createdAt-desc": "Erstellt am (neueste zuerst)",
      "updatedAt-asc": "Aktualisiert am (älteste zuerst)",
      "updatedAt-desc": "Aktualisiert am (neueste zuerst)",
    },
    empty: {
      "no-item-title": "Noch keine Dokumente",
      "no-item-content-create":
        "Beginnen Sie mit dem Hinzufügen Ihres ersten Dokuments {{create:indem Sie hier klicken}}",
      "no-item-content": "Es gibt noch keine Dokumente, die dieser Bibliothèque zugeordnet sind.",
      "no-result-title": "Kein Ergebnis gefunden",
      "no-result-content": "Wir konnten kein Dokument entsprechend Ihrer Suche finden.",
      "no-result-content-reset":
        "Wir konnten kein Dokument entsprechend Ihrer Suche finden, versuchen Sie es erneut {{reset:die Suche zurücksetzen}}",
    },
  },
}
