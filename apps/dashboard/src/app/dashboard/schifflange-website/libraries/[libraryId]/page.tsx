import { useWorkspace } from "@/features/workspaces"
import { Dashboard } from "@compo/dashboard"
import { Library, LibraryProvider, SWRSafeLibrary } from "@compo/libraries"
import React from "react"

/**
 * library detail page
 */
const Page: React.FC<{ swr: SWRSafeLibrary }> = ({ swr }) => {
  const { workspace } = useWorkspace()
  return (
    <Dashboard.Container>
      <LibraryProvider swr={swr} publishedUsers={workspace.members}>
        <Library />
      </LibraryProvider>
    </Dashboard.Container>
  )
}

export default Page
