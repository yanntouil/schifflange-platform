import { useWorkspace } from "@/features/workspaces"
import { ContextualLanguageProvider, FloatingLanguageSwitcher } from "@compo/translations"
import React from "react"
import { Route, Switch } from "wouter"
import { LumiqArticlesIdRoute } from "./[articleId]"
import { LumiqArticlesCategoriesRoute } from "./categories"
import Page from "./page"
import { LumiqArticlesStatsRoute } from "./stats"
import { LumiqTemplatesRoute } from "./templates"

export const LumiqArticlesRoute: React.FC = () => {
  const { workspace } = useWorkspace()
  return (
    <ContextualLanguageProvider persistedId={`${workspace.id}-languages`}>
      <FloatingLanguageSwitcher />
      <Switch>
        <Route path="/">
          <Page />
        </Route>
        <Route path="/categories">
          <LumiqArticlesCategoriesRoute />
        </Route>
        <Route path="/stats">
          <LumiqArticlesStatsRoute />
        </Route>
        <Route path="/templates" nest>
          <LumiqTemplatesRoute />
        </Route>
        <Route path="/:articleId">{({ articleId }) => <LumiqArticlesIdRoute articleId={articleId} />}</Route>
      </Switch>
    </ContextualLanguageProvider>
  )
}
