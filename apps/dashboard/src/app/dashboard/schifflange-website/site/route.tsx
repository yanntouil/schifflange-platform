import React from "react"
import { Route, Switch } from "wouter"
import { RouteConfig } from "./config"
import { RouteForwards } from "./forwards"
import { RouteMenus } from "./menus"
import Page from "./page"
import { RouteSitemap } from "./sitemap"

export const RouteSite: React.FC = () => {
  return (
    <Switch>
      <Route path="/">
        <Page />
      </Route>
      <Route path="/forwards*" nest>
        <RouteForwards />
      </Route>
      <Route path="/menus*" nest>
        <RouteMenus />
      </Route>
      <Route path="/sitemap*" nest>
        <RouteSitemap />
      </Route>
      <Route path="/config*" nest>
        <RouteConfig />
      </Route>
    </Switch>
  )
}
