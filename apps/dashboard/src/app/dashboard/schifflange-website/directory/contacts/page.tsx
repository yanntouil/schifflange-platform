import { Dashboard } from "@compo/dashboard"
import { Contacts, ContactsHeader, ContactsProvider, useSwrContacts } from "@compo/directory"
import { useTranslation } from "@compo/localize"
import React from "react"
import useBreadcrumbs from "./breadcrumbs"

/**
 * contacts page
 */
const Page: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const breadcrumbs = useBreadcrumbs()
  Dashboard.usePage(breadcrumbs, _("title"))
  const swr = useSwrContacts()
  return (
    <Dashboard.Container>
      <ContactsProvider swr={swr}>
        <ContactsHeader />
        <Contacts />
      </ContactsProvider>
    </Dashboard.Container>
  )
}

export default Page

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Contacts",
  },
  fr: {
    title: "Contacts",
  },
  de: {
    title: "Kontakte",
  },
}
