import signInRouteTo from "@/app/sign-in"
import { useAuthStore } from "@/features/auth"
import { AuthAppProvider } from "@/layouts/auth/app-provider"
import Layout from "@/layouts/dashboard"
import { D } from "@compo/utils"
import React from "react"
import { Redirect, Route, Switch } from "wouter"
import dashboardRouteTo from "."
import Page from "./page"
import { DashboardSchifflangeWebsiteRoute } from "./schifflange-website"

export const DashboardRoute: React.FC = () => {
  const me = useAuthStore(D.prop("me"))
  const isInit = useAuthStore(D.prop("isInit"))
  const isAuthenticated = !!me
  if (!isInit) {
    return null
  }
  if (!isAuthenticated) {
    return <Redirect to={signInRouteTo()} />
  }

  return (
    <AuthAppProvider>
      <Switch>
        <Route path="/schifflange-website*" nest>
          <DashboardSchifflangeWebsiteRoute />
        </Route>
        <Route path="/">
          <Layout>
            <Page />
          </Layout>
        </Route>
        <Redirect to={dashboardRouteTo()} />
      </Switch>
    </AuthAppProvider>
  )
}
