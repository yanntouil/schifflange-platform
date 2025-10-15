import React from "react"
import { Route, Switch } from "wouter"
import { AdminUsersIdRoute } from "./[userId]"
import { AdminUsersEmailsRoute } from "./emails"
import { AdminUsersLogsRoute } from "./logs"
import Page from "./page"
import { AdminUsersStatsRoute } from "./stats"

export const AdminUsersRoute: React.FC = () => {
  return (
    <Switch>
      <Route path="/">
        <Page />
      </Route>
      <Route path="/logs">
        <AdminUsersLogsRoute />
      </Route>
      <Route path="/emails">
        <AdminUsersEmailsRoute />
      </Route>
      <Route path="/stats">
        <AdminUsersStatsRoute />
      </Route>
      <Route path="/:userId">{({ userId }) => <AdminUsersIdRoute userId={userId} />}</Route>
    </Switch>
  )
}
