import React from "react"
import { Route, Switch } from "wouter"
import { RoutePageId } from "./[pageId]"
import Page from "./page"
import { RouteStats } from "./stats"
import { RouteTemplates } from "./templates"

export const RoutePages: React.FC = () => {
  return (
    <Switch>
      <Route path="/">
        <Page />
      </Route>
      <Route path="/stats">
        <RouteStats />
      </Route>
      <Route path="/templates" nest>
        <RouteTemplates />
      </Route>
      <Route path="/:pageId">{({ pageId }) => <RoutePageId pageId={pageId} />}</Route>
    </Switch>
  )
}
