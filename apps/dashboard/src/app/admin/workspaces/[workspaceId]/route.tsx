import React from "react"
import Page from "./page"

export const AdminWorkspacesIdRoute: React.FC<{ workspaceId: string }> = ({ workspaceId }) => {
  return <Page workspaceId={workspaceId} />
}
