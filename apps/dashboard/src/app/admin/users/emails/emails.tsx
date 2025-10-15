import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { D, flow } from "@compo/utils"
import React from "react"
import { useEmails } from "./context"
import { EmailsTable } from "./emails.table"
import { emailsStore, useEmailsStore } from "./store"
import { Toolbar } from "./toolbar"

const { setPage, setLimit } = emailsStore.actions
const { resetFilterBy, setSearch } = emailsStore.actions

/**
 * Admin users emails component
 */
export const Emails: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const page = useEmailsStore(flow(D.prop("query"), D.prop("page")))
  const limit = useEmailsStore(flow(D.prop("query"), D.prop("limit")))
  const { emails, metadata, swr } = useEmails()

  return (
    <Dashboard.Container>
      <Dashboard.Header>
        <Dashboard.Title level={1}>{_("title")}</Dashboard.Title>
        <Dashboard.Description>{_("description")}</Dashboard.Description>
      </Dashboard.Header>
      <div className="flex flex-col gap-8">
        <Toolbar />
        <Dashboard.Collection>
          <Dashboard.Empty
            total={metadata.total + 1} // force to never display
            results={metadata.total}
            t={_.prefixed("empty")}
            reset={() => {
              resetFilterBy()
              setSearch("")
            }}
            isLoading={swr.isLoading}
          >
            <EmailsTable emails={emails} />
          </Dashboard.Empty>
          <Dashboard.Pagination {...{ page, setPage, limit, setLimit, total: metadata.total }} />
        </Dashboard.Collection>
      </div>
    </Dashboard.Container>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Emails",
    description: "Display all email logs in the system",
    empty: {
      "no-result-title": "No result found",
      "no-result-content-reset": "We have not found any item corresponding to your search, try to {{reset:reset all filters}}",
    },
  },
  fr: {
    title: "Emails",
    description: "Affiche tous les emails dans le système",
    empty: {
      "no-result-title": "Aucun résultat trouvé",
      "no-result-content-reset":
        "Nous n'avons trouvé aucun élément correspondant à votre recherche, essayez de {{reset:réinitialiser tous les filtres}}",
    },
  },
  de: {
    title: "E-Mails",
    description: "Zeigt alle E-Mails im System an",
    empty: {
      "no-result-title": "Keine Ergebnisse gefunden",
      "no-result-content-reset":
        "Wir haben keine Elemente gefunden, die Ihrer Suche entsprechen. Versuchen Sie, {{reset:alle Filter zurückzusetzen}}",
    },
  },
}
