import { Dashboard } from "@compo/dashboard"
import { Organisation, OrganisationProvider, SWRSafeOrganisation } from "@compo/directory"
import React from "react"

/**
 * organization detail page
 */
const Page: React.FC<{ swr: SWRSafeOrganisation }> = ({ swr }) => {
  return (
    <Dashboard.Container>
      <OrganisationProvider swr={swr}>
        <Organisation />
      </OrganisationProvider>
    </Dashboard.Container>
  )
}

export default Page
