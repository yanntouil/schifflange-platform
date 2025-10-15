import { useAuthStore } from "@/features/auth"
import AdminLayout from "@/layouts/admin"
import { AuthAppProvider } from "@/layouts/auth/app-provider"
import { D } from "@compo/utils"
import React from "react"
import { Route, Switch, useLocation } from "wouter"
import { dashboardRootRouteTo } from "../dashboard"
import signInRouteTo from "../sign-in"
import Page from "./page"
import { AdminUsersRoute } from "./users"
import { AdminWorkspacesRoute } from "./workspaces"

export const AdminRoute: React.FC = () => {
  const me = useAuthStore(D.prop("me"))
  const isAuthenticated = !!me
  const isAdmin = me?.role === "admin" || me?.role === "superadmin"
  const [, navigate] = useLocation()
  // redirect to sign in if not authenticated
  if (!isAuthenticated) {
    navigate(signInRouteTo())
    return null
  }
  // redirect to dashboard if not admin
  if (!isAdmin) {
    navigate(dashboardRootRouteTo(me.workspace))
    return null
  }
  return (
    <AuthAppProvider>
      <AdminLayout>
        <Switch>
          <Route path="/users*" nest>
            <AdminUsersRoute />
          </Route>
          <Route path="/workspaces*" nest>
            <AdminWorkspacesRoute />
          </Route>
          <Route path="/">
            <Page />
          </Route>
        </Switch>
      </AdminLayout>
    </AuthAppProvider>
  )
}
