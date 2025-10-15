import { useWorkspace } from "@/features/workspaces"
import { ContextualLanguageProvider, FloatingLanguageSwitcher } from "@compo/translations"
import React from "react"
import { Route, Switch } from "wouter"
import { RouteArticleId } from "./[articleId]"
import { RouteCategories } from "./categories"
import Page from "./page"
import { RouteStats } from "./stats"
import { RouteTemplates } from "./templates"

export const RouteArticles: React.FC = () => {
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
        <Route path="/:articleId">{({ articleId }) => <RouteArticleId articleId={articleId} />}</Route>
      </Switch>
    </ContextualLanguageProvider>
  )
}
