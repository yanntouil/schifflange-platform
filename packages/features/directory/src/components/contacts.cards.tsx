import { Dashboard } from "@compo/dashboard"
import { A } from "@compo/utils"
import { type Api } from "@services/dashboard"
import React from "react"
import { ContactsCard } from "./contacts.card"
/**
 * ContactsCards
 */
export const ContactsCards: React.FC<{ contacts: Api.Contact[] }> = ({ contacts }) => {
  return (
    <section className={Dashboard.collectionCards()}>
      {A.map(contacts, (contact) => (
        <ContactsCard key={contact.id} contact={contact} />
      ))}
    </section>
  )
}
