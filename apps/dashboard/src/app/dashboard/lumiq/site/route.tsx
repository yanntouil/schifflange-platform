import React from "react"
import { Route, Switch } from "wouter"
import { LumiqConfigRoute } from "./config"
import { LumiqForwardsRoute } from "./forwards"
import { LumiqMenusRoute } from "./menus"
import Page from "./page"
import { LumiqSitemapRoute } from "./sitemap"

export const LumiqSiteRoute: React.FC = () => {
  return (
    <Switch>
      <Route path="/">
        <Page />
      </Route>
      <Route path="/forwards*" nest>
        <LumiqForwardsRoute />
      </Route>
      <Route path="/menus*" nest>
        <LumiqMenusRoute />
      </Route>
      <Route path="/sitemap*" nest>
        <LumiqSitemapRoute />
      </Route>
      <Route path="/config*" nest>
        <LumiqConfigRoute />
      </Route>
    </Switch>
  )
}
