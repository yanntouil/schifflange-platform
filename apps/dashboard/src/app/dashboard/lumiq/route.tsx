import React from "react"
import { Route, Switch } from "wouter"
import { LumiqArticlesRoute } from "./articles"
import Layout from "./layout"
import { DashboardMediasRoutes } from "./medias"
import Page from "./page"
import { LumiqPagesRoute } from "./pages"
import { LumiqProjectsRoute } from "./projects"
import { DashboardServiceProvider } from "./service.provider"
import { LumiqSiteRoute } from "./site"

/**
 * Dashboard Lumiq Route
 * This route is used to display the Lumiq dashboard
 */
export const DashboardLumiqRoute: React.FC = () => {
  return (
    <DashboardServiceProvider>
      <Layout>
        <Switch>
          <Route path="/">
            <Page />
          </Route>
          <Route path="/medias*" nest>
            <DashboardMediasRoutes />
          </Route>
          <Route path="/pages*" nest>
            <LumiqPagesRoute />
          </Route>
          <Route path="/articles*" nest>
            <LumiqArticlesRoute />
          </Route>
          <Route path="/projects*" nest>
            <LumiqProjectsRoute />
          </Route>
          <Route path="/site*" nest>
            <LumiqSiteRoute />
          </Route>
        </Switch>
      </Layout>
    </DashboardServiceProvider>
  )
}
