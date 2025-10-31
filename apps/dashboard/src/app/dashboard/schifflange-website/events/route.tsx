import { useWorkspace } from "@/features/workspaces"
import { ContextualLanguageProvider, FloatingLanguageSwitcher } from "@compo/translations"
import React from "react"
import { Route, Switch } from "wouter"
import { RouteEventId } from "./[eventId]"
import { RouteCategories } from "./categories"
import Page from "./page"
import { RouteStats } from "./stats"
import { RouteTemplates } from "./templates"

export const RouteEvents: React.FC = () => {
  const { workspace } = useWorkspace()
  return (
    <ContextualLanguageProvider persistedId={`${workspace.id}-languages`}>
      <FloatingLanguageSwitcher />
      <Switch>
        <Route path="/">
          <Page />
        </Route>
        <Route path="/categories">
          <RouteCategories />
        </Route>
        <Route path="/stats">
          <RouteStats />
        </Route>
        <Route path="/templates" nest>
          <RouteTemplates />
        </Route>
        <Route path="/:eventId">{({ eventId }) => <RouteEventId eventId={eventId} />}</Route>
      </Switch>
    </ContextualLanguageProvider>
  )
}
