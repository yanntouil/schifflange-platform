import { Dashboard } from "@compo/dashboard"
import { useTranslation } from "@compo/localize"
import { placeholder } from "@compo/utils"
import React from "react"
import useBreadcrumbs from "./breadcrumbs"
import { WorkspaceProvider } from "./context.provider"
import { useSwrWorkspace } from "./swr"
import { WorkspaceHeader } from "./workspace.header"
import { WorkspaceInvitations } from "./workspace.invitations"
import { WorkspaceLogs } from "./workspace.logs"
import { WorkspaceMembers } from "./workspace.members"

/**
 * Admin workspaces id page
 */
const Page: React.FC<{ workspaceId: string }> = ({ workspaceId }) => {
  const { _ } = useTranslation(dictionary)
  const breadcrumbs = useBreadcrumbs(workspaceId)
  const { workspace, swr } = useSwrWorkspace(workspaceId)
  Dashboard.usePage(breadcrumbs, _("title", { name: placeholder(workspace?.name, _("placeholder")) as string }))
  if (swr.isLoading) return <div>Loading...</div>
  if (swr.error || !workspace) return <div>Error: {swr.error?.message}</div>

  return (
    <WorkspaceProvider workspace={workspace} swr={swr}>
      <div className="flex flex-col gap-8">
        <WorkspaceHeader />
        <WorkspaceMembers />
        <WorkspaceInvitations />
        <WorkspaceLogs />
      </div>
    </WorkspaceProvider>
  )
}

export default Page

/**
 * translations
 */
const dictionary = {
  en: { title: "Workspace details {{name}}", placeholder: "Unnamed workspace" },
  fr: { title: "Détails de l'espace de travail {{name}}", placeholder: "Espace de travail sans nom" },
  de: { title: "Arbeitsbereich-Details {{name}}", placeholder: "Unbenannter Arbeitsbereich" },
}
