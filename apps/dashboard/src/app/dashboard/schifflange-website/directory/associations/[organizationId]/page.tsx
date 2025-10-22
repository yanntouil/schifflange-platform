import { Dashboard } from "@compo/dashboard"
import { DirectoryServiceProvider, Organisation, OrganisationProvider, SWRSafeOrganisation, useDirectoryService } from "@compo/directory"
import React from "react"
import routeToAssociations from "../"
import routeToAssociationId from "./"

/**
 * association detail page
 */
const Page: React.FC<{ swr: SWRSafeOrganisation }> = ({ swr }) => {
  const service = useDirectoryService()
  return (
    <Dashboard.Container>
      <DirectoryServiceProvider
        {...service}
        organisationType="association"
        routesTo={{ ...service.routesTo, organizations: { list: routeToAssociations, byId: routeToAssociationId } }}
      >
        <OrganisationProvider swr={swr}>
          <Organisation />
        </OrganisationProvider>
      </DirectoryServiceProvider>
    </Dashboard.Container>
  )
}

export default Page
