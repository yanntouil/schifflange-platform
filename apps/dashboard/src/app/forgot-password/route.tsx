import PublicLayout from "@/layouts/public"
import React from "react"
import { Route, Switch } from "wouter"
import { ForgotPasswordTokenRoute } from "./[token]"
import Page from "./page"

export const ForgotPasswordRoute: React.FC = () => {
  return (
    <PublicLayout>
      <Switch>
        <Route path="/">
          <Page />
        </Route>
        <ForgotPasswordTokenRoute />
      </Switch>
    </PublicLayout>
  )
}
