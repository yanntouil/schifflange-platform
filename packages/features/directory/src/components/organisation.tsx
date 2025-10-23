import React from "react"
import { OrganisationChildOrganisations } from "./organisation.child-organisations"
import { OrganisationContact } from "./organisation.contact"
import { OrganisationContacts } from "./organisation.contacts"
import { OrganisationDetails } from "./organisation.details"
import { OrganisationHeader } from "./organisation.header"

/**
 * Organisation
 */
export const Organisation: React.FC = () => {
  /*
  todo: 
  - add dialog to display contact details with related informations
  - add slection action on OrganisationContacts
  - add filter by isPrimary and isResponsible
  - in OrganisationChildOrganisations remove filter by a specific props
  */
  return (
    <>
      <OrganisationHeader />
      <OrganisationDetails />
      <OrganisationContact />
      <OrganisationChildOrganisations />
      <OrganisationContacts />
    </>
  )
}
