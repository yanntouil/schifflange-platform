import { authStore, useAuthStore } from "@/features/auth"
import { Icon } from "@compo/ui"
import { D } from "@compo/utils"
import React, { lazy, Suspense } from "react"
import { Redirect, Route, Router, Switch } from "wouter"
import { useDashboardRoute } from "./dashboard"
import Layout from "./layout"
import signInRouteTo from "./sign-in"

// Lazy imports
const AdminRoute = lazy(() => import("./admin").then((m) => ({ default: m.AdminRoute })))
const DashboardRoute = lazy(() => import("./dashboard").then((m) => ({ default: m.DashboardRoute })))
const ForgotPasswordRoute = lazy(() => import("./forgot-password").then((m) => ({ default: m.ForgotPasswordRoute })))
const InvitationRoute = lazy(() => import("./invitation/[token]").then((m) => ({ default: m.InvitationRoute })))
const PrivacyPolicyRoute = lazy(() => import("./privacy-policy").then((m) => ({ default: m.PrivacyPolicyRoute })))
const RegisterRoute = lazy(() => import("./register").then((m) => ({ default: m.RegisterRoute })))
const SignInRoute = lazy(() => import("./sign-in").then((m) => ({ default: m.SignInRoute })))
const TermsOfUseRoute = lazy(() => import("./terms-of-use").then((m) => ({ default: m.TermsOfUseRoute })))
const TestRoute = lazy(() => import("./test").then((m) => ({ default: m.default })))
const TokenRoute = lazy(() => import("./token/[token]").then((m) => ({ default: m.TokenRoute })))

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
  if (!isInit) return <Loading /> // wait for the store to be initialized

  return (
    <Router>
      <Layout>
        <Suspense fallback={<Loading />}>
          <Switch>
            <Route path="/test*" nest>
              <TestRoute />
            </Route>
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
        </Suspense>
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

/**
 * Loading
 * Loading component
 */
const Loading: React.FC = () => {
  return (
    <div className="flex h-screen w-full grow items-center justify-center">
      <Icon.Loader variant="dots" className="size-10" />
    </div>
  )
}
