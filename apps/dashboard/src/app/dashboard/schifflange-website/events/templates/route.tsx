import { useWorkspace } from "@/features/workspaces"
import { service } from "@/services"
import { ContentItems } from "@compo/contents"
import { TemplatesServiceProvider } from "@compo/templates"
import { ContextualLanguageProvider, FloatingLanguageSwitcher } from "@compo/translations"
import { client } from "@contents/schifflange-website"
import React from "react"
import { Route, Switch } from "wouter"
import routeToTemplates from "."
import routeToTemplate, { RouteTemplateId } from "./[templateId]"
import Page from "./page"

export const RouteTemplates: React.FC = () => {
  const { workspace } = useWorkspace()
  return (
    <TemplatesServiceProvider
      service={service.workspaces.id(workspace.id).templates}
      serviceKey={`${workspace.id}-event-templates`}
      type="event"
      items={client.items as unknown as ContentItems}
      routeToTemplates={routeToTemplates}
      routeToTemplate={routeToTemplate}
    >
      <ContextualLanguageProvider persistedId={`${workspace.id}-languages`}>
        <FloatingLanguageSwitcher />
        <Switch>
          <Route path="/">
            <Page />
          </Route>
          <Route path="/:templateId">{({ templateId }) => <RouteTemplateId templateId={templateId} />}</Route>
        </Switch>
      </ContextualLanguageProvider>
    </TemplatesServiceProvider>
  )
}
