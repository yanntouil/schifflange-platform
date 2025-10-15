import React from "react"
import { Route, Switch } from "wouter"
import { LumiqMenusIdRoute } from "./[menuId]"
import Page from "./page"

export const LumiqMenusRoute: React.FC = () => {
  return (
    <Switch>
      <Route path="/">
        <Page />
      </Route>
      <Route path="/:menuId">{({ menuId }) => <LumiqMenusIdRoute menuId={menuId} />}</Route>
    </Switch>
  )
}
