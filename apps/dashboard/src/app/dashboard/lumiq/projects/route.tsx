import { useWorkspace } from "@/features/workspaces"
import { ContextualLanguageProvider, FloatingLanguageSwitcher } from "@compo/translations"
import React from "react"
import { Route, Switch } from "wouter"
import { LumiqProjectsIdRoute } from "./[projectId]"
import { LumiqProjectsIdStepIdRoute } from "./[projectId]/[stepId]"
import { LumiqProjectsCategoriesRoute } from "./categories"
import Page from "./page"
import { LumiqProjectsStatsRoute } from "./stats"
import { LumiqProjectsTagsRoute } from "./tags"
import { LumiqTemplatesRoute } from "./templates"

export const LumiqProjectsRoute: React.FC = () => {
  const { workspace } = useWorkspace()
  return (
    <ContextualLanguageProvider persistedId={`${workspace.id}-languages`}>
      <FloatingLanguageSwitcher />
      <Switch>
        <Route path="/">
          <Page />
        </Route>
        <Route path="/categories">
          <LumiqProjectsCategoriesRoute />
        </Route>
        <Route path="/tags">
          <LumiqProjectsTagsRoute />
        </Route>
        <Route path="/templates" nest>
          <LumiqTemplatesRoute />
        </Route>
        <Route path="/stats">
          <LumiqProjectsStatsRoute />
        </Route>
        <Route path="/:projectId">{({ projectId }) => <LumiqProjectsIdRoute projectId={projectId} />}</Route>
        <Route path="/:projectId/:stepId">
          {({ projectId, stepId }) => <LumiqProjectsIdStepIdRoute projectId={projectId} stepId={stepId} />}
        </Route>
      </Switch>
    </ContextualLanguageProvider>
  )
}
