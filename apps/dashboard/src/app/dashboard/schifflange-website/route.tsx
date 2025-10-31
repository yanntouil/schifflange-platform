import { Icon } from "@compo/ui"
import React, { lazy, Suspense } from "react"
import { Route, Switch } from "wouter"
import Layout from "./layout"
import Page from "./page"
import { DashboardServiceProvider } from "./service.provider"

// Imports dynamiques
const RoutePages = lazy(() => import("./pages").then((m) => ({ default: m.RoutePages })))
const RouteArticles = lazy(() => import("./articles").then((m) => ({ default: m.RouteArticles })))
const RouteEvents = lazy(() => import("./events").then((m) => ({ default: m.RouteEvents })))
const RouteMedias = lazy(() => import("./medias").then((m) => ({ default: m.RouteMedias })))
const RouteDirectory = lazy(() => import("./directory").then((m) => ({ default: m.RouteDirectory })))
const RouteLibraries = lazy(() => import("./libraries").then((m) => ({ default: m.RouteLibraries })))
const RouteSite = lazy(() => import("./site").then((m) => ({ default: m.RouteSite })))

export const DashboardSchifflangeWebsiteRoute: React.FC = () => {
  return (
    <DashboardServiceProvider>
      <Layout>
        <Suspense fallback={<Loading />}>
          <Switch>
            <Route path="/">
              <Page />
            </Route>
            <Route path="/pages*" nest>
              <RoutePages />
            </Route>
            <Route path="/articles*" nest>
              <RouteArticles />
            </Route>
            <Route path="/events*" nest>
              <RouteEvents />
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
        </Suspense>
      </Layout>
    </DashboardServiceProvider>
  )
}
const Loading: React.FC = () => {
  return (
    <div className="flex w-full grow items-center justify-center">
      <Icon.Loader variant="dots" className="size-10" />
    </div>
  )
}
