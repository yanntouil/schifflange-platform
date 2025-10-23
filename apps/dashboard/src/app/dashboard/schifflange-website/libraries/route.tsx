import { useWorkspace } from "@/features/workspaces"
import { ContextualLanguageProvider, FloatingLanguageSwitcher } from "@compo/translations"
import React from "react"
import { Route, Switch } from "wouter"
import { RouteLibraryId } from "./[libraryId]/route"
import Page from "./page"

export const RouteLibraries: React.FC = () => {
  const { workspace } = useWorkspace()
  return (
    <ContextualLanguageProvider persistedId={`${workspace.id}-languages`}>
      <FloatingLanguageSwitcher />
      <Switch>
        <Route path="/">
          <Page />
        </Route>
        <Route path="/:libraryId">{({ libraryId }) => <RouteLibraryId libraryId={libraryId} />}</Route>
      </Switch>
    </ContextualLanguageProvider>
  )
}
