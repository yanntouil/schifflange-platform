import React from "react"
import { Route, Switch } from "wouter"
import { LumiqPagesIdRoute } from "./[pageId]"
import Page from "./page"
import { LumiqPagesStatsRoute } from "./stats"
import { LumiqTemplatesRoute } from "./templates"

export const LumiqPagesRoute: React.FC = () => {
  return (
    <Switch>
      <Route path="/">
        <Page />
      </Route>
      <Route path="/stats">
        <LumiqPagesStatsRoute />
      </Route>
      <Route path="/templates" nest>
        <LumiqTemplatesRoute />
      </Route>
      <Route path="/:pageId">{({ pageId }) => <LumiqPagesIdRoute pageId={pageId} />}</Route>
    </Switch>
  )
}
