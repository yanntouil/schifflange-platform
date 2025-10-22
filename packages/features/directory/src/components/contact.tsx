import React from "react"
import { ContactContact } from "./contact.contact"
import { ContactDetails } from "./contact.details"
import { ContactHeader } from "./contact.header"
import { ContactOrganisations } from "./contact.organisations"

/**
 * Contact
 */
export const Contact: React.FC = () => {
  /*
  todo:
  - add ContactOrganisations list with cards showing role in each organisation
  - add filter by isPrimary and isResponsible
  - add ability to navigate to organisation from ContactOrganisations
  */
  return (
    <>
      <ContactHeader />
      <ContactDetails />
      <ContactContact />
      <ContactOrganisations />
    </>
  )
}
