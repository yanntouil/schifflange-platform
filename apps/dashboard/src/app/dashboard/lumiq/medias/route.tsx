import React from "react"
import { Route, Switch } from "wouter"
import Page from "./page"

/**
 * AdminMediasRoutes
 */
export const DashboardMediasRoutes: React.FC = () => {
  return (
    <Switch>
      <Route path="/">
        <Page />
      </Route>
      <Route path="/:folderId">{({ folderId }) => <Page folderId={folderId} />}</Route>
    </Switch>
  )
}
