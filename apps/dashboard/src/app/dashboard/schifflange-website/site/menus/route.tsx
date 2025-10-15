import React from "react"
import { Route, Switch } from "wouter"
import { RouteMenuId } from "./[menuId]"
import Page from "./page"

export const RouteMenus: React.FC = () => {
  return (
    <Switch>
      <Route path="/">
        <Page />
      </Route>
      <Route path="/:menuId">{({ menuId }) => <RouteMenuId menuId={menuId} />}</Route>
    </Switch>
  )
}
