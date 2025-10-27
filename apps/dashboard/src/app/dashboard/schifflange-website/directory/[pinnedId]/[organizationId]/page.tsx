import { Dashboard } from "@compo/dashboard"
import { DirectoryServiceProvider, Organisation, OrganisationProvider, SWRSafeOrganisation, useDirectoryService } from "@compo/directory"
import React from "react"
import { useParams } from "wouter"
import routeToPinned from "../"
import routeToPinnedId from "./"

/**
 * pinned organisation detail page
 */
const Page: React.FC<{ swr: SWRSafeOrganisation }> = ({ swr }) => {
  const service = useDirectoryService()
  const { pinnedId } = useParams<{ pinnedId: string }>()
  return (
    <Dashboard.Container>
      <DirectoryServiceProvider
        {...service}
        routesTo={{ ...service.routesTo, organizations: { list: () => routeToPinned(pinnedId), byId: routeToPinnedId } }}
      >
        <OrganisationProvider swr={swr}>
          <Organisation />
        </OrganisationProvider>
      </DirectoryServiceProvider>
    </Dashboard.Container>
  )
}

export default Page
