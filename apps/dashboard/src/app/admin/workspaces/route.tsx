import React from "react"
import { Route, Switch } from "wouter"
import { AdminWorkspacesIdRoute } from "./[workspaceId]"
import { AdminWorkspacesLogsRoute } from "./logs"
import Page from "./page"
import { AdminWorkspacesThemesRoute } from "./themes"

export const AdminWorkspacesRoute: React.FC = () => {
  return (
    <Switch>
      <Route path="/logs">
        <AdminWorkspacesLogsRoute />
      </Route>
      <Route path="/themes">
        <AdminWorkspacesThemesRoute />
      </Route>
      <Route path="/:workspaceId">{({ workspaceId }) => <AdminWorkspacesIdRoute workspaceId={workspaceId} />}</Route>
      <Route path="/">
        <Page />
      </Route>
    </Switch>
  )
}
