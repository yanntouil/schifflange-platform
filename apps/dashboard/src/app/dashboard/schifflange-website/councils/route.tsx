import { useWorkspace } from "@/features/workspaces"
import { ContextualLanguageProvider, FloatingLanguageSwitcher } from "@compo/translations"
import React from "react"
import { Route, Switch } from "wouter"
import Page from "./page"

export const RouteCouncils: React.FC = () => {
  const { workspace } = useWorkspace()
  return (
    <ContextualLanguageProvider persistedId={`${workspace.id}-languages`}>
      <FloatingLanguageSwitcher />
      <Switch>
        <Route path="/">
          <Page />
        </Route>
      </Switch>
    </ContextualLanguageProvider>
  )
}
