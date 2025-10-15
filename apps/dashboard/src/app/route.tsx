import { authStore, useAuthStore } from "@/features/auth"
import { D } from "@compo/utils"
import React from "react"
import { Redirect, Route, Router, Switch } from "wouter"
import { AdminRoute } from "./admin"
import { DashboardRoute, useDashboardRoute } from "./dashboard"
import { ForgotPasswordRoute } from "./forgot-password"
import { InvitationRoute } from "./invitation/[token]"
import Layout from "./layout"
import { PrivacyPolicyRoute } from "./privacy-policy"
import { RegisterRoute } from "./register"
import signInRouteTo, { SignInRoute } from "./sign-in"
import { TermsOfUseRoute } from "./terms-of-use"
import { TokenRoute } from "./token/[token]"

const { initStore } = authStore.actions

/**
 * Root route for the application
 */
export const RootRoute: React.FC = () => {
  const isInit = useAuthStore(D.prop("isInit"))
  // initialize application
  React.useEffect(() => {
    initStore()
  }, [])
  if (!isInit) return null // wait for the store to be initialized

  return (
    <Router>
      <Layout>
        <Switch>
          <Route path="/register*" nest>
            <RegisterRoute />
          </Route>
          <Route path="/sign-in*" nest>
            <SignInRoute />
          </Route>
          <Route path="/forgot-password*" nest>
            <ForgotPasswordRoute />
          </Route>
          <Route path="/privacy-policy*" nest>
            <PrivacyPolicyRoute />
          </Route>
          <Route path="/terms-of-use*" nest>
            <TermsOfUseRoute />
          </Route>
          <Route path="/token*" nest>
            <TokenRoute />
          </Route>
          <Route path="/invitation*" nest>
            <InvitationRoute />
          </Route>
          <Route path="/dashboard*" nest>
            <DashboardRoute />
          </Route>
          <Route path="/admin*" nest>
            <AdminRoute />
          </Route>
          <Route>
            <FallbackRoute />
          </Route>
        </Switch>
      </Layout>
    </Router>
  )
}

/**
 * FallbackRoot
 * Redirect to the root page if the user is authenticated
 */
const FallbackRoute: React.FC = () => {
  const [isAuthenticated, redirectRoute] = useDashboardRoute()
  if (isAuthenticated) {
    return <Redirect to={redirectRoute} />
  }
  return <Redirect to={signInRouteTo()} />
}
