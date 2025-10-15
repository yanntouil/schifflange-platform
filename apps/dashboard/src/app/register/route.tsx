import { useDashboardRoute } from "@/app/dashboard"
import PublicLayout from "@/layouts/public"
import React from "react"
import { Redirect, Route, Switch } from "wouter"
import { RegisterTokenRoute } from "./[token]"
import Page from "./page"

export const RegisterRoute: React.FC = () => {
  const [isAuthenticated, redirectRoute] = useDashboardRoute()
  if (isAuthenticated) {
    return <Redirect to={redirectRoute} />
  }
  return (
    <PublicLayout>
      <Switch>
        <Route path="/">
          <Page />
        </Route>
        <RegisterTokenRoute />
      </Switch>
    </PublicLayout>
  )
}
