import { type Api } from "@services/dashboard"
import React from "react"
import { OrganisationContactsCard } from "./organisation.contacts.card"

/**
 * OrganisationContactsCards
 */
export const OrganisationContactsCards: React.FC<{ contactOrganisations: Api.ContactOrganisation[] }> = ({
  contactOrganisations,
}) => {
  return (
    <div className='grid grid-cols-1 gap-4 @xl/collection:grid-cols-2 @4xl/collection:grid-cols-3 @6xl/collection:grid-cols-4'>
      {contactOrganisations.map((contactOrganisation) => (
        <OrganisationContactsCard key={contactOrganisation.id} contactOrganisation={contactOrganisation} />
      ))}
    </div>
  )
}
