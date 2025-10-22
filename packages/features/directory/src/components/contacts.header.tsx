import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { Plus } from "lucide-react"
import React from "react"
import { useContacts } from "../contacts.context"

/**
 * ContactsHeader
 */
export const ContactsHeader: React.FC<{ hideCreate?: boolean }> = ({ hideCreate = false }) => {
  const { _ } = useTranslation(dictionary)
  const { createContact } = useContacts()
  return (
    <Dashboard.Header className='flex justify-between gap-8'>
      <div className='space-y-1.5'>
        <Dashboard.Title level={1}>{_("title")}</Dashboard.Title>
        <Dashboard.Description>{_("description")}</Dashboard.Description>
      </div>
      <Ui.Button variant='outline' icon size='lg' onClick={() => createContact()}>
        <Plus aria-hidden />
        <Ui.SrOnly>{_("create-contact")}</Ui.SrOnly>
      </Ui.Button>
    </Dashboard.Header>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Contacts",
    description: "Manage all contacts",
    "create-contact": "Create contact",
  },
  fr: {
    title: "Contacts",
    description: "Gérer toutes les contacts",
    "create-contact": "Créer un contact",
  },
  de: {
    title: "Kontakte",
    description: "Alle Kontakte verwalten",
    "create-contact": "Kontakt erstellen",
  },
}
