import React from "react"
import { Route, Switch } from "wouter"
import { RouteArticles } from "./articles"
import { RouteDirectory } from "./directory"
import Layout from "./layout"
import { RouteLibraries } from "./libraries"
import { RouteMedias } from "./medias"
import Page from "./page"
import { RoutePages } from "./pages"
import { DashboardServiceProvider } from "./service.provider"
import { RouteSite } from "./site"

/**
 * Dashboard Schifflange Website Route
 * This route is used to display the dashboard
 */
export const DashboardSchifflangeWebsiteRoute: React.FC = () => {
  return (
    <DashboardServiceProvider>
      <Layout>
        <Switch>
          <Route path="/">
            <Page />
          </Route>
          <Route path="/articles*" nest>
            <RouteArticles />
          </Route>
          <Route path="/pages*" nest>
            <RoutePages />
          </Route>
          <Route path="/medias*" nest>
            <RouteMedias />
          </Route>
          <Route path="/directory*" nest>
            <RouteDirectory />
          </Route>
          <Route path="/libraries*" nest>
            <RouteLibraries />
          </Route>
          <Route path="/site*" nest>
            <RouteSite />
          </Route>
        </Switch>
      </Layout>
    </DashboardServiceProvider>
  )
}
