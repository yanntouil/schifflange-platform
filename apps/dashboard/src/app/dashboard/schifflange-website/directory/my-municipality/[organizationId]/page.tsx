import { Dashboard } from "@compo/dashboard"
import { DirectoryServiceProvider, Organisation, OrganisationProvider, SWRSafeOrganisation, useDirectoryService } from "@compo/directory"
import React from "react"
import routeToMyMunicipality from "../"
import routeToMyMunicipalityId from "./"

/**
 * my municipality detail page
 */
const Page: React.FC<{ swr: SWRSafeOrganisation }> = ({ swr }) => {
  const service = useDirectoryService()
  return (
    <Dashboard.Container>
      <DirectoryServiceProvider
        {...service}
        routesTo={{ ...service.routesTo, organizations: { list: routeToMyMunicipality, byId: routeToMyMunicipalityId } }}
      >
        <OrganisationProvider swr={swr}>
          <Organisation />
        </OrganisationProvider>
      </DirectoryServiceProvider>
    </Dashboard.Container>
  )
}

export default Page
